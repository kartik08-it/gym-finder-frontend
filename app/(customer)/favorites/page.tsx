'use client';

import { useQuery } from '@tanstack/react-query';
import { favoriteService } from '@/services/gym.service';
import { GymCard } from '@/components/gym/gym-card';
import { Card, Skeleton } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function FavoritesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => favoriteService.list(),
  });
  const items = data ?? [];

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="font-display text-3xl font-bold mb-8">Saved gyms</h1>
      {isLoading ? (
        <div className="grid md:grid-cols-3 gap-6">{Array.from({length:3}).map((_,i)=><Skeleton key={i} className="h-80"/>)}</div>
      ) : items.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-ink-muted">You haven't saved any gym yet.</p>
          <Link href="/search"><Button className="mt-6">Discover gyms</Button></Link>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((g: any) => <GymCard key={g.id} gym={g}/>)}
        </div>
      )}
    </div>
  );
}
