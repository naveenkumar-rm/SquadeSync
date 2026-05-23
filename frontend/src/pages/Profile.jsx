import React from 'react';
import './Profile.css';

export default function Profile({ currentUser }) {
  if (!currentUser) {
    return <div className="container py-12 text-center">Loading profile...</div>;
  }

  // Generate initial from name (e.g., "Naveen kumar" -> "N")
  const initial = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U';
  
  // Generate a handle from the name (e.g., "Naveen kumar" -> "@naveen-kumar")
  const handle = `@${currentUser.name.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="profile-page">
      <div className="container profile-container">
        
        {/* Left Column: Sidebar with Avatar and Stats */}
        <aside className="profile-sidebar fade-in-up">
          <div className="profile-avatar-large">
            {initial}
          </div>
          
          <h1 className="profile-name">{currentUser.name}</h1>
          <p className="profile-handle">({handle})</p>
          
          <div className="profile-follows">
            <div>Following <span>0</span></div>
            <div>Followers <span>0</span></div>
          </div>
          
          <div className="profile-stats-box">
            <div className="stat-item">
              <span className="stat-label">Played</span>
              <span className="stat-value">0</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Awards</span>
              <span className="stat-value">0</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Reliability</span>
              <span className="stat-value">N/A</span>
            </div>
          </div>
        </aside>

        {/* Right Column: Content/Games */}
        <main className="profile-content fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="empty-title">No games found</h2>
          <p className="empty-subtitle">
            Looks like this user hasn't played or organised any games yet.
          </p>
        </main>
        
      </div>
    </div>
  );
}
