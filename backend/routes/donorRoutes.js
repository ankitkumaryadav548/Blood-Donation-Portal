const express = require('express');
const router = express.Router();
const donorController = require('../controllers/donorController');
const { authMiddleware, donorMiddleware } = require('../middleware/auth');


// Get all donors
router.get('/', donorController.getAllDonors);

// Create donor profile
router.post('/', authMiddleware, donorController.createDonor);

// Get donor profile
router.get('/profile', authMiddleware, donorController.getDonorProfile);

// Update donor profile
router.put('/profile', authMiddleware, donorController.updateDonorProfile);

// Update availability
router.put('/availability', authMiddleware, donorController.updateAvailability);

// Get donation history
router.get('/history', authMiddleware, donorController.getDonationHistory);

module.exports = router;

