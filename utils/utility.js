const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const openAi = require("openai");
const ai = new openAi.OpenAI();

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
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  if (req.cookies.jwt) {
    return req.cookies.jwt;
  }
  return null;
};

const checkUserCredits = async (userID, Model) => {
  const user = await Model.findOne({
    where: { id: userID },
  });
  if (user.credits === 0) {
    return { status: false, message: "Not enough credits." };
  }
  return { status: true, user };
};

const getChatCompletion = async (text) => {
  try {
    return await ai.chat.completions.create({
      messages: [{ role: "user", content: text }],
      model: "gpt-3.5-turbo",
    });
  } catch (error) {
    return { status: false, message: error };
  }
};

const updateCreditsReduce = async (Model, credits, userID) => {
  const userCredits = await Model.update(
    { credits: credits - 1 },
    { where: { id: userID } }
  );
  return userCredits;
};

const updateCreditsBy = async (Model, credits, userID, newcredits) => {
  const userCredits = await Model.update(
    { credits: parseInt(credits) + parseInt(newcredits), creditsToken: null },
    { where: { id: userID } }
  );

  if (!userCredits) {
    return false;
  }
  return userCredits;
};

module.exports = {
  createJWT,
  verifyJWT,
  verifyPassword,
  checkUserJwtHeader,
  checkUserCredits,
  getChatCompletion,
  updateCreditsReduce,
  updateCreditsBy,
};
