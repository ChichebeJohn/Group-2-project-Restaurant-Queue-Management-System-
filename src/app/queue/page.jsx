import React from "react";
import styles from "./Queue.module.css";

export default function Queue() {
  return (
    <div className={styles.queueContainer}>
      <h1>Order Queue</h1>
      <p>Your current queue position: <strong>#12</strong></p>
      <p>Estimated waiting time: <strong>15 minutes</strong></p>
      <p>Track your order status in real time.</p>
      {/* Add additional tracking functionality as needed */}
    </div>
  );
}
