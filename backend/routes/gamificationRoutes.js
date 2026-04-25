const express = require('express');
const router = express.Router();
const { getLeaderboard, getGamificationProfile } = require('../controllers/gamificationController');
const { authMiddleware } = require('../middleware/auth');

router.get('/leaderboard', getLeaderboard);
router.get('/profile', authMiddleware, getGamificationProfile);

module.exports = router;
