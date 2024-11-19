const express = require("express");
const router = express.Router();
const db = require("../../db");

// Get all notifications for the logged-in user
router.get("/", (req, res) => {
  const userId = req.session?.user?.id; // Retrieve user_id from session

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  const query = `
  SELECT 
    n.notificationId, 
    n.message, 
    n.msgtimestamp, 
    n.msgtype, 
    n.eventId, 
    un.readmsg
  FROM 
    notifications n
  INNER JOIN 
    user_notifications un 
  ON 
    n.notificationId = un.notificationId
  WHERE 
    un.user_id = ?
  ORDER BY 
    n.msgtimestamp DESC
`;

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

  const query = `
    UPDATE user_notifications
    SET readmsg = 1
    WHERE user_id = ?
  `;

  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({ message: "Error marking notifications as read." });
    }

    res.json({ success: true, message: "All notifications marked as read." });
  });
});

// Add a new notification
router.post("/", (req, res) => {
  const { message, msgtype, eventId } = req.body;

  if (!message || !msgtype) {
    return res.status(400).json({ error: "Message and msgtype are required." });
  }

  const insertNotificationQuery = `
    INSERT INTO notifications (message, msgtype, eventId, msgtimestamp)
    VALUES (?, ?, ?, NOW())
  `;

  db.query(insertNotificationQuery, [message, msgtype, eventId || null], (err, result) => {
    if (err) {
      console.error("Error creating notification:", err);
      return res.status(500).json({ message: "Error creating notification." });
    }

    const notificationId = result.insertId;

    // Handle general notifications
    if (msgtype === "general") {
      const linkUsersQuery = `
        INSERT INTO user_notifications (user_id, notificationId)
        SELECT user_id, ? FROM usercredentials
      `;
      db.query(linkUsersQuery, [notificationId], (err) => {
        if (err) {
          console.error("Error linking users to notification:", err);
          return res.status(500).json({ message: "Error linking users to notification." });
        }
        res.json({ success: true, message: "Notification sent to all users." });
      });
    }
    // Handle event notifications
    else if (msgtype === "event" && eventId) {
      const linkEventUsersQuery = `
        INSERT INTO user_notifications (user_id, notificationId)
        SELECT user_id, ? FROM event_users WHERE eventId = ?
      `;
      db.query(linkEventUsersQuery, [notificationId, eventId], (err) => {
        if (err) {
          console.error("Error linking event users to notification:", err);
          return res.status(500).json({ message: "Error linking event users to notification." });
        }
        res.json({ success: true, message: "Notification sent to event users." });
      });
    }
    // Invalid request
    else {
      res.status(400).json({ message: "Invalid notification type or missing eventId." });
    }
  });
});

module.exports = router;
