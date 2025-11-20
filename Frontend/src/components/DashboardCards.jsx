export default function DashboardCards({ stocks }) {
  const totalStock = stocks.reduce((acc, stock) => acc + stock.quantity, 0);
  const branches = [...new Set(stocks.map(s => s.location))];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold text-gray-600">Total Items</h3>
        <p className="text-2xl">{totalStock}</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold text-gray-600">Branches</h3>
        <p>{branches.join(", ")}</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold text-gray-600">Stock Categories</h3>
        <p>{stocks.length}</p>
      </div>
    </div>
  );
}
