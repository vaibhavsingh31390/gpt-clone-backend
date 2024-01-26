const express = require("express");
const route = express.Router();
const protectController = require("../controller/protectController");
const Controller = require("../controller/chatController");

route.use(protectController.verifyUser);
route.get("/get", Controller.fetchChats);
route.get("/get/:id", Controller.fetchSingleChat);
route.post("/send", Controller.sendChatReq);
module.exports = route;
