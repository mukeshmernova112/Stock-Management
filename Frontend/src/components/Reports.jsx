import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function Reports({ stocks = [] }) {
  // Ensure stocks is always an array
  const safeStocks = Array.isArray(stocks) ? stocks : [];

  // Report 1: Stock Quantity by Item
  const quantityData = safeStocks.map((s) => ({
    name: s.itemName || "Unknown",
    quantity: s.quantity || 0,
  }));

  // Report 2: Opening vs Closing
  const stockFlowData = safeStocks.map((s) => ({
    name: s.itemName || "Unknown",
    opening: s.openingStock || 0,
    closing: s.closingStock || 0,
  }));

  // Report 3: Stock Distribution Across Branches
  const branchData = safeStocks.reduce((acc, stock) => {
    const branch = stock.branch || "Unknown";
    acc[branch] = (acc[branch] || 0) + (stock.quantity || 0);
    return acc;
  }, {});

  const pieData = Object.entries(branchData).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ["#4ade80", "#60a5fa", "#f87171", "#fbbf24", "#a78bfa"];

  return (
    <div className="p-6 mt-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-bold">📊 Reports & Analytics</h2>

      {/* Report 1 */}
      <div className="mb-8">
        <h3 className="mb-2 font-semibold">1️⃣ Stock Quantity by Item</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={quantityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantity" fill="#4ade80" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Report 2 */}
      <div className="mb-8">
        <h3 className="mb-2 font-semibold">2️⃣ Opening vs Closing Stock</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stockFlowData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="opening" stroke="#60a5fa" />
            <Line type="monotone" dataKey="closing" stroke="#f87171" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Report 3 */}
      <div>
        <h3 className="mb-2 font-semibold">3️⃣ Branch-wise Stock Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={110}
              fill="#8884d8"
              label
            >
              {pieData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
