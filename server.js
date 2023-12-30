require("dotenv").config({ path: "./config.env" });
const app = require("./app");

const port = process.env.APP_PORT;
app.listen(port, () => {
  console.log(`App running on ${port} in ${process.env.APP_ENV} mode.`);
});
