const express = require("express");
const router = express.Router();
const db = require("../../db"); // Replace with your database connection

// Get all notifications for the logged-in user
router.get("/", (req, res) => {
  const userId = req.session?.user?.id; // Retrieve user_id from session

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  const query = "SELECT * FROM notifications WHERE userId = ? ORDER BY msgtimestamp DESC";

  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({ message: "Error fetching notifications" });
    }

    res.json(results);
  });
});

// Mark all notifications for the logged-in user as read
router.put("/mark-all-read", (req, res) => {
  const userId = req.session?.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  const query = "UPDATE notifications SET readmsg = 1 WHERE userId = ?";

  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({ message: "Error marking notifications as read" });
    }

    res.json({ success: true, message: "All notifications marked as read." });
  });
});

// Add a new notification
router.post("/", (req, res) => {
  const { message, eventId, msgtype } = req.body; // No need for userId since it's retrieved from session
  const userId = req.session?.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  // Validate request data
  if (!message || !eventId || !msgtype) {
    return res.status(400).json({ error: "Message, eventId, and msgtype are required" });
  }

  const query = `
    INSERT INTO notifications (userId, eventId, message, readmsg, msgtimestamp, msgtype)
    VALUES (?, ?, ?, 0, NOW(), ?)
  `;

  db.query(query, [userId, eventId, message, msgtype], (error, results) => {
    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({ message: "Error creating notification" });
    }

    res.json({ success: true, message: "Notification added successfully." });
  });
});

module.exports = router;
