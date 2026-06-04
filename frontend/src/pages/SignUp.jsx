import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import './Auth.css';
import { API_URL } from '../config';

export default function SignUp({ onLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })
    .then(res => {
      if (!res.ok) throw new Error('Signup failed');
      return res.json();
    })
    .then(user => {
      onLogin(user);
      navigate('/games');
    })
    .catch(() => alert("Error creating account or email already exists!"));
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="text-3xl font-bold mb-2">Create an account</h1>
        <p className="text-muted mb-8">Join the community and start playing.</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Mercer" />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <Button type="submit" className="w-full mt-4">Sign Up</Button>
        </form>
        
        <p className="mt-6 text-center text-sm text-muted">
          Already have an account? <Link to="/signin" className="text-primary font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
