const express = require("express");
const router = express.Router();
const users = require("./users"); // Import the shared users array

// Registration route
router.post("/", (req, res) => {
  const { email, password, confirmPassword } = req.body;

  // Basic validation
  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  // Check if user already exists
  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  // Register the new user
  users.push({ email, password });

  // Respond with success
  res.status(201).json({ message: "User registered successfully!" });
});

module.exports = router;
