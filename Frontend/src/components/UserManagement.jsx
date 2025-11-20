import { useState } from "react";

export default function UserManagement() {
  const [users, setUsers] = useState([
    { name: "Admin User", role: "admin" },
    { name: "John Doe", role: "manager" },
    { name: "Jane Smith", role: "staff" },
  ]);

  const [newUser, setNewUser] = useState({ name: "", role: "staff" });
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  // Add new user
  const handleAddUser = () => {
    if (!newUser.name.trim()) return;
    setUsers([newUser, ...users]);
    setNewUser({ name: "", role: "staff" });
  };

  // Remove user
  const handleRemoveUser = (index) => {
    const updated = [...users];
    updated.splice(index, 1);
    setUsers(updated);
  };

  // Filter and search users
  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // Role badge color
  const roleColors = {
    admin: "bg-red-500 text-white",
    manager: "bg-blue-500 text-white",
    staff: "bg-green-500 text-white",
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-2xl font-bold">👥 User Management</h2>

      {/* Add User Form */}
      <div className="flex flex-col items-center gap-3 mb-6 md:flex-row">
        <input
          type="text"
          placeholder="Enter user name"
          className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <select
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        >
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="staff">Staff</option>
        </select>
        <button
          onClick={handleAddUser}
          className="px-4 py-2 text-white transition bg-blue-500 rounded hover:bg-blue-600"
        >
          Add User
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col items-center gap-3 mb-4 md:flex-row">
        <input
          type="text"
          placeholder="Search users..."
          className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="staff">Staff</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="overflow-auto border rounded max-h-96">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b">#</th>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Role</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{idx + 1}</td>
                  <td className="px-4 py-2 border-b">{u.name}</td>
                  <td className="px-4 py-2 border-b">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${roleColors[u.role]}`}
                    >
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-b">
                    <button
                      onClick={() => handleRemoveUser(idx)}
                      className="px-2 py-1 text-white transition bg-red-500 rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Info */}
      <div className="p-3 mt-6 rounded bg-blue-50">
        <p className="text-gray-700">
          🔹 This page allows admin users to manage the system’s users.
          <br />
          🔹 Add, search, filter, and remove users efficiently.
          <br />
          🔹 Role badges are color-coded for quick recognition.
          <br />
          🔹 Backend integration can be added to persist changes in the database.
        </p>
      </div>
    </div>
  );
}
