const express = require("express");
const route = express.Router();
const protectController = require("../controller/protectController");
const Controller = require("../controller/authController");

route.post("/register", Controller.createUser);
route.post("/login", Controller.signInUser);
route.use(protectController.verifyUser);
route.post("/logout", Controller.signOutUser);

module.exports = route;
