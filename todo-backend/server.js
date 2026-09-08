const http = require("http");
const todoRoutes = require("./routes/todoRoutes");

const PORT = 5000;

const app = http.createServer((req, res) => {
  // Autoriser le frontend React
  res.setHeader(
    "Access-Control-Allow-Origin",
    "http://localhost:3000"
  );

  // Autoriser les méthodes HTTP
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  // Autoriser les headers
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

  // Répondre aux requêtes OPTIONS envoyées par le navigateur
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // Envoyer la requête vers les routes
  todoRoutes(req, res);
});

// Démarrer le serveur uniquement lorsqu'on exécute directement server.js
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
  });
}

// Exporter l'application pour les tests
module.exports = app;