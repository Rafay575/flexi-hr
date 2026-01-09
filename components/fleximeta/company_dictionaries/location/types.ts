// ==================== LOCATION API TYPES ====================
export interface ApiLocation {
  id: number;
  country_id: number;
  state_id: number;
  city_id: number;
  location_type_id: number;
  name: string;
  location_code: string;
  address: string;
  timezone: string;
  is_virtual: number; // 1 for virtual, 0 for physical
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  active: boolean;
  country_name: string;
  state_name: string;
  city_name: string;
  location_type_name: string;
}

export interface ApiMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

// ==================== LOCATION FRONTEND TYPES ====================
export interface Location {
    country_id: number;
  state_id: number;
  city_id: number;
  location_type_id: number;
  id: string;
  location_code: string;
  name: string;
  address: string;
  timezone: string;
  country_name: string;
  state_name: string;
  city_name: string;
  location_type_name: string;
  is_virtual: boolean;
  active: boolean;
}

export interface LocationRow extends Location {
  sr: number;
}

export interface LocationsResponse {
  data: Location[];
  meta: ApiMeta;
}

// ==================== LOCATION FORM TYPES ====================
export interface LocationFormData {
  name: string;
  location_code: string;
  address: string;
  timezone: string;
  country_id: number | string;
  state_id: number | string;
  city_id: number | string;
  location_type_id: number | string;
  is_virtual: number | string;
  active: number | string;
}

// Timezone options
export const TIMEZONE_OPTIONS = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Asia/Kolkata", label: "India (IST)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST)" },
];
export interface Country {
  id: string;
  name: string;
  iso2: string;
}