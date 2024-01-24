const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/CatchAsync");
const {
  createJWT,
  verifyPassword,
  checkUserJwtHeader,
} = require("../utils/utility");

module.exports.createUser = catchAsync(async (req, res, next) => {
  const missingField = ["name", "email", "age", "password", "cpassword"].find(
    (field) => !req.body[field]
  );

  if (missingField) {
    return next(
      new AppError(
        400,
        `${
          missingField.charAt(0).toUpperCase() + missingField.slice(1)
        } is required.`
      )
    );
  }
  const { password, cpassword } = req.body;

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
  const expiry = 86400 * 1000 * process.env.TOKEN_VALIDITY_DAYS;
  res.cookie("jwt", userToken, {
    httpOnly: true,
    maxAge: new Date(Date.now() + expiry),
    sameSite: "None",
    secure: true,
  });
  res.status(200).json({
    status: 200,
    message: "Success",
    payload: {
      users: { id: user.id, name: user.name, email: user.email },
      token: userToken,
    },
  });
});

module.exports.signOutUser = catchAsync(async (req, res, next) => {
  const jwtCookie = checkUserJwtHeader(req);
  if (!jwtCookie) {
    return next(new AppError(403, "Inavlid requet."));
  }
  res.cookie("jwt", "", { expires: new Date(0) });
  res.status(200).json({
    status: 200,
    message: "Logged out Successfully",
    jwtCookie,
  });
});
