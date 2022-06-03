import axios from "./axios";

export function registerUser({ username }) {
  return axios.post(`/register`, {
    username,
  });
}

export function loginUser({ username }) {
  return axios.post(`/login`, {
    username,
  });
}

export function fetchUsers(config) {
  return axios.get(`/users`, config);
}

export function fetchNewToken(data, config) {
  return axios.post(
    `/refreshToken`,
    {
      ...data,
    },
    config
  );
}
