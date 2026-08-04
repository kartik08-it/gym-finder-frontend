'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { bookingService, paymentService } from '@/services/gym.service';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';
import toast from 'react-hot-toast';
import { CheckCircle2, ShieldCheck, Tag } from 'lucide-react';

export default function CheckoutPage() {
  const { planId } = useParams<{ planId: string }>();
  const router = useRouter();
  const { user } = useAuthStore();

  const [quote, setQuote] = useState<any>(null);
  const [plan, setPlan] = useState<any>(null);
  const [coupon, setCoupon] = useState('');
  const [applying, setApplying] = useState(false);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (!user) { toast.error('Please log in'); return router.push('/login'); }
    (async () => {
      try {
        const q = await bookingService.quote(Number(planId));
        setQuote(q);
        // fetch plan for display (we can grab via any gym… simpler: use quote)
        // For plan info we make a small trick: use quote data & unknown plan; skip full details.
        setPlan({ id: Number(planId), price: q.base_amount });
      } catch (e: any) {
        toast.error(e?.response?.data?.message || 'Unable to load plan');
        router.back();
      }
    })();
  }, [planId, router, user]);

  async function applyCoupon() {
    setApplying(true);
    try {
      const q = await bookingService.quote(Number(planId), coupon || undefined);
      setQuote(q);
      if (coupon) toast.success('Coupon applied');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Invalid coupon');
    } finally { setApplying(false); }
  }

  async function payNow() {
    setPlacing(true);
    try {
      const r: any = await bookingService.create(Number(planId), coupon || undefined);
      // DUMMY Razorpay: simulate a payment_id + signature and verify.
      const paymentId = 'pay_' + Math.random().toString(36).slice(2, 12).toUpperCase();
      const signature = 'sig_' + Math.random().toString(36).slice(2, 22);

      const verify = await paymentService.verify({
        razorpay_order_id: r.payment.gateway_order_id,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
        method: 'card',
      });

      toast.success('Payment successful!');
      router.push(`/payment-success?booking=${r.booking.booking_number}`);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Payment failed');
      router.push('/payment-failure');
    } finally { setPlacing(false); }
  }

  if (!quote) return <p className="text-center py-20 text-ink-muted">Loading checkout…</p>;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10" data-testid="checkout-page">
      <h1 className="font-display text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <Card className="p-6 md:col-span-2 space-y-6">
          <section>
            <h2 className="font-semibold mb-3 flex items-center gap-2"><Tag size={16}/>Apply coupon</h2>
            <div className="flex gap-2">
              <Input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                placeholder="Try WELCOME20 or FLAT200"
                data-testid="coupon-input"
              />
              <Button variant="outline" onClick={applyCoupon} disabled={applying} data-testid="apply-coupon-btn">
                {applying ? 'Applying…' : 'Apply'}
              </Button>
            </div>
          </section>

          <section className="text-sm space-y-2 pt-4 border-t">
            <div className="flex justify-between"><span>Base amount</span><span>{formatCurrency(quote.base_amount)}</span></div>
            {quote.discount_amount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span><span>− {formatCurrency(quote.discount_amount)}</span>
              </div>
            )}
            <div className="flex justify-between"><span>GST (18%)</span><span>{formatCurrency(quote.tax_amount)}</span></div>
            <div className="flex justify-between pt-3 border-t font-semibold text-lg">
              <span>Total payable</span><span data-testid="total-amount">{formatCurrency(quote.total_amount)}</span>
            </div>
          </section>

          <div className="text-xs text-ink-muted flex items-center gap-2 pt-2">
            <ShieldCheck size={14} className="text-emerald-500"/>
            Payments are processed via Razorpay (dummy test mode in this environment).
          </div>
        </Card>

        <Card className="p-6 h-fit space-y-4">
          <p className="text-sm text-ink-muted">You'll be charged today</p>
          <p className="font-display text-3xl font-bold">{formatCurrency(quote.total_amount)}</p>
          <Button className="w-full" onClick={payNow} disabled={placing} data-testid="pay-now-btn">
            {placing ? 'Processing…' : 'Pay & Confirm'}
          </Button>
          <p className="text-[11px] text-ink-muted flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-500"/>Instant confirmation & digital invoice</p>
        </Card>
      </div>
    </div>
  );
}
