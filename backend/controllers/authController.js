const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

    await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({ msg: "Registered successfully. Please login." });

  } catch (err) {
    console.log("REGISTER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    if (user.isAccountLocked) {
      return res.status(401).json({ msg: "Account is locked due to too many failed attempts. Try again later." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      user.loginAttempts = (user.loginAttempts || 0) + 1;

      if (user.loginAttempts >= 5) {
        user.isAccountLocked = true;
      }

      await user.save();

      return res.status(400).json({
        msg: "Invalid password",
        attemptsLeft: Math.max(0, 5 - user.loginAttempts)
      });
    }

    user.loginAttempts = 0;
    user.isAccountLocked = false;
    await user.save();

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
    console.log("LOGIN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
