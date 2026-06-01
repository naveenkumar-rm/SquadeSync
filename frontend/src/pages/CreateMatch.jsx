import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LocateFixed } from 'lucide-react';
import Button from '../components/Button';
import LocationPicker from '../components/LocationPicker';
import './CreateMatch.css';

export default function CreateMatch({ addMatch }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    sport: 'Football',
    gender: 'Mixed',
    location: '',
    address: '',
    date: '',
    time: '',
    price: '',
    maxPlayers: '',
    lat: null,
    lng: null
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleAutoDetect = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }));
          
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
            .then(res => res.json())
            .then(data => {
              if (data && data.display_name) {
                setFormData(prev => ({
                  ...prev,
                  address: data.display_name
                }));
              }
            })
            .catch(console.error);
        },
        (error) => {
          alert("Could not detect location. Please ensure location permissions are granted.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  useEffect(() => {
    // Combine venue name and address for a better search, or just use address
    const query = [formData.location, formData.address].filter(Boolean).join(', ');
    
    if (!query || query.length < 5) return;

    const timeoutId = setTimeout(() => {
      // Add countrycodes=in to restrict to India, improving accuracy for Squadsync
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&countrycodes=in`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            setFormData(prev => ({
              ...prev,
              lat: parseFloat(data[0].lat),
              lng: parseFloat(data[0].lon)
            }));
          } else {
            // Fallback: If combined query fails, try just the address
            if (formData.address && formData.address.length > 3) {
              fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.address)}&limit=1&countrycodes=in`)
                .then(res => res.json())
                .then(fallbackData => {
                  if (fallbackData && fallbackData.length > 0) {
                    setFormData(prev => ({
                      ...prev,
                      lat: parseFloat(fallbackData[0].lat),
                      lng: parseFloat(fallbackData[0].lon)
                    }));
                  }
                })
                .catch(err => console.error("Geocoding fallback error:", err));
            }
          }
        })
        .catch(err => console.error("Geocoding error:", err));
    }, 1200); // reduced timeout slightly for better responsiveness

    return () => clearTimeout(timeoutId);
  }, [formData.address, formData.location]);

  const handleLocationSelect = (lat, lng, addressLabel = null) => {
    const updates = { lat, lng };
    if (addressLabel) {
      updates.address = addressLabel;
    }
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.lat || !formData.lng) {
      alert("Please use the map to search and drop a pin for the exact venue location.");
      return;
    }

    const newMatch = {
      id: `m${Date.now()}`,
      ...formData,
      price: parseFloat(formData.price),
      maxPlayers: parseInt(formData.maxPlayers),
      duration: 60,
      pitchType: 'TBD',
      currentPlayers: [],
      host: { id: 'u1', name: 'Alex Mercer' },
      rules: 'Standard match rules apply. Be respectful.'
    };
    addMatch(newMatch);
    navigate('/');
  };

  return (
    <div className="container py-12 organize-page">
      <div className="organize-header">
        <h1>Organize a Match</h1>
        <p>Set up the details, pick a location, and invite players.</p>
      </div>

      <form onSubmit={handleSubmit} className="organize-form">
        
        <div className="form-section">
          <div className="form-section-title-wrapper">
            <h2 className="form-section-title">Match Details</h2>
          </div>
          
          <div className="form-grid-2">
            <div className="form-group">
              <label>Sport</label>
              <select required name="sport" value={formData.sport} onChange={handleChange} className="form-select">
                <option value="Football">Football</option>
                <option value="Cricket">Cricket</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div className="form-group">
              <label>Gender Restriction</label>
              <select required name="gender" value={formData.gender} onChange={handleChange} className="form-select">
                <option value="Mixed">Mixed (Everyone)</option>
                <option value="Men Only">Men Only</option>
                <option value="Women Only">Women Only</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Match Title</label>
            <input required name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Casual 7v7 Kickabout" />
          </div>
          
          <div className="form-grid-2">
            <div className="form-group">
              <label>Date</label>
              <input required type="date" name="date" value={formData.date} onChange={handleChange} onClick={(e) => e.target.showPicker && e.target.showPicker()} />
            </div>
            <div className="form-group">
              <label>Time</label>
              <input required type="time" name="time" value={formData.time} onChange={handleChange} onClick={(e) => e.target.showPicker && e.target.showPicker()} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-title-wrapper">
            <h2 className="form-section-title">Venue & Location</h2>
          </div>
          <div className="form-group">
            <label>Venue Name</label>
            <input required name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Powerleague Shoreditch" />
          </div>

          <div className="form-group">
            <label>Street Address</label>
            <input required name="address" value={formData.address} onChange={handleChange} placeholder="e.g. 123 Pitch St, London" />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ marginBottom: 0 }}>Pin Venue Location on Map</label>
              <button 
                type="button" 
                onClick={handleAutoDetect}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.25rem', 
                  background: 'none', border: 'none', color: 'var(--color-primary)', 
                  fontSize: '0.875rem', cursor: 'pointer', fontWeight: 500 
                }}
              >
                <LocateFixed size={16} /> Auto-detect
              </button>
            </div>
            <div className="map-picker-container">
              <LocationPicker lat={formData.lat} lng={formData.lng} onLocationSelect={handleLocationSelect} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-title-wrapper">
            <h2 className="form-section-title">Pricing & Capacity</h2>
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label>Price per Player (₹)</label>
              <input required type="number" step="0.5" name="price" value={formData.price} onChange={handleChange} placeholder="e.g. 5.50" />
            </div>
            <div className="form-group">
              <label>Total Players Needed</label>
              <input required type="number" name="maxPlayers" value={formData.maxPlayers} onChange={handleChange} placeholder="e.g. 14" />
            </div>
          </div>
        </div>

        <div className="submit-section">
          <Button type="submit" variant="primary" className="w-full" style={{ padding: '1.25rem', fontSize: '1.125rem' }}>List Match Now</Button>
        </div>

      </form>
    </div>
  );
}
