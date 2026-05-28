const express = require("express");
const Sale = require("../models/Sale");
const Customer = require("../models/Customer");
const Product = require("../models/Product");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/daily", auth, async (req, res) => {
  try {
    const { date } = req.query;
    const queryDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(queryDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(queryDate);
    endOfDay.setHours(23, 59, 59, 999);

    const sales = await Sale.find({
      salesDate: { $gte: startOfDay, $lte: endOfDay },
    }).sort({ salesDate: -1 });

    const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmountPaid, 0);
    const totalTransactions = sales.length;

    res.json({ sales, totalRevenue, totalTransactions, period: "Daily" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/weekly", auth, async (req, res) => {
  try {
    const { date } = req.query;
    const queryDate = date ? new Date(date) : new Date();
    const dayOfWeek = queryDate.getDay();
    const diff = queryDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const startOfWeek = new Date(queryDate.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const sales = await Sale.find({
      salesDate: { $gte: startOfWeek, $lte: endOfWeek },
    }).sort({ salesDate: -1 });

    const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmountPaid, 0);
    const totalTransactions = sales.length;

    res.json({ sales, totalRevenue, totalTransactions, period: "Weekly", startOfWeek, endOfWeek });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/monthly", auth, async (req, res) => {
  try {
    const { month, year } = req.query;
    const queryYear = parseInt(year) || new Date().getFullYear();
    const queryMonth = parseInt(month) !== undefined ? parseInt(month) - 1 : new Date().getMonth();

    const startOfMonth = new Date(queryYear, queryMonth, 1);
    const endOfMonth = new Date(queryYear, queryMonth + 1, 0, 23, 59, 59, 999);

    const sales = await Sale.find({
      salesDate: { $gte: startOfMonth, $lte: endOfMonth },
    }).sort({ salesDate: -1 });

    const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmountPaid, 0);
    const totalTransactions = sales.length;

    res.json({ sales, totalRevenue, totalTransactions, period: "Monthly", month: queryMonth + 1, year: queryYear });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/customers", auth, async (req, res) => {
  try {
    const total = await Customer.countDocuments();
    const customers = await Customer.find().sort({ firstName: 1 });
    res.json({ customers, total });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/products", auth, async (req, res) => {
  try {
    const total = await Product.countDocuments();
    const products = await Product.find().sort({ productName: 1 });
    res.json({ products, total });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/summary", auth, async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalSales = await Sale.countDocuments();
    const totalRevenue = await Sale.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmountPaid" } } },
    ]);
    res.json({
      totalCustomers,
      totalProducts,
      totalSales,
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
