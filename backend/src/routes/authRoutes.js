const express = require("express");

const router = express.Router();

const {
  register,
  login,
  logout,
} = require("../controllers/authController");

const {
  forgotPassword,
  verifyOTP,
  resetPassword,
} = require("../controllers/passwordResetController");

const {
  registerValidation,
  loginValidation,
} = require("../validators/authValidator");

const validate = require("../middleware/validationMiddleware");


// Register
router.post("/register", registerValidation, validate, register);

// Login
router.post("/login", loginValidation, validate, login);

// Logout
router.post("/logout", logout);

// ── Forgot Password (3-step flow) ──
router.post("/forgot-password", forgotPassword);   // Step 1: send OTP
router.post("/verify-otp",      verifyOTP);        // Step 2: verify OTP
router.post("/reset-password",  resetPassword);    // Step 3: set new password


module.exports = router;