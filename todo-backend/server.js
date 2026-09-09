const http = require("http");
const todoRoutes = require("./routes/todoRoutes");
const { connectDB } = require("./database/db");

const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL
].filter(Boolean);

const app = http.createServer((req, res) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  todoRoutes(req, res);
});

if (require.main === module) {
  connectDB()
    .then(() => {
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`Serveur démarré sur le port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error(
        "Impossible de démarrer le serveur :",
        error
      );

      process.exit(1);
    });
}

module.exports = app;