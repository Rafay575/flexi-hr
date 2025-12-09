export interface props {
    next: ()=>void;
    prev: ()=>void;
    isLast: boolean;
}

// ui/steps/step4/types.ts
import { z } from "zod";

// ─────────────────────────────────────
//  Zod schema + TS types for Step 4
// ─────────────────────────────────────

const subDepartmentSchema = z.object({
  id: z.number().nullable().optional(), // existing => number, new => null
  name: z.string().min(1, "Sub-department name is required"),
});

const departmentSchema = z.object({
  id: z.number().nullable().optional(),
  name: z.string().min(1, "Department name is required"),
  head_user_id: z.number().nullable().optional(),
  sub_departments: z
    .array(subDepartmentSchema)
    .min(1, "Add at least one sub-department"),
});

const divisionSchema = z.object({
  id: z.number().nullable().optional(),
  name: z.string().min(1, "Division name is required"),
  head_employee_id: z.number().nullable().optional(),
  departments: z
    .array(departmentSchema)
    .min(1, "Add at least one department"),
});

export const step4Schema = z.object({
  entity_type_id: z.string().min(1, "Entity type is required"),
  business_line_id: z.string().min(1, "Business line is required"),
  location_type_id: z.string().min(1, "Location type is required"),

  divisions: z.array(divisionSchema).min(1, "Add at least one division"),
});

export type Step4FormValues = z.infer<typeof step4Schema>;

// ─────────────────────────────────────
//  API shapes (GET / SAVE)
// ─────────────────────────────────────

export type Step4SubDepartmentApi = {
  id: number | null;
  name: string;
};

export type Step4DepartmentApi = {
  id: number | null;
  name: string;
  head_user_id: number | null;
  sub_departments: Step4SubDepartmentApi[];
};

export type Step4DivisionApi = {
  id: number | null;
  name: string;
  head_employee_id: number | null;
  departments: Step4DepartmentApi[];
};

export type Step4ApiData = {
  entity_type_id: number | null;
  business_line_id: number | null;
  location_type_id: number | null;
  divisions: Step4DivisionApi[];
};

export type Step4GetResponse = {
  success: boolean;
  data: Step4ApiData | null;
};

export type Step4SaveResponse = {
  success: boolean;
  message?: string;
  data?: Step4ApiData | null;
};
