import express from 'express';
import request from 'supertest';
import mongoose from 'mongoose';
import { protect } from '../../src/middleware/auth.middleware.js';
import { errorHandler } from '../../src/middleware/error.middleware.js';
import User from '../../src/models/user.model.js';
import { generateToken } from '../../src/utils/jwt.js';

const testApp = express();
testApp.use(express.json());

// A protected test route for testing the middleware
testApp.get('/protected-route', protect, (req, res) => {
  res.status(200).json({
    status: 'success',
    user: req.user,
  });
});

testApp.use(errorHandler);

describe('Auth Middleware: protect', () => {
  let user;
  let validToken;

  beforeEach(async () => {
    // Seed a user in the in-memory DB
    user = await User.create({
      name: 'Test Auth User',
      email: 'testauth@example.com',
      password: 'password123',
    });
    validToken = generateToken(user._id);
  });

  it('should allow access if a valid token is provided in Authorization header', async () => {
    const res = await request(testApp)
      .get('/protected-route')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(user.email);
  });

  it('should reject access if Authorization header is missing', async () => {
    const res = await request(testApp)
      .get('/protected-route');

    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe('fail');
    expect(res.body.message).toMatch(/log in|access/i);
  });

  it('should reject access if Authorization header does not use Bearer format', async () => {
    const res = await request(testApp)
      .get('/protected-route')
      .set('Authorization', `Basic ${validToken}`);

    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe('fail');
    expect(res.body.message).toMatch(/log in|access/i);
  });

  it('should reject access if token is invalid or expired', async () => {
    const res = await request(testApp)
      .get('/protected-route')
      .set('Authorization', 'Bearer invalid-token-string');

    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe('fail');
    expect(res.body.message).toMatch(/invalid|expired/i);
  });

  it('should reject access if the user belonging to the token no longer exists', async () => {
    const randomId = new mongoose.Types.ObjectId();
    const tokenForNonexistentUser = generateToken(randomId);

    const res = await request(testApp)
      .get('/protected-route')
      .set('Authorization', `Bearer ${tokenForNonexistentUser}`);

    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe('fail');
    expect(res.body.message).toMatch(/belonging.*no longer exists/i);
  });
});
