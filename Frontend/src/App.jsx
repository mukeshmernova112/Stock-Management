import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Components inside Home layout
import StockList from "./components/StockList";
import StockForm from "./components/StockForm";
import StockInOutModal from "./components/StockInOutModal";
import Reports from "./components/Reports";
import BarcodeScanner from "./components/BarcodeScanner";
import DashboardDetails from "./components/DashboardDetails";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  // Check auth status from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Default Route */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/home/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Public Routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/home/dashboard" replace />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/home/dashboard" replace />
            ) : (
              <Register setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />

        {/* Protected Parent Route */}
        <Route
          path="/home"
          element={
            isAuthenticated ? (
              <Home setIsAuthenticated={setIsAuthenticated} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          {/* Nested Routes inside Home Layout */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="stocks" element={<StockList />} />
          <Route path="stock-form" element={<StockForm />} />
          <Route path="stock-in-out" element={<StockInOutModal />} />
          <Route path="report" element={<Reports />} />
          <Route path="scanner" element={<BarcodeScanner />} />
          <Route path="details/:id" element={<DashboardDetails />} />

          {/* Default nested route */}
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Unknown Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
