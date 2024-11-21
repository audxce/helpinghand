const request = require("supertest");
const express = require("express");
const loginRoutes = require("../routes/login");
const db = require("../../db"); // Mocked database module
const bcrypt = require("bcryptjs");

jest.mock("../../db", () => ({
  query: jest.fn(),
}));

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  req.session = {}; // Mock session
  next();
});
app.use("/api/login", loginRoutes);

describe("Login API", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  it("should log in successfully with valid credentials", async () => {
    // Mock database response for a valid user
    db.query.mockImplementationOnce((query, params, callback) => {
      callback(null, [
        {
          user_id: 1,
          email: "test@example.com",
          password_hash: "hashed_password",
          role: "volunteer",
        },
      ]);
    });

    // Mock bcrypt password comparison
    bcrypt.compare.mockImplementationOnce((password, hash, callback) => {
      callback(null, true); // Password matches
    });

    const res = await request(app).post("/api/login").send({
      email: "test@example.com",
      password: "password123",
    });

    console.log("Response:", res.body); // Debugging output for troubleshooting

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe("Login successful!");
    expect(res.body.role).toBe("volunteer");
  });

  it("should return an error if email and password are not provided", async () => {
    const res = await request(app).post("/api/login").send({}); // Missing email and password

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe("Email and password are required");
  });

  it("should return an error if user does not exist", async () => {
    // Mock database response for no user found
    db.query.mockImplementationOnce((query, params, callback) => {
      callback(null, []); // No user found
    });

    const res = await request(app).post("/api/login").send({
      email: "nonexistent@example.com",
      password: "password123",
    });

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe("Invalid email or password");
  });

  it("should return an error if password does not match", async () => {
    // Mock database response for a valid user
    db.query.mockImplementationOnce((query, params, callback) => {
      callback(null, [
        {
          user_id: 1,
          email: "test@example.com",
          password_hash: "hashed_password",
          role: "volunteer",
        },
      ]);
    });

    // Mock bcrypt password comparison
    bcrypt.compare.mockImplementationOnce((password, hash, callback) => {
      callback(null, false); // Password does not match
    });

    const res = await request(app).post("/api/login").send({
      email: "test@example.com",
      password: "wrongpassword",
    });

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe("Invalid email or password");
  });

  it("should handle database errors gracefully", async () => {
    // Mock database error
    db.query.mockImplementationOnce((query, params, callback) => {
      callback(new Error("Database error"), null);
    });

    const res = await request(app).post("/api/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toBe("Internal server error");
  });

  it("should handle bcrypt errors gracefully", async () => {
    // Mock database response for a valid user
    db.query.mockImplementationOnce((query, params, callback) => {
      callback(null, [
        {
          user_id: 1,
          email: "test@example.com",
          password_hash: "hashed_password",
          role: "volunteer",
        },
      ]);
    });

    // Mock bcrypt error
    bcrypt.compare.mockImplementationOnce((password, hash, callback) => {
      callback(new Error("Bcrypt error"), null);
    });

    const res = await request(app).post("/api/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toBe("Internal server error");
  });
});
