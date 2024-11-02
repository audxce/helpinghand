// src/routes/user_registration.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs"); // Changed to bcryptjs
const conn = require("../../db"); // Import database connection

// The registration route logic
router.post("/", (req, res) => {
  const {
    email,
    password,
    confirmPassword,
    fullName,
    address,
    addressTwo,
    city,
    state,
    zipcode,
    skills,
    availability,
    preferences,
  } = req.body;

  // Basic validation for required fields
  if (!email || !password || !confirmPassword || !fullName) {
    return res.status(400).json({ message: "Full name, email, and password are required" });
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  // Check if user already exists in UserCredentials
  conn.query("SELECT * FROM UserCredentials WHERE email = ?", [email], (err, existingUser) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (existingUser.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error("Hashing error:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      // Insert into UserCredentials table
      conn.query(
        "INSERT INTO UserCredentials (password_hash, email, role) VALUES (?, ?, ?)",
        [hashedPassword, email, "volunteer"],
        (err, result) => {
          if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Internal server error" });
          }

          const userId = result.insertId;

          // Insert into UserProfile table
          conn.query(
            "INSERT INTO UserProfile (user_id, full_name, address, address_two, city, state, zipcode, skills, availability, preferences) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
              userId,
              fullName,
              address || null,
              addressTwo || null,
              city || null,
              state || null,
              zipcode || null,
              JSON.stringify(skills || {}),
              JSON.stringify(availability || {}),
              preferences || null,
            ],
            (err) => {
              if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Internal server error" });
              }

              // Respond with success
              res.status(201).json({ message: "User registered successfully!" });
            }
          );
        }
      );
    });
  });
});

module.exports = router;
