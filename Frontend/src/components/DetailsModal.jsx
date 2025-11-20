import React from "react";

export default function DetailsModal({ open, onClose, title, content }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl overflow-hidden bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="px-2 py-1 text-gray-600 rounded hover:text-gray-800"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4 text-gray-700">
          {/* content is expected to be JSX or string */}
          {typeof content === "string" ? <p>{content}</p> : content}
        </div>

        <div className="flex justify-end p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
