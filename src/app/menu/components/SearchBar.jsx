import React from "react";
import styles from "./SearchBar.module.css";

export default function SearchBar({ searchQuery, setSearchQuery }) {
  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className={styles.searchContainer}>
    <img src="/search_icon.png" alt="Search Icon" className={styles.searchIcon} />
    <input
      type="text"
      placeholder="Search your favorite delicacy..."
      className={styles.searchInput}
      value={searchQuery}
      onChange={handleChange}
    />
  </div>
  
  );
}
