/**
 * @fileoverview Staff management routes.
 *
 * All endpoints require admin role — only administrators can
 * create, modify, or delete staff accounts.
 *
 * @route /api/staff
 */

const router = require('express').Router();
const staffController = require('../controllers/staff.controller');
const { staff: staffValidators } = require('../validators');
const verifyToken = require('../middleware/verifyToken');
const requireRole = require('../middleware/requireRole');

// All staff management routes require admin role
router.use(verifyToken, requireRole('admin'));

// ─── CRUD ────────────────────────────────────────────────────────────────────
router.get('/', staffController.getAll);
router.get('/:id', staffController.getOne);
router.post('/', staffValidators.create, staffController.create);
router.put('/:id', staffValidators.update, staffController.update);
router.delete('/:id', staffController.remove);

module.exports = router;
