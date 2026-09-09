const todoService = require("../services/todoService");

async function getTodos(req, res) {
  try {
    const todos = await todoService.getTodos();

    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    res.end(JSON.stringify(todos));
  } catch (error) {
    console.error(error);

    res.writeHead(500, {
      "Content-Type": "application/json",
    });

    res.end(
      JSON.stringify({
        message: "Erreur lors de la récupération des tâches",
      })
    );
  }
}

async function getTodoById(req, res, id) {
  try {
    const todo = await todoService.getTodoById(id);

    if (!todo) {
      res.writeHead(404, {
        "Content-Type": "application/json",
      });

      res.end(
        JSON.stringify({
          message: "Tâche introuvable",
        })
      );

      return;
    }

    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    res.end(JSON.stringify(todo));
  } catch (error) {
    console.error(error);

    res.writeHead(500, {
      "Content-Type": "application/json",
    });

    res.end(
      JSON.stringify({
        message: "Erreur lors de la récupération de la tâche",
      })
    );
  }
}

async function createTodo(req, res) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", async () => {
    try {
      const data = JSON.parse(body);

      const newTodo = await todoService.createTodo(data.title);

      res.writeHead(201, {
        "Content-Type": "application/json",
      });

      res.end(JSON.stringify(newTodo));
    } catch (error) {
      console.error(error);

      res.writeHead(500, {
        "Content-Type": "application/json",
      });

      res.end(
        JSON.stringify({
          message: "Erreur lors de la création",
        })
      );
    }
  });
}

async function updateTodo(req, res, id) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", async () => {
    try {
      const data = JSON.parse(body);

      const updatedTodo = await todoService.updateTodo(
        id,
        data.title,
        data.completed
      );

      if (!updatedTodo) {
        res.writeHead(404, {
          "Content-Type": "application/json",
        });

        res.end(
          JSON.stringify({
            message: "Tâche introuvable",
          })
        );

        return;
      }

      res.writeHead(200, {
        "Content-Type": "application/json",
      });

      res.end(JSON.stringify(updatedTodo));
    } catch (error) {
      console.error(error);

      res.writeHead(500, {
        "Content-Type": "application/json",
      });

      res.end(
        JSON.stringify({
          message: "Erreur lors de la modification",
        })
      );
    }
  });
}

async function deleteTodo(req, res, id) {
  try {
    const deletedTodo = await todoService.deleteTodo(id);

    if (!deletedTodo) {
      res.writeHead(404, {
        "Content-Type": "application/json",
      });

      res.end(
        JSON.stringify({
          message: "Tâche introuvable",
        })
      );

      return;
    }

    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    res.end(JSON.stringify(deletedTodo));
  } catch (error) {
    console.error(error);

    res.writeHead(500, {
      "Content-Type": "application/json",
    });

    res.end(
      JSON.stringify({
        message: "Erreur lors de la suppression",
      })
    );
  }
}

module.exports = {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
};