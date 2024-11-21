const request = require("supertest");
const express = require("express");
const volunteerRoutes = require("../routes/volunteer"); // Adjust path as necessary

const app = express();
app.use(express.json());
app.use("/api/volunteer", volunteerRoutes);

describe("POST /api/volunteer", () => {
  test("should return 200 and success message for a matching volunteer and event", async () => {
    const response = await request(app)
      .post("/api/volunteer")
      .send({ volunteerName: "Volunteer 1", eventName: "Event 1" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Successfully matched! Compatible skill, location, etc.");
  });

  test("should return 200 and mismatch message for a volunteer and event with incompatible skill/location", async () => {
    const response = await request(app)
      .post("/api/volunteer")
      .send({ volunteerName: "Volunteer 1", eventName: "Event 2" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "Volunteer and event do not match. Incompatible skill, location, etc."
    );
  });

  test("should return 404 if the volunteer is not found", async () => {
    const response = await request(app)
      .post("/api/volunteer")
      .send({ volunteerName: "Nonexistent Volunteer", eventName: "Event 1" });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Volunteer or event not found.");
  });

  test("should return 404 if the event is not found", async () => {
    const response = await request(app)
      .post("/api/volunteer")
      .send({ volunteerName: "Volunteer 1", eventName: "Nonexistent Event" });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Volunteer or event not found.");
  });

  test("should return 400 if volunteerName or eventName is missing", async () => {
    const response = await request(app).post("/api/volunteer").send({ volunteerName: "" }); // Missing eventName

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("All fields are required");
  });

  test("should return 400 if both volunteerName and eventName are missing", async () => {
    const response = await request(app).post("/api/volunteer").send({}); // Missing both fields

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("All fields are required");
  });
});
