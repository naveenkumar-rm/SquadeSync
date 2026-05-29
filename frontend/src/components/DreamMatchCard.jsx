import { Link } from 'react-router-dom';
import { Users, CreditCard, MapPin } from 'lucide-react';
import './DreamMatchCard.css';

export default function DreamMatchCard({ match, status }) {
  const sport = match.sport || 'Football';
  
  // Define styles based on status
  let statusClass = 'status-upcoming';
  let statusText = match.time; // default to time

  if (status === 'live') {
    statusClass = 'status-live';
    statusText = 'Live Now';
  } else if (status === 'past') {
    statusClass = 'status-completed';
    statusText = 'Completed';
  } else {
    // For upcoming, we can show "Today, 19:00" or just time
    statusText = `${match.time}`;
  }

  return (
    <Link to={`/match/${match.id}`} className="dream-card">
      <div className="dream-card-header">
        <span>{sport} • {match.gender || 'Mixed'}</span>
        <span style={{ fontWeight: 400 }}>{match.pitchType || 'Standard'}</span>
      </div>
      
      <div className="dream-card-body">
        {/* Left Team (Host) */}
        <div className="dream-team">
          <div className="dream-team-avatar">
            <img src={match.host?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${match.host?.name || 'Host'}`} alt={match.host?.name || 'Host'} />
          </div>
          <span className="dream-team-name">{match.host?.name || 'Unknown Host'}</span>
        </div>

        {/* Center VS / Time */}
        <div className="dream-vs-container">
          <span className={`dream-time-status ${statusClass}`}>
            {statusText}
          </span>
          <span className="dream-match-title">{match.title || 'Untitled Match'}</span>
        </div>

        {/* Right Team (Location / Opponent) */}
        <div className="dream-team">
          <div className="dream-team-avatar" style={{ backgroundColor: 'var(--color-surface-hover)' }}>
            <MapPin size={24} color="var(--color-text-muted)" />
          </div>
          <span className="dream-team-name" style={{ color: 'var(--color-text-muted)' }}>
            {match.location ? match.location.split(' ')[0] : 'Unknown'}
          </span>
        </div>
      </div>

      <div className="dream-card-footer">
        <div className="dream-footer-item">
          <Users size={16} className="text-primary" />
          <span>{match.currentPlayers?.length || 0} / {match.maxPlayers || 0} Spots</span>
        </div>
        <div className="dream-footer-item">
          <CreditCard size={16} className="text-primary" />
          <span>₹{(match.price || 0).toFixed(2)}</span>
        </div>
      </div>
    </Link>
  );
}
