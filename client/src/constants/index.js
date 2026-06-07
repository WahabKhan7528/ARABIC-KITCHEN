/**
 * @fileoverview Shared constants and enumerations for the Arabic Kitchen frontend.
 *
 * Single source of truth for all categories, statuses, roles, and configuration
 * values used across multiple features. Import from here instead of hardcoding
 * strings in individual components.
 */

// ---------------------------------------------------------------------------
// Menu Item Categories
// ---------------------------------------------------------------------------

/** Map of category slugs to human-readable display labels. */
export const MENU_CATEGORIES = {
  mandi: 'Mandi',
  grills: 'Grills & Kebabs',
  'fast-food': 'Burgers & Fast Food',
  beverages: 'Desserts & Drinks',
  sides: 'Mezze & Starters',
  other: 'Other',
};

/** Array of valid category slugs (derived from the map keys). */
export const CATEGORY_SLUGS = Object.keys(MENU_CATEGORIES);

// ---------------------------------------------------------------------------
// Reservation Statuses
// ---------------------------------------------------------------------------

/** All possible reservation lifecycle statuses. */
export const RESERVATION_STATUSES = [
  'pending',
  'confirmed',
  'seated',
  'completed',
  'cancelled',
  'no-show',
];

/** Allowed status transitions — maps current status → array of valid next states. */
export const RESERVATION_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['seated', 'cancelled'],
  seated: ['completed', 'no-show'],
  completed: [],
  cancelled: [],
  'no-show': [],
};

// ---------------------------------------------------------------------------
// Reservation Occasions
// ---------------------------------------------------------------------------

export const RESERVATION_OCCASIONS = [
  'birthday',
  'anniversary',
  'business',
  'other',
  'none',
];

// ---------------------------------------------------------------------------
// Order Statuses & Types
// ---------------------------------------------------------------------------

/** All possible order lifecycle statuses. */
export const ORDER_STATUSES = [
  'pending',
  'preparing',
  'served',
  'completed',
  'cancelled',
];

/** Service / fulfillment types for customer orders. */
export const ORDER_TYPES = ['delivery', 'takeaway', 'dine-in'];

// ---------------------------------------------------------------------------
// User Roles
// ---------------------------------------------------------------------------

/** Valid roles for authenticated staff/admin users. */
export const USER_ROLES = ['staff', 'admin'];
