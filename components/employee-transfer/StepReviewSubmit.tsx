// src/features/employeeTransfers/components/StepReviewSubmit.tsx
import React, { useMemo, useState } from "react";
import { CheckCircle, Loader2, ArrowRight } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { api } from "@/components/api/client";

import type { ApiTransferEmployee } from "./useTransferEmployees";
import type { TransferWizardForm } from "./TransferWizard";
import { useTransferLookups } from "./useTransferLookups";
import { buildTransferPayload } from "./buildTransferPayload";
import { Button } from "../ui/button";

type Props = {
  selectedEmployee: ApiTransferEmployee | null;
  onDone: () => void;
};

export default function StepReviewSubmit({ selectedEmployee, onDone }: Props) {
  const { getValues } = useFormContext<TransferWizardForm>();
  const v = getValues();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    designationMap,
    departmentMap,
    gradeMap,
    locationMap,
  } = useTransferLookups(); // loads maps for showing labels

  const summary = useMemo(() => {
    const designation = v.new_designation_id ? designationMap.get(v.new_designation_id) : null;
    const department = v.new_department_id ? departmentMap.get(v.new_department_id) : null;
    const grade = v.new_grade_id ? gradeMap.get(v.new_grade_id) : null;
    const location = v.new_location_id ? locationMap.get(v.new_location_id) : null;

    return {
      designation,
      department,
      grade,
      location,
      manager: v.new_manager?.trim() || null,
    };
  }, [v, designationMap, departmentMap, gradeMap, locationMap]);

  const submit = async () => {
    setSubmitting(true);
    setError("");

    try {
      const payload = buildTransferPayload(getValues());

      // ✅ Your create endpoint assumption (common in your backend):
      await api.post("/employee-transfers", payload);

      onDone();
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to submit transfer.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!selectedEmployee) {
    return (
      <div className="p-6 rounded-xl border border-neutral-border bg-white text-neutral-secondary">
        Please select an employee first.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 max-w-2xl mx-auto">
      <div className="bg-white border border-neutral-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 bg-neutral-page/40 border-b border-neutral-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-flexi-primary text-white flex items-center justify-center font-bold shadow-sm">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-primary">Review Transfer Request</h3>
            <p className="text-xs text-neutral-secondary">Confirm details before submission.</p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <div className="text-xs font-bold text-neutral-muted uppercase tracking-wider mb-1">Employee</div>
              <div className="text-sm font-extrabold text-neutral-primary">{selectedEmployee.name}</div>
              <div className="text-xs text-neutral-secondary font-mono">{selectedEmployee.emp_code}</div>
            </div>

            <div>
              <div className="text-xs font-bold text-neutral-muted uppercase tracking-wider mb-1">Effective Date</div>
              <div className="text-sm font-semibold text-neutral-primary">{v.effective_date || "-"}</div>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-border overflow-hidden">
            <div className="px-4 py-2 bg-neutral-page/40 border-b border-neutral-border text-xs font-bold text-neutral-muted uppercase tracking-wider">
              Proposed Changes
            </div>

            <div className="p-4 space-y-3">
              {renderChangeRow("Designation", selectedEmployee.designation || "-", summary.designation)}
              {renderChangeRow("Department", selectedEmployee.department || "-", summary.department)}
              {renderChangeRow("Grade", selectedEmployee.grade || "-", summary.grade)}
              {renderChangeRow("Location", selectedEmployee.location || "-", summary.location)}
              {renderChangeRow("Manager", "-", summary.manager)}
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-neutral-muted uppercase tracking-wider mb-2">Reason</div>
            <div className="p-3 bg-neutral-page/40 rounded-xl border border-neutral-border text-sm text-neutral-primary">
              {v.reason || "-"}
            </div>
          </div>

          {error ? (
            <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700 font-semibold">
              {error}
            </div>
          ) : null}

          <Button
          variant="outline"
            type="button"
            onClick={submit}
            disabled={submitting}
           
          >
            {submitting ? (
              <>
                Submitting <Loader2 className="w-4 h-4 animate-spin" />
              </>
            ) : (
              <>
                Submit Request <CheckCircle className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function renderChangeRow(label: string, from: string, to: string | null) {
  if (!to || to === from) return null;

  return (
    <div className="grid grid-cols-[120px_1fr_auto_1fr] gap-4 items-center text-sm">
      <span className="text-neutral-secondary font-medium">{label}</span>
      <div className="bg-white border border-neutral-200 text-neutral-500 px-3 py-1.5 rounded-lg line-through decoration-neutral-300 text-center">
        {from || "-"}
      </div>
      <ArrowRight className="w-4 h-4 text-neutral-300" />
      <div className="bg-blue-50 border border-blue-200 text-flexi-primary font-extrabold px-3 py-1.5 rounded-lg text-center shadow-sm">
        {to}
      </div>
    </div>
  );
}
