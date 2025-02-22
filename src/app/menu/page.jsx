import React from "react";
import SearchBar from "./components/SearchBar";
import styles from "./Menu.module.css";

export default function Menu() {
  return (
    <div className={styles.menuContainer}>
      <h1>Menu</h1>
      <SearchBar />
      <ul className={styles.menuList}>
        <li>Menu Item 1</li>
        <li>Menu Item 2</li>
        <li>Menu Item 3</li>
        {/* Map over your menu data to render items */}
      </ul>
    </div>
  );
}
