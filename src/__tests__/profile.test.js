const request = require('supertest'); //npm install --save-dev jest supertest
const express = require('express');
const profileRoutes = require('../routes/profile');

const app = express();
app.use(express.json());
app.use('/api/profile', profileRoutes);

describe('Profile Edit', () => {
  it('should create a new profile', async () => {
    const res = await request(app)
      .post('/api/profile')
      .send({
        fullName: 'First Last',
        address: '123 Main St',
        addressTwo: '123 not Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        skills: ['gardening', 'cooking'],
        preferences: 'Remote',
        availability: ['2024/10/27']
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

  it('should return an error for invalid field length', async () => {
    const res = await request(app)
      .post('/api/profile')
      .send({
        fullName: 'Alexander Maximilian Theodore MontgomerySmithSmithSmith',
        address: '123 Main St',
        addressTwo: '123 not Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        skills: ['gardening', 'cooking'],
        preferences: 'Remote',
        availability: ['2024/10/27']
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe('Fields are an invalid length');
  });

  it('should return an error for invalid zipcode', async () => {
    const res = await request(app)
      .post('/api/profile')
      .send({
        fullName: 'First Last',
        address: '123 Main St',
        addressTwo: '123 not Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '123456',
        skills: ['gardening', 'cooking'],
        preferences: 'Remote',
        availability: ['2024/10/27']
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe('Invalid zip code format');
  });

  it('should return an error for invalid skill', async () => {
    const res = await request(app)
      .post('/api/profile')
      .send({
        fullName: 'First Last',
        address: '123 Main St',
        addressTwo: '123 not Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        skills: ['gardening2', 'cooking@'],
        preferences: 'Remote',
        availability: ['2024/10/27']
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe('Skills cannot contain numbers or special characters');
  });

  it('should return an error for invalid field type for names', async () => {
    const res = await request(app)
      .post('/api/profile')
      .send({
        fullName: 'First@ Last2',
        address: '123 Main St',
        addressTwo: '123 not Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        skills: ['gardening', 'cooking'],
        preferences: 'Remote',
        availability: ['2024/10/27']
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe('Names cannot legally contain numbers or special characters');
  });

  it('should return an error for invalid field type for state code', async () => {
    const res = await request(app)
      .post('/api/profile')
      .send({
        fullName: 'First Last',
        address: '123 Main St',
        addressTwo: '123 not Main St',
        city: 'Anytown',
        state: 'C2',
        zipCode: '12345',
        skills: ['gardening', 'cooking'],
        preferences: 'Remote',
        availability: ['2024/10/27']
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe('State code cannot contain numbers or special characters');
  });

  it('should return an error for invalid format for dates', async () => {
    const res = await request(app)
      .post('/api/profile')
      .send({
        fullName: 'First Last',
        address: '123 Main St',
        addressTwo: '123 not Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        skills: ['gardening', 'cooking'],
        preferences: 'Remote',
        availability: ['202V#$/10/27']
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe('Dates must be in valid format');
  });

});