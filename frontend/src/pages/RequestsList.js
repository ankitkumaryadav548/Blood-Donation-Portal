import React, { useState, useEffect, useCallback } from 'react';
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

  const handleFilter = () => {
    setLoading(true);
    fetchRequests();
  };

  if (loading && requests.length === 0) return <Loading />;

  return (
    <div className="list-page">
      <div className="list-header">
        <h1>Blood Requests</h1>
        <p>View and respond to blood donation requests</p>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label>Status</label>
          <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="fulfilled">Fulfilled</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Blood Group</label>
          <select name="bloodGroup" value={filters.bloodGroup} onChange={handleFilterChange}>
            <option value="">All Blood Groups</option>
            {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Urgency</label>
          <select name="urgency" value={filters.urgency} onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <button onClick={handleFilter} className="btn btn-primary">
          Search
        </button>
      </div>

      <div className="requests-grid">
        {requests.length === 0 ? (
          <p className="no-results">No requests found matching your criteria</p>
        ) : (
          requests.map((request) => (
            <div key={request._id} className="request-card large">
              <div className="request-header">
                <h3>{request.hospitalName}</h3>
                <div className="request-badges">
                  <span className={`status status-${request.status}`}>
                    {request.status.toUpperCase()}
                  </span>
                  <span className={`urgency urgency-${request.urgencyLevel}`}>
                    {request.urgencyLevel.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="request-info">
                <p><strong>Blood Group Needed:</strong> <span className="blood-badge">{request.bloodGroupNeeded}</span></p>
                <p><strong>Location:</strong> {request.location}</p>
                <p><strong>Units Required:</strong> {request.unitsRequired}</p>
                <p><strong>Requested By:</strong> {request.userId.name}</p>
                <p><strong>Contact:</strong> {request.userId.phoneNo}</p>
                <p><strong>Matched Donors:</strong> {request.matchedDonors?.length || 0}</p>
                {request.description && (
                  <p><strong>Notes:</strong> {request.description}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RequestsList;
