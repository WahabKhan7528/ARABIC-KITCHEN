/**
 * @fileoverview Authentication controller for staff/admin login.
 *
 * Handles employee credential verification and JWT token issuance.
 * Only a single endpoint exists — no registration (accounts are created
 * by admins via the staff controller).
 *
 * @module controllers/auth
 */

const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * Register a new customer
 *
 * @route   POST /api/auth/register-customer
 * @access  Public
 */
exports.registerCustomer = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  // Check if customer exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email is already registered' });
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: 'customer'
  });

  // Issue a signed JWT
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
  );

  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.status(201).json({
    message: 'Customer registered successfully',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

/**
 * Authenticate a staff or admin user.
 *
 * @route   POST /api/auth/login
 * @access  Public
 * @body    {string} employeeId - Unique employee identifier
 */
exports.login = asyncHandler(async (req, res) => {
  const { employeeId, email, password } = req.body;

  if ((!employeeId && !email) || !password) {
    return res.status(400).json({ message: 'Please provide credentials and password.' });
  }

  // Find user by either employeeId (staff) or email (customer)
  const query = employeeId ? { employeeId } : { email };
  const user = await User.findOne(query).select('+password');

  if (!user || !user.isActive) {
    return res.status(401).json({ message: 'Invalid credentials or account disabled.' });
  }

  // Deactivated accounts cannot log in
  if (!user.isActive) {
    return res.status(403).json({ message: 'Account is deactivated. Contact your administrator.' });
  }

  // Compare the candidate password against the bcrypt hash
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid employee ID or password.' });
  }

  // Issue a signed JWT containing the user's ID and role
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
  );

  // Set HTTP-Only Cookie
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax', // Use 'lax' in development for localhost
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.json({
    message: 'Login successful',
    user: {
      id: user._id,
      employeeId: user.employeeId,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
});

/**
 * Logout a staff or admin user by clearing the JWT cookie.
 *
 * @route   POST /api/auth/logout
 * @access  Public
 */
exports.logout = asyncHandler(async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });
  
  res.json({ message: 'Logged out successfully' });
});

/**
 * Get current logged in user metadata via the HTTP-Only cookie token.
 *
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = asyncHandler(async (req, res) => {
  // req.user is populated by verifyToken middleware
  const user = await User.findById(req.user.id);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    user: {
      id: user._id,
      employeeId: user.employeeId,
      email: user.email,
      name: user.name,
      role: user.role,
    }
  });
});
