// components/MapaImoveis.jsx
'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Home } from 'lucide-react';
import Link from 'next/link';

// Fix para ícones do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function MapaImoveis({ imoveis }) {
  const center = imoveis.length > 0
    ? [imoveis[0].coordenadas.lat, imoveis[0].coordenadas.lng]
    : [-25.9692, 32.5732]; // Beira por padrão

  return (
    <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
      />
      {imoveis.map((imovel) => (
        <Marker
          key={imovel._id}
          position={[imovel.coordenadas.lat, imovel.coordenadas.lng]}
          icon={new Icon({
            iconUrl: 'data:image/svg+xml;base64,' + btoa(`
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="%233b82f6" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            `),
            iconSize: [32, 32],
            iconAnchor: [16, 32],
          })}
        >
          <Popup>
            <div className="text-center">
              <h3 className="font-bold text-sm">{imovel.titulo}</h3>
              <p className="text-xs text-gray-600">{imovel.bairro}</p>
              <p className="font-bold text-green-600 text-sm">
                {imovel.preco?.toLocaleString('pt-MZ')} MZN
              </p>
              <Link href={`/imovel/${imovel._id}`} className="text-blue-600 text-xs underline">
                Ver detalhes
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}