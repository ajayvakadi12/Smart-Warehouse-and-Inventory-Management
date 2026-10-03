const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createRack,
  getRacks
} = require("../controllers/rackController");


// Admin + Warehouse Manager can add rack
router.post(
  "/",
  protect,
  authorizeRoles("Admin", "Warehouse Manager"),
  createRack
);


router.get(
  "/",
  protect,
  getRacks
);


module.exports = router;