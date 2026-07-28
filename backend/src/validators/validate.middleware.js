import { validationResult } from 'express-validator';

/**
 * Express middleware to validate incoming requests against express-validator rules.
 * If validation fails, forwards an error with status 400 to the central error handler.
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg).join(', ');
    const error = new Error(errorMessages);
    error.statusCode = 400;
    return next(error);
  }
  next();
};
