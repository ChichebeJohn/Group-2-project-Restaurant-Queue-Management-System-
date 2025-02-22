import React from "react";
import styles from "./SearchBar.module.css";

export default function SearchBar() {
  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder="Search menu items..."
        className={styles.searchInput}
      />
      <button className={styles.searchButton}>Search</button>
    </div>
  );
}
