import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiShoppingCart, FiLogOut, FiMenu, FiX, FiChevronLeft
} from "react-icons/fi";

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/customers", label: "Customers" },
    { path: "/products", label: "Products" },
    { path: "/sales", label: "Sales" },
    { path: "/reports", label: "Reports" },
  ];

  const isActive = (path) =>
    location.pathname === path
      ? "bg-blue-700 text-white"
      : "text-blue-100 hover:bg-blue-600 hover:text-white";

  return (
    <>
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-blue-800 text-white p-2.5 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
      >
        {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 w-64 bg-blue-800 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:z-auto flex flex-col h-screen`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-blue-700 shrink-0">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <FiShoppingCart className="text-blue-800 text-lg" />
            </div>
            <span className="text-white font-bold text-lg">SalesPro</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-blue-300 hover:text-white transition-colors"
          >
            <FiChevronLeft size={20} />
          </button>
        </div>

        <nav className="px-3 pt-4 pb-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${isActive(item.path)}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex-1" />

        <div className="px-3 pb-4 border-t border-blue-700 pt-3">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-blue-100 hover:bg-red-600 hover:text-white transition-colors duration-200"
          >
            <FiLogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
