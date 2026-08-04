'use client';

import { useAuthStore } from '@/stores/auth.store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ProfilePage() {
  const { user } = useAuthStore();
  if (!user) return <p className="text-center py-20 text-ink-muted">Please log in.</p>;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="font-display text-3xl font-bold mb-8">Profile</h1>
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-brand/10 text-brand grid place-items-center font-bold text-2xl">
            {user.name[0]}
          </div>
          <div>
            <h2 className="font-semibold text-xl">{user.name}</h2>
            <p className="text-sm text-ink-muted">{user.email}</p>
            <p className="text-xs text-ink-muted mt-1">Role: <span className="uppercase font-medium">{user.role}</span></p>
          </div>
        </div>
        <div className="flex gap-3 pt-4">
          <Link href="/bookings"><Button variant="outline">My bookings</Button></Link>
          <Link href="/favorites"><Button variant="outline">Saved gyms</Button></Link>
        </div>
      </Card>
    </div>
  );
}
