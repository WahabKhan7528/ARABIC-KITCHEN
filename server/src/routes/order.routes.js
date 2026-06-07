/**
 * @fileoverview Order routes.
 * @route /api/orders
 */

const router = require('express').Router();
const orderController = require('../controllers/order.controller');
const verifyToken = require('../middleware/verifyToken');
const roleGuard = require('../middleware/roleGuard');

// Public route to create order (guests can also create)
// Note: Optional token verification to attach customerId if they are logged in
const optionalAuth = (req, res, next) => {
  verifyToken(req, res, (err) => {
    // Ignore errors, just proceed. If req.user is set, great.
    next();
  });
};

router.post('/', optionalAuth, orderController.createOrder);
router.get('/my-orders', verifyToken, orderController.getMyOrders);
router.get('/:id', orderController.getOrderById);

// Staff/Admin routes
router.get('/', verifyToken, roleGuard(['staff', 'admin']), orderController.getAllOrders);
router.patch('/:id/status', verifyToken, roleGuard(['staff', 'admin']), orderController.updateOrderStatus);

module.exports = router;
