'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, MapPin, Sparkles, ArrowRight, Star, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { gymService } from '@/services/gym.service';
import type { Gym } from '@/types';
import { GymCard } from '@/components/gym/gym-card';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [featured, setFeatured] = useState<Gym[]>([]);
  const [q, setQ] = useState('');
  const router = useRouter();

  useEffect(() => {
    gymService.list({ per_page: 6, sort: 'rating' })
      .then((r: any) => setFeatured(r.items || []))
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-brand/10 via-transparent to-ink/5" />
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-brand/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-medium">
              <Sparkles size={14} className="text-brand" /> The Goibibo of Gyms
            </span>
            <h1 className="mt-6 font-display text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight">
              Find the perfect gym.<br />
              <span className="text-brand">In seconds.</span>
            </h1>
            <p className="mt-6 text-lg text-ink-muted max-w-xl">
              Discover verified gyms near you. Compare prices, amenities and real member reviews.
              Book instantly with transparent pricing — no surprises.
            </p>

            <form
              onSubmit={(e) => { e.preventDefault(); router.push(`/search?q=${encodeURIComponent(q)}`); }}
              className="mt-10 flex gap-2 max-w-2xl glass rounded-full p-2 shadow-glow"
              data-testid="hero-search-form"
            >
              <div className="flex items-center gap-2 flex-1 px-4">
                <Search className="text-ink-muted" size={18} />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search gyms, area, or city…"
                  className="w-full bg-transparent outline-none text-sm py-3"
                  data-testid="hero-search-input"
                />
              </div>
              <Button type="submit" size="md" data-testid="hero-search-submit">
                Search <ArrowRight size={16} />
              </Button>
            </form>

            <div className="mt-8 flex flex-wrap gap-6 text-sm text-ink-muted">
              <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-emerald-500"/> 100% verified</span>
              <span className="flex items-center gap-2"><Zap size={16} className="text-amber-500"/> Instant booking</span>
              <span className="flex items-center gap-2"><Star size={16} className="text-brand"/> Real member reviews</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-display text-4xl font-bold">Top rated near you</h2>
            <p className="text-ink-muted mt-2">Handpicked gyms with the highest member satisfaction.</p>
          </div>
          <Link href="/search"><Button variant="outline">View all →</Button></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((g) => <GymCard key={g.id} gym={g} />)}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="font-display text-4xl font-bold text-center">How GymFinder works</h2>
        <div className="grid md:grid-cols-3 gap-8 mt-14">
          {[
            { icon: Search, title: 'Discover', desc: 'Browse gyms with photos, real ratings and full transparency on pricing.' },
            { icon: MapPin, title: 'Compare', desc: 'Compare up to 4 gyms side-by-side and see them on a live map.' },
            { icon: Zap, title: 'Book instantly', desc: 'Choose a plan, apply coupons and pay securely in one flow.' },
          ].map((s, i) => (
            <Card key={i} className="p-8 text-center hover:-translate-y-1 transition">
              <div className="mx-auto h-14 w-14 grid place-items-center rounded-2xl bg-brand/10 text-brand">
                <s.icon size={26} />
              </div>
              <h3 className="mt-6 font-display text-2xl font-bold">{s.title}</h3>
              <p className="mt-3 text-ink-muted">{s.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* OWNER CTA */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <Card className="p-10 md:p-16 bg-gradient-to-br from-ink to-ink-soft text-white overflow-hidden relative">
          <div className="absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-brand/30 blur-3xl" />
          <div className="relative flex flex-col md:flex-row items-center gap-10 justify-between">
            <div className="max-w-xl">
              <h2 className="font-display text-4xl md:text-5xl font-bold">Own a gym? Grow with GymFinder.</h2>
              <p className="mt-4 text-white/70">Reach millions of fitness-first customers, manage memberships and payments in one place.</p>
            </div>
            <Link href="/register?role=gym_owner">
              <Button size="lg" data-testid="become-partner-btn">List your gym →</Button>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
