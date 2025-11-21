import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FingerPrintIcon } from "@heroicons/react/outline";
import api from "../services/api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    branch: "Chennai",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/register", form);
      alert(res.data.msg || "Registration successful!");
      navigate("/login");
    } catch (err) {
      const message =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        err.message ||
        "Registration failed";
      console.error("Registration Error:", message);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    const backendURL =
      import.meta.env.VITE_API_URL ||
      "https://stock-management-1-v9hz.onrender.com/api";
    window.location.href = `${backendURL}/auth/google`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="w-full max-w-lg overflow-hidden bg-white shadow-2xl rounded-3xl">
        {/* Top Banner */}
        <div className="relative flex items-center justify-center w-full h-40 overflow-hidden rounded-b-3xl">
  {/* Animated Gradient Background */}
  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-pink-500 to-orange-400 animate-gradient-x opacity-90"></div>

  {/* Overlay with subtle pattern */}
  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

  <h1 className="relative text-4xl font-extrabold text-center text-white md:text-5xl drop-shadow-xl animate-fadeIn">
    Join WorthyTen
  </h1>
</div>

        <div className="p-8 space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-700">
            Create Your Account
          </h2>
          <p className="text-center text-gray-500">
            Start managing your inventory with real-time tracking
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 transition border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 transition border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 transition border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />

            <div className="flex gap-4">
              <select
                name="branch"
                value={form.branch}
                onChange={handleChange}
                className="flex-1 p-3 transition border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="Chennai">Chennai</option>
                <option value="Coimbatore">Coimbatore</option>
                <option value="Trichy">Trichy</option>
                <option value="Madurai">Madurai</option>
              </select>

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="flex-1 p-3 transition border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 text-white font-semibold rounded-xl shadow-md transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {loading ? "Registering..." : "Sign Up"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-4">
            <hr className="flex-1 border-gray-300" />
            <span className="px-3 text-sm text-gray-400">or</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          {/* Google Register */}
          <button
            onClick={handleGoogleRegister}
            className="flex items-center justify-center w-full p-3 mb-2 font-semibold text-white transition bg-red-500 shadow rounded-xl hover:bg-red-600"
          >
            <FingerPrintIcon className="w-5 h-5 mr-2" />
            Continue with Google
          </button>

          <p className="text-center text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-500 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
