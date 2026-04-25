import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import api from '../utils/api';
import Alert from '../components/Alert';
import '../styles/Rewards.css';
import '../styles/Profile.css';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState('info');
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gamification, setGamification] = useState(null);

  const [profileData, setProfileData] = useState({
    name: '',
    phoneNo: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        phoneNo: user.phoneNo || '',
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchGamification = async () => {
      try {
        const response = await api.get('/gamification/profile');
        setGamification(response.data.gamification);
      } catch (error) {
        console.error('Failed to fetch rewards:', error);
      }
    };
    if (user) fetchGamification();
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.updateProfile(profileData);
      setAlert({ message: 'Profile updated successfully!', type: 'success' });
      window.location.reload();
    } catch (error) {
      setAlert({
        message: error.response?.data?.message || 'Failed to update profile',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setAlert({ message: 'New passwords do not match', type: 'error' });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setAlert({ message: 'Password must be at least 6 characters', type: 'error' });
      return;
    }
    setLoading(true);
    try {
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setAlert({ message: 'Password changed successfully!', type: 'success' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setAlert({
        message: error.response?.data?.message || 'Failed to change password',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      donor: { label: '🩸 Donor', className: 'role-donor' },
      recipient: { label: '🏥 Recipient', className: 'role-recipient' },
      admin: { label: '🛡️ Admin', className: 'role-admin' },
    };
    return badges[role] || { label: role, className: '' };
  };

  if (!user) return null;
  const badge = getRoleBadge(user.role);

  return (
    <div className="profile-page">
      {alert && (
        <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />
      )}

      <div className="profile-container">
        <div className="profile-header-card">
          <div className="profile-avatar">
            {user.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="profile-header-info">
            <h1>{user.name}</h1>
            <p>{user.email}</p>
            <span className={`profile-role-badge ${badge.className}`}>{badge.label}</span>
          </div>
        </div>

        <div className="profile-tabs">
          <button className={`profile-tab ${activeSection === 'info' ? 'active' : ''}`} onClick={() => setActiveSection('info')}>👤 Info</button>
          <button className={`profile-tab ${activeSection === 'edit' ? 'active' : ''}`} onClick={() => setActiveSection('edit')}>✏️ Edit</button>
          <button className={`profile-tab ${activeSection === 'password' ? 'active' : ''}`} onClick={() => setActiveSection('password')}>🔐 Password</button>
          <button className={`profile-tab ${activeSection === 'rewards' ? 'active' : ''}`} onClick={() => setActiveSection('rewards')}>🏆 Rewards</button>
        </div>

        {activeSection === 'info' && (
          <div className="profile-card">
            <h2>Account Information</h2>
            <div className="profile-details-grid">
              <div className="profile-detail-item"><span className="detail-label">👤 Name</span><span className="detail-value">{user.name}</span></div>
              <div className="profile-detail-item"><span className="detail-label">📧 Email</span><span className="detail-value">{user.email}</span></div>
              <div className="profile-detail-item"><span className="detail-label">📱 Phone</span><span className="detail-value">{user.phoneNo}</span></div>
              <div className="profile-detail-item"><span className="detail-label">🏷️ Role</span><span className="detail-value">{user.role}</span></div>
              <div className="profile-detail-item"><span className="detail-label">📅 Joined</span><span className="detail-value">{new Date(user.createdAt).toLocaleDateString()}</span></div>
            </div>
          </div>
        )}

        {activeSection === 'edit' && (
          <div className="profile-card">
            <h2>Edit Profile</h2>
            <form onSubmit={handleProfileSubmit} className="profile-form">
              <div className="form-group"><label>Full Name</label><input type="text" name="name" value={profileData.name} onChange={handleProfileChange} required /></div>
              <div className="form-group"><label>Phone Number</label><input type="tel" name="phoneNo" value={profileData.phoneNo} onChange={handleProfileChange} required /></div>
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
            </form>
          </div>
        )}

        {activeSection === 'password' && (
          <div className="profile-card">
            <h2>Change Password</h2>
            <form onSubmit={handlePasswordSubmit} className="profile-form">
              <div className="form-group"><label>Current Password</label><input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} required /></div>
              <div className="form-group"><label>New Password</label><input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required /></div>
              <div className="form-group"><label>Confirm New</label><input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} required /></div>
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Changing...' : 'Update'}</button>
            </form>
          </div>
        )}

        {activeSection === 'rewards' && gamification && (
          <div className="profile-card">
            <h2>Your Achievements</h2>
            <div className="profile-gamification">
              <div className="level-badge">Level {gamification.level} Donor</div>
              <div className="xp-progress-container">
                <div className="xp-labels"><span>Progress to Lv. {gamification.level + 1}</span><span>{Math.round(gamification.xp)} / {gamification.nextLevelXp} XP</span></div>
                <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: `${gamification.progress}%` }}></div></div>
              </div>
              <div className="stat-card" style={{ background: 'var(--bg-main)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                <span className="stat-label" style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Total Points</span>
                <span className="stat-value" style={{ fontSize: '28px', fontWeight: '800', color: 'var(--primary)' }}>{gamification.points} 🪙</span>
              </div>
              <h3 style={{ marginTop: '30px' }}>Unlocked Badges</h3>
              <div className="badges-grid">
                {gamification.badges.length > 0 ? (
                  gamification.badges.map((badge, idx) => (<div key={idx} className="badge-item"><span className="badge-icon">{badge.icon}</span><span className="badge-name">{badge.name}</span></div>))
                ) : (<p className="text-muted">No badges yet. Donate or help others to earn your first badge!</p>)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
