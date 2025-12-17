export type CostCenterForUI = {
  id: number;
  company_id: number;
  code: string | null;
  name: string;
  department_id: number | null;
  location_id: number | null;

  is_draft: boolean;
  active: boolean;

  valid_from: string | null;

  department_name?: string | null;
  location_name?: string | null;
};
