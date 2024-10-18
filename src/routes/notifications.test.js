const request = require('supertest');
const express = require('express');
const notificationsRoute = require('./notifications');
const app = express();
app.use(express.json()); // Parse JSON bodies
app.use('/notifications', notificationsRoute); // Use the notifications route

describe('Notifications API', () => {

    // Test the GET /notifications route
    it('should return all notifications', async () => {
        const res = await request(app).get('/notifications');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0); // Ensure there are some notifications
    });

    // Test the PUT /notifications/mark-all-read route
    it('should mark all notifications as read', async () => {
        const res = await request(app).put('/notifications/mark-all-read');
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        // Check that all notifications are marked as read
        res.body.notifications.forEach((n) => {
            expect(n.read).toBe(true);
        });
    });

    // Test the POST /notifications route for creating a new notification
    it('should add a new notification', async () => {
        const newNotification = {
            message: "New event notification",
            userId: 123,
            eventId: 456,
        };

        const res = await request(app)
            .post('/notifications')
            .send(newNotification);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.notification).toHaveProperty('id');
        expect(res.body.notification).toHaveProperty('timestamp');
        expect(res.body.notification.message).toBe(newNotification.message);
        expect(res.body.notification.read).toBe(false);
    });

    // Test the POST /notifications route with missing fields
    it('should return 400 for missing required fields', async () => {
        const incompleteNotification = {
            message: "Incomplete notification",
        };

        const res = await request(app)
            .post('/notifications')
            .send(incompleteNotification);

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toBe('Message, userId, and eventId are required');
    });
});
