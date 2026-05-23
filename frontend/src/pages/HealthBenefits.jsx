import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Brain, Users, Activity, Smile, Dumbbell } from 'lucide-react';
import Button from '../components/Button';
import './HealthBenefits.css';

export default function HealthBenefits() {
  const benefits = [
    {
      icon: <Heart size={32} />,
      title: "Cardiovascular Health",
      description: "A typical 5-a-side match involves constant movement, sprinting, and jogging. This HIIT-style workout significantly improves your heart health, lowers blood pressure, and boosts your resting metabolism."
    },
    {
      icon: <Brain size={32} />,
      title: "Mental Wellbeing",
      description: "Exercise releases endorphins, the body's natural mood lifters. Playing team sports also requires quick decision-making and spatial awareness, keeping your brain sharp and engaged."
    },
    {
      icon: <Smile size={32} />,
      title: "Stress Relief",
      description: "Stepping onto the pitch allows you to completely disconnect from work and daily worries. Focusing entirely on the game provides a powerful mental break and reduces cortisol levels."
    },
    {
      icon: <Dumbbell size={32} />,
      title: "Full Body Workout",
      description: "Football and cricket engage multiple muscle groups. You'll build core stability, improve leg strength, and enhance your overall agility and balance without the monotony of a treadmill."
    },
    {
      icon: <Users size={32} />,
      title: "Social Connection",
      description: "Team sports are inherently social. Regular matches are a fantastic way to meet new people, build lasting friendships, and foster a sense of community and belonging in your local area."
    },
    {
      icon: <Activity size={32} />,
      title: "Better Sleep",
      description: "The physical exhaustion and stress relief gained from a good match translate directly into deeper, more restorative sleep, allowing you to wake up feeling refreshed and energized."
    }
  ];

  return (
    <div className="health-page">
      <header className="health-hero">
        <div className="container">
          <div className="health-hero-content">
            <h1>More than just a game.</h1>
            <p>
              Playing local sports isn't just about scoring goals or hitting boundaries. 
              It's one of the most effective ways to improve your physical health, boost your mood, and connect with your community.
            </p>
          </div>
        </div>
      </header>

      <section className="container py-12">
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-card">
              <div className="benefit-icon">{benefit.icon}</div>
              <h3 className="benefit-title">{benefit.title}</h3>
              <p className="benefit-text">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="health-cta text-center py-12">
        <div className="container" style={{ maxWidth: '600px' }}>
          <h2 className="text-3xl font-bold mb-6">Experience the benefits yourself.</h2>
          <p className="text-muted mb-8 text-lg">
            Don't wait for a gym membership. Lace up your boots, join a local game today, and start feeling the difference immediately.
          </p>
          <Link to="/games">
            <Button variant="primary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>Find a Game Near You</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
