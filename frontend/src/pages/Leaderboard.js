import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from '../components/Loading';
import '../styles/Rewards.css';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('/api/gamification/leaderboard');
        setLeaderboard(response.data.leaderboard);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h1>🏆 Top Life Savers</h1>
        <p>Honoring our most dedicated donors who are making a difference every day.</p>
      </div>

      <div className="leaderboard-list">
        {leaderboard.length === 0 ? (
          <div className="no-results">No donors on the leaderboard yet. Be the first to save a life!</div>
        ) : (
          leaderboard.map((user, index) => (
            <div key={user._id} className={`leaderboard-item rank-${index + 1}`}>
              <div className="rank-badge">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
              </div>
              <div className="user-info">
                <div className="user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="user-details">
                  <h3>{user.name}</h3>
                  <div className="user-badges">
                    {user.badges.slice(0, 3).map((badge, bIndex) => (
                      <span key={bIndex} title={badge.name} className="badge-mini">{badge.icon}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="user-stats">
                <div className="stat-item">
                  <span className="stat-value">{user.points}</span>
                  <span className="stat-label">Points</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">Lv. {user.level}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
