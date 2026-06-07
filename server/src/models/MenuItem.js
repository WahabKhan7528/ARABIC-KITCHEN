const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    nameArabic: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ['mandi', 'grills', 'fast-food', 'beverages', 'sides', 'other'],
      default: 'other',
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    image: {
      type: String,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    // SEO Specific Fields
    slug: { 
      type: String, 
      unique: true, 
      sparse: true,
      trim: true 
    },
    seoTitle: { 
      type: String, 
      maxlength: 60,
      trim: true 
    },
    seoDescription: { 
      type: String, 
      maxlength: 160,
      trim: true 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);
