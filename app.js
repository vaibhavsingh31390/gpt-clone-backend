const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const errorHandler = require("./controller/errorController");
const AppError = require("./utils/AppError");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: "./config.env" });
if (process.env.APP_ENV === "DEV") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(cookieParser());
const authRoutes = require("./routes/authRoutes");

app.use("/api/v1/users", authRoutes);

app.get("/", (req, res, next) => {
  return res.status(200).json({
    status: "Succeess",
    message: "Applicatin Running...",
  });
});

app.all("*", (req, res, next) => {
  const err = new AppError(`Can't find ${req.originalUrl}`);
  err.statusCode = 404;
  err.status = "Not Found";
  next(err);
});
app.use(errorHandler);

module.exports = app;
