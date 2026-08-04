'use client';

import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PaymentFailurePage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center" data-testid="payment-failure">
      <Card className="p-10">
        <XCircle size={64} className="mx-auto text-red-500"/>
        <h1 className="font-display text-3xl font-bold mt-6">Payment failed</h1>
        <p className="text-ink-muted mt-3">Something went wrong. Don't worry, you weren't charged.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/search"><Button variant="outline">Back to browse</Button></Link>
          <Link href="/bookings"><Button>My bookings</Button></Link>
        </div>
      </Card>
    </div>
  );
}
