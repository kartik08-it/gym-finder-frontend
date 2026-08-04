'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/auth.service';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await authService.forgotPassword(email);
      setSent(true);
      toast.success('If the account exists, a reset link has been sent.');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed');
    }
  }
  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <Card className="p-8">
        <h1 className="font-display text-2xl font-bold mb-2">Forgot password?</h1>
        <p className="text-sm text-ink-muted mb-6">Enter your email and we'll send you a reset link.</p>
        <form onSubmit={submit} className="space-y-4">
          <Input label="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required data-testid="fp-email"/>
          <Button type="submit" className="w-full" disabled={sent} data-testid="fp-submit">
            {sent ? 'Reset link sent' : 'Send reset link'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
