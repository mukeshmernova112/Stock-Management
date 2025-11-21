import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  deploymentBaseURL: "https://stock-management-1-v9hz.onrender.com/api",
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
