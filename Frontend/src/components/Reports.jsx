import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Reports({ stocks }) {
  const data = stocks.map(s => ({ name: s.itemName, quantity: s.quantity }));

  return (
    <div className="bg-white p-4 rounded shadow mt-4">
      <h3 className="font-bold mb-4">Stock Report</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="quantity" fill="#4ade80" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
