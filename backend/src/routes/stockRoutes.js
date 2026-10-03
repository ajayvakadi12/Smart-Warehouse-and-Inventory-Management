const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createStockTransaction,
  getStockTransactions,
  stockIn,
  stockOut,
  getAuditLogs,
} = require("../controllers/stockController");

// Stock IN endpoint (PDF Minimum API requirement: POST /api/stock/in)
router.post(
  "/in",
  protect,
  authorizeRoles("Admin", "Warehouse Manager", "Staff"),
  stockIn
);

// Stock OUT endpoint (PDF Minimum API requirement: POST /api/stock/out)
router.post(
  "/out",
  protect,
  authorizeRoles("Admin", "Warehouse Manager", "Staff"),
  stockOut
);

// General Stock transaction endpoint (POST /api/stocks)
router.post(
  "/",
  protect,
  authorizeRoles("Admin", "Warehouse Manager", "Staff"),
  createStockTransaction
);

// Stock movements history (PDF: Maintain history of all stock movements)
router.get(
  "/movements",
  protect,
  getStockTransactions
);

// All Stock transactions
router.get(
  "/",
  protect,
  getStockTransactions
);

// Audit logs
router.get(
  "/audit-logs",
  protect,
  authorizeRoles("Admin", "Warehouse Manager"),
  getAuditLogs
);

module.exports = router;