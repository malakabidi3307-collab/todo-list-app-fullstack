const pool = require("../database/db");
async function getTodos() {
  const result = await pool.query(
    "SELECT * FROM todos ORDER BY id"
  );

  return result.rows;
}

async function getTodoById(id) {
  const result = await pool.query(
    "SELECT * FROM todos WHERE id = $1",
    [id]
  );

  return result.rows[0];
}

async function createTodo(todo) {
  const result = await pool.query(
    `INSERT INTO todos (title, completed)
     VALUES ($1, $2)
     RETURNING *`,
    [todo.title, todo.completed]
  );

  return result.rows[0];
}

async function deleteTodo(id) {
  const result = await pool.query(
    "DELETE FROM todos WHERE id = $1 RETURNING *",
    [id]
  );

  return result.rows[0] || null;
}

async function updateTodo(id, updatedTodo) {
  const result = await pool.query(
    `UPDATE todos
     SET title = $1, completed = $2
     WHERE id = $3
     RETURNING *`,
    [
      updatedTodo.title,
      updatedTodo.completed,
      id
    ]
  );

  return result.rows[0] || null;
}

module.exports = {
  getTodos,
  getTodoById,
  createTodo,
  deleteTodo,
  updateTodo
};