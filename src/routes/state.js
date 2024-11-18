const express = require("express");
const router = express.Router();
const db = require("../../db");

router.get("/states", (req, res) => {
  console.log("Fetching states...");

  db.query("SELECT stateCode FROM States", (err, results) => {
    if (err) {
      console.error("Error fetching states:", err);
      return res.status(500).json({ message: "Error fetching states" });
    }

    // Send the result back in the response
    res.json(results);
  });
});

module.exports = router;
