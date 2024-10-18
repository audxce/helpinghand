const express = require("express");
const router = express.Router();
const volunteers = [];

router.post("/", (req, res) => {
  const { volunteerName, eventName } = req.body;

  if (!volunteerName || !eventName) {
    return res.status(401).json({ message: "All fields are required" });
  }

  volunteers.push({ volunteerName, eventName });
  res.status(201).json({ message: "Volunteer matched successfully!" });
});

module.exports = router;
