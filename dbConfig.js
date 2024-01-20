const { Sequelize } = require("sequelize");
const name = process.env.DB_NAME;
const username = process.env.DB_USERNAME;
const userpass = process.env.DB_PASS;
const host = process.env.DB_HOST;
// const userpass = null;
const sequelize = new Sequelize(name, username, userpass, {
  host: host,
  dialect: "mariadb",
});

module.exports = sequelize;
