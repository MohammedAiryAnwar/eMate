const express = require('express');
const router  = express.Router();

const {
  addToCart,
  getCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} = require('../controllers/cartController');

const { protect } = require('../middleware/authMiddleware');

// All cart routes require authentication
// POST   /api/cart/add               — add item to cart
router.post('/add', protect, addToCart);

// GET    /api/cart                   — get user's cart
router.get('/', protect, getCart);

// DELETE /api/cart/remove/:productId — remove item
router.delete('/remove/:productId', protect, removeFromCart);

// PUT    /api/cart/update/:productId — update quantity
router.put('/update/:productId', protect, updateQuantity);

// DELETE /api/cart/clear             — clear entire cart
router.delete('/clear', protect, clearCart);

module.exports = router;
