const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const errorHandler = require("./controller/errorController");
const AppError = require("./utils/AppError");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: "./config.env" });
let allowedOrigins = new Array();
if (process.env.APP_ENV === "DEV") {
  app.use(morgan("dev"));
  console.log("prooo");
  allowedOrigins = ["http://localhost:5173"];
} else {
  allowedOrigins = ["https://chatgpt-cloned.netlify.app"];
}

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
app.use("/api/v1/users", authRoutes);
app.use("/api/v1/chats", chatRoutes);
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
