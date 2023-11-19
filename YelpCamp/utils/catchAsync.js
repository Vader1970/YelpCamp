// Exporting a higher-order function that takes another function (func) as an argument
// Returning a middleware function that handles asynchronous operations
// Invoking the provided function (func) with the request, response, and next arguments
// Using .catch(next) to catch and propagate any errors that occur during the asynchronous operation
module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next);
  };
};
