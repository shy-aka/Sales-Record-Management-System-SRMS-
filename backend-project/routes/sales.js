const express = require("express");
const Sale = require("../models/Sale");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { invoiceNumber, customerNumber, customerName, productCode, productName, quantity, unitPrice, salesDate, paymentMethod, totalAmountPaid } = req.body;
    const existing = await Sale.findOne({ invoiceNumber });
    if (existing) {
      return res.status(400).json({ msg: "Invoice number already exists" });
    }
    const sale = new Sale({
      invoiceNumber, customerNumber, customerName, productCode, productName,
      quantity, unitPrice, salesDate, paymentMethod, totalAmountPaid,
    });
    await sale.save();
    res.json(sale);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const sales = await Sale.find().sort({ invoiceNumber: 1 });
    res.json(sales);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(404).json({ msg: "Sale not found" });
    res.json(sale);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { invoiceNumber, customerNumber, customerName, productCode, productName, quantity, unitPrice, salesDate, paymentMethod, totalAmountPaid } = req.body;
    const sale = await Sale.findByIdAndUpdate(
      req.params.id,
      { invoiceNumber, customerNumber, customerName, productCode, productName, quantity, unitPrice, salesDate, paymentMethod, totalAmountPaid },
      { new: true }
    );
    if (!sale) return res.status(404).json({ msg: "Sale not found" });
    res.json(sale);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const sale = await Sale.findByIdAndDelete(req.params.id);
    if (!sale) return res.status(404).json({ msg: "Sale not found" });
    res.json({ msg: "Sale deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
