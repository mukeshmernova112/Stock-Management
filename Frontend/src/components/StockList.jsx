import React from "react";
import api from "../services/api"; // updated Axios path

export default function StockList({ stocks, fetchStocks, setEditStock }) {
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this stock?")) return;

    try {
      await api.delete(`/stocks/${id}`); // Calls backend delete API
      fetchStocks(); // Refresh stocks after deleting
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Error deleting stock");
    }
  };

  return (
    <div className="mt-4 overflow-x-auto bg-white rounded shadow">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Item</th>
            <th className="p-2">Quantity</th>
            <th className="p-2">Location</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock._id} className="border-b">
              <td className="p-2">{stock.itemName}</td>
              <td className="p-2">{stock.quantity}</td>
              <td className="p-2">{stock.location}</td>
              <td className="flex gap-2 p-2">
                <button
                  onClick={() => setEditStock(stock)}
                  className="px-2 py-1 bg-yellow-400 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(stock._id)}
                  className="px-2 py-1 text-white bg-red-500 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
