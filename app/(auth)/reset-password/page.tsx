'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/auth.service';
import toast from 'react-hot-toast';

function ResetPasswordPageContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.resetPassword({
        token: params.get('token') ?? '',
        email: params.get('email') ?? '',
        password, password_confirmation: confirm,
      });
      toast.success('Password reset. Please log in.');
      router.push('/login');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed');
    } finally { setLoading(false); }
  }
  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <Card className="p-8">
        <h1 className="font-display text-2xl font-bold mb-6">Set a new password</h1>
        <form onSubmit={submit} className="space-y-4">
          <Input label="New password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
          <Input label="Confirm password" type="password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} required/>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Saving…' : 'Reset password'}</Button>
        </form>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-6 py-16 text-sm text-ink-muted">Loading reset form…</div>}>
      <ResetPasswordPageContent />
    </Suspense>
  );
}
