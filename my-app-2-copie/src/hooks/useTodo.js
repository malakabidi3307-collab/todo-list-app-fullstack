import { useCallback, useEffect, useState } from "react";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
async function refreshAccessToken() {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    return response.ok;
  } catch (error) {
    console.error("Erreur refresh token :", error);
    return false;
  }
}
async function apiFetch(url, options = {}, retry = true) {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
  });
  if (response.status !== 401 || !retry) {
    return response;
  }
  const refreshed = await refreshAccessToken();
  if (!refreshed) {
    return response;
  }
  return fetch(url, {
    ...options,
    credentials: "include",
  });
}
function useTodo() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const getTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await apiFetch(`${API_URL}/todos`);
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
  const addTodo = async (title) => {
    try {
      setError("");
      const response = await apiFetch(`${API_URL}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'ajout de la tâche");
      }
      setTodos((currentTodos) => [...currentTodos, data]);
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    }
  };
  const updateTodo = async (id, updates) => {
    try {
      setError("");
      const response = await apiFetch(`${API_URL}/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || "Erreur lors de la modification de la tâche",
        );
      }
      setTodos((currentTodos) =>
        currentTodos.map((todo) => (todo._id === id ? data : todo)),
      );
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    }
  };
  const deleteTodo = async (id) => {
    try {
      setError("");
      const response = await apiFetch(`${API_URL}/todos/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || "Erreur lors de la suppression de la tâche",
        );
      }
      setTodos((currentTodos) =>
        currentTodos.filter((todo) => todo._id !== id),
      );
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    }
  };
  useEffect(() => {
    getTodos();
  }, [getTodos]);
  return {
    todos,
    loading,
    error,
    getTodos,
    addTodo,
    updateTodo,
    deleteTodo,
  };
}
export default useTodo;
