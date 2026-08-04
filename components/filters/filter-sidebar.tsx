'use client';

import { useEffect, useState } from 'react';
import { referenceService } from '@/services/gym.service';
import type { Amenity, City } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFilterStore } from '@/stores/filter.store';
import { Star, Filter as FilterIcon } from 'lucide-react';

export function FilterSidebar() {
  const { filters, set, reset } = useFilterStore();
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    referenceService.amenities().then(setAmenities).catch(() => {});
    referenceService.cities().then(setCities).catch(() => {});
  }, []);

  const toggleAmenity = (id: number) => {
    const cur = filters.amenity_ids || [];
    set({ amenity_ids: cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id] });
  };

  return (
    <Card className="p-5 sticky top-20 max-h-[80vh] overflow-y-auto no-scrollbar" data-testid="filter-sidebar">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-lg flex items-center gap-2"><FilterIcon size={18}/>Filters</h3>
        <button onClick={reset} className="text-xs text-brand underline" data-testid="clear-filters">Clear all</button>
      </div>

      <section className="space-y-2 mb-6">
        <label className="text-xs uppercase text-ink-muted font-semibold">City</label>
        <select
          value={filters.city_id ?? ''}
          onChange={(e) => set({ city_id: e.target.value ? Number(e.target.value) : undefined })}
          className="w-full h-10 rounded-xl border border-black/10 px-3 text-sm bg-white"
          data-testid="filter-city"
        >
          <option value="">All cities</option>
          {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </section>

      <section className="space-y-2 mb-6">
        <label className="text-xs uppercase text-ink-muted font-semibold">Min rating</label>
        <div className="flex gap-1">
          {[3, 4, 4.5].map(v => (
            <button
              key={v}
              onClick={() => set({ min_rating: filters.min_rating === v ? undefined : v })}
              className={`flex-1 h-9 rounded-lg border text-xs flex items-center justify-center gap-1 ${
                filters.min_rating === v ? 'bg-brand text-white border-brand' : 'border-black/10 hover:bg-black/5'
              }`}
              data-testid={`filter-rating-${v}`}
            >
              <Star size={12} fill="currentColor" />{v}+
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-2 mb-6">
        <label className="text-xs uppercase text-ink-muted font-semibold">Price / month</label>
        <div className="flex items-center gap-2">
          <input
            type="number" placeholder="Min" value={filters.min_price ?? ''}
            onChange={(e) => set({ min_price: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full h-10 rounded-xl border border-black/10 px-3 text-sm"
            data-testid="filter-min-price"
          />
          <input
            type="number" placeholder="Max" value={filters.max_price ?? ''}
            onChange={(e) => set({ max_price: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full h-10 rounded-xl border border-black/10 px-3 text-sm"
            data-testid="filter-max-price"
          />
        </div>
      </section>

      <section className="space-y-2 mb-6">
        <label className="text-xs uppercase text-ink-muted font-semibold">Quick filters</label>
        {[
          { key: 'is_24x7', label: '24×7 Open' },
          { key: 'ladies_only', label: 'Ladies Only' },
          { key: 'verified', label: 'Verified' },
          { key: 'open_now', label: 'Open Now' },
        ].map(f => (
          <label key={f.key} className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={(filters as any)[f.key] === true}
              onChange={(e) => set({ [f.key]: e.target.checked || undefined } as any)}
              data-testid={`filter-${f.key}`}
            />
            {f.label}
          </label>
        ))}
      </section>

      <section className="space-y-2 mb-2">
        <label className="text-xs uppercase text-ink-muted font-semibold">Amenities</label>
        <div className="flex flex-wrap gap-1.5">
          {amenities.map(a => {
            const active = (filters.amenity_ids || []).includes(a.id);
            return (
              <button
                key={a.id}
                onClick={() => toggleAmenity(a.id)}
                className={`text-xs rounded-full px-3 py-1.5 border transition ${
                  active ? 'bg-ink text-white border-ink' : 'bg-white border-black/10 hover:border-brand'
                }`}
                data-testid={`amenity-chip-${a.slug}`}
              >
                {a.name}
              </button>
            );
          })}
        </div>
      </section>
    </Card>
  );
}
