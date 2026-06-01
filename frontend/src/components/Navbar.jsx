import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Shield, Settings } from 'lucide-react';
import Button from './Button';
import './Navbar.css';

export default function Navbar({ isAuthenticated, currentUser, onLogout, theme, setTheme, isPinkMode, setIsPinkMode }) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const togglePinkMode = () => {
    setIsPinkMode(prev => !prev);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="container navbar-container">
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            <span className="text-primary font-bold">Squadsync</span>
          </Link>
          
          <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className={`navbar-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            <Link to="/games" className="nav-link" onClick={closeMobileMenu}>Find Games</Link>
            <Link to="/teams" className="nav-link" onClick={closeMobileMenu}>Teams</Link>
            <Link to="/players" className="nav-link" onClick={closeMobileMenu}>Players</Link>
            
            {isAuthenticated ? (
              <div className="navbar-profile flex items-center gap-4 profile-wrapper">
                <Link to="/profile" title="View Profile" style={{ display: 'flex' }} onClick={closeMobileMenu}>
                  <img src={currentUser.avatar} alt={currentUser.name} className="avatar-sm" style={{ objectFit: 'cover' }} />
                </Link>
              </div>
            ) : (
              <div className="auth-buttons flex items-center gap-4">
                <Link to="/signin" className="text-sm font-medium text-muted hover:text-white transition-colors" onClick={closeMobileMenu}>Sign In</Link>
                <Link to="/signup" onClick={closeMobileMenu}>
                  <Button variant="primary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>Sign Up</Button>
                </Link>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button 
                onClick={togglePinkMode} 
                className="theme-toggle"
                title="Toggle Women's Pink Mode"
                style={{ color: isPinkMode ? '#ec4899' : 'var(--color-text-muted)' }}
              >
                <Shield size={20} />
              </button>
              
              <button 
                onClick={() => setShowSettingsModal(true)} 
                className="theme-toggle"
                aria-label="Settings"
                title="Settings"
              >
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {showSettingsModal && (
        <div className="modal-overlay" onClick={() => setShowSettingsModal(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-content" style={{ border: 'none', textAlign: 'left', padding: '0', maxHeight: '90vh', overflowY: 'auto', maxWidth: '500px', width: '100%', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-lg)', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center" style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Settings size={24} className="text-primary" />
                Settings
              </h2>
              <button onClick={() => setShowSettingsModal(false)} className="text-muted hover:text-white" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.5rem' }}>
                <X size={24} />
              </button>
            </div>
            
            <div className="flex flex-col gap-8" style={{ padding: '1.5rem' }}>
              
              <section>
                <h3 className="text-sm font-bold text-muted mb-4" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Preferences</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center" style={{ padding: '1rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <div>
                      <span className="font-medium" style={{ display: 'block', marginBottom: '0.25rem' }}>Theme Appearance</span>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>Switch between dark and light mode</span>
                    </div>
                    <button 
                      onClick={toggleTheme} 
                      className="btn-secondary"
                      style={{ 
                        padding: '0.5rem 1rem', 
                        borderRadius: 'var(--radius-md)', 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: '600'
                      }}
                    >
                      {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center" style={{ padding: '1rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <div>
                      <span className="font-medium" style={{ display: 'block', marginBottom: '0.25rem' }}>Help & Support</span>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>Get assistance or report issues</span>
                    </div>
                    <Link to="/help" onClick={() => setShowSettingsModal(false)}>
                      <Button variant="outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>View Help</Button>
                    </Link>
                  </div>
                </div>
              </section>

              {isAuthenticated && (
                <section className="pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
                  <button 
                    onClick={() => { handleLogout(); setShowSettingsModal(false); }} 
                    className="w-full flex items-center justify-center gap-2"
                    style={{ 
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)', 
                      backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                      color: '#ef4444', 
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                  >
                    Sign Out
                  </button>
                </section>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}
