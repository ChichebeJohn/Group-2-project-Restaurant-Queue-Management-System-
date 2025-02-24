"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../Auth.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

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

    // Store user info in localStorage
    localStorage.setItem("user", JSON.stringify(data.user));

    if (rememberMe) localStorage.setItem("rememberedEmail", email);
    else localStorage.removeItem("rememberedEmail");

    router.push("/menu"); // Redirect to menu page
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authContainer}>
        <h1 className={styles.businessName}>Highway Bistro</h1>
        <h2>Login</h2>
        <p className={styles.text}>Sign in to view the menu</p>
        {error && <p className={styles.error}>{error}</p>}
        <form className={styles.authForm} onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <div style={{ position: "relative", marginBottom: "1rem" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              style={{ width: "100%" }}
            />
<label className={styles.showPasswordLabel}>
  <input
    type="checkbox"
    checked={showPassword}
    onChange={() => setShowPassword(!showPassword)}
  />{" "}
  {/* Show */}
</label>

          </div>
          <label className={styles.rememberMe}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            Remember me
          </label>
          <button type="submit">Sign in</button>
        </form>
        <p>
          Don't have an account?{" "}
          <Link href="/auth/signup">Create an account→</Link>
        </p>
      </div>
    </div>
  );
}
