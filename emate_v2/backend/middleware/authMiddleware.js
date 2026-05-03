const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// Protect: verify JWT token
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized — token invalid' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized — no token' });
  }
};

// Admin only: must be authenticated first
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied — Admins only' });
  }
};

module.exports = { protect, adminOnly };
