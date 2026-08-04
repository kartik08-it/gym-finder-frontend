'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, Badge } from '@/components/ui/card';
import { Heart, MapPin, Star, Clock, Wifi } from 'lucide-react';
import type { Gym } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { favoriteService } from '@/services/gym.service';
import { useAuthStore } from '@/stores/auth.store';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function GymCard({ gym }: { gym: Gym }) {
  const { user } = useAuthStore();
  const [fav, setFav] = useState(false);

  async function toggleFav(e: React.MouseEvent) {
    e.preventDefault();
    if (!user) return toast.error('Please log in to save favorites');
    try {
      const r = await favoriteService.toggle(gym.id);
      setFav(r.favorited);
      toast.success(r.favorited ? 'Added to favorites' : 'Removed from favorites');
    } catch {
      toast.error('Something went wrong');
    }
  }

  const cover = gym.cover_image || gym.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200';

  return (
    <Link href={`/gyms/${gym.slug}`} data-testid={`gym-card-${gym.id}`}>
      <Card className="group hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
        <div className="relative h-52 overflow-hidden">
          <Image
            src={cover}
            alt={gym.name}
            fill
            sizes="(max-width:768px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <button
            onClick={toggleFav}
            data-testid={`favorite-toggle-${gym.id}`}
            className="absolute top-3 right-3 h-9 w-9 grid place-items-center rounded-full bg-white/90 backdrop-blur hover:bg-white transition"
            aria-label="Favorite"
          >
            <Heart size={18} className={fav ? 'fill-brand text-brand' : 'text-ink'} />
          </button>
          <div className="absolute top-3 left-3 flex gap-2">
            {gym.is_verified && <Badge className="bg-emerald-500/95 text-white">Verified</Badge>}
            {gym.is_24x7 && <Badge className="bg-black/70 text-white"><Clock size={12}/>24x7</Badge>}
            {gym.ladies_only && <Badge className="bg-pink-500/95 text-white">Ladies Only</Badge>}
          </div>
        </div>
        <div className="p-5 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-lg font-bold leading-tight">{gym.name}</h3>
              <p className="text-xs text-ink-muted flex items-center gap-1 mt-1">
                <MapPin size={12}/> {gym.area || gym.city?.name}
                {typeof gym.distance_km === 'number' && ` • ${gym.distance_km.toFixed(1)} km`}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-700 px-2 py-1 rounded-lg text-sm font-semibold">
              <Star size={14} fill="currentColor" />{gym.rating_avg.toFixed(1)}
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {(gym.amenities ?? []).slice(0, 3).map(a => (
              <span key={a.id} className="text-[11px] text-ink-muted bg-black/5 rounded-md px-2 py-0.5">{a.name}</span>
            ))}
          </div>
          <div className="flex items-end justify-between pt-2">
            <div>
              <p className="text-xs text-ink-muted">Starting from</p>
              <p className="font-bold text-lg">{formatCurrency(gym.starting_price)}<span className="text-xs text-ink-muted font-normal">/mo</span></p>
            </div>
            <span className="text-xs text-brand font-medium group-hover:underline">View details →</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
