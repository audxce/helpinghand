const request = require("supertest");
const express = require("express");
const volunteerMatchingRouter = require("../routes/volunteer"); // Assuming you named the file volunteerMatching.js

const app = express();
app.use(express.json());
app.use("/api/volunteer", volunteerMatchingRouter);

describe("POST /api/volunteer", () => {

  it("should successfully match a volunteer with an event", async () => {
    const matchData = {
      volunteerName: "Volunteer 1",
      eventName: "Event 1",
    };

    const response = await request(app).post("/api/volunteer").send(matchData);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Successfully matched! Compatible skill, location, etc.");
  });

  it("should return a 400 error for missing fields", async () => {
    const response = await request(app).post("/api/volunteer").send({
      volunteerName: "Volunteer 1",
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("All fields are required");
  });

  it("should return a 404 error when volunteer or event is not found", async () => {
    const nonExistentData = {
      volunteerName: "Volunteer 3", // Non-existent volunteer
      eventName: "Event 1",
    };

    const response = await request(app).post("/api/volunteer").send(nonExistentData);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Volunteer or event not found.");
  });

  it("should return a 200 with mismatch when volunteer and event don't match", async () => {
    const mismatchData = {
      volunteerName: "Volunteer 1",
      eventName: "Event 2", // Different skill/location
    };

    const response = await request(app).post("/api/volunteer").send(mismatchData);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Volunteer and event do not match. Incompatible skill, location, etc.");
  });


});