import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function BoundsFitter({ matches }) {
  const map = useMap();
  
  useEffect(() => {
    if (matches && matches.length > 0) {
      const validMatches = matches.filter(m => m.lat && m.lng);
      if (validMatches.length > 0) {
        const bounds = L.latLngBounds(validMatches.map(m => [m.lat, m.lng]));
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
        }
      }
    }
  }, [matches, map]);
  return null;
}

export default function GamesMap({ 
  matches, 
  height = '600px', 
  marginTop = '2rem', 
  borderRadius = 'var(--radius-lg)', 
  border = '1px solid var(--color-border)' 
}) {
  // Default center (Geographical center of India) if geolocation fails or before it loads
  const defaultCenter = [20.5937, 78.9629];

  return (
    <div style={{ height, width: '100%', position: 'relative', zIndex: 1, borderRadius, overflow: 'hidden', border, marginTop }}>
      <MapContainer center={defaultCenter} zoom={5} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <BoundsFitter matches={matches} />
        
        {matches.map(match => {
          if (!match.lat || !match.lng) return null;
          return (
            <Marker key={match.id} position={[match.lat, match.lng]}>
              <Popup>
                <div style={{ padding: '0.25rem', minWidth: '180px' }}>
                  <h3 className="font-bold" style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', color: '#111' }}>{match.title}</h3>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#666' }}>{match.time} • {match.sport}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="font-medium" style={{ color: '#111' }}>₹{match.price.toFixed(2)}</span>
                    <a href={`/match/${match.id}`} style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '0.4rem 0.75rem', borderRadius: '4px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>View</a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
