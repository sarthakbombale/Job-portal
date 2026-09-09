const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateOTP, getOTPExpiry, sendOTPEmail, verifyOTP } = require("../utils/otpHelper");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // validation
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields required" });
    }

    // check existing user
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user - mark as OTP verified for registration (optional, can require OTP for first-time)
    await User.create({
      name,
      email,
      password: hashedPassword,
      isOtpVerified: true // Allow login immediately after registration
    });

    res.status(201).json({ msg: "Registered successfully. You can now login." });

  } catch (err) {
    console.log("REGISTER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// STEP 1: REQUEST OTP - Validate email and password, send OTP
exports.requestOTP = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // Check if account is locked
    if (user.isAccountLocked) {
      return res.status(401).json({ msg: "Account is locked due to too many failed attempts. Try again later." });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Increment login attempts
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      
      // Lock account after 5 failed attempts
      if (user.loginAttempts >= 5) {
        user.isAccountLocked = true;
      }
      
      await user.save();
      return res.status(400).json({ 
        msg: "Invalid password",
        attemptsLeft: Math.max(0, 5 - user.loginAttempts)
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();

    // Save OTP to user
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    user.lastOtpSent = new Date();
    user.loginAttempts = 0; // Reset failed attempts on successful password match
    user.isAccountLocked = false;
    await user.save();

    // Send OTP via email
    try {
      await sendOTPEmail(user.email, otp, user.name);
      res.json({ 
        msg: "OTP sent to your email. Valid for 10 minutes.",
        email: user.email // Masked or full email for reference
      });
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      // Still allow login with OTP if email fails (fallback)
      res.status(500).json({ 
        msg: "Failed to send OTP. Please try again.",
        error: emailError.message 
      });
    }

  } catch (err) {
    console.log("REQUEST OTP ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// STEP 2: VERIFY OTP - Verify OTP and return JWT token
exports.verifyOTPAndLogin = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validation
    if (!email || !otp) {
      return res.status(400).json({ msg: "Email and OTP required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // Verify OTP
    const otpVerification = verifyOTP(otp, user.otp, user.otpExpiry);
    if (!otpVerification.isValid) {
      return res.status(400).json({ msg: otpVerification.message });
    }

    // Clear OTP from user
    user.otp = null;
    user.otpExpiry = null;
    user.isOtpVerified = true;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.json({
      token,
      role: user.role,
      name: user.name,
      userId: user._id,
      msg: "Login successful!"
    });

  } catch (err) {
    console.log("VERIFY OTP ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// OLD LOGIN - Can keep for backward compatibility or direct JWT access
// DEPRECATED: Use requestOTP + verifyOTPAndLogin instead
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

    // DEPRECATED: Old flow without OTP
    // New flow requires OTP verification first
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.json({
      token,
      role: user.role,
      name: user.name,
      userId: user._id,
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
