import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import StockForm from "../components/StockForm";
import StockList from "../components/StockList";

export default function Dashboard() {
  const [stocks, setStocks] = useState([]);
  const [editStock, setEditStock] = useState(null);
  const navigate = useNavigate();

  const fetchStocks = async () => {
    try {
      const res = await api.get("/stocks");
      setStocks(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Error fetching stocks");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <StockForm fetchStocks={fetchStocks} editStock={editStock} setEditStock={setEditStock} />
      <StockList stocks={stocks} fetchStocks={fetchStocks} setEditStock={setEditStock} />
    </div>
  );
}
