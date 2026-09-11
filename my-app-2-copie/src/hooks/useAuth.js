import { useState } from "react";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function register(username, email, password) {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'inscription");
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  }
  async function login(email, password) {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la connexion");
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  }
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
  function getToken() {
    return localStorage.getItem("token");
  }
  function isAuthenticated() {
    return Boolean(localStorage.getItem("token"));
  }
  return {
    loading,
    error,
    register,
    login,
    logout,
    getToken,
    isAuthenticated,
  };
}
export default useAuth;
