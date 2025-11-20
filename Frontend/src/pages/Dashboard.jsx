import { useEffect, useState } from "react";
import api from "../services/api";
import StockForm from "../components/StockForm";
import StockList from "../components/StockList";
import {
  ClipboardListIcon,
  TrendingUpIcon,
  LocationMarkerIcon,
  CubeIcon,
  PlusCircleIcon,
  DocumentReportIcon,
} from "@heroicons/react/outline";

export default function Dashboard() {
  const [stocks, setStocks] = useState([]);
  const [editStock, setEditStock] = useState(null);

  const fetchStocks = async () => {
    try {
      const res = await api.get("/stocks");
      setStocks(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Error fetching stocks");
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  // Sample summary data
  const summaryData = [
    { title: "Opening Stock", value: "120", icon: CubeIcon, bg: "bg-blue-50" },
    { title: "Closing Stock", value: "95", icon: TrendingUpIcon, bg: "bg-green-50" },
    { title: "Total Items", value: "220", icon: ClipboardListIcon, bg: "bg-purple-50" },
    { title: "Branches", value: "5", icon: LocationMarkerIcon, bg: "bg-yellow-50" },
  ];

  return (
    <div className="p-6 bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Inventory Dashboard</h1>
        <p className="text-gray-600">Track, manage, and optimize stock in real-time.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2 lg:grid-cols-4">
        {summaryData.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`${item.bg} p-5 rounded-lg shadow hover:shadow-xl transition`}
            >
              <Icon className="w-8 h-8 mb-2 text-gray-700" />
              <h2 className="text-sm text-gray-500">{item.title}</h2>
              <p className="text-2xl font-bold text-gray-700">{item.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2 lg:grid-cols-2">
        <div
          onClick={() => setEditStock(null)}
          className="p-6 text-center text-white transition bg-blue-500 rounded-lg shadow cursor-pointer hover:shadow-2xl"
        >
          <PlusCircleIcon className="w-10 h-10 mx-auto mb-2" />
          <h3 className="text-lg font-bold">Add New Stock</h3>
          <p className="mt-1 text-sm">Add fresh stock items with full details.</p>
        </div>

        <div
          onClick={() => alert("Feature Coming Soon!")}
          className="p-6 text-center text-white transition bg-purple-500 rounded-lg shadow cursor-pointer hover:shadow-2xl"
        >
          <DocumentReportIcon className="w-10 h-10 mx-auto mb-2" />
          <h3 className="text-lg font-bold">View Reports</h3>
          <p className="mt-1 text-sm">Analyze performance and stock trends.</p>
        </div>
      </div>

      {/* Stock Management Panels */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Form Section */}
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="mb-4 text-xl font-semibold">Stock Form</h2>
          <StockForm fetchStocks={fetchStocks} editStock={editStock} setEditStock={setEditStock} />
        </div>

        {/* Stock List Section */}
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="mb-4 text-xl font-semibold">Stock List</h2>
          <StockList stocks={stocks} fetchStocks={fetchStocks} setEditStock={setEditStock} />
        </div>
      </div>
    </div>
  );
}
