const Todo = require("../models/todoModel");
function formatTodo(todo) {
  return {
    id: todo._id.toString(),
    title: todo.title,
    completed: todo.completed
  };
}
async function getTodos(userId) {
  const todos = await Todo.find({ userId }).sort({
    createdAt: 1
  });
  return todos.map(formatTodo);
}
async function createTodo(title, userId) {
  const todo = await Todo.create({
    title,
    completed: false,
    userId
  });
  return formatTodo(todo);
}
async function updateTodo(id, title, completed, userId) {
  const todo = await Todo.findOneAndUpdate(
    {
      _id: id,
      userId
    },
    {
      title,
      completed
    },
    {
      new: true,
      runValidators: true
    }
  );
  return todo ? formatTodo(todo) : null;
}
async function deleteTodo(id, userId) {
  const todo = await Todo.findOneAndDelete({
    _id: id,
    userId
  });
  return todo !== null;
}
module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo
};