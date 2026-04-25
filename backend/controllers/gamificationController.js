const User = require('../models/User');
const Donor = require('../models/Donor');

// Get Leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const topDonors = await User.find({ role: 'donor' })
      .select('name points level badges')
      .sort({ points: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      leaderboard: topDonors,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch leaderboard', error: error.message });
  }
};

// Get User Gamification Profile
exports.getGamificationProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('points badges level xp');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate next level threshold (example: Level * 1000 XP)
    const nextLevelXp = user.level * 1000;
    const progress = (user.xp / nextLevelXp) * 100;

    res.status(200).json({
      success: true,
      gamification: {
        points: user.points,
        badges: user.badges,
        level: user.level,
        xp: user.xp,
        nextLevelXp,
        progress: Math.min(progress, 100),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
};

// Helper function to award points
exports.awardPoints = async (userId, pointsAwarded, xpAwarded, badgeName = null) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    user.points += pointsAwarded;
    user.xp += xpAwarded;

    // Check for level up
    const nextLevelXp = user.level * 1000;
    if (user.xp >= nextLevelXp) {
      user.level += 1;
      user.xp = user.xp - nextLevelXp;
    }

    // Award badge if provided
    if (badgeName) {
      const hasBadge = user.badges.some(b => b.name === badgeName);
      if (!hasBadge) {
        user.badges.push({
          name: badgeName,
          icon: getBadgeIcon(badgeName),
        });
      }
    }

    await user.save();
  } catch (error) {
    console.error('Error awarding points:', error);
  }
};

const getBadgeIcon = (name) => {
  const icons = {
    'First Donation': '🏅',
    'Life Saver': '🩸',
    'Emergency Hero': '⚡',
    'Silver Donor': '🥈',
    'Gold Donor': '🥇',
    'Legendary': '👑',
  };
  return icons[name] || '🎖️';
};
