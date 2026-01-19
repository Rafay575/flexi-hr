// ==================== BANK API TYPES ====================
export interface ApiBank {
  id: number;
  country_id: number;
  bank_code: string;
  bank_name: string;
  active: number | boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  country_name: string;
  country_iso2: string;
}

export interface ApiMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

// ==================== BANK FRONTEND TYPES ====================
export interface Bank {
  id: string;
  country_id: number;
  bank_code: string;
  bank_name: string;
  active: boolean;
  country_name: string;
  country_iso2: string;
  created_at: string;
  updated_at: string;
}

export interface BankRow extends Bank {
  sr: number;
}

export interface BanksResponse {
  data: Bank[];
  meta: ApiMeta;
}

// ==================== BANK FORM TYPES ====================
export interface BankFormData {
  country_id: number | string;
  bank_code: string;
  bank_name: string;
  active: boolean;
}

// ==================== COUNTRY TYPES ====================
export interface Country {
  id: number;
  name: string;
  iso2: string;
  iso3: string;
  phone_code: string;
  currency: string;
  active: boolean;
}

// Example country options (you would fetch these from your API)
export const COUNTRY_OPTIONS = [
  { id: 1, name: "Afghanistan", iso2: "AF", currency: "AFN" },
  { id: 2, name: "Pakistan", iso2: "PK", currency: "PKR" },
  { id: 3, name: "United States", iso2: "US", currency: "USD" },
  { id: 4, name: "United Kingdom", iso2: "GB", currency: "GBP" },
  { id: 5, name: "United Arab Emirates", iso2: "AE", currency: "AED" },
  { id: 6, name: "Saudi Arabia", iso2: "SA", currency: "SAR" },
  { id: 7, name: "India", iso2: "IN", currency: "INR" },
  { id: 8, name: "China", iso2: "CN", currency: "CNY" },
  { id: 9, name: "Japan", iso2: "JP", currency: "JPY" },
  { id: 10, name: "Germany", iso2: "DE", currency: "EUR" },
];

// Common bank examples by country
export const COMMON_BANKS = [
  { country_id: 1, code: "HBL", name: "Habib Bank Limited" },
  { country_id: 1, code: "UBL", name: "United Bank Limited" },
  { country_id: 2, code: "SCB", name: "Standard Chartered Bank" },
  { country_id: 3, code: "CITI", name: "Citibank" },
  { country_id: 4, code: "HSBC", name: "HSBC Bank" },
  { country_id: 5, code: "ENBD", name: "Emirates NBD" },
  { country_id: 6, code: "SNB", name: "Saudi National Bank" },
  { country_id: 7, code: "SBI", name: "State Bank of India" },
  { country_id: 8, code: "ICBC", name: "Industrial and Commercial Bank of China" },
  { country_id: 9, code: "MUFG", name: "Mitsubishi UFJ Financial Group" },
  { country_id: 10, code: "DB", name: "Deutsche Bank" },
];

// Status options
export const STATUS_OPTIONS = [
  { value: true, label: "Active" },
  { value: false, label: "Inactive" },
];