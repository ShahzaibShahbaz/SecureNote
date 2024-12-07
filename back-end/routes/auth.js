const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Middleware to Verify JWT
const authenticateToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Signup Route
// routes/auth.js
const JWT_SECRET = process.env.JWT_SECRET || "my_very_secure_random_secret";

// Add password complexity validation
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Password complexity check
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPassword,
    });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", data: { email, token } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Export both the router and middleware
router.authenticateToken = authenticateToken;
module.exports = router;
