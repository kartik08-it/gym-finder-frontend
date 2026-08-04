'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, Badge } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth.store';
import { CheckCircle2, XCircle, Users, Building2, IndianRupee, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [pending, setPending] = useState<any[]>([]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    load();
  }, [user]);

  async function load() {
    const s = await api.get('/admin/dashboard').then(r => r.data.data);
    setStats(s);
    const p = await api.get('/admin/gyms/pending').then(r => r.data.data);
    setPending(p.data || p);
  }

  async function approve(id: number) {
    await api.post(`/admin/gyms/${id}/approve`);
    toast.success('Gym approved'); load();
  }
  async function reject(id: number) {
    const reason = prompt('Reason for rejection?') || 'Not specified';
    await api.post(`/admin/gyms/${id}/reject`, { reason });
    toast.success('Gym rejected'); load();
  }

  if (!user || user.role !== 'admin') return <p className="text-center py-20">Admin access only.</p>;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="font-display text-3xl font-bold mb-8" data-testid="admin-dash-title">Admin dashboard</h1>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard icon={Users} label="Total users" value={stats.stats.total_users}/>
          <StatCard icon={Building2} label="Total gyms" value={stats.stats.total_gyms}/>
          <StatCard icon={TrendingUp} label="Pending approvals" value={stats.stats.pending_gyms}/>
          <StatCard icon={IndianRupee} label="Revenue" value={formatCurrency(stats.stats.revenue)}/>
        </div>
      )}

      <h2 className="font-display text-2xl font-bold mb-4">Gyms awaiting approval</h2>
      <div className="space-y-3">
        {pending.length === 0 && <p className="text-ink-muted">No gyms pending review.</p>}
        {pending.map((g: any) => (
          <Card key={g.id} className="p-4 flex items-center justify-between" data-testid={`pending-gym-${g.id}`}>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{g.name}</p>
                <Badge>{g.city?.name}</Badge>
              </div>
              <p className="text-xs text-ink-muted mt-1">{g.address}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => reject(g.id)} data-testid={`reject-${g.id}`}><XCircle size={14}/>Reject</Button>
              <Button size="sm" onClick={() => approve(g.id)} data-testid={`approve-${g.id}`}><CheckCircle2 size={14}/>Approve</Button>
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
