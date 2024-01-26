const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/CatchAsync");
const openAi = require("openai");
const ai = new openAi.OpenAI();
module.exports.sendChatReq = catchAsync(async (req, res, next) => {
  const text = req.body.text;
  if (!text) {
    return next(new AppError(400, "Invalid request body!"));
  }
  const completion = await ai.chat.completions.create({
    messages: [{ role: "user", content: text }],
    model: "gpt-3.5-turbo",
  });

  if (!completion) {
    return next(new AppError(400, "Something went wromg."));
  }

  res.status(200).json({
    status: 200,
    response: completion,
  });
});
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
