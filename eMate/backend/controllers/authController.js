const User = require('../models/User');
const jwt  = require('jsonwebtoken');

// Helper: generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ─── Register ─────────────────────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password, address, fatherName, contactNumber } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password, address, fatherName, contactNumber });

    res.status(201).json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      role:  user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Login ────────────────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    res.json({
      _id:           user._id,
      name:          user.name,
      email:         user.email,
      address:       user.address,
      contactNumber: user.contactNumber,
      role:          user.role,
      token:         generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Forgot Password ──────────────────────────────────────────────────────────
const forgotPassword = async (req, res) => {
  try {
    const { email, fatherName, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.fatherName.toLowerCase() !== fatherName.toLowerCase()) {
      return res.status(400).json({ message: "Father's name does not match" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, forgotPassword };
