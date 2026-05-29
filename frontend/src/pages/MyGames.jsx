import { useState, useMemo } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { CalendarX } from 'lucide-react';
import DreamMatchCard from '../components/DreamMatchCard';
import Button from '../components/Button';
import './MyGames.css';

export default function MyGames({ matches, isAuthenticated, currentUser }) {
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'live', 'completed'

  const { upcomingGames, liveGames, completedGames } = useMemo(() => {
    if (!isAuthenticated || !currentUser) {
      return { upcomingGames: [], liveGames: [], completedGames: [] };
    }
    const today = new Date();

    // Find all matches where current user is a player
    const userMatches = matches.filter(m => 
      m.currentPlayers?.some(p => p.id === currentUser.id || p.id.startsWith(currentUser.id + '_guest'))
    );

    // Sort by date (ascending) safely
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
  }, [matches, currentUser, isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  const getDisplayedMatches = () => {
    if (activeTab === 'upcoming') return upcomingGames;
    if (activeTab === 'live') return liveGames;
    if (activeTab === 'completed') return completedGames;
    return [];
  };

  const displayedMatches = getDisplayedMatches();

  return (
    <div className="container py-6 my-games-page" style={{ maxWidth: '600px' }}>
      <h1 className="text-2xl font-bold mb-6">My Matches</h1>
      
      <div className="dream-tabs">
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
          <div className="empty-state-card fade-in-up">
            <CalendarX size={48} className="empty-state-icon" strokeWidth={1.5} />
            <h3>No {activeTab} matches</h3>
            <p>You don't have any {activeTab} matches right now. Want to find one?</p>
            <Link to="/games">
              <Button variant="primary">Browse Local Games</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
