const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Import routes
const loginRoutes = require("./routes/login");
const userRegistrationRoutes = require("./routes/user_registration");
const notificationRoutes = require("./routes/notifications");
const volunteerRoutes = require("./routes/volunteer");
const volunteerHistoryRoutes = require("./routes/volunteerHistory"); // New route for volunteer history
const profileRoutes = require("./routes/profile");
const eventRoutes = require("./routes/event");

// Use routes
app.use("/api/login", loginRoutes);
app.use("/api/user_registration", userRegistrationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/volunteer", volunteerRoutes);
app.use("/api/volunteerHistory", volunteerHistoryRoutes); // Use the new history route
app.use("/api/profile", profileRoutes);
app.use("/api/event", eventRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
