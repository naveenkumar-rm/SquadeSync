import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';
import L from 'leaflet';

// Fix for default leaflet icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function SearchField({ setPosition, onLocationSelect }) {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider: provider,
      style: 'bar',
      showMarker: false, 
      showPopup: false,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: false,
      searchLabel: 'Search for an address...'
    });

    map.addControl(searchControl);

    const handleSearch = (e) => {
      const latlng = { lat: e.location.y, lng: e.location.x };
      setPosition(latlng);
      if (onLocationSelect) {
        onLocationSelect(latlng.lat, latlng.lng, e.location.label);
      }
    };

    map.on('geosearch/showlocation', handleSearch);

    return () => {
      map.removeControl(searchControl);
      map.off('geosearch/showlocation', handleSearch);
    };
  }, [map, setPosition, onLocationSelect]);

  return null;
}

function MapUpdater({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 15);
    }
  }, [lat, lng, map]);
  return null;
}

function LocationMarker({ position, setPosition, onLocationSelect }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      if (onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

export default function LocationPicker({ onLocationSelect, lat, lng, defaultLocation = [20.5937, 78.9629] }) {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (lat && lng) {
      setPosition({ lat, lng });
    }
  }, [lat, lng]);

  return (
    <div style={{ height: '350px', width: '100%', position: 'relative', zIndex: 1 }}>
      <MapContainer center={defaultLocation} zoom={5} scrollWheelZoom={true} style={{ height: '100%', width: '100%', zIndex: 1 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater lat={lat} lng={lng} />
        <SearchField setPosition={setPosition} onLocationSelect={onLocationSelect} />
        <LocationMarker position={position} setPosition={setPosition} onLocationSelect={onLocationSelect} />
      </MapContainer>
      <div style={{ position: 'absolute', bottom: '10px', left: '10px', zIndex: 1000, backgroundColor: 'var(--color-surface)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.75rem', pointerEvents: 'none', boxShadow: 'var(--shadow-md)' }}>
        Click on the map or use the search bar to drop a pin
      </div>
    </div>
  );
}
