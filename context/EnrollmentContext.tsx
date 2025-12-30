import React, { createContext, useContext, useState, ReactNode } from "react";
import { api } from "@/components/api/client"; // your axios instance

export type EnrollmentMode = "QUICK" | "DETAILED";
export type EnrollmentType = "CREATE" | "UPDATE";

export type EnrollmentProgress = {
  step: number; // 1-based from backend
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

type StartEnrollmentBody = {
  mode: EnrollmentMode;
  type: EnrollmentType;
  employee_id?: number | null; // required if type=UPDATE
};

type StartEnrollmentResponse = {
  success: boolean;
  message: string;
  data: EnrollmentDraft;
};

interface EnrollmentContextType {
  enrollmentId: number | null;
  draft: EnrollmentDraft | null;

  mode: EnrollmentMode | null;
  type: EnrollmentType | null;

  // UI
  stepIndex: number; // 0-based for UI
  completedSteps: number[];

  // Actions
  setDraft: (draft: EnrollmentDraft | null) => void;
  setStepIndexLocal: (idx: number) => void; // local move
  clearEnrollment: () => void;

  // API
  startEnrollmentDraft: (body: StartEnrollmentBody) => Promise<EnrollmentDraft>;
}

interface EnrollmentProviderProps {
  children: ReactNode;
}

const EnrollmentContext = createContext<EnrollmentContextType | undefined>(undefined);

export const EnrollmentProvider: React.FC<EnrollmentProviderProps> = ({ children }) => {
  const [draft, setDraft] = useState<EnrollmentDraft | null>(null);
  const [enrollmentId, setEnrollmentId] = useState<number | null>(null);

  const clearEnrollment = () => {
    setDraft(null);
    setEnrollmentId(null);
  };

  const setStepIndexLocal = (idx: number) => {
    // update UI step locally (still keep backend 1-based)
    setDraft((prev) => {
      if (!prev) return prev;
      return { ...prev, progress: { ...prev.progress, step: idx + 1 } };
    });
  };

  const startEnrollmentDraft = async (body: StartEnrollmentBody) => {
    try {
      const res = await api.post<StartEnrollmentResponse>("/v1/enrollments", {
        mode: body.mode,
        type: body.type,
        employee_id: body.employee_id ?? null,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-Company-Id": "1",
        },
      }
    );

      const data = res.data;

      if (!data?.success || !data?.data) {
        throw new Error(data?.message || "Invalid API response");
      }

      setDraft(data.data);
      setEnrollmentId(data.data.id);

      return data.data;
    } catch (error: any) {
      const msg = error?.response?.data?.message || error.message || "Unknown error";
      throw new Error(`Failed to start enrollment draft: ${msg}`);
    }
  };

  const mode = draft?.mode ?? null;
  const type = draft?.type ?? null;
  const stepIndex = Math.max(0, (draft?.progress?.step ?? 1) - 1);
  const completedSteps = draft?.progress?.completed_steps ?? [];

  return (
    <EnrollmentContext.Provider
      value={{
        enrollmentId,
        draft,
        mode,
        type,
        stepIndex,
        completedSteps,
        setDraft,
        setStepIndexLocal,
        clearEnrollment,
        startEnrollmentDraft,
      }}
    >
      {children}
    </EnrollmentContext.Provider>
  );
};

export const useEnrollmentContext = (): EnrollmentContextType => {
  const ctx = useContext(EnrollmentContext);
  if (!ctx) throw new Error("useEnrollmentContext must be used within EnrollmentProvider");
  return ctx;
};
