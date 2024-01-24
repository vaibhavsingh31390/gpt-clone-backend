const { Sequelize } = require("sequelize");
const mariadb = require("mariadb");

let name = "gptclone";
let username = "root";
let userpass = null;
let host = "localhost";

if (process.env.APP_ENV !== "DEV") {
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
});

module.exports = sequelize;
