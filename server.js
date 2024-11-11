const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const path = require("path");
const open = require("open");
require("dotenv").config({ path: "./db.env" });

const db = require("./src/db"); // Import the database connection from db.js

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the "build" directory in the root
app.use(express.static(path.join(__dirname, "build")));

// Import routes
const loginRoutes = require("./src/routes/login");
const userRegistrationRoutes = require("./src/routes/user_registration");
const notificationRoutes = require("./src/routes/notifications");
const volunteerRoutes = require("./src/routes/volunteer");
const volunteerHistoryRoutes = require("./src/routes/volunteerHistory");
const profileRoutes = require("./src/routes/profile");
const eventRoutes = require("./src/routes/event");

const profileRoute = require("./src/routes/profileRoutes");

// Use API routes
app.use("/api/profileData", profileRoute);
app.use("/api/login", loginRoutes);
app.use("/api/user_registration", userRegistrationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/volunteer", volunteerRoutes);
app.use("/api/volunteerHistory", volunteerHistoryRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/event", eventRoutes);

// Catch-all route to serve React's index.html for all non-API requests
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Start server
app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "production") {
    open(`http://localhost:${PORT}`); // Automatically open the browser in development
  }
  console.log(`Server is running on port ${PORT}`);
});

module.exports = db;
