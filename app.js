const express = require("express");
const https = require("https");
const fs = require("fs");
const morgan = require("morgan");
require("dotenv").config({ path: "./config.env" });
const sequelize = require("./dbConfig.js");
const cors = require("cors");
const path = require("path");
const errorHandler = require("./controller/errorController");
const AppError = require("./utils/AppError");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: "./config.env" });

// const privateKey = fs.readFileSync("private-key.pem", "utf8");
// const certificate = fs.readFileSync("certificate.pem", "utf8");

// const credentials = { key: privateKey, cert: certificate };
const app = express();

if (process.env.APP_ENV === "DEV") {
  app.use(morgan("dev"));
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Views/EmailTemplates"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const allowedOrigins = [
  "https://chatgpt-cloned.netlify.app",
  "http://localhost:5173",
  "http://43.205.231.49:5001",
  "http://65.1.132.5:8004",
];
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
const pmtRoutes = require("./routes/paymentRoutes");
app.use("/api/v1/users", authRoutes);
app.use("/api/v1/chats", chatRoutes);
app.use("/api/v1/payment", pmtRoutes);
app.get("/", (req, res, next) => {
  return res.status(200).json({
    status: "Success",
    message: "Application Running...",
  });
});
app.all("*", (req, res, next) => {
  const err = new AppError(`Can't find ${req.originalUrl}`);
  err.statusCode = 404;
  err.status = "Not Found";
  next(err);
});
app.use(errorHandler);

const port = process.env.PORT;

async function startApp() {
  try {
    // await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    // const httpsServer = https.createServer(credentials, app);

    app.listen(port, () => {
      console.log(`App running on ${port} in ${process.env.APP_ENV} mode.`);
    });
  } catch (error) {
    console.error(
      `Unable to connect to the database:   [${process.env.DB_NAME}, ${process.env.DB_USERNAME}, ${process.env.DB_PASS}], ${process.env.DB_HOST}`,
      error
    );
  }
}

startApp();
