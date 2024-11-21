const request = require("supertest");
const express = require("express");
const db = require("../db"); // Mock the database
const eventDashboardRoutes = require("../routes/eventdashboard");

jest.mock("../db", () => ({
  query: jest.fn(),
  end: jest.fn(), // Add end mock
}));

const app = express();
app.use(express.json());
app.use("/api/eventdashboard", eventDashboardRoutes);

describe("Event Dashboard Routes - Unit Tests", () => {
  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {}); // Suppress console.log
  });

  afterAll(() => {
    console.log.mockRestore(); // Restore console.log
    db.end.mockResolvedValueOnce(); // Ensure the connection is "closed"
  });

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  // Test for GET /api/eventdashboard
  describe("GET /api/eventdashboard", () => {
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

      const response = await request(app).get("/api/eventdashboard");

      expect(response.status).toBe(200);
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

    it("should return 500 if there is a database error", async () => {
      db.query.mockRejectedValueOnce(new Error("Database Error"));

      const response = await request(app).get("/api/eventdashboard");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("An error occurred while fetching events.");
    });
  });

  // Test for POST /api/eventdashboard
  describe("POST /api/eventdashboard", () => {
    it("should return 400 for invalid urgency level", async () => {
      const response = await request(app)
        .post("/api/eventdashboard")
        .send({
          eventName: "Test Event",
          eventDescription: "Test Description",
          state: "CA",
          requiredSkills: ["Leadership"],
          urgency: "Critical", // Invalid urgency
          eventDate: "2024-10-18",
          startTime: "10:00 AM",
          endTime: "12:00 PM",
          repeatEvent: "Daily",
          activeEvent: true,
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid urgency level.");
    });

    it("should update an existing event", async () => {
      db.query.mockResolvedValueOnce([[{ eventName: "Test Event" }]]); // Mock existing event
      db.query.mockResolvedValueOnce({ affectedRows: 1 }); // Mock update success

      const response = await request(app)
        .post("/api/eventdashboard")
        .send({
          eventName: "Test Event",
          eventDescription: "Updated Description",
          state: "CA",
          requiredSkills: ["Leadership"],
          urgency: "Medium",
          eventDate: "2024-10-18",
          startTime: "10:00 AM",
          endTime: "12:00 PM",
          repeatEvent: "Daily",
          activeEvent: true,
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Event updated successfully!");
    });
  });

  // Test for GET /api/eventdashboard/active
  describe("GET /api/eventdashboard/active", () => {
    it("should fetch active events successfully", async () => {
      db.query.mockResolvedValueOnce([
        [
          {
            eventName: "Active Event",
            activeEvent: 1,
          },
        ],
      ]);

      const response = await request(app).get("/api/eventdashboard/active");

      expect(response.status).toBe(200);
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

      const response = await request(app).get("/api/eventdashboard/active");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("No active events found.");
    });

    it("should return 500 if there is a database error", async () => {
      db.query.mockRejectedValueOnce(new Error("Database Error"));

      const response = await request(app).get("/api/eventdashboard/active");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("An error occurred while fetching active events.");
    });
  });

  // Test for DELETE /api/eventdashboard/:EventID
  // Test for DELETE /api/eventdashboard/:EventID
  describe("DELETE /api/eventdashboard/:EventID", () => {
    it("should delete an event successfully", async () => {
      // Mock successful deletion
      db.query.mockResolvedValueOnce({ affectedRows: 1 });

      const response = await request(app).delete("/api/eventdashboard/1");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Event deleted successfully");
    });

    it("should return 400 if EventID is invalid", async () => {
      const response = await request(app).delete("/api/eventdashboard/invalid-id"); // Simulate invalid ID

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid event ID");
    });

    it("should return 500 if there is a database error", async () => {
      // Mock database error
      db.query.mockRejectedValueOnce(new Error("Database Error"));

      const response = await request(app).delete("/api/eventdashboard/1");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Failed to delete event");
    });

    it("should return 404 if the event to delete does not exist", async () => {
      // Mock no rows affected (event not found)
      db.query.mockResolvedValueOnce({ affectedRows: 0 });

      const response = await request(app).delete("/api/eventdashboard/1");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Event not found");
    });
  });
});
