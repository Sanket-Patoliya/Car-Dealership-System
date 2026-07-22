import express from 'express';
import request from 'supertest';
import { protect } from '../../src/middleware/auth.middleware.js';
import { adminOnly, restrictTo } from '../../src/middleware/authorize.middleware.js';
import { errorHandler } from '../../src/middleware/error.middleware.js';
import User from '../../src/models/user.model.js';
import { generateToken } from '../../src/utils/jwt.js';

const testApp = express();
testApp.use(express.json());

testApp.get('/admin-route', protect, adminOnly, (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Admin access granted',
  });
});

testApp.get('/user-or-admin-route', protect, restrictTo('user', 'admin'), (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Access granted',
  });
});

testApp.use(errorHandler);

describe('Authorize Middleware', () => {
  let adminUser;
  let regularUser;
  let adminToken;
  let userToken;

  beforeEach(async () => {
    adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    });

    regularUser = await User.create({
      name: 'Regular User',
      email: 'user@example.com',
      password: 'password123',
      role: 'user',
    });

    adminToken = generateToken(adminUser._id);
    userToken = generateToken(regularUser._id);
  });

  describe('adminOnly', () => {
    it('should allow access for users with the admin role', async () => {
      const res = await request(testApp)
        .get('/admin-route')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.message).toBe('Admin access granted');
    });

    it('should reject access for non-admin users with 403', async () => {
      const res = await request(testApp)
        .get('/admin-route')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe('fail');
      expect(res.body.message).toMatch(/permission/i);
    });
  });

  describe('restrictTo', () => {
    it('should allow access when the user role is in the allowed list', async () => {
      const res = await request(testApp)
        .get('/user-or-admin-route')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
    });
  });
});
