const request = require("supertest");
const express = require("express");
const eventRouter = require("../routes/event"); // Adjust the path as necessary

const app = express();
app.use(express.json());
app.use("/api/event", eventRouter);

// Tests for POST /api/event
describe("POST /api/event", () => {
  it("should create a new event", async () => {
    const response = await request(app).post("/api/event").send({
      eventName: "Test Event",
      eventDescription: "This is a test event",
      location: "Houston",
      requiredSkills: ["Leadership", "Teamwork"],
      urgency: "High",
      eventDate: "2024-10-18",
      startTime: "10:00 AM",
      endTime: "1:00 PM",
      repeatEvent: "Daily"
    });
    expect(response.statusCode).toBe(201); // Check if status is 201 Created
    expect(response.body.message).toBe("Event created successfully!");
  });

  it("should return 400 for missing required fields", async () => {
    const response = await request(app).post("/api/event").send({
      eventName: "Incomplete Event",
      // Missing other required fields
    });
    expect(response.statusCode).toBe(400); // Check if status is 400 Bad Request
    expect(response.body.message).toBe("All fields are required.");
  });

  // New test: Return 400 for invalid urgency value
  it("should return 400 for invalid urgency value", async () => {
    const response = await request(app).post("/api/event").send({
      eventName: "Test Event",
      eventDescription: "This is a test event",
      location: "Houston",
      requiredSkills: ["Leadership"],
      urgency: "Critical", // Invalid urgency
      eventDate: "2024-10-18",
      startTime: "10:00 AM",
      endTime: "1:00 PM",
      repeatEvent: "Daily"
    });
    expect(response.statusCode).toBe(400); // Expect a 400 Bad Request status
    expect(response.body.message).toBe("Invalid urgency level."); // Expect a specific error message
  });

  // New test: Return 400 for invalid repeat event value
  it("should return 400 for invalid repeatEvent value", async () => {
    const response = await request(app).post("/api/event").send({
      eventName: "Test Event",
      eventDescription: "This is a test event",
      location: "Houston",
      requiredSkills: ["Leadership"],
      urgency: "High",
      eventDate: "2024-10-18",
      startTime: "10:00 AM",
      endTime: "1:00 PM",
      repeatEvent: "Yearly" // Invalid repeat event
    });
    expect(response.statusCode).toBe(400); // Expect a 400 Bad Request status
    expect(response.body.message).toBe("Invalid repeat event value."); // Expect a specific error message
  });
});

// Tests for GET /api/event
describe("GET /api/event", () => {
  it("should return all events", async () => {
    const response = await request(app).get("/api/event");
    expect(response.statusCode).toBe(200); // Check if status is 200 OK
    expect(Array.isArray(response.body)).toBe(true); // Check if the response is an array
  });
});

