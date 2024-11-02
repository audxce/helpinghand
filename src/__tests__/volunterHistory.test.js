const request = require("supertest");
const express = require("express");
const volunteerHistoryRouter = require("../routes/volunteerHistory");
const db = require("../db"); // Mock this

const app = express();
app.use(express.json());
app.use("/api/volunteerHistory", volunteerHistoryRouter);

// Mock the database query function
jest.mock("../db");

describe("Volunteer History API", () => {
  // Tests for GET /api/volunteerHistory
  describe("GET /api/volunteerHistory", () => {
    it("should return all volunteer history", async () => {
      const mockData = [
        { volunteer_name: "Volunteer 1", event_name: "Event 1", event_date: "2024-01-01", ... },
        { volunteer_name: "Volunteer 2", event_name: "Event 2", event_date: "2024-02-01", ... },
      ];
      db.query.mockImplementation((query, callback) => callback(null, mockData));

      const response = await request(app).get("/api/volunteerHistory");
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(mockData.length); // Dynamic length check
      expect(response.body).toEqual(mockData); // Check returned data structure
    });

    it("should return 500 if there's a database error", async () => {
      db.query.mockImplementation((query, callback) => callback(new Error("DB error")));

      const response = await request(app).get("/api/volunteerHistory");
      expect(response.statusCode).toBe(500);
      expect(response.body.message).toBe("Internal server error");
    });
  });

  // Tests for POST /api/volunteerHistory
  describe("POST /api/volunteerHistory", () => {
    it("should successfully add a new volunteer entry", async () => {
      const newEntry = {
        name: "Volunteer 3",
        event: "Event 3",
        date: "2024-03-01",
        status: "Completed",
        duration: 4,
        location: "Location C",
        skills: ["Skill C"],
        urgency: "High",
        description: "Description for Event 3",
      };

      db.query.mockImplementation((query, newEntryObj, callback) => {
        callback(null, { insertId: 1 }); // Mock insert ID response
      });

      const response = await request(app).post("/api/volunteerHistory").send(newEntry);
      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe("Volunteer entry added successfully!");
      expect(response.body.entry).toEqual(expect.objectContaining(newEntry));
    });

    it("should return 400 for missing required fields", async () => {
      const response = await request(app).post("/api/volunteerHistory").send({
        name: "Volunteer 4",
        event: "Event 4", // Missing date
      });
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("Name, event, and date are required");
    });

    it("should return 500 if there's a database error on insert", async () => {
      db.query.mockImplementation((query, newEntryObj, callback) => {
        callback(new Error("DB error")); // Simulate a DB error
      });

      const newEntry = {
        name: "Volunteer 5",
        event: "Event 5",
        date: "2024-04-01",
        status: "Pending",
      };

      const response = await request(app).post("/api/volunteerHistory").send(newEntry);
      expect(response.statusCode).toBe(500);
      expect(response.body.message).toBe("Internal server error");
    });
  });
});
