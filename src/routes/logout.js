const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ message: "Failed to log out." });
      }
      res.clearCookie("user_sid"); // Ensure the cookie is removed on the server
      res.status(200).json({ message: "Logout successful." });
    });
  } else {
    res.status(200).json({ message: "No active session to log out." });
  }
});

module.exports = router;
