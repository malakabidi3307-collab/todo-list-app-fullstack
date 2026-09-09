const Todo = require("../models/todoModel");
const mongoose = require("mongoose");

function formatTodo(todo) {
  if (!todo) {
    return null;
  }

  return {
    id: todo._id.toString(),
    title: todo.title,
    completed: todo.completed,
  };
}

async function getTodos() {
  const todos = await Todo.find().sort({ _id: 1 }).lean();

  return todos.map(formatTodo);
}

async function getTodoById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  const todo = await Todo.findById(id).lean();

  return formatTodo(todo);
}

async function createTodo(todo) {
  const createdTodo = await Todo.create({
    title: todo.title,
    completed: todo.completed ?? false,
  });

  return formatTodo(createdTodo);
}

async function deleteTodo(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  const deletedTodo = await Todo.findByIdAndDelete(id).lean();

  return formatTodo(deletedTodo);
}

async function updateTodo(id, updatedTodo) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  const todo = await Todo.findByIdAndUpdate(
    id,
    {
      title: updatedTodo.title,
      completed: updatedTodo.completed,
    },
    {
      new: true,
      runValidators: true,
    }
  ).lean();

  return formatTodo(todo);
}

module.exports = {
  getTodos,
  getTodoById,
  createTodo,
  deleteTodo,
  updateTodo,
};