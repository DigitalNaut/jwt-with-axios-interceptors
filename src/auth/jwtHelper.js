import decode from "jwt-decode";

export function getTokenExpirationDate(token) {
  const decoded = decode(token);

  if (!decoded.exp) return null;

  const date = new Date(0);
  date.setUTCSeconds(decoded.exp);

  return date;
}

export function getRefreshToken() {
  // Recupera el token del localStorage
  return localStorage.getItem("refresh-token");
}

export function saveRefreshToken(token) {
  localStorage.setItem("refresh-token", token);
}

export function removeRefreshToken(token) {
  localStorage.removeItem("refresh-token");
}

export function isTokenExpired(token) {
  const date = getTokenExpirationDate(token);

  if (date === null) return false;

  return !(date.valueOf() > new Date().valueOf);
}

export function getUser(token) {
  try {
    return decode(token).username;
  } catch (error) {
    return null;
  }
}
