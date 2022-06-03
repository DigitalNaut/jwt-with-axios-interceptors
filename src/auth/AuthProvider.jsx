import { createContext, useState, useEffect } from "react";
import {
  getRefreshToken,
  getUser,
  removeRefreshToken,
  saveRefreshToken,
} from "./jwtHelper";
import { loginUser } from "../api";
import useRefreshToken from "../hooks/useRefreshToken";
// import useAxios from "../hooks/useAxios";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const refresh = useRefreshToken();
  const [user, setUser] = useState();
  const [error, setError] = useState();

  function saveAuthentication({ token, refreshToken }) {
    const username = getUser(token);
    if (!username) {
      setError("No se pudo obtener el usuario del token.");
      console.log("No se pudo obtener el usuario del token", token);
      return;
    }

    saveRefreshToken(refreshToken);
    setUser({
      username,
      token,
    });
  }

  function login({ username }) {
    setError();

    return new Promise(async function (resolve, reject) {
      console.log("Haciendo login con usuario", username);

      try {
        // La llamada real sería un POST con el payload de {user, password}
        const { status, data } = await loginUser({ username });

        if (status === 200) {
          saveAuthentication(data);
          resolve();
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  function logout(expired) {
    setUser(null);
    removeRefreshToken();

    if (expired) setError("Tu sesión ha expirado.");
  }

  useEffect(
    function initUserSession() {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        logout();
        return;
      }

      const controller = new AbortController();
      (async function refreshTheToken() {
        try {
          const { token } = await refresh({ signal: controller.signal });

          saveAuthentication({ token, refreshToken });
        } catch (error) {
          if (error.name === "CanceledError") return;

          logout(true);
        }
      })();

      return () => controller.abort();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <AuthContext.Provider value={{ user, login, logout, saveAuthentication }}>
      {error && <p className="notification warning">⚠ {error}</p>}
      {children}
    </AuthContext.Provider>
  );
}
