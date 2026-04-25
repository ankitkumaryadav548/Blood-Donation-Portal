const Donor = require('../models/Donor');
const User = require('../models/User');

// Get all donors
exports.getAllDonors = async (req, res) => {
  try {
    const { bloodGroup, location, availability, country, state, district, city } = req.query;
    let query = {};

    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (availability) query.availability = availability;
    
    // Support both old 'location' search and new structured filters
    if (location) query.location = new RegExp(location, 'i');
    if (country) query.country = country;
    if (state) query.state = state;
    if (district) query.district = district;
    if (city) query.city = city;

    const donors = await Donor.find(query)
      .populate('userId', 'name phoneNo email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: donors.length,
      donors,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch donors', error: error.message });
  }
};

// Create donor profile
exports.createDonor = async (req, res) => {
  try {
    const { bloodGroup, age, location, country, state, district, city, latitude, longitude } = req.body;

    if (!bloodGroup || !age) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if donor profile already exists
    const existingDonor = await Donor.findOne({ userId: req.user.id });
    if (existingDonor) {
      return res.status(409).json({ message: 'Donor profile already exists' });
    }

    const donor = await Donor.create({
      userId: req.user.id,
      bloodGroup,
      age,
      location,
      country,
      state,
      district,
      city,
      latitude: latitude || null,
      longitude: longitude || null,
    });

    res.status(201).json({
      success: true,
      message: 'Donor profile created successfully',
      donor,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create donor profile', error: error.message });
  }
};

// Get donor profile
exports.getDonorProfile = async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.user.id }).populate(
      'userId',
      'name phoneNo email'
    );

    if (!donor) {
      return res.status(404).json({ message: 'Donor profile not found' });
    }

    res.status(200).json({ success: true, donor });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch donor profile', error: error.message });
  }
};

// Update donor availability
exports.updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;

    if (!['available', 'not-available'].includes(availability)) {
      return res.status(400).json({ message: 'Invalid availability status' });
    }

    const donor = await Donor.findOneAndUpdate(
      { userId: req.user.id },
      { availability },
      { new: true }
    );

    if (!donor) {
      return res.status(404).json({ message: 'Donor profile not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Availability updated successfully',
      donor,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update availability', error: error.message });
  }
};

// Get donation history
exports.getDonationHistory = async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.user.id });

    if (!donor) {
      return res.status(404).json({ message: 'Donor profile not found' });
    }

    res.status(200).json({
      success: true,
      totalDonations: donor.totalDonations,
      lastDonationDate: donor.lastDonationDate,
      bloodGroup: donor.bloodGroup,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch donation history', error: error.message });
  }
};

// Update donor profile
exports.updateDonorProfile = async (req, res) => {
  try {
    const { bloodGroup, age, location, country, state, district, city, latitude, longitude } = req.body;

    const donor = await Donor.findOneAndUpdate(
      { userId: req.user.id },
      {
        bloodGroup,
        age,
        location,
        country,
        state,
        district,
        city,
        latitude,
        longitude,
      },
      { new: true }
    );

    if (!donor) {
      return res.status(404).json({ message: 'Donor profile not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Donor profile updated successfully',
      donor,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update donor profile', error: error.message });
  }
};
