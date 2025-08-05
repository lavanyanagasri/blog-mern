const CustomError = require("../../Helpers/error/CustomError");

const customErrorHandler = (err, req, res, next) => {
  console.log("Custom Error Handler => ", err.message, err.code);

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ success: false, error: "JWT malformed" });
  }

  if (err.message === "secretOrPrivateKey must have a value") {
    return res.status(500).json({ success: false, error: "Missing JWT secret key" });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      error: "Duplicate Field Value Enter",
    });
  }

  return res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
};

module.exports = customErrorHandler;
