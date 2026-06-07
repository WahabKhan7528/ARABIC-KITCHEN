const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    guestName: {
      type: String,
      required: [true, 'Guest name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    partySize: {
      type: Number,
      required: [true, 'Party size is required'],
      min: [1, 'Party size must be at least 1'],
    },
    reservationDate: {
      type: Date,
      required: [true, 'Reservation date is required'],
    },
    reservationTime: {
      type: String,
      required: [true, 'Reservation time is required'],
      trim: true,
    },
    tableNumber: {
      type: Number,
    },
    specialRequests: {
      type: String,
      trim: true,
    },
    occasion: {
      type: String,
      enum: ['birthday', 'anniversary', 'business', 'other', 'none'],
      default: 'none',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no-show'],
      default: 'pending',
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Optional link for logged in customers
    },
    handledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reservation', reservationSchema);
