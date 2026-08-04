import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const api: AxiosInstance = axios.create({
  baseURL,
  withCredentials: false,
  headers: { Accept: 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? Cookies.get('gf_token') : null;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError<{ message?: string }>) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      Cookies.remove('gf_token');
    }
    return Promise.reject(err);
  },
);

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: unknown;
}

/**
 * Unwrap Laravel API envelope { success, message, data } -> data.
 * Accepts an AxiosResponse whose payload is ApiEnvelope<T>.
 */
export function unwrap<T>(p: Promise<AxiosResponse<ApiEnvelope<T>>>): Promise<T> {
  return p.then((r) => r.data.data);
}
