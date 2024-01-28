const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/CatchAsync");
const Sequelize = require("sequelize");
const {
  checkUserCredits,
  getChatCompletion,
  updateCreditsReduce,
} = require("../utils/utility");

const saveChatRes = async (message, response, senderId, group_id) => {
  const saveResponse = await Chat.create({
    message,
    response,
    senderId,
    group_id,
  });

  if (!saveResponse) {
    throw new AppError(400, "Something went wrong.");
  } else {
    console.log("Record Saved");
  }
};

module.exports.sendChatReq = catchAsync(async (req, res, next) => {
  const text = req.body.text;
  const userID = req.body.id || req.locals.users.id;
  const groupId = req.body.groupId;
  if (!text || !userID) {
    return next(new AppError(400, "Invalid request body!"));
  }
  const user = await checkUserCredits(userID, User);
  if (!user.status) {
    return next(new AppError(400, user.message));
  }
  const userCredits = await updateCreditsReduce(
    User,
    user.user.credits,
    userID
  );
  if (!userCredits) {
    return next(new AppError(500, "Something went wrong."));
  }
  const completion = await getChatCompletion(text);
  if (!completion) {
    return next(new AppError(400, "Something went wrong."));
  }

  res.status(200).json({
    status: 200,
    response: completion,
    message: "Data Saved.",
  });
  saveChatRes(text, completion, userID, groupId);
});

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
    attributes: [
      "group_id",
      "message",
      [Sequelize.fn("max", Sequelize.col("createdAt")), "latestCreatedAt"],
    ],
    where: {
      senderId: user.id,
    },
    group: ["group_id"],
    order: [[Sequelize.literal("latestCreatedAt"), "DESC"]],
  });

  res.status(201).json({
    status: 201,
    message: chats.length > 0 ? "Chats fetched." : "No Content",
    payload: {
      data: chats,
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
      group_id: id,
    },
  });
  res.status(201).json({
    status: 201,
    message: chats.length > 0 ? "Chats fetched." : "No Content",
    payload: {
      data: chats,
    },
  });
});

module.exports.deleteSingleChat = catchAsync(async (req, res, next) => {
  const email = req.locals.users.email || req.body.email;
  const id = req.params.id || req.body.id;
  if (!email || !id) {
    return next(
      new AppError(400, "Please provide a valid sender and chat ID.")
    );
  }

  const user = await User.findOne({
    where: {
      email: email,
    },
  });
  if (!user) {
    return next(new AppError(400, "User not found."));
  }
  const chatToDelete = await Chat.destroy({
    where: {
      senderId: user.id,
      group_id: id,
    },
  });

  if (!chatToDelete) {
    return next(new AppError(400, "Chat not found."));
  }

  res.status(200).json({
    status: 200,
    message: "Chat deleted successfully.",
  });
});
