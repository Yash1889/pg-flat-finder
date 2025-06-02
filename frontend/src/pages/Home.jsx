import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to search results with query
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="home-container">
      <header className="main-header">
        <div className="header-content">
          <h1 className="site-title">PG Flat Finder</h1>
          <nav className="main-nav">
            <ul className="nav-list">
              <li><a href="/" className="nav-link active">Home</a></li>
              <li><a href="/listings" className="nav-link">Listings</a></li>
              <li><a href="/about" className="nav-link">About</a></li>
              <li><a href="/contact" className="nav-link">Contact</a></li>
              <li><a href="/login" className="nav-link login-link">Login</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <section className="hero-section">
          <div className="hero-content">
            <h2 className="hero-title">Find Your Perfect PG or Flat</h2>
            <p className="hero-subtitle">
              Discover affordable PGs and flats near you with no brokerage fees.
            </p>

            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                className="search-input"
                placeholder="Enter location, college, or landmark..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-button">
                Search
              </button>
            </form>
          </div>
        </section>

        <section className="features-section">
          <div className="section-header">
            <h3 className="section-title">Why Choose Us</h3>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🏠</div>
              <h4 className="feature-title">No Brokerage</h4>
              <p className="feature-description">Connect directly with owners and save money on brokerage fees.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h4 className="feature-title">Verified Listings</h4>
              <p className="feature-description">All our listings are verified to ensure quality and authenticity.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📍</div>
              <h4 className="feature-title">Location Based</h4>
              <p className="feature-description">Find properties near your college, office, or preferred location.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h4 className="feature-title">Budget Friendly</h4>
              <p className="feature-description">Options for every budget with transparent pricing.</p>
            </div>
          </div>
        </section>

        <section className="locations-section">
          <div className="section-header">
            <h3 className="section-title">Popular Locations</h3>
          </div>
          <div className="locations-grid">
            {['Kormangala', 'HSR Layout', 'Indiranagar', 'Electronic City'].map((location) => (
              <div
                key={location}
                className="location-card"
                onClick={() => navigate(`/search?query=${encodeURIComponent(location)}`)}
              >
                <div className="location-image">
                  <div className="location-placeholder">📍</div>
                </div>
                <div className="location-details">
                  <h4 className="location-name">{location}</h4>
                  <p className="location-description">Explore PGs and flats</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-content">
            <h3 className="cta-title">Are you a property owner?</h3>
            <p className="cta-description">List your property for free and reach thousands of potential tenants.</p>
            <a href="/list-property" className="cta-button">List Your Property</a>
          </div>
        </section>
      </main>

      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4 className="footer-title">PG Flat Finder</h4>
            <p className="footer-description">Finding your perfect accommodation made easy.</p>
          </div>
          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/listings">Listings</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4 className="footer-title">Contact Us</h4>
            <p>Email: info@pgflatfinder.com</p>
            <p>Phone: +91 9876543210</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p> 2025 PG Flat Finder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;