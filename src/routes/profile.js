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

  const stringFields = [fullName, address, addressTwo, city, state, zipCode, preferences];
  for (const field of stringFields) {
    if (typeof field !== 'string') {
      return res.status(401).json({ message: "Fields must be a string" });
    }
  }

  if (fullName.length > 50 || address.length > 100 || addressTwo.length > 100 || city.length > 100 || state.length > 2 || zipCode.length > 9 || zipCode.length < 5) {
    return res.status(401).json({ message: "Fields are an invalid length" });
  }

  if (skills && Array.isArray(skills)) {
    for (const skill of skills) {
      if (typeof skill !== 'string' || /[^a-zA-Z\s]/.test(skill)) {
        return res.status(401).json({ message: "Skills cannot contain numbers or special characters" });
      }
    }
  }
  
  if (/[^a-zA-Z\s]/.test(fullName)) {
    return res.status(401).json({ message: "Names cannot legally contain numbers or special characters" });
  }
  if (/[^a-zA-Z\s]/.test(state)) {
    return res.status(401).json({ message: "State code cannot contain numbers or special characters" });
  }

  if (availability && Array.isArray(availability)) {
    
    for (const date of availability) {
      const dateParts = date.split(' - ');

      for (const part of dateParts) {
        const trimmedPart = part.trim();

        if (!/^\d{4}[-\/]\d{1,2}[-\/]\d{1,2}$/.test(trimmedPart)) {
          return res.status(401).json({ message: "Dates must be in valid format" });
        }
      }
    }
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