import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080",
});

// 🔐 Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🚨 Handle errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🔥 If token expired or unauthorized
    if (error.response && error.response.status === 401) {
      console.log("Session expired. Logging out...");

      // remove token
      localStorage.removeItem("token");

      // redirect to login
      window.location.reload();
    }

    return Promise.reject(error);
  }
);

export default API;