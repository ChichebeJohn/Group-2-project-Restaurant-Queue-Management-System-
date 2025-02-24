"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./Queue.module.css"; // Your CSS module for styling
import SideBar from "../menu/components/SideBar";
import Image from "next/image";

export default function QueuePage() {
  const [globalQueue, setGlobalQueue] = useState([]);
  const [firstOrderTimer, setFirstOrderTimer] = useState(0); // in seconds for the first order
  const [userOrder, setUserOrder] = useState(null); // logged-in user's earliest active order
  const [userPosition, setUserPosition] = useState(null); // user's position (1-indexed)
  const [waitingTime, setWaitingTime] = useState(0); // in seconds for non-first orders
  const [orderComplete, setOrderComplete] = useState(false);
  const [notificationPlayed, setNotificationPlayed] = useState(false);
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");

  // Get the logged-in user's email from localStorage (once)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserEmail(user.email);
    }
  }, []);

  // Poll the API every second for real-time queue updates
  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const res = await fetch("/api/queue");
        const data = await res.json(); // data is sorted FIFO and includes remainingTime for the first order
        setGlobalQueue(data);

        // Compute logged-in user's position (case-insensitive comparison)
        let pos = -1;
        if (userEmail) {
          pos = data.findIndex(
            (order) => order.email.toLowerCase() === userEmail.toLowerCase()
          );
        }
        
        // Update firstOrderTimer if not first
        if (data.length > 0 && data[0].remainingTime !== null && pos !== 0) {
          setFirstOrderTimer(data[0].remainingTime);
        }
        
        // Update user's order and position
        if (userEmail) {
          if (pos !== -1) {
            setUserOrder(data[pos]);
            setUserPosition(pos + 1);
          } else {
            setUserOrder(null);
            setUserPosition(null);
            setOrderComplete(true);
          }
        }
      } catch (error) {
        console.error("Error fetching queue:", error);
      }
    };

    fetchQueue();
    const pollInterval = setInterval(fetchQueue, 1000);
    return () => clearInterval(pollInterval);
  }, [userEmail]);

  // Live countdown for first order
  useEffect(() => {
    if (userPosition === 1 && firstOrderTimer > 0) {
      const countdownInterval = setInterval(() => {
        setFirstOrderTimer((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime <= 0) {
            clearInterval(countdownInterval);
            leaveQueue(); // remove order when time elapses
            return 0;
          }
          return newTime;
        });
      }, 1000);
      return () => clearInterval(countdownInterval);
    }
  }, [firstOrderTimer, userPosition]);

  // Compute waiting time for non-first orders
  useEffect(() => {
    if (globalQueue.length && userEmail) {
      const pos = globalQueue.findIndex(
        (order) => order.email.toLowerCase() === userEmail.toLowerCase()
      );
      if (pos > 0) {
        let waitSec = firstOrderTimer;
        for (let i = 1; i < pos; i++) {
          waitSec += globalQueue[i].totalPrepTime * 60; // totalPrepTime is in minutes
        }
        setWaitingTime(waitSec);
      } else {
        setWaitingTime(firstOrderTimer);
      }
    }
  }, [globalQueue, firstOrderTimer, userEmail]);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s} (${seconds} sec)`;
  };

  const leaveQueue = async () => {
    try {
      const res = await fetch("/api/queue/leave", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail }),
      });
      if (res.ok) {
        setOrderComplete(true);
      } else {
        console.error("Error leaving queue");
      }
    } catch (error) {
      console.error("Error leaving queue:", error);
    }
  };

  return (
    <div className={styles.queueWrapper}>
      <SideBar />
      <div className={styles.queuePage}>
        <h1>My Queue Position</h1>
        {orderComplete ? (
          <div className={styles.orderComplete}>
            <h2>Order Complete!</h2>
            <p>Your order has been served.</p>
          </div>
        ) : userOrder ? (
          <div className={styles.queueItem}>
            <h2>Position: {userPosition}</h2>
            <Image src="/time_icon.png" alt="Time" width={200} height={200} />
            <p>Total Prep Time: {userOrder.totalPrepTime} mins remaining</p>
            {userPosition === 1 ? (
             <>
             <p>
               Time Left:{" "}
               {firstOrderTimer > 0
                 ? formatTime(firstOrderTimer)
                 : formatTime(userOrder.totalPrepTime * 60 - 1)}
             </p>
             <Image
               src="/order_on_the_way.png"
               alt="Your order is coming"
               width={600}
               height={450}
             />
           </>
            ) : (
              <>
                <p>Waiting Time: {formatTime(waitingTime)}</p>
                <Image
                  src="/order_on_the_way.png"
                  alt="Your order is coming"
                  width={200}
                  height={200}
                />
              </>
            )}
          </div>
        ) : (
          <p>You have no active order in the queue.</p>
        )}
      </div>
    </div>
  );
}
