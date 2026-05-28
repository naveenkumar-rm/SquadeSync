import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, CreditCard, Shield, Info } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Button from '../components/Button';
import './MatchDetails.css';

// Fix for default leaflet icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;
export default function MatchDetails({ matches, joinMatch, isAuthenticated, currentUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const match = matches.find(m => m.id === id);
  const [userTeams, setUserTeams] = useState([]);
  const [showTeamSelect, setShowTeamSelect] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated && currentUser) {
      fetch('http://localhost:8081/api/teams')
        .then(res => res.json())
        .then(data => {
          const myTeams = data.filter(t => t.captain?.id === currentUser.id);
          setUserTeams(myTeams);
        })
        .catch(err => console.error(err));
    }
  }, [isAuthenticated, currentUser]);

  if (!match) {
    return <div className="container py-12 text-center text-xl">Match not found</div>;
  }

  const [teamSize, setTeamSize] = useState(1);
  const availableSpots = match.maxPlayers - match.currentPlayers.length;
  const isFull = availableSpots <= 0;
  // Check if current user is already in the game 
  const isJoined = isAuthenticated && currentUser && match.currentPlayers.some(p => p.id === currentUser.id);

  const handleJoin = () => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }
    if (!isJoined && !isFull && teamSize <= availableSpots) {
      joinMatch(match.id, teamSize);
    }
  };

  const handleJoinAsTeam = (team) => {
    if (!isAuthenticated) return;
    
    if (team.members.length > availableSpots) {
      alert(`Your team has ${team.members.length} members but only ${availableSpots} spots are available.`);
      return;
    }

    fetch(`http://localhost:8081/api/matches/${match.id}/join-team/${team.id}`, {
      method: 'POST'
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      throw new Error('Failed to join as team');
    })
    .then(updatedMatch => {
      // In a real app we'd update global state here, but we can just reload or call a callback
      window.location.reload();
    })
    .catch(err => {
      alert(err.message);
    });
  };

  return (
    <div className="container py-8 match-details-page">
      <div className="match-header mb-8">
        <h1 className="text-3xl mb-2">{match.title}</h1>
        <div className="match-host">
          Hosted by <span className="font-bold">{match.host.name}</span>
        </div>
      </div>

      <div className="match-content">
        <div className="match-main">
          <section className="match-section info-grid">
            <div className="info-card">
              <Calendar className="text-primary mb-2" size={24} />
              <div className="font-bold">{new Date(match.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
              <div className="text-sm text-muted">{match.time} ({match.duration} mins)</div>
            </div>
            <div className="info-card">
              <MapPin className="text-primary mb-2" size={24} />
              <div className="font-bold">{match.location}</div>
              <div className="text-sm text-muted">{match.pitchType}</div>
            </div>
            <div className="info-card">
              <CreditCard className="text-primary mb-2" size={24} />
              <div className="font-bold">₹{match.price.toFixed(2)}</div>
              <div className="text-sm text-muted">Pay via app</div>
            </div>
          </section>

          <section className="match-section mt-8">
            <h2 className="text-xl mb-4 flex items-center gap-2">
              <Info size={20} className="text-primary"/> Rules & Info
            </h2>
            <div className="rules-box">
              <p>{match.rules}</p>
            </div>
          </section>

          <section className="match-section mt-8">
            <h2 className="text-xl mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-primary"/> Location
            </h2>
            <div style={{ height: '300px', width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border)', zIndex: 1, position: 'relative' }}>
              {match.lat && match.lng ? (
                <MapContainer center={[match.lat, match.lng]} zoom={14} scrollWheelZoom={false} style={{ height: '100%', width: '100%', zIndex: 1 }}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[match.lat, match.lng]}>
                    <Popup>
                      <div className="text-black">
                        <strong>{match.location}</strong><br/>
                        {match.address}
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-muted)' }}>
                  Map location unavailable
                </div>
              )}
            </div>
            <p className="mt-2 text-sm text-muted">{match.address}</p>
          </section>

          <section className="match-section mt-8">
            <h2 className="text-xl mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2"><Shield size={20} className="text-primary"/> Roster</span>
              <span className="text-sm text-muted">{match.currentPlayers.length} / {match.maxPlayers}</span>
            </h2>
            <div className="roster-grid">
              {match.currentPlayers.map((player, idx) => (
                <div key={idx} className="roster-player">
                  <img src={player.avatar} alt={player.name} className="avatar-md" />
                  <span className="text-sm font-medium">{player.name}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="match-sidebar">
          <div className="booking-card">
            <h3 className="text-xl mb-4">Join Game</h3>
            <div className="booking-price mb-4">
              <span className="text-3xl font-bold">₹{(match.price * teamSize).toFixed(2)}</span>
              {teamSize > 1 && <span className="text-sm text-muted ml-2">(₹{match.price.toFixed(2)} each)</span>}
            </div>
            
            {!isJoined && !isFull && !showTeamSelect && (
              <div className="mb-6 flex items-center justify-between">
                <label className="text-sm font-medium">Players</label>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 rounded text-lg" style={{ backgroundColor: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', cursor: 'pointer' }} onClick={() => setTeamSize(Math.max(1, teamSize - 1))}>-</button>
                  <span className="w-8 text-center font-bold">{teamSize}</span>
                  <button className="px-3 py-1 rounded text-lg" style={{ backgroundColor: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', cursor: 'pointer' }} onClick={() => setTeamSize(Math.min(availableSpots, teamSize + 1))}>+</button>
                </div>
              </div>
            )}

            {showTeamSelect ? (
              <div className="mb-4">
                <h4 className="text-md font-bold mb-2">Select a Team:</h4>
                {userTeams.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {userTeams.map(t => (
                      <Button key={t.id} variant="secondary" onClick={() => handleJoinAsTeam(t)} className="w-full text-left">
                        {t.name} ({t.members.length} members)
                      </Button>
                    ))}
                    <Button variant="secondary" onClick={() => setShowTeamSelect(false)} className="mt-2 text-muted">Cancel</Button>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-muted mb-2">You don't captain any teams yet.</p>
                    <Button variant="secondary" onClick={() => navigate('/teams')} className="w-full">Create Team</Button>
                    <Button variant="secondary" onClick={() => setShowTeamSelect(false)} className="mt-2 text-muted">Cancel</Button>
                  </div>
                )}
              </div>
            ) : isJoined ? (
              <Button variant="secondary" className="w-full" disabled>You're playing!</Button>
            ) : isFull ? (
              <Button variant="secondary" className="w-full" disabled>Match Full</Button>
            ) : (
              <div className="flex flex-col gap-3">
                <Button variant="primary" className="w-full" onClick={handleJoin} disabled={teamSize > availableSpots}>
                  Pay & Join {teamSize > 1 ? 'Match' : 'Match'}
                </Button>
                {isAuthenticated && (
                  <Button variant="secondary" className="w-full border-primary text-primary" onClick={() => setShowTeamSelect(true)}>
                    Join as Team
                  </Button>
                )}
              </div>
            )}
            <p className="text-sm text-muted text-center mt-4">
              Free cancellation up to 48 hours before kick-off.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
