// ==================== MINIMUM WAGE API TYPES ====================
export interface ApiMinimumWage {
  id: number;
  country_id: number;
  country_name: string;
  state_name: string;
  currency_iso_code: string;
  state_id: number | null;
  wage_amount: string;
  wage_basis: string;
  currency_id: number;
  effective_from: string;
  effective_to: string | null;
  source_ref: string;
  is_active: boolean;
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

// ==================== MINIMUM WAGE FRONTEND TYPES ====================
export interface MinimumWage {
  id: string;
  country_id: number;
  country_name: string;
  state_name: string;
  currency_iso_code: string;
  state_id: number | null;
  wage_amount: string;
  wage_basis: string;
  currency_id: number;
  effective_from: string;
  effective_to: string | null;
  source_ref: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MinimumWageRow extends MinimumWage {
  sr: number;
}

export interface MinimumWagesResponse {
  data: MinimumWage[];
  meta: ApiMeta;
}

export interface FrontendMinimumWagesResponse extends MinimumWagesResponse {}

// ==================== MINIMUM WAGE FORM TYPES ====================
export interface MinimumWageFormData {
  country_id: number | string;
  state_id?: number | string | null;
  wage_amount: number | string;
  wage_basis: string;
  currency_id: number | string;
  effective_from: string;
  effective_to?: string | null;
  source_ref: string;
  is_active: boolean;
}

// ==================== WAGE BASIS OPTIONS ====================
export const WAGE_BASIS_OPTIONS = [
  { value: "monthly", label: "Monthly" },
  { value: "hourly", label: "Hourly" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "yearly", label: "Yearly" },
];

// ==================== STATUS OPTIONS ====================
export const STATUS_OPTIONS = [
  { value: true, label: "Active" },
  { value: false, label: "Inactive" },
];

export interface Country {
  id: string;
  name: string;
  iso2: string;
}

export interface CurrencyOption {
  id: number;
  iso_code: string;
}

export interface CurrencyDetail extends CurrencyOption {
  symbol: string;
  decimals: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
