import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ShieldCheck } from 'lucide-react';
import './MatchCard.css';

export default function MatchCard({ match }) {
  const isFull = match.currentPlayers.length >= match.maxPlayers;
  
  // Safe fallbacks for older mock data if any
  const sport = match.sport || 'Football';
  const gender = match.gender || 'Mixed';

  return (
    <div className={`match-row-card ${sport.toLowerCase()}`}>
      <div className="match-info">
        <div className="match-badges">
          <span className={`sport-badge ${sport.toLowerCase()}`}>{sport}</span>
          <span className="gender-badge">{gender}</span>
        </div>
        <h3 className="match-venue">{match.location}</h3>
        <p className="match-title-text">{match.title}</p>
        <div className="match-meta">
          <span className="match-pitch-type">{match.pitchType}</span>
          <span className="match-players-count">
            <Users size={14} /> 
            {match.currentPlayers.length}/{match.maxPlayers} Players
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
          <span className="time-text">{match.time}</span>
          <span className="price-text">₹{match.price.toFixed(2)}</span>
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
