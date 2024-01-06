const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/CatchAsync");

module.exports.sendChatReq = (req, res, next) => {};
module.exports.saveChatRes = (req, res, next) => {};

module.exports.fetchChats = catchAsync(async (req, res, next) => {
  const email = req.locals.users.email || req.body.email;
  if (!email) {
    return next(new AppError(400, "Please provide a valid sender."));
  }
  const user = await User.findOne({
    where: {
      email: email,
    },
  });
  if (!user) {
    return next(new AppError(400, "Data not found."));
  }
  const chats = await Chat.findAll({
    where: {
      senderId: user.id,
    },
  });
  const duplicatedChats = [...Array(10)].flatMap(() => chats);
  res.status(201).json({
    status: 201,
    message: "Chats fetched.",
    payload: {
      data: duplicatedChats,
    },
  });
});
module.exports.fetchSingleChat = catchAsync(async (req, res, next) => {
  const email = req.locals.users.email || req.body.email;
  const id = req.params.id || req.body.id;
  if (!email || !id) {
    return next(new AppError(400, "Please provide a valid sender."));
  }
  const user = await User.findOne({
    where: {
      email: email,
    },
  });
  if (!user) {
    return next(new AppError(400, "Data not found."));
  }
  const chats = await Chat.findAll({
    where: {
      senderId: user.id,
      conversationId: id,
    },
  });
  res.status(201).json({
    status: 201,
    message: "Chats fetched.",
    payload: {
      data: chats,
    },
  });
});
