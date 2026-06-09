/**
 * @fileoverview Reservation routes.
 *
 * All endpoints require authentication (staff or admin).
 * Includes standard CRUD plus a dedicated status-transition endpoint.
 *
 * @route /api/reservations
 */

const router = require('express').Router();
const resController = require('../controllers/reservation.controller');
const { reservations: resValidators } = require('../validators');
const verifyToken = require('../middleware/verifyToken');
const requireRole = require('../middleware/requireRole');

// ─── Customer / Public Routes ───────────────────────────────────────────────

const jwt = require('jsonwebtoken');

// Optional auth for POST: guests can book, but logged in users get customerId attached
const optionalAuth = (req, res, next) => {
  let token = req.cookies?.token;
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(); // No token, continue anonymously
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
  } catch (error) {
    // Invalid token, ignore and continue anonymously
  }
  next();
};

router.post('/', optionalAuth, resValidators.create, resController.create);

// Authenticated customer route to fetch their own reservations
router.get('/my-reservations', verifyToken, resController.getMyReservations);

// Authenticated customer route to cancel their own reservation
router.patch('/:id/cancel', verifyToken, resController.cancelReservation);

// Public route to check reservation status
router.get('/status/:id', resController.getStatus);

// ─── Staff / Admin Routes ───────────────────────────────────────────────────
router.use(verifyToken, requireRole('staff', 'admin'));

router.get('/', resController.getAll);
router.get('/:id', resController.getOne);
router.put('/:id', resValidators.update, resController.update);
router.delete('/:id', resController.remove);
router.patch('/:id/status', resValidators.updateStatus, resController.updateStatus);

module.exports = router;
