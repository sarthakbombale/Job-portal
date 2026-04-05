const jwt = require("jsonwebtoken");

// VERIFY TOKEN
exports.auth = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    // 💡 FIX: Strip "Bearer " from the start of the string
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1]; 
    }

    // Now verify ONLY the actual token string
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the decoded payload (id and role) to the request object
    req.user = decoded; 
    next();
  } catch (err) {
    console.error("JWT Auth Error:", err.message);
    res.status(401).json({ msg: "Invalid token" });
  }
};

// ADMIN ONLY
exports.admin = (req, res, next) => {
  // Now req.user.role will exist because we attached 'decoded' above
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ msg: "Admin access denied" });
  }
  next();
};