// routes/notifications.js
const express = require("express");
const router = express.Router();

// In-memory storage for notifications (you can replace this with a database later)
let notifications = [
  { id: 1, message: "New event assignment", read: false },
  { id: 2, message: "Reminder: Meeting at 5 PM", read: false },
  { id: 3, message: "Update: Event postponed", read: true }, // Read notification
];

// Get all notifications
router.get("/", (req, res) => {
  res.json(notifications);
});

// Mark all notifications as read
router.put("/mark-all-read", (req, res) => {
  notifications = notifications.map((n) => ({ ...n, read: true }));
  res.json({ success: true, notifications });
});

// Add a new notification (for event assignment, reminder, or update)
router.post("/", (req, res) => {
  const { message, userId, eventId } = req.body;

  // Validate request data
  if (!message || !userId || !eventId) {
    return res.status(400).json({ error: "Message, userId, and eventId are required" });
  }

  const newNotification = {
    id: notifications.length + 1,
    message,
    read: false,
    userId, // Associate notification with the user
    eventId, // Associate notification with the event
    timestamp: new Date(),
  };

  notifications.push(newNotification);
  res.json({ success: true, notification: newNotification });
});

module.exports = router;
