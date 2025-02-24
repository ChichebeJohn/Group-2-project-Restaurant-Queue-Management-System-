"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../Auth.module.css";
import { Pinyon_Script } from "next/font/google";

const pinyonScript = Pinyon_Script({
  weight: "400",
  subsets: ["latin"],
});

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (!res.ok) return setError(data.error);

    alert("Account created successfully!");
    router.push("/auth/login"); // Navigate to login after successful signup.
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authContainer}>
        <h1 className={`${styles.businessName} ${pinyonScript.className}`}>
          Highway Bistro
        </h1>
        <h2>Sign Up</h2>
        <p className={styles.text}>Sign up to view menu</p>
        {error && <p className={styles.error}>{error}</p>}
        <form className={styles.authForm} onSubmit={handleSignup}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            required
            onChange={handleChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            required
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
          />
          <div style={{ marginBottom: "1rem" }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              onChange={handleChange}
              style={{ width: "100%" }}
            />
          </div>
          {/* Single show password toggle placed between the two password fields */}
          <div style={{ marginBottom: "1rem", textAlign: "right" }}>
            <label className={styles.showPasswordSignup}>
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />{" "}
              
            </label>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              onChange={handleChange}
              style={{ width: "100%" }}
            />
          </div>
          <button type="submit">Sign Up</button>
        </form>
        <p>
          Already have an account? <Link href="/auth/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
