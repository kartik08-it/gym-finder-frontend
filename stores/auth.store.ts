import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  setSession: (user: User, token: string) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setSession: (user, token) => {
        Cookies.set('gf_token', token, { expires: 30, sameSite: 'lax' });
        set({ user, token });
      },
      clear: () => {
        Cookies.remove('gf_token');
        set({ user: null, token: null });
      },
    }),
    { name: 'gf-auth' },
  ),
);
