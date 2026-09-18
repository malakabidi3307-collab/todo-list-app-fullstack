const adminService = require("../services/adminService");
async function getUsers(req, res) {
  try {
    const users = await adminService.getAllUsers();
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        users,
      }),
    );
  } catch (error) {
    console.error(error);
    res.writeHead(500, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        message: "Erreur lors de la récupération des utilisateurs",
      }),
    );
  }
}
async function deleteUser(req, res, userId) {
  try {
    await adminService.deleteUser(req.user.id, userId);
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        message: "Utilisateur supprimé",
      }),
    );
  } catch (error) {
    if (error.message === "CANNOT_DELETE_SELF") {
      res.writeHead(400, {
        "Content-Type": "application/json",
      });
      res.end(
        JSON.stringify({
          message: "Un administrateur ne peut pas se supprimer lui-même",
        }),
      );
      return;
    }
    if (error.message === "USER_NOT_FOUND") {
      res.writeHead(404, {
        "Content-Type": "application/json",
      });
      res.end(
        JSON.stringify({
          message: "Utilisateur introuvable",
        }),
      );
      return;
    }
    console.error(error);
    res.writeHead(500, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        message: "Erreur lors de la suppression",
      }),
    );
  }
}
async function updateRole(req, res, userId, body) {
  try {
    const { role } = body;
    const user = await adminService.updateUserRole(userId, role);
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        message: "Rôle modifié",
        user,
      }),
    );
  } catch (error) {
    if (error.message === "INVALID_ROLE") {
      res.writeHead(400, {
        "Content-Type": "application/json",
      });
      res.end(
        JSON.stringify({
          message: "Rôle invalide",
        }),
      );
      return;
    }
    if (error.message === "USER_NOT_FOUND") {
      res.writeHead(404, {
        "Content-Type": "application/json",
      });
      res.end(
        JSON.stringify({
          message: "Utilisateur introuvable",
        }),
      );
      return;
    }
    console.error(error);
    res.writeHead(500, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        message: "Erreur serveur",
      }),
    );
  }
}
module.exports = {
  getUsers,
  deleteUser,
  updateRole,
};
