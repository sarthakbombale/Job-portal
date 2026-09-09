const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  // OTP fields for email verification
  otp: { type: String, default: null },
  otpExpiry: { type: Date, default: null },
  isOtpVerified: { type: Boolean, default: false },
  lastOtpSent: { type: Date, default: null },
  loginAttempts: { type: Number, default: 0 },
  isAccountLocked: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);