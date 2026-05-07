const express = require('express');
const router  = express.Router();

const {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const { protect, adminOnly } = require('../middleware/authMiddleware');
const { upload }             = require('../config/cloudinary');

// GET  /api/products          — public
router.get('/', getProducts);

// GET  /api/products/:id      — public
router.get('/:id', getProductById);

// POST /api/products          — admin only
router.post('/', protect, adminOnly, upload.single('image'), addProduct);

// PUT  /api/products/:id      — admin only
router.put('/:id', protect, adminOnly, upload.single('image'), updateProduct);

// DELETE /api/products/:id    — admin only
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
