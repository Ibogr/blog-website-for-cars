/* 
Note about nodemon:
- We installed nodemon as a package to automatically restart/render our project on changes.
- Currently, nodemon is being run via npx (npx nodemon index.js).
- To run it directly with npm scripts, you can add a script in package.json:
  "start": "nodemon index.js"
  This way you can use `npm start` instead of `npx nodemon index.js`.
*/

const express = require("express");
const app = express();

// Middleware to parse URL-encoded data (from forms)
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON data in requests
app.use(express.json());

// Set the view engine to EJS for rendering dynamic HTML templates
app.set("view engine", "ejs");

// Import routers for different sections of the app
const userRouter = require("./routers/userPage");
const adminRouter = require("./routers/admin");

// ---------------- Static Middlewares ----------------

// Allow the app to serve files from "node_modules"
// This way, we can use libraries installed via npm directly in HTML
app.use(express.static("node_modules"));

// Allow the app to serve files from the "images" folder
// This makes image files accessible in HTML without using ../images
app.use(express.static("images/"));

// ---------------- Routers ----------------

// Use adminRouter for all routes starting with /admin/
app.use("/admin/", adminRouter);

// Use userRouter for all other routes
app.use(userRouter);

// ---------------- Start Server ----------------

// Start the Express server on port 3000
app.listen(3000, function () {
  console.log("listening on port 3000");
});

/* 
Notes:
- Since this is running on a Node server, browser JS code in HTML won’t automatically run unless served properly.
- Using express.static middleware allows Node to serve these files so that HTML/JS can access them.
- Sequelize models (database models) would be called/imported elsewhere in the app as needed.
*/
