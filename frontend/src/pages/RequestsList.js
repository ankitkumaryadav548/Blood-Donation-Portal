import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { requestAPI } from '../utils/api';
import Loading from '../components/Loading';
import '../styles/List.css';

const RequestsList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    bloodGroup: '',
    urgency: '',
  });

  const fetchRequests = useCallback(async () => {
    try {
      const response = await requestAPI.getAllRequests(filters);
      setRequests(response.data.requests);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    fetchRequests();
  };

  const bloodGroups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

  return (
    <div className="list-page request-search-page">
      <div className="list-header">
        <h1>Active Blood Requests</h1>
        <p>Your timely response can save a life today.</p>
      </div>

      {/* Structured Search Box */}
      <div className="structured-search-container">
        <div className="structured-search-box premium-card">
          <div className="structured-search-header">
            <span className="pulse-dot"></span> Filter Requests
          </div>
          <div className="structured-search-body">
            <form onSubmit={handleSearch} className="request-filter-form">
              <div className="search-grid">
                <div className="search-field-row">
                  <label>Blood Group</label>
                  <select name="bloodGroup" value={filters.bloodGroup} onChange={handleFilterChange}>
                    <option value="">All Groups</option>
                    {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </div>

                <div className="search-field-row">
                  <label>Status</label>
                  <select name="status" value={filters.status} onChange={handleFilterChange}>
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="fulfilled">Fulfilled</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="search-field-row">
                  <label>Urgency Level</label>
                  <select name="urgency" value={filters.urgency} onChange={handleFilterChange}>
                    <option value="">All Levels</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <div className="structured-search-footer">
                <button type="submit" className="btn-search-glow">
                  Apply Filters
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="results-header">
        <div className="results-badge">
          {requests.length} Open Requests
        </div>
      </div>

      <div className="requests-grid premium-grid">
        {loading ? (
          <div className="loading-container"><Loading /></div>
        ) : requests.length === 0 ? (
          <div className="no-data-card">
            <span className="no-data-icon">📋</span>
            <p>No active requests match your filters.</p>
          </div>
        ) : (
          requests.map((request, idx) => (
            <div key={request._id} className="request-card-premium" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="card-top">
                <div className="hospital-info">
                  <span className="hospital-icon">🏥</span>
                  <h3>{request.hospitalName}</h3>
                </div>
                <div className="status-badges">
                  <span className={`status-pill pill-${request.status}`}>{request.status}</span>
                  <span className={`urgency-pill pill-${request.urgencyLevel}`}>{request.urgencyLevel}</span>
                </div>
              </div>

              <div className="card-middle">
                <div className="blood-requirement">
                  <span className="blood-label">Required</span>
                  <span className="blood-value">{request.bloodGroupNeeded}</span>
                </div>
                <div className="units-box">
                  <span className="units-value">{request.unitsRequired}</span>
                  <span className="units-label">Units</span>
                </div>
              </div>

              <div className="card-details">
                <div className="detail-item">
                  <span className="icon">📍</span>
                  <span className="text">{request.location}</span>
                </div>
                <div className="detail-item">
                  <span className="icon">👤</span>
                  <span className="text">{request.userId?.name}</span>
                </div>
                <div className="detail-item contact-item">
                  <a href={`tel:${request.userId?.phoneNo}`} className="phone-number-link small-badge" title="Click to call">
                    <span className="phone-icon">📞</span>
                    <span className="phone-text">{request.userId?.phoneNo || 'N/A'}</span>
                  </a>
                </div>
              </div>

              {request.description && (
                <div className="card-notes">
                  <p>"{request.description}"</p>
                </div>
              )}

              <div className="card-footer">
                <span className="match-info">
                  {request.matchedDonors?.length || 0} Matched Donors
                </span>
                <Link to={`/requests/${request._id}`} className="btn-view-details">View Details →</Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RequestsList;
