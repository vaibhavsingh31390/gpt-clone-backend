const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/CatchAsync");
const { createJWT, verifyPassword } = require("../utils/utility");

module.exports.createUser = catchAsync(async (req, res, next) => {
  const { name, email, age, password, cpassword } = req.body;
  if (!name || !email || !age || !password || !cpassword) {
    return next(new AppError(400, "Invalid Request Body."));
  }
  if (password !== cpassword) {
    return next(new AppError(400, "Password & Confirm Password Do Not Match."));
  }
  const user = await User.create(req.body);
  delete user.password;

  const userToken = createJWT(user);

  res.cookie("jwt", userToken, {
    httpOnly: true,
    maxAge: 86400 * process.env.TOKEN_VALIDITY_DAYS,
  });
  res.status(200).json({
    status: 200,
    message: "Success",
    payload: {
      users: { name: user.name, email: user.email },
      token: userToken,
    },
  });
});
module.exports.signInUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError(400, "Invalid Request Body."));
  }
  const user = await User.findOne({
    where: {
      email: email,
    },
  });
  if (!user) {
    return next(new AppError(403, "Inavlid email or password."));
  }
  const comparePass = await verifyPassword(user, password);
  if (!comparePass) {
    delete user.password;
    delete password;
    return next(new AppError(403, "Inavlid credentials."));
  }
  const userToken = createJWT(user);
  res.cookie("jwt", userToken, {
    httpOnly: true,
    maxAge: 86400 * process.env.TOKEN_VALIDITY_DAYS,
    sameSite: "None",
    secure: true,
  });
  res.status(200).json({
    status: 200,
    message: "Success",
    payload: {
      users: { name: user.name, email: user.email },
      token: userToken,
    },
  });
});

module.exports.signOutUser = (req, res, next) => {};
