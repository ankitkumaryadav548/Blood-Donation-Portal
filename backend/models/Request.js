const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bloodGroupNeeded: {
      type: String,
      enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
      required: [true, 'Please specify blood group needed'],
    },
    hospitalName: {
      type: String,
      required: [true, 'Please provide hospital name'],
    },
    location: {
      type: String,
      required: [true, 'Please provide location'],
    },
    latitude: {
      type: Number,
      default: null,
    },
    longitude: {
      type: Number,
      default: null,
    },
    urgencyLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    unitsRequired: {
      type: Number,
      required: [true, 'Please specify units required'],
      min: 1,
    },
    status: {
      type: String,
      enum: ['pending', 'fulfilled', 'cancelled'],
      default: 'pending',
    },
    matchedDonors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donor',
      },
    ],
    description: {
      type: String,
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Request', requestSchema);
