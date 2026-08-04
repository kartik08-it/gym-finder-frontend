'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import type { Gym } from '@/types';
import Link from 'next/link';

// Fix default icon paths for Leaflet in Next.js
const gymIcon = new L.DivIcon({
  className: '!bg-transparent',
  html: `<div style="background:#FF385C;width:34px;height:34px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 4px 12px rgba(255,56,92,0.5);display:grid;place-items:center;">
    <span style="transform:rotate(45deg);color:white;font-size:16px;">🏋</span>
  </div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
});

const userIcon = new L.DivIcon({
  className: '!bg-transparent',
  html: `<div style="width:18px;height:18px;background:#3b82f6;border:3px solid white;border-radius:50%;box-shadow:0 0 0 4px rgba(59,130,246,0.3);"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function FlyTo({ position }: { position?: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 13, { duration: 1 });
  }, [position, map]);
  return null;
}

interface Props {
  gyms: Gym[];
  center?: [number, number];
  zoom?: number;
  height?: number;
  onSelect?: (gym: Gym) => void;
  userLocation?: [number, number];
}

export default function MapViewInner({
  gyms, center, zoom = 12, height = 500, onSelect, userLocation,
}: Props) {
  const initial: [number, number] = center ?? userLocation ?? (gyms[0]
    ? [gyms[0].latitude, gyms[0].longitude]
    : [19.076, 72.877]);

  return (
    <div className="rounded-3xl overflow-hidden shadow-card border border-black/5" style={{ height }}>
      <MapContainer center={initial} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url={process.env.NEXT_PUBLIC_TILE_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'}
          attribution={process.env.NEXT_PUBLIC_TILE_ATTRIBUTION || '&copy; OpenStreetMap contributors'}
        />

        {userLocation && (
          <>
            <Marker position={userLocation} icon={userIcon}>
              <Popup>You are here</Popup>
            </Marker>
            <FlyTo position={userLocation} />
          </>
        )}

        {gyms.map((g) => (
          <Marker
            key={g.id}
            position={[g.latitude, g.longitude]}
            icon={gymIcon}
            eventHandlers={{ click: () => onSelect?.(g) }}
          >
            <Popup>
              <div className="min-w-[180px]">
                <p className="font-semibold">{g.name}</p>
                <p className="text-xs opacity-75">⭐ {g.rating_avg.toFixed(1)} · ₹{g.starting_price}/mo</p>
                <Link href={`/gyms/${g.slug}`} className="text-brand text-xs underline mt-1 inline-block">
                  View details →
                </Link>
                <a
                  href={`https://www.openstreetmap.org/directions?to=${g.latitude},${g.longitude}`}
                  target="_blank" rel="noopener"
                  className="text-xs ml-2 text-blue-600 underline">
                  Directions
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
