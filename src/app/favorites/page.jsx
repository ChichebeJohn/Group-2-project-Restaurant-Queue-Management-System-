import React from "react";
import styles from "./Favorites.module.css";

export default function Favorites() {
  return (
    <div className={styles.favoritesContainer}>
      <h1>Your Favorites</h1>
      <p>Here are the menu items you’ve marked as favorites.</p>
      {/* Render favorite items here */}
    </div>
  );
}
