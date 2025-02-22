"use client";
import { useState, useEffect } from "react";
import styles from "./Menu.module.css";
import { Pinyon_Script } from "next/font/google";
import SearchBar from "./components/SearchBar";

const pinyonScript = Pinyon_Script({
  weight: "400",
  subsets: ["latin"],
});

export default function MenuPage() {
  const [categories, setCategories] = useState([]);
  const [meals, setMeals] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderMessage, setOrderMessage] = useState("");

  useEffect(() => {
    // Retrieve the user info from sessionStorage (saved during login)
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Fetch menu data from your API
    fetch("/api/menu")
      .then((res) => res.json())
      .then((data) => {
        // Assuming data.categories is an array of category objects
        setCategories([{ id: 0, name: "All" }, ...data.categories]);
        setMeals(data.meals);
      });
  }, []);

  // Filter meals by selected category and search query
  const filteredMeals = meals.filter((meal) => {
    const matchesCategory =
      selectedCategory === "All" ||
      meal.category_id ===
        categories.find((c) => c.name === selectedCategory)?.id;
    const matchesSearch = meal.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Function to handle adding a meal to the order (cart)
  const handleAddToOrder = (meal) => {
    // Retrieve any existing order from sessionStorage, or initialize an empty array
    const currentOrder = JSON.parse(sessionStorage.getItem("currentOrder") || "[]");

    // Check if the meal is already in the order (using its unique id)
    const existingIndex = currentOrder.findIndex((item) => item.id === meal.id);
    if (existingIndex !== -1) {
      // If it exists, increment the quantity
      currentOrder[existingIndex].quantity = (currentOrder[existingIndex].quantity || 1) + 1;
    } else {
      // Otherwise, add the meal with quantity = 1
      currentOrder.push({ ...meal, quantity: 1 });
    }
    sessionStorage.setItem("currentOrder", JSON.stringify(currentOrder));
    setOrderMessage("Added to Order!");
    // Clear the message after 2 seconds
    setTimeout(() => {
      setOrderMessage("");
    }, 2000);
  };

  return (
    <div className={styles.menuWrapper}>
      <div className={styles.sideNavContainer}>
        <p className={`${styles.businessName} ${pinyonScript.className}`}>
          Highway-Bistro
        </p>
        <div className={styles.divider}></div>
        {/* Side navigation bar */}
        <div className={styles.sideNav}>
          <a href="./menu" className={styles.active}>
            <img src="/menu_icon.png" alt="menu" className={styles.Icon} />
            Menu
          </a>
          <a href="./orders">
            <img src="/order_icon.png" alt="order" className={styles.Icon} />
            Order
          </a>
          <a href="./favorites">
            <img src="/favorite_icon.png" alt="favorite" className={styles.Icon} />
            Favorites
          </a>
          <a href="./queue">
            <img src="/queue_icon.png" alt="queue" className={styles.Icon} />
            Queue
          </a>
        </div>
      </div>

      <div className={styles.menuPage}>
        {/* Search bar */}
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className={styles.welcomeUser}>
          <h2 className={pinyonScript.className} style={{ fontSize: "30px" }}>
            Hi {user ? user.firstName : "Guest"}!
          </h2>
          <p>
            Enjoy the superiority of our services with <br />
            the quality digital experience
          </p>
        </div>
        {/* Display temporary order message */}
        {orderMessage && (
          <div className={styles.orderMessage}>{orderMessage}</div>
        )}
        <div className={styles.menuContainer}>
          <h2>Menu</h2>
          {/* Category Filters */}
          <div className={styles.categoryFilters}>
            {categories.map((category) => (
              <button
                key={category.id}
                className={
                  selectedCategory === category.name ? styles.active : undefined
                }
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Display Meals Grouped by Category */}
          {selectedCategory === "All" ? (
            categories
              .filter((category) => category.id !== 0)
              .map((category) => {
                const mealsInCategory = filteredMeals.filter(
                  (meal) => meal.category_id === category.id
                );
                if (mealsInCategory.length === 0) return null;
                return (
                  <div key={category.id} style={{ marginBottom: "30px" }}>
                    <h2 style={{ paddingBottom: "10px" }}>{category.name}</h2>
                    <div className={styles.mealsGrid}>
                      {mealsInCategory.map((meal) => (
                        <div key={meal.id} className={styles.mealCard}>
                          <img src={meal.image_url} alt={meal.name} />
                          <h3>{meal.name}</h3>
                          <p>₦{meal.price}</p>
                          <p>Prep Time: {meal.prep_time}</p>
                          <button onClick={() => handleAddToOrder(meal)}>
                            Add to Order
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
          ) : (
            <div>
              <h2>{selectedCategory}</h2>
              <div className={styles.mealsGrid}>
                {filteredMeals.map((meal) => (
                  <div key={meal.id} className={styles.mealCard}>
                    <img src={meal.image_url} alt={meal.name} />
                    <h3>{meal.name}</h3>
                    <p>₦{meal.price}</p>
                    <p>Prep Time: {meal.prep_time}</p>
                    <button onClick={() => handleAddToOrder(meal)}>
                      Add to Order
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
