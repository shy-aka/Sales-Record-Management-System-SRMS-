import React, { useState, useEffect } from "react";
import { getProducts, createProduct } from "../services/api";
import { FiPlus, FiPackage, FiTrendingUp, FiBox } from "react-icons/fi";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    productCode: "", productName: "", quantitySold: "", unitPrice: "",
  });
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct({ ...form, quantitySold: Number(form.quantitySold), unitPrice: Number(form.unitPrice) });
      setMsg({ type: "success", text: "Product added successfully!" });
      setForm({ productCode: "", productName: "", quantitySold: "", unitPrice: "" });
      setShowForm(false);
      fetchProducts();
      setTimeout(() => setMsg({ type: "", text: "" }), 3000);
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.msg || "Failed to add product" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FiPackage className="text-green-600" /> Products
            </h1>
            <p className="text-gray-500 mt-1">Manage product inventory</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FiPlus /> {showForm ? "Cancel" : "Add Product"}
          </button>
        </div>

        {msg.text && (
          <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${
            msg.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {msg.text}
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <FiBox /> New Product
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Product Code *</label>
                <input
                  type="text" name="productCode" value={form.productCode}
                  onChange={handleChange} required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="e.g. PROD001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Product Name *</label>
                <input
                  type="text" name="productName" value={form.productName}
                  onChange={handleChange} required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="Product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Quantity Sold *</label>
                <input
                  type="number" name="quantitySold" value={form.quantitySold}
                  onChange={handleChange} required min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Unit Price * (RWF)</label>
                <div className="relative">
                  <FiTrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number" name="unitPrice" value={form.unitPrice}
                    onChange={handleChange} required min="0" step="0.01"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors">
                  Save Product
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty Sold</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Unit Price</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-400">Loading...</td></tr>
                ) : products.length === 0 ? (
                  <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-400">No products found</td></tr>
                ) : (
                  products.map((p, i) => (
                    <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-500">{i + 1}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{p.productCode}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{p.productName}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{p.quantitySold}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{p.unitPrice.toLocaleString()} RWF</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{(p.quantitySold * p.unitPrice).toLocaleString()} RWF</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
