// backend/src/routes/salesRoutes.js
const express = require("express");
const router = express.Router();
const {
  getSales,
  getFilterOptions,
} = require("../controllers/salesController");

router.get("/sales", getSales);
router.get("/sales/options", getFilterOptions); // New Route

module.exports = router;
