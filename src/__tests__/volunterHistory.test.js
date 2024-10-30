const request = require("supertest");
const express = require("express");
const volunteerHistoryRouter = require("../routes/volunteerHistory"); // Adjust the path as necessary

const app = express();
app.use(express.json());
app.use("/api/volunteerHistory", volunteerHistoryRouter);

// Tests for GET /api/volunteerHistory
describe("GET /api/volunteerHistory", () => {
  it("should return all volunteer history", async () => {
    const response = await request(app).get("/api/volunteerHistory");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2); // Check initial length of volunteer history
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
      skills: "Skill C",
      urgency: "High",
      description: "Description for Event 3",
    };

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
});
