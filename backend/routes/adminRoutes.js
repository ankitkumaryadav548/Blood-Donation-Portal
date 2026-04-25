const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Get all users
router.get('/users', adminMiddleware, adminController.getAllUsers);

// Delete user
router.delete('/users/:id', adminMiddleware, adminController.deleteUser);

// Toggle block user
router.put('/users/:id/toggle-block', adminMiddleware, adminController.toggleUserBlock);

// Get analytics
router.get('/analytics', adminMiddleware, adminController.getAnalytics);

// Manage request
router.put('/requests/:requestId', adminMiddleware, adminController.manageRequest);

// Get all donors
router.get('/donors', adminMiddleware, adminController.getAllDonors);

// Get all recipients with their requests
router.get('/recipients', adminMiddleware, adminController.getAllRecipients);

// Get all requests
router.get('/requests', adminMiddleware, adminController.getAllRequests);

module.exports = router;
