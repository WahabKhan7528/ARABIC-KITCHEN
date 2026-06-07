/**
 * @fileoverview Menu item routes.
 *
 * Public endpoints for browsing the menu, and protected endpoints
 * for staff/admin CRUD operations with optional image uploads.
 *
 * @route /api/items
 */

const router = require('express').Router();
const itemController = require('../controllers/item.controller');
const { items: itemValidators } = require('../validators');
const verifyToken = require('../middleware/verifyToken');
const requireRole = require('../middleware/requireRole');
const upload = require('../middleware/upload');

// ─── Public Routes ───────────────────────────────────────────────────────────
router.get('/', itemController.getAll);
router.get('/:id', itemController.getOne);

// ─── Protected Routes (staff or admin) ───────────────────────────────────────
router.post(
  '/',
  verifyToken,
  requireRole('staff', 'admin'),
  upload.single('image'),
  itemValidators.create,
  itemController.create,
);

router.put(
  '/:id',
  verifyToken,
  requireRole('staff', 'admin'),
  upload.single('image'),
  itemValidators.update,
  itemController.update,
);

router.delete(
  '/:id',
  verifyToken,
  requireRole('staff', 'admin'),
  itemController.remove,
);

module.exports = router;
