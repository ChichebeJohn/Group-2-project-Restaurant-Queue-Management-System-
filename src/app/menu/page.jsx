"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./Menu.module.css";
import SearchBar from "./components/SearchBar";
import { Pinyon_Script } from "next/font/google";
import SideBar from "./components/SideBar";
import { useCart } from "../../context/CartContext";
import useLocalStorage from "../../hooks/useLocalStorage"; // adjust the path as needed

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
  const [favoriteMessage, setFavoriteMessage] = useState("");
  // Use the custom hook for favorites. It initializes to an empty array.
  const [favorites, setFavorites] = useLocalStorage("favorites", []);
  const router = useRouter();
  const { addToCart } = useCart();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetch("/api/menu")
      .then((res) => res.json())
      .then((data) => {
        setCategories([{ id: 0, name: "All" }, ...data.categories]);
        setMeals(data.meals);
      });
  }, []);

  const filteredMeals = meals.filter((meal) => {
    const matchesCategory =
      selectedCategory === "All" ||
      meal.category_id === categories.find((c) => c.name === selectedCategory)?.id;
    const matchesSearch = meal.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Check if a meal is favorited
  const isFavorite = (mealId) => favorites.some((fav) => fav.id === mealId);

  // Toggle favorite state for a meal using the custom hook
  const toggleFavorite = (meal) => {
    let updatedFavs;
    if (isFavorite(meal.id)) {
      updatedFavs = favorites.filter((fav) => fav.id !== meal.id);
      setFavoriteMessage("Removed from Favorite!");
    } else {
      updatedFavs = [...favorites, meal];
      setFavoriteMessage("Added to Favorite!");
    }
    setFavorites(updatedFavs);
    setTimeout(() => setFavoriteMessage(""), 2000);
  };

  // Handle add to order (cart)
  const handleAddToOrder = (meal) => {
    addToCart(meal);
    setOrderMessage("Added to Order!");
    setTimeout(() => setOrderMessage(""), 2000);
  };
  

  return (
    <div className={styles.menuWrapper}>
      <SideBar />
      <div className={styles.menuPage}>
        {/* Search Bar */}
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
        {orderMessage && (
          <div className={styles.orderMessage}>{orderMessage}</div>
        )}
        {favoriteMessage && (
          <div className={styles.favoriteMessage}>{favoriteMessage}</div>
        )}
        <div className={styles.menuContainer}>
          <h2>Menu</h2>
          {/* Category Filters */}
          <div className={styles.categoryFilters}>
            {categories.map((category) => (
              <button
                key={category.id}
                className={selectedCategory === category.name ? styles.active : undefined}
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
                          {/* Heart icon positioned at top-right */}
                          <img
                            src={isFavorite(meal.id) ? "/heart_icon_red.png" : "/heart_icon.png"}
                            alt="Favorite Icon"
                            className={styles.heartIcon}
                            onClick={() => toggleFavorite(meal)}
                          />
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
                    <img
                      src={isFavorite(meal.id) ? "/heart_icon_red.png" : "/heart_icon.png"}
                      alt="Favorite Icon"
                      className={styles.heartIcon}
                      onClick={() => toggleFavorite(meal)}
                    />
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
