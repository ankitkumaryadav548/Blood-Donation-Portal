import React from 'react';
import { Link } from 'react-router-dom';
import CompatibilityMap from '../components/CompatibilityMap';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="premium-hero">
        <div className="hero-overlay"></div>
        <div className="hero-container">
          <div className="hero-text-content">
            <span className="badge-new">NEW: Gamification & Rewards Live! 🏆</span>
            <h1>Be a Hero. <br /><span className="highlight">Save a Life.</span></h1>
            <p>
              Join the world's most advanced blood donation network.
              Connect with donors in seconds, earn points, and climb the leaderboard while saving lives.
            </p>
            <div className="hero-action-buttons">
              <Link to="/register" className="btn-glow-primary">Get Started</Link>
              <Link to="/donors" className="btn-glass">Find Donors</Link>
            </div>
            <div className="hero-trust-badges">
              <div className="trust-item"><span>⚡</span> Fast Matching</div>
              <div className="trust-item"><span>🛡️</span> Secure & Verified</div>
              <div className="trust-item"><span>🌍</span> Nationwide Coverage</div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="blood-drop-animation">
              <div className="drop"></div>
              <div className="wave"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="premium-features">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Simple steps to make a huge impact in someone's life.</p>
        </div>
        <div className="features-container">
          <div className="feature-item">
            <div className="feature-num">01</div>
            <div className="feature-icon-box">👤</div>
            <h3>Create Profile</h3>
            <p>Register as a donor or recipient in less than 60 seconds.</p>
          </div>
          <div className="feature-item">
            <div className="feature-num">02</div>
            <div className="feature-icon-box">🔍</div>
            <h3>Search & Match</h3>
            <p>Find matching blood groups in your city using our smart filters.</p>
          </div>
          <div className="feature-item">
            <div className="feature-num">03</div>
            <div className="feature-icon-box">🤝</div>
            <h3>Connect</h3>
            <p>Contact donors directly or post urgent requests for the community.</p>
          </div>
          <div className="feature-item">
            <div className="feature-num">04</div>
            <div className="feature-icon-box">🏆</div>
            <h3>Earn Rewards</h3>
            <p>Get points, unlock badges, and save lives to top the leaderboard.</p>
          </div>
        </div>
      </section>

      {/* Compatibility Section */}
      <section className="compatibility-section">
        <div className="section-header">
          <h2>Blood Life-Map</h2>
          <p>Understand who you can give to and from whom you can receive.</p>
        </div>
        <div className="compatibility-wrapper">
          <CompatibilityMap />
        </div>
      </section>

      {/* Stats Section */}
      <section className="impact-stats">
        <div className="stats-container">
          <div className="stat-box">
            <div className="stat-number">12k+</div>
            <div className="stat-label">Active Donors</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">4.5k+</div>
            <div className="stat-label">Lives Saved</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">25+</div>
            <div className="stat-label">Cities Covered</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">100%</div>
            <div className="stat-label">Free Forever</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="final-cta">
        <div className="cta-content">
          <h2>Ready to make a difference?</h2>
          <p>Join thousands of others who are already part of the life-saving movement.</p>
          <Link to="/register" className="btn-cta">Join Now — It's Free</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
