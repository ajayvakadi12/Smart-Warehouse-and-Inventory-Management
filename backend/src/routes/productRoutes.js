const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  stockIn,
  stockOut,
} = require("../controllers/productController");

// Get All Products (Filtered by category, stockLevel, search)
router.get("/", protect, getProducts);

// Get Single Product
router.get("/:id", protect, getProductById);

// Create Product (Admin or Warehouse Manager)
router.post(
  "/",
  protect,
  authorizeRoles("Admin", "Warehouse Manager"),
  createProduct
);

// Update Product (Admin or Warehouse Manager)
router.put(
  "/:id",
  protect,
  authorizeRoles("Admin", "Warehouse Manager"),
  updateProduct
);

// Delete Product (Admin only)
router.delete(
  "/:id",
  protect,
  authorizeRoles("Admin"),
  deleteProduct
);

// Stock In
router.patch(
  "/:id/stock-in",
  protect,
  authorizeRoles("Admin", "Warehouse Manager", "Staff"),
  stockIn
);

// Stock Out
router.patch(
  "/:id/stock-out",
  protect,
  authorizeRoles("Admin", "Warehouse Manager", "Staff"),
  stockOut
);

module.exports = router;