'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { gymService } from '@/services/gym.service';
import { GymMap } from '@/components/map/gym-map';
import { Card, Badge, Skeleton } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Clock, MapPin, Phone, Globe, Users, Heart, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';
import toast from 'react-hot-toast';
import { favoriteService } from '@/services/gym.service';
import { useState } from 'react';

export default function GymDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const [fav, setFav] = useState(false);

  const { data: gym, isLoading } = useQuery({
    queryKey: ['gym', slug],
    queryFn: () => gymService.show(slug),
  });

  const { data: reviewsResp } = useQuery({
    queryKey: ['gym-reviews', gym?.id],
    queryFn: () => gymService.reviews(gym!.id),
    enabled: !!gym?.id,
  });

  if (isLoading) return <div className="mx-auto max-w-7xl px-6 py-8"><Skeleton className="h-96" /></div>;
  if (!gym) return <p className="p-10 text-center">Gym not found.</p>;

  const cover = gym.cover_image || gym.images?.[0]?.url || '';

  async function bookPlan(planId: number) {
    if (!user) { toast.error('Please log in to book'); return router.push('/login'); }
    router.push(`/checkout/${planId}`);
  }

  async function toggleFav() {
    if (!user) return toast.error('Please log in');
    const r = await favoriteService.toggle(gym!.id);
    setFav(r.favorited);
    toast.success(r.favorited ? 'Saved to favorites' : 'Removed');
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8" data-testid="gym-detail-page">
      {/* Hero */}
      <div className="grid md:grid-cols-4 gap-3 mb-8">
        <div className="md:col-span-2 relative h-[420px] rounded-3xl overflow-hidden">
          <Image src={cover} alt={gym.name} fill className="object-cover" />
        </div>
        <div className="grid grid-cols-2 md:col-span-2 gap-3">
          {(gym.images ?? []).slice(1, 5).map(img => (
            <div key={img.id} className="relative h-[204px] rounded-2xl overflow-hidden">
              <Image src={img.url} alt="" fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {gym.is_verified && <Badge className="bg-emerald-500/95 text-white"><CheckCircle2 size={12}/>Verified</Badge>}
                  {gym.is_24x7 && <Badge className="bg-black/80 text-white"><Clock size={12}/>24×7</Badge>}
                  {gym.ladies_only && <Badge className="bg-pink-500/95 text-white">Ladies Only</Badge>}
                </div>
                <h1 className="font-display text-4xl font-bold" data-testid="gym-name">{gym.name}</h1>
                <p className="mt-2 text-ink-muted flex items-center gap-1"><MapPin size={14}/> {gym.address}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-700 px-3 py-1.5 rounded-lg text-lg font-bold">
                  <Star size={16} fill="currentColor"/>{gym.rating_avg.toFixed(1)}
                </div>
                <p className="text-xs text-ink-muted">{gym.rating_count} reviews</p>
                <Button variant="outline" size="sm" onClick={toggleFav} data-testid="fav-btn">
                  <Heart size={14} className={fav ? 'fill-brand text-brand':''}/>Save
                </Button>
              </div>
            </div>
            <p className="mt-6 text-ink-muted leading-relaxed">{gym.description}</p>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">What this gym offers</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(gym.amenities ?? []).map(a => (
                <div key={a.id} className="flex items-center gap-2 p-3 rounded-xl bg-black/5">
                  <CheckCircle2 size={16} className="text-brand"/>{a.name}
                </div>
              ))}
            </div>
          </div>

          {/* Hours */}
          <Card className="p-6">
            <h2 className="font-display text-2xl font-bold mb-3">Hours & contact</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2"><Clock size={14}/> {gym.is_24x7 ? 'Open 24 hours' : `${gym.opening_time} – ${gym.closing_time}`}</div>
              <div className="flex items-center gap-2"><Users size={14}/> {gym.trainer_count} trainers • crowd: {gym.crowd_level}</div>
              {gym.phone && <a href={`tel:${gym.phone}`} className="flex items-center gap-2 hover:text-brand"><Phone size={14}/> {gym.phone}</a>}
              {gym.website && <a href={gym.website} target="_blank" className="flex items-center gap-2 hover:text-brand"><Globe size={14}/> Website</a>}
            </div>
          </Card>

          {/* Map */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">Location</h2>
            <GymMap gyms={[gym]} center={[gym.latitude, gym.longitude]} zoom={14} height={360}/>
          </div>

          {/* Reviews */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-2xl font-bold">Reviews</h2>
              <p className="text-sm text-ink-muted">{gym.rating_count} verified reviews</p>
            </div>
            <div className="space-y-4">
              {(reviewsResp as any)?.items?.length ? (
                (reviewsResp as any).items.map((r: any) => (
                  <Card key={r.id} className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{r.user?.name}</div>
                      <div className="flex items-center gap-1 text-emerald-700"><Star size={14} fill="currentColor"/>{r.rating}</div>
                    </div>
                    {r.title && <p className="font-semibold">{r.title}</p>}
                    <p className="text-sm text-ink-muted mt-1">{r.comment}</p>
                    {r.owner_reply && (
                      <div className="mt-3 border-l-2 border-brand pl-3 text-sm">
                        <span className="font-semibold text-brand">Owner reply:</span> {r.owner_reply}
                      </div>
                    )}
                  </Card>
                ))
              ) : (
                <p className="text-ink-muted">Be the first to review this gym after your first visit.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sticky plans sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="p-6" data-testid="plans-panel">
            <p className="text-sm text-ink-muted">Starting from</p>
            <p className="font-display text-3xl font-bold">{formatCurrency(gym.starting_price)}<span className="text-sm text-ink-muted font-normal">/mo</span></p>
            <div className="mt-5 space-y-3">
              {(gym.plans ?? []).map(p => (
                <div key={p.id} className="p-4 rounded-2xl border border-black/10 hover:border-brand transition group">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{p.name}</p>
                        {p.is_popular && <Badge className="bg-brand text-white">Popular</Badge>}
                      </div>
                      <p className="text-xs text-ink-muted mt-1">{p.duration_days} days</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(p.effective_price)}</p>
                      {p.discount_price && (
                        <p className="text-xs text-ink-muted line-through">{formatCurrency(p.price)}</p>
                      )}
                    </div>
                  </div>
                  <Button size="sm" className="w-full mt-3" onClick={() => bookPlan(p.id)} data-testid={`book-plan-${p.id}`}>
                    Book now
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
