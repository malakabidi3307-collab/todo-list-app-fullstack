const todoRepository = require("../repositories/todoRepository");

// GET toutes les tâches
async function getTodos() {
  return await todoRepository.getTodos();
}

// GET une tâche
async function getTodoById(id) {
  return await todoRepository.getTodoById(id);
}

// CREATE une tâche
async function createTodo(title) {
  const todos = await todoRepository.getTodos();

  const newTodo = {
    id: todos.length + 1,
    title: title,
    completed: false
  };

  return await todoRepository.createTodo(newTodo);
}

// DELETE une tâche
async function deleteTodo(id) {
  return await todoRepository.deleteTodo(id);
}

// UPDATE une tâche
async function updateTodo(id, title, completed) {
  const existingTodo = await todoRepository.getTodoById(id);

  if (!existingTodo) {
    return null;
  }

  const updatedTodo = {
    id: id,
    title: title,
    completed: completed
  };

  return await todoRepository.updateTodo(id, updatedTodo);
}

module.exports = {
  getTodos,
  createTodo,
  getTodoById,
  deleteTodo,
  updateTodo
};