const Order = require('../models/Order');
const Cart  = require('../models/Cart');

// ─── Place Order (from cart) ──────────────────────────────────────────────────
const placeOrder = async (req, res) => {
  try {
    const user = req.user;
    const cart = await Cart.findOne({ userId: user._id }).populate('products.productId');

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const items = cart.products
      .filter((p) => p.productId)
      .map((p) => ({
        productId: p.productId._id,
        name:      p.productId.name,
        price:     p.productId.price,
        quantity:  p.quantity,
        image:     p.productId.image || '',
      }));

    if (items.length === 0) {
      return res.status(400).json({ message: 'No valid items in cart' });
    }

    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    );

    const order = await Order.create({
      userId:        user._id,
      userName:      user.name,
      userEmail:     user.email,
      contactNumber: user.contactNumber,
      items,
      totalAmount,
    });

    // Clear cart after placing order
    await Cart.findOneAndUpdate({ userId: user._id }, { products: [] });

    res.status(201).json({ message: 'Order placed successfully!', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Get Logged-in User's Orders ──────────────────────────────────────────────
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Admin: Get All Orders ────────────────────────────────────────────────────
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Admin: Confirm / Cancel Order + Set Delivery Time ───────────────────────
const updateOrderStatus = async (req, res) => {
  try {
    const { status, estimatedDelivery } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (status) order.status = status;
    if (estimatedDelivery !== undefined) order.estimatedDelivery = estimatedDelivery;

    await order.save();
    res.json({ message: 'Order updated successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { placeOrder, getMyOrders, getAllOrders, updateOrderStatus };
