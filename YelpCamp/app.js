// // Import necessary modules
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const { campgroundSchema } = require("./schemas");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const Campground = require("./models/campgrounds");

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

// Middleware for validating campground data against a schema
const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// Define routes and associated middleware
app.get("/", (req, res) => {
  // Render the "home" view
  res.render("home");
});

// Fetch all campgrounds from the database and render the "campgrounds/index" view
app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

// Render the "campgrounds/new" view for creating a new campground
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

// Validate campground data, then create and save a new campground to the database
app.post(
  "/campgrounds",
  validateCampground,
  catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// Fetch a specific campground by ID and render the "campgrounds/show" view
app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/show", { campground });
  })
);

// Fetch a specific campground by ID and render the "campgrounds/edit" view
app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);

// Validate campground data, then find and update a campground in the database
app.put(
  "/campgrounds/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// Delete a specific campground by ID from the database
app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

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
