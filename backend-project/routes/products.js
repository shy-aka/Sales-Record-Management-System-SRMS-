const express = require("express");
const Product = require("../models/Product");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { productCode, productName, quantitySold, unitPrice } = req.body;
    const existing = await Product.findOne({ productCode });
    if (existing) {
      return res.status(400).json({ msg: "Product code already exists, try another" });
    }
    const product = new Product({ productCode, productName, quantitySold, unitPrice });
    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const products = await Product.find().sort({ productCode: 1 });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/:productCode", auth, async (req, res) => {
  try {
    const product = await Product.findOne({ productCode: req.params.productCode });
    if (!product) return res.status(404).json({ msg: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
