const express = require("express");
const db = require("../db"); // Adjust path if necessary

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
  console.log("Request body received:", req.body); // Log incoming data

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
  } = req.body;

  const requiredSkillsSerialized = JSON.stringify(requiredSkills); // Serialize requiredSkills

  console.log("Received POST request with data:", req.body);

  // Validation for required fields
  if (
    !eventName ||
    !eventDescription ||
    !state ||
    !urgency ||
    !eventDate ||
    !startTime ||
    !endTime ||
    !repeatEvent ||
    !Array.isArray(requiredSkills) ||
    requiredSkills.length === 0
  ) {
    console.error("Validation failed - missing required fields");
    return res.status(400).json({ message: "All fields are required." });
  }

  const validUrgency = ["Low", "Medium", "High"];
  const validRepeatEvent = ["None", "Daily", "Weekly", "Monthly"];

  if (!validUrgency.includes(urgency)) {
    console.error("Validation failed - invalid urgency level:", urgency);
    return res.status(400).json({ message: "Invalid urgency level." });
  }
  if (!validRepeatEvent.includes(repeatEvent)) {
    console.error("Validation failed - invalid repeat event value:", repeatEvent);
    return res.status(400).json({ message: "Invalid repeat event value." });
  }

  const formattedStartTime = convertTo24Hour(startTime);
  const formattedEndTime = convertTo24Hour(endTime);

  try {
    // Check if the event already exists in the database
    console.log("Checking if event exists in the database...");
    const [rows] = await db.query("SELECT * FROM EventDetails WHERE eventName = ?", [eventName]);

    if (rows.length > 0) {
      // Update the existing event if it exists
      console.log("Event found. Updating existing event...");
      await db.query(
        `UPDATE EventDetails SET eventDescription = ?, state = ?, requiredSkills = ?, urgency = ?, eventDate = ?, startTime = ?, endTime = ?, repeatEvent = ? WHERE eventName = ?`,
        [
          eventDescription,
          state,
          requiredSkillsSerialized,
          urgency,
          eventDate,
          formattedStartTime,
          formattedEndTime,
          repeatEvent,
          eventName,
        ]
      );
      console.log("Event updated successfully.");
      res.status(200).json({ message: "Event updated successfully!" });
    } else {
      // Insert a new event if it doesn’t exist
      console.log("Event not found. Creating new event...");
      await db.query(
        `INSERT INTO EventDetails (eventName, eventDescription, state, requiredSkills, urgency, eventDate, startTime, endTime, repeatEvent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          eventName,
          eventDescription,
          state,
          requiredSkillsSerialized,
          urgency,
          eventDate,
          formattedStartTime,
          formattedEndTime,
          repeatEvent,
        ]
      );
      console.log("Event created successfully.");
      res.status(201).json({ message: "Event created successfully!" });
    }
  } catch (error) {
    console.error("Database error:", error);
    if (error.sqlMessage) {
      console.error("SQL Message:", error.sqlMessage);
    }
    res
      .status(500)
      .json({ message: "An error occurred while saving the event.", error: error.message });
  }
});

// GET route to fetch all events
router.get("/", async (req, res) => {
  try {
    console.log("Fetching all events from the database...");
    const [events] = await db.query("SELECT * FROM EventDetails");
    console.log("Events fetched:", events);
    res.status(200).json(events);
  } catch (error) {
    console.error("Database error while fetching events:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching events.", error: error.message });
  }
});

// GET route to fetch active events
router.get("/active", async (req, res) => {
  try {
    console.log("Fetching active events from the database...");
    const [events] = await db.query("SELECT * FROM EventDetails WHERE activeEvent = 1");

    // Check if events are found
    if (events.length === 0) {
      console.log("No active events found.");
      return res.status(404).json({ message: "No active events found." });
    }

    // Deserialize the requiredSkills field
    events.forEach((event) => {
      if (event.requiredSkills) {
        try {
          event.requiredSkills = JSON.parse(event.requiredSkills);
        } catch (parseError) {
          console.error(`Error parsing requiredSkills for event ${event.eventName}:`, parseError);
          event.requiredSkills = [];
        }
      } else {
        event.requiredSkills = [];
      }
    });

    console.log("Active events fetched:", events);
    res.status(200).json(events);
  } catch (error) {
    console.error("Database error while fetching active events:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching active events.", error: error.message });
  }
});

module.exports = router;
