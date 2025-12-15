// types/costCenter.ts
export interface CostCenterForUI {
  id: number;
  company_id: number;
  code: string;
  name: string;
  department_id?: number | null;
  department_name?: string;
  location_id?: number | null;
  location_name?: string;
  parent_id?: number | null;
  parent_name?: string;
  valid_from?: string | null;
  valid_to?: string | null;
  active: boolean;
  status: string;
  is_draft: boolean;
  created_at: string;
  updated_at: string;
}

export interface CostCenterFormData {
  code: string;
  name: string;
  department_id?: string;
  location_id?: string;
  parent_id?: string;
  valid_from?: string;
  valid_to?: string;
  active: boolean;
}