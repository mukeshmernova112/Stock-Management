import { useState } from "react";

export default function BarcodeScanner() {
  const [barcode, setBarcode] = useState("");
  const [scanHistory, setScanHistory] = useState([]);

  // Simulate scanning an item
  const handleScan = () => {
    if (!barcode.trim()) {
      alert("Please enter a barcode before scanning.");
      return;
    }

    // Example: You could call an API here to fetch product details by barcode
    const scannedItem = {
      code: barcode,
      name: `Product ${barcode.slice(-4)}`, // dummy product name
      timestamp: new Date().toLocaleTimeString(),
    };

    setScanHistory([scannedItem, ...scanHistory]);
    setBarcode("");

    alert(`✅ Scanned: ${scannedItem.name} (${scannedItem.code})`);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-2xl font-bold">📷 Barcode Scanner</h2>

      {/* Barcode Input Section */}
      <div className="flex flex-col items-start gap-3 mb-6 md:flex-row md:items-center">
        <input
          type="text"
          placeholder="Scan or type barcode"
          className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
        />
        <button
          onClick={handleScan}
          className="px-4 py-2 text-white transition bg-blue-500 rounded hover:bg-blue-600"
        >
          Scan
        </button>
      </div>

      {/* Scan Instructions / Features */}
      <div className="mb-6">
        <h3 className="mb-2 text-lg font-semibold">🔹 Features:</h3>
        <ul className="space-y-1 text-gray-700 list-disc list-inside">
          <li>Scan barcodes manually or using a physical scanner</li>
          <li>Automatic history tracking of scanned items</li>
          <li>Timestamp logged for each scan</li>
          <li>Alert notifications for scanned products</li>
          <li>Ready for integration with inventory database or API</li>
          <li>Simple and user-friendly interface</li>
        </ul>
      </div>

      {/* Scan History */}
      <div>
        <h3 className="mb-2 text-lg font-semibold">📝 Scan History</h3>
        {scanHistory.length === 0 ? (
          <p className="text-gray-500">No items scanned yet.</p>
        ) : (
          <div className="overflow-auto border rounded max-h-64">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-gray-100">
                <tr>
                  <th className="px-3 py-2 border-b">#</th>
                  <th className="px-3 py-2 border-b">Barcode</th>
                  <th className="px-3 py-2 border-b">Product Name</th>
                  <th className="px-3 py-2 border-b">Time</th>
                </tr>
              </thead>
              <tbody>
                {scanHistory.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-3 py-2 border-b">{scanHistory.length - idx}</td>
                    <td className="px-3 py-2 border-b">{item.code}</td>
                    <td className="px-3 py-2 border-b">{item.name}</td>
                    <td className="px-3 py-2 border-b">{item.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Placeholder for future integration */}
      <div className="p-3 mt-6 rounded bg-blue-50">
        <p className="text-gray-700">
          🔹 Future enhancements: connect this scanner to your inventory database to automatically update stock, check item details, and trigger low-stock alerts.
        </p>
      </div>
    </div>
  );
}
