const express = require("express");
const router = express.Router();
const users = require("./users"); // Import the shared users array

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
