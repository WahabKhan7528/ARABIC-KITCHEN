/**
 * @fileoverview Order controller for managing backend orders.
 */

const Order = require('../models/Order');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * Create a new order
 * @route POST /api/orders
 * @access Public (or Customer if logged in)
 */
exports.createOrder = asyncHandler(async (req, res) => {
  const orderData = req.body;
  
  // If user is logged in as a customer, attach their ID
  if (req.user && req.user.role === 'customer') {
    orderData.customerId = req.user.id;
  }
  
  const order = await Order.create(orderData);
  res.status(201).json(order);
});

/**
 * Get a specific order by ID
 * @route GET /api/orders/:id
 * @access Public
 */
exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  res.json(order);
});

/**
 * Get all orders for the logged-in customer
 * @route GET /api/orders/my-orders
 * @access Private (Customer)
 */
exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ customerId: req.user.id }).sort('-createdAt');
  res.json(orders);
});

/**
 * Get all orders (Staff/Admin)
 * @route GET /api/orders
 * @access Private (Staff/Admin)
 */
exports.getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().sort('-createdAt');
  res.json(orders);
});

/**
 * Update order status (Staff/Admin)
 * @route PATCH /api/orders/:id/status
 * @access Private (Staff/Admin)
 */
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );
  
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  
  res.json(order);
});

/**
 * Delete an order record (Staff/Admin)
 * @route DELETE /api/orders/:id
 * @access Private (Staff/Admin)
 */
exports.deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  
  res.json({ message: 'Order deleted successfully.' });
});

/**
 * Cancel an order (Customer)
 * @route PATCH /api/orders/:id/cancel
 * @access Private (Customer)
 */
exports.cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found.' });
  }

  // Allow guests to cancel if we have some guest verification, but for now we enforce customerId
  if (order.customerId?.toString() !== req.user?.id) {
    return res.status(403).json({ message: 'Not authorized to cancel this order.' });
  }

  if (order.status !== 'pending') {
    return res.status(400).json({ message: 'Only pending orders can be cancelled.' });
  }

  const ageInMinutes = (Date.now() - new Date(order.createdAt).getTime()) / 1000 / 60;
  if (ageInMinutes > 5) {
    return res.status(400).json({ message: 'Orders can only be cancelled within 5 minutes of placement.' });
  }

  order.status = 'cancelled';
  await order.save();

  res.json({ message: 'Order cancelled successfully.', order });
});
