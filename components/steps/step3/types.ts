export interface props {
  next: () => void;
  prev: () => void;
  isLast: boolean;
}
// ui/steps/step3/types.ts
import { z } from "zod";

/**
 * A small curated timezone list for the select.
 * Add / remove as you like.
 */
export const TIMEZONE_OPTIONS = [
  { value: "Asia/Karachi", label: "Asia / Karachi (PKT)" },
  { value: "Asia/Dubai", label: "Asia / Dubai (GST)" },
  { value: "Europe/London", label: "Europe / London (GMT)" },
  { value: "Europe/Berlin", label: "Europe / Berlin (CET)" },
  { value: "America/New_York", label: "America / New York (EST)" },
  { value: "America/Los_Angeles", label: "America / Los Angeles (PST)" },
] as const;
export type TimezoneValue = (typeof TIMEZONE_OPTIONS)[number]["value"];


export const companyStep3Schema = z.object({
  registered_email: z.string().email("Please enter a valid registered email"),
  main_phone: z.string().min(5, "Main phone is required"),
  timezone: z.enum(
    TIMEZONE_OPTIONS.map((t) => t.value) as [TimezoneValue, ...TimezoneValue[]]
  ),
  country_id: z.string().min(1, "Country is required"),
  state_id: z.string().min(1, "State / province is required"),
  city_id: z.string().min(1, "City is required"),

  street: z.string().min(3, "Street is required"),
  zip: z.string().min(2, "ZIP / postal code is required"),
  address_line_1: z
    .string()
    .min(3, "Address line 1 is required")
    .max(100, "Address line 1 is too long"),
  address_line_2: z
    .string()
    .min(3, "Address line 2 must be at least 2 characters")
    .max(100, "Address line 2 is too long")
    .optional()
    .or(z.literal("")),

  established_on: z
    .string()
    .min(1, "Established date is required")
    .regex(
      /^\d{4}-\d{2}-\d{2}$/, 
      "Please enter a valid date in YYYY-MM-DD format"
    ), // Added date validation

  registration_no: z
    .string()
    .min(1, "Registration number is required")
    .regex(/^[A-Z0-9-]+$/, "Please enter a valid registration number"),
  
  tax_vat_id: z
    .string()
    .min(1, "Tax / VAT ID is required")
    .regex(/^[A-Z0-9-]+$/, "Please enter a valid Tax / VAT ID"),

  currency_id: z.string().min(1, "Currency is required"),

  letterhead: z.any().nullable().optional(),
});

export type CompanyStep3Form = z.infer<typeof companyStep3Schema>;


/**
 * Shape we expect from GET /step-3.
 * Adapt field names if your API wraps inside something like { legal: {...} }.
 */
// types for clarity (optional if you already have them)
export type CompanyStep3ApiData = {
  id: number;
  company_id: number;
  registered_email: string;
  main_phone: string;
  timezone: string;
  country_id: number | null;
  state_id: number | null;
  city_id: number | null;
  street: string | null;
  zip: string | null;
  address_line_1: string | null;
  address_line_2: string | null;

  established_on: string | null;
  registration_no: string | null;
  tax_vat_id: string | null;
  currency_id: number | null;
  letterhead_path?: string | null;
  // ...etc
};

export type CompanyStep3GetResponse = {
  success: boolean;
  data: {
    legal: CompanyStep3ApiData | null;
  };
};

export interface CompanyStep3SaveResponse {
  success: boolean;
  message?: string;
  data?: CompanyStep3ApiData | null;
}
