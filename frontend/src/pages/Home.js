import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

import CompatibilityMap from '../components/CompatibilityMap';

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Save Lives Through Blood Donation</h1>
          <p>
            Connect as a donor or find urgent blood supplies. Our platform makes
            it easy to give or receive blood when needed most.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">
              Register Now
            </Link>
            <Link to="/requests" className="btn btn-secondary">
              View Requests
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>How It Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">👤</div>
            <h3>Register</h3>
            <p>Create your account as a donor or recipient</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Find Donors</h3>
            <p>Search for available donors based on blood group and location</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Request Blood</h3>
            <p>Create urgent blood requests that match with available donors</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💉</div>
            <h3>Donate</h3>
            <p>Make a difference by donating blood to those in need</p>
          </div>
        </div>
      </section>

      <div className="container">
        <CompatibilityMap />
      </div>

      <section className="statistics">
        <h2>Our Impact</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>1000+</h3>
            <p>Active Donors</p>
          </div>
          <div className="stat-card">
            <h3>500+</h3>
            <p>Lives Saved</p>
          </div>
          <div className="stat-card">
            <h3>250+</h3>
            <p>Donations</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
