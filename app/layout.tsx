import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { Footer, Header } from '@/components/layout/header';

export const metadata: Metadata = {
  title: 'GymFinder — Discover, Book & Manage Gym Memberships',
  description:
    'GymFinder is the fastest way to discover, compare and book gyms near you. Verified listings, real reviews, transparent pricing.',
  metadataBase: new URL('https://gymfinder.app'),
  openGraph: {
    title: 'GymFinder',
    description: 'The Goibibo of Gyms.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@500;700&family=Manrope:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <Header />
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
