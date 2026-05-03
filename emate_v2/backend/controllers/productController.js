const Product = require('../models/Product');

// ─── Get All Products (with optional filter/search) ───────────────────────────
const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    const query = {};

    if (category && category !== 'All') query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Get Single Product ───────────────────────────────────────────────────────
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Add Product (Admin) ──────────────────────────────────────────────────────
const addProduct = async (req, res) => {
  try {
    const { name, price, category, description, stock } = req.body;
    const image = req.file ? req.file.path : '';

    const product = await Product.create({ name, price, category, description, image, stock });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Update Product (Admin) ───────────────────────────────────────────────────
const updateProduct = async (req, res) => {
  try {
    const { name, price, category, description, stock } = req.body;
    const updateData = { name, price, category, description, stock };
    if (req.file) updateData.image = req.file.path;

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Delete Product (Admin) ───────────────────────────────────────────────────
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getProductById, addProduct, updateProduct, deleteProduct };
