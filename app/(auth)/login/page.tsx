'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dumbbell } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Minimum 8 characters'),
});
type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const {
    register, handleSubmit, formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    try {
      const r = await authService.login(values.email, values.password);
      setSession(r.user, r.token);
      toast.success(`Welcome back, ${r.user.name.split(' ')[0]}!`);
      const dest = r.user.role === 'admin' ? '/admin/dashboard' :
                   r.user.role === 'gym_owner' ? '/owner/dashboard' : '/';
      router.push(dest);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Login failed');
    }
  }

  async function googleDummy() {
    const r = await authService.google({
      email: 'demo.google@gymfinder.app', name: 'Demo Google User', sub: 'g_demo_1',
    });
    setSession(r.user, r.token);
    toast.success('Logged in via Google (dummy)');
    router.push('/');
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <Card className="p-8">
        <div className="flex items-center gap-2 mb-6">
          <Dumbbell className="text-brand" size={22} />
          <h1 className="font-display text-2xl font-bold">Welcome back</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" data-testid="login-form">
          <Input label="Email" placeholder="you@example.com" {...register('email')} error={errors.email?.message}/>
          <Input label="Password" type="password" placeholder="••••••••" {...register('password')} error={errors.password?.message}/>
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-xs text-brand hover:underline" data-testid="forgot-password-link">Forgot password?</Link>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting} data-testid="login-submit">
            {isSubmitting ? 'Logging in…' : 'Log in'}
          </Button>
        </form>

        <div className="flex items-center gap-3 my-6 text-xs text-ink-muted">
          <div className="flex-1 h-px bg-black/10" />OR<div className="flex-1 h-px bg-black/10" />
        </div>

        <Button variant="outline" className="w-full" onClick={googleDummy} data-testid="google-login-btn">
          Continue with Google (demo)
        </Button>

        <p className="text-center text-sm text-ink-muted mt-6">
          New here? <Link href="/register" className="text-brand font-medium hover:underline" data-testid="go-register">Create account</Link>
        </p>
      </Card>
    </div>
  );
}
