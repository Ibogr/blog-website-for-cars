const express = require("express");
const router = express.Router();
const db = require("../data/db"); // Import database connection
const imageUpload = require("../helpers/image-upload"); // Import image upload helper (multer)

// Models for blog and category would be here (commented in your original code)

// ---------- Blog Routes ----------

// Delete blog page (GET) - shows delete confirmation page for a specific blog
router.get("/blog/delete/:blogId", async (req, res) => {
  const blogId = req.params.blogId;
  try {
    const [blogs,] = await db.execute("select * from blog where blogId=?", [blogId]);
    res.render("admin/blog-delete.ejs", {
      title: "delete",
      blogs: blogs,
    });
    console.log(blogId);
  } catch (error) {
    console.log(error);
  }
});

// Delete blog (POST) - performs actual deletion
router.post("/blog/delete/:blogId", async (req, res) => {
  const blogId = req.params.blogId;
  try {
    await db.execute("DELETE FROM blog WHERE blogId=?", [blogId]);
    res.redirect("/admin/blog-list?action=delete");
  } catch (error) {
    console.log(error);
  }
});

// Create blog page (GET) - renders form to add a new blog
router.get("/blog/create", async (req, response) => {
  try {
    const [categories] = await db.execute("select * from category");
    response.render("admin/blog-create.ejs", {
      title: "Add Blog",
      categories: categories,
    });
  } catch (error) {
    console.log(error);
  }
});

// Create blog (POST) - handles form submission and image upload
router.post("/blog/create", imageUpload.upload.single("image"), async (req, res) => {
  const addBlog = req.body;
  const title = addBlog.title;
  const description = addBlog.description;
  const brief = addBlog.brief;
  const image = req.file.filename; // Uploaded image filename
  const type = addBlog.type;
  const indexPage = addBlog.indexPage == "on" ? 1 : 0; // Checkbox to boolean
  const home = addBlog.home == "on" ? 1 : 0;

  try {
    // Using 1 as categoryId placeholder, normally should map selected category
    await db.execute(
      "insert into blog(title,description,image,type,indexPage, categoryId,brief,home) values(?,?,?,?,?,?,?,?)",
      [title, description, image, type, indexPage, 1, brief, home]
    );
    res.redirect("/admin/blog-list?action=create");
  } catch (error) {
    console.log("SQL failed: " + error);
  }
});

// Update blog (POST) - handles editing blog data including optional image
router.post("/blog/:blogId", imageUpload.upload.single("image"), async (req, res) => {
  const blogId = req.body.blogID;
  const title = req.body.title;
  const brief = req.body.brief;
  const description = req.body.description;
  const image = req.file ? req.file.filename : req.body.oldImage; // Use old image if none uploaded
  const type = req.body.type;
  const indexPage = req.body.indexPage == "on" ? 1 : 0;
  const home = req.body.home == "on" ? 1 : 0;

  try {
    await db.execute(
      "UPDATE blog SET title=?, description=?, image=?, type=?, indexPage=?, categoryId=?, brief=?, home=? WHERE blogId=?;",
      [title, description, image, type, indexPage, 1, brief, home, blogId]
    );
    res.redirect("/admin/blog-list?action=updated&blogId=" + blogId);
  } catch (error) {
    console.log(error);
  }
});

// Edit blog page (GET) - render form with blog data
router.get("/blog/:blogId", async (request, response) => {
  const blogId = request.params.blogId;
  try {
    const [info] = await db.execute("select * from blog where blogId=?", [blogId]);
    const [categoryRes] = await db.execute("select * from category");

    response.render("admin/blog-edit.ejs", {
      title: "edit page",
      categories: categoryRes,
      blogs: info,
      selectedCategory: null,
    });
  } catch (error) {
    console.log(error);
  }
});

// Blog list page (GET) - displays all blogs
router.get("/blog-list", async (request, response) => {
  try {
    const blog = await Blog.findall(); // Assuming Blog is a Sequelize model
    const [categoryRes] = await db.execute("select * from category");
    response.render("admin/blog-list.ejs", {
      title: "Blog page",
      categories: categoryRes,
      blogs: indexPage, // Possibly needs fixing: indexPage variable undefined here
      selectedCategory: null,
      action: request.query.action,
    });
  } catch (error) {
    console.log(error);
  }
});

// Set blog to appear on index page (POST)
router.post("/blog-list/:blogId", async (req, res) => {
  const blogId = req.params.blogId;
  try {
    await db.execute("UPDATE blog SET indexPage=1 where blogId=?", [blogId]);
    res.redirect("/admin/blog-list");
  } catch (error) {
    console.log(error);
  }
});

// ---------- Category Routes ----------

// Render add category page
router.get("/categoryAdd", (req, res) => {
  res.render("admin/add-category.ejs", {
    title: "add category",
  });
});

// Add a new category (POST)
router.post("/categoryAdd", async (req, res) => {
  const categoryName = req.body.name;
  try {
    const newCategory = await Category.create({ categoryName: categoryName }); // Sequelize
    return res.redirect(
      "/admin/categories?action=categoryAdded&categoryId=" + newCategory.categoryId
    );
  } catch (error) {
    console.log(error);
    res.status(500).send("Kategori eklenemedi");
  }
});

// Show all categories
router.get("/categories", async (req, res) => {
  try {
    const [categories] = await db.execute("select * from category");
    res.render("admin/all-categories", {
      title: "All Categories",
      categories: categories,
      action: req.query.action,
      categoryId: req.query.categoryId,
    });
  } catch (error) {
    console.log(error);
  }
});

// Edit category page (GET)
router.get("/edit-category/:categoryId", async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const [name] = await db.execute("select * from category where categoryId=?", [categoryId]);
    res.render("admin/edit-category", {
      title: "edit page",
      names: name,
    });
  } catch (error) {
    console.log(error);
  }
});

// Update category (POST)
router.post("/edit-category/:categoryId", async (req, res) => {
  const categoryId = req.params.categoryId;
  const updatedName = req.body.name;
  try {
    await db.execute("UPDATE category SET name=? where categoryId=?", [updatedName, categoryId]);
    res.redirect("/admin/categories");
  } catch (error) {
    console.log(error);
  }
});

// Delete category page (GET)
router.get("/delete/category/:categoryId", async (req, res) => {
  const categoryId = req.params.categoryId;
  res.render("admin/delete-category", {
    title: "Delete Page",
    categoryId: categoryId,
  });
});

// Delete category (POST)
router.post("/delete/category/:categoryId", async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    await db.execute("DELETE FROM category WHERE categoryId=?", [categoryId]);
    res.redirect("/admin/categories");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
