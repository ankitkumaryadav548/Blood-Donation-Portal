import React, { useState, useEffect } from 'react';
import { adminAPI, requestAPI } from '../utils/api';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [analytics, setAnalytics] = useState(null);
  const [donors, setDonors] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [expandedRecipient, setExpandedRecipient] = useState(null);

  // Filter states
  const [donorFilters, setDonorFilters] = useState({ bloodGroup: '', availability: '' });
  const [requestFilters, setRequestFilters] = useState({ bloodGroup: '', status: '' });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (activeTab === 'donors') fetchDonors();
    if (activeTab === 'recipients') fetchRecipients();
    if (activeTab === 'requests') fetchRequests();
    if (activeTab === 'users') fetchUsers();
  }, [activeTab, donorFilters, requestFilters]);

  const fetchAnalytics = async () => {
    try {
      const response = await adminAPI.getAnalytics();
      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDonors = async () => {
    try {
      const params = {};
      if (donorFilters.bloodGroup) params.bloodGroup = donorFilters.bloodGroup;
      if (donorFilters.availability) params.availability = donorFilters.availability;
      
      const response = await adminAPI.getAllDonors(params);
      setDonors(response.data.donors || []);
    } catch (error) {
      console.error('Failed to fetch donors:', error);
    }
  };

  const fetchRecipients = async () => {
    try {
      const response = await adminAPI.getAllRecipients();
      setRecipients(response.data.recipients || []);
    } catch (error) {
      console.error('Failed to fetch recipients:', error);
    }
  };

  const fetchRequests = async () => {
    try {
      const params = {};
      if (requestFilters.bloodGroup) params.bloodGroup = requestFilters.bloodGroup;
      if (requestFilters.status) params.status = requestFilters.status;

      const response = await requestAPI.getAllRequests(params);
      setRequests(response.data.requests || []);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getAllUsers();
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminAPI.deleteUser(id);
        setAlert({ message: 'User deleted successfully!', type: 'success' });
        fetchUsers();
        fetchAnalytics();
      } catch (error) {
        setAlert({ message: error.response?.data?.message || 'Failed to delete user', type: 'error' });
      }
    }
  };

  const handleUpdateRequestStatus = async (id, status) => {
    try {
      await adminAPI.manageRequest(id, { status });
      setAlert({ message: `Request marked as ${status}!`, type: 'success' });
      fetchRequests();
      fetchRecipients();
      fetchAnalytics();
    } catch (error) {
      setAlert({ message: error.response?.data?.message || 'Failed to update', type: 'error' });
    }
  };

  if (loading) return <Loading />;

  const tabs = [
    { key: 'analytics', label: '📊 Overview' },
    { key: 'donors', label: '🩸 Donors (Give Blood)' },
    { key: 'recipients', label: '🏥 Recipients (Need Blood)' },
    { key: 'requests', label: '📋 All Requests' },
    { key: 'users', label: '👥 All Users' },
  ];

  const bloodGroups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

  return (
    <div className="admin-dashboard">
      {alert && (
        <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />
      )}

      <div className="dashboard-header">
        <h1>🛡️ Admin Portal</h1>
        <p>Complete view of donors and recipients in your blood bank system</p>
      </div>

      <div className="admin-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            id={`tab-${tab.key}`}
            className={`tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ==================== ANALYTICS TAB ==================== */}
      {activeTab === 'analytics' && analytics && (
        <div className="analytics-section">
          <div className="analytics-grid">
            <div className="analytics-card card-users">
              <div className="card-icon">👥</div>
              <h3>{analytics.totalUsers}</h3>
              <p>Total Users</p>
            </div>
            <div className="analytics-card card-donors">
              <div className="card-icon">🩸</div>
              <h3>{analytics.totalDonors}</h3>
              <p>Registered Donors</p>
            </div>
            <div className="analytics-card card-active">
              <div className="card-icon">✅</div>
              <h3>{analytics.activeDonors}</h3>
              <p>Available Now</p>
            </div>
            <div className="analytics-card card-requests">
              <div className="card-icon">📋</div>
              <h3>{analytics.totalRequests}</h3>
              <p>Total Requests</p>
            </div>
            <div className="analytics-card card-pending">
              <div className="card-icon">⏳</div>
              <h3>{analytics.pendingRequests}</h3>
              <p>Pending</p>
            </div>
            <div className="analytics-card card-fulfilled">
              <div className="card-icon">🎉</div>
              <h3>{analytics.fulfilledRequests}</h3>
              <p>Fulfilled</p>
            </div>
          </div>

          {analytics.bloodGroupDistribution?.length > 0 && (
            <div className="blood-distribution">
              <h2>Blood Group Inventory</h2>
              <div className="blood-chips">
                {analytics.bloodGroupDistribution.map((item) => (
                  <div key={item._id} className="blood-chip">
                    <span className="chip-group">{item._id}</span>
                    <span className="chip-count">{item.count} donors</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="quick-summary">
            <div className="summary-card summary-donors">
              <h3>🩸 Donors — Who Can Give Blood</h3>
              <p>People registered as blood donors with their blood group and availability status. Click the <strong>"Donors"</strong> tab to see full details.</p>
            </div>
            <div className="summary-card summary-recipients">
              <h3>🏥 Recipients — Who Needs Blood</h3>
              <p>People who have registered to request blood. Their active requests show which blood group they need. Click the <strong>"Recipients"</strong> tab to see full details.</p>
            </div>
          </div>
        </div>
      )}

      {/* ==================== DONORS TAB ==================== */}
      {activeTab === 'donors' && (
        <div className="section-container">
          <div className="section-title">
            <h2>🩸 Donor Information — From Whom to Take Blood</h2>
            <p className="section-subtitle">All registered donors with their blood group, contact, and availability</p>
          </div>

          {/* Donor Filters */}
          <div className="admin-filter-bar">
            <div className="filter-group">
              <label>Blood Group:</label>
              <div className="filter-chips">
                <button 
                  className={`filter-chip ${donorFilters.bloodGroup === '' ? 'active' : ''}`}
                  onClick={() => setDonorFilters({...donorFilters, bloodGroup: ''})}
                >All</button>
                {bloodGroups.map(bg => (
                  <button 
                    key={bg}
                    className={`filter-chip ${donorFilters.bloodGroup === bg ? 'active' : ''}`}
                    onClick={() => setDonorFilters({...donorFilters, bloodGroup: bg})}
                  >{bg}</button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <label>Status:</label>
              <div className="filter-chips">
                <button 
                  className={`filter-chip ${donorFilters.availability === '' ? 'active' : ''}`}
                  onClick={() => setDonorFilters({...donorFilters, availability: ''})}
                >Any</button>
                <button 
                  className={`filter-chip ${donorFilters.availability === 'available' ? 'active' : ''}`}
                  onClick={() => setDonorFilters({...donorFilters, availability: 'available'})}
                >Available</button>
                <button 
                  className={`filter-chip ${donorFilters.availability === 'not-available' ? 'active' : ''}`}
                  onClick={() => setDonorFilters({...donorFilters, availability: 'not-available'})}
                >Unavailable</button>
              </div>
            </div>
          </div>

          {donors.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🩸</div>
              <h3>No Donors Found</h3>
              <p>No donors match your current filter criteria.</p>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setDonorFilters({ bloodGroup: '', availability: '' })}
              >Clear Filters</button>
            </div>
          ) : (
            <div className="info-cards-grid">
              {donors.map((donor) => (
                <div key={donor._id} className="info-card donor-info-card" id={`donor-${donor._id}`}>
                  <div className="info-card-header">
                    <div className="person-avatar donor-avatar">
                      {donor.userId?.name?.charAt(0)?.toUpperCase() || 'D'}
                    </div>
                    <div className="person-name">
                      <h3>{donor.userId?.name || 'Unknown'}</h3>
                      <span className={`availability-dot ${donor.availability}`}>
                        {donor.availability === 'available' ? '🟢 Available' : '🔴 Unavailable'}
                      </span>
                    </div>
                    <span className="blood-badge large">{donor.bloodGroup}</span>
                  </div>
                  <div className="info-card-body">
                    <div className="detail-row">
                      <span className="detail-icon">📧</span>
                      <span className="detail-text">{donor.userId?.email || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-icon">📱</span>
                      <span className="detail-text">{donor.userId?.phoneNo || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-icon">📍</span>
                      <span className="detail-text">{donor.location}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-icon">🎂</span>
                      <span className="detail-text">{donor.age} years old</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-icon">💉</span>
                      <span className="detail-text">{donor.totalDonations} total donations</span>
                    </div>
                    {donor.lastDonationDate && (
                      <div className="detail-row">
                        <span className="detail-icon">📅</span>
                        <span className="detail-text">Last donated: {new Date(donor.lastDonationDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== RECIPIENTS TAB ==================== */}
      {activeTab === 'recipients' && (
        <div className="section-container">
          <div className="section-title">
            <h2>🏥 Recipient Information — To Whom to Give Blood</h2>
            <p className="section-subtitle">All registered recipients and their blood requests</p>
          </div>

          {recipients.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏥</div>
              <h3>No Recipients Yet</h3>
              <p>No one has registered as a recipient. Recipients will appear here once they sign up.</p>
            </div>
          ) : (
            <div className="info-cards-grid">
              {recipients.map((recipient) => (
                <div key={recipient._id} className="info-card recipient-info-card" id={`recipient-${recipient._id}`}>
                  <div className="info-card-header">
                    <div className="person-avatar recipient-avatar">
                      {recipient.name?.charAt(0)?.toUpperCase() || 'R'}
                    </div>
                    <div className="person-name">
                      <h3>{recipient.name}</h3>
                      <span className="request-count">
                        {recipient.totalRequests} request{recipient.totalRequests !== 1 ? 's' : ''}
                        {recipient.pendingRequests > 0 && (
                          <span className="pending-badge"> • {recipient.pendingRequests} pending</span>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="info-card-body">
                    <div className="detail-row">
                      <span className="detail-icon">📧</span>
                      <span className="detail-text">{recipient.email}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-icon">📱</span>
                      <span className="detail-text">{recipient.phoneNo}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-icon">📅</span>
                      <span className="detail-text">Joined: {new Date(recipient.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-icon">✅</span>
                      <span className="detail-text">{recipient.isVerified ? 'Email Verified' : 'Not Verified'}</span>
                    </div>
                  </div>

                  {/* Recipient's Blood Requests */}
                  {recipient.requests.length > 0 && (
                    <div className="recipient-requests">
                      <button
                        className="toggle-requests-btn"
                        onClick={() => setExpandedRecipient(expandedRecipient === recipient._id ? null : recipient._id)}
                      >
                        {expandedRecipient === recipient._id ? '▼ Hide Requests' : '▶ View Blood Requests'}
                        ({recipient.requests.length})
                      </button>

                      {expandedRecipient === recipient._id && (
                        <div className="request-list-inline">
                          {recipient.requests.map((req) => (
                            <div key={req._id} className="mini-request-card">
                              <div className="mini-request-header">
                                <span className="blood-badge">{req.bloodGroupNeeded}</span>
                                <span className={`status-badge status-${req.status}`}>
                                  {req.status.toUpperCase()}
                                </span>
                              </div>
                              <p><strong>Hospital:</strong> {req.hospitalName}</p>
                              <p><strong>Location:</strong> {req.location}</p>
                              <p><strong>Units:</strong> {req.unitsRequired}</p>
                              <p><strong>Urgency:</strong>
                                <span className={`urgency-badge urgency-${req.urgencyLevel}`}>
                                  {req.urgencyLevel.toUpperCase()}
                                </span>
                              </p>
                              {req.status === 'pending' && (
                                <div className="mini-actions">
                                  <button
                                    className="btn btn-success btn-sm"
                                    onClick={() => handleUpdateRequestStatus(req._id, 'fulfilled')}
                                  >
                                    ✅ Fulfill
                                  </button>
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleUpdateRequestStatus(req._id, 'cancelled')}
                                  >
                                    ❌ Cancel
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== ALL REQUESTS TAB ==================== */}
      {activeTab === 'requests' && (
        <div className="section-container">
          <div className="section-title">
            <h2>📋 All Blood Requests</h2>
            <p className="section-subtitle">Every blood request in the system with requester details</p>
          </div>

          {/* Request Filters */}
          <div className="admin-filter-bar">
            <div className="filter-group">
              <label>Blood Group:</label>
              <div className="filter-chips">
                <button 
                  className={`filter-chip ${requestFilters.bloodGroup === '' ? 'active' : ''}`}
                  onClick={() => setRequestFilters({...requestFilters, bloodGroup: ''})}
                >All</button>
                {bloodGroups.map(bg => (
                  <button 
                    key={bg}
                    className={`filter-chip ${requestFilters.bloodGroup === bg ? 'active' : ''}`}
                    onClick={() => setRequestFilters({...requestFilters, bloodGroup: bg})}
                  >{bg}</button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <label>Status:</label>
              <div className="filter-chips">
                <button 
                  className={`filter-chip ${requestFilters.status === '' ? 'active' : ''}`}
                  onClick={() => setRequestFilters({...requestFilters, status: ''})}
                >All</button>
                <button 
                  className={`filter-chip ${requestFilters.status === 'pending' ? 'active' : ''}`}
                  onClick={() => setRequestFilters({...requestFilters, status: 'pending'})}
                >Pending</button>
                <button 
                  className={`filter-chip ${requestFilters.status === 'fulfilled' ? 'active' : ''}`}
                  onClick={() => setRequestFilters({...requestFilters, status: 'fulfilled'})}
                >Fulfilled</button>
                <button 
                  className={`filter-chip ${requestFilters.status === 'cancelled' ? 'active' : ''}`}
                  onClick={() => setRequestFilters({...requestFilters, status: 'cancelled'})}
                >Cancelled</button>
              </div>
            </div>
          </div>

          {requests.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No Requests Found</h3>
              <p>No blood requests match your current filters.</p>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setRequestFilters({ bloodGroup: '', status: '' })}
              >Clear Filters</button>
            </div>
          ) : (
            <div className="requests-grid">
              {requests.map((request) => (
                <div key={request._id} className="request-card" id={`request-${request._id}`}>
                  <div className="request-card-header">
                    <h3>🏥 {request.hospitalName}</h3>
                    <span className={`status-badge status-${request.status}`}>
                      {request.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="request-card-body">
                    <div className="request-detail">
                      <span className="detail-label">Blood Needed:</span>
                      <span className="blood-badge">{request.bloodGroupNeeded}</span>
                    </div>
                    <div className="request-detail">
                      <span className="detail-label">Units:</span>
                      <span>{request.unitsRequired}</span>
                    </div>
                    <div className="request-detail">
                      <span className="detail-label">Urgency:</span>
                      <span className={`urgency-badge urgency-${request.urgencyLevel}`}>
                        {request.urgencyLevel.toUpperCase()}
                      </span>
                    </div>
                    <div className="request-detail">
                      <span className="detail-label">Requester:</span>
                      <span>{request.userId?.name || 'Unknown'}</span>
                    </div>
                    <div className="request-detail">
                      <span className="detail-label">Phone:</span>
                      <span>{request.userId?.phoneNo || 'N/A'}</span>
                    </div>
                    <div className="request-detail">
                      <span className="detail-label">Location:</span>
                      <span>{request.location}</span>
                    </div>
                    <div className="request-detail">
                      <span className="detail-label">Matched Donors:</span>
                      <span>{request.matchedDonors?.length || 0}</span>
                    </div>
                  </div>
                  {request.status === 'pending' && (
                    <div className="request-card-actions">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleUpdateRequestStatus(request._id, 'fulfilled')}
                      >
                        ✅ Fulfill
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleUpdateRequestStatus(request._id, 'cancelled')}
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== USERS TAB ==================== */}
      {activeTab === 'users' && (
        <div className="section-container">
          <div className="section-title">
            <h2>👥 User Management</h2>
            <p className="section-subtitle">All registered users in the system</p>
          </div>

          {users.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>No Users</h3>
              <p>No users have registered yet.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="admin-table" id="users-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Verified</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="user-cell">
                          <strong>{user.name}</strong>
                          <small>{user.email}</small>
                        </div>
                      </td>
                      <td>{user.phoneNo}</td>
                      <td>
                        <span className={`role-badge role-${user.role}`}>
                          {user.role.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${user.isVerified ? 'status-available' : 'status-pending'}`}>
                          {user.isVerified ? '✅ Yes' : '⏳ No'}
                        </span>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="btn btn-danger btn-sm"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


export default AdminDashboard;
