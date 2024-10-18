const request = require('supertest'); //npm install --save-dev jest supertest
const express = require('express');
const profileRoutes = require('../routes/profile');

const app = express();
app.use(express.json());
app.use('/api/profile', profileRoutes);

describe('Profile API', () => {
  it('should create a new profile', async () => {
    const res = await request(app)
      .post('/api/profile')
      .send({
        fullName: 'John Doe',
        address: '123 Main St',
        addressTwo: '123 not Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        skills: ['JavaScript', 'Node.js'],
        preferences: 'Remote',
        availability: '2024/10/27'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toBe('Profile Created!');
  });

  it('should return an error for missing fields', async () => {
    const res = await request(app)
      .post('/api/profile')
      .send({}); 
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe('All fields are required');
  });

  it('should return an error for invalid zip code format', async () => {
    const res = await request(app)
      .post('/api/profile')
      .send({
        fullName: 'John Doe',
        address: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '123',
        skills: ['JavaScript', 'Node.js'],
        preferences: 'Remote',
        availability: '2024/10/27'
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe('Invalid zip code format');
  });
});