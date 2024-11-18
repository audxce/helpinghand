const express = require("express");
const router = express.Router();

// Route to check if the session is active and return session data
router.get("/check-session", (req, res) => {
  if (req.session.user) {
    return res.status(200).json({
      message: "Session active",
      session: req.session.user, // Return session data
    });
  } else {
    return res.status(401).json({
      message: "No active session",
    });
  }
});

module.exports = router;
