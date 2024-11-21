const express = require("express");
const db = require("../db"); // Adjust the path to your actual db connection file

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
  console.log("POST request received at /eventdashboard");
  console.log("Request body:", req.body);

  const {
    eventName,
    eventDescription,
    state,
    requiredSkills,
    urgency,
    eventDate,
    startTime,
    endTime,
    repeatEvent,
    activeEvent,
  } = req.body;

  // Validation for required fields
  if (
    !eventName ||
    !eventDescription ||
    !state ||
    !urgency ||
    !eventDate ||
    !startTime ||
    !endTime ||
    !repeatEvent
  ) {
    console.log("Validation failed: missing required fields");
    return res.status(400).json({ message: "All fields are required." });
  }

  const validUrgency = ["Low", "Medium", "High"];
  const validRepeatEvent = ["None", "Daily", "Weekly", "Monthly"];

  if (!validUrgency.includes(urgency)) {
    console.log("Invalid urgency level:", urgency);
    return res.status(400).json({ message: "Invalid urgency level." });
  }
  if (!validRepeatEvent.includes(repeatEvent)) {
    console.log("Invalid repeat event value:", repeatEvent);
    return res.status(400).json({ message: "Invalid repeat event value." });
  }

  const formattedStartTime = convertTo24Hour(startTime);
  const formattedEndTime = convertTo24Hour(endTime);

  try {
    // Check if the event already exists in the database
    console.log("Checking if event exists in database...");
    const [existingEvent] = await db.query("SELECT * FROM EventDetails WHERE eventName = ?", [
      eventName,
    ]);

    if (existingEvent.length > 0) {
      console.log("Event found, updating...");
      // Update the existing event if it exists
      await db.query(
        `UPDATE EventDetails 
         SET eventDescription = ?, state = ?, requiredSkills = ?, urgency = ?, eventDate = ?, startTime = ?, endTime = ?, repeatEvent = ?, activeEvent = ? 
         WHERE eventName = ?`,
        [
          eventDescription,
          state,
          requiredSkills,
          urgency,
          eventDate,
          formattedStartTime,
          formattedEndTime,
          repeatEvent,
          activeEvent,
          eventName,
        ]
      );
      console.log("Event updated successfully");
      res.status(200).json({ message: "Event updated successfully!" });
    } else {
      console.log("Event not found, inserting new event...");
      // Insert a new event if it doesn’t exist
      await db.query(
        `INSERT INTO EventDetails 
         (eventName, eventDescription, state, requiredSkills, urgency, eventDate, startTime, endTime, repeatEvent, activeEvent) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          eventName,
          eventDescription,
          state,
          requiredSkills,
          urgency,
          eventDate,
          formattedStartTime,
          formattedEndTime,
          repeatEvent,
          activeEvent,
        ]
      );
      console.log("Event created successfully");
      res.status(201).json({ message: "Event created successfully!" });
    }
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "An error occurred while saving the event." });
  }
});

// GET route to fetch all events
router.get("/", async (req, res) => {
  console.log("GET request received at /eventdashboard");
  try {
    const [events] = await db.query("SELECT * FROM EventDetails");
    console.log("Data fetched from the database:", events);
    res.status(200).json(events);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "An error occurred while fetching events." });
  }
});

// GET route to fetch active events
router.get("/active", async (req, res) => {
  console.log("GET request received at /eventdashboard/active");
  try {
    // Query for events where activeEvent is 1 (active)
    const [events] = await db.query("SELECT * FROM EventDetails WHERE activeEvent = 1");

    // Check if events are found
    if (events.length === 0) {
      console.log("No active events found");
      return res.status(404).json({ message: "No active events found." });
    }

    // Send the active events as a response
    console.log("Active events fetched:", events);
    res.status(200).json(events);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "An error occurred while fetching active events." });
  }
});

router.delete("/:EventID", async (req, res) => {
  const { EventID } = req.params;

  // Validate EventID: it should be numeric and not empty
  if (!EventID || isNaN(EventID)) {
    return res.status(400).json({ message: "Invalid event ID" });
  }

  try {
    const result = await db.query("DELETE FROM EventDetails WHERE EventID = ?", [EventID]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Failed to delete event" });
  }
});

module.exports = router;
