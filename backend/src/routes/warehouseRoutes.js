const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createWarehouse,
  getWarehouses,
  updateWarehouse,
  deleteWarehouse
} = require("../controllers/warehouseController");


// Create Warehouse
router.post(
  "/",
  protect,
  authorizeRoles("Admin"),
  createWarehouse
);


// Get All Warehouses
router.get(
  "/",
  getWarehouses
);


// Update Warehouse
router.put(
  "/:id",
  protect,
  authorizeRoles("Admin"),
  updateWarehouse
);


// Delete Warehouse
router.delete(
  "/:id",
  protect,
  authorizeRoles("Admin"),
  deleteWarehouse
);


module.exports = router;