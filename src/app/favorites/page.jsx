"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./Favorites.module.css"; // Adjust styles as needed
import SideBar from "../menu/components/SideBar";
import { useCart } from "../../context/CartContext"; // Import CartContext hook
import Image from "next/image";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [favOrderMessage, setFavOrderMessage] = useState("");
  const router = useRouter();
  const { addToCart } = useCart(); // Use the global cart

  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavs = localStorage.getItem("favorites");
    if (storedFavs) {
      try {
        const parsedFavs = JSON.parse(storedFavs);
        if (Array.isArray(parsedFavs)) {
          setFavorites(parsedFavs);
        }
      } catch (error) {
        console.error("Error parsing favorites:", error);
      }
    }
  }, []);

  // Handle adding a favorite meal to the order using CartContext
  const handleAddToOrder = (meal) => {
    addToCart(meal);
    setFavOrderMessage("Added to Order!");
    setTimeout(() => setFavOrderMessage(""), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <SideBar />
      <div className={styles.favoritesPageWrapper}>
        <h1>Your Favorites</h1>
        {favOrderMessage && (
          <div className={styles.favOrderMessage}>{favOrderMessage}</div>
        )}
        {favorites.length === 0 ? (
          <>
          <p>You have no favorite items yet.</p>
          <Image src={"/nothing_here.png" } alt="Empty Favorites" width={500} height={400}/>
          </>
        ) : (
          <div className={styles.favoritesGrid}>
            {favorites.map((meal) => (
              <div key={meal.id} className={styles.favMealCard}>
                <img
                  src={meal.image_url}
                  alt={meal.name}
                  className={styles.favMealImage}
                />
                <h3>{meal.name}</h3>
                <p>₦{meal.price}</p>
                <button onClick={() => handleAddToOrder(meal)}>
                  Add to Order
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
