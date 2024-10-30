const request = require("supertest");
const express = require("express");
const registrationRoute = require("./user_registration");
const users = require("./users");

const app = express();
app.use(express.json()); // Parse JSON bodies
app.use("/register", registrationRoute); // Use the registration route

// Mock users array (can be reset before each test if needed)
beforeEach(() => {
  users.length = 0; // Clear the users array before each test
});

describe("POST /register", () => {
  // Test successful registration
  it("should register a new user and return 201 status", async () => {
    const newUser = {
      email: "newuser@example.com",
      password: "password123",
      confirmPassword: "password123",
    };

    const res = await request(app).post("/register").send(newUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "User registered successfully!");
    expect(users).toContainEqual({ email: newUser.email, password: newUser.password });
  });

  // Test registration with missing fields
  it("should return 400 if any field is missing", async () => {
    const incompleteUser = {
      email: "incompleteuser@example.com",
      password: "password123",
    };

    const res = await request(app).post("/register").send(incompleteUser);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "All fields are required");
  });

  // Test registration with password mismatch
  it("should return 400 if passwords do not match", async () => {
    const userWithPasswordMismatch = {
      email: "mismatchuser@example.com",
      password: "password123",
      confirmPassword: "password321",
    };

    const res = await request(app).post("/register").send(userWithPasswordMismatch);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Passwords do not match");
  });

  // Test registration with an existing user
  it("should return 409 if the user already exists", async () => {
    // Add a user to the mock users array
    users.push({ email: "existinguser@example.com", password: "password123" });

    const existingUser = {
      email: "existinguser@example.com",
      password: "password123",
      confirmPassword: "password123",
    };

    const res = await request(app).post("/register").send(existingUser);

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty("message", "User already exists");
  });
});
