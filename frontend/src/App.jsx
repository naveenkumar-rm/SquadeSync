import React, { useState, useEffect } from 'react';
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
import MyGames from './pages/MyGames';
import ContactUs from './pages/ContactUs';
import Profile from './pages/Profile';

function App() {
  const [matches, setMatches] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const isAuthenticated = currentUser !== null;

  useEffect(() => {
    fetch('http://localhost:8081/api/matches')
      .then(res => res.json())
      .then(data => setMatches(data))
      .catch(err => console.error("Error fetching matches:", err));
  }, []);

  const addMatch = (newMatch) => {
    newMatch.id = 'm' + Math.floor(Math.random() * 10000);
    newMatch.host = currentUser;
    fetch('http://localhost:8081/api/matches', {
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
    fetch(`http://localhost:8081/api/matches/${matchId}/join?userId=${currentUser.id}`, {
      method: 'POST'
    })
    .then(res => res.json())
    .then(updatedMatch => {
      setMatches(matches.map(m => m.id === matchId ? updatedMatch : m));
    })
    .catch(err => console.error("Error joining match:", err));
  };

  const login = (user) => setCurrentUser(user);
  const logout = () => setCurrentUser(null);

  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar isAuthenticated={isAuthenticated} currentUser={currentUser} onLogout={logout} />
        <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/games" element={<GamesFeed matches={matches} />} />
            <Route path="/map" element={<MapPage matches={matches} />} />
            <Route path="/health" element={<HealthBenefits />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/match/:id" element={<MatchDetails matches={matches} joinMatch={joinMatch} isAuthenticated={isAuthenticated} />} />
            
            {/* Protected Route */}
            <Route path="/create" element={
              isAuthenticated ? <CreateMatch addMatch={addMatch} /> : <Navigate to="/signin" />
            } />
            <Route path="/my-games" element={
              isAuthenticated ? <MyGames matches={matches} currentUser={currentUser} isAuthenticated={isAuthenticated} /> : <Navigate to="/signin" />
            } />
            <Route path="/profile" element={
              isAuthenticated ? <Profile currentUser={currentUser} /> : <Navigate to="/signin" />
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
