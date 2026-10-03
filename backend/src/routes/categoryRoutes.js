const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
} = require("../controllers/categoryController");


// Create Category (Admin)
router.post(
  "/",
  protect,
  authorizeRoles("Admin"),
  createCategory
);


// Get All Categories
router.get(
  "/",
  getCategories
);


// Update Category (Admin)
router.put(
  "/:id",
  protect,
  authorizeRoles("Admin"),
  updateCategory
);


// Delete Category (Admin)
router.delete(
  "/:id",
  protect,
  authorizeRoles("Admin"),
  deleteCategory
);


module.exports = router;