import { useState } from "react";
import Todo from "./pages/Todo";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";
function App() {
  const [page, setPage] = useState(
    localStorage.getItem("token") ? "todo" : "login",
  );
  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem("token")),
  );
  function handleLogin() {
    setLoggedIn(true);
    setPage("todo");
  }
  function handleRegister() {
    setLoggedIn(true);
    setPage("todo");
  }
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLoggedIn(false);
    setPage("login");
  }
  return (
    <>
      <nav>
        <button onClick={() => setPage("login")}>Login</button>
        <button onClick={() => setPage("register")}>Register</button>
        {loggedIn && (
          <>
            <button onClick={() => setPage("todo")}>Todo List</button>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </nav>
      {page === "login" && <Login onLogin={handleLogin} />}
      {page === "register" && <Register onRegister={handleRegister} />}
      {page === "todo" && loggedIn && <Todo />}
    </>
  );
}
export default App;
