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
export const registerUser = async ({ name, email, password, role }) => {
  // 1. Validate required fields
  if (!name || !email || !password) {
    const error = new Error('Name, email, and password are required');
    error.statusCode = 400;
    throw error;
  }

  // 2. Check if email is already taken
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    const error = new Error('Email is already registered');
    error.statusCode = 400;
    throw error;
  }

  // 3. Create a new user (pre-save hook hashes password)
  const newUser = await User.create({
    name,
    email,
    password,
    role,
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
  const token = generateToken(user._id, user.role);

  return { user, token };
};

