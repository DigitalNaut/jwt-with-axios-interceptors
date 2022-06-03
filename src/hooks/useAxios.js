import axios from "axios";
import { useEffect } from "react";
import { useAuth } from "./useAuth";
import useRefreshToken from "./useRefreshToken";

export default function useAxios() {
  const { user, logout, saveAuthentication } = useAuth();
  const refresh = useRefreshToken();

  useEffect(() => {
    // Permite incluir el token de sesión en cada petición
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (!config.headers.Authorization)
          config.headers.Authorization = `Bearer ${user?.token}`;

        return config;
      },
      (error) => {
        Promise.reject(error);
      }
    );

    // Vuelve a intentar la previa llamada en caso de estatus 403
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error.config;

        if (error.response?.status === 403) {
          prevRequest.isRetry = true;

          const { token, refreshToken } = await refresh();

          // Registramos el nuevo token
          prevRequest.headers.Authorization = `Bearer ${token}`;
          saveAuthentication({
            token,
            refreshToken,
          });

          // Realizamos la misma llamada de nuevo
          return axios(prevRequest);
        }

        if (error.response?.status === 401)
          if (prevRequest?.url === "/refreshToken") logout(true);

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [refresh, user, logout, saveAuthentication]);

  return axios;
}
