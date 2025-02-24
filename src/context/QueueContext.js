"use client";
import { createContext, useContext, useState, useEffect } from "react";

const QueueContext = createContext();

export function QueueProvider({ children }) {
  const [queue, setQueue] = useState([]);
  const [firstOrderTimer, setFirstOrderTimer] = useState(0); // in seconds for first order
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const res = await fetch("/api/queue");
        const data = await res.json();
        setQueue(data);
        if (data.length > 0 && data[0].remainingTime !== undefined && firstOrderTimer === 0) {
          setFirstOrderTimer(data[0].remainingTime);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching queue:", error);
      }
    };

    fetchQueue();
    const interval = setInterval(fetchQueue, 1000);
    return () => clearInterval(interval);
  }, [firstOrderTimer]);

  return (
    <QueueContext.Provider value={{ queue, firstOrderTimer, setFirstOrderTimer, loading }}>
      {children}
    </QueueContext.Provider>
  );
}

export function useQueue() {
  return useContext(QueueContext);
}
