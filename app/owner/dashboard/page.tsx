'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth.store';
import { Building2, Users, IndianRupee, Star } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default function OwnerDashboard() {
  const { user } = useAuthStore();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!user || (user.role !== 'gym_owner' && user.role !== 'admin')) return;
    api.get('/owner/dashboard').then(r => setData(r.data.data));
  }, [user]);

  if (!user || (user.role !== 'gym_owner' && user.role !== 'admin')) {
    return <p className="text-center py-20">Gym owner access only.</p>;
  }
  if (!data) return <p className="text-center py-20">Loading…</p>;

  const s = data.stats;
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Owner dashboard</h1>
          <p className="text-ink-muted mt-1">Welcome back, {user.name.split(' ')[0]}.</p>
        </div>
        <Link href="/owner/gyms/new"><Button data-testid="add-gym-btn">+ Add new gym</Button></Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard icon={Building2} label="My gyms" value={s.total_gyms}/>
        <StatCard icon={Users} label="Active members" value={s.active_members}/>
        <StatCard icon={IndianRupee} label="Total revenue" value={formatCurrency(s.revenue)}/>
        <StatCard icon={Star} label="Avg rating" value={s.avg_rating.toFixed(1)}/>
      </div>

      <h2 className="font-display text-2xl font-bold mb-4">My gyms</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {(data.my_gyms || []).map((g: any) => (
          <Card key={g.id} className="p-4">
            <p className="font-semibold">{g.name}</p>
            <p className="text-xs text-ink-muted">{g.address}</p>
            <div className="mt-3 flex gap-2">
              <Link href={`/gyms/${g.slug}`}><Button size="sm" variant="outline">View public</Button></Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: any) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 text-ink-muted text-xs uppercase font-semibold">
        <Icon size={14}/> {label}
      </div>
      <p className="mt-2 font-display text-2xl font-bold">{value}</p>
    </Card>
  );
}
