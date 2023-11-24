// // Import necessary modules
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");

// Require campgrounds route
const campgrounds = require("./routes/campgrounds");

// Require reviews route
const reviews = require("./routes/reviews");

// Connect to the MongoDB database
const db = mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp")
  .then(() => {
    console.log("DATABASE CONNECTED!!!");
  })
  .catch((err) => {
    console.log("CONNECTION ERROR:");
    console.log(err);
  });

// Create an Express application
const app = express();

// Configure EJS as the view engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware for parsing URL-encoded request bodies and method override
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Middleware for static public folder
app.use(express.static(path.join(__dirname, "public")));

// Configure express-session for cookies
const sessionConfig = {
  secret: "thisshouldbeabettersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

// Initialize Flash
app.use(flash());

// Define success, error flash middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Define app.use express routes handlers
app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);

// Define routes and associated middleware
app.get("/", (req, res) => {
  // Render the "home" view
  res.render("home");
});

// Middleware for handling 404 errors
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// Middleware for handling errors and rendering the error view
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("error", { err });
});

// Start the Express application and listen on port 3000
app.listen(3000, () => {
  console.log("Serving on port 3000");
});
