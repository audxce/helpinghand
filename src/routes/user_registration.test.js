const request = require("supertest");
const express = require("express");
const userRegistrationRoute = require("./user_registration"); // Adjust path if needed
const app = express();

app.use(express.json()); // Parse JSON bodies
app.use("/user_registration", userRegistrationRoute); // Use the user registration route

describe("User Registration API", () => {
  // Test the POST /user_registration route for a successful registration
  it("should register a new user with all required fields", async () => {
    const newUser = {
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
      fullName: "Test",
    };

    const res = await request(app).post("/user_registration").send(newUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User registered successfully!");
  });

  // Test the POST /user_registration route with missing required fields
  it("should return 400 for missing required fields", async () => {
    const incompleteUser = {
      email: "test@example.com",
      password: "password123",
    };

    const res = await request(app).post("/user_registration").send(incompleteUser);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Full name, email, and password are required");
  });

  // Test the POST /user_registration route with mismatched passwords
  it("should return 400 if passwords do not match", async () => {
    const mismatchedPasswordUser = {
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password321",
      fullName: "Test",
    };

    const res = await request(app).post("/user_registration").send(mismatchedPasswordUser);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Passwords do not match");
  });

  // Test the POST /user_registration route if the user already exists
  it("should return 409 if the user already exists", async () => {
    const existingUser = {
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
      fullName: "Test",
    };

    // First registration
    await request(app).post("/user_registration").send(existingUser);
    // Second registration attempt with the same email
    const res = await request(app).post("/user_registration").send(existingUser);

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe("User already exists");
  });
});
