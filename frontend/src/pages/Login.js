import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Alert from '../components/Alert';
import '../styles/Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getRedirectPath = (role) => {
    switch (role) {
      case 'donor': return '/donor-dashboard';
      case 'recipient': return '/recipient-dashboard';
      case 'admin': return '/admin-dashboard';
      default: return '/';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(formData.email, formData.password);
      setAlert({ message: 'Login successful! Redirecting...', type: 'success' });
      const redirectPath = getRedirectPath(data.user.role);
      setTimeout(() => navigate(redirectPath), 1000);
    } catch (error) {
      setAlert({
        message: error.response?.data?.message || 'Login failed. Please check your credentials.',
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
          <div className="auth-icon">🩸</div>
          <h2>User Login</h2>
          <p>Sign in as a Donor or Recipient</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
        <p className="auth-footer" style={{marginTop: '8px'}}>
          <Link to="/admin-login" className="admin-link">🛡️ Admin Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
