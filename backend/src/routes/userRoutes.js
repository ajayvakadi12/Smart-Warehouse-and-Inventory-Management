const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const {
  getProfile,
  updateProfile,
  getUsers,
} = require("../controllers/userController");

// User Profile
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// Admin: Manage Users
router.get("/", protect, authorizeRoles("Admin"), getUsers);

module.exports = router;
