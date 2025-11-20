import React, { useState } from "react";
import DashboardCards from "./DashboardCards"; // ✔ Corrected import name
import DetailsModal from "./DetailsModal";

/**
 * DashboardDetails: grid of metric cards + action cards.
 * Clicking any card opens a details modal with full information.
 */
export default function DashboardDetails() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState(null);

  // --- Data to display (use your real values / props instead) ---
  const metrics = [
    { key: "opening", title: "Opening Stock", value: "120", details: "Opening stock is the count of items at start of the day/period." },
    { key: "closing", title: "Closing Stock", value: "95", details: "Closing stock is the count of items at end of the day/period." },
    { key: "total", title: "Total Items", value: "220", details: "Total distinct items in inventory across branches." },
    { key: "branches", title: "Branches", value: "5", details: "Branches managed: Chennai, Coimbatore, Trichy, Madurai, Service Station." },
  ];

  const actions = [
    {
      key: "stocks",
      title: "Manage Stocks",
      desc: "Add, update, or remove stock items quickly with barcode support.",
      details: (
        <div className="space-y-2">
          <p>
            <strong>Features:</strong> Add new items, scan barcode to auto-fill, update quantity, transfer between branches.
          </p>
          <ul className="text-sm text-gray-700 list-disc list-inside">
            <li>Barcode scanning for quick entry.</li>
            <li>Stock in/out history per SKU.</li>
            <li>Branch transfer & location tracking.</li>
          </ul>
        </div>
      ),
    },
    {
      key: "users",
      title: "Manage Users",
      desc: "Admin-only: Create, edit, or remove users and assign roles.",
      details: (
        <div className="space-y-2">
          <p>
            Admins can create user accounts and assign roles (admin/user). Roles control who can add/update/delete stock across branches.
          </p>
          <ul className="text-sm text-gray-700 list-disc list-inside">
            <li>Role assignment: admin / user</li>
            <li>Branch association for each user</li>
            <li>Password reset & audit trail</li>
          </ul>
        </div>
      ),
    },
    {
      key: "reports",
      title: "Reports",
      desc: "Generate detailed stock, branch, and performance reports in real-time.",
      details: (
        <div className="space-y-2">
          <p>Generate and export reports by branch, SKU, period, or movement type (in/out).</p>
          <ul className="text-sm text-gray-700 list-disc list-inside">
            <li>Daily/Weekly/Monthly summaries</li>
            <li>Low-stock alerts & reorder suggestions</li>
            <li>CSV / PDF export</li>
          </ul>
        </div>
      ),
    },
  ];

  function openDetails(title, content) {
    setModalTitle(title);
    setModalContent(content);
    setModalOpen(true);
  }

  return (
    <div className="space-y-6">
      {/* Metrics grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.key} onClick={() => openDetails(m.title, m.details)}>
            <DashboardCard
              type="metric"
              title={m.title}
              value={m.value}
              description="Click for details"
            />
          </div>
        ))}
      </div>

      {/* Actions grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((a) => (
          <div key={a.key} onClick={() => openDetails(a.title, a.details)}>
            <DashboardCard type="action" title={a.title} description={a.desc} />
          </div>
        ))}
      </div>

      {/* Example: show a short history / preview */}
      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="mb-2 text-lg font-semibold">Recent Activity</h3>
        <ul className="space-y-1 text-sm text-gray-700">
          <li>• 2025-11-20: iPhone 13 Pro (Chennai) — +10 units (refurb)</li>
          <li>• 2025-11-20: Samsung S21 (Coimbatore) — -2 units (sold)</li>
          <li>• 2025-11-19: Stock transfer: 5 units from Trichy → Madurai</li>
        </ul>
      </div>

      {/* Modal for details */}
      <DetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        content={modalContent}
      />
    </div>
  );
}
