/**
 * @fileoverview Centralised express-validator chains for all API endpoints.
 *
 * Keeps route files slim (wiring-only) by extracting validation rules here.
 * Each exported object groups the validators for a specific resource.
 */

const { body } = require('express-validator');
const {
  MENU_CATEGORIES,
  RESERVATION_STATUSES,
  RESERVATION_OCCASIONS,
  REGISTRATION_STATUSES,
  USER_ROLES,
} = require('../constants');

// ---------------------------------------------------------------------------
// Auth Validators
// ---------------------------------------------------------------------------

const auth = {
  /** POST /api/auth/login */
  login: [
    body('password')
      .notEmpty()
      .withMessage('Password is required.'),
  ],
};

// ---------------------------------------------------------------------------
// Menu Item Validators
// ---------------------------------------------------------------------------

const items = {
  /** POST /api/items */
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Item name is required.'),
    body('price')
      .notEmpty()
      .withMessage('Price is required.')
      .isNumeric()
      .withMessage('Price must be a number.'),
    body('category')
      .optional()
      .isIn(MENU_CATEGORIES)
      .withMessage('Invalid category.'),
  ],

  /** PUT /api/items/:id */
  update: [
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Item name cannot be empty.'),
    body('price')
      .optional()
      .isNumeric()
      .withMessage('Price must be a number.'),
    body('category')
      .optional()
      .isIn(MENU_CATEGORIES)
      .withMessage('Invalid category.'),
  ],
};

// ---------------------------------------------------------------------------
// Reservation Validators
// ---------------------------------------------------------------------------

const reservations = {
  /** POST /api/reservations */
  create: [
    body('guestName')
      .trim()
      .notEmpty()
      .withMessage('Guest name is required.'),
    body('phone')
      .trim()
      .notEmpty()
      .withMessage('Phone number is required.'),
    body('partySize')
      .notEmpty()
      .withMessage('Party size is required.')
      .isInt({ min: 1 })
      .withMessage('Party size must be at least 1.'),
    body('reservationDate')
      .notEmpty()
      .withMessage('Reservation date is required.')
      .isISO8601()
      .withMessage('Reservation date must be a valid date.'),
    body('reservationTime')
      .trim()
      .notEmpty()
      .withMessage('Reservation time is required.')
      .matches(/^\d{2}:\d{2}$/)
      .withMessage('Reservation time must be in HH:MM format.'),
    body('occasion')
      .optional()
      .isIn(RESERVATION_OCCASIONS)
      .withMessage('Invalid occasion.'),
    body('status')
      .optional()
      .isIn(RESERVATION_STATUSES)
      .withMessage('Invalid status.'),
  ],

  /** PUT /api/reservations/:id */
  update: [
    body('guestName')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Guest name cannot be empty.'),
    body('phone')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Phone cannot be empty.'),
    body('partySize')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Party size must be at least 1.'),
    body('reservationDate')
      .optional()
      .isISO8601()
      .withMessage('Reservation date must be a valid date.'),
    body('reservationTime')
      .optional()
      .matches(/^\d{2}:\d{2}$/)
      .withMessage('Reservation time must be in HH:MM format.'),
    body('occasion')
      .optional()
      .isIn(RESERVATION_OCCASIONS)
      .withMessage('Invalid occasion.'),
  ],

  /** PATCH /api/reservations/:id/status */
  updateStatus: [
    body('status')
      .trim()
      .notEmpty()
      .withMessage('Status is required.')
      .isIn(RESERVATION_STATUSES)
      .withMessage(`Status must be one of: ${RESERVATION_STATUSES.join(', ')}.`),
  ],
};

// ---------------------------------------------------------------------------
// Walk-In Registration Validators
// ---------------------------------------------------------------------------

const registrations = {
  /** POST /api/registrations */
  create: [
    body('guestName')
      .trim()
      .notEmpty()
      .withMessage('Guest name is required.'),
    body('partySize')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Party size must be at least 1.'),
    body('status')
      .optional()
      .isIn(REGISTRATION_STATUSES)
      .withMessage('Invalid status.'),
  ],

  /** PUT /api/registrations/:id */
  update: [
    body('guestName')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Guest name cannot be empty.'),
    body('partySize')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Party size must be at least 1.'),
    body('status')
      .optional()
      .isIn(REGISTRATION_STATUSES)
      .withMessage('Invalid status.'),
  ],
};

// ---------------------------------------------------------------------------
// Staff Validators
// ---------------------------------------------------------------------------

const staff = {
  /** POST /api/staff */
  create: [
    body('employeeId')
      .if((value, { req }) => req.body.role !== 'customer')
      .trim()
      .notEmpty()
      .withMessage('Employee ID is required.'),
    body('email')
      .if((value, { req }) => req.body.role === 'customer')
      .trim()
      .notEmpty()
      .withMessage('Email is required for clients.')
      .isEmail()
      .withMessage('Please provide a valid email address.'),
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required.'),
    body('password')
      .notEmpty()
      .withMessage('Password is required.')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters.'),
    body('role')
      .optional()
      .isIn(USER_ROLES)
      .withMessage(`Role must be one of: ${USER_ROLES.join(', ')}.`),
  ],

  /** PUT /api/staff/:id */
  update: [
    body('employeeId')
      .optional()
      .if((value, { req }) => req.body.role !== 'customer')
      .trim()
      .notEmpty()
      .withMessage('Employee ID cannot be empty.'),
    body('email')
      .optional()
      .if((value, { req }) => req.body.role === 'customer')
      .trim()
      .notEmpty()
      .withMessage('Email cannot be empty.')
      .isEmail()
      .withMessage('Please provide a valid email address.'),
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Name cannot be empty.'),
    body('password')
      .optional()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters.'),
    body('role')
      .optional()
      .isIn(USER_ROLES)
      .withMessage(`Role must be one of: ${USER_ROLES.join(', ')}.`),
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be true or false.'),
  ],
};

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

module.exports = {
  auth,
  items,
  reservations,
  registrations,
  staff,
};
