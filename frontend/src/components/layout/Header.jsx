import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header 
      className={`header ${isScrolled ? 'header-scrolled' : 'header-transparent'}`}
    >
      <div className="container">
        <div className="navbar">
          {/* Logo */}
          <Link to="/" className="navbar-brand">
            <span>PG Flat Finder</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="navbar-nav desktop-only">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/search" className="nav-link">
              Find Properties
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/my-properties" className="nav-link">
                  My Properties
                </Link>
                <div className="dropdown">
                  <button className="dropdown-toggle">
                    {user?.username || 'Account'}
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  <div className="dropdown-menu">
                    <Link to="/dashboard" className="dropdown-item">
                      Dashboard
                    </Link>
                    <Link to="/add-property" className="dropdown-item">
                      Add Property
                    </Link>
                    <button
                      onClick={logout}
                      className="dropdown-item text-danger"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="mobile-menu-button"
            onClick={toggleMobileMenu}
          >
            <span className="sr-only">Open main menu</span>
            {isMobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-items">
            <Link
              to="/"
              className="mobile-menu-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/search"
              className="mobile-menu-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Find Properties
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/my-properties"
                  className="mobile-menu-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Properties
                </Link>
                <Link
                  to="/dashboard"
                  className="mobile-menu-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/add-property"
                  className="mobile-menu-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Add Property
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="mobile-menu-link text-danger"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="mobile-menu-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="mobile-menu-link text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
