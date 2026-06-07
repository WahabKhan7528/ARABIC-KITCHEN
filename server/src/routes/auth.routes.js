/**
 * @fileoverview Authentication routes.
 * @route /api/auth
 */

const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const { auth: authValidators } = require('../validators');
const verifyToken = require('../middleware/verifyToken');

// POST /api/auth/register-customer — Register a new customer
router.post('/register-customer', authController.registerCustomer);

// POST /api/auth/login — Authenticate staff/admin and issue JWT
router.post('/login', authValidators.login, authController.login);

// POST /api/auth/logout - Clear JWT cookie
router.post('/logout', authController.logout);

// GET /api/auth/me - Get current user using cookie
router.get('/me', verifyToken, authController.getMe);

module.exports = router;
