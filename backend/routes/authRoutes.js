const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

// Register
router.post('/register', authController.register);

// Verify OTP
router.post('/verify-otp', authController.verifyOTP);

// Resend OTP
router.post('/resend-otp', authController.resendOTP);

// Login
router.post('/login', authController.login);

// Get current user
router.get('/me', authMiddleware, authController.getCurrentUser);

// Update profile
router.put('/profile', authMiddleware, authController.updateProfile);

// Change password
router.put('/change-password', authMiddleware, authController.changePassword);

module.exports = router;
