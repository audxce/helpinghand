const express = require("express");
const router = express.Router();
const db = require("../../db");

router.get("/", (req, res) => {
  console.log("Fetching states...");

  db.query("SELECT stateCode, stateName FROM States", (err, results) => {
    if (err) {
      console.error("Error fetching states:", err);
      return res.status(500).json({ message: "Error fetching states" });
    }

    console.log("Fetched states:", results);
    res.json(results);
  });
});

module.exports = router;