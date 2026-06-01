import { Link } from 'react-router-dom';
import { Zap, MapPin, ShieldCheck, ChevronRight } from 'lucide-react';
import Button from '../components/Button';
import './LandingPage.css';

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Background ambient glow */}
      <div className="ambient-glow"></div>

      <section className="hero-section container">
        <div className="hero-content-left">
          <div className="hero-badge fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="live-dot"></span> Over 500 active games this week
          </div>
          <h1 className="hero-heading fade-in-up" style={{ animationDelay: '0.2s' }}>
            The smartest way to play <span className="text-primary glow-text">local sports.</span>
          </h1>
          <p className="hero-description fade-in-up" style={{ animationDelay: '0.3s' }}>
            Stop chasing players for cash or dealing with dropouts. Join competitive and casual football or cricket matches instantly.
          </p>
          <div className="hero-cta fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Link to="/games">
              <Button className="cta-button primary">
                Find a Game <ChevronRight size={18} className="ml-1" />
              </Button>
            </Link>
            <Link to="/create">
              <Button className="cta-button outline">Organize a Match</Button>
            </Link>
          </div>
          
          <div className="hero-stats fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="stat-item">
              <span className="stat-number">10k+</span>
              <span className="stat-label">Players</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Venues</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">4.9/5</span>
              <span className="stat-label">App Rating</span>
            </div>
          </div>
        </div>
        
        <div className="hero-content-right fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="hero-visual-card">
            <div className="visual-card-header">
              <span className="badge">TONIGHT, 19:00</span>
            </div>
            <div className="visual-card-body">
              <h3>7v7 Powerleague</h3>
              <p>Shoreditch, London</p>
              <div className="visual-players">
                <div className="avatars-stack">
                  <div className="avatar mock-a1"></div>
                  <div className="avatar mock-a2"></div>
                  <div className="avatar mock-a3"></div>
                  <div className="avatar mock-more">+9</div>
                </div>
                <span>2 spots left!</span>
              </div>
              <button className="visual-btn">Join for ₹150</button>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section container">
        <div className="features-header text-center fade-in-up">
          <h2>Why Squadsync?</h2>
          <p>Everything you need to play the beautiful game, built right in.</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card glass-panel fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="feature-icon"><Zap size={28} /></div>
            <h3>Instant Booking</h3>
            <p>Secure your spot and pay digitally in seconds. No more bank transfers or cash on the pitch.</p>
          </div>
          <div className="feature-card glass-panel fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="feature-icon"><MapPin size={28} /></div>
            <h3>Premium Venues</h3>
            <p>From 5-a-side 3G astroturf to full 11v11 grass pitches, we partner with the best facilities.</p>
          </div>
          <div className="feature-card glass-panel fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="feature-icon"><ShieldCheck size={28} /></div>
            <h3>Reliable Players</h3>
            <p>Our reliability rating system ensures dropouts are penalized and games are always fully attended.</p>
          </div>
        </div>
      </section>

      <section className="bottom-cta-section">
        <div className="ambient-glow-bottom"></div>
        <div className="container relative z-10 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to hit the pitch?</h2>
          <p className="text-lg text-muted mb-8 max-w-2xl mx-auto">
            Join thousands of players already using Squadsync to find and organize their weekly games.
          </p>
          <div className="flex justify-center mt-2">
            <Link to="/signup">
              <Button className="cta-button primary">Create Free Account</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
