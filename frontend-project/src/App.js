import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Products from "./pages/Products";
import Sales from "./pages/Sales";
import Reports from "./pages/Reports";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

const Layout = ({ children }) => (
  <div className="flex h-screen bg-gray-50">
    <Navbar />
    <div className="flex-1 flex flex-col">
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <footer className="bg-white border-t border-gray-200 px-6 py-3 text-center text-xs text-gray-500 shrink-0">
        &copy; {new Date().getFullYear()} SalesPro Ltd. All rights reserved. | Sales Record Management System
      </footer>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>}
          />
          <Route
            path="/customers"
            element={<PrivateRoute><Layout><Customers /></Layout></PrivateRoute>}
          />
          <Route
            path="/products"
            element={<PrivateRoute><Layout><Products /></Layout></PrivateRoute>}
          />
          <Route
            path="/sales"
            element={<PrivateRoute><Layout><Sales /></Layout></PrivateRoute>}
          />
          <Route
            path="/reports"
            element={<PrivateRoute><Layout><Reports /></Layout></PrivateRoute>}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
