// components/MapWithPins.jsx
'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PropertyCard from './PropertyCard';
import Link from 'next/link';

// Fix ícone do Leaflet
const customIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapWithPins({ imoveis }) {
  const center = imoveis.length > 0
    ? [imoveis[0].coordenadas.lat, imoveis[0].coordenadas.lng]
    : [-19.8226, 34.8389]; // Beira

  return (
    <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {imoveis.map((imovel) => (
        <Marker
          key={imovel._id}
          position={[imovel.coordenadas.lat, imovel.coordenadas.lng]}
          icon={customIcon}
        >
          <Popup>
            <div className="p-2 max-w-xs">
              <img
                src={imovel.imagens[0] || '/placeholder.jpg'}
                alt={imovel.titulo}
                className="w-full h-32 object-cover rounded mb-2"
              />
              <h3 className="font-bold">{imovel.titulo}</h3>
              <p className="text-sm text-gray-600">{imovel.bairro}</p>
              <p className="text-lg font-bold text-green-600">
                {imovel.preco.toLocaleString()} MZN
              </p>
              <Link href={`/imovel/${imovel._id}`}>
                <button className="mt-2 w-full bg-blue-600 text-white py-1 rounded text-sm">
                  Ver Detalhes
                </button>
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}