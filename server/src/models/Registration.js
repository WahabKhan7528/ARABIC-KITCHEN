const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    guestName: {
      type: String,
      required: [true, 'Guest name is required'],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    tableNumber: {
      type: Number,
    },
    partySize: {
      type: Number,
      min: [1, 'Party size must be at least 1'],
    },
    notes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['seated', 'completed', 'cancelled'],
      default: 'seated',
    },
    registeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Registration', registrationSchema);
