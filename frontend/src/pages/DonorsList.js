import React, { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { donorAPI, reportAPI } from '../utils/api';
import Loading from '../components/Loading';
import Alert from '../components/Alert';
import { Country, State, City } from 'country-state-city';
import '../styles/List.css';

const DonorsList = () => {
  const { token } = useContext(AuthContext);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  
  const [filters, setFilters] = useState({
    bloodGroup: '',
    country: 'IN', // Store Country Code
    state: '',      // Store State Code
    district: '',
    city: '',
  });

  const [countries] = useState(Country.getAllCountries());
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    if (filters.country) {
      setStates(State.getStatesOfCountry(filters.country));
    } else {
      setStates([]);
    }
    setFilters(prev => ({ ...prev, state: '', city: '' }));
  }, [filters.country]);

  useEffect(() => {
    if (filters.country && filters.state) {
      setCities(City.getCitiesOfState(filters.country, filters.state));
    } else {
      setCities([]);
    }
    setFilters(prev => ({ ...prev, city: '' }));
  }, [filters.country, filters.state]);

  const fetchDonors = useCallback(async () => {
    try {
      const params = {};
      if (filters.bloodGroup) params.bloodGroup = filters.bloodGroup;
      
      // Get names from codes for the backend
      const countryName = Country.getCountryByCode(filters.country)?.name;
      const stateName = State.getStateByCodeAndCountry(filters.state, filters.country)?.name;
      
      if (countryName) params.country = countryName;
      if (stateName) params.state = stateName;
      if (filters.district) params.district = filters.district;
      if (filters.city) params.city = filters.city;

      const response = await donorAPI.getAllDonors(params);
      setDonors(response.data.donors);
    } catch (error) {
      console.error('Failed to fetch donors:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchDonors();
  }, [fetchDonors]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    fetchDonors();
  };

  const handleReport = async (donorId) => {
    if (!token) {
      setAlert({ message: 'Please login to report incorrect donor data.', type: 'error' });
      return;
    }

    const reason = window.prompt('Please provide a reason for reporting this donor (e.g., incorrect phone number, fake profile):');
    if (!reason) return;

    try {
      await reportAPI.createReport({ donorId, reason });
      setAlert({ message: 'Report submitted successfully. Thank you for helping us keep the data accurate.', type: 'success' });
    } catch (error) {
      setAlert({ message: error.response?.data?.message || 'Failed to submit report', type: 'error' });
    }
  };

  const bloodGroups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

  return (
    <div className="list-page donor-search-page">
      {alert && (
        <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />
      )}

      {/* Structured Search Box */}
      <div className="structured-search-container">
        <div className="structured-search-box premium-card">
          <div className="structured-search-header">
            <span className="pulse-dot"></span> Search Result
          </div>
          <div className="structured-search-body">
            <div className="structured-search-title-box">
              <div className="icon-circle">🔍</div>
              <span className="structured-search-title">Global Donor Search</span>
            </div>
            
            <form onSubmit={handleSearch} className="location-search-form">
              <div className="search-grid">
                <div className="search-field-row">
                  <label>Blood Group</label>
                  <select name="bloodGroup" value={filters.bloodGroup} onChange={handleInputChange}>
                    <option value="">All Groups</option>
                    {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </div>

                <div className="search-field-row">
                  <label>Country</label>
                  <select name="country" value={filters.country} onChange={handleInputChange}>
                    <option value="">Select Country</option>
                    {countries.map(c => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
                  </select>
                </div>

                <div className="search-field-row">
                  <label>State / Province</label>
                  <select name="state" value={filters.state} onChange={handleInputChange} disabled={!filters.country}>
                    <option value="">Select State</option>
                    {states.map(s => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
                  </select>
                </div>

                <div className="search-field-row">
                  <label>City</label>
                  <select name="city" value={filters.city} onChange={handleInputChange} disabled={!filters.state}>
                    <option value="">Select City</option>
                    {cities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="structured-search-footer">
                <button type="submit" className="btn-search-glow">
                  Search Global Database
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="important-box glass-effect">
        <span className="info-icon">💡</span>
        <p><strong>Universal Access:</strong> We have now integrated a global location database. You can search for life-savers in any country and state across the world.</p>
      </div>

      <div className="results-header">
        <div className="results-badge">
          {donors.length} Life Savers Found
        </div>
        <div className="pagination-text">Page 1 of 1</div>
      </div>

      {/* Results Table */}
      <div className="results-table-container premium-table-wrapper">
        <table className="results-table">
          <thead>
            <tr>
              <th>Donor Name</th>
              <th>Location</th>
              <th>Availability</th>
              <th>Contact</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="loading-td"><Loading /></td>
              </tr>
            ) : donors.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-data-td">
                  <div className="no-results-msg">
                    <span>🩸</span>
                    <p>No donors found in this region. Try a broader search.</p>
                  </div>
                </td>
              </tr>
            ) : (
              donors.map((donor, idx) => (
                <tr key={donor._id} style={{ animationDelay: `${idx * 0.05}s` }} className="fade-in-row">
                  <td className="donor-name-cell">
                    <div className="avatar-mini">{donor.userId?.name?.charAt(0)}</div>
                    <div>
                      <span>{donor.userId?.name}</span>
                      <small style={{ display: 'block', fontSize: '11px', color: '#718096' }}>{donor.bloodGroup}</small>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '13px' }}>
                      {donor.city}{donor.city && donor.state ? ', ' : ''}{donor.state}
                      {(!donor.city && !donor.state) ? donor.location : ''}
                    </span>
                  </td>
                  <td>
                    <span className={`status-pill ${donor.availability === 'available' ? 'pill-available' : 'pill-unavailable'}`}>
                      {donor.availability === 'available' ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="phone-cell">
                    <div className="contact-actions">
                      <a href={`tel:${donor.userId?.phoneNo}`} className="phone-number-link" title="Click to call">
                        <span className="phone-icon">📞</span>
                        <span className="phone-text">{donor.userId?.phoneNo || 'N/A'}</span>
                      </a>
                      <button className="btn-report-mini" title="Report Incorrect Info" onClick={() => handleReport(donor._id)}>🚩</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonorsList;
