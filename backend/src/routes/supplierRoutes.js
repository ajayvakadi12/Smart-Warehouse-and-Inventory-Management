const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createSupplier,
  getSuppliers,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/supplierController");

// Get All Suppliers
router.get("/", protect, getSuppliers);

// Create Supplier (Admin or Warehouse Manager)
router.post(
  "/",
  protect,
  authorizeRoles("Admin", "Warehouse Manager"),
  createSupplier
);

// Update Supplier (Admin or Warehouse Manager)
router.put(
  "/:id",
  protect,
  authorizeRoles("Admin", "Warehouse Manager"),
  updateSupplier
);

// Delete Supplier (Admin only)
router.delete(
  "/:id",
  protect,
  authorizeRoles("Admin"),
  deleteSupplier
);

module.exports = router;