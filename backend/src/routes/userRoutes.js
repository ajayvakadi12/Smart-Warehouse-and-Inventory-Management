const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const {
  getProfile,
  updateProfile,
  changePassword,
  getUsers,
} = require("../controllers/userController");

// User Profile
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// Change Password
router.put("/change-password", protect, changePassword);

// Admin: Manage Users
router.get("/", protect, authorizeRoles("Admin"), getUsers);

module.exports = router;

