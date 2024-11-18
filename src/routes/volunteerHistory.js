const express = require("express");
const router = express.Router();
const db = require("../db"); // Import the database connection

// Route to get all volunteer history
router.get("/", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM VolunteerHistory"); // Use await to fetch the data
    res.json(results); // Send the results back as JSON
  } catch (err) {
    console.error("Error retrieving volunteer history:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to add a new volunteer entry (optional)
router.post("/", async (req, res) => {
  const { name, event, date, status, duration, location, skills, urgency, description } = req.body;

  if (!name || !event || !date) {
    return res.status(400).json({ message: "Name, event, and date are required" });
  }

  const newEntry = {
    volunteer_name: name,
    event_name: event,
    event_date: date,
    participation_status: status,
    duration_hours: duration,
    location: location,
    required_skills: JSON.stringify(skills), // Store JSON as a string
    urgency: urgency,
    event_description: description,
  };

  const query = "INSERT INTO VolunteerHistory SET ?";

  try {
    const [result] = await db.query(query, newEntry); // Use await to insert data
    res.status(201).json({ message: "Volunteer entry added successfully!", entry: newEntry });
  } catch (err) {
    console.error("Error inserting new volunteer entry:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
