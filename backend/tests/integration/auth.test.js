import request from 'supertest';
import app from '../../src/app.js';
import mongoose from 'mongoose';
import User from '../../src/models/user.model.js';

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

  it('should reject registration if email format is invalid or password is too short', async () => {
    const invalidEmailRes = await request(app)
      .post('/api/auth/register')
      .send({ name: 'John Doe', email: 'invalid-email', password: 'password123' });

    expect(invalidEmailRes.statusCode).toBe(400);
    expect(invalidEmailRes.body).toHaveProperty('status', 'fail');
    expect(invalidEmailRes.body.message).toMatch(/valid email/i);

    const shortPassRes = await request(app)
      .post('/api/auth/register')
      .send({ name: 'John Doe', email: 'john@example.com', password: '123' });

    expect(shortPassRes.statusCode).toBe(400);
    expect(shortPassRes.body).toHaveProperty('status', 'fail');
    expect(shortPassRes.body.message).toMatch(/6 characters/i);
  });
});

describe('POST /api/auth/login', () => {
  it('should login a user successfully with valid credentials', async () => {
    const password = 'password123';
    const user = await User.create({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: password,
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'jane@example.com',
        password: password,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data).toHaveProperty('user');

    const returnedUser = res.body.data.user;
    expect(returnedUser).toHaveProperty('id');
    expect(returnedUser).toHaveProperty('name', user.name);
    expect(returnedUser).toHaveProperty('email', user.email);
    expect(returnedUser).not.toHaveProperty('password');
  });

  it('should reject login if password is correct but invalid', async () => {
    await User.create({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123',
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'jane@example.com',
        password: 'wrongpassword',
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('status', 'fail');
    expect(res.body.message).toMatch(/invalid|credentials|password/i);
  });

  it('should reject login for a non-existent user email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('status', 'fail');
    expect(res.body.message).toMatch(/invalid|credentials|email|user/i);
  });

  it('should reject login if required fields are missing or email is invalid format', async () => {
    const testCases = [
      { password: 'password123' }, // email missing
      { email: 'jane@example.com' }, // password missing
      {}, // both missing
    ];

    for (const incompleteCredentials of testCases) {
      const res = await request(app)
        .post('/api/auth/login')
        .send(incompleteCredentials);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('status', 'fail');
      expect(res.body.message).toMatch(/required|missing|validate|validation/i);
    }

    const invalidEmailRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'not-an-email', password: 'password123' });

    expect(invalidEmailRes.statusCode).toBe(400);
    expect(invalidEmailRes.body).toHaveProperty('status', 'fail');
    expect(invalidEmailRes.body.message).toMatch(/valid email/i);
  });
});

