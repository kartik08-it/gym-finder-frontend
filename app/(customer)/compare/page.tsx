'use client';

import { useState, useEffect } from 'react';
import { gymService } from '@/services/gym.service';
import { Card, Skeleton, Badge } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Star } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { Gym } from '@/types';

export default function ComparePage() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Gym[]>([]);
  const [selected, setSelected] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (q.length < 2) return setResults([]);
    setLoading(true);
    const t = setTimeout(() => {
      gymService.list({ q, per_page: 6 }).then((r: any) => setResults(r.items || [])).finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  function add(g: Gym) {
    if (selected.find(s => s.id === g.id)) return;
    if (selected.length >= 4) return;
    setSelected([...selected, g]);
  }
  function remove(id: number) { setSelected(selected.filter(s => s.id !== id)); }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="font-display text-3xl font-bold mb-2">Compare gyms</h1>
      <p className="text-ink-muted mb-8">Add up to 4 gyms side-by-side and pick the best fit for you.</p>

      <Card className="p-4 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Search size={16}/>
          <Input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search gyms to add…" data-testid="compare-search"/>
        </div>
        {loading && <Skeleton className="h-10"/>}
        {results.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {results.map(r => (
              <button key={r.id} onClick={()=>add(r)} className="text-sm px-3 py-1.5 rounded-full border hover:border-brand" data-testid={`add-gym-${r.id}`}>
                + {r.name}
              </button>
            ))}
          </div>
        )}
      </Card>

      {selected.length === 0 ? (
        <p className="text-center text-ink-muted py-20">Add gyms above to start comparing.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="text-left p-4 w-40">Feature</th>
                {selected.map(g => (
                  <th key={g.id} className="p-4 min-w-[200px] text-left">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold">{g.name}</p>
                        <p className="text-xs text-ink-muted">{g.city?.name}</p>
                      </div>
                      <button onClick={()=>remove(g.id)} className="text-ink-muted hover:text-red-500"><X size={16}/></button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="[&>tr>td]:border-t [&>tr>td]:border-black/5 [&>tr>td]:p-4 [&>tr>td]:align-top">
              <tr><td className="font-medium">Rating</td>
                {selected.map(g=><td key={g.id}><span className="inline-flex items-center gap-1"><Star size={14} className="text-emerald-500" fill="currentColor"/>{g.rating_avg.toFixed(1)} ({g.rating_count})</span></td>)}
              </tr>
              <tr><td className="font-medium">Starting price</td>
                {selected.map(g=><td key={g.id}><span className="font-bold">{formatCurrency(g.starting_price)}</span>/mo</td>)}
              </tr>
              <tr><td className="font-medium">24×7</td>
                {selected.map(g=><td key={g.id}>{g.is_24x7 ? '✓' : '—'}</td>)}
              </tr>
              <tr><td className="font-medium">Ladies only</td>
                {selected.map(g=><td key={g.id}>{g.ladies_only ? '✓' : '—'}</td>)}
              </tr>
              <tr><td className="font-medium">Trainers</td>
                {selected.map(g=><td key={g.id}>{g.trainer_count}</td>)}
              </tr>
              <tr><td className="font-medium">Amenities</td>
                {selected.map(g=><td key={g.id}>
                  <div className="flex flex-wrap gap-1">
                    {(g.amenities??[]).slice(0,6).map(a=><Badge key={a.id}>{a.name}</Badge>)}
                  </div>
                </td>)}
              </tr>
              <tr><td/>{selected.map(g=><td key={g.id}><a href={`/gyms/${g.slug}`} className="text-brand text-sm underline">View →</a></td>)}</tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
