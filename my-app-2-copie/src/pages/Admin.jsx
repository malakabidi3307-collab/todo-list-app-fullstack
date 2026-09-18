import React, { useCallback, useEffect, useState } from "react";
import useAdmin from "../hooks/useAdmin";
import "./Admin.css";
function Admin() {
  const { getUsers, deleteUser, updateRole } = useAdmin();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [getUsers]);
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);
  const handleDelete = async (userId) => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cet utilisateur ?",
    );
    if (!confirmed) {
      return;
    }
    try {
      await deleteUser(userId);
      setUsers((currentUsers) =>
        currentUsers.filter((user) => user._id !== userId),
      );
    } catch (error) {
      alert(error.message);
    }
  };
  const handleRoleChange = async (userId, role) => {
    try {
      const updatedUser = await updateRole(userId, role);
      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user._id === updatedUser._id ? updatedUser : user,
        ),
      );
    } catch (error) {
      alert(error.message);
    }
  };
  if (loading) {
    return (
      <div className="admin-container">
        <div className="admin-loading">
          <p>Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Gestion des utilisateurs et des rôles</p>
      </div>
      
      {error && <div className="admin-error">{error}</div>}
     
      <div className="admin-section">
        <div className="admin-section-header">
          <h2>Gestion des utilisateurs</h2>

          <button className="admin-refresh-button" onClick={loadUsers}>
            Actualiser
          </button>
        </div>
       
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>

                  <td>
                    <span className="admin-user-name">{user.username}</span>
                  </td>

                  <td>
                    <span className="admin-user-email">{user.email}</span>
                  </td>

                  <td>
                    <select
                      className="admin-role-select"
                      value={user.role}
                      onChange={(event) =>
                        handleRoleChange(user._id, event.target.value)
                      }
                    >
                      <option value="user">user</option>

                      <option value="admin">admin</option>
                    </select>
                  </td>

                  <td>
                    <button
                      className="admin-delete-button"
                      onClick={() => handleDelete(user._id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default Admin;
