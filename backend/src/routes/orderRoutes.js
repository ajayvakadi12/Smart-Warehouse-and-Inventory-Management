const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");


// Create Order
router.post("/", authMiddleware, createOrder);

// Get All Orders
router.get("/", authMiddleware, getOrders);

// Get Single Order
router.get("/:id", authMiddleware, getOrderById);

// Update Status
router.put("/:id/status", authMiddleware, updateOrderStatus);

// Delete Order
router.delete("/:id", authMiddleware, deleteOrder);


module.exports = router;