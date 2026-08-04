import { api, unwrap } from '@/lib/api';
import type { Gym, Paginated, Review, Amenity, City } from '@/types';

export interface GymFilters {
  q?: string;
  city_id?: number;
  min_rating?: number;
  min_price?: number;
  max_price?: number;
  gender?: 'unisex' | 'male' | 'female';
  ladies_only?: boolean;
  is_24x7?: boolean;
  verified?: boolean;
  open_now?: boolean;
  amenity_ids?: number[];
  lat?: number;
  lng?: number;
  radius?: number;
  sort?: 'rating' | 'price_asc' | 'price_desc' | 'newest';
  per_page?: number;
  page?: number;
}

export interface QuoteResponse {
  base_amount: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  coupon_id?: number | null;
}

export const gymService = {
  list: (params: GymFilters) => unwrap<Paginated<Gym>>(api.get('/gyms', { params })),
  nearby: (lat: number, lng: number, radius = 10) =>
    unwrap<Gym[]>(api.get('/gyms/nearby', { params: { lat, lng, radius } })),
  show: (slug: string) => unwrap<Gym>(api.get(`/gyms/${slug}`)),
  compare: (ids: number[]) => unwrap<Gym[]>(api.post('/gyms/compare', { ids })),
  reviews: (gymId: number) => unwrap<Paginated<Review>>(api.get(`/gyms/${gymId}/reviews`)),
};

export const referenceService = {
  amenities: () => unwrap<Amenity[]>(api.get('/amenities')),
  cities: () => unwrap<City[]>(api.get('/cities')),
};

export const bookingService = {
  quote: (gym_plan_id: number, coupon_code?: string) =>
    unwrap<QuoteResponse>(api.post('/bookings/quote', { gym_plan_id, coupon_code })),
  create: (gym_plan_id: number, coupon_code?: string) =>
    unwrap<{ booking: any; payment: { gateway: string; gateway_order_id: string; amount: number; currency: string; key: string } }>(
      api.post('/bookings', { gym_plan_id, coupon_code }),
    ),
  list: () => unwrap<Paginated<any>>(api.get('/bookings')),
  show: (id: number) => unwrap<any>(api.get(`/bookings/${id}`)),
  cancel: (id: number, reason?: string) =>
    unwrap<any>(api.post(`/bookings/${id}/cancel`, { reason })),
};

export const paymentService = {
  verify: (payload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    method?: string;
  }) => unwrap<{ payment: { status: string }; booking: any }>(api.post('/payments/verify', payload)),
};

export const reviewService = {
  create: (payload: { gym_id: number; rating: number; title?: string; comment?: string; images?: string[] }) =>
    unwrap<Review>(api.post('/reviews', payload)),
  like: (id: number) => unwrap<{ likes_count: number }>(api.post(`/reviews/${id}/like`)),
};

export const favoriteService = {
  list: () => unwrap<Gym[]>(api.get('/favorites')),
  toggle: (gymId: number) => unwrap<{ favorited: boolean }>(api.post(`/favorites/${gymId}/toggle`)),
};
