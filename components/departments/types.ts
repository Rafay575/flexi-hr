// src/pages/Departments/types.ts
export type DepartmentForUI = {
  id: number;
  company_id: number;
  division_id: number;
  cost_centre_id: number | null;

  unit_type?: string; // Department
  name: string;
  short_name?: string;
  category?: string;  // Operational
  status: "Active" | "Inactive" | string;

  description?: string;
  code?: string;
  sort_order?: number;

  is_draft?: number | boolean;

  company_name?: string;
  division_name?: string;
  cost_centre_name?: string;
};
