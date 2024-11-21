const request = require("supertest");
const express = require("express");
const volunteerHistoryRoutes = require("../routes/volunteerHistory");
const volunteerHistoryPDFRoutes = require("../routes/volunteerHistoryPDF");
const db = require("../db");

// Set up the Express app for testing
const app = express();
app.use(express.json());
app.use("/api/volunteerHistory", volunteerHistoryRoutes);
app.use("/api/volunteerHistory/pdf", volunteerHistoryPDFRoutes);

// Mocking database query function
jest.mock("../db");

describe("Volunteer History Routes", () => {
  // Test for adding a new volunteer history entry
  test("should add a new volunteer history entry", async () => {
    const newEntry = {
      name: "John Doe",
      event: "Event 1",
      date: "2024-10-01",
      status: "Completed",
      duration: 4,
      location: "Location X",
      skills: ["Skill A"],
      urgency: "High",
      description: "Description of Event 1",
    };

    db.query.mockResolvedValue([{ affectedRows: 1 }]); // Mocking successful DB insert

    const response = await request(app).post("/api/volunteerHistory").send(newEntry);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Volunteer entry added successfully!");
  });

  // Test for missing required fields (name, event, or date)
  test("should return 400 if name, event, or date is missing", async () => {
    const newEntry = {
      event: "Event 1",
      date: "2024-10-01",
      status: "Completed",
      duration: 4,
      location: "Location X",
      skills: ["Skill A"],
      urgency: "High",
      description: "Description of Event 1",
    };

    const response = await request(app).post("/api/volunteerHistory").send(newEntry);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Name, event, and date are required");
  });

  // Test for fetching volunteer history
  test("should return 404 if no volunteer history data found", async () => {
    db.query.mockResolvedValue([[]]); // Simulating empty DB response

    const response = await request(app).get("/api/volunteerHistory");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("No volunteer history data found");
  });

  // Test for fetching volunteer history for PDF generation (success case)
  test("should fetch volunteer history for PDF generation", async () => {
    const mockData = [
      {
        name: "John Doe",
        event: "Event 1",
        date: "2024-10-01",
        status: "Completed",
        duration: 4,
        location: "Location X",
        skills: ["Skill A"],
        urgency: "High",
        description: "Description of Event 1",
      },
    ];

    db.query.mockResolvedValue([mockData]); // Mocking DB query success

    const response = await request(app)
      .get("/api/volunteerHistory/pdf")
      .set("Accept", "application/pdf");

    expect(response.status).toBe(200);
    expect(response.header["content-type"]).toBe("application/pdf");
  });

  // Test for 404 if no volunteer history data found for PDF
  test("should return 404 if no volunteer history data found for PDF", async () => {
    db.query.mockResolvedValue([[]]); // Mocking empty DB query response

    const response = await request(app)
      .get("/api/volunteerHistory/pdf")
      .set("Accept", "application/pdf");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("No volunteer history data found");
  });

  // Test for invalid volunteer history (e.g., missing data)
  test("should return 400 if required fields are missing for PDF generation", async () => {
    db.query.mockResolvedValue([[]]); // Simulating empty DB or missing data

    const response = await request(app)
      .get("/api/volunteerHistory/pdf")
      .set("Accept", "application/pdf");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("No volunteer history data found");
  });

  // Test for generating CSV file
  test("should generate CSV file", async () => {
    const mockData = [
      {
        name: "John Doe",
        event: "Event 1",
        date: "2024-10-01",
        status: "Completed",
        duration: 4,
        location: "Location X",
        skills: ["Skill A"],
        urgency: "High",
        description: "Description of Event 1",
      },
    ];

    db.query.mockResolvedValue([mockData]); // Mocking DB query success

    const response = await request(app)
      .get("/api/volunteerHistory/pdf/csv")
      .set("Accept", "text/csv");

    expect(response.status).toBe(404);
    expect(response.header["content-type"]).toBe("text/html; charset=utf-8");
  });
});
