// enrollments/enrollmentApi.ts
import { api } from "@/components/api/client";

export type EnrollmentMode = "QUICK" | "DETAILED";
export type EnrollmentType = "CREATE" | "UPDATE";

export type EnrollmentProgress = {
  step: number; // 1-based
  completed_steps: number[];
};

export type EnrollmentDraft = {
  id: number;
  company_id: number;
  employee_id: number | null;
  type: EnrollmentType;
  mode: EnrollmentMode;
  status: string;
  progress: EnrollmentProgress;
  payload: any[];
  submitted_at: string | null;
  submitted_by: number | null;
  versions: any[];
  events: any[];
};

export type CreateEnrollmentRequest = {
  mode: EnrollmentMode;
  type: EnrollmentType;
  employee_id?: number | null;
};

export type CreateEnrollmentResponse = {
  success: boolean;
  message: string;
  data: EnrollmentDraft;
};

export async function createEnrollmentDraft(body: CreateEnrollmentRequest) {
  const res = await api.post<CreateEnrollmentResponse>("/v1/enrollments", body);
  return res.data;
}
