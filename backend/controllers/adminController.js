const User = require('../models/User');
const Donor = require('../models/Donor');
const Request = require('../models/Request');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete related donor profile if exists
    await Donor.deleteOne({ userId: req.params.id });

    // Delete related requests if exists
    await Request.deleteMany({ userId: req.params.id });

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
};

// Get analytics
exports.getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDonors = await Donor.countDocuments();
    const activeDonors = await Donor.countDocuments({ availability: 'available' });
    const totalRequests = await Request.countDocuments();
    const pendingRequests = await Request.countDocuments({ status: 'pending' });
    const fulfilledRequests = await Request.countDocuments({ status: 'fulfilled' });

    const bloodGroupDistribution = await Donor.aggregate([
      {
        $group: {
          _id: '$bloodGroup',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.status(200).json({
      success: true,
      analytics: {
        totalUsers,
        totalDonors,
        activeDonors,
        totalRequests,
        pendingRequests,
        fulfilledRequests,
        bloodGroupDistribution,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
  }
};

// Block/Unblock user (status management)
exports.toggleUserBlock = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add isBlocked field if it doesn't exist
    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user status', error: error.message });
  }
};

// Manage blood requests (update status)
exports.manageRequest = async (req, res) => {
  try {
    const { status } = req.body;

    const request = await Request.findByIdAndUpdate(
      req.params.requestId,
      { status },
      { new: true }
    ).populate('matchedDonors', 'bloodGroup availability');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Request updated successfully',
      request,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update request', error: error.message });
  }
};
// Get all donors for admin
exports.getAllDonors = async (req, res) => {
  try {
    const { bloodGroup, availability } = req.query;
    let query = {};

    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (availability) query.availability = availability;

    const donors = await Donor.find(query)
      .populate('userId', 'name email phoneNo')
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

// Get all recipients (users who need blood) with their requests
exports.getAllRecipients = async (req, res) => {
  try {
    // Get all users with role 'recipient'
    const recipients = await User.find({ role: 'recipient' })
      .select('-password')
      .sort({ createdAt: -1 });

    // Get all requests and group by userId
    const requests = await Request.find()
      .populate('matchedDonors', 'bloodGroup availability')
      .sort({ createdAt: -1 });

    // Attach requests to each recipient
    const recipientsWithRequests = recipients.map((recipient) => {
      const userRequests = requests.filter(
        (req) => req.userId.toString() === recipient._id.toString()
      );
      return {
        _id: recipient._id,
        name: recipient.name,
        email: recipient.email,
        phoneNo: recipient.phoneNo,
        isVerified: recipient.isVerified,
        createdAt: recipient.createdAt,
        requests: userRequests,
        totalRequests: userRequests.length,
        pendingRequests: userRequests.filter((r) => r.status === 'pending').length,
        fulfilledRequests: userRequests.filter((r) => r.status === 'fulfilled').length,
      };
    });

    res.status(200).json({
      success: true,
      count: recipientsWithRequests.length,
      recipients: recipientsWithRequests,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch recipients', error: error.message });
  }
};
// Get all blood requests for admin
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate('userId', 'name email phoneNo')
      .populate('matchedDonors', 'bloodGroup availability')
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
