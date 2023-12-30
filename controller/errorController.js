const AppError = require("../utils/AppError");

const devErrorHandler = (err, req, res, next) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      Code: err.statusCode,
      Status: err.status,
      Message: err.message,
      Error: err,
      ErrorStack: err.stack,
    });
  }
};

const prodErrorHandler = (err, req, res, next) => {
  console.log(err);
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      Code: err.statusCode,
      Status: err.status,
      Message: "Something went wrong.",
    });
  }
};

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "Fail";
  error.isOperational = error.isOperational || false;

  switch (process.env.APP_ENV) {
    case "DEV":
      devErrorHandler(error, req, res);
      break;
    default:
      prodErrorHandler();
      break;
  }
};
