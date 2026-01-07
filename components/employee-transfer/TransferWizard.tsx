// src/features/employeeTransfers/TransferWizard.tsx
import React, { useMemo, useState } from "react";
import {
  ArrowRightLeft,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Check,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";

import StepSelectEmployee from "./StepSelectEmployee";
import StepTransferDetails from "./StepTransferDetails";
import { useTransferEmployees, ApiTransferEmployee } from "./useTransferEmployees";
import { Button } from "../ui/button";
import StepReviewSubmit from "./StepReviewSubmit";
import StepTimeline from "./StepTimeline";

const STEPS = [
  { id: "select", label: "Select Employee", icon: Users },
  { id: "details", label: "Transfer Details", icon: ArrowRightLeft },
  { id: "date", label: "Timeline", icon: Calendar },
  { id: "review", label: "Review", icon: CheckCircle },
];

export type TransferWizardForm = {
  employee_id: number | null;

  // Step-2 NEW values (IDs)
  new_designation_id: number | null;
  new_department_id: number | null;
  new_grade_id: number | null;
  new_location_id: number | null;

  // Manager API not provided yet → keep text for now
  new_manager: string;

  // Step-3
  effective_date: string;
  reason: string;
};

export default function TransferWizard() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState<ApiTransferEmployee | null>(null);

  // Step-1 data
  const { items, loading, error, search, setSearch, sentinelRef, refresh } = useTransferEmployees();

  // RHF (shared across steps)
  const form = useForm<TransferWizardForm>({
    defaultValues: {
      employee_id: null,

      new_designation_id: null,
      new_department_id: null,
      new_grade_id: null,
      new_location_id: null,

      new_manager: "",

      effective_date: "",
      reason: "",
    },
    mode: "onChange",
  });

  // ✅ Step validation (controls Continue enabled/disabled)
  const isStepValid = useMemo(() => {
    if (currentStep === 0) return !!selectedEmployee;

    if (currentStep === 1) {
      const v = form.getValues();
      const hasAnyNew =
        (v.new_designation_id ?? null) !== null ||
        (v.new_department_id ?? null) !== null ||
        (v.new_grade_id ?? null) !== null ||
        (v.new_location_id ?? null) !== null ||
        !!v.new_manager?.trim();

      return hasAnyNew;
    }

    if (currentStep === 2) {
      const v = form.getValues();
      return !!v.effective_date && !!v.reason?.trim();
    }

    // Step-4 is always valid
    return true;
  }, [currentStep, selectedEmployee, form]);

  const onPickEmployee = (emp: ApiTransferEmployee) => {
    setSelectedEmployee(emp);
    form.setValue("employee_id", emp.id, { shouldValidate: true });
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((p) => p - 1);
  };

  const handleNext = async () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((p) => p + 1);
      return;
    }
    // Step-4 handles submit internally
  };

  return (
    <FormProvider {...form}>
      <div className="bg-white rounded-xl shadow-sm border border-neutral-border overflow-hidden min-h-[640px] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-neutral-border flex items-center justify-between bg-neutral-page/20">
          <div>
            <h2 className="text-xl font-bold text-neutral-primary">Initiate Transfer / Promotion</h2>
            <p className="text-sm text-neutral-secondary mt-1">Create a new internal movement request.</p>
          </div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm font-medium text-neutral-secondary hover:text-neutral-primary px-3 py-1.5 rounded-lg hover:bg-neutral-border/50 transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* Stepper */}
        <div className="px-6 py-4 bg-white border-b border-neutral-border">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {STEPS.map((step, idx) => {
              const isActive = idx === currentStep;
              const isCompleted = idx < currentStep;

              return (
                <div key={step.id} className="flex flex-col items-center gap-2 relative z-10 cursor-default">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2
                      ${
                        isActive
                          ? "bg-flexi-primary border-flexi-primary text-white shadow-lg scale-110"
                          : isCompleted
                          ? "bg-green-50 border-green-200 text-state-success"
                          : "bg-white border-neutral-border text-neutral-muted"
                      }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                  </div>

                  <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? "text-flexi-primary" : "text-neutral-muted"}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 md:p-10 bg-neutral-page/10">
          {currentStep === 0 ? (
            <StepSelectEmployee
              items={items}
              loading={loading}
              error={error}
              search={search}
              setSearch={setSearch}
              sentinelRef={sentinelRef}
              selected={selectedEmployee}
              onSelect={onPickEmployee}
              onRefresh={refresh}
            />
          ) : currentStep === 1 ? (
            <StepTransferDetails selectedEmployee={selectedEmployee} />
          ) : currentStep === 2 ? (
            <StepTimeline />
          ) : (
            <StepReviewSubmit selectedEmployee={selectedEmployee} onDone={() => navigate(-1)} />
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-border bg-white flex justify-between items-center">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold border transition-all ${
              currentStep === 0
                ? "opacity-0 pointer-events-none"
                : "border-neutral-border text-neutral-secondary hover:bg-neutral-page hover:text-neutral-primary"
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          {currentStep < 3 ? (
            <Button
              type="button"
              onClick={handleNext}
              variant="outline"
             
              className="my-0 transition-all duration-500 hover:bg-[#1E1B4B] hover:text-white"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <div className="text-xs text-neutral-muted">Review & Submit on this step</div>
          )}
        </div>
      </div>
    </FormProvider>
  );
}
