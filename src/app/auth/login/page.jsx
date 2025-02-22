"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../Auth.module.css";
import { Pinyon_Script } from "next/font/google";

const pinyonScript = Pinyon_Script({
  weight: "400",
  subsets: ["latin"],
});

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) return setError(data.error);

    if (rememberMe) localStorage.setItem("rememberedEmail", email);
    else localStorage.removeItem("rememberedEmail");

    alert("Login successful!");
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authContainer}>
        <h1 className={`${styles.businessName} ${pinyonScript.className}`}>Highway Bistro</h1>
        <h2>Login</h2>
        <p className={styles.text}>Sign in to view menu</p>
        {error && <p className={styles.error}>{error}</p>}
        <form className={styles.authForm} onSubmit={handleLogin}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
          <label className={styles.rememberMe}>
            <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} className={styles.rememberMe} />
            Remember me
          </label>
          <button type="submit">Sign in</button>
        </form>
        <p>Don't have an account? <Link href="/auth/signup">Create an account→ </Link></p>
      </div>
    </div>
  );
}
