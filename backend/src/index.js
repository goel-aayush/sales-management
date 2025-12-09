require("dotenv").config(); 
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const salesRoutes = require("./routes/salesRoutes");
const connectDB = require('./config/db'); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection
connectDB();

// Routes
app.use("/api", salesRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});