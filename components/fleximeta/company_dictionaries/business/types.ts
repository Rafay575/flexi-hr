// ==================== BUSINESS API TYPES ====================
export interface ApiBusiness {
  id: number;
  name: string;
  code: string;
  description: string;
  industry_code: string;
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

// ==================== BUSINESS FRONTEND TYPES ====================
export interface Business {
  id: string;
  code: string;
  name: string;
  description: string;
  industry_code: string;
  active: boolean;
}

export interface BusinessRow extends Business {
  sr: number;
}

export interface BusinessesResponse {
  data: Business[];
  meta: ApiMeta;
}

// ==================== BUSINESS FORM TYPES ====================
export interface BusinessFormData {
  code: string;
  name: string;
  description: string;
  industry_code: string;
  active: number | string;
}

// Industry code options (NAICS codes)
export const INDUSTRY_CODE_OPTIONS = [
  { value: "NAICS-11", label: "Agriculture, Forestry, Fishing and Hunting" },
  { value: "NAICS-21", label: "Mining, Quarrying, and Oil and Gas Extraction" },
  { value: "NAICS-22", label: "Utilities" },
  { value: "NAICS-23", label: "Construction" },
  { value: "NAICS-31-33", label: "Manufacturing" },
  { value: "NAICS-42", label: "Wholesale Trade" },
  { value: "NAICS-44-45", label: "Retail Trade" },
  { value: "NAICS-48-49", label: "Transportation and Warehousing" },
  { value: "NAICS-51", label: "Information" },
  { value: "NAICS-52", label: "Finance and Insurance" },
  { value: "NAICS-53", label: "Real Estate and Rental and Leasing" },
  { value: "NAICS-54", label: "Professional, Scientific, and Technical Services" },
  { value: "NAICS-55", label: "Management of Companies and Enterprises" },
  { value: "NAICS-56", label: "Administrative and Support and Waste Management" },
  { value: "NAICS-61", label: "Educational Services" },
  { value: "NAICS-62", label: "Health Care and Social Assistance" },
  { value: "NAICS-71", label: "Arts, Entertainment, and Recreation" },
  { value: "NAICS-72", label: "Accommodation and Food Services" },
  { value: "NAICS-81", label: "Other Services (except Public Administration)" },
  { value: "NAICS-92", label: "Public Administration" },
  { value: "NAICS-5412", label: "Accounting, Tax Preparation, Bookkeeping" },
];