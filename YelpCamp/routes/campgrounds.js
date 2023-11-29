const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

const Campground = require("../models/campground");

// Group "/" routes together
router
  .route("/")
  // Fetch all campgrounds from the database and render the "campgrounds/index" view
  .get(catchAsync(campgrounds.index))
  // Validate campground data, then create and save a new campground to the database
  .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

// Render the "campgrounds/new" form for creating a new campground
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

// Group "/:id" routes together
router
  .route("/:id")
  // Fetch a specific campground by ID and render the "campgrounds/show" view
  .get(catchAsync(campgrounds.showCampground))
  // Validate campground data, then find and update a campground in the database
  .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
  // Delete a specific campground by ID from the database
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

// Fetch a specific campground by ID and render the "campgrounds/edit" view
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;
