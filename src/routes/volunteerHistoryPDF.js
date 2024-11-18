const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const db = require("../db"); // Assuming you have a DB connection setup

// Route for generating PDF
router.get("/", async (req, res) => {
  try {
    // Fetch volunteer history data from the database
    const [results] = await db.query("SELECT * FROM VolunteerHistory");

    // Create a new PDF document
    const doc = new PDFDocument();

    // Add content to the PDF
    doc.fontSize(18).text("Volunteer History", { align: "center" });
    doc.moveDown(2);

    // Loop through the results and add each entry to the PDF
    results.forEach((entry) => {
      doc
        .fontSize(12)
        .text(`Name: ${entry.volunteer_name}`)
        .text(`Event: ${entry.event_name}`)
        .text(`Date: ${new Date(entry.event_date).toLocaleDateString()}`)
        .text(`Status: ${entry.participation_status}`)
        .text(`Duration: ${entry.duration_hours} hours`)
        .text(`Location: ${entry.location}`)
        .text(`Urgency: ${entry.urgency}`)
        .text(`Description: ${entry.event_description}`)
        .moveDown(1);
    });

    // Pipe the PDF document to the response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="volunteer_history.pdf"');
    doc.pipe(res); // Send PDF to the client

    doc.end();
  } catch (err) {
    console.error("Error generating PDF:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
