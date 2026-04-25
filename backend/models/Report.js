const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donor',
      required: true,
    },
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reason: {
      type: String,
      required: [true, 'Please provide a reason for reporting'],
    },
    status: {
      type: String,
      enum: ['pending', 'resolved', 'dismissed'],
      default: 'pending',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);
