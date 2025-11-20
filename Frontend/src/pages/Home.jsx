import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HomeIcon,
  ClipboardListIcon,
  UsersIcon,
  ChartBarIcon,
  LogoutIcon,
  MenuIcon,
} from "@heroicons/react/outline";
import Dashboard from "./Dashboard";

export default function Home({ setIsAuthenticated }) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false); // update global auth state
    navigate("/login", { replace: true }); // navigate safely
  };

  if (!user) return null; // prevent rendering if user not found

  const menuItems = [
    { name: "Dashboard", key: "dashboard", icon: HomeIcon },
    { name: "Stocks", key: "stocks", icon: ClipboardListIcon },
    { name: "Reports", key: "reports", icon: ChartBarIcon },
  ];

  if (user.role === "admin") {
    menuItems.splice(2, 0, { name: "Users", key: "users", icon: UsersIcon });
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-white shadow-lg flex flex-col transition-all duration-300 ${
          isOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className={`font-bold text-xl ${!isOpen && "hidden"}`}>WorthyTen</span>
          <button onClick={() => setIsOpen(!isOpen)}>
            <MenuIcon className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <nav className="flex-1 flex flex-col mt-4 gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`flex items-center gap-3 p-3 mx-2 rounded hover:bg-blue-500 hover:text-white transition-colors ${
                  isActive ? "bg-blue-500 text-white font-semibold" : "text-gray-700"
                }`}
              >
                <Icon className="h-5 w-5" />
                {isOpen && <span>{item.name}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-2 w-full rounded hover:bg-red-100 text-red-500 transition-colors"
          >
            <LogoutIcon className="h-5 w-5" />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
<main className="flex-1 p-6 overflow-auto bg-gray-100">

  {/* Welcome Banner */}
  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-lg mb-6 flex flex-col sm:flex-row justify-between items-center">
    <div>
      <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}!</h1>
      <p className="text-lg">Manage your inventory efficiently and keep track of every detail.</p>
    </div>
    <img
      src="/assets/banner.png"
      alt="Banner"
      className="w-48 h-32 mt-4 sm:mt-0 object-cover rounded-lg shadow-lg"
    />
  </div>

  {/* Dashboard Summary Cards */}
  {activeTab === "dashboard" && (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-5 rounded-lg shadow hover:shadow-xl transition">
          <h2 className="text-sm text-gray-500 mb-2">Opening Stock</h2>
          <p className="text-2xl font-bold text-gray-700">120</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow hover:shadow-xl transition">
          <h2 className="text-sm text-gray-500 mb-2">Closing Stock</h2>
          <p className="text-2xl font-bold text-gray-700">95</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow hover:shadow-xl transition">
          <h2 className="text-sm text-gray-500 mb-2">Total Items</h2>
          <p className="text-2xl font-bold text-gray-700">220</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow hover:shadow-xl transition">
          <h2 className="text-sm text-gray-500 mb-2">Branches</h2>
          <p className="text-2xl font-bold text-gray-700">5</p>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div
          onClick={() => setActiveTab("stocks")}
          className="bg-blue-500 text-white p-6 rounded-lg shadow hover:shadow-2xl cursor-pointer transition text-center"
        >
          <ClipboardListIcon className="h-10 w-10 mx-auto mb-2" />
          <h3 className="font-bold text-lg">Manage Stocks</h3>
          <p className="text-sm mt-1">Add, update, or remove stock items quickly with barcode support.</p>
        </div>

        {user?.role === "admin" && (
          <div
            onClick={() => setActiveTab("users")}
            className="bg-green-500 text-white p-6 rounded-lg shadow hover:shadow-2xl cursor-pointer transition text-center"
          >
            <UsersIcon className="h-10 w-10 mx-auto mb-2" />
            <h3 className="font-bold text-lg">Manage Users</h3>
            <p className="text-sm mt-1">Admin-only: Create, edit, or remove users and assign roles.</p>
          </div>
        )}

        <div
          onClick={() => setActiveTab("reports")}
          className="bg-purple-500 text-white p-6 rounded-lg shadow hover:shadow-2xl cursor-pointer transition text-center"
        >
          <ChartBarIcon className="h-10 w-10 mx-auto mb-2" />
          <h3 className="font-bold text-lg">Reports</h3>
          <p className="text-sm mt-1">Generate detailed stock, branch, and performance reports in real-time.</p>
        </div>
      </div>

      {/* Features Overview */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-bold mb-4">Key Features of WorthyTen</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700">
          <div className="p-4 bg-blue-50 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="font-semibold mb-1">Opening & Closing Stock Tracking</h3>
            <p className="text-sm">Track your inventory accurately at all times with detailed stock in/out.</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="font-semibold mb-1">Barcode Scanning Support</h3>
            <p className="text-sm">Quickly scan items for faster stock updates and management.</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="font-semibold mb-1">Multi-Location Inventory Control</h3>
            <p className="text-sm">Manage multiple branches from a single dashboard seamlessly.</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="font-semibold mb-1">Stock In/Out Management</h3>
            <p className="text-sm">Easily record incoming and outgoing stock with real-time updates.</p>
          </div>
          <div className="p-4 bg-pink-50 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="font-semibold mb-1">Real-Time Dashboard & Reports</h3>
            <p className="text-sm">Access analytics and reports instantly for quick decision making.</p>
          </div>
          <div className="p-4 bg-indigo-50 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="font-semibold mb-1">Simple & User-Friendly Interface</h3>
            <p className="text-sm">Intuitive design for easy navigation and minimal learning curve.</p>
          </div>
        </div>
      </div>

      {/* Announcement Banner */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg shadow-md">
        <p className="font-medium">
          Announcement: New low-stock alert feature coming soon for all branches!
        </p>
      </div>
    </>
  )}

  {/* Stocks Tab */}
  {activeTab === "stocks" && (
    <div>
      <h2 className="text-2xl font-bold mb-4">Stock Management</h2>
      <Dashboard />
    </div>
  )}

  {/* Users Tab */}
  {activeTab === "users" && (
    <div>
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <p className="text-gray-500">Admin-only: Create, edit, or remove users here.</p>
    </div>
  )}

  {/* Reports Tab */}
  {activeTab === "reports" && (
    <div>
      <h2 className="text-2xl font-bold mb-4">Reports</h2>
      <p className="text-gray-500">Generate stock and branch reports with detailed analytics.</p>
    </div>
  )}
</main>

    </div>
  );
}
