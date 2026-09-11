import { useState } from "react";
import useAuth from "../hooks/useAuth";
function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuth();
  async function handleSubmit(event) {
    event.preventDefault();
    const success = await login(email, password);
    if (success) {
      onLogin();
    }
  }
  return (
    <div className="todo-container">
      <h1>Connexion</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
export default Login;
