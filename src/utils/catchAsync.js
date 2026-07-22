/**
 * Wrapper for async express routes/middleware to forward caught rejections to next().
 * @param {Function} fn - Async controller/middleware function
 * @returns {Function} Express route handler function
 */
export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
