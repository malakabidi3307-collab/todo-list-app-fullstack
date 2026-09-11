const authService = require("../services/authService");
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(new Error("INVALID_JSON"));
      }
    });
    req.on("error", reject);
  });
}
async function register(req, res) {
  try {
    const body = await readBody(req);
    const { username, email, password } = body;
    if (!username || !email || !password) {
      res.writeHead(400, {
        "Content-Type": "application/json",
      });
      res.end(
        JSON.stringify({
          message: "Username, email et password sont obligatoires",
        }),
      );
      return;
    }
    const result = await authService.register(username, email, password);
    res.writeHead(201, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify(result));
  } catch (error) {
    if (error.message === "EMAIL_ALREADY_EXISTS") {
      res.writeHead(409, {
        "Content-Type": "application/json",
      });
      res.end(
        JSON.stringify({
          message: "Cet email existe déjà",
        }),
      );
      return;
    }
    if (error.message === "INVALID_JSON") {
      res.writeHead(400, {
        "Content-Type": "application/json",
      });
      res.end(
        JSON.stringify({
          message: "JSON invalide",
        }),
      );
      return;
    }
    console.error(error);
    res.writeHead(500, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        message: "Erreur serveur",
      }),
    );
  }
}
async function login(req, res) {
  try {
    const body = await readBody(req);
    const { email, password } = body;
    if (!email || !password) {
      res.writeHead(400, {
        "Content-Type": "application/json",
      });
      res.end(
        JSON.stringify({
          message: "Email et password sont obligatoires",
        }),
      );
      return;
    }
    const result = await authService.login(email, password);
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify(result));
  } catch (error) {
    if (error.message === "INVALID_CREDENTIALS") {
      res.writeHead(401, {
        "Content-Type": "application/json",
      });
      res.end(
        JSON.stringify({
          message: "Email ou mot de passe incorrect",
        }),
      );
      return;
    }
    if (error.message === "INVALID_JSON") {
      res.writeHead(400, {
        "Content-Type": "application/json",
      });
      res.end(
        JSON.stringify({
          message: "JSON invalide",
        }),
      );
      return;
    }
    console.error(error);
    res.writeHead(500, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        message: "Erreur serveur",
      }),
    );
  }
}
module.exports = {
  register,
  login,
};
