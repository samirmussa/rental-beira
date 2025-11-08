// components/ImovelMapClient.jsx
'use client';

import dynamic from 'next/dynamic';

const MapPin = dynamic(() => import('@/components/MapPin'), { ssr: false });

export default function ImovelMapClient({ lat, lng }) {
  return <MapPin lat={lat} lng={lng} />;
}