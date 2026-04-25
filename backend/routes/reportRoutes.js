const express = require('express');
const router = express.Router();
const { createReport, getAllReports, updateReportStatus } = require('../controllers/reportController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, createReport);
router.get('/', adminMiddleware, getAllReports);
router.put('/:id', adminMiddleware, updateReportStatus);

module.exports = router;
