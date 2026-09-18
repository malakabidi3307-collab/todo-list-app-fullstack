function roleMiddleware(...allowedRoles) {
  return function (req, res) {
    if (!req.user) {
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
    if (!allowedRoles.includes(req.user.role)) {
      res.writeHead(403, {
        "Content-Type": "application/json",
      });
      res.end(
        JSON.stringify({
          message: "Accès interdit",
        }),
      );
      return false;
    }
    return true;
  };
}
module.exports = roleMiddleware;
