const express = require("express");

const router = express.Router();

const {
  register,
  login,
  logout,
} = require("../controllers/authController");


const {
  registerValidation,
  loginValidation,
} = require("../validators/authValidator");


const validate = require("../middleware/validationMiddleware");


// Register
router.post(
  "/register",
  registerValidation,
  validate,
  register
);


// Login
router.post(
  "/login",
  loginValidation,
  validate,
  login
);


// Logout
router.post("/logout", logout);


module.exports = router;