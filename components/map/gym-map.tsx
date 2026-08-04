'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import type { Gym } from '@/types';

// Leaflet requires window, so we dynamically import with SSR disabled.
const MapView = dynamic(() => import('./map-view-inner'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full grid place-items-center rounded-3xl bg-black/5 dark:bg-white/5 text-ink-muted">
      Loading map…
    </div>
  ),
});

interface Props {
  gyms: Gym[];
  center?: [number, number];
  zoom?: number;
  height?: number;
  onSelect?: (gym: Gym) => void;
}

export function GymMap(props: Props) {
  const [userLoc, setUserLoc] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLoc([pos.coords.latitude, pos.coords.longitude]),
      () => {},
      { enableHighAccuracy: true, timeout: 5000 },
    );
  }, []);

  return <MapView {...props} userLocation={userLoc ?? undefined} />;
}
