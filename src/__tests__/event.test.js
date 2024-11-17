const request = require("supertest");
const express = require("express");
const db = require("../db"); // Database connection
const eventRouter = require("../routes/event"); // Adjust the path as necessary

const app = express();
app.use(express.json());
app.use("/api/event", eventRouter);

beforeAll(async () => {
  // Clear the EventDetails table to ensure tests start with a clean state
  await db.query("DELETE FROM EventDetails");
});

afterAll(async () => {
  // Close the database connection after all tests have run
  await db.end();
});

// Tests for POST /api/event
describe("POST /api/event", () => {
  it("should create a new event and store it in the database", async () => {
    const eventData = {
      eventName: "Test Event",
      eventDescription: "This is a test event",
      location: "Houston",
      requiredSkills: "Leadership, Teamwork",
      urgency: "High",
      eventDate: "2024-10-18",
      startTime: "10:00:00",
      endTime: "13:00:00",
      repeatEvent: "Daily",
    };

    const response = await request(app).post("/api/event").send(eventData);
    expect(response.statusCode).toBe(201); // Expect a 201 Created status
    expect(response.body.message).toBe("Event created successfully!");

    // Verify that the event was added to the database
    const [rows] = await db.query("SELECT * FROM EventDetails WHERE eventName = ?", [
      eventData.eventName,
    ]);
    expect(rows.length).toBe(1); // Confirm that one event was added
    expect(rows[0].eventDescription).toBe(eventData.eventDescription);
  });

  it("should update an existing event if it already exists", async () => {
    const updatedEventData = {
      eventName: "Test Event",
      eventDescription: "Updated description for test event",
      location: "Updated Location",
      requiredSkills: "Communication",
      urgency: "Medium",
      eventDate: "2024-12-25",
      startTime: "11:00:00",
      endTime: "14:00:00",
      repeatEvent: "Weekly",
    };

    const response = await request(app).post("/api/event").send(updatedEventData);
    expect(response.statusCode).toBe(200); // Expect a 200 OK status for update
    expect(response.body.message).toBe("Event updated successfully!");

    // Verify that the event was updated in the database
    const [rows] = await db.query("SELECT * FROM EventDetails WHERE eventName = ?", [
      updatedEventData.eventName,
    ]);
    expect(rows.length).toBe(1); // Confirm that the event still exists
    expect(rows[0].eventDescription).toBe(updatedEventData.eventDescription);
  });

  it("should return 400 for missing required fields", async () => {
    const response = await request(app).post("/api/event").send({
      eventName: "Incomplete Event",
      // Missing other required fields
    });
    expect(response.statusCode).toBe(400); // Check if status is 400 Bad Request
    expect(response.body.message).toBe("All fields are required.");
  });

  it("should return 400 for invalid urgency value", async () => {
    const response = await request(app).post("/api/event").send({
      eventName: "Test Event Invalid Urgency",
      eventDescription: "This is a test event with invalid urgency",
      location: "Houston",
      requiredSkills: "Leadership",
      urgency: "Critical", // Invalid urgency
      eventDate: "2024-10-18",
      startTime: "10:00:00",
      endTime: "13:00:00",
      repeatEvent: "Daily",
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Invalid urgency level.");
  });

  it("should return 400 for invalid repeatEvent value", async () => {
    const response = await request(app).post("/api/event").send({
      eventName: "Test Event Invalid Repeat",
      eventDescription: "This is a test event with invalid repeatEvent",
      location: "Houston",
      requiredSkills: "Leadership",
      urgency: "High",
      eventDate: "2024-10-18",
      startTime: "10:00:00",
      endTime: "13:00:00",
      repeatEvent: "Yearly", // Invalid repeat event
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Invalid repeat event value.");
  });
});

// Tests for GET /api/event
describe("GET /api/event", () => {
  it("should return all events", async () => {
    const response = await request(app).get("/api/event");
    expect(response.statusCode).toBe(200); // Expect 200 OK status
    expect(Array.isArray(response.body)).toBe(true); // Check if the response is an array
    expect(response.body.length).toBeGreaterThan(0); // Confirm at least one event is returned
  });

  it("should return an empty array if no events are available", async () => {
    // Clear all events
    await db.query("DELETE FROM EventDetails");

    const response = await request(app).get("/api/event");
    expect(response.statusCode).toBe(200); // Expect 200 OK status
    expect(response.body).toEqual([]); // Should return an empty array
  });
});
