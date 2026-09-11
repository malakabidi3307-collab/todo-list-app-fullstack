const authController = require("../controllers/authController");
function authRoutes(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method === "POST" && url.pathname === "/auth/register") {
    return authController.register(req, res);
  }
  if (req.method === "POST" && url.pathname === "/auth/login") {
    return authController.login(req, res);
  }
  if (req.method === "POST" && url.pathname === "/auth/logout") {
    return authController.logout(req, res);
  }
  res.writeHead(404, {
    "Content-Type": "application/json",
  });
  res.end(
    JSON.stringify({
      message: "Route introuvable",
    }),
  );
  return true;
}
module.exports = authRoutes;
