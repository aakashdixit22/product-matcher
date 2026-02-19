const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  embedding: {
    type: [Number],
    required: true,
  },
  brand: {
    type: String,
  },
  color: {
    type: String,
  },
  price: {
    type: Number,
  },
}, {
  timestamps: true,
});

// Index for faster similarity searches
ProductSchema.index({ category: 1 });
ProductSchema.index({ embedding: 1 });

module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema);
