import { useState } from "react";
import useTodo from "../hooks/useTodo";
import "./Todo.css";

function Todo() {
  const {
    todos,
    loading,
    error,
    createTodo,
    deleteTodo,
    updateTodo
  } = useTodo();

  const [title, setTitle] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    await createTodo(title);

    setTitle("");
  }

  return (
    <div className="todo-page">
      <div className="todo-container">
        <h1 className="todo-title">Ma Todo List</h1>

        <p className="todo-subtitle">
          Organisez vos tâches et restez productif
        </p>

        <form
          className="todo-form"
          onSubmit={handleSubmit}
        >
          <input
            className="todo-input"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Écrivez une nouvelle tâche..."
          />

          <button
            className="todo-add-button"
            type="submit"
          >
            Ajouter
          </button>
        </form>

        {loading && (
          <p className="todo-loading">
            Chargement des tâches...
          </p>
        )}

        {error && (
          <p className="todo-error">
            {error}
          </p>
        )}

        <ul className="todo-list">
          {todos.map((todo) => (
            <li
              className="todo-item"
              key={todo.id}
            >
              <span className="todo-text">
                {todo.title}
              </span>

              <div className="todo-actions">
                <button
                  className="todo-delete-button"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Supprimer
                </button>

                <button
                  className="todo-complete-button"
                  onClick={() =>
                    updateTodo(
                      todo.id,
                      todo.title,
                      !todo.completed
                    )
                  }
                >
                  {todo.completed
                    ? "Marquer non terminée"
                    : "Terminer"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Todo;