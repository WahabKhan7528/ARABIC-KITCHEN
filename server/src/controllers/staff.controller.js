/**
 * @fileoverview Staff management controller — CRUD for employee accounts.
 *
 * Only admin users can access these endpoints. Handles creating new staff
 * accounts, updating profiles (including password changes), deactivation,
 * and deletion. Passwords are hashed via the User model's pre-save hook.
 *
 * @module controllers/staff
 */

const { validationResult } = require('express-validator');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * List all staff and admin accounts (passwords excluded by default).
 *
 * @route   GET /api/staff
 * @access  Private — admin only
 * @returns {{ count: number, staff: User[] }}
 */
exports.getAll = asyncHandler(async (req, res) => {
  const staff = await User.find()
    .populate('createdBy', 'name employeeId')
    .sort({ createdAt: -1 });

  res.json({ count: staff.length, staff });
});

/**
 * Retrieve a single staff member by MongoDB ID.
 *
 * @route   GET /api/staff/:id
 * @access  Private — admin only
 * @returns {{ staff: User }}
 */
exports.getOne = asyncHandler(async (req, res) => {
  const member = await User.findById(req.params.id)
    .populate('createdBy', 'name employeeId');

  if (!member) {
    return res.status(404).json({ message: 'Staff member not found.' });
  }

  res.json({ staff: member });
});

/**
 * Create a new staff or admin account.
 *
 * The password is automatically hashed by the User model's Mongoose
 * pre-save hook — no manual hashing required here.
 *
 * @route   POST /api/staff
 * @access  Private — admin only
 * @body    {string} employeeId - Unique employee identifier
 * @body    {string} name       - Full name
 * @body    {string} password   - Plain-text password (min 6 chars)
 * @body    {string} [role]     - 'staff' or 'admin' (default: 'staff')
 * @body    {string} [phone]    - Contact phone number
 * @returns {{ message: string, staff: User }}
 */
exports.create = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  const { employeeId, name, role, password, phone } = req.body;

  // Prevent duplicate employee IDs
  const existing = await User.findOne({ employeeId });
  if (existing) {
    return res.status(409).json({ message: `Employee ID '${employeeId}' is already taken.` });
  }

  const user = await User.create({
    employeeId,
    name,
    role: role || 'staff',
    password,
    phone,
    createdBy: req.user.id,
  });

  // Strip the password before sending the response
  const userResponse = user.toObject();
  delete userResponse.password;

  res.status(201).json({ message: 'Staff account created successfully.', staff: userResponse });
});

/**
 * Update a staff member's profile information.
 *
 * Supports partial updates — only fields present in the request body are
 * modified. If a new password is provided, it will be re-hashed
 * automatically by the User model's pre-save hook.
 *
 * @route   PUT /api/staff/:id
 * @access  Private — admin only
 * @body    {string}  [name]     - Updated name
 * @body    {string}  [phone]    - Updated phone
 * @body    {string}  [role]     - Updated role
 * @body    {boolean} [isActive] - Activate or deactivate account
 * @body    {string}  [password] - New password (will be hashed)
 * @returns {{ message: string, staff: User }}
 */
exports.update = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  // Include password field so the pre-save hook can detect modifications
  const member = await User.findById(req.params.id).select('+password');
  if (!member) {
    return res.status(404).json({ message: 'Staff member not found.' });
  }

  const { name, phone, role, isActive, password } = req.body;
  if (name !== undefined) member.name = name;
  if (phone !== undefined) member.phone = phone;
  if (role !== undefined) member.role = role;
  if (isActive !== undefined) member.isActive = isActive;
  if (password) member.password = password; // Will be hashed by pre-save hook

  await member.save();

  // Strip the password before sending the response
  const memberResponse = member.toObject();
  delete memberResponse.password;

  res.json({ message: 'Staff member updated successfully.', staff: memberResponse });
});

/**
 * Permanently delete a staff account.
 *
 * Prevents admins from deleting their own account to avoid lockout.
 *
 * @route   DELETE /api/staff/:id
 * @access  Private — admin only
 * @returns {{ message: string }}
 */
exports.remove = asyncHandler(async (req, res) => {
  // Safety check: admins cannot delete themselves
  if (req.params.id === req.user.id) {
    return res.status(400).json({ message: 'You cannot delete your own account.' });
  }

  const member = await User.findById(req.params.id);
  if (!member) {
    return res.status(404).json({ message: 'Staff member not found.' });
  }

  await member.deleteOne();
  res.json({ message: 'Staff account deleted successfully.' });
});
