'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { bookingService } from '@/services/gym.service';
import { Card, Badge, Skeleton } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function BookingsPage() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => bookingService.list(),
  });

  async function cancel(id: number) {
    if (!confirm('Cancel this booking?')) return;
    await bookingService.cancel(id).then(() => {
      toast.success('Booking cancelled');
      refetch();
    }).catch(() => toast.error('Failed to cancel'));
  }

  const items = (data as any)?.items ?? [];

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="font-display text-3xl font-bold mb-8">My bookings</h1>

      {isLoading ? (
        <div className="space-y-4">{Array.from({length:3}).map((_,i)=><Skeleton key={i} className="h-32"/>)}</div>
      ) : items.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-ink-muted">You haven't booked any gym yet.</p>
          <Link href="/search"><Button className="mt-6">Explore gyms</Button></Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((b: any) => (
            <Card key={b.id} className="p-5 flex items-center justify-between gap-6" data-testid={`booking-${b.id}`}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{b.gym?.name}</h3>
                  <Badge className={
                    b.status === 'confirmed' || b.status === 'active' ? 'bg-emerald-500 text-white'
                    : b.status === 'cancelled' ? 'bg-red-500 text-white'
                    : 'bg-amber-500 text-white'
                  }>{b.status}</Badge>
                </div>
                <p className="text-xs text-ink-muted">
                  {b.plan?.name} • {b.starts_on} → {b.ends_on}
                </p>
                <p className="text-xs text-ink-muted mt-1">Ref: <span className="font-mono">{b.booking_number}</span></p>
              </div>
              <div className="text-right">
                <p className="font-bold">{formatCurrency(b.total_amount)}</p>
                {['confirmed','pending_payment','active'].includes(b.status) && (
                  <Button variant="ghost" size="sm" onClick={() => cancel(b.id)} data-testid={`cancel-${b.id}`}>Cancel</Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
