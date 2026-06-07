/**
 * @fileoverview JWT authentication middleware.
 *
 * Extracts the Bearer token from the Authorization header, verifies it
 * against the JWT_SECRET, and attaches the decoded payload ({ id, role })
 * to `req.user` for downstream middleware and controllers.
 *
 * @module middleware/verifyToken
 */

const jwt = require('jsonwebtoken');

/**
 * Verify the JWT from cookies and populate `req.user`.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const verifyToken = (req, res, next) => {
  let token = req.cookies?.token;

  // Fallback to Authorization header if no cookie is present (optional, helpful for debugging/insomnia)
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = verifyToken;
