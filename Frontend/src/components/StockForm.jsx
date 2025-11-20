import { useState, useEffect } from "react";
import api from "../services/api";

export default function StockForm({ fetchStocks, editStock, setEditStock }) {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    if (editStock) {
      setItemName(editStock.itemName);
      setQuantity(editStock.quantity);
      setLocation(editStock.location);
    }
  }, [editStock]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editStock) {
        await api.put(`/stocks/${editStock._id}`, { itemName, quantity, location });
        setEditStock(null);
      } else {
        await api.post("/stocks", { itemName, quantity, location });
      }
      setItemName(""); setQuantity(""); setLocation("");
      fetchStocks();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Error submitting stock");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mt-4">
      <div className="flex flex-wrap gap-4">
        <input type="text" placeholder="Item Name" className="border p-2 flex-1" value={itemName} onChange={(e)=>setItemName(e.target.value)} required />
        <input type="number" placeholder="Quantity" className="border p-2 w-32" value={quantity} onChange={(e)=>setQuantity(e.target.value)} required />
        <input type="text" placeholder="Location" className="border p-2 w-32" value={location} onChange={(e)=>setLocation(e.target.value)} required />
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">{editStock ? "Update" : "Add"}</button>
      </div>
    </form>
  );
}
