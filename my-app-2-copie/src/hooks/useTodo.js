import { useCallback, useEffect, useState } from "react";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
function useTodo() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  function getHeaders() {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }
  const getTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_URL}/todos`, {
        headers: getHeaders(),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || "Erreur lors de la récupération des tâches",
        );
      }
      setTodos(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);
  async function createTodo(title) {
    try {
      setError("");
      const response = await fetch(`${API_URL}/todos`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          title,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la création");
      }
      setTodos((previousTodos) => [...previousTodos, data]);
    } catch (error) {
      setError(error.message);
    }
  }
  async function deleteTodo(id) {
    try {
      setError("");
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la suppression");
      }
      setTodos((previousTodos) =>
        previousTodos.filter((todo) => todo.id !== id),
      );
    } catch (error) {
      setError(error.message);
    }
  }
  async function updateTodo(id, title, completed) {
    try {
      setError("");
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({
          title,
          completed,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la modification");
      }
      setTodos((previousTodos) =>
        previousTodos.map((todo) => (todo.id === id ? data : todo)),
      );
    } catch (error) {
      setError(error.message);
    }
  }
  useEffect(() => {
  if (localStorage.getItem("token")) {
    getTodos();
  }
}, [getTodos]);
  return {
    todos,
    loading,
    error,
    getTodos,
    createTodo,
    deleteTodo,
    updateTodo,
  };
}
export default useTodo;
