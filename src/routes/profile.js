const express = require("express");

const router = express.Router();
const db = require("../../db");

router.post("/", (req, res) => {

  const { fullName, address, addressTwo, city, state, zipCode, skills, preferences, availability } =
    req.body;

  //validate requests

  if (!fullName || !address || !city || !state || !zipCode || !skills || !availability) {
    return res.status(401).json({ message: "All fields are required" });
  }

  const stringFields = [fullName, address, addressTwo, city, state, zipCode, preferences];
  for (const field of stringFields) {
    if (typeof field !== "string") {
      return res.status(401).json({ message: "Fields must be a string" });
    }
  }

  if (
    fullName.length > 50 ||
    address.length > 100 ||
    addressTwo.length > 100 ||
    city.length > 100 ||
    state.length > 2 ||
    zipCode.length > 9 ||
    zipCode.length < 5
  ) {
    return res.status(401).json({ message: "Fields are an invalid length" });
  }

  if (skills && Array.isArray(skills)) {
    for (const skill of skills) {
      if (typeof skill !== "string" || /[^a-zA-Z\s]/.test(skill)) {
        return res
          .status(401)
          .json({ message: "Skills cannot contain numbers or special characters" });
      }
    }
  }

  if (/[^a-zA-Z\s]/.test(fullName)) {
    return res
      .status(401)
      .json({ message: "Names cannot legally contain numbers or special characters" });
  }
  if (/[^a-zA-Z\s]/.test(state)) {
    return res
      .status(401)
      .json({ message: "State code cannot contain numbers or special characters" });
  }

  if (availability && Array.isArray(availability)) {
    for (const date of availability) {
      const dateParts = date.split(" - ");

      for (const part of dateParts) {
        const trimmedPart = part.trim();

        if (!/^\d{4}[-\/]\d{1,2}[-\/]\d{1,2}$/.test(trimmedPart)) {
          return res.status(401).json({ message: "Dates must be in valid format" });
        }
      }
    }
  }

  if (typeof zipCode !== "string" || !/^\d{5}(-\d{4})?$/.test(zipCode)) {
    return res.status(401).json({ message: "Invalid zip code format" });
  }

  //Adding to database
  const checkProfileQuery = "SELECT * FROM UserProfile WHERE full_name = ?";
  db.query(checkProfileQuery, [fullName], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    const profileData = {
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

    if (results.length > 0) {
      const updateProfileQuery = `UPDATE UserProfile SET ? WHERE full_name = ?`;
      db.query(updateProfileQuery, [profileData, fullName], (err) => {
        if (err) {
          return res.status(500).json({ message: "Error updating profile", error: err });
        }
        res.status(200).json({ message: "Profile Updated!" });
      });
    } else {
      const insertProfileQuery = "INSERT INTO UserProfile SET ?";
      db.query(insertProfileQuery, profileData, (err) => {
        if (err) {
          console.error("Database Insert Error:", err);
          return res.status(500).json({ message: "Error creating profile", error: err });
        }
        console.log(profileData)
        res.status(201).json({ message: "Profile Created!" });
      });
    }
  });
});

module.exports = router;
