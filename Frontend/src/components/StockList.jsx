export default function StockList({ stocks, fetchStocks, setEditStock }) {
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this stock?")) return;
    try {
      await api.delete(`/stocks/${id}`);
      fetchStocks();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Error deleting stock");
    }
  };

  return (
    <div className="mt-4 bg-white rounded shadow overflow-x-auto">
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
          {stocks.map(stock => (
            <tr key={stock._id} className="border-b">
              <td className="p-2">{stock.itemName}</td>
              <td className="p-2">{stock.quantity}</td>
              <td className="p-2">{stock.location}</td>
              <td className="p-2 flex gap-2">
                <button onClick={() => setEditStock(stock)} className="bg-yellow-400 p-1 rounded">Edit</button>
                <button onClick={() => handleDelete(stock._id)} className="bg-red-500 p-1 rounded text-white">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
