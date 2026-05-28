import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import './Auth.css';

export default function SignIn({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8081/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    .then(res => {
      if (!res.ok) throw new Error('Login failed');
      return res.json();
    })
    .then(user => {
      onLogin(user);
      navigate('/games');
    })
    .catch(err => alert("Invalid email or password!"));
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
        <p className="text-muted mb-8">Sign in to book matches and manage your games.</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <Button type="submit" className="w-full mt-4">Sign In</Button>
        </form>
        
        <p className="mt-6 text-center text-sm text-muted">
          Don't have an account? <Link to="/signup" className="text-primary font-medium">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
