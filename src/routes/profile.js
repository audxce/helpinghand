const express = require("express");
const router = express.Router();
const db = require("../../db");

// Create or update user profile by user_id from session
router.post("/", (req, res) => {
  const userId = req.session?.user?.id; // Get user_id from session

  const { fullName, address, addressTwo, city, state, zipCode, skills, preferences, availability } =
    req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  if (!fullName || !address || !city || !state || !zipCode || !skills || !availability) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const profileData = {
    user_id: userId, // Use user_id from session
    full_name: fullName,
    address,
    address_two: addressTwo,
    city,
    state,
    zipcode: zipCode,
    skills: JSON.stringify(skills),
    preferences: JSON.stringify(preferences),
    availability: JSON.stringify(availability),
  };

  const checkProfileQuery = "SELECT * FROM UserProfile WHERE user_id = ?";
  db.query(checkProfileQuery, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length > 0) {
      const updateProfileQuery = "UPDATE UserProfile SET ? WHERE user_id = ?";
      db.query(updateProfileQuery, [profileData, userId], (err) => {
        if (err) {
          return res.status(500).json({ message: "Error updating profile", error: err });
        }
        res.status(200).json({ message: "Profile updated successfully" });
      });
    } else {
      const insertProfileQuery = "INSERT INTO UserProfile SET ?";
      db.query(insertProfileQuery, profileData, (err) => {
        if (err) {
          console.error("Database Insert Error:", err);
          return res.status(500).json({ message: "Error creating profile", error: err });
        }
        res.status(201).json({ message: "Profile created successfully" });
      });
    }
  });
});

module.exports = router;
