import { useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

export default function BarcodeScanner({ onScan }) {
  const [data, setData] = useState("");

  return (
    <div className="my-4">
      <BarcodeScannerComponent
        onUpdate={(err, result) => {
          if (result) {
            setData(result.text);
            onScan(result.text);
          }
        }}
      />
      {data && <p className="mt-2">Scanned Code: {data}</p>}
    </div>
  );
}
