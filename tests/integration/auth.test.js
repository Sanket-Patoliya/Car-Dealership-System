import request from 'supertest';
import app from '../../src/app.js';
import mongoose from 'mongoose';

describe('POST /api/auth/register', () => {
  const validUser = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
  };

  it('should register a user successfully with valid details', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(validUser);

    // 1. Assert Response Status and Envelope Structure
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body.data).toHaveProperty('user');
    
    // 2. Assert Returned User Properties (Sensitive info like password excluded)
    const returnedUser = res.body.data.user;
    expect(returnedUser).toHaveProperty('id');
    expect(returnedUser).toHaveProperty('name', validUser.name);
    expect(returnedUser).toHaveProperty('email', validUser.email);
    expect(returnedUser).not.toHaveProperty('password');

    // 3. Assert Database Persistence directly via standard MongoDB connection
    const userInDb = await mongoose.connection.db.collection('users').findOne({ email: validUser.email });
    expect(userInDb).not.toBeNull();
    expect(userInDb.name).toBe(validUser.name);
  });

  it('should reject registration if the email is already registered', async () => {
    // Attempt registration 1 (Success)
    await request(app)
      .post('/api/auth/register')
      .send(validUser);

    // Attempt registration 2 (Failure due to duplicate email)
    const res = await request(app)
      .post('/api/auth/register')
      .send(validUser);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('status', 'fail');
    expect(res.body.message).toMatch(/exists|duplicate|registered/i);
  });

  it('should reject registration if required fields are missing', async () => {
    const testCases = [
      { name: 'John Doe', password: 'password123' }, // email missing
      { email: 'john@example.com', password: 'password123' }, // name missing
      { name: 'John Doe', email: 'john@example.com' }, // password missing
    ];

    for (const incompleteUser of testCases) {
      const res = await request(app)
        .post('/api/auth/register')
        .send(incompleteUser);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('status', 'fail');
      expect(res.body.message).toMatch(/required|missing|validate|validation/i);
    }
  });
});
