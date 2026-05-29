import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CalendarX, Edit2 } from 'lucide-react';
import DreamMatchCard from '../components/DreamMatchCard';
import Button from '../components/Button';
import './Profile.css';
import './MyGames.css';

export default function Profile({ currentUser, matches = [], updateUser }) {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [editMode, setEditMode] = useState(false);
  const [followingList, setFollowingList] = useState([]);
  const [followersList, setFollowersList] = useState([]);
  const [showModal, setShowModal] = useState(null); // 'following' or 'followers' or null
  
  useEffect(() => {
    if (currentUser) {
      fetch(`http://localhost:8081/api/users/${currentUser.id}/following`)
        .then(res => res.json())
        .then(data => setFollowingList(data))
        .catch(err => console.error("Error fetching following:", err));

      fetch(`http://localhost:8081/api/users/${currentUser.id}/followers`)
        .then(res => res.json())
        .then(data => setFollowersList(data))
        .catch(err => console.error("Error fetching followers:", err));
    }
  }, [currentUser]);
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    age: currentUser?.age || '',
    bio: currentUser?.bio || '',
    avatar: currentUser?.avatar || ''
  });

  const { upcomingGames, liveGames, completedGames } = useMemo(() => {
    if (!currentUser) return { upcomingGames: [], liveGames: [], completedGames: [] };
    const today = new Date(); 

    const userMatches = matches.filter(m => 
      m.currentPlayers?.some(p => p.id === currentUser.id || p.id.startsWith(currentUser.id + '_guest'))
    );

    userMatches.sort((a, b) => {
      const dateA = new Date(`${a.date || ''}T${a.time || ''}`);
      const dateB = new Date(`${b.date || ''}T${b.time || ''}`);
      return (dateA.getTime() || 0) - (dateB.getTime() || 0);
    });

    const upcoming = [];
    const live = [];
    const completed = [];

    userMatches.forEach(m => {
      if (!m.date || !m.time) {
        upcoming.push(m);
        return;
      }
      const matchDate = new Date(`${m.date}T${m.time}:00`);
      const duration = m.duration || 60;
      const matchEnd = new Date(matchDate.getTime() + duration * 60000);

      if (matchEnd < today) {
        completed.push(m);
      } else if (matchDate <= today && matchEnd >= today) {
        live.push(m);
      } else {
        upcoming.push(m);
      }
    });

    return { upcomingGames: upcoming, liveGames: live, completedGames: completed };
  }, [matches, currentUser]);

  if (!currentUser) {
    return <div className="container py-12 text-center">Loading profile...</div>;
  }

  const safeName = currentUser.name || 'User';
  const initial = safeName.charAt(0).toUpperCase();
  const handle = `@${safeName.toLowerCase().replace(/\s+/g, '-')}`;

  const getDisplayedMatches = () => {
    if (activeTab === 'upcoming') return upcomingGames;
    if (activeTab === 'live') return liveGames;
    if (activeTab === 'completed') return completedGames;
    return [];
  };

  const displayedMatches = getDisplayedMatches();

  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = () => {
    fetch(`http://localhost:8081/api/users/${currentUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...currentUser,
        name: formData.name,
        age: formData.age ? parseInt(formData.age, 10) : null,
        bio: formData.bio,
        avatar: formData.avatar
      })
    })
    .then(res => res.json())
    .then(updatedUser => {
      if (updateUser) updateUser(updatedUser);
      setEditMode(false);
    })
    .catch(err => console.error("Error updating profile:", err));
  };

  const renderModal = () => {
    if (!showModal) return null;
    
    const title = showModal === 'followers' ? 'Followers' : 'Following';
    const list = showModal === 'followers' ? followersList : followingList;

    return (
      <div className="follow-modal-overlay" onClick={() => setShowModal(null)}>
        <div className="follow-modal" onClick={e => e.stopPropagation()}>
          <div className="follow-modal-header">
            <h3>{title}</h3>
            <button className="close-modal-btn" onClick={() => setShowModal(null)}>×</button>
          </div>
          <div className="follow-modal-body">
            {list.length === 0 ? (
              <p className="no-users-text">No {title.toLowerCase()} yet.</p>
            ) : (
              list.map(user => (
                <div key={user.id} className="follow-user-row">
                  <img 
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                    alt={user.name} 
                    className="follow-user-avatar" 
                  />
                  <div className="follow-user-info">
                    <span className="follow-user-name">{user.name}</span>
                    <span className="follow-user-handle">@{user.name.toLowerCase().replace(/\s+/g, '-')}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="profile-page">
      {renderModal()}
      <div className="container profile-container">
        
        {/* Left Column: Sidebar with Avatar and Stats */}
        <aside className="profile-sidebar fade-in-up">
          <div className="profile-avatar-large" style={{ overflow: 'hidden' }}>
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              initial
            )}
          </div>
          
          {!editMode ? (
            <>
              <h1 className="profile-name">{currentUser.name}</h1>
              <p className="profile-handle">({handle})</p>
              
              <div className="profile-details mb-4 text-muted text-sm">
                {currentUser.age && <p><strong>Age:</strong> {currentUser.age}</p>}
                {currentUser.bio && <p className="mt-2 italic">"{currentUser.bio}"</p>}
              </div>

              <button className="edit-profile-btn flex items-center gap-2" onClick={() => setEditMode(true)}>
                <Edit2 size={16} /> Edit Profile
              </button>
            </>
          ) : (
            <div className="edit-profile-form mb-6 w-full text-left">
              <div className="form-group mb-4">
                <label>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleEditChange} />
              </div>
              <div className="form-group mb-4">
                <label>Age</label>
                <input type="number" name="age" value={formData.age} onChange={handleEditChange} />
              </div>
              <div className="form-group mb-4">
                <label>Bio</label>
                <textarea name="bio" value={formData.bio} onChange={handleEditChange} rows="3" />
              </div>
              <div className="form-group mb-6">
                <label>Photo URL</label>
                <input type="text" name="avatar" value={formData.avatar} onChange={handleEditChange} />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="secondary" onClick={() => setEditMode(false)}>Cancel</Button>
                <Button variant="primary" onClick={handleSaveProfile}>Save</Button>
              </div>
            </div>
          )}
          
          <div className="profile-network-stats">
            <div className="network-stat" onClick={() => setShowModal('followers')}>
              <span className="network-count">{followersList.length}</span>
              <span className="network-label">followers</span>
            </div>
            <div className="network-stat" onClick={() => setShowModal('following')}>
              <span className="network-count">{followingList.length}</span>
              <span className="network-label">following</span>
            </div>
          </div>
          
          <div className="profile-stats-box">
            <div className="stat-item">
              <span className="stat-label">Played</span>
              <span className="stat-value">{completedGames.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Upcoming</span>
              <span className="stat-value">{upcomingGames.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Live</span>
              <span className="stat-value">{liveGames.length}</span>
            </div>
          </div>
        </aside>

        {/* Right Column: Content/Games */}
        <main className="profile-content fade-in-up my-games-page" style={{ animationDelay: '0.1s' }}>
          <div className="dream-tabs" style={{ marginBottom: '1.5rem' }}>
            <button 
              className={`dream-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming ({upcomingGames.length})
            </button>
            <button 
              className={`dream-tab ${activeTab === 'live' ? 'active' : ''}`}
              onClick={() => setActiveTab('live')}
            >
              Live ({liveGames.length})
            </button>
            <button 
              className={`dream-tab ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              Completed ({completedGames.length})
            </button>
          </div>

          <div className="my-games-content">
            {displayedMatches.length > 0 ? (
              displayedMatches.map(match => (
                <DreamMatchCard 
                  key={match.id} 
                  match={match} 
                  status={activeTab === 'completed' ? 'past' : activeTab === 'live' ? 'live' : 'upcoming'} 
                />
              ))
            ) : (
              <div className="empty-state-card fade-in-up" style={{ padding: '3rem 1rem' }}>
                <CalendarX size={48} className="empty-state-icon" strokeWidth={1.5} />
                <h3>No {activeTab} matches</h3>
                <p>You don't have any {activeTab} matches right now. Want to find one?</p>
                <Link to="/games">
                  <Button variant="primary">Browse Local Games</Button>
                </Link>
              </div>
            )}
          </div>
        </main>
        
      </div>
    </div>
  );
}
