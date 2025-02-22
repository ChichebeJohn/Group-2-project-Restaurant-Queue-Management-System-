import React from "react";
import styles from "./Orders.module.css";

export default function Orders() {
  return (
    <div className={styles.ordersContainer}>
      <h1>Your Orders</h1>
      <p>View your order history and details here.</p>
      {/* Render orders list or details */}
    </div>
  );
}
