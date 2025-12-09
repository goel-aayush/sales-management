// backend/src/utils/seedData.js
require("dotenv").config(); 
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const Sale = require("../models/Sale");

// CONFIGURATION
const BATCH_SIZE = 5000; 

// Helper to safely parse dates
const parseDate = (dateStr) => {
  if (!dateStr) return new Date();

  let date = new Date(dateStr);
  if (!isNaN(date.getTime())) return date;

  const parts = dateStr.split(/[-/]/);
  if (parts.length === 3) {
    const isoDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    date = new Date(isoDate);
    if (!isNaN(date.getTime())) return date;
  }
  return new Date();
};

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(" DB Connected. Clearing old data...");

    // 1. Clear Database ONCE at the start
    await Sale.deleteMany({});
    console.log("  Old data cleared. Starting full import...");

    const filePath = path.join(__dirname, "source_data.csv");
    if (!fs.existsSync(filePath)) {
      console.error(` Error: File not found at ${filePath}`);
      process.exit(1);
    }

    let batch = [];
    let totalInserted = 0;

    // Create stream
    const stream = fs.createReadStream(filePath).pipe(csv());

    stream.on("data", async (row) => {
      // 1. DATA CLEANING & DISCOUNT FIX
      const totalAmount = Number(row["Total Amount"]) || 0;
      let finalAmount = Number(row["Final Amount"] || row["Total Amount"]) || 0;
      let discountVal = Number(row["Discount"] || 0);

      
      if (totalAmount > 0 && finalAmount > 0) {
        const difference = totalAmount - finalAmount;
        if (difference > 0.1) {
          // Tolerance for floating point
          discountVal = parseFloat(difference.toFixed(2));
        }
      }

      // 2. Parse Date
      const rawDate = row["Date"] || row["Transaction Date"];

      // 3. Prepare Object
      const cleanRow = {
        transaction_id:
          row["Transaction ID"] || `TXN-${totalInserted + batch.length}`,
        cust_id: row["Customer ID"],
        customer_name: row["Customer Name"],
        phone: String(row["Phone Number"] || ""),
        gender: row["Gender"],
        age: Number(row["Age"]) || 18,
        region: row["Customer Region"] || row["Region"],
        product_id: row["Product ID"],
        product_name: row["Product Name"],
        category: row["Product Category"],
        brand: row["Brand"],
        tags: row["Tags"] ? row["Tags"].split(",") : [],
        quantity: Number(row["Quantity"]) || 1,
        total_amount: totalAmount,
        discount: discountVal, // Corrected Value
        final_amount: finalAmount,
        date: parseDate(rawDate),
        payment_method: row["Payment Method"],
        order_status: row["Order Status"],
      };

      batch.push(cleanRow);

      // 4. BATCH INSERTION (Prevents Memory Crash)
      if (batch.length >= BATCH_SIZE) {
        stream.pause(); 
        await Sale.insertMany(batch);
        totalInserted += batch.length;
        console.log(`... Inserted ${totalInserted} rows`);
        batch = []; 
        stream.resume(); 
      }
    });

    stream.on("end", async () => {
      
      if (batch.length > 0) {
        await Sale.insertMany(batch);
        totalInserted += batch.length;
      }

      console.log(`COMPLETE! Successfully inserted ${totalInserted} rows.`);
      console.log(` You can now refresh your Frontend.`);
      process.exit();
    });

    stream.on("error", (err) => {
      console.error(" Stream Error:", err);
      process.exit(1);
    });
  } catch (error) {
    console.error("Script Error:", error);
    process.exit(1);
  }
};

seedDB();
