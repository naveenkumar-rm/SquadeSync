import React, { useState } from 'react';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../components/Button';
import './ContactUs.css';

export default function ContactUs() {
  const [status, setStatus] = useState('idle'); // 'idle', 'submitting', 'success', 'error'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendContactForm = (e) => {
    e.preventDefault();
    setStatus('submitting');

    fetch('http://localhost:8081/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => {
        if (!res.ok) throw new Error('Submission failed');
        return res.json();
      })
      .then(() => {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      })
      .catch(err => {
        console.error(err);
        setStatus('error');
      });
  };

  return (
    <div className="contact-page container py-12" style={{ maxWidth: '800px' }}>
      <div className="text-center mb-10 fade-in-up">
        <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
        <p className="text-muted text-lg max-w-2xl mx-auto">
          Have a question about PitchConnect, need help organizing a match, or want to report an issue? Drop us a message and our team will get back to you shortly.
        </p>
      </div>

      <div className="contact-card glass-panel fade-in-up" style={{ animationDelay: '0.2s' }}>
        {status === 'success' ? (
          <div className="success-state">
            <CheckCircle size={64} className="text-success mb-4" />
            <h2 className="text-2xl font-bold mb-2">Message Received!</h2>
            <p className="text-muted mb-6">Thank you for reaching out. We have saved your message and will get back to you within 24-48 hours.</p>
            <Button onClick={() => setStatus('idle')} variant="outline">Send Another Message</Button>
          </div>
        ) : (
          <form onSubmit={sendContactForm} className="contact-form">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" required />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
            </div>

            <div className="form-group">
              <label>Subject</label>
              <select name="subject" value={formData.subject} onChange={handleChange} required>
                <option value="" disabled>Select a subject</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Technical Support">Technical Support</option>
                <option value="Billing/Refunds">Billing & Refunds</option>
                <option value="Feedback">Feedback & Suggestions</option>
              </select>
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea name="message" value={formData.message} onChange={handleChange} rows="5" placeholder="How can we help you?" required></textarea>
            </div>

            {status === 'error' && (
              <div className="error-banner">
                <AlertCircle size={20} />
                <span>Failed to send the message. Please ensure the backend is running.</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full flex justify-center items-center gap-2 mt-4"
              style={{ fontSize: '1.1rem', padding: '0.75rem' }}
            >
              {status === 'submitting' ? 'Sending...' : 'Send Message'}
              <Send size={18} />
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
