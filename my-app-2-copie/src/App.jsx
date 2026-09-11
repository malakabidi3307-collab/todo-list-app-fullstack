import { useState } from "react";
import Todo from "./pages/Todo";
import Login from "./pages/Login";
import Register from "./pages/Register";
import useAuth from "./hooks/useAuth";
import "./App.css";
function App() {
  const [page, setPage] = useState("login");
  const [loggedIn, setLoggedIn] = useState(false);
  const { logout } = useAuth();
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
