"use client";

import React from "react";
import styles from "./SideBar.module.css";
import { Pinyon_Script } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";

const pinyonScript = Pinyon_Script({
  weight: "400",
  subsets: ["latin"],
});

export default function SideBar() {
  const pathname = usePathname();
  const isActive = (path) => pathname === path;

  return (
    <div className={styles.sideNavContainer}>
      <p className={`${styles.businessName} ${pinyonScript.className}`}>
        Highway-Bistro
      </p>
      <div className={styles.divider}></div>
      <div className={styles.sideNav}>
        <Link href="/menu" className={isActive("/menu") ? styles.active : ""}>
          <img src="/menu_icon.png" alt="menu" className={styles.Icon} />
          Menu
        </Link>
        <Link href="/orders" className={isActive("/orders") ? styles.active : ""}>
          <img src="/order_icon.png" alt="order" className={styles.Icon} />
          Order
        </Link>
        <Link href="/favorites" className={isActive("/favorites") ? styles.active : ""}>
          <img src="/favorite_icon.png" alt="favorite" className={styles.Icon} />
          Favorites
        </Link>
        <Link href="/queue" className={isActive("/queue") ? styles.active : ""}>
          <img src="/queue_icon.png" alt="queue" className={styles.Icon} />
          Queue
        </Link>
      </div>
    </div>
  );
}
