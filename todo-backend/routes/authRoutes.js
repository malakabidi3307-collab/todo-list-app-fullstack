const authController = require("../controllers/authController");
function authRoutes(req, res) {
  const url = new URL(
    req.url,
    `http://${req.headers.host}`
  );
  if (
    req.method === "POST" &&
    url.pathname === "/auth/register"
  ) {
    return authController.register(req, res);
  }
  if (
    req.method === "POST" &&
    url.pathname === "/auth/login"
  ) {
    return authController.login(req, res);
  }
  return false;
}
module.exports = authRoutes;