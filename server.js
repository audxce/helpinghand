const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const path = require("path");
const session = require("express-session");
require("dotenv").config({ path: "./db.env" });

const conn = require("./db"); // Import database connection

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ credentials: true, origin: "http://localhost:3000" })); // Allow cookies from frontend
app.use(bodyParser.json());

// Debugging middleware to log incoming requests
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

// Session middleware
app.use(
  session({
    key: "user_sid", // Cookie name
    secret: "my_simple_secret_key",
    resave: false, // Avoid saving unchanged sessions
    saveUninitialized: false, // Don't create empty sessions
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day in milliseconds
      httpOnly: true, // Prevents JavaScript access to the cookie
    },
  })
);

// Serve static files only in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "build")));

  // Debugging for static file serving
  app.use((req, res, next) => {
    console.log(`Static file requested: ${req.url}`);
    next();
  });

  // Serve React index.html for all non-API requests in production
  app.get("*", (req, res) => {
    console.log("Serving React app for:", req.url);
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });
}

// Import routes
const loginRoutes = require("./src/routes/login");
const userRegistrationRoutes = require("./src/routes/user_registration");
const notificationRoutes = require("./src/routes/notifications");
const volunteerRoutes = require("./src/routes/volunteer");
const volunteerHistoryRoutes = require("./src/routes/volunteerHistory");
const eventRoutes = require("./src/routes/event");
const statesRoutes = require("./src/routes/states");
const profileRoutes = require("./src/routes/profile"); // Combined profile file
const sessionCheckRoutes = require("./src/routes/sessioncheck");
const volunteerdashboardRoutes = require("./src/routes/volunteerdashboard");
const volunteerHistoryPDFRoutes = require("./src/routes/volunteerHistoryPDF");
const logoutRoute = require("./src/routes/logout");

// Debugging for API route registration
console.log("Registering API routes...");

// Use API routes
app.use("/api/login", loginRoutes);
app.use("/api/user_registration", userRegistrationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/volunteer", volunteerRoutes);
app.use("/api/volunteerHistory", volunteerHistoryRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/states", statesRoutes);
app.use("/api/profile", profileRoutes); // Register the combined profile.js
app.use("/api", sessionCheckRoutes);
app.use("/api/volunteerHistoryPDF", volunteerHistoryPDFRoutes);
app.use("/api/volunteerdashboard", volunteerdashboardRoutes);
app.use("/api/logout", logoutRoute);

// Fallback for unmatched routes
app.use((req, res, next) => {
  console.log(`Unmatched route: ${req.method} ${req.url}`);
  res.status(404).send("Route not found");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
