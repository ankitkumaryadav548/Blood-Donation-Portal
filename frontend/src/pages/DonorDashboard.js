import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { donorAPI, requestAPI } from '../utils/api';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import { Country, State, City } from 'country-state-city';
import '../styles/Dashboard.css';

const DonorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [donorProfile, setDonorProfile] = useState(null);
  const [bloodRequests, setBloodRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    bloodGroup: '',
    age: '',
    country: 'IN', // Use ISO code initially
    state: '',      // Use ISO code initially
    city: '',
  });

  const [countries] = useState(Country.getAllCountries());
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    if (formData.country) {
      setStates(State.getStatesOfCountry(formData.country));
    } else {
      setStates([]);
    }
    setFormData(prev => ({ ...prev, state: '', city: '' }));
  }, [formData.country]);

  useEffect(() => {
    if (formData.country && formData.state) {
      setCities(City.getCitiesOfState(formData.country, formData.state));
    } else {
      setCities([]);
    }
    setFormData(prev => ({ ...prev, city: '' }));
  }, [formData.country, formData.state]);

  useEffect(() => {
    fetchDonorData();
    fetchBloodRequests();
  }, []);

  const fetchDonorData = async () => {
    try {
      const response = await donorAPI.getDonorProfile();
      setDonorProfile(response.data.donor);
    } catch (error) {
      if (error.response?.status === 404) {
        setDonorProfile(null);
      }
    }
  };

  const fetchBloodRequests = async () => {
    try {
      const response = await requestAPI.getAllRequests({ status: 'pending' });
      setBloodRequests(response.data.requests);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateDonorProfile = async (e) => {
    e.preventDefault();
    try {
      // Prepare data with names instead of codes for the backend
      const countryName = Country.getCountryByCode(formData.country)?.name || formData.country;
      const stateName = State.getStateByCodeAndCountry(formData.state, formData.country)?.name || formData.state;
      
      const submitData = {
        ...formData,
        country: countryName,
        state: stateName,
      };

      await donorAPI.createDonor(submitData);
      setAlert({ message: 'Donor profile created successfully!', type: 'success' });
      setShowForm(false);
      setFormData({ bloodGroup: '', age: '', country: 'IN', state: '', city: '' });
      fetchDonorData();
    } catch (error) {
      setAlert({
        message: error.response?.data?.message || 'Failed to create profile',
        type: 'error',
      });
    }
  };

  const handleUpdateAvailability = async (status) => {
    try {
      await donorAPI.updateAvailability({ availability: status });
      setAlert({ message: 'Availability updated successfully!', type: 'success' });
      fetchDonorData();
    } catch (error) {
      setAlert({
        message: error.response?.data?.message || 'Failed to update availability',
        type: 'error',
      });
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
        <h1>Donor Dashboard</h1>
        <p>Welcome, {user?.name}</p>
      </div>

      {!donorProfile ? (
        <div className="profile-section">
          <h2>Create Your Donor Profile</h2>
          {!showForm ? (
            <button onClick={() => setShowForm(true)} className="btn btn-primary">
              Create Profile
            </button>
          ) : (
            <form onSubmit={handleCreateDonorProfile} className="donor-form">
              <div className="form-group">
                <label>Blood Group</label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
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
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleFormChange}
                  min="18"
                  max="65"
                  required
                  placeholder="Enter your age"
                />
              </div>


              <div className="form-group">
                <label>Country</label>
                <select name="country" value={formData.country} onChange={handleFormChange} required>
                  <option value="">Select Country</option>
                  {countries.map(c => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>State</label>
                <select name="state" value={formData.state} onChange={handleFormChange} required disabled={!formData.country}>
                  <option value="">Select State</option>
                  {states.map(s => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>City</label>
                <select name="city" value={formData.city} onChange={handleFormChange} required disabled={!formData.state}>
                  <option value="">Select City</option>
                  {cities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <button type="submit" className="btn btn-primary">
                Create Profile
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
      ) : (
        <div className="profile-section">
          <h2>Your Profile</h2>
          <div className="profile-info">
            <div className="info-item">
              <label>Blood Group:</label>
              <span>{donorProfile.bloodGroup}</span>
            </div>
            <div className="info-item">
              <label>Age:</label>
              <span>{donorProfile.age}</span>
            </div>
            <div className="info-item">
              <label>Location:</label>
              <span>{donorProfile.city}{donorProfile.city && donorProfile.state ? ', ' : ''}{donorProfile.state}</span>
            </div>
            <div className="info-item">
              <label>Status:</label>
              <span className={`status ${donorProfile.availability}`}>
                {donorProfile.availability === 'available' ? 'Available' : 'Not Available'}
              </span>
            </div>
            <div className="info-item">
              <label>Total Donations:</label>
              <span>{donorProfile.totalDonations}</span>
            </div>
          </div>

          <div className="availability-buttons">
            <button
              onClick={() => handleUpdateAvailability('available')}
              className="btn btn-success"
            >
              Mark as Available
            </button>
            <button
              onClick={() => handleUpdateAvailability('not-available')}
              className="btn btn-warning"
            >
              Mark as Not Available
            </button>
          </div>
        </div>
      )}

      <div className="requests-section">
        <h2>Active Blood Requests Matching Your Blood Group</h2>
        {bloodRequests.length === 0 ? (
          <p>No active requests matching your blood group</p>
        ) : (
          <div className="requests-list">
            {bloodRequests.map((request) => (
              <div key={request._id} className="request-card">
                <div className="request-header">
                  <h3>{request.hospitalName}</h3>
                  <span className={`urgency urgency-${request.urgencyLevel}`}>
                    {request.urgencyLevel.toUpperCase()}
                  </span>
                </div>
                <p><strong>Blood Group Needed:</strong> {request.bloodGroupNeeded}</p>
                <p><strong>Location:</strong> {request.location}</p>
                <p><strong>Units Required:</strong> {request.unitsRequired}</p>
                <p><strong>Contact:</strong> {request.userId.phoneNo}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorDashboard;
