/**
 * @fileoverview Reservation controller — advance table booking management.
 *
 * Provides full CRUD for reservations plus a dedicated status-transition
 * endpoint that enforces the allowed lifecycle transitions defined in the
 * shared constants module.
 *
 * @module controllers/reservation
 */

const { validationResult } = require('express-validator');
const Reservation = require('../models/Reservation');
const asyncHandler = require('../middleware/asyncHandler');
const { RESERVATION_TRANSITIONS } = require('../constants');

/**
 * List all reservations, optionally filtered by status and/or date.
 *
 * @route   GET /api/reservations
 * @access  Private — staff, admin
 * @query   {string} [status] - Filter by reservation status
 * @query   {string} [date]   - Filter by date (YYYY-MM-DD)
 * @returns {{ count: number, reservations: Reservation[] }}
 */
exports.getAll = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.status) {
    filter.status = req.query.status;
  }

  // Date filter — find all reservations within the given calendar day
  if (req.query.date) {
    const dayStart = new Date(req.query.date);
    if (isNaN(dayStart.getTime())) {
      return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
    }
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);
    filter.reservationDate = { $gte: dayStart, $lt: dayEnd };
  }

  const reservations = await Reservation.find(filter)
    .populate('handledBy', 'name employeeId')
    .sort({ reservationDate: 1, reservationTime: 1 });

  res.json({ count: reservations.length, reservations });
});

/**
 * Retrieve a single reservation by its MongoDB ID.
 *
 * @route   GET /api/reservations/:id
 * @access  Private — staff, admin
 * @returns {{ reservation: Reservation }}
 */
exports.getOne = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id)
    .populate('handledBy', 'name employeeId');

  if (!reservation) {
    return res.status(404).json({ message: 'Reservation not found.' });
  }

  res.json({ reservation });
});

/**
 * Create a new advance reservation.
 *
 * Validates that the requested date+time is not in the past before saving.
 *
 * @route   POST /api/reservations
 * @access  Private — staff, admin
 * @body    {string} guestName       - Full name of the guest
 * @body    {string} phone           - Contact phone number
 * @body    {string} [email]         - Contact email
 * @body    {number} partySize       - Number of guests
 * @body    {string} reservationDate - ISO 8601 date string
 * @body    {string} reservationTime - Time in HH:MM format
 * @body    {number} [tableNumber]   - Assigned table number
 * @body    {string} [specialRequests]
 * @body    {string} [occasion]      - Occasion type
 * @body    {string} [status]        - Initial status (defaults to 'pending')
 * @returns {{ message: string, reservation: Reservation }}
 */
exports.create = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  const {
    guestName, phone, email, partySize,
    reservationDate, reservationTime,
    tableNumber, specialRequests, occasion, status,
  } = req.body;

  // Ensure the reservation datetime is not in the past
  const [hours, minutes] = reservationTime.split(':').map(Number);
  const reservationDateTime = new Date(reservationDate);
  reservationDateTime.setHours(hours, minutes, 0, 0);

  if (reservationDateTime < new Date()) {
    return res.status(400).json({
      message: 'Cannot create a reservation in the past.',
    });
  }

  const reservationData = {
    guestName, phone, email, partySize,
    reservationDate, reservationTime,
    tableNumber, specialRequests, occasion, status,
  };

  if (req.user && req.user.role === 'customer') {
    reservationData.customerId = req.user.id;
  } else if (req.user) {
    reservationData.handledBy = req.user.id;
  }

  const reservation = await Reservation.create(reservationData);

  res.status(201).json({ message: 'Reservation created successfully.', reservation });
});

/**
 * Update reservation details (guest info, table, requests, etc.).
 *
 * Does NOT allow status changes — use the dedicated PATCH endpoint instead.
 *
 * @route   PUT /api/reservations/:id
 * @access  Private — staff, admin
 * @body    Partial reservation fields
 * @returns {{ message: string, reservation: Reservation }}
 */
exports.update = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  const reservation = await Reservation.findById(req.params.id);
  if (!reservation) {
    return res.status(404).json({ message: 'Reservation not found.' });
  }

  // Apply only the fields present in the request body
  const {
    guestName, phone, email, partySize,
    reservationDate, reservationTime,
    tableNumber, specialRequests, occasion,
  } = req.body;

  if (guestName !== undefined) reservation.guestName = guestName;
  if (phone !== undefined) reservation.phone = phone;
  if (email !== undefined) reservation.email = email;
  if (partySize !== undefined) reservation.partySize = partySize;
  if (reservationDate !== undefined) reservation.reservationDate = reservationDate;
  if (reservationTime !== undefined) reservation.reservationTime = reservationTime;
  if (tableNumber !== undefined) reservation.tableNumber = tableNumber;
  if (specialRequests !== undefined) reservation.specialRequests = specialRequests;
  if (occasion !== undefined) reservation.occasion = occasion;

  // Always track who made the change
  reservation.handledBy = req.user.id;
  await reservation.save();

  res.json({ message: 'Reservation updated successfully.', reservation });
});

/**
 * Permanently delete a reservation record.
 *
 * @route   DELETE /api/reservations/:id
 * @access  Private — staff, admin
 * @returns {{ message: string }}
 */
exports.remove = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);
  if (!reservation) {
    return res.status(404).json({ message: 'Reservation not found.' });
  }

  await reservation.deleteOne();
  res.json({ message: 'Reservation deleted successfully.' });
});

/**
 * Transition a reservation to a new lifecycle status.
 *
 * Enforces the allowed transition map from the constants module:
 * - pending   → confirmed | cancelled
 * - confirmed → seated    | cancelled
 * - seated    → completed | no-show
 * - Terminal states have no outgoing transitions.
 *
 * @route   PATCH /api/reservations/:id/status
 * @access  Private — staff, admin
 * @body    {string} status - The target status to transition to
 * @returns {{ message: string, reservation: Reservation }}
 */
exports.updateStatus = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  const { status: newStatus } = req.body;

  const reservation = await Reservation.findById(req.params.id);
  if (!reservation) {
    return res.status(404).json({ message: 'Reservation not found.' });
  }

  // Validate the transition against the allowed map
  const currentStatus = reservation.status;
  const allowed = RESERVATION_TRANSITIONS[currentStatus];

  if (!allowed || allowed.length === 0) {
    return res.status(400).json({
      message: `Reservation is in terminal state '${currentStatus}'. No further transitions allowed.`,
    });
  }

  if (!allowed.includes(newStatus)) {
    return res.status(400).json({
      message: `Invalid transition: '${currentStatus}' → '${newStatus}'. Allowed: ${allowed.join(', ')}.`,
    });
  }

  reservation.status = newStatus;
  // Track who made the status change (especially important for cancellation / no-show)
  reservation.handledBy = req.user.id;
  await reservation.save();

  res.json({
    message: `Reservation status updated to '${newStatus}'.`,
    reservation,
  });
});

/**
 * Get all reservations for the logged-in customer.
 *
 * @route   GET /api/reservations/my-reservations
 * @access  Private (Customer)
 */
exports.getMyReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({ customerId: req.user.id }).sort('-reservationDate');
  res.json(reservations);
});

/**
 * Check the status of a specific reservation publicly.
 *
 * @route   GET /api/reservations/status/:id
 * @access  Public
 */
exports.getStatus = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id).select('status tableNumber');
  if (!reservation) {
    return res.status(404).json({ message: 'Reservation not found.' });
  }
  res.json({ status: reservation.status, tableNumber: reservation.tableNumber });
});
