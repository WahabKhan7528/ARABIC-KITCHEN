/**
 * @fileoverview Async handler wrapper for Express route controllers.
 *
 * Eliminates repetitive try/catch blocks in every controller method by
 * catching rejected promises and forwarding them to Express's global
 * error handler automatically.
 *
 * @example
 *   const asyncHandler = require('../middleware/asyncHandler');
 *
 *   exports.getAll = asyncHandler(async (req, res) => {
 *     const items = await MenuItem.find();
 *     res.json({ items });
 *   });
 */

/**
 * Wraps an async route handler so that any thrown or rejected error is
 * automatically passed to `next()`, reaching the global error middleware.
 *
 * @param {Function} fn - Async Express route handler `(req, res, next) => Promise`
 * @returns {Function} Standard Express middleware that catches errors
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
