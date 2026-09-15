import { useCallback, useEffect, useState } from "react";
import Todo from "./pages/Todo";
import Login from "./pages/Login";
import Register from "./pages/Register";
import useAuth from "./hooks/useAuth";
import "./App.css";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
function App() {
  const [page, setPage] = useState("login");
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const { logout, refreshAccessToken } = useAuth();
  const checkAuth = useCallback(async () => {
    try {
      let response = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
      });
      if (response.status === 401) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          response = await fetch(`${API_URL}/auth/me`, {
            method: "GET",
            credentials: "include",
          });
        }
      }
      if (response.ok) {
        setLoggedIn(true);
        setPage("todo");
      } else {
        setLoggedIn(false);
        setPage("login");
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de la session :", error);
      setLoggedIn(false);
      setPage("login");
    } finally {
      setCheckingAuth(false);
    }
  }, [refreshAccessToken]);
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  function handleLogin() {
    setLoggedIn(true);
    setPage("todo");
  }
  function handleRegister() {
    setLoggedIn(true);
    setPage("todo");
  }
  async function handleLogout() {
    await logout();
    setLoggedIn(false);
    setPage("login");
  }
  if (checkingAuth) {
    return <p>Vérification de la session...</p>;
  }
  return (
    <>
      <nav>
        {!loggedIn && (
          <>
            <button onClick={() => setPage("login")}>Login</button>

            <button onClick={() => setPage("register")}>Register</button>
          </>
        )}
        {loggedIn && (
          <>
            <button onClick={() => setPage("todo")}>Todo List</button>

            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </nav>
      {page === "login" && !loggedIn && <Login onLogin={handleLogin} />}
      {page === "register" && !loggedIn && (
        <Register onRegister={handleRegister} />
      )}
      {page === "todo" && loggedIn && <Todo />}
    </>
  );
}
export default App;
