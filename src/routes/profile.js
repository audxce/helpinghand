const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const router = express.Router();

const profiles = [];

router.post("/", (req, res) => {

  const {
    fullName,
    address,
    addressTwo,
    city,
    state,
    zipCode,
    skills,
    preferences,
    availability,
  } = req.body;
  
  if (!fullName || !address || !city || !state || !zipCode || !skills || !availability) {
   return res.status(401).json({ message: "All fields are required" });
  }
  if (typeof zipCode !== 'string' || !/^\d{5}(-\d{4})?$/.test(zipCode)) {
    return res.status(401).json({ message: "Invalid zip code format" });
  }

  const existingProfileIndex = profiles.findIndex(
    (profile) => profile.fullName === fullName
  );

  if (existingProfileIndex > -1) {
    profiles[existingProfileIndex] = {
      fullName,
      address,
      addressTwo,
      city,
      state,
      zipCode,
      skills,
      preferences,
      availability,
    };
    res.status(200).json({ message: "Profile Created!" });
  } else {
    profiles.push({
      fullName,
      address,
      addressTwo,
      city,
      state,
      zipCode,
      skills,
      preferences,
      availability,
    });
    res.status(201).json({ message: "Profile Created!" });
  }
});

module.exports = router;