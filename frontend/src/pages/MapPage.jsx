import React from 'react';
import GamesMap from '../components/GamesMap';

export default function MapPage({ matches }) {
  return (
    <div className="map-page" style={{ height: 'calc(100vh - 72px)', width: '100%' }}>
      <GamesMap matches={matches} height="100%" marginTop="0" borderRadius="0" border="none" />
    </div>
  );
}
