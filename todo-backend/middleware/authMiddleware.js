const jwt = require("jsonwebtoken");
function getTokenFromCookie(req) {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) {
    return null;
  }
  const cookies = cookieHeader.split(";");
  for (const cookie of cookies) {
    const [name, ...valueParts] = cookie.trim().split("=");
    if (name === "token") {
      return decodeURIComponent(valueParts.join("="));
    }
  }
  return null;
}
function authMiddleware(req, res) {
  const token = getTokenFromCookie(req);
  if (!token) {
    res.writeHead(401, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        message: "Authentification requise",
      }),
    );
    return false;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return true;
  } catch (error) {
    res.writeHead(401, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        message: "Token invalide ou expiré",
      }),
    );
    return false;
  }
}

module.exports = authMiddleware;
