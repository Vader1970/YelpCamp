// Define a custom error class that extends the built-in Error class
class ExpressError extends Error {
  // Constructor for the ExpressError class
  constructor(message, statusCode) {
    // Call the constructor of the parent class (Error) using super()
    super();

    // Set the error message and status code properties
    this.message = message; // Error message
    this.statusCode = statusCode; // HTTP status code
  }
}

// Export the ExpressError class to make it available for use in other modules
module.exports = ExpressError;
