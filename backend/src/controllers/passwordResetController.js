const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const OTP = require("../models/OTP");
const { sendOTPEmail } = require("../utils/mailer");

// ─── Step 1: Request OTP ────────────────────────────────────────────────────
// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Always return success to prevent email enumeration attacks
    if (!user) {
      return res.json({
        success: true,
        message: "If that email is registered, an OTP has been sent.",
      });
    }

    // Generate cryptographically secure 6-digit OTP
    const otp = String(crypto.randomInt(100000, 999999));

    // Remove any existing OTP for this email
    await OTP.deleteMany({ email: user.email });

    // Save new OTP (expires in 10 minutes)
    await OTP.create({
      email: user.email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    // Detect if real email is configured
    const emailUser = process.env.EMAIL_USER || "";
    const emailPass = process.env.EMAIL_PASS || "";
    const isEmailConfigured =
      emailUser.length > 0 &&
      emailPass.length > 0 &&
      !emailUser.includes("your_gmail") &&
      !emailPass.includes("your_gmail");

    // Send email (falls back to Ethereal + console log if not configured)
    await sendOTPEmail(user.email, otp);

    res.json({
      success: true,
      message: isEmailConfigured
        ? "OTP sent to your email address."
        : "OTP generated. Check your backend console for the code (email not configured).",
      devMode: !isEmailConfigured,
    });
  } catch (error) {
    console.error("forgotPassword error:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP. Please try again." });
  }
};


// ─── Step 2: Verify OTP ─────────────────────────────────────────────────────
// POST /api/auth/verify-otp
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required." });
    }

    const record = await OTP.findOne({ email: email.toLowerCase().trim() });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or already expired. Please request a new one.",
      });
    }

    // Check expiry manually as a secondary guard
    if (record.expiresAt < new Date()) {
      await OTP.deleteMany({ email: record.email });
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    if (record.otp !== String(otp).trim()) {
      return res.status(400).json({ success: false, message: "Incorrect OTP. Please try again." });
    }

    // OTP is valid — mark it as verified by updating the record
    // We keep the record so Step 3 can confirm the flow is legitimate
    record.otp = "VERIFIED";
    record.expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min to complete reset
    await record.save();

    res.json({ success: true, message: "OTP verified. You may now reset your password." });
  } catch (error) {
    console.error("verifyOTP error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// ─── Step 3: Reset Password ──────────────────────────────────────────────────
// POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ success: false, message: "Email and new password are required." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    // Confirm the OTP was verified for this email
    const record = await OTP.findOne({ email: email.toLowerCase().trim(), otp: "VERIFIED" });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "OTP verification is required before resetting the password.",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Clean up OTP record
    await OTP.deleteMany({ email: user.email });

    res.json({ success: true, message: "Password reset successfully. You can now sign in." });
  } catch (error) {
    console.error("resetPassword error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};
