const express = require("express");
const Customer = require("../models/Customer");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { customerNumber, firstName, lastName, telephone, address } = req.body;
    const existing = await Customer.findOne({ customerNumber });
    if (existing) {
      return res.status(400).json({ msg: "Customer number already exists, try another" });
    }
    const customer = new Customer({ customerNumber, firstName, lastName, telephone, address });
    await customer.save();
    res.json(customer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const customers = await Customer.find().sort({ customerNumber: 1 });
    res.json(customers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/:customerNumber", auth, async (req, res) => {
  try {
    const customer = await Customer.findOne({ customerNumber: req.params.customerNumber });
    if (!customer) return res.status(404).json({ msg: "Customer not found" });
    res.json(customer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
