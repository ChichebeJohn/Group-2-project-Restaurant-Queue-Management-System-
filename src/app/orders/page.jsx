"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./Orders.module.css"; // Create this CSS module with your styles

export default function OrderPage() {
  const [cart, setCart] = useState([]);
  const router = useRouter();

  // Load the order from sessionStorage and group duplicates by meal id
  useEffect(() => {
    const storedCart = sessionStorage.getItem("currentOrder");
    if (storedCart) {
      const items = JSON.parse(storedCart);
      // Group by meal id (assumes each meal has a unique id)
      const grouped = items.reduce((acc, item) => {
        if (acc[item.id]) {
          acc[item.id].quantity += 1;
        } else {
          // Start with quantity = 1
          acc[item.id] = { ...item, quantity: 1 };
        }
        return acc;
      }, {});
      setCart(Object.values(grouped));
    }
  }, []);

  // Increase quantity for a meal
  const handleIncrease = (mealId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === mealId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Decrease quantity for a meal; remove if quantity reaches 0
  const handleDecrease = (mealId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === mealId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Helper: Calculate total price for an item
  const getTotalPrice = (item) => item.price * item.quantity;

  // Helper: Calculate total prep time.
  // Assumes item.prep_time is a string like "3 mins"
  const getTotalPrepTime = (item) => {
    const baseTime = parseInt(item.prep_time);
    return baseTime * item.quantity;
  };

  // Update sessionStorage when cart changes (optional)
  useEffect(() => {
    sessionStorage.setItem("currentOrder", JSON.stringify(cart));
  }, [cart]);

  return (
    <div className={styles.orderPageWrapper}>
      <h1>Your Order</h1>
      {cart.length === 0 ? (
        <p>Your order is empty.</p>
      ) : (
        <div className={styles.orderItems}>
          {cart.map((item) => (
            <div key={item.id} className={styles.orderItem}>
              <img src={item.image_url} alt={item.name} className={styles.orderImage} />
              <div className={styles.orderDetails}>
                <h3>{item.name}</h3>
                <p>Price: ₦{item.price}</p>
                <p>Total Price: ₦{getTotalPrice(item)}</p>
                <p>
                  Prep Time: {item.prep_time} each | Total: {getTotalPrepTime(item)} mins
                </p>
                <div className={styles.quantityControls}>
                  <button onClick={() => handleDecrease(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleIncrease(item.id)}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <button onClick={() => router.push("/checkout")} className={styles.checkoutButton}>
        Place Order To Join Queue
      </button>
    </div>
  );
}
