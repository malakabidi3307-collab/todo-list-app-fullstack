const adminController = require("../controllers/adminController");
async function adminRoutes(req, res) {
  const url = new URL(
    req.url,
    `http://${req.headers.host}`
  );
  
  if (
    req.method === "GET" &&
    url.pathname === "/admin/users"
  ) {
    return adminController.getUsers(req, res);
  }
  
  if (
    req.method === "DELETE" &&
    url.pathname.startsWith("/admin/users/")
  ) {
    const userId =
      url.pathname.split("/")[3];
    return adminController.deleteUser(
      req,
      res,
      userId
    );
  }
  if (
    req.method === "PUT" &&
    url.pathname.startsWith(
      "/admin/users/"
    ) &&
    url.pathname.endsWith("/role")
  ) {
    const parts =
      url.pathname.split("/");
    const userId = parts[3];
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", async () => {
      try {
        const data = JSON.parse(body);
        await adminController.updateRole(
          req,
          res,
          userId,
          data
        );
      } catch (error) {
        res.writeHead(400, {
          "Content-Type": "application/json",
        });
        res.end(
          JSON.stringify({
            message: "JSON invalide",
          })
        );
      }
    });
    return;
  }
  res.writeHead(404, {
    "Content-Type": "application/json",
  });
  res.end(
    JSON.stringify({
      message: "Route admin inexistante",
    })
  );
}
module.exports = adminRoutes;