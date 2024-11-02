const request = require("supertest");
const express = require("express");
const loginRoute = require("./login"); // Ensure this path is correct

const app = express();
app.use(express.json());
app.use("/api/login", loginRoute); // Add the `/api` prefix to match your app’s route

describe("POST /api/login", () => {
  it("should successfully log in with correct credentials", async () => {
    const response = await request(app)
      .post("/api/login")
      .send({ email: "test@test.com", password: "correctpassword" });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Login successful!");
  });

  it("should fail to log in with incorrect password", async () => {
    const response = await request(app)
      .post("/api/login")
      .send({ email: "test@test.com", password: "wrongpassword" });

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Invalid email or password");
  });

  it("should return 400 if email or password is missing", async () => {
    const response = await request(app)
      .post("/api/login")
      .send({ email: "test@test.com" });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Email and password are required");
  });
});
