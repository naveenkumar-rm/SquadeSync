import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import { Users, Shield, Plus } from 'lucide-react';
import './TeamsPage.css';

export default function TeamsPage({ currentUser }) {
  const [teams, setTeams] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    logo: ''
  });

  const [searchQueries, setSearchQueries] = useState({});

  const [editingTeamId, setEditingTeamId] = useState(null);

  useEffect(() => {
    fetchTeams();
    fetchAllUsers();
  }, []);

  const fetchTeams = () => {
    fetch('http://localhost:8081/api/teams')
      .then(res => res.json())
      .then(data => setTeams(data))
      .catch(err => console.error("Error fetching teams:", err));
  };

  const fetchAllUsers = () => {
    fetch('http://localhost:8081/api/users')
      .then(res => res.json())
      .then(data => setAllUsers(data))
      .catch(err => console.error("Error fetching users:", err));
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (teamId, value) => {
    setSearchQueries(prev => ({ ...prev, [teamId]: value }));
  };

  const handleCreateTeam = (e) => {
    e.preventDefault();
    if (!currentUser) return alert('You must be logged in to create a team.');

    fetch('http://localhost:8081/api/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        logo: formData.logo,
        captain: { id: currentUser.id }
      })
    })
    .then(res => {
      if (res.ok) {
        setIsCreating(false);
        setFormData({ name: '', logo: '' });
        fetchTeams();
      } else {
        alert('Failed to create team');
      }
    })
    .catch(err => console.error(err));
  };

  const handleJoinTeam = (teamId, userId = currentUser?.id) => {
    if (!userId) return alert('You must be logged in to join a team.');

    fetch(`http://localhost:8081/api/teams/${teamId}/members/${userId}`, {
      method: 'POST'
    })
    .then(res => {
      if (res.ok) {
        fetchTeams();
      } else {
        alert('Failed to add player to team');
      }
    })
    .catch(err => console.error(err));
  };

  const handleRemovePlayer = (teamId, userId) => {
    fetch(`http://localhost:8081/api/teams/${teamId}/members/${userId}`, {
      method: 'DELETE'
    })
    .then(res => {
      if (res.ok) {
        fetchTeams();
      } else {
        alert('Failed to remove player');
      }
    })
    .catch(err => console.error(err));
  };

  const handleChangeCaptain = (teamId, userId) => {
    fetch(`http://localhost:8081/api/teams/${teamId}/captain/${userId}`, {
      method: 'PUT'
    })
    .then(res => {
      if (res.ok) {
        fetchTeams();
      } else {
        alert('Failed to change captain');
      }
    })
    .catch(err => console.error(err));
  };

  return (
    <div className="teams-page fade-in">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Teams</h1>
            <p className="text-muted mt-2">Join a team or create your own to dominate the pitch.</p>
          </div>
          <Button variant="primary" onClick={() => setIsCreating(!isCreating)}>
            <Plus size={18} className="mr-2" style={{ display: 'inline' }} />
            {isCreating ? 'Cancel' : 'Create Team'}
          </Button>
        </div>

        {isCreating && (
          <div className="create-team-card mb-8 fade-in-up">
            <h2 className="text-xl font-bold mb-4">Create New Team</h2>
            <form onSubmit={handleCreateTeam} className="create-team-form">
              <div className="form-group mb-4">
                <label>Team Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. The Invincibles" />
              </div>
              <div className="form-group mb-6">
                <label>Team Logo URL (Optional)</label>
                <input type="text" name="logo" value={formData.logo} onChange={handleInputChange} placeholder="https://example.com/logo.png" />
              </div>
              <div className="flex justify-end gap-4">
                <Button variant="secondary" type="button" onClick={() => setIsCreating(false)}>Cancel</Button>
                <Button variant="primary" type="submit">Create Team</Button>
              </div>
            </form>
          </div>
        )}

        <div className="teams-grid">
          {teams.length === 0 && !isCreating ? (
            <div className="empty-teams">No teams found. Be the first to create one!</div>
          ) : (
            teams.map(team => {
              const isMember = team.members?.some(m => m.id === currentUser?.id);
              const isCaptain = team.captain?.id === currentUser?.id;

              const searchQuery = (searchQueries[team.id] || '').toLowerCase();
              const nonMembers = allUsers
                .filter(u => !team.members?.some(m => m.id === u.id))
                .filter(u => u.name.toLowerCase().includes(searchQuery));

              const isEditing = editingTeamId === team.id;

              return (
                <div key={team.id} className={`team-card fade-in-up flex-col ${isEditing ? 'editing' : ''}`} style={{ display: 'flex' }}>
                  <div className="team-header">
                    <img 
                      src={team.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${team.name}&backgroundColor=transparent`} 
                      alt={team.name} 
                      className="team-logo" 
                    />
                    <div>
                      <h3 className="team-name">{team.name}</h3>
                      <p className="team-captain flex items-center gap-1 text-sm text-muted">
                        <Shield size={14} className="text-primary" /> Captain: <span className="text-white">{team.captain?.name}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className={`team-stats mt-4 mb-4 ${isEditing ? 'editing-layout' : ''}`}>
                    <div className="current-members">
                      <div className="flex items-center gap-2 text-sm mb-3 font-medium text-muted">
                        <Users size={16} />
                        <span>{team.members?.length || 0} Members</span>
                      </div>
                      {team.members?.length > 0 && (
                        <div className="members-list mt-2 mb-4" style={{ maxHeight: isEditing ? '250px' : '160px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                          {team.members.map(member => (
                            <div key={member.id} className="member-pill">
                              <span className="text-sm font-medium">
                                {member.name} {member.id === team.captain?.id && <span className="text-primary italic ml-1 text-xs">(Captain)</span>}
                              </span>
                              {isEditing && member.id !== team.captain?.id && (
                                <div className="flex gap-2 items-center">
                                  <Button 
                                    variant="secondary" 
                                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}
                                    onClick={() => handleChangeCaptain(team.id, member.id)}
                                  >
                                    Make Captain
                                  </Button>
                                  <button 
                                    className="text-red-400 hover:text-red-300 transition-colors"
                                    onClick={() => handleRemovePlayer(team.id, member.id)}
                                    title="Remove Player"
                                  >
                                    ×
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {isEditing && (
                      <div className="add-player-control">
                        <h4 className="font-bold mb-4">Add player to team</h4>
                        <input 
                          type="text" 
                          placeholder="Search player name..." 
                          className="text-sm p-2 w-full mb-2" 
                          value={searchQueries[team.id] || ''}
                          onChange={(e) => handleSearchChange(team.id, e.target.value)}
                          style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}
                        />
                        {searchQuery && nonMembers.length > 0 && (
                          <div className="search-results mt-2" style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-bg)' }}>
                            {nonMembers.map(user => (
                              <div 
                                key={user.id} 
                                className="search-result-item flex items-center justify-between p-2" 
                                style={{ borderBottom: '1px solid var(--color-border)' }}
                              >
                                <span className="text-sm font-medium">{user.name}</span>
                                <Button 
                                  variant="secondary" 
                                  style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                                  onClick={() => {
                                    handleJoinTeam(team.id, user.id);
                                    setSearchQueries(prev => ({ ...prev, [team.id]: '' }));
                                  }}
                                >
                                  Add
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                        {searchQuery && nonMembers.length === 0 && (
                          <div className="text-sm text-muted text-center mt-4">No players found matching "{searchQuery}".</div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-auto pt-4">
                    {isMember ? (
                      isCaptain ? (
                        <div className="flex gap-2">
                          <Button variant={isEditing ? "primary" : "secondary"} style={{ flexGrow: 1 }} onClick={() => setEditingTeamId(isEditing ? null : team.id)}>
                            {isEditing ? 'Done Editing' : 'Edit Team'}
                          </Button>
                          {isEditing && (
                            <Button 
                              variant="secondary" 
                              style={{ color: '#ff4b4b', borderColor: '#ff4b4b' }} 
                              onClick={() => {
                                if(window.confirm('Are you sure you want to delete this team?')) {
                                  fetch(`http://localhost:8081/api/teams/${team.id}`, { method: 'DELETE' }).then(() => fetchTeams());
                                }
                              }}
                            >
                              Delete Team
                            </Button>
                          )}
                        </div>
                      ) : (
                        <Button variant="secondary" style={{ width: '100%' }} disabled>Joined</Button>
                      )
                    ) : (
                      <Button variant="primary" style={{ width: '100%' }} onClick={() => handleJoinTeam(team.id)}>
                        Join Team
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
