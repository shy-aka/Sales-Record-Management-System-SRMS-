import React, { useState, useEffect } from "react";
import { getSummary } from "../services/api";
import { FiUsers, FiPackage, FiShoppingCart, FiTrendingUp, FiRefreshCw } from "react-icons/fi";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchSummary(); }, []);

  const fetchSummary = async () => {
    try {
      const res = await getSummary();
      setSummary(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      label: "Total Customers",
      value: summary?.totalCustomers || 0,
      icon: FiUsers,
      color: "bg-blue-500",
      link: "/customers",
    },
    {
      label: "Total Products",
      value: summary?.totalProducts || 0,
      icon: FiPackage,
      color: "bg-green-500",
      link: "/products",
    },
    {
      label: "Total Sales",
      value: summary?.totalSales || 0,
      icon: FiShoppingCart,
      color: "bg-purple-500",
      link: "/sales",
    },
    {
      label: "Total Revenue",
      value: `${(summary?.totalRevenue || 0).toLocaleString()} RWF`,
      icon: FiTrendingUp,
      color: "bg-yellow-500",
      link: "/reports",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Welcome to Sales Record Management System
            </p>
          </div>
          <button
            onClick={fetchSummary}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} size={20} />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading dashboard...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {cards.map((card, i) => (
                <Link key={i} to={card.link} className="block">
                  <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">{card.label}</p>
                        <p className="text-2xl font-bold text-gray-800 mt-1">
                          {card.value}
                        </p>
                      </div>
                      <div className={`p-3 rounded-lg ${card.color}`}>
                        <card.icon className="text-white text-xl" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100 text-center">
              <FiShoppingCart className="mx-auto text-4xl text-blue-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                SalesPro Sales Record Management System
              </h2>
              <p className="text-gray-500 max-w-lg mx-auto">
                Use the navigation menu to manage customers, products, record sales,
                and generate reports. All your sales data is securely stored and
                accessible in real-time.
              </p>
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                <Link to="/customers"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Manage Customers
                </Link>
                <Link to="/products"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                  Manage Products
                </Link>
                <Link to="/sales"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                  Record Sale
                </Link>
                <Link to="/reports"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                  View Reports
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
