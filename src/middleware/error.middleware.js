/**
 * Global error handler middleware for Express.
 * Formats errors to ensure consistency in response payloads.
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    status: statusCode === 500 ? 'error' : 'fail',
    message: err.message || 'Internal server error',
  });
};
