const { Sequelize } = require("sequelize");
const mariadb = require("mariadb");
const name = process.env.DB_NAME;
const username = process.env.DB_USERNAME;
const userpass = process.env.DB_PASS;
const host = process.env.DB_HOST;
// const userpass = null;
console.log(name, username, userpass, host);
const sequelize = new Sequelize(name, username, userpass, {
  host: host,
  dialect: "mariadb",
  dialectModule: mariadb,
  dialectOptions: {
    connectTimeout: 60000,
  },
});

module.exports = sequelize;
