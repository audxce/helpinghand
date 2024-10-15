const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const router = express.Router();

// User data (replace with database later)
const users = [{ email: "test@example.com", password: "password123" }];

// Login route
router.post("/", (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = users.find((u) => u.email === email);

  if (user && user.password === password) {
    res.status(200).json({ message: "Login successful!" });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

module.exports = router;
