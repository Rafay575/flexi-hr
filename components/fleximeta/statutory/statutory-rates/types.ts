export interface ApiStatutoryRate {
  id: number;
  country_id: number;
  state_id: number | null;
  code: string;
  payload: {
    year: string;
    slabs: Array<{
      upto: number;
      rate: number;
      quick: number;
    }>;
  };
  effective_from: string;
  effective_to: string | null;
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

export interface StatutoryRate {
  id: string;
  country_id: number;
  state_id: number | null;
  code: string;
  payload: {
    year: string;
    slabs: Array<{
      upto: number;
      rate: number;
      quick: number;
    }>;
  };
  effective_from: string;
  effective_to: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StatutoryRateRow extends StatutoryRate {
  sr: number;
}

export interface StatutoryRatesResponse {
  data: StatutoryRate[];
  meta: ApiMeta;
}

export interface FrontendStatutoryRatesResponse extends StatutoryRatesResponse {}

export interface StatutoryRateFormData {
  country_id: number | string;
  state_id?: number | string | null;
  code: string;
  payload: {
    year: string;
    slabs: Array<{
      upto: number;
      rate: number;
      quick: number;
    }>;
  };
  effective_from: string;
  effective_to?: string | null;
  is_active: boolean;
}

// ==================== STATUTORY CODE OPTIONS ====================
export const STATUTORY_CODE_OPTIONS = [
  { value: "TAX_SLAB_SET", label: "Income Tax Slabs", description: "Tax slabs for income calculation" },
  { value: "SOCIAL_SECURITY", label: "Social Security", description: "Social security contribution rates" },
  { value: "PROVIDENT_FUND", label: "Provident Fund", description: "Provident fund contribution rates" },
  { value: "HEALTH_INSURANCE", label: "Health Insurance", description: "Health insurance premium rates" },
  { value: "SALES_TAX", label: "Sales Tax", description: "Sales tax/VAT rates" },
  { value: "CUSTOM_DUTY", label: "Custom Duty", description: "Custom duty rates" },
  { value: "EXCISE_DUTY", label: "Excise Duty", description: "Excise duty rates" },
];

export interface Country {
  id: string;
  name: string;
  iso2: string;
}

export interface State {
  id: string;
  name: string;
  country_id: number;
}