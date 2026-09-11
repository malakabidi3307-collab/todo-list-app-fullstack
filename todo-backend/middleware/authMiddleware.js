const jwt = require("jsonwebtoken");
function authMiddleware(req, res) {
  const authorization = req.headers.authorization;
  if (!authorization) {
    res.writeHead(401, {
      "Content-Type": "application/json"
    });
    res.end(
      JSON.stringify({
        message: "Token manquant"
      })
    );
    return false;
  }
  const parts = authorization.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    res.writeHead(401, {
      "Content-Type": "application/json"
    });
    res.end(
      JSON.stringify({
        message: "Format du token invalide"
      })
    );
    return false;
  }
  const token = parts[1];
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    req.user = decoded;
    return true;
  } catch (error) {
    res.writeHead(401, {
      "Content-Type": "application/json"
    });
    res.end(
      JSON.stringify({
        message: "Token invalide ou expiré"
      })
    );
    return false;
  }
}
module.exports = authMiddleware;