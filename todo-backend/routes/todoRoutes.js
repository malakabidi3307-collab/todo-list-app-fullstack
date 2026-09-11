const todoController = require("../controllers/todoController");
function todoRoutes(req, res) {
  const url = new URL(
    req.url,
    `http://${req.headers.host}`
  );
  const pathname = url.pathname;
  if (req.method === "GET" && pathname === "/todos") {
    return todoController.getTodos(req, res);
  }
  if (req.method === "POST" && pathname === "/todos") {
    return todoController.createTodo(req, res);
  }
  const idMatch = pathname.match(
    /^\/todos\/([^/]+)$/
  );
  if (idMatch) {
    const id = idMatch[1];
    if (req.method === "PUT") {
      return todoController.updateTodo(
        req,
        res,
        id
      );
    }
    if (req.method === "DELETE") {
      return todoController.deleteTodo(
        req,
        res,
        id
      );
    }
  }
  res.writeHead(404, {
    "Content-Type": "application/json"
  });
  res.end(
    JSON.stringify({
      message: "Route introuvable"
    })
  );
  return true;
}
module.exports = todoRoutes;