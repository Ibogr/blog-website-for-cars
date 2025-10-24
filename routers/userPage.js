const express = require("express");

// Create a router instance for user routes
const router = express.Router();

const db = require("../data/db"); // Database connection

// Sample data (used before SQL database integration)
const data = {
  title: "Popular Cars",
  categories: ["Sports", "SUV", "Classic", "Saloon"],
  blogs: [
    {
      title: "Lorem ipsum dolor sit amet.",
      paragraph:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat adipisci, quisquam doloremque odio molestiae ratione!",
      image: "Car1.jpg",
      type: "sport",
      indexPage: true,
    },
    // ... other sample blogs
  ],
};

// ----- User Routes -----

// Route: View blogs by category
router.get("/blogs/category/:categoryId", async (req, res) => {
  const categoryId = req.params.categoryId; // Extract category ID from URL
  try {
    // Fetch blogs of a specific type/category from database
    const [categId] = await db.execute(
      "select * from blog where type =?",
      [categoryId]
    );
    // Fetch all categories for navigation/menu
    const [categoryRes,] = await db.execute("select * from category");
    
    // Render blogs page filtered by category
    res.render("users/blogs.ejs", {
      title: "PopularCars",
      categories: categoryRes,
      blogs: categId,
      selectedCategory: categoryId,
    });
  } catch (err) {
    console.log("SQL query failed for categoryId: " + err);
  }
});

// Route: View details of a single blog
router.get("/blogs/:blogsId", async (req, res) => {
  const id = req.params.blogsId;
  console.log(id);
  try {
    // Fetch blog by its ID
    const [blogsid] = await db.execute("select * from blog where blogid=?", [id]);
    console.log(blogsid[0]);
    
    if (blogsid[0]) {
      // If blog exists, render details page
      return res.render("users/details.ejs", {
        blogsid: blogsid[0],
        title: "Popular Cars",
      });
    }
    // If blog not found, redirect to home page
    res.redirect("/");
  } catch (err) {
    console.log("SQL query failed: " + err);
  }
});

// Route: About page
router.get("/about", (request, response) => {
  // Render about page using sample data
  response.render("users/about.ejs", data);
});

// Route: Blogs index page (featured blogs)
router.get("/blogs", async (request, response) => {
  try {
    // Fetch blogs marked for index page display
    const [indexPage] = await db.execute("select * from blog where indexPage=1");
    // Fetch all categories for navigation
    const [categoryRes] = await db.execute("select * from category");
    
    // Render blogs page
    response.render("users/blogs", {
      title: "index page",
      categories: categoryRes,
      blogs: indexPage,
      selectedCategory: null,
    });
  } catch (error) {
    console.log(error);
  }
});

// Route: Home page
router.get("/", async (request, response) => {
  try {
    // Fetch all blogs and categories
    const [blog] = await db.execute("select * from blog");
    const [categoryRes] = await db.execute("select * from category");
    
    // Render homepage with blogs and categories
    response.render("users/index.ejs", {
      title: "Popular Cars",
      categories: categoryRes,
      blogs: blog,
      selectedCategory: null,
    });
  } catch (err) {
    console.log("SQL error: " + err);
  }
});

// Export the router to be used in main app
module.exports = router;
