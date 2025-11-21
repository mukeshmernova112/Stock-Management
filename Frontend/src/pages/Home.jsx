import { useState, useEffect } from "react";
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
  CubeIcon,
  TrendingUpIcon,
  ClipboardCheckIcon,
  LocationMarkerIcon,
  PlusCircleIcon,
  DocumentReportIcon,
} from "@heroicons/react/outline";

import Dashboard from "./Dashboard";
import Reports from "../components/Reports";
import BarcodeScanner from "../components/BarcodeScanner";
import UserManagement from "../components/UserManagement";
import api from "../services/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";

export default function Home({ setIsAuthenticated }) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showNotifications, setShowNotifications] = useState(false);
  const [recentActivities, setRecentActivities] = useState([]);
  const [stocks, setStocks] = useState([]);
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const notifications = [
    "Low stock alert: Product 'A' running out!",
    "New update available",
    "2 items pending approval",
  ];

  // Fetch stocks & recent activities
  const fetchStocks = async () => {
    try {
      const res = await api.get("/stocks");
      setStocks(res.data);
      setRecentActivities(res.data.slice(-10).reverse()); // last 10 activities
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

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

  return (
    <div className="relative flex h-screen bg-gray-100">
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
              className={`flex items-center gap-3 p-3 mx-2 rounded-lg mt-1 transition-all ${
                activeTab === key ? "bg-blue-500 text-white shadow-md" : "text-gray-700 hover:bg-gray-200"
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
          <div className="absolute right-0 z-50 w-64 p-3 bg-white rounded-lg shadow-lg bottom-16">
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
      <main className="flex-1 p-6 overflow-auto bg-gray-50">
  {/* Header */}
  <div className="flex flex-col items-start justify-between gap-3 mb-6 md:flex-row md:items-center">
    <h1 className="text-3xl font-bold text-gray-800 capitalize">{activeTab}</h1>
    <span className="px-3 py-1 text-sm bg-gray-200 rounded-full shadow-sm">
      Role: <b>{user.role}</b>
    </span>
  </div>

  {/* ================== Conditional Rendering of Tabs ================== */}
  {activeTab === "dashboard" && (
    <>
      {/* Dashboard Section */}
      <DashboardSection user={user} stocks={stocks} />

      {/* Real-time Overview Cards */}
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold text-gray-700">Real-time Stock Overview</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <OverviewCard title="Opening Stock" value={stocks.length} icon={CubeIcon} color="text-blue-500" />
          <OverviewCard title="Closing Stock" value={stocks.reduce((acc, s) => acc + s.quantity, 0)} icon={TrendingUpIcon} color="text-green-500" />
          <OverviewCard title="Total Items" value={stocks.length} icon={ClipboardCheckIcon} color="text-purple-500" />
          <OverviewCard title="Branches" value={[...new Set(stocks.map(s => s.location))].length} icon={LocationMarkerIcon} color="text-yellow-500" />
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold text-gray-700">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ActionCard title="Add New Stock" description="Add fresh stock items with full details." icon={PlusCircleIcon} color="bg-blue-500" onClick={() => setActiveTab("stocks")} />
          <ActionCard title="View Reports" description="Analyze performance and stock trends." icon={DocumentReportIcon} color="bg-purple-500" onClick={() => setActiveTab("reports")} />
        </div>
      </section>

      {/* Recent Activity Table */}
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold text-gray-700">Recent Stock Activity</h2>
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-sm font-medium text-left text-gray-600">Item Name</th>
                <th className="px-4 py-2 text-sm font-medium text-left text-gray-600">Quantity</th>
                <th className="px-4 py-2 text-sm font-medium text-left text-gray-600">Location</th>
                <th className="px-4 py-2 text-sm font-medium text-left text-gray-600">Updated At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentActivities.map((stock, idx) => (
                <tr key={idx} className="transition hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-700">{stock.itemName}</td>
                  <td className="px-4 py-2 text-gray-700">{stock.quantity}</td>
                  <td className="px-4 py-2 text-gray-700">{stock.location}</td>
                  <td className="px-4 py-2 text-gray-500">{new Date(stock.updatedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 gap-6 mt-8 lg:grid-cols-2">
        <div className="p-4 bg-white rounded shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">Stock Quantity Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stocks}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="itemName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="quantity" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">Stock Distribution by Branch</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={aggregateByBranch(stocks)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="branch" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantity" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Stock Cards */}
      <section className="grid grid-cols-1 gap-6 mt-8 mb-12 sm:grid-cols-2 lg:grid-cols-3">
        {stocks.slice(0, 6).map((stock, idx) => (
          <div key={idx} className="p-4 transition bg-white rounded shadow hover:shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700">{stock.itemName}</h3>
            <p className="text-gray-500">Quantity: {stock.quantity}</p>
            <p className="text-gray-500">Location: {stock.location}</p>
            <p className="text-sm text-gray-400">Created: {new Date(stock.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </section>
    </>
  )}

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
      <Reports stocks={stocks} />
    </TabSection>
  )}
</main>

    </div>
  );
}

// =================== Helper Components ===================
const OverviewCard = ({ title, value, icon: Icon, color }) => (
  <div className="p-5 transition bg-white rounded-lg shadow hover:shadow-xl hover:scale-105">
    <Icon className={`w-8 h-8 mb-2 ${color}`} />
    <h3 className="text-sm text-gray-500">{title}</h3>
    <p className="text-2xl font-bold text-gray-700">{value}</p>
  </div>
);

const ActionCard = ({ title, description, icon: Icon, color, onClick }) => (
  <div
    onClick={onClick}
    className={`${color} p-6 text-center text-white transition rounded-lg shadow cursor-pointer hover:shadow-2xl hover:scale-105`}
  >
    <Icon className="w-10 h-10 mx-auto mb-2" />
    <h3 className="text-lg font-bold">{title}</h3>
    <p className="mt-1 text-sm">{description}</p>
  </div>
);

const DashboardSection = ({ user, stocks }) => {
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
          { title: "Opening Stock", value: stocks.length },
          { title: "Closing Stock", value: stocks.reduce((acc, s) => acc + s.quantity, 0) },
          { title: "Total Items", value: stocks.length },
          { title: "Branches", value: [...new Set(stocks.map(s => s.location))].length },
        ].map(({ title, value }) => (
          <OverviewCard key={title} title={title} value={value} icon={ClipboardListIcon} color="text-purple-500" />
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

// Tab wrapper
function TabSection({ title, children }) {
  return (
    <div className="animate-fadeIn">
      <h2 className="mb-4 text-2xl font-bold">{title}</h2>
      <div className="p-6 bg-white rounded-lg shadow">{children}</div>
    </div>
  );
}

// Aggregate by branch for BarChart
const aggregateByBranch = (stocks) => {
  const data = {};
  stocks.forEach((s) => {
    if (!data[s.location]) data[s.location] = 0;
    data[s.location] += s.quantity;
  });
  return Object.entries(data).map(([branch, quantity]) => ({ branch, quantity }));
};
