import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import Alert from '../components/Alert';
import '../styles/Profile.css';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState('info');
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

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
      // Refresh user data
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
        {/* Profile Header Card */}
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

        {/* Navigation Tabs */}
        <div className="profile-tabs">
          <button
            className={`profile-tab ${activeSection === 'info' ? 'active' : ''}`}
            onClick={() => setActiveSection('info')}
          >
            👤 Profile Info
          </button>
          <button
            className={`profile-tab ${activeSection === 'edit' ? 'active' : ''}`}
            onClick={() => setActiveSection('edit')}
          >
            ✏️ Edit Profile
          </button>
          <button
            className={`profile-tab ${activeSection === 'password' ? 'active' : ''}`}
            onClick={() => setActiveSection('password')}
          >
            🔐 Change Password
          </button>
        </div>

        {/* Profile Info Section */}
        {activeSection === 'info' && (
          <div className="profile-card">
            <h2>Account Information</h2>
            <div className="profile-details-grid">
              <div className="profile-detail-item">
                <span className="detail-label">👤 Full Name</span>
                <span className="detail-value">{user.name}</span>
              </div>
              <div className="profile-detail-item">
                <span className="detail-label">📧 Email</span>
                <span className="detail-value">{user.email}</span>
              </div>
              <div className="profile-detail-item">
                <span className="detail-label">📱 Phone</span>
                <span className="detail-value">{user.phoneNo}</span>
              </div>
              <div className="profile-detail-item">
                <span className="detail-label">🏷️ Role</span>
                <span className="detail-value">{user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}</span>
              </div>
              <div className="profile-detail-item">
                <span className="detail-label">✅ Verified</span>
                <span className="detail-value">{user.isVerified ? 'Yes' : 'No'}</span>
              </div>
              <div className="profile-detail-item">
                <span className="detail-label">📅 Member Since</span>
                <span className="detail-value">{new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </div>
        )}

        {/* Edit Profile Section */}
        {activeSection === 'edit' && (
          <div className="profile-card">
            <h2>Edit Profile</h2>
            <form onSubmit={handleProfileSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="edit-name">Full Name</label>
                <input
                  id="edit-name"
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  required
                  placeholder="Enter your name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-phone">Phone Number</label>
                <input
                  id="edit-phone"
                  type="tel"
                  name="phoneNo"
                  value={profileData.phoneNo}
                  onChange={handleProfileChange}
                  required
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="form-group">
                <label>Email (cannot be changed)</label>
                <input type="email" value={user.email} disabled className="disabled-input" />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {/* Change Password Section */}
        {activeSection === 'password' && (
          <div className="profile-card">
            <h2>Change Password</h2>
            <form onSubmit={handlePasswordSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="current-pass">Current Password</label>
                <input
                  id="current-pass"
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Enter current password"
                />
              </div>
              <div className="form-group">
                <label htmlFor="new-pass">New Password</label>
                <input
                  id="new-pass"
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Min 6 characters"
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirm-new-pass">Confirm New Password</label>
                <input
                  id="confirm-new-pass"
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Re-enter new password"
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
