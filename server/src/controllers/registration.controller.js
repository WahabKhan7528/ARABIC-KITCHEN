/**
 * @fileoverview Walk-in registration controller.
 *
 * Manages same-day walk-in guest records that bypass the advance reservation
 * system. Staff can register, seat, complete, or cancel walk-in guests.
 *
 * @module controllers/registration
 */

const { validationResult } = require('express-validator');
const Registration = require('../models/Registration');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * List all walk-in registrations, optionally filtered by status.
 *
 * @route   GET /api/registrations
 * @access  Private — staff, admin
 * @query   {string} [status] - Filter by registration status
 * @returns {{ count: number, registrations: Registration[] }}
 */
exports.getAll = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) {
    filter.status = req.query.status;
  }

  const registrations = await Registration.find(filter)
    .populate('registeredBy', 'name employeeId')
    .sort({ createdAt: -1 });

  res.json({ count: registrations.length, registrations });
});

/**
 * Retrieve a single walk-in registration by its MongoDB ID.
 *
 * @route   GET /api/registrations/:id
 * @access  Private — staff, admin
 * @returns {{ registration: Registration }}
 */
exports.getOne = asyncHandler(async (req, res) => {
  const registration = await Registration.findById(req.params.id)
    .populate('registeredBy', 'name employeeId');

  if (!registration) {
    return res.status(404).json({ message: 'Registration not found.' });
  }

  res.json({ registration });
});

/**
 * Create a new walk-in registration record.
 *
 * @route   POST /api/registrations
 * @access  Private — staff, admin
 * @body    {string} guestName   - Walk-in guest name
 * @body    {string} [phone]     - Contact phone number
 * @body    {number} [tableNumber] - Assigned table
 * @body    {number} [partySize] - Number of guests
 * @body    {string} [notes]     - Special notes
 * @body    {string} [status]    - Initial status (defaults to 'seated')
 * @returns {{ message: string, registration: Registration }}
 */
exports.create = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  const { guestName, phone, tableNumber, partySize, notes, status } = req.body;

  const registration = await Registration.create({
    guestName,
    phone,
    tableNumber,
    partySize,
    notes,
    status,
    registeredBy: req.user.id,
  });

  res.status(201).json({ message: 'Registration created successfully.', registration });
});

/**
 * Update an existing walk-in registration (status, table, notes, etc.).
 *
 * @route   PUT /api/registrations/:id
 * @access  Private — staff, admin
 * @body    Partial registration fields
 * @returns {{ message: string, registration: Registration }}
 */
exports.update = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  const registration = await Registration.findById(req.params.id);
  if (!registration) {
    return res.status(404).json({ message: 'Registration not found.' });
  }

  // Apply only provided fields
  const { guestName, phone, tableNumber, partySize, notes, status } = req.body;
  if (guestName !== undefined) registration.guestName = guestName;
  if (phone !== undefined) registration.phone = phone;
  if (tableNumber !== undefined) registration.tableNumber = tableNumber;
  if (partySize !== undefined) registration.partySize = partySize;
  if (notes !== undefined) registration.notes = notes;
  if (status !== undefined) registration.status = status;

  await registration.save();

  res.json({ message: 'Registration updated successfully.', registration });
});

/**
 * Permanently delete a walk-in registration record.
 *
 * @route   DELETE /api/registrations/:id
 * @access  Private — staff, admin
 * @returns {{ message: string }}
 */
exports.remove = asyncHandler(async (req, res) => {
  const registration = await Registration.findById(req.params.id);
  if (!registration) {
    return res.status(404).json({ message: 'Registration not found.' });
  }

  await registration.deleteOne();
  res.json({ message: 'Registration deleted successfully.' });
});
