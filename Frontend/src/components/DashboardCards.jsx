import React from "react";

/**
 * Reusable card for metrics or actions.
 * type: "metric" or "action" (controls styling)
 */
export default function DashboardCard({ title, value, description, onClick, type = "metric" }) {
  const isMetric = type === "metric";
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`cursor-pointer transition shadow-sm hover:shadow-lg rounded-lg p-5 ${
        isMetric ? "bg-white" : "bg-gradient-to-r from-gray-800 to-gray-900 text-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <h4 className={`text-sm ${isMetric ? "text-gray-500" : "text-white/90"}`}>{title}</h4>
        {isMetric && <span className="text-xs text-gray-400">as of today</span>}
      </div>

      <div className="mt-3">
        {isMetric ? (
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        ) : (
          <p className="text-lg font-semibold">{title}</p>
        )}
      </div>

      {description && (
        <p className={`mt-2 text-sm ${isMetric ? "text-gray-600" : "text-white/80"}`}>
          {description}
        </p>
      )}
    </div>
  );
}
