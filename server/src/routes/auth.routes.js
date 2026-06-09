/**
 * @fileoverview Authentication routes.
 * @route /api/auth
 */

const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const { auth: authValidators } = require('../validators');
const verifyToken = require('../middleware/verifyToken');
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login requests per window
  message: { message: 'Too many login attempts from this IP, please try again after 15 minutes' }
});

// POST /api/auth/register-customer — Register a new customer
router.post('/register-customer', authController.registerCustomer);

// POST /api/auth/login — Authenticate staff/admin and issue JWT
router.post('/login', loginLimiter, authValidators.login, authController.login);

// POST /api/auth/logout - Clear JWT cookie
router.post('/logout', authController.logout);

// GET /api/auth/me - Get current user using cookie
router.get('/me', verifyToken, authController.getMe);

// PUT /api/auth/change-password - Change current user's password
router.put('/change-password', verifyToken, authController.changePassword);

module.exports = router;
