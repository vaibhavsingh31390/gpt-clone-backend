const express = require("express");
const app = express();
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
if (process.env.APP_ENV === "DEV") {
  app.use(morgan("dev"));
}
app.use(express.json());

module.exports = app;
