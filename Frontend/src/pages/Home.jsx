import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HomeIcon,
  ClipboardListIcon,
  UsersIcon,
  ChartBarIcon,
  LogoutIcon,
  MenuIcon,
  BellIcon,
  QrcodeIcon,
} from "@heroicons/react/outline";

import Dashboard from "./Dashboard";
import Reports from "../components/Reports";
import BarcodeScanner from "../components/BarcodeScanner";
import UserManagement from "../components/UserManagement";

export default function Home({ setIsAuthenticated }) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const notifications = [
    "Low stock alert: Product 'A' running out!",
    "New update available",
    "2 items pending approval"
  ];

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    navigate("/login", { replace: true });
  };

  if (!user) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  const menuItems = [
    { name: "Dashboard", key: "dashboard", icon: HomeIcon },
    { name: "Stocks", key: "stocks", icon: ClipboardListIcon },
    ...(user.role === "admin" ? [{ name: "Users", key: "users", icon: UsersIcon }] : []),
    { name: "Barcode", key: "barcodescanner", icon: QrcodeIcon },
    { name: "Reports", key: "reports", icon: ChartBarIcon },
  ];

  // Sample stock data (replace with actual fetched data)
  const sampleStocks = [
    { itemName: "Product A", quantity: 50, openingStock: 60, closingStock: 50, branch: "Main" },
    { itemName: "Product B", quantity: 20, openingStock: 25, closingStock: 20, branch: "Warehouse" },
  ];

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
            <MenuIcon className="w-6 h-6 text-gray-600 transition-transform hover:rotate-90" />
          </button>
        </div>

        <nav className="flex flex-col flex-1 mt-4">
          {menuItems.map(({ icon: Icon, key, name }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-3 p-3 mx-2 rounded-lg mt-1 transition-all 
              ${activeTab === key
                  ? "bg-blue-500 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Icon className="w-5 h-5" />
              {isOpen && <span>{name}</span>}
            </button>
          ))}
        </nav>

        <div className="flex items-center justify-between px-4 py-3 mt-auto border-t">
          {/* Notifications */}
          <button onClick={() => setShowNotifications(!showNotifications)}>
            <BellIcon className="w-6 h-6 text-gray-500 transition hover:text-blue-600" />
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-500 hover:text-red-600"
          >
            <LogoutIcon className="w-5 h-5" />
            {isOpen && <span>Logout</span>}
          </button>
        </div>

        {showNotifications && isOpen && (
          <div className="absolute right-0 w-64 p-3 bg-white rounded-lg shadow-lg bottom-16">
            <h4 className="mb-2 font-semibold">Notifications</h4>
            {notifications.map((note, idx) => (
              <p key={idx} className="py-1 text-sm border-b last:border-none">
                {note}
              </p>
            ))}
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold capitalize">{activeTab}</h1>
          <span className="px-3 py-1 text-sm bg-gray-200 rounded-full">
            Role: <b>{user.role}</b>
          </span>
        </div>

        {/* Tab Section */}
        {activeTab === "dashboard" && <DashboardSection user={user} />}
        {activeTab === "stocks" && (
          <TabSection title="Stock Management">
            <Dashboard />
          </TabSection>
        )}
        {activeTab === "users" && (
          <TabSection title="User Management">
            <UserManagement />
          </TabSection>
        )}
        {activeTab === "barcodescanner" && (
          <TabSection title="Barcode Scanner">
            <BarcodeScanner />
          </TabSection>
        )}
        {activeTab === "reports" && (
          <TabSection title="Reports">
            <Reports stocks={sampleStocks} />
          </TabSection>
        )}
      </main>
    </div>
  );
}

/* Dashboard Section with Cards & Features */
const DashboardSection = ({ user }) => {
  const features = [
    "Opening & Closing Stock Tracking",
    "Barcode Scanning Support",
    "Multi-Location Inventory Control",
    "Stock In/Out Management",
    "Real-Time Dashboard & Reports",
    "Simple & User-Friendly Interface",
  ];

  return (
    <>
      {/* Welcome Card */}
      <div className="p-6 mb-6 text-white rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-purple-700">
        <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
        <p className="text-lg">Manage inventory & track reports effortlessly.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Opening Stock", value: "120" },
          { title: "Closing Stock", value: "95" },
          { title: "Total Items", value: "220" },
          { title: "Branches", value: "5" },
        ].map(({ title, value }) => (
          <div
            key={title}
            className="p-5 transition bg-white rounded-lg shadow hover:shadow-xl hover:scale-105"
          >
            <h2 className="text-sm text-gray-500">{title}</h2>
            <p className="text-2xl font-bold text-gray-700">{value}</p>
          </div>
        ))}
      </div>

      {/* Features Section */}
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">✨ Key Features</h2>
        <ul className="space-y-3">
          {features.map((feature, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 p-3 transition bg-white rounded-lg shadow hover:shadow-lg"
            >
              <span className="text-xl font-bold text-green-500">✔</span>
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

/* Generic Tab Wrapper */
function TabSection({ title, children }) {
  return (
    <div className="animate-fadeIn">
      <h2 className="mb-4 text-2xl font-bold">{title}</h2>
      <div className="p-6 bg-white rounded-lg shadow">{children}</div>
    </div>
  );
}
