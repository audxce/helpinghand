const request = require("supertest");
const express = require("express");
const db = require("../db"); // Mock the database
const eventRoutes = require("../routes/event");

jest.mock("../db"); // Mock the database

const app = express();
app.use(express.json());
app.use("/api/event", eventRoutes);

describe("Event Routes - Coverage for Uncovered Lines", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  // Cover lines 36-137: POST route validations and logic
  describe("POST /api/event", () => {
    it("should return 400 when required fields are missing", async () => {
      const response = await request(app).post("/api/event").send({
        eventName: "Event Without Required Fields",
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("All fields are required.");
    });

    it("should return 400 for invalid urgency level", async () => {
      const response = await request(app)
        .post("/api/event")
        .send({
          eventName: "Test Event",
          eventDescription: "Description",
          state: "CA",
          requiredSkills: ["Leadership"],
          urgency: "Critical", // Invalid urgency
          eventDate: "2024-10-18",
          startTime: "10:00 AM",
          endTime: "12:00 PM",
          repeatEvent: "Daily",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("Invalid urgency level.");
    });

    it("should return 400 for invalid repeatEvent value", async () => {
      const response = await request(app)
        .post("/api/event")
        .send({
          eventName: "Test Event",
          eventDescription: "Description",
          state: "CA",
          requiredSkills: ["Leadership"],
          urgency: "High",
          eventDate: "2024-10-18",
          startTime: "10:00 AM",
          endTime: "12:00 PM",
          repeatEvent: "Yearly", // Invalid repeat value
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("Invalid repeat event value.");
    });

    it("should update an existing event", async () => {
      db.query.mockResolvedValueOnce([[{ eventName: "Existing Event" }]]); // Mock existing event

      const response = await request(app)
        .post("/api/event")
        .send({
          eventName: "Existing Event",
          eventDescription: "Updated Description",
          state: "CA",
          requiredSkills: ["Leadership"],
          urgency: "Medium",
          eventDate: "2024-10-18",
          startTime: "10:00 AM",
          endTime: "12:00 PM",
          repeatEvent: "Daily",
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Event updated successfully!");
    });

    it("should create a new event", async () => {
      db.query.mockResolvedValueOnce([]); // Mock no existing event

      const response = await request(app)
        .post("/api/event")
        .send({
          eventName: "New Event",
          eventDescription: "New Event Description",
          state: "CA",
          requiredSkills: ["Leadership"],
          urgency: "High",
          eventDate: "2024-10-18",
          startTime: "10:00 AM",
          endTime: "12:00 PM",
          repeatEvent: "Daily",
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe("Event created successfully!");
    });
  });

  // Cover lines 161-165: GET /api/event
  describe("GET /api/event", () => {
    it("should fetch all events successfully", async () => {
      db.query.mockResolvedValueOnce([
        [
          {
            eventName: "Event 1",
            eventDescription: "Description 1",
            state: "CA",
          },
        ],
      ]);

      const response = await request(app).get("/api/event");

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            eventName: "Event 1",
            eventDescription: "Description 1",
            state: "CA",
          }),
        ])
      );
    });

    it("should return 500 if an error occurs during fetching", async () => {
      db.query.mockRejectedValueOnce(new Error("Database Error"));

      const response = await request(app).get("/api/event");

      expect(response.statusCode).toBe(500);
      expect(response.body.message).toBe("An error occurred while fetching events.");
    });
  });

  // Cover lines 172-173: GET /api/event/active
  describe("GET /api/event/active", () => {
    it("should fetch active events successfully", async () => {
      db.query.mockResolvedValueOnce([
        [
          {
            eventName: "Active Event",
            activeEvent: 1,
          },
        ],
      ]);

      const response = await request(app).get("/api/event/active");

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            eventName: "Active Event",
            activeEvent: 1,
          }),
        ])
      );
    });

    it("should return 404 if no active events are found", async () => {
      db.query.mockResolvedValueOnce([[]]);

      const response = await request(app).get("/api/event/active");

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe("No active events found.");
    });
  });

  // Cover lines 180-192: Error handling for GET /api/event/active
  describe("Error Handling for GET /api/event/active", () => {
    it("should return 500 if an error occurs during fetching active events", async () => {
      db.query.mockRejectedValueOnce(new Error("Database Error"));

      const response = await request(app).get("/api/event/active");

      expect(response.statusCode).toBe(500);
      expect(response.body.message).toBe("An error occurred while fetching active events.");
    });
  });
});
