const express = require("express");
const router = express.Router();

const { register, login, requestOTP, verifyOTPAndLogin } = require("../controllers/authController");

// Old login (deprecated - kept for backward compatibility)
router.post("/login", login);

// New OTP-based login flow
// Step 1: Request OTP (provide email + password)
router.post("/request-otp", requestOTP);

// Step 2: Verify OTP and get JWT (provide email + otp)
router.post("/verify-otp", verifyOTPAndLogin);

// Register
router.post("/register", register);

module.exports = router;