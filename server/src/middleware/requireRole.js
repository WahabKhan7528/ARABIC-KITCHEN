/**
 * @fileoverview Role-based authorization middleware.
 *
 * Factory function that returns middleware restricting access to the
 * specified roles. Must be placed AFTER `verifyToken` in the middleware
 * chain so that `req.user` is populated.
 *
 * @example
 *   // Single role
 *   router.use(verifyToken, requireRole('admin'));
 *
 *   // Multiple roles
 *   router.post('/', verifyToken, requireRole('staff', 'admin'), controller.create);
 *
 * @module middleware/requireRole
 */

/**
 * Creates middleware that checks whether the authenticated user has one
 * of the allowed roles.
 *
 * @param {...string} allowedRoles - One or more role strings to permit
 * @returns {Function} Express middleware
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}.`,
      });
    }

    next();
  };
};

module.exports = requireRole;
