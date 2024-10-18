const express = require("express");
const router = express.Router();

// Hard-coded data for volunteers and events
const volunteers = [
  { name: "Volunteer 1", skill: "Skill A", location: "Location X" },
  { name: "Volunteer 2", skill: "Skill B", location: "Location Y" },
];

const events = [
  { name: "Event 1", skill: "Skill A", location: "Location X" },
  { name: "Event 2", skill: "Skill B", location: "Location Y" },
];

router.post("/", (req, res) => {
  console.log("Received POST request:", req.body);
  const { volunteerName, eventName } = req.body;

  if (!volunteerName || !eventName) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Find the matching volunteer and event
  const volunteer = volunteers.find((v) => v.name === volunteerName);
  const event = events.find((e) => e.name === eventName);

  console.log("Volunteer:", volunteer, "Event:", event);

  // Check if both exist and if they match based on skill and location
  if (volunteer && event) {
    if (volunteer.skill === event.skill && volunteer.location === event.location) {
      return res.status(200).json({ message: "Successfully matched!" });
    } else {
      return res.status(200).json({ message: "Volunteer and event do not match." });
    }
  } else {
    return res.status(404).json({ message: "Volunteer or event not found." });
  }
});

module.exports = router;
