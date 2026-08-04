import { api, unwrap } from '@/lib/api';
import type { User } from '@/types';

export const authService = {
  register: (payload: { name: string; email: string; password: string; password_confirmation: string; phone?: string; role?: string }) =>
    unwrap<{ user: User; token: string }>(api.post('/auth/register', payload)),
  login: (email: string, password: string) =>
    unwrap<{ user: User; token: string }>(api.post('/auth/login', { email, password })),
  logout: () => unwrap<null>(api.post('/auth/logout')),
  me: () => unwrap<User>(api.get('/auth/me')),
  google: (payload: { email: string; name?: string; sub?: string; picture?: string }) =>
    unwrap<{ user: User; token: string }>(api.post('/auth/google', payload)),
  sendOtp: (phone: string) =>
    unwrap<{ phone: string; dev_code?: string }>(api.post('/auth/otp/send', { phone })),
  verifyOtp: (phone: string, code: string) =>
    unwrap<{ user: User; token: string }>(api.post('/auth/otp/verify', { phone, code })),
  forgotPassword: (email: string) =>
    unwrap<{ status: string }>(api.post('/auth/forgot-password', { email })),
  resetPassword: (payload: { token: string; email: string; password: string; password_confirmation: string }) =>
    unwrap<{ status: string }>(api.post('/auth/reset-password', payload)),
};
