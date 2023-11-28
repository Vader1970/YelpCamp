// // Import necessary modules and files
const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

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

// //   Pick random place and descriptor and put them together
// // Function to pick a random element from an array
const sample = (array) => array[Math.floor(Math.random() * array.length)];

// Check if we connecting to database, deleteing, adding new content
// const seedDB = async () => {
//   await Campground.deleteMany({});
//   const c = new Campground({ title: "purple field" });
//   await c.save();
// };
// seedDB();

// Function to seed the database with campground data
const seedDB = async () => {
  // Clear existing campground data from the database
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    // Generate a random index to select a city from the cities.js file
    const random1000 = Math.floor(Math.random() * 1000);
    // Create a new Campground instance with a location and title
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "6563c452ce4b40c83806799b",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: "https://source.unsplash.com/collection/483251",
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quasi, impedit nesciunt vel, eligendi dicta optio consectetur animi error dolores corrupti corporis cum illo eum.",
      price,
    });
    // Save the new campground entry to the database
    await camp.save();
  }
};

// Call the seedDB function and close the database connection when done
seedDB().then(() => {
  mongoose.connection.close();
});

// // Run once in terminal node seeds/index.js
