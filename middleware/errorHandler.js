module.exports = (err, req, res, next) => {
  let message = err.message;
  statusCode = err.statusCode;

  // console.log(err);

  if (err.name === "CastError") {
    message = "Resource does not exist";
    statusCode = err.statusCode;
  }

  if (err.code === 11000) {
    message = "User already exist";
    statusCode = 400;
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  res.status(statusCode || 500).json({
    success: false,
    message: message || "Server Error",
  });
};
