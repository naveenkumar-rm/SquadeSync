import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';
import './Navbar.css';

export default function Navbar({ isAuthenticated, currentUser, onLogout }) {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="text-primary font-bold">Maithaan</span>
        </Link>
        
        <div className="navbar-links flex items-center gap-6">
          <Link to="/games" className="nav-link">Find Games</Link>
          <Link to="/teams" className="nav-link">Teams</Link>
          <Link to="/players" className="nav-link">Players</Link>
          
          {/* My Games link removed, accessible via Profile */}

          <Link to="/contact" className="nav-link hidden md:block">Contact Us</Link>
          
          {isAuthenticated ? (
            <div className="navbar-profile flex items-center gap-4" style={{ marginLeft: '1rem', paddingLeft: '1rem', borderLeft: '1px solid var(--color-border)' }}>
              <Link to="/profile" title="View Profile" style={{ display: 'flex' }}>
                <img src={currentUser.avatar} alt={currentUser.name} className="avatar-sm" style={{ objectFit: 'cover' }} />
              </Link>
              <button onClick={handleLogout} className="text-sm font-medium text-muted hover:text-white transition-colors" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem 0.5rem' }}>Sign Out</button>
            </div>
          ) : (
            <div className="flex items-center gap-4" style={{ marginLeft: '1rem', paddingLeft: '1rem', borderLeft: '1px solid var(--color-border)' }}>
              <Link to="/signin" className="text-sm font-medium text-muted hover:text-white transition-colors">Sign In</Link>

              <Link to="/signup">
                <Button variant="primary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>Sign Up</Button>
              </Link>
            </div>
          )}

          <button 
            onClick={toggleTheme} 
            className="theme-toggle"
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
}
