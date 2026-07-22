import jwt from 'jsonwebtoken';

/**
 * Sign a JWT token for the given user ID.
 * @param {string} userId - The user ID to sign
 * @returns {string} The signed JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '1d' }
  );
};
