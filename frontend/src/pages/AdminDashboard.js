import React, { useState, useEffect, useCallback } from 'react';
import { adminAPI, reportAPI } from '../utils/api';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await adminAPI.getAnalytics();
      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await adminAPI.getAllUsers();
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  }, []);

  const fetchReports = useCallback(async () => {
    try {
      const response = await reportAPI.getAllReports();
      setReports(response.data.reports || []);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    }
  }, []);

  const fetchRequests = useCallback(async () => {
    try {
      const response = await adminAPI.getAllRequests();
      setRequests(response.data.requests || []);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'reports') fetchReports();
    if (activeTab === 'requests') fetchRequests();
  }, [activeTab, fetchUsers, fetchReports, fetchRequests]);

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? All their data (donor profile, requests) will be removed.')) {
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

  const handleUpdateReportStatus = async (id, status) => {
    try {
      await reportAPI.updateReportStatus(id, status);
      setAlert({ message: `Report marked as ${status}!`, type: 'success' });
      fetchReports();
    } catch (error) {
      setAlert({ message: error.response?.data?.message || 'Failed to update report', type: 'error' });
    }
  };

  const handleAdminUpdateRequestStatus = async (id, status) => {
    try {
      await adminAPI.manageRequest(id, { status });
      setAlert({ message: `Request marked as ${status}!`, type: 'success' });
      fetchRequests();
      fetchAnalytics();
    } catch (error) {
      setAlert({ message: error.response?.data?.message || 'Failed to update request', type: 'error' });
    }
  };

  if (loading) return <Loading />;

  const tabs = [
    { key: 'analytics', label: '📊 Overview' },
    { key: 'users', label: '👥 Users' },
    { key: 'requests', label: '🩸 Blood Requests' },
    { key: 'reports', label: '🚩 Reports' },
  ];

  return (
    <div className="admin-dashboard">
      {alert && (
        <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />
      )}

      <div className="dashboard-header">
        <h1>🛡️ Admin Portal</h1>
        <p>Moderator Tools: Manage users and monitor data accuracy reports</p>
      </div>

      <div className="admin-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
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
          </div>

          <div className="admin-summary-box">
            <h2>Moderator Status</h2>
            <div className="summary-details">
              <p>● System is currently monitoring <strong>{analytics.totalDonors}</strong> donor profiles.</p>
              <p>● <strong>{analytics.activeDonors}</strong> donors are ready for immediate contact.</p>
              <p>● Total blood requests handled: <strong>{analytics.totalRequests}</strong></p>
            </div>
          </div>
        </div>
      )}

      {/* ==================== USERS TAB ==================== */}
      {activeTab === 'users' && (
        <div className="section-container">
          <div className="section-title">
            <h2>👥 User Management</h2>
            <p className="section-subtitle">View and manage all registered users</p>
          </div>

          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="user-cell">
                        <strong>{u.name}</strong>
                        <small>{u.email}</small>
                      </div>
                    </td>
                    <td>{u.phoneNo}</td>
                    <td><span className={`role-badge role-${u.role}`}>{u.role.toUpperCase()}</span></td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      {u.role !== 'admin' && (
                        <button onClick={() => handleDeleteUser(u._id)} className="btn btn-danger btn-sm">Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== REQUESTS TAB ==================== */}
      {activeTab === 'requests' && (
        <div className="section-container">
          <div className="section-title">
            <h2>🩸 Blood Requests</h2>
            <p className="section-subtitle">Monitor and manage all current blood requirements</p>
          </div>

          {requests.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No Requests</h3>
              <p>No active blood requests found.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Requester</th>
                    <th>Blood Group</th>
                    <th>Hospital</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req._id}>
                      <td>
                        <div className="user-cell">
                          <strong>{req.userId?.name || 'Unknown'}</strong>
                          <small>{req.userId?.phoneNo}</small>
                        </div>
                      </td>
                      <td>
                        <span className={`blood-badge ${req.bloodGroupNeeded.replace('+', 'pos').replace('-', 'neg')}`}>
                          {req.bloodGroupNeeded}
                        </span>
                        <div className="urgency-label">{req.urgencyLevel.toUpperCase()}</div>
                      </td>
                      <td>
                        <div className="hospital-cell">
                          <strong>{req.hospitalName}</strong>
                          <small>{req.location}</small>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge status-${req.status}`}>
                          {req.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        {req.status === 'pending' && (
                          <div className="btn-group">
                            <button 
                              onClick={() => handleAdminUpdateRequestStatus(req._id, 'fulfilled')} 
                              className="btn btn-success btn-xs"
                            >
                              Fulfill
                            </button>
                            <button 
                              onClick={() => handleAdminUpdateRequestStatus(req._id, 'cancelled')} 
                              className="btn btn-secondary btn-xs"
                            >
                              Cancel
                            </button>
                          </div>
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

      {/* ==================== REPORTS TAB ==================== */}
      {activeTab === 'reports' && (
        <div className="section-container">
          <div className="section-title">
            <h2>🚩 Accuracy Reports</h2>
            <p className="section-subtitle">User reports about incorrect donor data</p>
          </div>

          {reports.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🚩</div>
              <h3>No Reports</h3>
              <p>All donor data is currently clean!</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Reported Donor</th>
                    <th>Reporter</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report._id}>
                      <td>
                        <strong>{report.donorId?.userId?.name || 'Deleted'}</strong>
                        <small>{report.donorId?.userId?.phoneNo}</small>
                      </td>
                      <td>{report.reporterId?.name}</td>
                      <td>{report.reason}</td>
                      <td>
                        <span className={`status-badge status-${report.status}`}>
                          {report.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        {report.status === 'pending' && (
                          <div className="btn-group">
                            <button onClick={() => handleUpdateReportStatus(report._id, 'resolved')} className="btn btn-success btn-xs">Resolve</button>
                            <button onClick={() => handleUpdateReportStatus(report._id, 'dismissed')} className="btn btn-secondary btn-xs">Dismiss</button>
                          </div>
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
