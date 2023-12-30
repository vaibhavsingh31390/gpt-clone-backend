require("dotenv").config({ path: "./config.env" });
const app = require("./app");
const port = process.env.APP_PORT;
const sequelize = require("./dbConfig");

async function startApp() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    app.listen(port, () => {
      console.log(`App running on ${port} in ${process.env.APP_ENV} mode.`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

startApp();
