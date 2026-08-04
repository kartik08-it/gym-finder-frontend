'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function PaymentSuccessPageContent() {
  const params = useSearchParams();
  const bookingNumber = params.get('booking');

  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center" data-testid="payment-success">
      <Card className="p-10">
        <CheckCircle2 size={64} className="mx-auto text-emerald-500"/>
        <h1 className="font-display text-3xl font-bold mt-6">Payment successful!</h1>
        <p className="text-ink-muted mt-3">Your membership has been activated. A confirmation email is on the way.</p>
        {bookingNumber && (
          <p className="mt-6 text-sm">
            Booking ID: <span className="font-mono font-semibold">{bookingNumber}</span>
          </p>
        )}
        <div className="mt-8 flex justify-center gap-3 flex-wrap">
          <Link href="/bookings"><Button data-testid="view-bookings">View my bookings</Button></Link>
          <Button variant="outline"><Download size={16}/>Download invoice</Button>
        </div>
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-2xl px-6 py-20 text-center text-sm text-ink-muted">Loading confirmation…</div>}>
      <PaymentSuccessPageContent />
    </Suspense>
  );
}
