const http = require("http");
const todoRoutes = require("./routes/todoRoutes");
const { connectDB } = require("./database/db");

const PORT = process.env.PORT || 5000;

const app = http.createServer((req, res) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "http://localhost:3000"
  );

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
      app.listen(PORT, () => {
        console.log(
          `Serveur démarré sur http://localhost:${PORT}`
        );
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