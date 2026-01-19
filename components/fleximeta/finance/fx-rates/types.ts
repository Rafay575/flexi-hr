// ==================== FX RATE API TYPES ====================
export interface ApiFxRate {
  id: number;
  base_currency_id: number;
  quote_currency_id: number;
  rate: string;
  rate_date: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  base_currency: {
    id: number;
    iso_code: string;
    symbol?: string;
  };
  quote_currency: {
    id: number;
    iso_code: string;
    symbol?: string;
  };
}

export interface ApiMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

// ==================== FX RATE FRONTEND TYPES ====================
export interface FxRate {
  id: string;
  base_currency_id: number;
  quote_currency_id: number;
  rate: string;
  rate_date: string;
  base_currency: {
    id: number;
    iso_code: string;
    symbol?: string;
  };
  quote_currency: {
    id: number;
    iso_code: string;
    symbol?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface FxRateRow extends FxRate {
  sr: number;
}

export interface FxRatesResponse {
  data: FxRate[];
  meta: ApiMeta;
}

// ==================== FX RATE FORM TYPES ====================
export interface FxRateFormData {
  base_currency_id: number | string;
  quote_currency_id: number | string;
  rate: number | string;
  rate_date: string;
}

// ==================== COMMON CURRENCY PAIRS ====================
export const COMMON_CURRENCY_PAIRS = [
  { base: 'PKR', quote: 'USD', name: 'Pakistani Rupee to US Dollar' },
  { base: 'USD', quote: 'PKR', name: 'US Dollar to Pakistani Rupee' },
  { base: 'USD', quote: 'EUR', name: 'US Dollar to Euro' },
  { base: 'EUR', quote: 'USD', name: 'Euro to US Dollar' },
  { base: 'USD', quote: 'GBP', name: 'US Dollar to British Pound' },
  { base: 'GBP', quote: 'USD', name: 'British Pound to US Dollar' },
  { base: 'USD', quote: 'AED', name: 'US Dollar to UAE Dirham' },
  { base: 'AED', quote: 'USD', name: 'UAE Dirham to US Dollar' },
  { base: 'USD', quote: 'SAR', name: 'US Dollar to Saudi Riyal' },
  { base: 'SAR', quote: 'USD', name: 'Saudi Riyal to US Dollar' },
  { base: 'USD', quote: 'INR', name: 'US Dollar to Indian Rupee' },
  { base: 'INR', quote: 'USD', name: 'Indian Rupee to US Dollar' },
  { base: 'EUR', quote: 'GBP', name: 'Euro to British Pound' },
  { base: 'GBP', quote: 'EUR', name: 'British Pound to Euro' },
];

// ==================== DATE OPTIONS ====================
export const DATE_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'this_week', label: 'This Week' },
  { value: 'last_week', label: 'Last Week' },
  { value: 'this_month', label: 'This Month' },
  { value: 'last_month', label: 'Last Month' },
];