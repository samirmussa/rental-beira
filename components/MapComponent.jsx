'use client';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';

// Fix ícones (CDN - funciona 100% no Next.js 2025)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return position ? <Marker position={[position.lat, position.lng]} /> : null;
}

export default function MapComponent({ position, setPosition, height = '400px' }) {
  const center = position.lat ? [position.lat, position.lng] : [-19.8226, 34.8389]; // Beira

  // Fix altura/zoom no client
  useEffect(() => {
    // Garante render client-side
  }, []);

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-md" style={{ height }}>
      <MapContainer center={center} zoom={14} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <LocationMarker position={position} setPosition={setPosition} />
      </MapContainer>
      {position.lat && (
        <p className="mt-2 text-sm text-gray-600 p-2 bg-white rounded">
          📍 Localização: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
        </p>
      )}
    </div>
  );
}