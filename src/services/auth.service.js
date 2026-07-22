import User from '../models/user.model.js';
import { generateToken } from '../utils/jwt.js';


/**
 * Register a new user in the database.
 * @param {Object} userData - User registration data
 * @param {string} userData.name
 * @param {string} userData.email
 * @param {string} userData.password
 * @returns {Promise<Object>} The newly created User document
 */
export const registerUser = async ({ name, email, password }) => {
  // 1. Validate required fields
  if (!name || !email || !password) {
    const error = new Error('Name, email, and password are required validation fields');
    error.statusCode = 400;
    throw error;
  }

  // 2. Reject duplicate email addresses
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('Email address already exists/registered');
    error.statusCode = 400;
    throw error;
  }

  // 3. Create user (password is automatically hashed via model pre-save hook)
  const newUser = await User.create({
    name,
    email,
    password,
  });

  return newUser;
};

/**
 * Log in a user and return the user and a JWT token.
 * @param {Object} credentials
 * @param {string} credentials.email
 * @param {string} credentials.password
 * @returns {Promise<Object>} Object containing user and token
 */
export const loginUser = async ({ email, password }) => {
  // 1. Validate required fields
  if (!email || !password) {
    const error = new Error('Email and password are required');
    error.statusCode = 400;
    throw error;
  }

  // 2. Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // 3. Verify password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // 4. Generate JWT
  const token = generateToken(user._id);

  return { user, token };
};

