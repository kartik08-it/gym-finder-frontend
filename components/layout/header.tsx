'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/components/ui/button';
import { Dumbbell, Heart, LayoutDashboard, LogIn, LogOut, MapPin, User } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export function Header() {
  const { user, clear } = useAuthStore();
  const router = useRouter();

  async function logout() {
    try {
      await authService.logout();
    } catch {}
    clear();
    toast.success('Logged out');
    router.push('/');
  }

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 dark:bg-ink/70 border-b border-black/5 dark:border-white/5">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold" data-testid="brand-home-link">
          <Dumbbell className="text-brand" size={26} />
          Gym<span className="text-brand">Finder</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link href="/search" className="hover:text-brand" data-testid="nav-search">Explore</Link>
          <Link href="/search?open_now=1" className="hover:text-brand">Open Now</Link>
          <Link href="/compare" className="hover:text-brand" data-testid="nav-compare">Compare</Link>
          <a href="#" className="hover:text-brand">List your gym</a>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link href="/admin/dashboard">
                  <Button variant="ghost" size="sm" data-testid="admin-dashboard-link"><LayoutDashboard size={16} />Admin</Button>
                </Link>
              )}
              {user.role === 'gym_owner' && (
                <Link href="/owner/dashboard">
                  <Button variant="ghost" size="sm" data-testid="owner-dashboard-link"><LayoutDashboard size={16} />Owner</Button>
                </Link>
              )}
              <Link href="/favorites" className="hidden sm:inline"><Button variant="ghost" size="icon" data-testid="favorites-link"><Heart size={18} /></Button></Link>
              <Link href="/bookings" className="hidden sm:inline"><Button variant="ghost" size="sm" data-testid="bookings-link">My Bookings</Button></Link>
              <Link href="/profile"><Button variant="outline" size="sm" data-testid="profile-link"><User size={16} />{user.name.split(' ')[0]}</Button></Link>
              <Button variant="ghost" size="icon" onClick={logout} data-testid="logout-btn"><LogOut size={18} /></Button>
            </>
          ) : (
            <>
              <Link href="/login"><Button variant="ghost" size="sm" data-testid="login-link"><LogIn size={16} />Login</Button></Link>
              <Link href="/register"><Button variant="primary" size="sm" data-testid="register-link">Sign up</Button></Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-black/5 dark:border-white/5 py-10 text-sm text-ink-muted">
      <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p>&copy; {new Date().getFullYear()} GymFinder. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-brand">Privacy</a>
          <a href="#" className="hover:text-brand">Terms</a>
          <a href="#" className="hover:text-brand flex items-center gap-1"><MapPin size={14}/> India</a>
        </div>
      </div>
    </footer>
  );
}
