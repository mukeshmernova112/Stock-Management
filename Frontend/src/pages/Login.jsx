import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api"; // updated Axios path

export default function Login({ setIsAuthenticated }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false); // loading state
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);

      // Save token and user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Update parent auth state
      if (setIsAuthenticated) setIsAuthenticated(true);

      alert(res.data.msg || "Login successful!");

      // Navigate to home/dashboard
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl">
        <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 font-semibold text-white rounded-lg transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="flex items-center justify-center my-4">
          <span className="text-gray-400">or</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full p-3 mb-4 font-semibold text-white transition bg-red-500 rounded-lg hover:bg-red-600"
        >
          Continue with Google
        </button>

        <p className="text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
