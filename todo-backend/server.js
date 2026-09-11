const http = require("http");
const todoRoutes = require("./routes/todoRoutes");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const { connectDB } = require("./database/db");
const PORT = process.env.PORT || 5000;
const app = http.createServer((req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  res.setHeader("Access-Control-Allow-Origin", frontendUrl);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname.startsWith("/auth/")) {
    authRoutes(req, res);
    return;
  }
  if (url.pathname === "/todos" || url.pathname.startsWith("/todos/")) {
    const authenticated = authMiddleware(req, res);
    if (!authenticated) {
      return;
    }
    todoRoutes(req, res);
    return;
  }
  res.writeHead(404, {
    "Content-Type": "application/json",
  });
  res.end(
    JSON.stringify({
      message: "Route introuvable",
    }),
  );
});
if (require.main === module) {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Serveur démarré sur le port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Impossible de démarrer le serveur :", error);
      process.exit(1);
    });
}
module.exports = app;
