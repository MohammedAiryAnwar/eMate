const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    price:       { type: Number, required: true },
    category:    {
      type: String,
      required: true,
      enum: ['Daily Use', 'Books', 'Stationary', 'Electronics'],
    },
    description: { type: String, required: true },
    image:       { type: String, default: '' },
    stock:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
