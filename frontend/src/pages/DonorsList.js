import React, { useState, useEffect, useCallback } from 'react';
import { donorAPI } from '../utils/api';
import Loading from '../components/Loading';
import '../styles/List.css';

const DonorsList = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [filters, setFilters] = useState({
    bloodGroup: '',
    location: '',
    availability: '',
  });

  const fetchDonors = useCallback(async (customFilters) => {
    try {
      const activeFilters = customFilters || filters;
      const params = {};
      if (activeFilters.bloodGroup) params.bloodGroup = activeFilters.bloodGroup;
      if (activeFilters.location.trim()) params.location = activeFilters.location.trim();
      if (activeFilters.availability) params.availability = activeFilters.availability;

      const response = await donorAPI.getAllDonors(params);
      setDonors(response.data.donors);
    } catch (error) {
      console.error('Failed to fetch donors:', error);
    } finally {
      setLoading(false);
      setSearchTriggered(true);
    }
  }, [filters]);

  // Initial fetch
  useEffect(() => {
    fetchDonors();
  }, [fetchDonors]); // Only once on mount

  // Trigger search when bloodGroup or availability changes
  const handleFilterSelect = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    setLoading(true);
    fetchDonors(newFilters);
  };

  const handleLocationChange = (e) => {
    setFilters({ ...filters, location: e.target.value });
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    fetchDonors();
  };

  const handleClearFilters = () => {
    const cleared = { bloodGroup: '', location: '', availability: '' };
    setFilters(cleared);
    setLoading(true);
    fetchDonors(cleared);
  };

  const bloodGroups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  const hasActiveFilters = filters.bloodGroup || filters.location.trim() || filters.availability;

  if (loading && !searchTriggered) return <Loading />;

  return (
    <div className="list-page">
      <div className="list-header">
        <h1>🔍 Find Blood Donors</h1>
        <p>Search for available blood donors by location, blood group, and availability</p>
      </div>

      {/* Search Form */}
      <div className="search-form">
        <form onSubmit={handleSearch} className="search-bar">
          <div className="search-input-wrapper">
            <span className="search-icon">📍</span>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleLocationChange}
              placeholder="Search by city, area, or location..."
              className="search-main-input"
              id="donor-location-search"
            />
          </div>
          <button type="submit" className="btn btn-primary search-btn" disabled={loading}>
            {loading ? 'Searching...' : '🔍 Search'}
          </button>
        </form>

        <div className="filters-row-premium">
          <div className="filter-section-group">
            <label className="filter-label">Blood Group:</label>
            <div className="blood-group-chips">
              <button 
                className={`chip ${filters.bloodGroup === '' ? 'active' : ''}`}
                onClick={() => handleFilterSelect('bloodGroup', '')}
              >
                All
              </button>
              {bloodGroups.map((group) => (
                <button
                  key={group}
                  className={`chip ${filters.bloodGroup === group ? 'active' : ''}`}
                  onClick={() => handleFilterSelect('bloodGroup', group)}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section-group">
            <label className="filter-label">Availability Status:</label>
            <div className="status-toggle-group">
              <button 
                className={`status-btn ${filters.availability === '' ? 'active' : ''}`}
                onClick={() => handleFilterSelect('availability', '')}
              >
                Any Status
              </button>
              <button 
                className={`status-btn ${filters.availability === 'available' ? 'active' : ''}`}
                onClick={() => handleFilterSelect('availability', 'available')}
              >
                🟢 Available Only
              </button>
              <button 
                className={`status-btn ${filters.availability === 'not-available' ? 'active' : ''}`}
                onClick={() => handleFilterSelect('availability', 'not-available')}
              >
                🔴 Unavailable
              </button>
            </div>
          </div>

          {hasActiveFilters && (
            <button type="button" onClick={handleClearFilters} className="clear-all-btn">
              ✕ Reset All Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="results-info">
        <span className="results-count">{donors.length} donor{donors.length !== 1 ? 's' : ''} found</span>
        {filters.location.trim() && (
          <span className="results-filter">in "{filters.location.trim()}"</span>
        )}
        {filters.bloodGroup && (
          <span className="results-filter">with group {filters.bloodGroup}</span>
        )}
      </div>

      {/* Donors Grid */}
      <div className="donors-grid">
        {loading ? (
          <div className="loading-grid-overlay">
            <Loading />
          </div>
        ) : donors.length === 0 ? (
          <div className="no-results-card">
            <div className="no-results-icon">🔍</div>
            <h3>No donors found</h3>
            <p>Try searching a different location or changing your filters</p>
            {hasActiveFilters && (
              <button onClick={handleClearFilters} className="btn btn-secondary btn-sm">
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          donors.map((donor) => (
            <div key={donor._id} className="donor-card" id={`donor-${donor._id}`}>
              <div className="donor-header">
                <div className="donor-name-section">
                  <div className="donor-avatar-small">
                    {donor.userId?.name?.charAt(0)?.toUpperCase() || 'D'}
                  </div>
                  <h3>{donor.userId?.name || 'Unknown'}</h3>
                </div>
                <span className={`availability-badge ${donor.availability}`}>
                  {donor.availability === 'available' ? '🟢 Available' : '🔴 Unavailable'}
                </span>
              </div>
              <div className="donor-info">
                <div className="donor-blood-group">
                  <span className="blood-badge large">{donor.bloodGroup}</span>
                </div>
                <div className="donor-details">
                  <p><span className="info-icon">📍</span> {donor.location}</p>
                  <p><span className="info-icon">🎂</span> {donor.age} years old</p>
                  <p><span className="info-icon">📱</span> {donor.userId?.phoneNo || 'N/A'}</p>
                  <p><span className="info-icon">💉</span> {donor.totalDonations} donation{donor.totalDonations !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DonorsList;

