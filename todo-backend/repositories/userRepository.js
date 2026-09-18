const User = require("../models/userModel");

async function findByEmail(email) {
  return User.findOne({ email });
}

async function createUser(userData) {
  return User.create(userData);
}

async function findAllUsers() {
  return User.find({})
    .select("-password")
    .sort({ createdAt: -1 });
}

async function findById(id) {
  return User.findById(id).select("-password");
}

async function deleteUserById(id) {
  return User.findByIdAndDelete(id);
}

async function updateUserRole(id, role) {
  return User.findByIdAndUpdate(
    id,
    { role },
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");
}

module.exports = {
  findByEmail,
  createUser,
  findAllUsers,
  findById,
  deleteUserById,
  updateUserRole,
};