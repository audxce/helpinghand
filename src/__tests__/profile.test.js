const request = require("supertest");
const express = require("express");
const profileRoutes = require("../routes/profile");
const db = require("../db");

jest.mock("../db", () => ({
  query: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  req.session = { user: { id: 1 } }; 
  next();
});
app.use("/api/profile", profileRoutes);

describe("Profile API", () => {
  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  it("should return 401 if the user is not logged in", async () => {
    const noSessionApp = express();
    noSessionApp.use(express.json());
    noSessionApp.use("/api/profile", profileRoutes);

    const res = await request(noSessionApp).post("/api/profile").send({
      fullName: "John Doe",
      address: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      skills: ["gardening"],
      preferences: ["remote"],
      availability: ["weekends"],
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Unauthorized. Please log in.");
  });

  it("should update an existing profile", async () => {
    db.query.mockImplementation(async (query, params) => {
      if (query.startsWith("SELECT * FROM UserProfile WHERE user_id")) {
        return [[{
          user_id: 1,
          full_name: "John Doe",
          address: "123 Main St",
          address_two: "",
          city: "Anytown",
          state: "CA",
          zipcode: "12345",
          skills: JSON.stringify(["gardening"]),
          preferences: JSON.stringify(["remote"]),
          availability: JSON.stringify(["weekends"]),
        }]];
      }
      if (query.startsWith("UPDATE UserProfile")) {
        return []; 
      }
      throw new Error("Unexpected query");
    });

    const res = await request(app)
      .post("/api/profile")
      .send({
        fullName: "John Doe Updated",
        address: "456 Elm St",
        city: "New City",
        state: "NY",
        zipCode: "54321",
        skills: ["coding"],
        preferences: ["onsite"],
        availability: ["weekdays"],
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Profile updated successfully");
  });

  it("should fetch volunteer users", async () => {
    db.query.mockResolvedValue([
      [
        {
          user_id: 2,
          full_name: "Volunteer User",
          address: "123 Elm St",
          address_two: "",
          city: "Helpingtown",
          state: "CA",
          zipcode: "11111",
          skills: JSON.stringify(["helping"]),
          preferences: JSON.stringify(["remote"]),
          availability: JSON.stringify(["weekends"]),
        },
      ],
    ]);

    const res = await request(app).get("/api/profile/volunteer");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should return 404 if user profile is not found", async () => {
    const userId = 1;
    const req = { session: { user: { id: userId } } };
  
    db.query.mockResolvedValue([[]]); 
  
    const res = await request(app).get("/api/profile").set("Cookie", [`session=mock-session-token`]);
  
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("User not found");
  });
  it("should return 500 if there is a database error", async () => {

    const userId = 1;
    const req = { session: { user: { id: userId } } };
  
    db.query.mockRejectedValue(new Error("Database error"));
  
    const res = await request(app).get("/api/profile").set("Cookie", [`session=mock-session-token`]);
  
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Error fetching user data");
  });

  it("should return user profile if found", async () => {

    const userId = 1;
    const req = { session: { user: { id: userId } } };

    const mockProfile = [
      {
        user_id: 1,
        full_name: "John Doe",
        address: "123 Main St",
        address_two: "",
        city: "Anytown",
        state: "CA",
        zipcode: "12345",
        skills: JSON.stringify(["gardening"]),
        preferences: JSON.stringify(["remote"]),
        availability: JSON.stringify(["weekends"]),
      },
    ];
  
    db.query.mockResolvedValue([mockProfile]); 
    const res = await request(app).get("/api/profile").set("Cookie", [`session=mock-session-token`]);
  
    expect(res.statusCode).toBe(200);
  });

  it("should return 404 if no administrator users are found", async () => {
    db.query.mockResolvedValue([[]]);
  
    const res = await request(app).get("/api/profile/admin");
  
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("No administrator users found");
  });
  it("should return administrator users if found", async () => {
    const mockAdmins = [
      {
        user_id: 1,
        full_name: "Admin User",
        address: "123 Admin St",
        address_two: "",
        city: "Admin City",
        state: "NY",
        zipcode: "10001",
        skills: JSON.stringify(["management"]),
        preferences: JSON.stringify(["remote"]),
        availability: JSON.stringify(["weekdays"]),
      },
    ];

    db.query.mockResolvedValue([mockAdmins]);
  
    const res = await request(app).get("/api/profile/admin");
  
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);  // One admin user
  });

  it("should return 500 if there is a database error", async () => {
    db.query.mockRejectedValue(new Error("Database error"));
  
    const res = await request(app).get("/api/profile/admin");
  
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Error fetching user data");
  });
  it("should return 404 if no volunteer users are found", async () => {
    db.query.mockResolvedValue([[]]);

    const res = await request(app).get("/api/profile/volunteer");

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("No volunteer users found");
  });

  it("should return 500 if there is a database error", async () => {
    db.query.mockRejectedValue(new Error("Database error"));

    const res = await request(app).get("/api/profile/volunteer");

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Error fetching user data");
  });
});



