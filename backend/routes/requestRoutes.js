const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { authMiddleware } = require('../middleware/auth');

// Static routes MUST come before parameterized routes

// Get user's requests
router.get('/user/my-requests', authMiddleware, requestController.getUserRequests);

// Search matching donors
router.get('/search/donors', requestController.searchMatchingDonors);

// Get all requests
router.get('/', requestController.getAllRequests);

// Create request
router.post('/', authMiddleware, requestController.createRequest);

// Get specific request (parameterized — must be after static routes)
router.get('/:id', requestController.getRequest);

// Update request status
router.put('/:id/status', authMiddleware, requestController.updateRequestStatus);

// Delete request
router.delete('/:id', authMiddleware, requestController.deleteRequest);

module.exports = router;
