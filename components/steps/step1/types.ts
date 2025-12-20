export interface props {
  next: () => void;
  prev: () => void;
  isLast: boolean;
}

// ui/steps/step1/types.ts
import { z } from "zod";

export const companyStep1Schema = z.object({
  legal_name: z.string().min(2, "Legal name is required"),
  short_code: z
    .string()
    .min(2, "Short code must be between 2 and 8 characters")
    .max(8, "Short code must be between 2 and 8 characters"),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  description: z.string().max(500).optional().or(z.literal("")),

  logo_path: z
    .any()
    .refine(
      (val) => {
        if (val === null || val === undefined) return false;
        if (typeof val === "string") return val.trim().length > 0;
        if (typeof File !== "undefined" && val instanceof File) return true;
        return false;
      },
      { message: "Logo is required" }
    ),

  theme_color: z
    .string()
    .regex(
      /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/,
      "Must be a valid hex color (e.g. #000 or #000000)"
    )
    .optional()
    .or(z.literal("")),

  // 🔹 now a YYYY-MM string coming from <input type="month">
  fiscal_year_start_month: z
    .string()
    .regex(/^\d{4}-\d{2}$/, "Select fiscal year start (year & month)"),
});

export type CompanyFormValues = z.infer<typeof companyStep1Schema>;

export interface Company {
  id: number;
  legal_name: string;
  short_code: string | null;
  website: string | null;
  logo_path: string | null;
  description: string | null;
  theme_color: string | null;

  // support both old numeric + new string from API
  fiscal_year_start_month: string | number | null;
}



export interface CompanyStep1Data {
  company: Company;
  draft_batch_id: string;
}

export interface ApiResponse<T = CompanyStep1Data> {
  success: boolean;
  data: T;
  message?: string;
}
