import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export async function loginUser(credentials) {
  const response = await axios.post(`${API_URL}/login`, credentials);

  // Save JWT for future requests
  localStorage.setItem("token", response.data.token);

  // Attach token to all future axios requests
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${response.data.token}`;

  return response.data.user;
}

export function logoutUser() {
  localStorage.removeItem("token");
  delete axios.defaults.headers.common["Authorization"];
}
