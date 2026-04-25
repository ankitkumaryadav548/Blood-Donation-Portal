import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Alert from '../components/Alert';
import '../styles/Auth.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, loading } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const stateName = name.replace('portal_admin_', '');
    setFormData({ ...formData, [stateName]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(formData.email, formData.password);
      
      // Only allow admin role
      if (data.user.role !== 'admin') {
        setAlert({
          message: 'Access denied. This login is for administrators only.',
          type: 'error',
        });
        // Logout the non-admin user
        localStorage.removeItem('token');
        return;
      }

      setAlert({ message: 'Welcome, Admin! Redirecting...', type: 'success' });
      setTimeout(() => navigate('/admin-dashboard'), 1000);
    } catch (error) {
      setAlert({
        message: error.response?.data?.message || 'Login failed. Please check your credentials.',
        type: 'error',
      });
    }
  };

  return (
    <div className="auth-container admin-auth-container">
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="auth-form admin-auth-form">
        <div className="auth-header">
          <div className="auth-icon">🛡️</div>
          <h2>Admin Portal</h2>
          <p>Sign in with your administrator credentials</p>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <label htmlFor="admin-email">Admin Email</label>
            <input
              id="admin-email"
              type="email"
              name="portal_admin_email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter admin email"
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              name="portal_admin_password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter admin password"
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="btn btn-admin btn-block" disabled={loading}>
            {loading ? 'Signing in...' : '🔐 Admin Sign In'}
          </button>
        </form>

        <div className="admin-login-footer">
          <p>Not an admin? <Link to="/login">User Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
