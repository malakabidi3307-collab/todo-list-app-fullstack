const userRepository = require("../repositories/userRepository");
async function getAllUsers() {
  return userRepository.findAllUsers();
}
async function deleteUser(adminId, userId) {
  if (adminId === userId) {
    throw new Error("CANNOT_DELETE_SELF");
  }
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }
  await userRepository.deleteUserById(userId);
  return {
    message: "Utilisateur supprimé",
  };
}
async function updateUserRole(userId, role) {
  if (!["user", "admin"].includes(role)) {
    throw new Error("INVALID_ROLE");
  }
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }
  return userRepository.updateUserRole(userId, role);
}
module.exports = {
  getAllUsers,
  deleteUser,
  updateUserRole,
};
