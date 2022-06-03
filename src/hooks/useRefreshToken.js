import { fetchNewToken } from "../api";
import { getRefreshToken } from "../auth/jwtHelper";

export default function useRefreshToken() {
  return async function refresh(config) {
    try {
      const refreshToken = getRefreshToken();

      const { data } = await fetchNewToken({ refreshToken }, config);
      const { token } = data;

      return {
        token,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  };
}
