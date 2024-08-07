require("dotenv").config({ path: "./../config.env" });
const { Sequelize } = require("sequelize");
const mariadb = require("mariadb");

let name = "gpt_clone_db";
let username = "root";
let userpass = null;
let host = "127.0.0.1";

if (process.env.APP_ENV !== "DEV") {
  name = process.env.DB_NAME;
  username = process.env.DB_USERNAME;
  userpass = process.env.DB_PASS;
  host = process.env.DB_HOST;
} else {
  name = process.env.DB_NAME;
  username = process.env.DB_USERNAME;
  userpass = process.env.DB_PASS;
  host = process.env.DB_HOST;
}

const sequelize = new Sequelize(name, username, userpass, {
  host: host,
  dialect: "mariadb",
  dialectModule: mariadb,
  dialectOptions: {
    connectTimeout: 60000,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: false,
});

module.exports = sequelize;
