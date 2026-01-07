// src/features/employeeTransfers/components/StepTimeline.tsx
import React from "react";
import { Calendar } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { TransferWizardForm } from "./TransferWizard";

export default function StepTimeline() {
  const { register, formState } = useFormContext<TransferWizardForm>();
  const inputClass =
    "w-full px-4 py-2.5 bg-white border border-neutral-border rounded-lg text-sm text-neutral-primary focus:outline-none focus:ring-2 focus:ring-flexi-primary/20 focus:border-flexi-primary transition-all placeholder:text-neutral-muted";
  const labelClass = "block text-label font-medium text-neutral-secondary mb-1.5";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 max-w-2xl mx-auto">
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-0.5">
          <label className={labelClass}>Effective Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted w-4 h-4" />
            <input
              type="date"
              {...register("effective_date", { required: true })}
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>

        <div className="space-y-0.5">
          <label className={labelClass}>Reason for Transfer / Promotion</label>
          <textarea
            rows={4}
            {...register("reason", { required: true })}
            placeholder="Please provide a justification for this request..."
            className={`${inputClass} resize-none`}
          />
        </div>

        {formState.errors.effective_date || formState.errors.reason ? (
          <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700 font-semibold">
            Please fill Effective Date and Reason to continue.
          </div>
        ) : null}
      </div>
    </div>
  );
}
