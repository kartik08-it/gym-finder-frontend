'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { gymService } from '@/services/gym.service';
import { GymCard } from '@/components/gym/gym-card';
import { FilterSidebar } from '@/components/filters/filter-sidebar';
import { GymMap } from '@/components/map/gym-map';
import { Skeleton } from '@/components/ui/card';
import { useFilterStore } from '@/stores/filter.store';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, LayoutGrid, Map as MapIcon } from 'lucide-react';

function SearchPageContent() {
  const params = useSearchParams();
  const { filters, set } = useFilterStore();
  const [view, setView] = useState<'grid' | 'map'>('grid');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);

  useEffect(() => {
    const q = params.get('q');
    const open_now = params.get('open_now');
    if (q) set({ q });
    if (open_now) set({ open_now: true });
  }, [params, set]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const { data, isLoading } = useQuery({
    queryKey: ['gyms', filters, page, perPage],
    queryFn: () => gymService.list({ ...filters, page, per_page: perPage }),
  });

  const items = (data as any)?.items ?? [];
  const meta = (data as any)?.meta;
  const currentPage = meta?.current_page ?? page;
  const lastPage = meta?.last_page ?? 1;
  const pageNumbers = Array.from({ length: lastPage }, (_, index) => index + 1).slice(
    Math.max(0, currentPage - 3),
    currentPage + 2,
  );

  function changePerPage(value: number) {
    setPerPage(value);
    setPage(1);
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-72 flex-shrink-0">
          <FilterSidebar />
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-3xl font-bold" data-testid="search-title">
                {filters.q ? `Results for "${filters.q}"` : 'Explore gyms'}
              </h1>
              <p className="text-ink-muted text-sm mt-1">
                {isLoading ? 'Searching…' : `${(data as any)?.meta?.total ?? items.length} results`}
              </p>
            </div>
            <div className="flex gap-2">
              <select
                value={filters.sort}
                onChange={(e) => set({ sort: e.target.value as any })}
                className="h-10 rounded-full border border-black/10 px-4 text-sm bg-white"
                data-testid="sort-select"
              >
                <option value="rating">Top rated</option>
                <option value="price_asc">Price: low → high</option>
                <option value="price_desc">Price: high → low</option>
                <option value="newest">Newest</option>
              </select>
              <div className="flex bg-black/5 rounded-full p-1">
                <button
                  onClick={() => setView('grid')}
                  className={`h-9 px-4 rounded-full text-sm flex items-center gap-1 ${view==='grid' ? 'bg-white shadow' : ''}`}
                  data-testid="view-grid">
                  <LayoutGrid size={14}/>Grid
                </button>
                <button
                  onClick={() => setView('map')}
                  className={`h-9 px-4 rounded-full text-sm flex items-center gap-1 ${view==='map' ? 'bg-white shadow' : ''}`}
                  data-testid="view-map">
                  <MapIcon size={14}/>Map
                </button>
              </div>
            </div>
          </div>

          {view === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" data-testid="gym-grid">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-80" />)
                : items.map((g: any) => <GymCard key={g.id} gym={g} />)}
              {!isLoading && items.length === 0 && (
                <p className="col-span-full text-center text-ink-muted py-20">No gyms found matching your filters.</p>
              )}
            </div>
          ) : (
            <GymMap gyms={items} height={640} />
          )}

          <div className="mt-8 flex flex-col gap-4 border-t border-black/5 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex items-center gap-2 text-sm text-ink-muted">
              Gyms per page
              <select
                value={perPage}
                onChange={(e) => changePerPage(Number(e.target.value))}
                className="h-9 rounded-full border border-black/10 bg-white px-3 text-sm text-ink"
                data-testid="per-page-select"
              >
                {[6, 12, 24, 48].map((size) => <option key={size} value={size}>{size}</option>)}
              </select>
            </label>

            {lastPage > 1 && (
              <nav className="flex items-center gap-1" aria-label="Gym results pagination">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage((current) => current - 1)}
                  disabled={currentPage <= 1 || isLoading}
                  aria-label="Previous page"
                  data-testid="previous-page"
                >
                  <ChevronLeft size={16} />
                </Button>
                {pageNumbers.map((pageNumber) => (
                  <Button
                    key={pageNumber}
                    variant={pageNumber === currentPage ? 'primary' : 'ghost'}
                    size="icon"
                    onClick={() => setPage(pageNumber)}
                    disabled={isLoading}
                    aria-label={`Page ${pageNumber}`}
                    aria-current={pageNumber === currentPage ? 'page' : undefined}
                    data-testid={`page-${pageNumber}`}
                  >
                    {pageNumber}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage((current) => current + 1)}
                  disabled={currentPage >= lastPage || isLoading}
                  aria-label="Next page"
                  data-testid="next-page"
                >
                  <ChevronRight size={16} />
                </Button>
              </nav>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-6 py-8 text-sm text-ink-muted">Loading search…</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
