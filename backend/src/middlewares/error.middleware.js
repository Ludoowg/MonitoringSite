const errorHandler = (error, _req, res, _next) => {
  const statusCode = Number(error.statusCode) || 500;
  const message = error.message || "Internal server error";

  res.status(statusCode).json({
    error: {
      message,
      statusCode,
    },
  });
};

module.exports = errorHandler;
