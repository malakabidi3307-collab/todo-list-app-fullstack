const User = require("../models/userModel");
async function findByEmail(email) {
  return await User.findOne({ email });
}
async function createUser(userData) {
  return await User.create(userData);
}
module.exports = {
  findByEmail,
  createUser
};