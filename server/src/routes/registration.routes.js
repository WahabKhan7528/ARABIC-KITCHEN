/**
 * @fileoverview Walk-in registration routes.
 *
 * All endpoints require authentication (staff or admin).
 *
 * @route /api/registrations
 */

const router = require('express').Router();
const regController = require('../controllers/registration.controller');
const { registrations: regValidators } = require('../validators');
const verifyToken = require('../middleware/verifyToken');
const requireRole = require('../middleware/requireRole');

// All registration routes require authentication + staff or admin role
router.use(verifyToken, requireRole('staff', 'admin'));

// ─── CRUD ────────────────────────────────────────────────────────────────────
router.get('/', regController.getAll);
router.get('/:id', regController.getOne);
router.post('/', regValidators.create, regController.create);
router.put('/:id', regValidators.update, regController.update);
router.delete('/:id', regController.remove);

module.exports = router;
