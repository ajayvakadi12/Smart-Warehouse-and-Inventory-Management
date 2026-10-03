const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createBin,
  getBins
} = require("../controllers/binController");


// Admin + Warehouse Manager
router.post(
  "/",
  protect,
  authorizeRoles("Admin", "Warehouse Manager"),
  createBin
);


router.get(
  "/",
  protect,
  getBins
);


module.exports = router;