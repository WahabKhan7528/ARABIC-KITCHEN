/**
 * @fileoverview Shared constants and enumerations for the Arabic Kitchen backend.
 *
 * Centralises all magic strings (categories, statuses, roles, transitions)
 * so that models, validators, controllers and routes reference a single
 * source of truth. Changing a value here propagates everywhere automatically.
 */

// ---------------------------------------------------------------------------
// Menu Item Categories
// ---------------------------------------------------------------------------

/** Valid category slugs accepted by the MenuItem model and validators. */
const MENU_CATEGORIES = [
  'mandi',
  'grills',
  'fast-food',
  'beverages',
  'sides',
  'other',
];

// ---------------------------------------------------------------------------
// Reservation Statuses & Transitions
// ---------------------------------------------------------------------------

/** All valid reservation lifecycle statuses. */
const RESERVATION_STATUSES = [
  'pending',
  'confirmed',
  'seated',
  'completed',
  'cancelled',
  'no-show',
];

/**
 * Allowed status transitions for the reservation lifecycle.
 * Terminal states (completed, cancelled, no-show) have empty arrays — no further
 * transitions are permitted.
 */
const RESERVATION_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['seated', 'cancelled'],
  seated: ['completed', 'no-show'],
  completed: [],
  cancelled: [],
  'no-show': [],
};

/** Valid occasion labels for a reservation. */
const RESERVATION_OCCASIONS = [
  'birthday',
  'anniversary',
  'business',
  'other',
  'none',
];

// ---------------------------------------------------------------------------
// Walk-In Registration Statuses
// ---------------------------------------------------------------------------

/** Valid statuses for a walk-in registration record. */
const REGISTRATION_STATUSES = ['seated', 'completed', 'cancelled'];

// ---------------------------------------------------------------------------
// User Roles
// ---------------------------------------------------------------------------

/** Valid roles for authenticated users. */
const USER_ROLES = ['staff', 'admin'];

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

module.exports = {
  MENU_CATEGORIES,
  RESERVATION_STATUSES,
  RESERVATION_TRANSITIONS,
  RESERVATION_OCCASIONS,
  REGISTRATION_STATUSES,
  USER_ROLES,
};
