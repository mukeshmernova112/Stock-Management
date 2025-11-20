export default function StockInOutModal({ stock, fetchStocks, closeModal }) {
  const [qty, setQty] = useState("");

  const handleSubmit = async () => {
    try {
      await api.put(`/stocks/${stock._id}`, { quantity: stock.quantity + parseInt(qty) });
      fetchStocks();
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Error updating stock");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-96">
        <h3 className="text-lg font-bold mb-4">{stock.itemName}</h3>
        <input type="number" className="border p-2 w-full mb-4" value={qty} onChange={e=>setQty(e.target.value)} placeholder="Quantity to add/subtract" />
        <div className="flex justify-end gap-2">
          <button onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
        </div>
      </div>
    </div>
  );
}
