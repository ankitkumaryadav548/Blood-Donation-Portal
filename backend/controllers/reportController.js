const Report = require('../models/Report');
const Donor = require('../models/Donor');

// Create a report
exports.createReport = async (req, res) => {
  try {
    const { donorId, reason } = req.body;

    if (!donorId || !reason) {
      return res.status(400).json({ message: 'Please provide donor ID and reason' });
    }

    const report = await Report.create({
      donorId,
      reporterId: req.user.id,
      reason,
    });

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully. We will review it shortly.',
      report,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit report', error: error.message });
  }
};

// Get all reports (Admin only)
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate({
        path: 'donorId',
        populate: { path: 'userId', select: 'name email phoneNo' }
      })
      .populate('reporterId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reports', error: error.message });
  }
};

// Update report status (Admin only)
exports.updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'resolved', 'dismissed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Report status updated successfully',
      report,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update report status', error: error.message });
  }
};
