import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import GamesFeed from './pages/GamesFeed';
import MatchDetails from './pages/MatchDetails';
import MapPage from './pages/MapPage';
import HealthBenefits from './pages/HealthBenefits';
import CreateMatch from './pages/CreateMatch';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Help from './pages/Help';
import Profile from './pages/Profile';
import TeamsPage from './pages/TeamsPage';
import PlayersPage from './pages/PlayersPage';
import { API_URL } from './config';

function App() {
  const [matches, setMatches] = useState([]);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [isPinkMode, setIsPinkMode] = useState(() => localStorage.getItem('pinkMode') === 'true');
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser && savedUser !== 'undefined') {
        const parsedUser = JSON.parse(savedUser);
        // Only return if it's a valid user object with an ID
        if (parsedUser && parsedUser.id) {
          return parsedUser;
        }
      }
      return null;
    } catch (e) {
      console.error("Error parsing user from localStorage:", e);
      return null;
    }
  });
  const isAuthenticated = currentUser !== null;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-pink-mode', isPinkMode);
    localStorage.setItem('pinkMode', isPinkMode);
  }, [isPinkMode]);

  useEffect(() => {
    fetch(`${API_URL}/api/matches`)
      .then(res => res.json())
      .then(data => setMatches(data))
      .catch(err => console.error("Error fetching matches:", err));
  }, []);

  const addMatch = (newMatch) => {
    newMatch.id = 'm' + Math.floor(Math.random() * 10000);
    newMatch.host = { id: currentUser.id };
    fetch(`${API_URL}/api/matches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMatch)
    })
    .then(res => res.json())
    .then(data => setMatches([data, ...matches]))
    .catch(err => console.error("Error creating match:", err));
  };

  const joinMatch = (matchId, count = 1) => {
    if (!isAuthenticated) {
      alert("Please sign in to join a match.");
      return;
    }
    fetch(`${API_URL}/api/matches/${matchId}/join?userId=${currentUser.id}`, {
      method: 'POST'
    })
    .then(res => res.json())
    .then(updatedMatch => {
      setMatches(matches.map(m => m.id === matchId ? updatedMatch : m));
    })
    .catch(err => console.error("Error joining match:", err));
  };

  const login = (user) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentUser(user);
  };
  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };
  const updateUser = (updatedUser) => {
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
  };

  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar 
          isAuthenticated={isAuthenticated} 
          currentUser={currentUser} 
          onLogout={logout} 
          theme={theme}
          setTheme={setTheme}
          isPinkMode={isPinkMode}
          setIsPinkMode={setIsPinkMode}
        />
        <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to="/games" replace /> : <LandingPage isPinkMode={isPinkMode} setIsPinkMode={setIsPinkMode} />} />
            <Route path="/games" element={<GamesFeed matches={matches} currentUser={currentUser} isPinkMode={isPinkMode} />} />
            <Route path="/map" element={<MapPage matches={matches} />} />
            <Route path="/health" element={<HealthBenefits />} />
            <Route path="/help" element={<Help />} />
            <Route path="/match/:id" element={<MatchDetails matches={matches} joinMatch={joinMatch} isAuthenticated={isAuthenticated} currentUser={currentUser} />} />
            
            {/* Protected Route */}
            <Route path="/create" element={
              isAuthenticated ? <CreateMatch addMatch={addMatch} /> : <Navigate to="/signin" />
            } />
            <Route path="/teams" element={
              isAuthenticated ? <TeamsPage currentUser={currentUser} /> : <Navigate to="/signin" />
            } />
            <Route path="/players" element={
              isAuthenticated ? <PlayersPage currentUser={currentUser} updateUser={updateUser} /> : <Navigate to="/signin" />
            } />
            <Route path="/my-games" element={<Navigate to="/profile" replace />} />
            <Route path="/profile" element={
              isAuthenticated ? <Profile currentUser={currentUser} matches={matches} updateUser={updateUser} /> : <Navigate to="/signin" />
            } />
            
            {/* Auth Routes */}
            <Route path="/signin" element={<SignIn onLogin={login} />} />
            <Route path="/signup" element={<SignUp onLogin={login} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
