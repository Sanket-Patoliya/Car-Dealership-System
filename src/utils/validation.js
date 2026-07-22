import mongoose from 'mongoose';

/**
 * Validates a MongoDB ObjectId. Throws a 400 bad request error if invalid.
 * @param {string} id - The ObjectId string to validate
 * @param {string} [name='ID'] - The name of the ID field for error messages
 */
export const validateObjectId = (id, name = 'ID') => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error(`Invalid ${name} format`);
    error.statusCode = 400;
    throw error;
  }
};
