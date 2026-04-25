const Request = require('../models/Request');
const Donor = require('../models/Donor');
const { awardPoints } = require('./gamificationController');

// Create blood request
exports.createRequest = async (req, res) => {
  try {
    const {
      bloodGroupNeeded,
      hospitalName,
      location,
      urgencyLevel,
      unitsRequired,
      latitude,
      longitude,
      description,
    } = req.body;

    if (!bloodGroupNeeded || !hospitalName || !location || !unitsRequired) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const request = await Request.create({
      userId: req.user.id,
      bloodGroupNeeded,
      hospitalName,
      location,
      urgencyLevel: urgencyLevel || 'medium',
      unitsRequired,
      latitude: latitude || null,
      longitude: longitude || null,
      description: description || '',
    });

    // Find matching donors
    const matchedDonors = await Donor.find({
      bloodGroup: bloodGroupNeeded,
      availability: 'available',
    }).select('_id');

    request.matchedDonors = matchedDonors.map((donor) => donor._id);
    await request.save();

    // Award points for creating a request (10 pts)
    await awardPoints(req.user.id, 10, 20);

    res.status(201).json({
      success: true,
      message: 'Blood request created successfully',
      request,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create request', error: error.message });
  }
};

// Get all requests
exports.getAllRequests = async (req, res) => {
  try {
    const { status, bloodGroup, urgency } = req.query;
    let query = {};

    if (status) query.status = status;
    if (bloodGroup) query.bloodGroupNeeded = bloodGroup;
    if (urgency) query.urgencyLevel = urgency;

    const requests = await Request.find(query)
      .populate('userId', 'name phoneNo email')
      .populate({
        path: 'matchedDonors',
        populate: {
          path: 'userId',
          select: 'name phoneNo email',
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch requests', error: error.message });
  }
};

// Get specific request
exports.getRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('userId', 'name phoneNo email')
      .populate({
        path: 'matchedDonors',
        populate: {
          path: 'userId',
          select: 'name phoneNo email',
        },
      });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json({ success: true, request });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch request', error: error.message });
  }
};

// Get user's requests
exports.getUserRequests = async (req, res) => {
  try {
    const requests = await Request.find({ userId: req.user.id })
      .populate({
        path: 'matchedDonors',
        populate: {
          path: 'userId',
          select: 'name phoneNo email',
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user requests', error: error.message });
  }
};

// Update request status
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'fulfilled', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate({
      path: 'matchedDonors',
      populate: {
        path: 'userId',
        select: 'name phoneNo email',
      },
    });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Award points if fulfilled
    if (status === 'fulfilled') {
      // Award points to the requester (50 pts for closing a request)
      await awardPoints(request.userId, 50, 100);

      // If a specific donor was specified as fulfilling it (or first matched donor)
      const { fulfilledBy } = req.body;
      if (fulfilledBy) {
        const donor = await Donor.findById(fulfilledBy);
        if (donor) {
          // Award points to the donor (500 pts for saving a life!)
          await awardPoints(donor.userId, 500, 1000, 'Life Saver');
          
          // Increment total donations
          donor.totalDonations += 1;
          donor.lastDonationDate = new Date();
          await donor.save();
        }
      }
    }

    res.status(200).json({
      success: true,
      message: 'Request status updated successfully',
      request,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update request status', error: error.message });
  }
};

// Search matching donors for a request
exports.searchMatchingDonors = async (req, res) => {
  try {
    const { bloodGroup, location } = req.query;

    if (!bloodGroup) {
      return res.status(400).json({ message: 'Blood group is required' });
    }

    let query = {
      bloodGroup,
      availability: 'available',
    };

    if (location) {
      query.location = new RegExp(location, 'i');
    }

    const donors = await Donor.find(query)
      .populate('userId', 'name phoneNo email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: donors.length,
      donors,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to search donors', error: error.message });
  }
};

// Delete request
exports.deleteRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Only the creator or admin can delete
    if (request.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this request' });
    }

    await Request.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Request deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete request', error: error.message });
  }
};
