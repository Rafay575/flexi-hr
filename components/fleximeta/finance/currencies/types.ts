// ==================== CURRENCY API TYPES ====================
export interface ApiCurrency {
  id: number;
  iso_code: string;
  symbol: string;
  decimals: number;
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

// ==================== CURRENCY FRONTEND TYPES ====================
export interface Currency {
  id: string;
  iso_code: string;
  symbol: string;
  decimals: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CurrencyRow extends Currency {
  sr: number;
}

export interface CurrenciesResponse {
  data: Currency[];
  meta: ApiMeta;
}

// ==================== CURRENCY FORM TYPES ====================
export interface CurrencyFormData {
  iso_code: string;
  symbol: string;
  decimals: number | string;
  active: boolean;
}

// Common currency options
export const COMMON_CURRENCIES = [
  { iso_code: "USD", symbol: "$", name: "US Dollar", decimals: 2 },
  { iso_code: "EUR", symbol: "€", name: "Euro", decimals: 2 },
  { iso_code: "GBP", symbol: "£", name: "British Pound", decimals: 2 },
  { iso_code: "JPY", symbol: "¥", name: "Japanese Yen", decimals: 0 },
  { iso_code: "CAD", symbol: "C$", name: "Canadian Dollar", decimals: 2 },
  { iso_code: "AUD", symbol: "A$", name: "Australian Dollar", decimals: 2 },
  { iso_code: "CHF", symbol: "CHF", name: "Swiss Franc", decimals: 2 },
  { iso_code: "CNY", symbol: "¥", name: "Chinese Yuan", decimals: 2 },
  { iso_code: "INR", symbol: "₹", name: "Indian Rupee", decimals: 2 },
  { iso_code: "PKR", symbol: "Rs", name: "Pakistani Rupee", decimals: 2 },
  { iso_code: "AED", symbol: "د.إ", name: "UAE Dirham", decimals: 2 },
  { iso_code: "SAR", symbol: "﷼", name: "Saudi Riyal", decimals: 2 },
];

// Decimal places options
export const DECIMAL_OPTIONS = [
  { value: 0, label: "0 (No decimals)" },
  { value: 1, label: "1 decimal" },
  { value: 2, label: "2 decimals (Standard)" },
  { value: 3, label: "3 decimals" },
  { value: 4, label: "4 decimals" },
];

// Status options
export const STATUS_OPTIONS = [
  { value: true, label: "Active" },
  { value: false, label: "Inactive" },
];