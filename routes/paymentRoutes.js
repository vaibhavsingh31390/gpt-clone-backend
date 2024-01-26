const express = require("express");
const route = express.Router();
const protectController = require("../controller/protectController");
const Controller = require("../controller/paymentController");

route.get(
  "/free-credit-request/accept/:token",
  Controller.freeCreditsRequestAccept
);
route.get(
  "/free-credit-request/decline/:token",
  Controller.freeCreditsRequestDecline
);

route.use(protectController.verifyUser);
route.post("/free-credit-request", Controller.freeCreditsRequest);

module.exports = route;
