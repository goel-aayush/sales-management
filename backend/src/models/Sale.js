// backend/src/models/Sale.js
const mongoose = require("mongoose");

const SaleSchema = new mongoose.Schema({
  // Customer Fields [cite: 18-25]
  cust_id: String,
  customer_name: { type: String, index: true }, // Indexed for search
  phone: { type: String, index: true }, // Indexed for search
  gender: String,
  age: Number,
  region: String,

  // Product Fields [cite: 26-31]
  product_id: String,
  product_name: String,
  category: String,
  brand: String,
  tags: [String], // Array of strings for tags

  // Sales Fields [cite: 32-37]
  quantity: Number,
  total_amount: Number,
  discount: Number,
  final_amount: Number,

  // Operational Fields [cite: 38-46]
  transaction_id: { type: String, unique: true },
  date: Date, // Storing as Date object for easy sorting
  payment_method: String,
  order_status: String,
});

module.exports = mongoose.model("Sale", SaleSchema);
