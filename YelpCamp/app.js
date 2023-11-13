// // Import necessary modules
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
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

// // Create an Express application
// const app = express();

// // Set the view engine to EJS and specify the views directory
// define layout files with ejsMate
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// // Parse the body for req.body
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Define a route for the home page
app.get("/", (req, res) => {
  // TEST
  // res.send("HELLO");
  // Render the "home" view
  res.render("home");
});

// Check connection with database
// app.get("/makecampground", async (req, res) => {
//   const camp = new Campground({ title: "My Backyard", description: "Cheap Camping!" });
//   await camp.save();
//   res.send(camp);
// });

// *********CRUD*********
// CRUD for campgrounds - READ
// Define a route for displaying a list of all campgrounds
app.get("/campgrounds", async (req, res) => {
  // Retrieve all campgrounds from the database
  const campgrounds = await Campground.find({});
  // Render the "campgrounds/index" view, passing the retrieved campgrounds as data
  res.render("campgrounds/index", { campgrounds });
});

// CRUD - CREATE - ORDER MATTERS - BEFORE SHOW BECAUSE OF ID
// Route for displaying the form to create a new campground
app.get("/campgrounds/new", (req, res) => {
  // Render the "campgrounds/new" view for creating a new campground
  res.render("campgrounds/new");
});

// Route for handling the creation of a new campground
app.post("/campgrounds", async (req, res) => {
  // Create a new Campground instance using the data from the request body
  const campground = new Campground(req.body.campground);
  // Save the new campground to the database
  await campground.save();
  // Redirect to the show page for the newly created campground
  res.redirect(`/campgrounds/${campground._id}`);
});

// CRUD - SHOW
// Define a route for displaying details of a specific campground
app.get("/campgrounds/:id", async (req, res) => {
  // Retrieve the campground with the specified ID from the database
  const campground = await Campground.findById(req.params.id);
  // Render the "campgrounds/show" view, passing the retrieved campground as data
  res.render("campgrounds/show", { campground });
});

// CRUD EDIT
// Route for displaying the form to edit a specific campground
app.get("/campgrounds/:id/edit", async (req, res) => {
  // Retrieve the campground with the specified ID from the database
  const campground = await Campground.findById(req.params.id);
  // Render the "campgrounds/edit" view, passing the retrieved campground as data
  res.render("campgrounds/edit", { campground });
});

// Route for handling the update of a specific campground
app.put("/campgrounds/:id", async (req, res) => {
  // Test
  //   res.send("IT WORKS!!");
  // Extract the campground ID from the request parameters
  const { id } = req.params;
  // Find and update the campground in the database with the data from the request body
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  // Redirect to the show page for the updated campground
  res.redirect(`/campgrounds/${campground._id}`);
});

// CRUD - DELETE - RESTful ROUTE
// Route for handling the deletion of a specific campground
app.delete("/campgrounds/:id", async (req, res) => {
  // Extract the campground ID from the request parameters
  const { id } = req.params;
  // Find and delete the campground with the specified ID from the database
  await Campground.findByIdAndDelete(id);
  // Redirect to the list of all campgrounds after deletion
  res.redirect("/campgrounds");
});

// // // Define a route for creating a campground (temporary route for testing)
// // app.get("/makecampground", async (req, res) => {
// //   // Create a new Campground instance with sample data
// //   const camp = new Campground({ title: "My Backyard", description: "CHEAP CAMPING!" });
// //   // Save the new campground to the database
// //   await camp.save();
// //   // Send a response containing the newly created campground data
// //   res.send(camp);
// // });

// Start the Express application and listen on port 3000
app.listen(3000, () => {
  console.log("Serving on port 3000");
});
