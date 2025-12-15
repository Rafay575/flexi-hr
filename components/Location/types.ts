export type LocationStatus = 'active' | 'inactive';

export interface Location {
  id: number;
  country_id: number;
  state_id: number;
  city_id: number;
  location_type_id: number;
  name: string;
  location_code: string;
  address: string;
  timezone: string;
  is_virtual: boolean;
  active: boolean;
  location_type_name: string;
  country_name: string;
  state_name: string;
  city_name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Add this interface for the mapped data (for table display)
// types.ts
// types.ts
export interface LocationForUI {
  id: number;
  name: string;
  location_code: string;
  address?: string;
  
  // These should already exist in your type
  location_type_name: string;
  country_name: string;
  state_name: string;
  city_name: string;
  
  // Add these missing ID fields
  location_type_id?: number;
  country_id?: number;
  state_id?: number;
  city_id?: number;
  
  // Other fields
  timezone?: string;
  is_virtual?: boolean;
  active: boolean;
  status: string;
  
  // Timestamps
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface LocationsApiResponse {
  data: Location[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}