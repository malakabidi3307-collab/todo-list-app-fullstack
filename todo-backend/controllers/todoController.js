const todoService = require("../services/todoService");
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
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
  });
  res.end(JSON.stringify(data));
}
async function getTodos(req, res) {
  try {
    const todos = await todoService.getTodos(req.user.id);
    sendJson(res, 200, todos);
  } catch (error) {
    console.error(error);
    sendJson(res, 500, {
      message: "Erreur serveur",
    });
  }
}
async function createTodo(req, res) {
  try {
    const body = await readBody(req);
    const todo = await todoService.createTodo(body.title, req.user.id);
    sendJson(res, 201, todo);
  } catch (error) {
    if (error.message === "INVALID_JSON") {
      sendJson(res, 400, {
        message: "JSON invalide",
      });
      return;
    }
    if (error.message === "TITLE_REQUIRED") {
      sendJson(res, 400, {
        message: "Le titre est obligatoire",
      });
      return;
    }
    console.error(error);
    sendJson(res, 500, {
      message: "Erreur serveur",
    });
  }
}
async function updateTodo(req, res, id) {
  try {
    const body = await readBody(req);
    const todo = await todoService.updateTodo(
      id,
      body.title,
      body.completed,
      req.user.id,
    );
    if (!todo) {
      sendJson(res, 404, {
        message: "Tâche introuvable",
      });
      return;
    }
    sendJson(res, 200, todo);
  } catch (error) {
    if (error.message === "INVALID_JSON") {
      sendJson(res, 400, {
        message: "JSON invalide",
      });
      return;
    }
    if (error.message === "TITLE_REQUIRED") {
      sendJson(res, 400, {
        message: "Le titre est obligatoire",
      });
      return;
    }
    console.error(error);
    sendJson(res, 500, {
      message: "Erreur serveur",
    });
  }
}

async function deleteTodo(req, res, id) {
  try {
    const deleted = await todoService.deleteTodo(id, req.user.id);
    if (!deleted) {
      sendJson(res, 404, {
        message: "Tâche introuvable",
      });
      return;
    }
    sendJson(res, 200, {
      message: "Tâche supprimée",
    });
  } catch (error) {
    console.error(error);
    sendJson(res, 500, {
      message: "Erreur serveur",
    });
  }
}
module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
