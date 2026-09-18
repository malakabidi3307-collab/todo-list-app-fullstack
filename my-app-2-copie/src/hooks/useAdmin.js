import { useCallback } from "react";
const API_URL = process.env.REACT_APP_API_URL;
function useAdmin() {
  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }, []);
  const apiFetch = useCallback(
    async (url, options = {}, retry = true) => {
      let response;
      try {
        response = await fetch(`${API_URL}${url}`, {
          ...options,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
          },
        });
      } catch (error) {
        throw new Error("Impossible de contacter le serveur");
      }
      if (response.status === 401 && retry) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          return apiFetch(url, options, false);
        }
      }
      return response;
    },
    [refreshAccessToken],
  );
  const getUsers = useCallback(async () => {
    const response = await apiFetch("/admin/users");
    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        data.message || "Erreur lors de la récupération des utilisateurs",
      );
    }
    return data.users;
  }, [apiFetch]);
  const deleteUser = useCallback(
    async (userId) => {
      const response = await apiFetch(`/admin/users/${userId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la suppression");
      }
      return true;
    },
    [apiFetch],
  );
  const updateRole = useCallback(
    async (userId, role) => {
      const response = await apiFetch(`/admin/users/${userId}/role`, {
        method: "PUT",
        body: JSON.stringify({
          role,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || "Erreur lors de la modification du rôle",
        );
      }
      return data.user;
    },
    [apiFetch],
  );
  return {
    getUsers,
    deleteUser,
    updateRole,
  };
}
export default useAdmin;
