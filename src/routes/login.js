const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const conn = require("../../db");

// Login route
router.post("/", (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Find user by email in the UserCredentials table
  conn.query("SELECT * FROM UserCredentials WHERE email = ?", [email], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    // Check if user exists
    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = results[0];

    // Compare provided password with stored hash
    bcrypt.compare(password, user.password_hash, (err, isMatch) => {
      if (err) {
        console.error("Bcrypt error:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Login successful
      res.status(200).json({ message: "Login successful!" });
    });
  });
});

module.exports = router;
