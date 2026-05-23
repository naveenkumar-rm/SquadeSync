import React, { useState, useMemo } from 'react';
import { Map, MapPinOff, MapPin, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import MatchCard from '../components/MatchCard';
import DateSelector from '../components/DateSelector';
import GamesMap from '../components/GamesMap';
import './GamesFeed.css';

export default function GamesFeed({ matches }) {
  const [selectedDate, setSelectedDate] = useState(null); // null means 'All Dates'
  const [sportFilter, setSportFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState('Any');
  const [timeFilter, setTimeFilter] = useState('Any');
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');

  const filteredMatches = useMemo(() => {
    return matches.filter(match => {
      // 1. Date Filter
      if (selectedDate && match.date !== selectedDate) return false;
      
      // 2. Sport Filter
      const matchSport = match.sport || 'Football';
      if (sportFilter !== 'All' && matchSport !== sportFilter) return false;

      // 3. Gender Filter
      const matchGender = match.gender || 'Mixed';
      if (genderFilter !== 'Any' && matchGender !== genderFilter) return false;

      // 4. Time Filter
      if (timeFilter !== 'Any') {
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

      return true;
    });
  }, [matches, selectedDate, sportFilter, genderFilter, timeFilter, locationSearch]);

  return (
    <div className="games-feed-page">
      <header className="games-feed-header" style={{ padding: '1rem 0', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          
          <div className="location-search-bar" style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '0.6rem 1rem', flex: 1, maxWidth: '400px' }}>
            <MapPin size={18} className="text-muted" style={{ marginRight: '0.5rem' }} />
            <input 
              type="text" 
              placeholder="Nearby Bangalore, IN..." 
              value={locationSearch}
              onChange={e => setLocationSearch(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--color-text)', fontSize: '0.95rem', fontWeight: 500 }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button 
              onClick={() => setIsMapVisible(!isMapVisible)} 
              className="btn-secondary" 
              style={{ 
                display: 'flex', alignItems: 'center', gap: '0.5rem', 
                padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-md)',
                backgroundColor: isMapVisible ? 'var(--color-primary)' : 'var(--color-surface)',
                color: isMapVisible ? 'white' : 'var(--color-text)',
                border: isMapVisible ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                fontWeight: 600, transition: 'all 0.2s', cursor: 'pointer'
              }}
            >
              {isMapVisible ? <MapPinOff size={16} /> : <Map size={16} />}
              {isMapVisible ? 'Hide map' : 'Show map'}
            </button>
            <Link to="/create">
              <button 
                className="btn-primary" 
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.5rem', 
                  padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-primary)', color: 'white', border: 'none',
                  fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.2s'
                }}
              >
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
          </div>
          
          <div className="dropdown-filters">
            <select value={genderFilter} onChange={e => setGenderFilter(e.target.value)} className="filter-select">
              <option value="Any">Any Gender</option>
              <option value="Mixed">Mixed</option>
              <option value="Men Only">Men Only</option>
              <option value="Women Only">Women Only</option>
            </select>

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
