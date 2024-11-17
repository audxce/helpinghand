const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("../db"); // Adjust path if `db.js` is in `src`

const router = express.Router();

// Function to convert 12-hour format to 24-hour format
const convertTo24Hour = (time) => {
  const [timePart, modifier] = time.split(" ");
  let [hours, minutes] = timePart.split(":");
  if (modifier === "PM" && hours !== "12") {
    hours = parseInt(hours, 10) + 12;
  }
  if (modifier === "AM" && hours === "12") {
    hours = "00";
  }
  return `${hours}:${minutes}:00`; // Add seconds as '00'
};

// POST route to create or update an event
router.post("/", async (req, res) => {
  const {
    eventName,
    eventDescription,
    location,
    requiredSkills,
    urgency,
    eventDate,
    startTime,
    endTime,
    repeatEvent,
  } = req.body;

  // Validation for required fields
  if (
    !eventName ||
    !eventDescription ||
    !location ||
    !urgency ||
    !eventDate ||
    !startTime ||
    !endTime ||
    !repeatEvent
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const validUrgency = ["Low", "Medium", "High"];
  const validRepeatEvent = ["None", "Daily", "Weekly", "Monthly"];

  if (!validUrgency.includes(urgency)) {
    return res.status(400).json({ message: "Invalid urgency level." });
  }
  if (!validRepeatEvent.includes(repeatEvent)) {
    return res.status(400).json({ message: "Invalid repeat event value." });
  }

  const formattedStartTime = convertTo24Hour(startTime);
  const formattedEndTime = convertTo24Hour(endTime);

  try {
    // Check if the event already exists in the database
    const [existingEvent] = await db.query("SELECT * FROM EventDetails WHERE eventName = ?", [
      eventName,
    ]);

    if (existingEvent.length > 0) {
      // Update the existing event if it exists
      await db.query(
        `UPDATE EventDetails SET eventDescription = ?, location = ?, requiredSkills = ?, urgency = ?, eventDate = ?, startTime = ?, endTime = ?, repeatEvent = ? WHERE eventName = ?`,
        [
          eventDescription,
          location,
          requiredSkills,
          urgency,
          eventDate,
          formattedStartTime,
          formattedEndTime,
          repeatEvent,
          eventName,
        ]
      );
      res.status(200).json({ message: "Event updated successfully!" });
    } else {
      // Insert a new event if it doesn’t exist
      await db.query(
        `INSERT INTO EventDetails (eventName, eventDescription, location, requiredSkills, urgency, eventDate, startTime, endTime, repeatEvent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          eventName,
          eventDescription,
          location,
          requiredSkills,
          urgency,
          eventDate,
          formattedStartTime,
          formattedEndTime,
          repeatEvent,
        ]
      );
      res.status(201).json({ message: "Event created successfully!" });
    }
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "An error occurred while saving the event." });
  }
});

// GET route to fetch all events
router.get("/", async (req, res) => {
  try {
    const [events] = await db.query("SELECT * FROM EventDetails");

    res.status(200).json(events);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "An error occurred while fetching events." });
  }
});

router.get("/active", async (req, res) => {
  try {
    // Query for events where activeEvent is 1 (active)
    const [events] = await db.query("SELECT * FROM EventDetails WHERE activeEvent = 1");

    // Check if events are found
    if (events.length === 0) {
      return res.status(404).json({ message: "No active events found." });
    }

    // Send the active events as a response
    res.status(200).json(events);
  } catch (error) {
    // Handle database or any other errors
    console.error("Database error:", error);
    res.status(500).json({ message: "An error occurred while fetching active events." });
  }
});

module.exports = router;
