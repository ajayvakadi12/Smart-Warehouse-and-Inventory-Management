const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const { getDashboardStats } = require("../controllers/dashboardController");

// Dashboard Overview
router.get("/", protect, getDashboardStats);

// PDF Minimum API: GET /api/dashboard/summary
router.get("/summary", protect, getDashboardStats);

module.exports = router;