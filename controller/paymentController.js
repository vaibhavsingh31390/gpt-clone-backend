const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/CatchAsync");
const Email = require("../utils/Mailer");
const crypto = require("crypto");
const { updateCreditsBy } = require("../utils/utility");

module.exports.freeCreditsRequest = catchAsync(async (req, res, next) => {
  const { email, id, name } = req.body;

  if (!email || !id || !name) {
    return next(new AppError(400, "Invalid request body!"));
  }

  const findUser = await User.findOne({
    attributes: ["email", "name", "credits"],
    where: {
      email: email,
      id: id,
      name: name,
    },
  });

  const randomToken = crypto.randomBytes(32).toString("hex");
  const updateToken = await User.update(
    { creditsToken: randomToken },
    { where: { email: findUser.email } }
  );

  if (!updateToken) {
    return next(new AppError(400, "Request Failed!"));
  }
  findUser.message = "Request for some free credits.";
  const host = req.get("Host");

  findUser.accept = `http://${host}/api/v1/payment/free-credit-request/accept/${randomToken}`;
  findUser.decline = `http://${host}/api/v1/payment/free-credit-request/decline/${randomToken}`;

  res.status(201).json({ status: 201, message: "success" });

  await new Email().sendMessage(
    findUser,
    "Template",
    "CHAT GPT | FREE CREDIT REQ"
  );
});

module.exports.freeCreditsRequestAccept = catchAsync(async (req, res, next) => {
  const { token } = req.params;

  if (!token) {
    return next(new AppError(400, "Invalid token!"));
  }

  const findUser = await User.findOne({
    attributes: ["email", "name", "credits", "id"],
    where: {
      creditsToken: token,
    },
  });

  if (!findUser) {
    return next(new AppError(400, "User/Token Invalid!"));
  }

  const updateCredit = await updateCreditsBy(
    User,
    findUser.credits,
    findUser.id,
    process.env.FREE_CREDITS
  );

  if (!updateCredit) {
    return next(new AppError(400, "Oops something went wrong!"));
  }
  res.status(200).json({
    status: 200,
    message: "Credits successfully credited!",
  });
});

module.exports.freeCreditsRequestDecline = catchAsync(
  async (req, res, next) => {
    const { token } = req.params;

    if (!token) {
      return next(new AppError(400, "Invalid token!"));
    }

    const findUser = await User.findOne({
      attributes: ["email", "name", "credits", "id"],
      where: {
        creditsToken: token,
      },
    });

    if (!findUser) {
      return next(new AppError(400, "User/Token Invalid!"));
    }

    const updateCredit = await updateCreditsBy(
      User,
      findUser.credits,
      findUser.id,
      0
    );

    if (!updateCredit) {
      return next(new AppError(400, "Oops something went wrong!"));
    }
    res.status(200).json({
      status: 200,
      message: "Credits successfully credited!",
    });
  }
);
