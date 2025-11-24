// src/api.js
import axios from "axios";

// 🌍 Set base API URL using environment variable
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === "production"
    ? "https://stock-management-1-v9hz.onrender.com/api"
    : "http://localhost:5000/api");

// 🛠 Create Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // Increased timeout for Render cold-start delay
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 🔥 Allow cookies & auth if any
});

// 🛡 Attach JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔄 Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 📡 Backend unreachable / CORS / Network issue
    if (!error.response) {
      return Promise.reject(
        new Error("📡 Backend server unreachable! Please try again later.")
      );
    }

    // ⛔ Unauthorized: token expired
    if (error.response.status === 401) {
      localStorage.clear(); // Token + User remove
      window.location.href = "/login"; // Redirect to login
    }

    // 🚫 Forbidden
    if (error.response.status === 403) {
      return Promise.reject(
        new Error("🚫 Access forbidden. Contact admin.")
      );
    }

    // ❌ Server error
    if (error.response.status >= 500) {
      return Promise.reject(
        new Error("🔥 Server error! Please try again later.")
      );
    }

    // 🔁 Return original error for other cases
    return Promise.reject(error);
  }
);

export default api;
