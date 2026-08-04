import { create } from 'zustand';
import type { GymFilters } from '@/services/gym.service';

interface FiltersState {
  filters: GymFilters;
  set: (patch: Partial<GymFilters>) => void;
  reset: () => void;
}

export const useFilterStore = create<FiltersState>((set) => ({
  filters: { sort: 'rating', per_page: 12 },
  set: (patch) => set((s) => ({ filters: { ...s.filters, ...patch } })),
  reset: () => set({ filters: { sort: 'rating', per_page: 12 } }),
}));
