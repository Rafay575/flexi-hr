// src/features/enrollment/stepComponents.ts
import React from "react";
import type { Mode } from "./types";

// QUICK steps
import QuickIdentityStep from "./steps-forms/quick/QuickIdentityStep";
import QuickContactStep from "./steps-forms/quick/QuickContactStep";
import QuickEmploymentStep from "./steps-forms/quick/QuickEmploymentStep";
import QuickDocumentsStep from "./steps-forms/quick/QuickDocumentsStep";
import QuickAttendanceStep from "./steps-forms/quick/QuickAttendanceStep";
import QuickSalaryStep from "./steps-forms/quick/QuickSalaryStep";

// DETAILED steps
import DetailedOverviewStep from "./steps-forms/detailed/DetailedOverviewStep";
import DetailedAddressStep from "./steps-forms/detailed/DetailedAddressStep";
import DetailedAttendanceStep from "./steps-forms/detailed/DetailedAttendanceStep";
import DetailedSalaryStep from "./steps-forms/detailed/DetailedSalaryStep";
import QuickPreviewStep from "./steps-forms/quick/QuickPreviewStep";

export type StepHandle = {
  submit: () => Promise<boolean>; // returns true if ok & saved
};

export type StepComponentProps = {
  enrollmentId: number | null;
  disabled?: boolean;
};

export const stepComponents: Record<Mode, React.ForwardRefExoticComponent<
  StepComponentProps & React.RefAttributes<StepHandle>
>[]> = {
  quick: [
    QuickIdentityStep,
    QuickContactStep,
    QuickEmploymentStep,
    QuickSalaryStep,
    QuickAttendanceStep,
    QuickDocumentsStep,
    QuickPreviewStep
  
  ],
  detailed: [
    DetailedOverviewStep,
    DetailedAddressStep,
    DetailedAttendanceStep,
    DetailedSalaryStep,
   
  ],
};
