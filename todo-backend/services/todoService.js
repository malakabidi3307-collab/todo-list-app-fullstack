const todoRepository = require("../repositories/todoRepository");
async function getTodos(userId) {
  return await todoRepository.getTodos(userId);
}
async function createTodo(title, userId) {
  if (!title || !title.trim()) {
    throw new Error("TITLE_REQUIRED");
  }
  return await todoRepository.createTodo(
    title.trim(),
    userId
  );
}
async function updateTodo(id, title, completed, userId) {
  if (!title || !title.trim()) {
    throw new Error("TITLE_REQUIRED");
  }
  return await todoRepository.updateTodo(
    id,
    title.trim(),
    Boolean(completed),
    userId
  );
}
async function deleteTodo(id, userId) {
  return await todoRepository.deleteTodo(
    id,
    userId
  );
}
module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo
};