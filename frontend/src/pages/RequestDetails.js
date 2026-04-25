import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { requestAPI } from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import Loading from '../components/Loading';
import Alert from '../components/Alert';
import '../styles/List.css';

const RequestDetails = () => {
  const { id } = useParams();
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const fetchRequestDetails = useCallback(async () => {
    try {
      const response = await requestAPI.getRequest(id);
      setRequest(response.data.request);
    } catch (error) {
      console.error('Failed to fetch request details:', error);
      setAlert({ message: 'Failed to load request details.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRequestDetails();
  }, [fetchRequestDetails]);

  if (loading) return <Loading />;
  if (!request) return (
    <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
      <h2>Request Not Found</h2>
      <p>The request you are looking for does not exist or has been removed.</p>
      <Link to="/requests" className="btn-search-glow" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '20px' }}>Back to Requests</Link>
    </div>
  );

  return (
    <div className="list-page request-details-page">
      {alert && (
        <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />
      )}

      <div className="details-header-card premium-card">
        <div className="details-top">
          <button onClick={() => navigate(-1)} className="btn-back">← Back</button>
          <div className="status-group">
            <span className={`status-pill pill-${request.status}`}>{request.status.toUpperCase()}</span>
            <span className={`urgency-pill pill-${request.urgencyLevel}`}>{request.urgencyLevel.toUpperCase()} URGENCY</span>
          </div>
        </div>

        <div className="details-main-info">
          <div className="hospital-branding">
            <span className="hospital-logo">🏥</span>
            <div>
              <h1>{request.hospitalName}</h1>
              <p className="location-text">📍 {request.location}</p>
            </div>
          </div>
          <div className="blood-large-badge">
            <span className="label">Blood Needed</span>
            <span className="value">{request.bloodGroupNeeded}</span>
            <span className="sub-label">{request.unitsRequired} Units Required</span>
          </div>
        </div>
      </div>

      <div className="details-grid-layout">
        <div className="details-left-column">
          <div className="info-section-premium glass-effect">
            <h3>📝 Description & Notes</h3>
            <p className="description-text">
              {request.description || "No additional notes provided for this request."}
            </p>
          </div>

          <div className="info-section-premium glass-effect">
            <h3>👤 Requester Information</h3>
            <div className="requester-profile">
              <div className="avatar-large">{request.userId?.name?.charAt(0)}</div>
              <div className="profile-text">
                <h4>{request.userId?.name}</h4>
                <p>Member since {new Date(request.userId?.createdAt).toLocaleDateString()}</p>
                <div className="contact-actions-large" style={{ marginTop: '15px' }}>
                  <a href={`tel:${request.userId?.phoneNo}`} className="phone-number-link">
                    <span className="phone-icon">📞</span>
                    <span className="phone-text">Contact: {request.userId?.phoneNo}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="details-right-column">
          <div className="matched-donors-section glass-effect">
            <h3>🤝 Matched Donors ({request.matchedDonors?.length || 0})</h3>
            <div className="matched-list">
              {request.matchedDonors && request.matchedDonors.length > 0 ? (
                request.matchedDonors.map((donor, idx) => (
                  <div key={idx} className="matched-donor-item">
                    <div className="donor-mini-info" style={{ width: '100%' }}>
                      <span className="donor-icon">🩸</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <strong style={{ color: 'var(--text-primary)' }}>{donor.userId?.name || 'Anonymous Donor'}</strong>
                          <small className="donor-status" style={{ 
                            color: donor.availability === 'available' ? 'var(--success)' : 'var(--danger)',
                            fontWeight: '600'
                          }}>{donor.availability.toUpperCase()}</small>
                        </div>
                        <p className="donor-loc" style={{ margin: '4px 0', fontSize: '0.85rem' }}>📍 {donor.location}</p>
                        <div className="donor-contact-box" style={{ marginTop: '8px' }}>
                          <a href={`tel:${donor.userId?.phoneNo}`} className="phone-number-link-small" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            color: 'var(--primary)',
                            textDecoration: 'none',
                            fontWeight: '700',
                            fontSize: '0.9rem',
                            padding: '6px 12px',
                            background: 'var(--primary-glow)',
                            borderRadius: '8px',
                            transition: 'all 0.2s'
                          }}>
                            <span>📞</span> {donor.userId?.phoneNo || 'N/A'}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-matches">Searching for nearby donors...</p>
              )}
            </div>
          </div>

          {!token ? (
            <div className="cta-box-premium">
              <p>Want to help save a life?</p>
              <Link to="/login" className="btn-search-glow" style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}>Login to Respond</Link>
            </div>
          ) : user?.role === 'donor' && (
            <div className="cta-box-premium">
              <p>Are you available to help?</p>
              <button className="btn-search-glow" onClick={() => alert('Feature coming soon: Requesters will be notified of your interest!')} style={{ width: '100%' }}>I Want to Help</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;
