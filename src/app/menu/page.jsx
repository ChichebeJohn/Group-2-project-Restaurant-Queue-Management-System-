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
      meal.category_id === categories.find((c) => c.name === selectedCategory)?.id;
    const matchesSearch = meal.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={styles.menuWrapper}>
      <div className={styles.sideNavContainer}>
        <p className={`${styles.businessName} ${pinyonScript.className}`}>
          Highway-Bistro
        </p>
        <div className={styles.divider}></div>
        {/* Side navigation bar */}
        <div className={styles.sideNav}>
          <a href="./menu">Menu</a>
          <a href="./orders">Order</a>
          <a href="./favorites">Favorites</a>
          <a href="./queue">Queue</a>
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
            // For "All", group meals by each category (excluding the artificial "All" option)
            categories
              .filter((category) => category.id !== 0)
              .map((category) => {
                const mealsInCategory = filteredMeals.filter(
                  (meal) => meal.category_id === category.id
                );
                // Only display the header if there are meals in this category (after filtering)
                if (mealsInCategory.length === 0) return null;
                return (
                  <div key={category.id} style={{ marginBottom: "30px" }}>
                    <h2 style={{paddingBottom:"10px"}}>{category.name}</h2>
                    <div className={styles.mealsGrid}>
                      {mealsInCategory.map((meal) => (
                        <div key={meal.id} className={styles.mealCard}>
                          <img src={meal.image_url} alt={meal.name} />
                          <h3>{meal.name}</h3>
                          <p>₦{meal.price}</p>
                          <p>Prep Time: {meal.prep_time}</p>
                          <button>Add to Order</button>
                          {/* <button>❤️</button> */}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
          ) : (
            // If a specific category is selected, display that category header and its meals
            <div>
              <h2>{selectedCategory}</h2>
              <div className={styles.mealsGrid}>
                {filteredMeals.map((meal) => (
                  <div key={meal.id} className={styles.mealCard}>
                    <img src={meal.image_url} alt={meal.name} />
                    <h3>{meal.name}</h3>
                    <p>₦{meal.price}</p>
                    <p>Prep Time: {meal.prep_time}</p>
                    <button>Add to Order</button>
                    {/* <button>❤️</button> */}
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
