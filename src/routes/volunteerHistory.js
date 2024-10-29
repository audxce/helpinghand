const express = require("express");
const router = express.Router();

// Sample data to simulate a database
const volunteerHistory = [
  {
    name: "Volunteer 1",
    event: "Event 1",
    date: "2024-01-01",
    status: "Completed",
    duration: 5,
    location: "Location A",
    skills: "Skill A",
    urgency: "Low",
    description: "Description for Event 1",
  },
  {
    name: "Volunteer 2",
    event: "Event 2",
    date: "2024-02-01",
    status: "In Progress",
    duration: 3,
    location: "Location B",
    skills: "Skill B",
    urgency: "Medium",
    description: "Description for Event 2",
  },
];

// Route to get all volunteer history
router.get("/", (req, res) => {
  res.json(volunteerHistory);
});

// Route to add a new volunteer entry (optional)
router.post("/", (req, res) => {
  const { name, event, date, status, duration, location, skills, urgency, description } = req.body;

  if (!name || !event || !date) {
    return res.status(400).json({ message: "Name, event, and date are required" });
  }

  const newEntry = {
    name,
    event,
    date,
    status,
    duration,
    location,
    skills,
    urgency,
    description,
  };

  volunteerHistory.push(newEntry);
  res.status(201).json({ message: "Volunteer entry added successfully!", entry: newEntry });
});

module.exports = router;
