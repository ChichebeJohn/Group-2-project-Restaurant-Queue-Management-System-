"use client";
import { useRouter } from "next/navigation";
import styles from "./Orders.module.css"; // Your CSS module for styling
import SideBar from "../menu/components/SideBar";
import { useCart } from "../../context/CartContext"; // Use the shared cart context
import Image from "next/image";

export default function OrderPage() {
  const router = useRouter();
  const { cart, increaseQuantity, decreaseQuantity, deleteItem } = useCart();

  const getTotalPrice = (item) => item.price * item.quantity;
  const getTotalPrepTime = (item) => {
    const baseTime = parseInt(item.prep_time);
    return baseTime * item.quantity;
  };

  // Calculate the total prep time (in minutes) for display
  const calculateTotalPrepTime = () => {
    return cart.reduce((acc, item) => acc + getTotalPrepTime(item), 0);
  };

  // Place order: calculate total prep time in seconds and send to backend
  const placeOrder = async () => {
    const storedUser = localStorage.getItem("user");
    const userEmail = storedUser ? JSON.parse(storedUser).email : "";
    if (!userEmail) {
      console.error("User email not found.");
      return;
    }

    // Calculate total prep time in seconds (prep_time is in minutes)
    const totalPrepTimeSec = cart.reduce((acc, item) => {
      const prep = parseInt(item.prep_time);
      if (isNaN(prep)) {
        console.error("Invalid prep time for item:", item);
      }
      return acc + (prep || 0) * item.quantity * 60;
    }, 0);

    console.log("Total Prep Time (seconds):", totalPrepTimeSec);

    try {
      const res = await fetch("/api/queue/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, userEmail, totalPrepTime: totalPrepTimeSec }),
      });
      if (res.ok) {
        router.push("/queue");
      } else {
        const errorText = await res.text();
        console.error("Error placing order to queue:", errorText);
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <SideBar />
      <div className={styles.orderPageWrapper}>
        <h1>Order</h1>
        {cart.length === 0 ? (
          <>
            <p>No order has been placed.</p>
            <Image src="/nothing_here.png" alt="Empty Cart" width={500} height={400} />
          </>
        ) : (
          <>
            <div className={styles.orderItems}>
              {cart.map((item) => (
                <div key={item.id} className={styles.orderItem}>
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className={styles.orderImage}
                  />
                  <div className={styles.orderDetails}>
                    <h3>{item.name}</h3>
                    <p>Price: ₦{item.price}</p>
                    <p>Total Price: ₦{getTotalPrice(item)}</p>
                    <p>
                      Prep Time: {item.prep_time} each | Total: {getTotalPrepTime(item)} mins
                    </p>
                    <div className={styles.quantityControls}>
                      <button onClick={() => decreaseQuantity(item.id)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => increaseQuantity(item.id)}>+</button>
                      <button onClick={() => deleteItem(item.id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.totalPrepTime}>
              <p>Total Preparation Time: {calculateTotalPrepTime()} mins</p>
            </div>
          </>
        )}
        {cart.length > 0 && (
          <button onClick={placeOrder} className={styles.checkoutButton}>
            Place Order To Join Queue
          </button>
        )}
      </div>
    </div>
  );
}
