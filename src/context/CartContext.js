"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("currentOrder");
    if (storedCart) {
      try {
        const parsed = JSON.parse(storedCart);
        if (Array.isArray(parsed)) {
          setCart(parsed);
        }
      } catch (error) {
        console.error("Error parsing cart:", error);
      }
    }
  }, []);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("currentOrder", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (meal) => {
    setCart((prevCart) => {
      const index = prevCart.findIndex((item) => item.id === meal.id);
      if (index !== -1) {
        const updated = [...prevCart];
        updated[index].quantity = (updated[index].quantity || 1) + 1;
        return updated;
      }
      return [...prevCart, { ...meal, quantity: 1 }];
    });
  };

  const increaseQuantity = (mealId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === mealId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (mealId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === mealId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const deleteItem = (mealId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== mealId));
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, increaseQuantity, decreaseQuantity, deleteItem }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
