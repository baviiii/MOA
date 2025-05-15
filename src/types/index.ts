export interface DriverProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  license_number?: string;
  car_make?: string;
  car_model?: string;
  car_year?: number;
  car_color?: string;
  car_plate?: string;
  car_photo_url?: string;
  created_at: string;
  updated_at: string;
  is_verified: boolean;
  is_admin: boolean;
}

export interface PosterVerification {
  id: string;
  driver_id: string;
  image_url: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

export interface Trip {
  id: string;
  driver_id: string;
  start_location: string;
  start_image_url?: string;
  end_location: string;
  end_image_url?: string;
  midway_image_url?: string;
  distance_km: number;
  start_time: string;
  end_time: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthData {
  user: {
    id: string;
    email: string;
  } | null;
  isAdmin: boolean;
  isLoading: boolean;
}

export type UserRole = 'driver' | 'admin';
