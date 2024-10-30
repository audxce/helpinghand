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

// Use routes
app.use("/api/login", loginRoutes);
app.use("/api/user_registration", userRegistrationRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
