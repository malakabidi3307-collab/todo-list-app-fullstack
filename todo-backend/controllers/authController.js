const authService = require("../services/authService");
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(new Error("INVALID_JSON"));
      }
    });
    req.on("error", reject);
  });
}
function getCookie(req, cookieName) {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) {
    return null;
  }
  const cookies = cookieHeader.split(";");
  for (const cookie of cookies) {
    const [name, ...valueParts] = cookie.trim().split("=");
    if (name === cookieName) {
      return decodeURIComponent(valueParts.join("="));
    }
  }
  return null;
}
function getCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";
  return `HttpOnly; ${
    isProduction ? "Secure; SameSite=None" : "SameSite=Lax"
  }; Path=/`;
}
function setAuthCookies(res, accessToken, refreshToken) {
  const cookieOptions = getCookieOptions();
  res.setHeader("Set-Cookie", [
    `token=${encodeURIComponent(accessToken)}; ${cookieOptions}; Max-Age=900`,
    `refreshToken=${encodeURIComponent(
      refreshToken,
    )}; ${cookieOptions}; Max-Age=604800`,
  ]);
}
function setAccessTokenCookie(res, accessToken) {
  const cookieOptions = getCookieOptions();
  res.setHeader(
    "Set-Cookie",
    `token=${encodeURIComponent(accessToken)}; ${cookieOptions}; Max-Age=900`,
  );
}
function clearAuthCookies(res) {
  const cookieOptions = getCookieOptions();
  res.setHeader("Set-Cookie", [
    `token=; ${cookieOptions}; Max-Age=0`,
    `refreshToken=; ${cookieOptions}; Max-Age=0`,
  ]);
}
async function register(req, res) {
  try {
    const body = await readBody(req);
    const { username, email, password } = body;
    if (!username || !email || !password) {
      res.writeHead(400, {
        "Content-Type": "application/json",
      });
      res.end(
        JSON.stringify({
          message: "Username, email et password sont obligatoires",
        }),
      );
      return;
    }
    const result = await authService.register(username, email, password);
    setAuthCookies(res, result.accessToken, result.refreshToken);
    res.writeHead(201, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        user: result.user,
      }),
    );
  } catch (error) {
    if (error.message === "EMAIL_ALREADY_EXISTS") {
      res.writeHead(409, {
        "Content-Type": "application/json",
      });
      res.end(
        JSON.stringify({
          message: "Cet email existe déjà",
        }),
      );
      return;
    }
    if (error.message === "INVALID_JSON") {
      res.writeHead(400, {
        "Content-Type": "application/json",
      });
      res.end(
        JSON.stringify({
          message: "JSON invalide",
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
async function login(req, res) {
  try {
    const body = await readBody(req);
    const { email, password } = body;
    if (!email || !password) {
      res.writeHead(400, {
        "Content-Type": "application/json",
      });
      res.end(
        JSON.stringify({
          message: "Email et password sont obligatoires",
        }),
      );
      return;
    }
    const result = await authService.login(email, password);
    setAuthCookies(res, result.accessToken, result.refreshToken);
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        user: result.user,
      }),
    );
  } catch (error) {
    if (error.message === "INVALID_CREDENTIALS") {
      res.writeHead(401, {
        "Content-Type": "application/json",
      });
      res.end(
        JSON.stringify({
          message: "Email ou mot de passe incorrect",
        }),
      );
      return;
    }
    if (error.message === "INVALID_JSON") {
      res.writeHead(400, {
        "Content-Type": "application/json",
      });
      res.end(
        JSON.stringify({
          message: "JSON invalide",
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
async function refresh(req, res) {
  try {
    const refreshToken = getCookie(req, "refreshToken");
    if (!refreshToken) {
      res.writeHead(401, {
        "Content-Type": "application/json",
      });
      res.end(
        JSON.stringify({
          message: "Refresh token manquant",
        }),
      );
      return;
    }
    const accessToken = authService.refreshAccessToken(refreshToken);
    setAccessTokenCookie(res, accessToken);
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        message: "Access token renouvelé",
      }),
    );
  } catch (error) {
    if (error.message === "INVALID_REFRESH_TOKEN") {
      clearAuthCookies(res);
      res.writeHead(401, {
        "Content-Type": "application/json",
      });
      res.end(
        JSON.stringify({
          message: "Refresh token invalide ou expiré",
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
async function me(req, res) {
  try {
    const token = getCookie(req, "token");
    if (!token) {
      res.writeHead(401, {
        "Content-Type": "application/json",
      });
      res.end(
        JSON.stringify({
          message: "Authentification requise",
        }),
      );
      return;
    }
    const decoded = authService.getUserFromAccessToken(token);
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        user: {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
        },
      }),
    );
  } catch (error) {
    if (error.message === "INVALID_ACCESS_TOKEN") {
      res.writeHead(401, {
        "Content-Type": "application/json",
      });
      res.end(
        JSON.stringify({
          message: "Token invalide ou expiré",
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
function logout(req, res) {
  clearAuthCookies(res);
  res.writeHead(200, {
    "Content-Type": "application/json",
  });
  res.end(
    JSON.stringify({
      message: "Déconnexion réussie",
    }),
  );
}
module.exports = {
  register,
  login,
  refresh,
  me,
  logout,
};
