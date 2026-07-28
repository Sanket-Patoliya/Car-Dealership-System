/**
 * Global error handler middleware for Express.
 * Formats errors to ensure consistency in response payloads.
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  // Handle Mongoose Validation Errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
  }

  // Handle Mongoose Cast Errors (e.g., invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid format for field ${err.path}`;
  }

  res.status(statusCode).json({
    status: statusCode === 500 ? 'error' : 'fail',
    message,
  });
};
