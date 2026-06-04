import { useState, useMemo, useEffect } from 'react';
import { Map, MapPinOff, MapPin, Plus, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import MatchCard from '../components/MatchCard';
import DateSelector from '../components/DateSelector';
import GamesMap from '../components/GamesMap';
import './GamesFeed.css';

export default function GamesFeed({ matches, currentUser, isPinkMode }) {
  const [selectedDate, setSelectedDate] = useState(null); // null means 'All Dates'
  const [sportFilter, setSportFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState('Any');
  const [timeFilter, setTimeFilter] = useState('Any');
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [friendsOnly, setFriendsOnly] = useState(false);
  const [followingIds, setFollowingIds] = useState([]);

  useEffect(() => {
    if (currentUser) {
      fetch(`http://localhost:8081/api/users/${currentUser.id}/following`)
        .then(res => res.json())
        .then(data => setFollowingIds(data.map(u => u.id)))
        .catch(err => console.error("Error fetching following:", err));
    }
  }, [currentUser]);

  const filteredMatches = useMemo(() => {
    return matches.filter(match => {
      // 0. Hide past matches
      if (match.date) {
        const matchDate = new Date(match.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (matchDate < today) return false;
      }

      // 1. Date Filter
      if (selectedDate && match.date !== selectedDate) return false;
      
      // Pink Mode Enforcement
      const matchGender = match.gender || 'Mixed';
      if (isPinkMode && matchGender !== 'Women Only') return false;

      // 2. Sport Filter
      const matchSport = match.sport || 'Football';
      if (sportFilter !== 'All' && matchSport !== sportFilter) return false;

      // 3. Gender Filter
      if (!isPinkMode && genderFilter !== 'Any' && matchGender !== genderFilter) return false;

      // 4. Time Filter
      if (timeFilter !== 'Any') {
        if (!match.time) return false;
        const hour = parseInt(match.time.split(':')[0], 10);
        if (timeFilter === 'Morning' && hour >= 12) return false;
        if (timeFilter === 'Afternoon' && (hour < 12 || hour >= 17)) return false;
        if (timeFilter === 'Evening' && hour < 17) return false;
      }

      // 5. Location Search Filter
      if (locationSearch.trim() !== '') {
        const query = locationSearch.toLowerCase();
        const loc = match.location?.toLowerCase() || '';
        const title = match.title?.toLowerCase() || '';
        if (!loc.includes(query) && !title.includes(query)) return false;
      }

      // 6. Friends Only Filter
      if (friendsOnly && currentUser) {
        const isHostFriend = followingIds.includes(match.host?.id);
        const isPlayerFriend = match.currentPlayers?.some(p => followingIds.includes(p.id));
        if (!isHostFriend && !isPlayerFriend) return false;
      }

      return true;
    });
  }, [matches, selectedDate, sportFilter, genderFilter, timeFilter, locationSearch, friendsOnly, followingIds, currentUser, isPinkMode]);

  return (
    <div className="games-feed-page">
      <header className="games-feed-header" style={{ padding: '1rem 0', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
        <div className="container games-feed-header-inner">
          
          <div className="location-search-bar">
            <MapPin size={18} className="text-muted" style={{ marginRight: '0.5rem', flexShrink: 0 }} />
            <input 
              type="text" 
              placeholder="Nearby Bangalore, IN..." 
              value={locationSearch}
              onChange={e => setLocationSearch(e.target.value)}
              className="location-search-input"
            />
          </div>

          <div className="games-feed-actions">
            <button 
              onClick={() => setIsMapVisible(!isMapVisible)} 
              className={`btn-secondary map-toggle-btn ${isMapVisible ? 'active' : ''}`}
            >
              {isMapVisible ? <MapPinOff size={16} /> : <Map size={16} />}
              {isMapVisible ? 'Hide map' : 'Show map'}
            </button>
            <Link to="/create" className="new-game-link">
              <button className="btn-primary new-game-btn">
                <Plus size={18} />
                New game
              </button>
            </Link>
          </div>
        </div>
      </header>

      <DateSelector selectedDate={selectedDate} onDateSelect={setSelectedDate} />

      <div className="filters-bar-wrapper">
        <div className="container filters-bar">
          <div className="sport-tabs">
            <button className={`sport-tab ${sportFilter === 'All' ? 'active' : ''}`} onClick={() => setSportFilter('All')}>All Sports</button>
            <button className={`sport-tab ${sportFilter === 'Football' ? 'active' : ''}`} onClick={() => setSportFilter('Football')}>Football</button>
            <button className={`sport-tab ${sportFilter === 'Cricket' ? 'active' : ''}`} onClick={() => setSportFilter('Cricket')}>Cricket</button>
            <button className={`sport-tab ${sportFilter === 'Others' ? 'active' : ''}`} onClick={() => setSportFilter('Others')}>Others</button>
          </div>
          
          <div className="dropdown-filters" style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {currentUser && (
              <button 
                className="btn-secondary"
                onClick={() => setFriendsOnly(!friendsOnly)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.5rem', 
                  padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)',
                  backgroundColor: friendsOnly ? 'rgba(34, 197, 94, 0.1)' : 'var(--color-surface)',
                  color: friendsOnly ? 'var(--color-primary)' : 'var(--color-text)',
                  border: friendsOnly ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                  fontWeight: 500, transition: 'all 0.2s', cursor: 'pointer'
                }}
              >
                <Users size={16} />
                {friendsOnly ? "Friends' Games" : "All Games"}
              </button>
            )}

            {!isPinkMode && (
              <select value={genderFilter} onChange={e => setGenderFilter(e.target.value)} className="filter-select">
                <option value="Any">Any Gender</option>
                <option value="Mixed">Mixed</option>
                <option value="Men Only">Men Only</option>
                <option value="Women Only">Women Only</option>
              </select>
            )}

            <select value={timeFilter} onChange={e => setTimeFilter(e.target.value)} className="filter-select">
              <option value="Any">Any Time</option>
              <option value="Morning">Morning (Before 12pm)</option>
              <option value="Afternoon">Afternoon (12pm - 5pm)</option>
              <option value="Evening">Evening (After 5pm)</option>
            </select>
          </div>
        </div>
      </div>

      {isMapVisible && (
        <div className="container mt-2 fade-in-up" style={{ maxWidth: '1200px' }}>
          <GamesMap matches={filteredMatches} height="350px" marginTop="0" borderRadius="var(--radius-lg)" />
        </div>
      )}

      <section className="container py-8" style={{ maxWidth: '900px' }}>
        <div className="feed-header mb-6 flex justify-between items-end">
          <h2 className="text-xl font-bold">
            {filteredMatches.length} {filteredMatches.length === 1 ? 'game' : 'games'} available
          </h2>
          <span className="text-muted text-sm">
            {selectedDate 
              ? new Date(selectedDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) 
              : 'All Upcoming Dates'}
          </span>
        </div>
        
        {filteredMatches.length > 0 ? (
          <div className="match-list">
            {filteredMatches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted bg-surface" style={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <p>No matches found matching your filters.</p>
            <p className="mt-2 text-sm">Try selecting another date or broadening your search.</p>
          </div>
        )}
      </section>
    </div>
  );
}
