// src/pages/Grades/types.ts
export type GradeForUI = {
  id: number;
  name: string;
  code?: string;
  hierarchy_level?: number;

  currency_id?: number | null;
  currency_name?: string | null; // e.g. "USD"
  currency_code?: string | null; // e.g. "$"

  min_base_salary?: string; // API gives string
  max_base_salary?: string;

  active: boolean;
  created_at?: string;
  updated_at?: string;
};
