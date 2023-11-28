// // Import necessary modules
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

// ROUTES
// Require User route
const userRoutes = require("./routes/user");

// Require campgrounds route
const campgroundRoutes = require("./routes/campgrounds");

// Require reviews route
const reviewRoutes = require("./routes/reviews");

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

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// Store and un-store user session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Define success, error flash middleware
app.use((req, res, next) => {
  // console.log(req.session);
  // Return to Url (except login) if user is not logged in
  if (!["/login", "/"].includes(req.originalUrl)) {
    req.session.returnTo = req.originalUrl;
  }
  // currentUser For Navbar
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/fakeUser", async (req, res) => {
  const user = new User({ email: "dan@gmail.com", username: "dan" });
  const newUser = await User.register(user, "chicken");
  res.send(newUser);
});

// Define app.use express routes handlers
app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

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
