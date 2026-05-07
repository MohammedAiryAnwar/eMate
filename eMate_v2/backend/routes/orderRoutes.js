const express = require('express');
const router  = express.Router();

const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

// POST   /api/orders/place    — user places order from cart
router.post('/place', protect, placeOrder);

// GET    /api/orders/my       — user sees their own orders
router.get('/my', protect, getMyOrders);

// GET    /api/orders/all      — admin sees all orders
router.get('/all', protect, adminOnly, getAllOrders);

// PUT    /api/orders/:id/status — admin confirms/cancels + sets delivery time
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
