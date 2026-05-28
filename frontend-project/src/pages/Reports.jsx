import React, { useState } from "react";
import { getDailyReport, getWeeklyReport, getMonthlyReport, getCustomersReport, getProductsReport } from "../services/api";
import { FiFileText, FiCalendar, FiTrendingUp, FiDownload } from "react-icons/fi";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("daily");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [month, setMonth] = useState(String(new Date().getMonth() + 1).padStart(2, "0"));
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [customerReport, setCustomerReport] = useState(null);
  const [productReport, setProductReport] = useState(null);

  const tabs = [
    { id: "daily", label: "Daily" },
    { id: "weekly", label: "Weekly" },
    { id: "monthly", label: "Monthly" },
    { id: "customers", label: "Customers" },
    { id: "products", label: "Products" },
  ];

  const fetchReport = async (type) => {
    setLoading(true);
    setReport(null);
    try {
      let res;
      switch (type) {
        case "daily":
          res = await getDailyReport(date);
          break;
        case "weekly":
          res = await getWeeklyReport(date);
          break;
        case "monthly":
          res = await getMonthlyReport(month, year);
          break;
        case "customers":
          res = await getCustomersReport();
          setCustomerReport(res.data);
          setLoading(false);
          return;
        case "products":
          res = await getProductsReport();
          setProductReport(res.data);
          setLoading(false);
          return;
        default:
          return;
      }
      setReport(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setReport(null);
    setCustomerReport(null);
    setProductReport(null);
    if (tab === "customers") fetchReport("customers");
    else if (tab === "products") fetchReport("products");
  };

  const exportPDF = () => {
    if (!report?.sales?.length) return;
    const doc = new jsPDF();
    const pageTitle = `SalesPro - ${report.period} Sales Report`;
    doc.setFontSize(18);
    doc.text(pageTitle, 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);
    doc.text(`Total Revenue: ${report.totalRevenue?.toLocaleString()} RWF`, 14, 34);
    doc.text(`Total Transactions: ${report.totalTransactions}`, 14, 40);
    const tableColumn = ["Invoice", "Customer", "Product", "Qty", "Unit Price", "Total", "Date", "Payment"];
    const tableRows = report.sales.map((s) => [
      s.invoiceNumber, s.customerName, s.productName, s.quantity,
      `${s.unitPrice?.toLocaleString()} RWF`, `${s.totalAmountPaid?.toLocaleString()} RWF`,
      new Date(s.salesDate).toLocaleDateString(), s.paymentMethod,
    ]);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 46,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 64, 175] },
    });
    doc.save(`${activeTab}_report_${date}.pdf`);
  };

  const renderDateInputs = () => {
    switch (activeTab) {
      case "daily":
        return (
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
        );
      case "weekly":
        return (
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
        );
      case "monthly":
        return (
          <div className="flex gap-2">
            <select value={month} onChange={(e) => setMonth(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
            <select value={year} onChange={(e) => setYear(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
              {Array.from({ length: 5 }, (_, i) => {
                const y = new Date().getFullYear() - 2 + i;
                return <option key={y} value={y}>{y}</option>;
              })}
            </select>
          </div>
        );
      default:
        return null;
    }
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="text-white text-xl" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FiFileText className="text-indigo-600" /> Reports
          </h1>
          <p className="text-gray-500 mt-1">Generate sales reports</p>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mb-6">
          <div className="flex overflow-x-auto border-b border-gray-100">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tab.label} Report
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab !== "customers" && activeTab !== "products" && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                {renderDateInputs()}
                <button
                  onClick={() => fetchReport(activeTab)}
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <FiTrendingUp /> {loading ? "Loading..." : "Generate Report"}
                </button>
              </div>
            )}

            {loading && (
              <div className="text-center py-8 text-gray-400">Loading report...</div>
            )}

            {(activeTab === "customers" || activeTab === "products") && !loading && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  icon={activeTab === "customers" ? FiFileText : FiFileText}
                  label={`Total ${activeTab === "customers" ? "Customers" : "Products"}`}
                  value={activeTab === "customers" ? customerReport?.total || 0 : productReport?.total || 0}
                  color={activeTab === "customers" ? "bg-blue-500" : "bg-green-500"}
                />
              </div>
            )}

            {activeTab === "customers" && customerReport?.customers && (
              <div className="mt-6 bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">#</th>
                      <th className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Number</th>
                      <th className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Name</th>
                      <th className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Telephone</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {customerReport.customers.map((c, i) => (
                      <tr key={c._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-500">{i + 1}</td>
                        <td className="px-4 py-3 text-sm font-medium">{c.customerNumber}</td>
                        <td className="px-4 py-3 text-sm">{c.firstName} {c.lastName}</td>
                        <td className="px-4 py-3 text-sm">{c.telephone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "products" && productReport?.products && (
              <div className="mt-6 bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">#</th>
                      <th className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Code</th>
                      <th className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Name</th>
                      <th className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Qty Sold</th>
                      <th className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Unit Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {productReport.products.map((p, i) => (
                      <tr key={p._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-500">{i + 1}</td>
                        <td className="px-4 py-3 text-sm font-medium">{p.productCode}</td>
                        <td className="px-4 py-3 text-sm">{p.productName}</td>
                        <td className="px-4 py-3 text-sm">{p.quantitySold}</td>
                        <td className="px-4 py-3 text-sm">{p.unitPrice.toLocaleString()} RWF</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {report && !loading && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <StatCard
                    icon={FiTrendingUp}
                    label="Total Revenue"
                    value={`${report.totalRevenue?.toLocaleString()} RWF`}
                    color="bg-green-500"
                  />
                  <StatCard
                    icon={FiTrendingUp}
                    label="Total Transactions"
                    value={report.totalTransactions}
                    color="bg-blue-500"
                  />
                  <StatCard
                    icon={FiCalendar}
                    label="Period"
                    value={report.period}
                    color="bg-purple-500"
                  />
                </div>

                {report.sales?.length > 0 && (
                  <>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-semibold text-gray-700">Sales Details</h3>
                      <button onClick={exportPDF}
                        className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800">
                        <FiDownload /> Export PDF
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full border border-gray-200 rounded-lg">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase text-left">Invoice</th>
                            <th className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase text-left">Customer</th>
                            <th className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase text-left">Product</th>
                            <th className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase text-left">Qty</th>
                            <th className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase text-left">Total</th>
                            <th className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase text-left">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {report.sales.map((s) => (
                            <tr key={s._id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium">{s.invoiceNumber}</td>
                              <td className="px-4 py-3 text-sm">{s.customerName}</td>
                              <td className="px-4 py-3 text-sm">{s.productName}</td>
                              <td className="px-4 py-3 text-sm">{s.quantity}</td>
                              <td className="px-4 py-3 text-sm font-semibold">{s.totalAmountPaid?.toLocaleString()} RWF</td>
                              <td className="px-4 py-3 text-sm">{new Date(s.salesDate).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
