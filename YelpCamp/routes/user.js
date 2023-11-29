const { storeReturnTo } = require("../middleware");
const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const users = require("../controllers/users");

// Group '/register' together
router
  .route("/register")
  // Route to register form
  .get(users.renderRegister)
  // Create new user
  .post(catchAsync(users.register));

// User login
// Group '/login' together
// Route to login form
router
  .route("/login")
  .get(users.renderLogin)
  // Login
  .post(
    // use the storeReturnTo middleware to save the returnTo value from session to res.locals
    storeReturnTo,
    // passport.authenticate logs the user in and clears req.session
    passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }),
    users.login
  );

// Logout
router.get("/logout", users.logout);

module.exports = router;
