// src/features/employeeTransfers/utils/buildTransferPayload.ts
import type { TransferWizardForm } from "./TransferWizard";

type TransferType = "DEPARTMENT" | "LOCATION" | "DESIGNATION" | "GRADE" | "MANAGER";

export function buildTransferPayload(v: TransferWizardForm) {
  const type: TransferType =
    v.new_department_id ? "DEPARTMENT" :
    v.new_location_id ? "LOCATION" :
    v.new_designation_id ? "DESIGNATION" :
    v.new_grade_id ? "GRADE" :
    v.new_manager?.trim() ? "MANAGER" :
    "DEPARTMENT";

  return {
    employee_id: v.employee_id!,
    type,

    to_department_id: v.new_department_id ?? null,
    to_location_id: v.new_location_id ?? null,
    to_designation_id: v.new_designation_id ?? null,
    to_grade_id: v.new_grade_id ?? null,

    to_manager_id: null, // until manager API is provided
    effective_date: v.effective_date,
    reason: v.reason,
  };
}
