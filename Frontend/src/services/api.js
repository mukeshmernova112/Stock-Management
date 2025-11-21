// src/api.js
import axios from "axios";

// 🔹 Automatically pick correct backend based on environment
const BASE_URL =
  import.meta.env.MODE === "production"
    ? "https://stock-management-1-v9hz.onrender.com/api" // 🔥 Production (Render)
    : "http://localhost:5000/api"; // 🧪 Local development

// 🔧 Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔒 Attach JWT token to every API request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🎯 Global response handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error (server not reachable / CORS issue)
    if (!error.response) {
      return Promise.reject(
        new Error("📡 Network error. Backend not reachable!")
      );
    }

    // 🔐 Token expired / unauthorized
    if (error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login"; // Auto redirect to login
    }

    // ❌ Other backend error
    return Promise.reject(error);
  }
);

export default api;
