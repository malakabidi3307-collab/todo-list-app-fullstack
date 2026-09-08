const todoController = require("../controllers/todoController");

function todoRoutes(req, res) {
  const url = new URL(
    req.url,
    `http://${req.headers.host}`
  );

  const pathname = url.pathname;

  // GET /todos
  if (req.method === "GET" && pathname === "/todos") {
    todoController.getTodos(req, res);
    return;
  }

  // GET /todos/:id
  if (req.method === "GET" && pathname.startsWith("/todos/")) {
    const id = pathname.split("/")[2];

    todoController.getTodoById(req, res, id);
    return;
  }

  // POST /todos
  if (req.method === "POST" && pathname === "/todos") {
    todoController.createTodo(req, res);
    return;
  }

  // PUT /todos/:id
  if (req.method === "PUT" && pathname.startsWith("/todos/")) {
    const id = pathname.split("/")[2];

    todoController.updateTodo(req, res, id);
    return;
  }

  // DELETE /todos/:id
  if (
    req.method === "DELETE" &&
    pathname.startsWith("/todos/")
  ) {
    const id = pathname.split("/")[2];

    todoController.deleteTodo(req, res, id);
    return;
  }

  res.writeHead(404, {
    "Content-Type": "application/json"
  });

  res.end(
    JSON.stringify({
      message: "Route introuvable"
    })
  );
}

module.exports = todoRoutes;