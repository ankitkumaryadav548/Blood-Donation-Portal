import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import '../styles/Header.css';

const Header = () => {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🩸</span>
          Blood Donation Portal
        </Link>

        <nav className="nav-menu">
          <Link to="/">Home</Link>
          <Link to="/requests">Requests</Link>
          <Link to="/donors">Donors</Link>

          <ThemeToggle />

          {token && user ? (
            <>
              {user.role === 'donor' && <Link to="/donor-dashboard">Dashboard</Link>}
              {user.role === 'recipient' && <Link to="/recipient-dashboard">Dashboard</Link>}
              {user.role === 'admin' && <Link to="/admin-dashboard">Admin Panel</Link>}
              <div className="user-menu">
                <Link to="/profile" className="user-name-link">
                  <span className="user-avatar-mini">{user.name?.charAt(0)?.toUpperCase()}</span>
                  <span className="user-name">{user.name}</span>
                </Link>
                <span className="user-role-tag">{user.role}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="nav-login-btn">User Login</Link>
              <Link to="/admin-login" className="nav-admin-btn">🛡️ Admin</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
