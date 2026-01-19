// ==================== HOLIDAY API TYPES ====================
export interface ApiHoliday {
  id: number;
  country_id: number;
  state_id: number | null;
  year: number;
  name: string;
  date: string; // ISO string
  is_optional: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ApiMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

// ==================== HOLIDAY FRONTEND TYPES ====================
export interface Holiday {
  id: string;
  country_id: number;
  state_id: number | null;
  year: number;
  name: string;
  date: string;
  is_optional: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HolidayRow extends Holiday {
  sr: number;
  days_until?: number;
}

export interface HolidaysResponse {
  data: Holiday[];
  meta: ApiMeta;
}

// ==================== HOLIDAY FORM TYPES ====================
export interface HolidayFormData {
  country_id: number | string;
  state_id?: number | string | null;
  year: number | string;
  name: string;
  date: string;
  is_optional: boolean;
  active: boolean;
}

// ==================== COMMON HOLIDAYS ====================
export const COMMON_HOLIDAYS = [
  { name: "New Year's Day", month: 0, day: 1 },
  { name: "Eid ul-Fitr", type: "islamic", variable: true },
  { name: "Eid ul-Adha", type: "islamic", variable: true },
  { name: "Christmas Day", month: 11, day: 25 },
  { name: "Independence Day", month: 7, day: 14, country_id: 70 },
  { name: "Labor Day", month: 4, day: 1 },
  { name: "National Day", month: 2, day: 23 },
];

// ==================== COUNTRY OPTIONS ====================
export const COUNTRY_OPTIONS = [
  { id: 70, name: "Pakistan", code: "PK" },
  { id: 1, name: "United States", code: "US" },
  { id: 44, name: "United Kingdom", code: "GB" },
  { id: 14, name: "Australia", code: "AU" },
  { id: 48, name: "Canada", code: "CA" },
  { id: 33, name: "India", code: "IN" },
  { id: 37, name: "Saudi Arabia", code: "SA" },
  { id: 2, name: "United Arab Emirates", code: "AE" },
];

// ==================== STATE OPTIONS ====================
export const STATE_OPTIONS = [
  { id: 5, name: "Sindh", country_id: 70 },
  { id: 6, name: "Punjab", country_id: 70 },
  { id: 7, name: "Khyber Pakhtunkhwa", country_id: 70 },
  { id: 8, name: "Balochistan", country_id: 70 },
  // Add more states as needed
];

// ==================== YEAR OPTIONS ====================
export const YEAR_OPTIONS = Array.from(
  { length: 11 },
  (_, i) => new Date().getFullYear() - 5 + i
);

// ==================== HOLIDAY TYPE OPTIONS ====================
export const HOLIDAY_TYPE_OPTIONS = [
  { value: false, label: "Mandatory (Office Closed)" },
  { value: true, label: "Optional (Office Open)" },
];

// ==================== STATUS OPTIONS ====================
export const STATUS_OPTIONS = [
  { value: true, label: "Active" },
  { value: false, label: "Inactive" },
];