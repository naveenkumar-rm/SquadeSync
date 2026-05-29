import { Link } from 'react-router-dom';
import { Users, ShieldCheck } from 'lucide-react';
import './MatchCard.css';

export default function MatchCard({ match }) {
  const currentPlayers = match.currentPlayers || [];
  const maxPlayers = match.maxPlayers || 0;
  const isFull = maxPlayers > 0 && currentPlayers.length >= maxPlayers;
  
  // Safe fallbacks for older mock data if any
  const sport = match.sport || 'Football';
  const gender = match.gender || 'Mixed';
  const price = match.price != null ? match.price.toFixed(2) : '0.00';
  const time = match.time || 'TBD';

  return (
    <div className={`match-row-card ${sport.toLowerCase()}`}>
      <div className="match-info">
        <div className="match-badges">
          <span className={`sport-badge ${sport.toLowerCase()}`}>{sport}</span>
          <span className="gender-badge">{gender}</span>
        </div>
        <h3 className="match-venue">{match.location || 'Location TBD'}</h3>
        <p className="match-title-text">{match.title || 'Untitled Match'}</p>
        <div className="match-meta">
          <span className="match-pitch-type">{match.pitchType || 'TBD'}</span>
          <span className="match-players-count">
            <Users size={14} /> 
            {currentPlayers.length}/{maxPlayers} Players
          </span>
          {match.rules && match.rules.includes('Competitive') && (
            <span className="match-competitive">
              <ShieldCheck size={14} /> Competitive
            </span>
          )}
        </div>
      </div>
      
      <div className="match-actions">
        <Link 
          to={`/match/${match.id}`} 
          className={`time-pill ${isFull ? 'full' : 'available'}`}
        >
          <span className="time-text">{time}</span>
          <span className="price-text">₹{price}</span>
        </Link>
        {isFull ? (
          <span className="status-text text-muted text-xs mt-1">Sold Out</span>
        ) : (
          <span className="status-text text-primary text-xs mt-1">Available</span>
        )}
      </div>
    </div>
  );
}
