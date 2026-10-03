const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createShipment,
  getShipments,
  receiveShipment,
} = require("../controllers/shipmentController");

// Get All Shipments
router.get("/", protect, getShipments);

// Create Shipment (Admin or Warehouse Manager)
router.post(
  "/",
  protect,
  authorizeRoles("Admin", "Warehouse Manager"),
  createShipment
);

// Receive Shipment (Admin, Warehouse Manager, Staff)
router.put(
  "/:id/receive",
  protect,
  authorizeRoles("Admin", "Warehouse Manager", "Staff"),
  receiveShipment
);

module.exports = router;