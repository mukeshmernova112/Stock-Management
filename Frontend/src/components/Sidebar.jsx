import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  HomeIcon,
  ClipboardListIcon,
  UsersIcon,
  ChartBarIcon,
  CogIcon,
  LogoutIcon,
  MenuIcon,
} from "@heroicons/react/outline";

export default function Sidebar({ isOpen, setIsOpen, setIsAuthenticated }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  // Logout handler
  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false); // Update parent auth state
    navigate("/login", { replace: true });
  };

  // Sidebar menu items
  const menuItems = [
    { name: "Dashboard", icon: HomeIcon, path: "/home/dashboard" },
    { name: "Stocks", icon: ClipboardListIcon, path: "/home/stocks" },
    { name: "Reports", icon: ChartBarIcon, path: "/home/reports" },
    { name: "Settings", icon: CogIcon, path: "/home/settings" },
  ];

  // Only show Users menu if admin
  if (user?.role === "admin") {
    menuItems.splice(2, 0, { name: "Users", icon: UsersIcon, path: "/home/users" });
  }

  return (
    <div
      className={`h-screen bg-white shadow-md flex flex-col transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Logo & Toggle */}
      <div className="flex items-center justify-between p-4 border-b">
        <span className={`font-bold text-lg ${!isOpen && "hidden"}`}>WorthyTen</span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Menu Links */}
      <nav className="flex-1 mt-4 flex flex-col gap-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 p-3 mx-2 rounded hover:bg-gray-100 transition-colors ${
                isActive ? "bg-gray-200 font-semibold" : ""
              }`}
            >
              <Icon className="h-5 w-5 text-gray-600" />
              {isOpen && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-2 w-full rounded hover:bg-red-100 text-red-500 transition-colors"
        >
          <LogoutIcon className="h-5 w-5" />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}
