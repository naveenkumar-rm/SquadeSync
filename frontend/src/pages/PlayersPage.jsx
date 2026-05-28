import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import { Search, UserPlus, UserCheck } from 'lucide-react';
import './PlayersPage.css';

export default function PlayersPage({ currentUser, updateUser }) {
  const [users, setUsers] = useState([]);
  const [followingIds, setFollowingIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
    if (currentUser) {
      fetchFollowing();
    }
  }, [currentUser]);

  const fetchUsers = () => {
    fetch('http://localhost:8081/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Error fetching users:", err));
  };

  const fetchFollowing = () => {
    fetch(`http://localhost:8081/api/users/${currentUser.id}/following`)
      .then(res => res.json())
      .then(data => setFollowingIds(data.map(u => u.id)))
      .catch(err => console.error("Error fetching following list:", err));
  };

  const handleFollow = (userId) => {
    fetch(`http://localhost:8081/api/users/${currentUser.id}/follow/${userId}`, {
      method: 'POST'
    })
    .then(res => res.json())
    .then(updatedUser => {
      setFollowingIds([...followingIds, userId]);
      if (updateUser) updateUser(updatedUser);
    })
    .catch(err => console.error("Error following user:", err));
  };

  const handleUnfollow = (userId) => {
    fetch(`http://localhost:8081/api/users/${currentUser.id}/follow/${userId}`, {
      method: 'DELETE'
    })
    .then(res => res.json())
    .then(updatedUser => {
      setFollowingIds(followingIds.filter(id => id !== userId));
      if (updateUser) updateUser(updatedUser);
    })
    .catch(err => console.error("Error unfollowing user:", err));
  };

  const filteredUsers = users.filter(user => 
    user.id !== currentUser?.id && 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="players-page fade-in">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Players Directory</h1>
            <p className="text-muted mt-2">Find and follow other players on PitchConnect.</p>
          </div>
        </div>

        <div className="search-container mb-8">
          <Search className="search-icon text-muted" size={20} />
          <input 
            type="text" 
            placeholder="Search players by name..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="players-grid">
          {filteredUsers.length === 0 ? (
            <div className="empty-state">No players found matching your search.</div>
          ) : (
            filteredUsers.map(user => {
              const isFollowing = followingIds.includes(user.id);
              return (
                <div key={user.id} className="player-card fade-in-up">
                  <div className="player-info">
                    <img 
                      src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} 
                      alt={user.name} 
                      className="player-avatar" 
                    />
                    <div>
                      <h3 className="player-name">{user.name}</h3>
                      <p className="player-stats text-sm text-muted">
                        Matches: {user.gamesPlayed || 0} | Reliability: {user.reliability || 100}%
                      </p>
                    </div>
                  </div>
                  <div className="player-action">
                    {isFollowing ? (
                      <Button variant="secondary" onClick={() => handleUnfollow(user.id)} style={{ minWidth: '110px' }}>
                        <UserCheck size={16} className="mr-2" style={{ display: 'inline' }} />
                        Following
                      </Button>
                    ) : (
                      <Button variant="primary" onClick={() => handleFollow(user.id)} style={{ minWidth: '110px' }}>
                        <UserPlus size={16} className="mr-2" style={{ display: 'inline' }} />
                        Follow
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
