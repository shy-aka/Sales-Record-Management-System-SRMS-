const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/SRMS";

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected...");
    const existing = await User.findOne({ username: "shyaka" });
    if (!existing) {
      await User.create({ username: "shyaka", password: "admin123" });
      console.log("Default user seeded: shyaka / admin123");
    }
  })
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/customers", require("./routes/customers"));
app.use("/api/products", require("./routes/products"));
app.use("/api/sales", require("./routes/sales"));
app.use("/api/reports", require("./routes/reports"));

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "SRMS API is running" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
