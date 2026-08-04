'use client';

import { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const schema = z.object({
  name: z.string().min(2, 'Enter your name'),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8, 'Minimum 8 characters'),
  password_confirmation: z.string(),
  role: z.enum(['customer', 'gym_owner']).default('customer'),
}).refine((d) => d.password === d.password_confirmation, {
  message: "Passwords don't match", path: ['password_confirmation'],
});
type FormValues = z.infer<typeof schema>;

function RegisterPageContent() {
  const router = useRouter();
  const params = useSearchParams();
  const initialRole = (params.get('role') as any) ?? 'customer';
  const setSession = useAuthStore((s) => s.setSession);
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { role: initialRole } });

  async function onSubmit(values: FormValues) {
    try {
      const r = await authService.register(values);
      setSession(r.user, r.token);
      toast.success('Account created!');
      router.push(values.role === 'gym_owner' ? '/owner/dashboard' : '/');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Registration failed');
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <Card className="p-8">
        <h1 className="font-display text-2xl font-bold mb-6">Create your account</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" data-testid="register-form">
          <Input label="Full name" {...register('name')} error={errors.name?.message}/>
          <Input label="Email" type="email" {...register('email')} error={errors.email?.message}/>
          <Input label="Phone (optional)" {...register('phone')} error={errors.phone?.message}/>
          <Input label="Password" type="password" {...register('password')} error={errors.password?.message}/>
          <Input label="Confirm password" type="password" {...register('password_confirmation')} error={errors.password_confirmation?.message}/>
          <div>
            <label className="mb-1.5 block text-sm font-medium">I am a</label>
            <select {...register('role')} className="w-full h-11 rounded-xl border border-black/10 px-3 text-sm bg-white" data-testid="register-role">
              <option value="customer">Customer looking for a gym</option>
              <option value="gym_owner">Gym owner (list my gym)</option>
            </select>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting} data-testid="register-submit">
            {isSubmitting ? 'Creating…' : 'Create account'}
          </Button>
        </form>
        <p className="text-center text-sm text-ink-muted mt-6">
          Already have an account? <Link href="/login" className="text-brand font-medium hover:underline">Log in</Link>
        </p>
      </Card>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-6 py-16 text-sm text-ink-muted">Loading registration…</div>}>
      <RegisterPageContent />
    </Suspense>
  );
}
