const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");
async function register(username, email, password) {
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await userRepository.createUser({
    username,
    email,
    password: hashedPassword
  });
  const token = jwt.sign(
    {
      id: user._id.toString(),
      email: user.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d"
    }
  );
  return {
    token,
    user: {
      id: user._id.toString(),
      username: user.username,
      email: user.email
    }
  };
}
async function login(email, password) {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }
  const passwordCorrect = await bcrypt.compare(
    password,
    user.password
  );
  if (!passwordCorrect) {
    throw new Error("INVALID_CREDENTIALS");
  }
  const token = jwt.sign(
    {
      id: user._id.toString(),
      email: user.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d"
    }
  );
  return {
    token,
    user: {
      id: user._id.toString(),
      username: user.username,
      email: user.email
    }
  };
}
module.exports = {
  register,
  login
};