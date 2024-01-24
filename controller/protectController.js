const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/CatchAsync");
const { verifyJWT, checkUserJwtHeader } = require("../utils/utility");

module.exports.verifyUser = catchAsync(async (req, res, next) => {
  const checkUserJwt = checkUserJwtHeader(req);
  if (!checkUserJwt) {
    next(new AppError(403, "Inavlid Token."));
  }
  const processToken = verifyJWT(checkUserJwt);
  const currentTimestamp = Math.floor(Date.now() / 1000);
  if (processToken.exp && processToken.exp < currentTimestamp) {
    next(new AppError(403, "Token expired."));
  }
  const userExistCheck = await User.findOne({
    where: { email: processToken.email },
  });
  if (!userExistCheck) {
    next(new AppError(403, "Invalid user."));
  }
  req.locals = {};
  req.locals.users = userExistCheck;
  next();
});
