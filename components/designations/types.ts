// src/pages/Designations/types.ts
export type DesignationForUI = {
  id: number;
  company_id: number;
  department_id: number | null;
  reports_to_id: number | null;

  title: string;
  code?: string | null;
  job_level?: number | null;
  grade_id?: number | null;
  sort_order?: number | null;

  active: boolean;

  company_name?: string | null;
  department_name?: string | null;
  grade_name?: string | null;
  reports_to_title?: string | null;
    active_emp_count?: number | string;
};
