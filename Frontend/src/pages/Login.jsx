import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserIcon, LockClosedIcon, FingerPrintIcon } from "@heroicons/react/outline";
import api from "../services/api";

export default function Login({ setIsAuthenticated }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Handle normal login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      if (setIsAuthenticated) setIsAuthenticated(true);
      alert(res.data.msg || "Login successful!");
      navigate("/home", { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        err.message ||
        "Login failed";
      console.error("Login Error:", message);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth login
  const handleGoogleLogin = () => {
    const backendURL =
      import.meta.env.VITE_API_URL || "https://stock-management-1-v9hz.onrender.com/api";
    window.location.href = `${backendURL}/auth/google`;
  };

  // Auto-login after Google redirect with token
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      alert("Logged in with Google successfully!");
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
      <div className="relative w-full max-w-md p-10 overflow-hidden bg-white shadow-2xl rounded-2xl">
        {/* Decorative circles */}
        <div className="absolute bg-purple-300 rounded-full -top-20 -left-20 w-60 h-60 mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bg-pink-300 rounded-full -bottom-24 -right-24 w-72 h-72 mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

        {/* Form content */}
        <div className="relative z-10 flex flex-col items-center">
          <h1 className="mb-6 text-4xl font-extrabold text-gray-800">Welcome Back</h1>
          <p className="mb-6 text-center text-gray-500">
            Sign in to manage your inventory and track stocks in real-time
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-5">
            <div className="relative">
              <UserIcon className="absolute w-5 h-5 text-gray-400 top-3 left-3" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-3 pl-10 transition border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div className="relative">
              <LockClosedIcon className="absolute w-5 h-5 text-gray-400 top-3 left-3" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full p-3 pl-10 transition border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 font-semibold text-white rounded-lg transition shadow-lg ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center justify-center w-full my-4">
            <span className="text-gray-400">or</span>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-full p-3 mb-4 font-semibold text-white transition bg-red-500 rounded-lg shadow hover:bg-red-600"
          >
            <FingerPrintIcon className="w-5 h-5 mr-2" />
            Continue with Google
          </button>

          <p className="text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-purple-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
