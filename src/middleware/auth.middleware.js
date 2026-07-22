import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { catchAsync } from '../utils/catchAsync.js';

/**
 * Middleware to protect routes: verifies JWT and attaches authenticated user.
 */
export const protect = catchAsync(async (req, res, next) => {
  // 1. Get token from Authorization header
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    const error = new Error('Please log in to access this resource');
    error.statusCode = 401;
    throw error;
  }

  // 2. Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
  } catch (err) {
    const error = new Error('Invalid or expired token');
    error.statusCode = 401;
    throw error;
  }

  // 3. Check if user still exists
  const currentUser = await User.findById(decoded.id).select('-password');
  if (!currentUser) {
    const error = new Error('The user belonging to this token no longer exists');
    error.statusCode = 401;
    throw error;
  }

  // 4. Attach user to request
  req.user = currentUser;
  next();
});
