import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Alert from '../components/Alert';
import '../styles/Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { register, verifyOTP, resendOTP, loading } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNo: '',
    password: '',
    confirmPassword: '',
    role: 'recipient',
  });
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const stateName = name.replace('portal_reg_', '');
    setFormData({ ...formData, [stateName]: value });
  };

  const getRedirectPath = (role) => {
    switch (role) {
      case 'donor': return '/donor-dashboard';
      case 'recipient': return '/recipient-dashboard';
      default: return '/';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setAlert({ message: 'Passwords do not match', type: 'error' });
      return;
    }

    if (formData.password.length < 6) {
      setAlert({ message: 'Password must be at least 6 characters', type: 'error' });
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        phoneNo: formData.phoneNo,
        password: formData.password,
        role: formData.role,
      });
      setAlert({ message: 'OTP sent to your email! Check your inbox.', type: 'success' });
      setShowOTP(true);
    } catch (error) {
      const errorMsg = error.response?.data?.error 
        ? `${error.response.data.message}: ${error.response.data.error}`
        : (error.response?.data?.message || 'Registration failed');
      setAlert({
        message: errorMsg,
        type: 'error',
      });
    }
  };

  const handleOTPVerify = async (e) => {
    e.preventDefault();
    try {
      const data = await verifyOTP(formData.email, otp);
      setAlert({ message: 'Email verified successfully! Redirecting...', type: 'success' });
      const redirectPath = getRedirectPath(data.user.role);
      setTimeout(() => navigate(redirectPath), 1500);
    } catch (error) {
      const errorMsg = error.response?.data?.error 
        ? `${error.response.data.message}: ${error.response.data.error}`
        : (error.response?.data?.message || 'Verification failed. Please try again.');
      setAlert({
        message: errorMsg,
        type: 'error',
      });
    }
  };

  const handleResendOTP = async () => {
    try {
      await resendOTP(formData.email);
      setAlert({ message: 'New OTP sent to your email!', type: 'success' });
    } catch (error) {
      const errorMsg = error.response?.data?.error 
        ? `${error.response.data.message}: ${error.response.data.error}`
        : (error.response?.data?.message || 'Failed to resend OTP');
      setAlert({
        message: errorMsg,
        type: 'error',
      });
    }
  };

  return (
    <div className="auth-container">
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="auth-form">
        <div className="auth-header">
          <div className="auth-icon">{showOTP ? '📧' : '🩸'}</div>
          <h2>{showOTP ? 'Verify Your Email' : 'Create Account'}</h2>
          <p>{showOTP ? 'Enter the code we sent to your email' : 'Join the Blood Donation Portal today'}</p>
        </div>

        {showOTP ? (
          <form onSubmit={handleOTPVerify}>
            <p className="otp-instruction">
              We've sent a 6-digit verification code to <strong>{formData.email}</strong>.
              Please enter it below to complete your registration.
            </p>
            <div className="form-group">
              <label htmlFor="otp-input">Verification Code</label>
              <input
                id="otp-input"
                type="text"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                placeholder="Enter 6-digit OTP"
                maxLength="6"
                className="otp-input"
                autoComplete="one-time-code"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
            <div className="otp-footer">
              <p>Didn't receive the code?</p>
              <button
                type="button"
                className="btn-link"
                onClick={handleResendOTP}
                disabled={loading}
              >
                Resend OTP
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="form-group">
              <label htmlFor="reg-name">Full Name</label>
              <input
                id="reg-name"
                type="text"
                name="portal_reg_name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-email">Email Address</label>
              <input
                id="reg-email"
                type="email"
                name="portal_reg_email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-phone">Phone Number</label>
              <input
                id="reg-phone"
                type="tel"
                name="portal_reg_phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
                required
                placeholder="Enter your phone number"
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-role">How can we help you today?</label>
              <select id="reg-role" name="portal_reg_role" value={formData.role} onChange={handleChange}>
                <option value="recipient">Recipient</option>
                <option value="donor">Donor</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                type="password"
                name="portal_reg_password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Choose a secure password (min 6 characters)"
                autoComplete="new-password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="reg-confirm">Confirm Password</label>
              <input
                id="reg-confirm"
                type="password"
                name="portal_reg_confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Re-enter your password to confirm"
                autoComplete="new-password"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}

        {!showOTP && (
          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;
