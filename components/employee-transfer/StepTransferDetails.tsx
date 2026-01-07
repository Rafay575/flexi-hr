// src/features/employeeTransfers/components/StepTransferDetails.tsx
import React from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { useFormContext } from "react-hook-form";

import type { ApiTransferEmployee } from "./useTransferEmployees";
import type { TransferWizardForm } from "./TransferWizard";
import { useTransferLookups, Option } from "./useTransferLookups";

type Props = {
  selectedEmployee: ApiTransferEmployee | null;
};

function SelectFieldRow({
  label,
  current,
  placeholder,
  name,
  options,
  loading,
}: {
  label: string;
  current: string;
  placeholder: string;
  name: keyof Pick<
    TransferWizardForm,
    "new_designation_id" | "new_department_id" | "new_grade_id" | "new_location_id"
  >;
  options: Option[];
  loading: boolean;
}) {
  const { register, watch } = useFormContext<TransferWizardForm>();
  const newVal = watch(name);
  const isChanged = (newVal ?? null) !== null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center p-5 rounded-2xl border border-neutral-border bg-white shadow-sm">
      {/* CURRENT */}
      <div className="rounded-xl border border-neutral-border bg-white p-4">
        <div className="text-[11px] font-extrabold text-neutral-muted uppercase tracking-wider mb-2">
          Current {label}
        </div>
        <div className="text-sm font-semibold text-neutral-500 line-through decoration-neutral-300">
          {current || "-"}
        </div>
      </div>

      {/* ARROW */}
      <div className={`hidden md:flex items-center justify-center ${isChanged ? "text-flexi-primary" : "text-neutral-300"}`}>
        <ArrowRight className="w-6 h-6" />
      </div>

      {/* NEW */}
      <div
        className={`rounded-xl border p-4 transition-all ${
          isChanged ? "border-flexi-primary ring-1 ring-flexi-primary/20 bg-blue-50/20" : "border-neutral-border bg-white"
        }`}
      >
        <div className="text-[11px] font-extrabold text-neutral-primary uppercase tracking-wider mb-2">
          New {label}
        </div>

        <div className="relative">
          <select
            {...register(name, {
              // ✅ CRITICAL FIX: "" -> null, number -> number
              setValueAs: (v) => {
                if (v === "" || v === null || typeof v === "undefined") return null;
                const n = Number(v);
                return Number.isFinite(n) ? n : null;
              },
            })}
            className="w-full bg-transparent outline-none text-sm font-semibold text-neutral-primary appearance-none pr-8"
          >
            <option value="">{placeholder}</option>
            {options.map((o) => (
              <option key={o.value} value={String(o.value)}>
                {o.label}
              </option>
            ))}
          </select>

          {loading ? (
            <Loader2 className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-neutral-400" />
          ) : (
            <span className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-400">▾</span>
          )}
        </div>
      </div>
    </div>
  );
}

function TextFieldRow({
  label,
  current,
  placeholder,
  name,
}: {
  label: string;
  current: string;
  placeholder: string;
  name: keyof Pick<TransferWizardForm, "new_manager">;
}) {
  const { register, watch } = useFormContext<TransferWizardForm>();
  const newVal = watch(name) || "";
  const isChanged = !!newVal.trim();

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center p-5 rounded-2xl border border-neutral-border bg-white shadow-sm">
      <div className="rounded-xl border border-neutral-border bg-white p-4">
        <div className="text-[11px] font-extrabold text-neutral-muted uppercase tracking-wider mb-2">
          Current {label}
        </div>
        <div className="text-sm font-semibold text-neutral-500 line-through decoration-neutral-300">
          {current || "-"}
        </div>
      </div>

      <div className={`hidden md:flex items-center justify-center ${isChanged ? "text-flexi-primary" : "text-neutral-300"}`}>
        <ArrowRight className="w-6 h-6" />
      </div>

      <div className={`rounded-xl border p-4 transition-all ${
        isChanged ? "border-flexi-primary ring-1 ring-flexi-primary/20 bg-blue-50/20" : "border-neutral-border bg-white"
      }`}>
        <div className="text-[11px] font-extrabold text-neutral-primary uppercase tracking-wider mb-2">
          New {label}
        </div>

        <input
          type="text"
          placeholder={placeholder}
          {...register(name)}
          className="w-full bg-transparent outline-none text-sm font-semibold text-neutral-primary placeholder:text-neutral-400"
        />
      </div>
    </div>
  );
}

export default function StepTransferDetails({ selectedEmployee }: Props) {
  const {
    loading,
    error,
    designationOptions,
    departmentOptions,
    gradeOptions,
    locationOptions,
  } = useTransferLookups();

  if (!selectedEmployee) {
    return (
      <div className="p-6 rounded-xl border border-neutral-border bg-white text-neutral-secondary">
        Please select an employee first.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      {/* Top employee card */}
      <div className="p-5 rounded-2xl border border-neutral-border bg-white shadow-sm flex items-center gap-4">
        {selectedEmployee.avatar_url ? (
          <img
            src={selectedEmployee.avatar_url}
            className="w-12 h-12 rounded-full border border-neutral-border object-cover"
            alt={selectedEmployee.name}
          />
        ) : (
          <div className="w-12 h-12 rounded-full border border-neutral-border bg-neutral-page flex items-center justify-center font-extrabold text-neutral-700">
            {selectedEmployee.avatar_text || selectedEmployee.name.slice(0, 2).toUpperCase()}
          </div>
        )}

        <div className="min-w-0">
          <div className="font-extrabold text-neutral-primary text-sm truncate">{selectedEmployee.name}</div>
          <div className="text-xs text-neutral-secondary truncate">
            {selectedEmployee.designation || selectedEmployee.role || "-"} • {selectedEmployee.department || "-"}
          </div>
        </div>
      </div>

      {error ? (
        <div className="p-4 rounded-xl border border-neutral-border bg-white text-state-error font-semibold">
          {error}
        </div>
      ) : null}

      <SelectFieldRow
        label="Designation"
        current={selectedEmployee.designation || "-"}
        placeholder="Select Designation"
        name="new_designation_id"
        options={designationOptions}
        loading={loading}
      />

      <SelectFieldRow
        label="Department"
        current={selectedEmployee.department || "-"}
        placeholder="Select Department"
        name="new_department_id"
        options={departmentOptions}
        loading={loading}
      />

      <SelectFieldRow
        label="Grade"
        current={selectedEmployee.grade || "-"}
        placeholder="Select Grade"
        name="new_grade_id"
        options={gradeOptions}
        loading={loading}
      />

      <TextFieldRow
        label="Manager"
        current={"-"}
        placeholder="Enter New Manager"
        name="new_manager"
      />

      <SelectFieldRow
        label="Location"
        current={selectedEmployee.location || "-"}
        placeholder="Select Location"
        name="new_location_id"
        options={locationOptions}
        loading={loading}
      />
    </div>
  );
}
