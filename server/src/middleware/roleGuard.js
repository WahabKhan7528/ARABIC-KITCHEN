/**
 * Middleware to restrict access based on user role.
 * Must be used AFTER verifyToken.
 *
 * @param {string[]} allowedRoles - Array of roles allowed to access the route
 */
const roleGuard = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Access denied. Role not found.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }

    next();
  };
};

module.exports = roleGuard;
