/**
 * @fileoverview Order routes.
 * @route /api/orders
 */

const router = require('express').Router();
const orderController = require('../controllers/order.controller');
const verifyToken = require('../middleware/verifyToken');
const roleGuard = require('../middleware/roleGuard');
const jwt = require('jsonwebtoken');

// Optional auth — allows guest requests through. If a valid JWT cookie exists,
// attaches req.user so the order can be linked to a customer account.
const optionalAuth = (req, res, next) => {
  let token = req.cookies?.token;
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(); // No token — allow guest checkout to proceed
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
  } catch (error) {
    // Invalid/expired token — ignore and continue as guest
  }
  next();
};

router.post('/', optionalAuth, orderController.createOrder);
router.get('/my-orders', verifyToken, orderController.getMyOrders);
router.get('/:id', orderController.getOrderById);

// Customer route to cancel their own order
router.patch('/:id/cancel', verifyToken, roleGuard(['customer']), orderController.cancelOrder);

// Staff/Admin routes
router.get('/', verifyToken, roleGuard(['staff', 'admin']), orderController.getAllOrders);
router.patch('/:id/status', verifyToken, roleGuard(['staff', 'admin']), orderController.updateOrderStatus);
router.delete('/:id', verifyToken, roleGuard(['staff', 'admin']), orderController.deleteOrder);

module.exports = router;
