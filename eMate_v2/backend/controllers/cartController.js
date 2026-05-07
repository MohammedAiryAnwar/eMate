const Cart = require('../models/Cart');

// Helper: get populated cart
const getPopulatedCart = async (cartId) =>
  Cart.findById(cartId).populate('products.productId');

// ─── Add to Cart ──────────────────────────────────────────────────────────────
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({ userId, products: [{ productId, quantity: quantity || 1 }] });
    } else {
      const existing = cart.products.find(
        (p) => p.productId.toString() === productId
      );
      if (existing) {
        existing.quantity += quantity || 1;
      } else {
        cart.products.push({ productId, quantity: quantity || 1 });
      }
      await cart.save();
    }

    const populated = await getPopulatedCart(cart._id);
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Get Cart ─────────────────────────────────────────────────────────────────
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('products.productId');
    if (!cart) return res.json({ products: [] });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Remove Item from Cart ────────────────────────────────────────────────────
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.products = cart.products.filter(
      (p) => p.productId.toString() !== req.params.productId
    );
    await cart.save();

    const populated = await getPopulatedCart(cart._id);
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Update Item Quantity ─────────────────────────────────────────────────────
const updateQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.products.find(
      (p) => p.productId.toString() === req.params.productId
    );
    if (item) item.quantity = quantity;
    await cart.save();

    const populated = await getPopulatedCart(cart._id);
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Clear Cart ───────────────────────────────────────────────────────────────
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ userId: req.user._id }, { products: [] });
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addToCart, getCart, removeFromCart, updateQuantity, clearCart };
