const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bloodGroup: {
      type: String,
      enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
      required: [true, 'Please provide blood group'],
    },
    age: {
      type: Number,
      required: [true, 'Please provide age'],
      min: 18,
      max: 65,
    },
    location: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      default: 'India',
    },
    state: {
      type: String,
    },
    district: {
      type: String,
    },
    city: {
      type: String,
    },
    latitude: {
      type: Number,
      default: null,
    },
    longitude: {
      type: Number,
      default: null,
    },
    availability: {
      type: String,
      enum: ['available', 'not-available'],
      default: 'available',
    },
    lastDonationDate: {
      type: Date,
      default: null,
    },
    totalDonations: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donor', donorSchema);