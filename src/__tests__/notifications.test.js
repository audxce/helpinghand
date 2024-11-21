const request = require("supertest");
const express = require("express");
const notificationsRoutes = require("../routes/notifications");
const db = require("../../db");

jest.mock("../../db", () => ({
  query: jest.fn(),
}));

describe("Notifications API", () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create a new app instance for each test
    app = express();
    app.use(express.json());
    app.use((req, res, next) => {
      req.session = { user: { id: 1 } }; // Mock session with a logged-in user
      next();
    });
    app.use("/api/notifications", notificationsRoutes);
  });

  it("should fetch all notifications for the logged-in user", async () => {
    db.query.mockImplementationOnce((query, params, callback) => {
      callback(null, [
        {
          notificationId: 1,
          message: "Test notification",
          msgtimestamp: "2024-11-20 10:00:00",
          msgtype: "general",
          eventId: null,
          readmsg: 0,
        },
      ]);
    });

    const res = await request(app).get("/api/notifications");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([
      {
        notificationId: 1,
        message: "Test notification",
        msgtimestamp: "2024-11-20 10:00:00",
        msgtype: "general",
        eventId: null,
        readmsg: 0,
      },
    ]);
  });

  it("should return an error if the user is not logged in when fetching notifications", async () => {
    app = express();
    app.use(express.json());
    app.use((req, res, next) => {
      req.session = null; // Mock no session
      next();
    });
    app.use("/api/notifications", notificationsRoutes);

    const res = await request(app).get("/api/notifications");

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe("Unauthorized. Please log in.");
  }, 10000);

  it("should mark all notifications as read", async () => {
    db.query.mockImplementationOnce((query, params, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const res = await request(app).put("/api/notifications/mark-all-read");

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe("All notifications marked as read.");
  });

  it("should return an error if the user is not logged in when marking notifications as read", async () => {
    app = express();
    app.use(express.json());
    app.use((req, res, next) => {
      req.session = null; // Mock no session
      next();
    });
    app.use("/api/notifications", notificationsRoutes);

    const res = await request(app).put("/api/notifications/mark-all-read");

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe("Unauthorized. Please log in.");
  }, 10000);

  it("should add a general notification successfully", async () => {
    db.query
      .mockImplementationOnce((query, params, callback) => {
        callback(null, { insertId: 1 });
      })
      .mockImplementationOnce((query, params, callback) => {
        callback(null);
      });

    const res = await request(app).post("/api/notifications").send({
      message: "Test notification",
      msgtype: "general",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe("Notification sent to all users.");
  });

  it("should return an error when adding a notification with missing fields", async () => {
    const res = await request(app).post("/api/notifications").send({
      msgtype: "general", // Missing message
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBe("Message and msgtype are required.");
  });

  it("should delete a notification successfully", async () => {
    db.query.mockImplementationOnce((query, params, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const res = await request(app).delete("/api/notifications/1");

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe("Notification deleted successfully.");
  });

  it("should return an error if the user is not logged in when deleting a notification", async () => {
    app = express();
    app.use(express.json());
    app.use((req, res, next) => {
      req.session = null; // Mock no session
      next();
    });
    app.use("/api/notifications", notificationsRoutes);

    const res = await request(app).delete("/api/notifications/1");

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe("Unauthorized. Please log in.");
  }, 10000);

  it("should return an error if adding a notification fails due to database error", async () => {
    db.query.mockImplementationOnce((query, params, callback) => {
      callback(new Error("Database error"), null);
    });

    const res = await request(app).post("/api/notifications").send({
      message: "Test notification",
      msgtype: "general",
    });

    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toBe("Error creating notification.");
  });

  it("should handle database errors gracefully when deleting a notification", async () => {
    db.query.mockImplementationOnce((query, params, callback) => {
      callback(new Error("Database error"), null);
    });

    const res = await request(app).delete("/api/notifications/1");

    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toBe("Error deleting notification.");
  });

  it("should add an event notification successfully", async () => {
    db.query
      .mockImplementationOnce((query, params, callback) => {
        callback(null, { insertId: 1 });
      })
      .mockImplementationOnce((query, params, callback) => {
        callback(null);
      });

    const res = await request(app).post("/api/notifications").send({
      message: "Event notification",
      msgtype: "event",
      eventId: 1,
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe("Notification sent to event users.");
  });
});
