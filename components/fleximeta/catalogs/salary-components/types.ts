// Salary Component Types
export interface ApiSalaryComponent {
  id: number;
  code: string;
  name: string;
  type: string; // 'earning' | 'deduction'
  taxable: boolean;
  pensionable: boolean;
  proratable: boolean;
  formula_hint: string; // e.g., 'fixed', 'percentage', etc.
  active: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SalaryComponent {
  id: string;
  code: string;
  name: string;
  type: string;
  taxable: boolean;
  pensionable: boolean;
  proratable: boolean;
  formula_hint: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface SalaryComponentRow extends SalaryComponent {
  sr: number;
}

export interface SalaryComponentsResponse {
  data: SalaryComponent[];
  meta: ApiMeta;
}

export interface FrontendSalaryComponentsResponse extends SalaryComponentsResponse {}

// Form Data for create/update
export interface SalaryComponentFormData {
  code: string;
  name: string;
  type: string;
  taxable: boolean;
  pensionable: boolean;
  proratable: boolean;
  formula_hint: string;
  active: boolean;
}

// Options for type
export const SALARY_COMPONENT_TYPE_OPTIONS = [
  { value: 'earning', label: 'Earning' },
  { value: 'deduction', label: 'Deduction' },
];

// Options for formula_hint
export const FORMULA_HINT_OPTIONS = [
  { value: 'fixed', label: 'Fixed Amount' },
  { value: 'percentage', label: 'Percentage of Basic' },
  { value: 'custom', label: 'Custom Formula' },
];