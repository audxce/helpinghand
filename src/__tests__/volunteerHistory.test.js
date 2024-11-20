const request = require("supertest");
const express = require("express");
const volunteerHistoryRoutes = require("../routes/volunteerHistory"); // Adjust path as necessary
const volunteerHistoryPDFRoutes = require("../routes/volunteerHistoryPDF"); // Adjust path as necessary
const db = require("../db"); // Mock the DB

const app = express();
app.use(express.json());
app.use("/api/volunteerHistory", volunteerHistoryRoutes);
app.use("/api/volunteerHistory/pdf", volunteerHistoryPDFRoutes);

jest.mock("../db"); // Mock the db module to avoid actual DB calls

describe("Volunteer History Routes", () => {

  // Test POST for adding a volunteer entry
  test("should add a new volunteer history entry", async () => {
    const newEntry = {
      name: "Volunteer 1",
      event: "Event 1",
      date: "2024-10-01",
      status: "Completed",
      duration: 4,
      location: "Location X",
      skills: ["Skill A"],
      urgency: "High",
      description: "Description of Event 1"
    };

    // Mock the database query for inserting a new entry
    db.query.mockResolvedValue([[{ insertId: 1 }]]); 

    const response = await request(app)
      .post("/api/volunteerHistory")
      .send(newEntry);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Volunteer entry added successfully!");
    expect(response.body.entry.volunteer_name).toBe("Volunteer 1");
  });

  // Test GET for fetching all volunteer history data (for PDF generation)
  test("should fetch volunteer history for PDF generation", async () => {
    // Mock database response
    db.query.mockResolvedValue([[
      {
        volunteer_name: "Volunteer 1",
        event_name: "Event 1",
        event_date: "2024-10-01",
        participation_status: "Completed",
        duration_hours: 4,
        location: "Location X",
        required_skills: JSON.stringify(["Skill A"]),
        urgency: "High",
        event_description: "Description of Event 1",
      },
    ]]);

    const response = await request(app)
      .get("/api/volunteerHistory/pdf")
      .set("Accept", "application/pdf");

    expect(response.status).toBe(200);
    expect(response.header["content-type"]).toBe("application/pdf");
    expect(response.header["content-disposition"]).toBe('attachment; filename="volunteer_history.pdf"');
  });

  // Test for handling no volunteer history data in the database (for PDF)
  test("should return 404 if no volunteer history data found for PDF", async () => {
    // Mock empty database response
    db.query.mockResolvedValue([[]]);

    const response = await request(app)
      .get("/api/volunteerHistory/pdf")
      .set("Accept", "application/pdf");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("No volunteer history data found");
  });
});