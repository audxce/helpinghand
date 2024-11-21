const request = require("supertest");
const express = require("express");
const userRegistrationRoutes = require("../routes/user_registration");
const db = require("../../db"); // Mocked database module

jest.mock("../../db", () => ({
  query: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use("/api/user-registration", userRegistrationRoutes);

describe("User Registration API", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear any mock calls before each test
  });

  it("should register a new user successfully", async () => {
    db.query
      // Mock email existence check (no existing user)
      .mockImplementationOnce((query, params, callback) => {
        callback(null, []);
      })
      // Mock password hash insert into UserCredentials
      .mockImplementationOnce((query, params, callback) => {
        callback(null, { insertId: 1 });
      })
      // Mock UserProfile insertion
      .mockImplementationOnce((query, params, callback) => {
        callback(null);
      });

    const res = await request(app)
      .post("/api/user-registration")
      .send({
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
        fullName: "John Doe",
        address: "123 Main St",
        addressTwo: "",
        city: "Anytown",
        state: "CA",
        zipcode: "12345",
        skills: ["gardening", "cooking"],
        availability: ["2024-11-01", "2024-12-01"],
        preferences: "Remote",
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toBe("User registered successfully!");
  });

  it("should return an error if email already exists", async () => {
    db.query.mockImplementationOnce((query, params, callback) => {
      callback(null, [{ email: "test@example.com" }]); // Mock existing user
    });

    const res = await request(app)
      .post("/api/user-registration")
      .send({
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
        fullName: "John Doe",
      });

    expect(res.statusCode).toEqual(409);
    expect(res.body.message).toBe("User already exists");
  });

  it("should return an error if passwords do not match", async () => {
    const res = await request(app)
      .post("/api/user-registration")
      .send({
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password456",
        fullName: "John Doe",
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe("Passwords do not match");
  });

  it("should return an error if required fields are missing", async () => {
    const res = await request(app).post("/api/user-registration").send({
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe("Full name, email, and password are required");
  });

  it("should handle internal server errors gracefully", async () => {
    db.query.mockImplementationOnce((query, params, callback) => {
      callback(new Error("Database error"), null); // Simulate a database error
    });

    const res = await request(app)
      .post("/api/user-registration")
      .send({
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
        fullName: "John Doe",
      });

    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toBe("Internal server error");
  });
});
