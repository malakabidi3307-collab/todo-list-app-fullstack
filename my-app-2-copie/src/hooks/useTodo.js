import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/todos";

function useTodo() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Récupérer toutes les tâches
  async function getTodos() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des tâches");
      }

      const data = await response.json();

      setTodos(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  // Créer une tâche
  async function createTodo(title) {
    try {
      setError("");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title
        })
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création");
      }

      const newTodo = await response.json();

      setTodos((previousTodos) => [
        ...previousTodos,
        newTodo
      ]);
    } catch (error) {
      setError(error.message);
    }
  }

  // Supprimer une tâche
  async function deleteTodo(id) {
    try {
      setError("");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      setTodos((previousTodos) =>
        previousTodos.filter((todo) => todo.id !== id)
      );
    } catch (error) {
      setError(error.message);
    }
  }

  // Modifier une tâche
  async function updateTodo(id, title, completed) {
    try {
      setError("");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          completed
        })
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la modification");
      }

      const updatedTodo = await response.json();

      setTodos((previousTodos) =>
        previousTodos.map((todo) =>
          todo.id === id ? updatedTodo : todo
        )
      );
    } catch (error) {
      setError(error.message);
    }
  }

  // Charger les tâches automatiquement
  useEffect(() => {
    getTodos();
  }, []);

  return {
    todos,
    loading,
    error,
    getTodos,
    createTodo,
    deleteTodo,
    updateTodo
  };
}

export default useTodo;