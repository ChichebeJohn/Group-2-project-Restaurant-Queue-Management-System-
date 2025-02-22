"use client";
import { useState, useEffect } from "react";
import styles from "./Queue.module.css";

export default function Queue() {
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    const fetchQueue = async () => {
      const res = await fetch("/api/orders/queue");
      const data = await res.json();
      setQueue(data);
    };

    fetchQueue();
    const interval = setInterval(fetchQueue, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setQueue((prevQueue) => {
        return prevQueue.map((order, index) => {
          if (index === 0 && order.totalPrepTime > 0) {
            return { ...order, totalPrepTime: order.totalPrepTime - 1 };
          }
          return order;
        }).filter(order => order.totalPrepTime > 0);
      });
    }, 1000);
  
    return () => clearInterval(interval);
  }, []);
  

  return (
    <div className={styles.queueContainer}>
      <h1>Current Queue</h1>
      {queue.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul>
          {queue.map((order) => (
            <li key={order.email}>
              <strong>Position:</strong> {order.position} <br />
              <strong>Meal:</strong> {order.meal} <br />
              <strong>Quantity:</strong> {order.quantity} <br />
              <strong>Total Prep Time:</strong> {order.totalPrepTime} mins <br />
              <strong>Waiting Time:</strong> {order.waitingTime} mins
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
