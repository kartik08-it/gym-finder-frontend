export type UserRole = 'customer' | 'gym_owner' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  avatar_url?: string | null;
  status: 'active' | 'suspended' | 'pending';
  city_id?: number | null;
  email_verified_at?: string | null;
}

export interface Amenity {
  id: number; name: string; slug: string; icon?: string; category?: string;
}

export interface City {
  id: number; name: string; slug: string;
  latitude?: number; longitude?: number;
}

export interface GymPlan {
  id: number; gym_id: number; name: string;
  duration_type: string; duration_days: number;
  price: number; discount_price?: number | null;
  effective_price: number; features?: string[]; is_popular: boolean;
}

export interface GymImage { id: number; url: string; caption?: string | null; sort_order: number; }

export interface Gym {
  id: number; name: string; slug: string; description?: string;
  address: string; area?: string;
  city?: { id: number; name: string; slug: string };
  latitude: number; longitude: number;
  phone?: string; email?: string; website?: string; cover_image?: string;
  opening_time: string; closing_time: string;
  is_24x7: boolean; ladies_only: boolean;
  gender_preference: 'unisex' | 'male' | 'female';
  trainer_count: number; crowd_level: 'low' | 'medium' | 'high';
  starting_price: number;
  rating_avg: number; rating_count: number;
  is_verified: boolean; is_featured: boolean;
  status: string;
  distance_km?: number;
  amenities?: Amenity[];
  images?: GymImage[];
  plans?: GymPlan[];
}

export interface Booking {
  id: number; booking_number: string; status: string;
  starts_on: string; ends_on: string;
  base_amount: number; discount_amount: number; tax_amount: number; total_amount: number;
  gym?: { id: number; name: string; slug: string; cover_image?: string };
  plan?: GymPlan;
  payment?: { status: string; gateway: string; gateway_order_id: string };
}

export interface Review {
  id: number; rating: number; title?: string; comment?: string;
  likes_count: number; is_verified: boolean;
  owner_reply?: string; owner_replied_at?: string;
  user?: { id: number; name: string; avatar_url?: string };
  images?: string[]; created_at: string;
}

export interface Paginated<T> {
  items: T[];
  meta: { current_page: number; last_page: number; total: number; per_page?: number };
}
