import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("branch");
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <h1 className="font-bold">WorthyTen Stock</h1>
      <button onClick={logout} className="bg-red-500 px-4 py-1 rounded hover:bg-red-600">
        Logout
      </button>
    </nav>
  );
}
