const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const router = express.Router();

const events = []; // This array will hold the event data temporarily

// POST route to create or update an event
router.post("/", (req, res) => {
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
    return res.status(400).json({ message: "All fields are required." }); // Use 400 for bad request
  }

  // Optional: Validate urgency
  const validUrgency = ["Low", "Medium", "High"];
  if (!validUrgency.includes(urgency)) {
    return res.status(400).json({ message: "Invalid urgency level." });
  }

  // Optional: Validate repeatEvent
  const validRepeatEvent = ["None", "Daily", "Weekly", "Monthly"];
  if (!validRepeatEvent.includes(repeatEvent)) {
    return res.status(400).json({ message: "Invalid repeat event value." });
  }

  // Check if the event already exists
  const existingEventIndex = events.findIndex((event) => event.eventName === eventName);

  if (existingEventIndex > -1) {
    // If the event exists, update it
    events[existingEventIndex] = {
      eventName,
      eventDescription,
      location,
      requiredSkills,
      urgency,
      eventDate,
      startTime,
      endTime,
      repeatEvent,
    };
    return res.status(200).json({ message: "Event updated successfully!" });
  } else {
    // If the event does not exist, create a new one
    events.push({
      eventName,
      eventDescription,
      location,
      requiredSkills,
      urgency,
      eventDate,
      startTime,
      endTime,
      repeatEvent,
    });
    return res.status(201).json({ message: "Event created successfully!" });
  }
});

// GET route to fetch all events
router.get("/", (req, res) => {
  res.status(200).json(events); // Send back the array of events
});

module.exports = router;
