const express = require("express");
const router = express.Router();
const db = require("../db");

function isValidJson(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

router.get("/profile/:userId", (req, res) => {
  const { userId } = req.params;  
  const query = "SELECT * FROM UserProfile WHERE user_id = ?";

  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({ message: "Error fetching user data" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = results[0];

    res.json({
      fullName: user.full_name,
      address: user.address,
      addressTwo: user.address_two,
      city: user.city,
      zipCode: user.zipcode,
      state: user.state,
      skills: user.skills,
      preferences: user.preferences,
      availability: user.availability
    });
  });
});

module.exports = router;