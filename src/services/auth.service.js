import User from '../models/user.model.js';

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
