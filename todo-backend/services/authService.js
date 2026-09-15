const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");
function createAccessToken(user) {
  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );
}
function createRefreshToken(user) {
  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    },
  );
}
async function register(username, email, password) {
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await userRepository.createUser({
    username,
    email,
    password: hashedPassword,
  });
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);
  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
    },
  };
}
async function login(email, password) {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }
  const passwordCorrect = await bcrypt.compare(password, user.password);
  if (!passwordCorrect) {
    throw new Error("INVALID_CREDENTIALS");
  }
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);
  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
    },
  };
}
function refreshAccessToken(refreshToken) {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const accessToken = jwt.sign(
      {
        id: decoded.id,
        email: decoded.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );
    return accessToken;
  } catch (error) {
    throw new Error("INVALID_REFRESH_TOKEN");
  }
}
function getUserFromAccessToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error("INVALID_ACCESS_TOKEN");
  }
}
module.exports = {
  register,
  login,
  refreshAccessToken,
  getUserFromAccessToken,
};
