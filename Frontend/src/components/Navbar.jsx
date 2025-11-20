import { useNavigate } from "react-router-dom";
import { LogoutIcon } from "@heroicons/react/outline";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("branch");
    navigate("/login", { replace: true });
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 backdrop-blur-md">
      {/* Logo Section */}
      <h1 className="text-2xl font-bold tracking-wide text-white transition-transform duration-200 hover:scale-105">
        WorthyTen&nbsp;
        <span className="text-yellow-300">Stock</span>
      </h1>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="flex items-center gap-2 px-4 py-2 text-white transition-all duration-200 bg-red-500 rounded-lg shadow-md hover:bg-red-600 active:scale-95"
      >
        <LogoutIcon className="w-5 h-5" />
        <span className="font-medium">Logout</span>
      </button>
    </nav>
  );
}
