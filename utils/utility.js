const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const catchAsync = require("./CatchAsync");
const createJWT = (user) => {
  const expirySeconds = process.env.TOKEN_EXPIRY;
  const jwtToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.APP_SECRET,
    {
      expiresIn: expirySeconds,
    }
  );
  return jwtToken;
};

const verifyJWT = (token) => {
  let verifiedJwt = null;
  jwt.verify(token, process.env.APP_SECRET, (err, decoded) => {
    verifiedJwt = decoded;
  });
  return verifiedJwt;
};

const verifyPassword = async (user, password) => {
  const passwordVerify = await bcrypt.compare(password, user.password);
  return passwordVerify;
};

const checkUserJwtHeader = (req) => {
  if (req.cookies.jwt) {
    return req.cookies.jwt;
  }
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};

module.exports = { createJWT, verifyJWT, verifyPassword, checkUserJwtHeader };
