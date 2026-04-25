import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { requestAPI } from '../utils/api';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import '../styles/Dashboard.css';

const RecipientDashboard = () => {
  const { user } = useContext(AuthContext);
  const [userRequests, setUserRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    bloodGroupNeeded: '',
    hospitalName: '',
    location: '',
    urgencyLevel: 'medium',
    unitsRequired: 1,
    description: '',
  });
  const [fulfillmentData, setFulfillmentData] = useState({
    requestId: null,
    donorId: ''
  });

  const fetchUserRequests = useCallback(async () => {
    try {
      const response = await requestAPI.getUserRequests();
      setUserRequests(response.data.requests);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserRequests();
  }, [fetchUserRequests]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    try {
      await requestAPI.createRequest(formData);
      setAlert({ message: 'Blood request created successfully!', type: 'success' });
      setShowForm(false);
      setFormData({
        bloodGroupNeeded: '',
        hospitalName: '',
        location: '',
        urgencyLevel: 'medium',
        unitsRequired: 1,
        description: '',
      });
      fetchUserRequests();
    } catch (error) {
      setAlert({
        message: error.response?.data?.message || 'Failed to create request',
        type: 'error',
      });
    }
  };

  const handleStatusUpdate = async (id, status, donorId = null) => {
    try {
      await requestAPI.updateRequestStatus(id, status, donorId);
      setAlert({ 
        message: status === 'fulfilled' 
          ? `Amazing! Request fulfilled. You earned 50 points! ${donorId ? 'Donor also rewarded.' : ''}` 
          : `Request marked as ${status}!`, 
        type: 'success' 
      });
      setFulfillmentData({ requestId: null, donorId: '' });
      fetchUserRequests();
    } catch (error) {
      setAlert({
        message: error.response?.data?.message || 'Failed to update request',
        type: 'error',
      });
    }
  };

  const handleDeleteRequest = async (id) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await requestAPI.deleteRequest(id);
        setAlert({ message: 'Request deleted successfully!', type: 'success' });
        fetchUserRequests();
      } catch (error) {
        setAlert({
          message: error.response?.data?.message || 'Failed to delete request',
          type: 'error',
        });
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="dashboard">
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="dashboard-header">
        <h1>Recipient Dashboard</h1>
        <p>Welcome, {user?.name}</p>
      </div>

      <div className="create-request-section">
        <h2>Create Blood Request</h2>
        {!showForm ? (
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            Create New Request
          </button>
        ) : (
          <form onSubmit={handleCreateRequest} className="request-form">
            <div className="form-group">
              <label>Blood Group Needed</label>
              <select
                name="bloodGroupNeeded"
                value={formData.bloodGroupNeeded}
                onChange={handleFormChange}
                required
              >
                <option value="">Select Blood Group</option>
                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Hospital Name</label>
              <input
                type="text"
                name="hospitalName"
                value={formData.hospitalName}
                onChange={handleFormChange}
                required
                placeholder="Enter hospital name"
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleFormChange}
                required
                placeholder="Enter location"
              />
            </div>

            <div className="form-group">
              <label>Urgency Level</label>
              <select
                name="urgencyLevel"
                value={formData.urgencyLevel}
                onChange={handleFormChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label>Units Required</label>
              <input
                type="number"
                name="unitsRequired"
                value={formData.unitsRequired}
                onChange={handleFormChange}
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label>Description (Optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Additional details"
                rows="3"
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary">
              Create Request
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </form>
        )}
      </div>

      <div className="requests-section">
        <h2>Your Blood Requests</h2>
        {userRequests.length === 0 ? (
          <p>You haven't created any blood requests yet.</p>
        ) : (
          <div className="requests-list">
            {userRequests.map((request) => (
              <div key={request._id} className="request-card">
                <div className="request-header">
                  <h3>{request.hospitalName}</h3>
                  <span className={`status status-${request.status}`}>
                    {request.status.toUpperCase()}
                  </span>
                </div>
                <p><strong>Blood Group:</strong> {request.bloodGroupNeeded}</p>
                <p><strong>Location:</strong> {request.location}</p>
                <p><strong>Units:</strong> {request.unitsRequired}</p>
                <p><strong>Urgency:</strong> {request.urgencyLevel.toUpperCase()}</p>
                <p><strong>Matched Donors:</strong> {request.matchedDonors?.length || 0}</p>
                {request.status === 'pending' && (
                  <div className="card-actions">
                    {fulfillmentData.requestId === request._id ? (
                      <div className="fulfillment-form">
                        <label>Who helped you?</label>
                        <select 
                          value={fulfillmentData.donorId} 
                          onChange={(e) => setFulfillmentData({...fulfillmentData, donorId: e.target.value})}
                          className="donor-select"
                        >
                          <option value="">Select Donor (Optional)</option>
                          {request.matchedDonors?.map(donor => (
                            <option key={donor._id} value={donor._id}>
                              {donor.userId?.name || 'Matched Donor'}
                            </option>
                          ))}
                        </select>
                        <div className="btn-group-sm">
                          <button 
                            onClick={() => handleStatusUpdate(request._id, 'fulfilled', fulfillmentData.donorId)}
                            className="btn btn-success btn-sm"
                          >
                            Confirm & Get Points
                          </button>
                          <button 
                            onClick={() => setFulfillmentData({ requestId: null, donorId: '' })}
                            className="btn btn-secondary btn-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => setFulfillmentData({ requestId: request._id, donorId: '' })}
                          className="btn btn-success"
                        >
                          Mark as Fulfilled
                        </button>
                        <button
                          onClick={() => handleDeleteRequest(request._id)}
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipientDashboard;
