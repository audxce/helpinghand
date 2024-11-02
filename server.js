const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const path = require("path");
const open = require('open');
const fs = require('fs');
const mysql = require('mysql');
require('dotenv').config({ path: './db.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection setup
const dbConfig = process.env.NODE_ENV === 'production'
  ? JSON.parse(process.env.MySQL_Database)
  : {
    host: "helpinghands-db.mysql.database.azure.com",
    user: "supportingFingers32",
    password: "HkadL@d127",
    database: "UserDatabase",
    port: 3306,
    ssl: {
      ca: fs.readFileSync(`${__dirname}/DigiCertGlobalRootCA.crt.pem`),
      rejectUnauthorized: true,
    }
  };

// Create MySQL connection
const conn = mysql.createConnection(dbConfig);

conn.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to MySQL database.");
});

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

// Use API routes
app.use("/api/login", loginRoutes);
app.use("/api/user_registration", userRegistrationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/volunteer", volunteerRoutes);
app.use("/api/volunteerHistory", volunteerHistoryRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/event", eventRoutes);

// Catch-all route to serve React's index.html for all non-API requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'production') {
    open(`http://localhost:${PORT}`); // Automatically open the browser in development
  }
  console.log(`Server is running on port ${PORT}`);
});

module.exports = conn;
