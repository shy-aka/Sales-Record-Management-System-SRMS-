import React, { useState, useEffect } from "react";
import { getSales, createSale, updateSale, deleteSale, getCustomers, getProducts } from "../services/api";
import { FiPlus, FiEdit2, FiTrash2, FiShoppingCart, FiCalendar, FiTrendingUp, FiSearch } from "react-icons/fi";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });

  const [form, setForm] = useState({
    invoiceNumber: "", customerNumber: "", customerName: "",
    productCode: "", productName: "", quantity: "",
    unitPrice: "", salesDate: new Date().toISOString().split("T")[0],
    paymentMethod: "Cash", totalAmountPaid: "",
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [salesRes, custRes, prodRes] = await Promise.all([
        getSales(), getCustomers(), getProducts(),
      ]);
      setSales(salesRes.data);
      setCustomers(custRes.data);
      setProducts(prodRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      invoiceNumber: "", customerNumber: "", customerName: "",
      productCode: "", productName: "", quantity: "",
      unitPrice: "", salesDate: new Date().toISOString().split("T")[0],
      paymentMethod: "Cash", totalAmountPaid: "",
    });
    setEditing(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "customerNumber") {
        const cust = customers.find((c) => c.customerNumber === value);
        if (cust) updated.customerName = `${cust.firstName} ${cust.lastName}`;
      }

      if (name === "productCode") {
        const prod = products.find((p) => p.productCode === value);
        if (prod) {
          updated.productName = prod.productName;
          updated.unitPrice = prod.unitPrice;
        }
      }

      if (name === "quantity" || name === "unitPrice" || name === "productCode") {
        const qty = parseFloat(name === "quantity" ? value : prev.quantity) || 0;
        const price = parseFloat(name === "unitPrice" ? value : prev.unitPrice) || 0;
        updated.totalAmountPaid = (qty * price).toFixed(2);
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, quantity: Number(form.quantity), unitPrice: Number(form.unitPrice), totalAmountPaid: Number(form.totalAmountPaid) };
      if (editing) {
        await updateSale(editing, payload);
        setMsg({ type: "success", text: "Sale updated successfully!" });
      } else {
        await createSale(payload);
        setMsg({ type: "success", text: "Sale recorded successfully!" });
      }
      resetForm();
      setShowForm(false);
      fetchData();
      setTimeout(() => setMsg({ type: "", text: "" }), 3000);
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.msg || "Operation failed" });
    }
  };

  const handleEdit = (sale) => {
    setForm({
      invoiceNumber: sale.invoiceNumber, customerNumber: sale.customerNumber,
      customerName: sale.customerName, productCode: sale.productCode,
      productName: sale.productName, quantity: sale.quantity,
      unitPrice: sale.unitPrice,
      salesDate: new Date(sale.salesDate).toISOString().split("T")[0],
      paymentMethod: sale.paymentMethod, totalAmountPaid: sale.totalAmountPaid,
    });
    setEditing(sale._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sale?")) return;
    try {
      await deleteSale(id);
      setMsg({ type: "success", text: "Sale deleted successfully!" });
      fetchData();
      setTimeout(() => setMsg({ type: "", text: "" }), 3000);
    } catch (err) {
      setMsg({ type: "error", text: "Failed to delete sale" });
    }
  };

  const filteredSales = sales.filter(
    (s) =>
      s.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      s.productName?.toLowerCase().includes(search.toLowerCase())
  );

  const paymentMethods = ["Cash", "Credit Card", "Mobile Money", "Bank Transfer"];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FiShoppingCart className="text-purple-600" /> Sales
            </h1>
            <p className="text-gray-500 mt-1">Record and manage sales transactions</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(!showForm); }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FiPlus /> {showForm ? "Cancel" : "New Sale"}
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
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              {editing ? "Edit Sale" : "New Sale"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Invoice Number *</label>
                <input type="text" name="invoiceNumber" value={form.invoiceNumber} onChange={handleChange} required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="e.g. INV001" disabled={!!editing} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Customer *</label>
                <select name="customerNumber" value={form.customerNumber} onChange={handleChange} required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none">
                  <option value="">Select Customer</option>
                  {customers.map((c) => (
                    <option key={c._id} value={c.customerNumber}>
                      {c.customerNumber} - {c.firstName} {c.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Customer Name</label>
                <input type="text" name="customerName" value={form.customerName} readOnly
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Product *</label>
                <select name="productCode" value={form.productCode} onChange={handleChange} required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none">
                  <option value="">Select Product</option>
                  {products.map((p) => (
                    <option key={p._id} value={p.productCode}>
                      {p.productCode} - {p.productName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Product Name</label>
                <input type="text" name="productName" value={form.productName} readOnly
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Quantity *</label>
                <input type="number" name="quantity" value={form.quantity} onChange={handleChange} required min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Unit Price (RWF)</label>
                <input type="number" name="unitPrice" value={form.unitPrice} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  <FiCalendar className="inline mr-1" /> Sales Date *
                </label>
                <input type="date" name="salesDate" value={form.salesDate} onChange={handleChange} required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Payment Method *</label>
                <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none">
                  {paymentMethods.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  <FiTrendingUp className="inline mr-1" /> Total Amount (RWF)
                </label>
                <input type="number" name="totalAmountPaid" value={form.totalAmountPaid} readOnly
                  className="w-full px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg font-semibold text-purple-800" />
              </div>
              <div className="md:col-span-3 flex gap-2">
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors">
                  {editing ? "Update Sale" : "Save Sale"}
                </button>
                <button type="button" onClick={() => { resetForm(); setShowForm(false); }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="mb-4 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text" placeholder="Search by invoice, customer or product..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Invoice</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Product</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Qty</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Price</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Payment</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="9" className="px-6 py-8 text-center text-gray-400">Loading...</td></tr>
                ) : filteredSales.length === 0 ? (
                  <tr><td colSpan="9" className="px-6 py-8 text-center text-gray-400">No sales found</td></tr>
                ) : (
                  filteredSales.map((s) => (
                    <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 text-sm font-medium text-gray-800">{s.invoiceNumber}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">{s.customerName || s.customerNumber}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">{s.productName || s.productCode}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">{s.quantity}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">{s.unitPrice?.toLocaleString()} RWF</td>
                      <td className="px-4 py-4 text-sm font-semibold text-purple-700">{s.totalAmountPaid?.toLocaleString()} RWF</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{new Date(s.salesDate).toLocaleDateString()}</td>
                      <td className="px-4 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          s.paymentMethod === "Cash" ? "bg-green-100 text-green-700" :
                          s.paymentMethod === "Mobile Money" ? "bg-blue-100 text-blue-700" :
                          s.paymentMethod === "Credit Card" ? "bg-yellow-100 text-yellow-700" :
                          "bg-purple-100 text-purple-700"
                        }`}>{s.paymentMethod}</span>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(s)}
                            className="p-1.5 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors">
                            <FiEdit2 size={14} />
                          </button>
                          <button onClick={() => handleDelete(s._id)}
                            className="p-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors">
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </td>
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

export default Sales;
