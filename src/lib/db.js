import Database from "better-sqlite3";

const db = new Database("restaurant.db");

// 1. Create users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT,
    lastName TEXT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`);

// 2. Create orders table
db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    meal TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    prepTime INTEGER NOT NULL, -- stored as number (minutes)
    orderTime DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (email) REFERENCES users(email)
  )
`);

// 3. Create categories table
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  )
`);

// 4. Create meals table with prep_time stored as an INTEGER (minutes)
db.exec(`
  CREATE TABLE IF NOT EXISTS meals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    prep_time INTEGER NOT NULL,  -- stored as number (minutes)
    image_url TEXT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
  )
`);

// 5. Create queue table for waiting time management
//    - total_prep_time is stored in seconds.
db.exec(`
  CREATE TABLE IF NOT EXISTS queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    total_prep_time INTEGER NOT NULL,  -- full waiting time in seconds
    position INTEGER NOT NULL,
    order_time DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// 6. Insert default categories (if they don't already exist)
const insertCategory = db.prepare(`
  INSERT OR IGNORE INTO categories (id, name) VALUES (?, ?)
`);

insertCategory.run(1, "Sandwich");
insertCategory.run(2, "Rice");
insertCategory.run(3, "Spaghetti & Noodles");
insertCategory.run(4, "Taco, Burrito & Shawarma");

// 7. Insert default meals (if they don't already exist)
//    Use numeric values for prep_time (in minutes)
const insertMeal = db.prepare(`
  INSERT OR IGNORE INTO meals (id, category_id, name, price, prep_time, image_url)
  VALUES (?, ?, ?, ?, ?, ?)
`);

// Sandwiches (category_id = 1)
insertMeal.run(1, 1, "Bacon, Lettuce, Tomato", 1500, 3, "/images/bacon.jpg");
insertMeal.run(2, 1, "Egg Salad Sandwich", 2500, 2, "/images/egg_salad.jpg");
insertMeal.run(3, 1, "Avocado Sandwich", 3500, 4, "/images/avocado_sandwich.jpg");
insertMeal.run(4, 1, "Club Sandwich", 1500, 1, "/images/club_sandwich.jpg");
insertMeal.run(5, 1, "Grilled Cheese", 1500, 2, "/images/grilled_cheese.jpg");

// Rice (category_id = 2)
insertMeal.run(6, 2, "Chicken Fried Rice", 6500, 1, "/images/chicken_fried_rice.jpg");
insertMeal.run(7, 2, "Fried Rice", 3000, 2, "/images/fried_rice.jpg");
insertMeal.run(8, 2, "Rice and Tomato Stew", 7000, 2, "/images/rice_tomato_stew.jpg");
insertMeal.run(9, 2, "Jollof Rice", 1500, 1, "/images/jollof_rice.jpg");
insertMeal.run(10, 2, "Tofu Rice Bowl", 1500, 2, "/images/tofu_rice_bowl.jpg");

// Spaghetti & Noodles (category_id = 3)
insertMeal.run(11, 3, "Spaghetti Alfredo", 1500, 3, "/images/spaghetti_alfredo.jpg");
insertMeal.run(12, 3, "Spaghetti with Meatballs", 1500, 2, "/images/spaghetti_meatballs.jpg");
insertMeal.run(13, 3, "Noodles with Chilli", 1500, 5, "/images/noodles_chilli.jpg");
insertMeal.run(14, 3, "Spaghetti Carbonara", 1500, 4, "/images/spaghetti_carbonara.jpg");
insertMeal.run(15, 3, "Noodles with Egg", 1500, 5, "/images/noodles_egg.jpg");

// Taco, Burrito & Shawarma (category_id = 4)
insertMeal.run(16, 4, "Spicy Beef Grilled Burrito", 3000, 3, "/images/spicy_beef_burrito.jpg");
insertMeal.run(17, 4, "BBQ Pork Grilled Burrito", 3000, 3, "/images/bbq_pork_burrito.jpg");
insertMeal.run(18, 4, "Shawarma", 3000, 3, "/images/shawarma.jpg");
insertMeal.run(19, 4, "Beef Taco", 3000, 3, "/images/beef_taco.jpg");

export default db;
