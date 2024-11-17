const express = require("express");
const router = express.Router();
const db = require("../../db");

// Utility function to validate JSON strings
function isValidJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

// Fetch user profile by user_id from session
router.get("/profile", (req, res) => {
  const userId = req.session?.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

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
      skills: isValidJson(user.skills) ? JSON.parse(user.skills) : [],
      preferences: isValidJson(user.preferences) ? JSON.parse(user.preferences) : [],
      availability: isValidJson(user.availability) ? JSON.parse(user.availability) : [],
    });
  });
});

module.exports = router;
