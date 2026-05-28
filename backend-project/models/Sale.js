const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
  },
  customerNumber: {
    type: String,
    required: true,
  },
  customerName: {
    type: String,
    default: "",
  },
  productCode: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    default: "",
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  salesDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["Cash", "Credit Card", "Mobile Money", "Bank Transfer"],
  },
  totalAmountPaid: {
    type: Number,
    required: true,
    min: 0,
  },
});

module.exports = mongoose.model("Sale", saleSchema);
