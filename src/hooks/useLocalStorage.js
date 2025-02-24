import { useState, useEffect } from "react";

export default function useLocalStorage(key, initialValue) {
  // State to store our value
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading localStorage key “" + key + "”: ", error);
      return initialValue;
    }
  });

  // Update localStorage whenever the storedValue changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error("Error setting localStorage key “" + key + "”: ", error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
