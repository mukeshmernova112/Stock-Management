import { useState } from "react";
import api from "../services/api";

export default function StockInOutModal({ stock, fetchStocks, closeModal }) {
  const [qty, setQty] = useState("");
  const [location, setLocation] = useState(stock.location || ""); // Pre-fill

  const handleSubmit = async () => {
    try {
      const updateData = {
        quantity: stock.quantity + parseInt(qty),
      };

      // Only send location if user wants to change it
      if (location !== stock.location) {
        updateData.location = location;
      }

      await api.put(`/stocks/${stock._id}`, updateData);
      fetchStocks();
      closeModal();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Error updating stock");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="p-6 bg-white rounded shadow w-96">
        <h3 className="mb-4 text-lg font-bold">{stock.itemName}</h3>

        {/* Quantity Input */}
        <input
          type="number"
          className="w-full p-2 mb-4 border"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          placeholder="Quantity to add/subtract"
        />

        {/* Location Input */}
        <select
          className="w-full p-2 mb-4 border"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="Chennai">Chennai</option>
          <option value="Trichy">Trichy</option>
          <option value="Madurai">Madurai</option>
          <option value="Coimbatore">Coimbatore</option>
          <option value="Salem">Salem</option>
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 text-white bg-blue-500 rounded">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
