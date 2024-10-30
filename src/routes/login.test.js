const request = require("supertest");
const express = require("express");
const loginRoute = require("./login");
const users = require("./users");
const app = express();
app.use(express.json()); // Parse JSON bodies
app.use("/login", loginRoute); // Use the login route

// Mock users array
users.push({ email: "test@example.com", password: "password123" });

describe("POST /login", () => {
  it("should return 200 and success message for valid credentials", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Login successful!" });
  });

  it("should return 401 for invalid credentials", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: "wrong@example.com", password: "wrongpassword" });

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ message: "Invalid email or password" });
  });

  it("should return 401 if password is incorrect", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "wrongpassword" });

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ message: "Invalid email or password" });
  });
});
