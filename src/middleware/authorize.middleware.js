/**
 * Restrict route access to users with one of the given roles.
 * Must be used after the protect middleware so req.user is set.
 *
 * @param {...string} roles - Allowed roles (e.g. 'admin', 'user')
 * @returns {import('express').RequestHandler}
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      const error = new Error('Please log in to access this resource');
      error.statusCode = 401;
      return next(error);
    }

    if (!roles.includes(req.user.role)) {
      const error = new Error('You do not have permission to perform this action');
      error.statusCode = 403;
      return next(error);
    }

    next();
  };
};

/**
 * Shorthand for admin-only routes.
 */
export const adminOnly = restrictTo('admin');
