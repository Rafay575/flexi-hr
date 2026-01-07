// src/features/enrollment/steps/DetailedAttendanceStep.tsx
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/components/api/client";
import type { StepComponentProps, StepHandle } from "../../stepComponents";

const colors = { primary: "#3D3A5C", coral: "#E8A99A" } as const;

const inputClass =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 disabled:bg-gray-50";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[11px] font-semibold mb-1 block" style={{ color: colors.primary }}>
      {children}
    </label>
  );
}

const FIXED_ID = 1;

type SectionGetResponse = {
  success: boolean;
  data?: {
    id: number;
    section: "attendance";
    values?: {
      default_shift_id?: string | number | null;
      weekly_off_pattern_id?: string | number | null;
      leave_policy_id?: string | number | null;
      holiday_list_id?: string | number | null;
      biometric_device_id?: string | number | null;
      biometric_enrollment_date?: string | null;
      leave_approver_id?: string | number | null;

      overtime_eligible?: boolean | number | string | null;
      permitted_remote_work?: boolean | number | string | null;
      flexible_arrival_departure?: boolean | number | string | null;
    };
  };
};

const toIntOrNull = (v: any) => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const toBool = (v: any) => {
  if (v === true || v === "true" || v === 1 || v === "1") return true;
  return false;
};

// Only your fields
const schema = z.object({
  default_shift_id: z.coerce.number().int().nullable().optional(),
  weekly_off_pattern_id: z.coerce.number().int().nullable().optional(),
  leave_policy_id: z.coerce.number().int().nullable().optional(),
  holiday_list_id: z.coerce.number().int().nullable().optional(),
  biometric_device_id: z.coerce.number().int().nullable().optional(),
  biometric_enrollment_date: z.string().nullable().optional(),
  leave_approver_id: z.coerce.number().int().nullable().optional(),

  overtime_eligible: z.boolean().nullable().optional(),
  permitted_remote_work: z.boolean().nullable().optional(),
  flexible_arrival_departure: z.boolean().nullable().optional(),
});

type Values = z.infer<typeof schema>;
const resolver = zodResolver(schema) as unknown as Resolver<Values>;

const DetailedAttendanceStep = forwardRef<StepHandle, StepComponentProps>(function DetailedAttendanceStep(
  { enrollmentId, disabled },
  ref
) {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<Values>({
    resolver,
    mode: "onTouched",
    defaultValues: {
      // ids default to null; we will prefill from API; and submit will fallback to 1
      default_shift_id: null,
      weekly_off_pattern_id: null,
      leave_policy_id: null,
      holiday_list_id: null,
      biometric_device_id: null,
      leave_approver_id: null,

      biometric_enrollment_date: null,

      overtime_eligible: false,
      permitted_remote_work: false,
      flexible_arrival_departure: false,
    },
  });

  const isBusy = !!disabled || saving || loading;

  // Prefill from GET section API
  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!enrollmentId) return;
      try {
        setLoading(true);

        const res = await api.get<SectionGetResponse>(`/v1/enrollments/${enrollmentId}/sections/attendance`, {
          headers: { Accept: "application/json", "X-Company-Id": "1" },
        });

        if (!mounted) return;

        const vals = res.data?.data?.values || {};

        form.reset({
          default_shift_id: toIntOrNull(vals.default_shift_id),
          weekly_off_pattern_id: toIntOrNull(vals.weekly_off_pattern_id),
          leave_policy_id: toIntOrNull(vals.leave_policy_id),
          holiday_list_id: toIntOrNull(vals.holiday_list_id),
          biometric_device_id: toIntOrNull(vals.biometric_device_id),
          leave_approver_id: toIntOrNull(vals.leave_approver_id),
          biometric_enrollment_date: vals.biometric_enrollment_date ?? null,

          overtime_eligible: toBool(vals.overtime_eligible),
          permitted_remote_work: toBool(vals.permitted_remote_work),
          flexible_arrival_departure: toBool(vals.flexible_arrival_departure),
        });
      } catch (err: any) {
        alert(err?.response?.data?.message || err?.message || "Failed to load Attendance section");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [enrollmentId, form]);

  const submit = async () => {
    const ok = await form.trigger();
    if (!ok) return false;

    if (!enrollmentId) {
      alert("Enrollment draft not ready yet.");
      return false;
    }

    try {
      setSaving(true);
      const v = form.getValues();

      // All *_id fields: disabled in UI, but on submit fallback to 1 if null
      const payload = {
        default_shift_id: (v.default_shift_id ?? FIXED_ID),
        weekly_off_pattern_id: (v.weekly_off_pattern_id ?? FIXED_ID),
        leave_policy_id: (v.leave_policy_id ?? FIXED_ID),
        holiday_list_id: (v.holiday_list_id ?? FIXED_ID),
        biometric_device_id: (v.biometric_device_id ?? FIXED_ID),
        leave_approver_id: (v.leave_approver_id ?? ""),

        biometric_enrollment_date: v.biometric_enrollment_date || null,

        overtime_eligible: !!v.overtime_eligible,
        permitted_remote_work: !!v.permitted_remote_work,
        flexible_arrival_departure: !!v.flexible_arrival_departure,
      };

      await api.patch(`/v1/enrollments/${enrollmentId}/sections/attendance`, payload, {
        headers: { Accept: "application/json", "X-Company-Id": "1" },
      });

      return true;
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || "Failed to save Attendance section");
      return false;
    } finally {
      setSaving(false);
    }
  };

  useImperativeHandle(ref, () => ({ submit }));

  // helper to show disabled id field value
  const DisabledId = ({ label, value }: { label: string; value: number | null | undefined }) => (
    <div>
      <Label>{label}</Label>
      <input className={inputClass} disabled value={value ?? FIXED_ID} readOnly />
      <p className="mt-1 text-[11px] text-gray-500">Locked for now (will submit {value ?? FIXED_ID}).</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      <DisabledId label="Default Shift ID" value={form.watch("default_shift_id")} />
      <DisabledId label="Weekly Off Pattern ID" value={form.watch("weekly_off_pattern_id")} />
      <DisabledId label="Leave Policy ID" value={form.watch("leave_policy_id")} />
      <DisabledId label="Holiday List ID" value={form.watch("holiday_list_id")} />
      <DisabledId label="Biometric Device ID" value={form.watch("biometric_device_id")} />
      <DisabledId label="Leave Approver ID" value={form.watch("leave_approver_id")} />

      {/* Date (editable) */}
      <div>
        <Label>Biometric Enrollment Date</Label>
        <input
          className={inputClass}
          type="date"
          disabled={isBusy}
          value={(form.watch("biometric_enrollment_date") ?? "") as any}
          onChange={(e) => form.setValue("biometric_enrollment_date", e.target.value || null, { shouldDirty: true })}
        />
      </div>

      {/* Checkboxes */}
      <div className="md:col-span-2 lg:col-span-3">
        <div className="rounded-xl border border-gray-200 p-3 flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" disabled={isBusy} {...form.register("overtime_eligible")} />
            <span className="text-[12px]" style={{ color: colors.primary }}>
              Overtime eligible
            </span>
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" disabled={isBusy} {...form.register("permitted_remote_work")} />
            <span className="text-[12px]" style={{ color: colors.primary }}>
              Permitted remote work
            </span>
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" disabled={isBusy} {...form.register("flexible_arrival_departure")} />
            <span className="text-[12px]" style={{ color: colors.primary }}>
              Flexible arrival/departure
            </span>
          </label>
        </div>
      </div>

      {(loading || saving) && (
        <div className="lg:col-span-3 text-[11px] text-gray-500">{loading ? "Loading..." : "Saving..."}</div>
      )}
    </div>
  );
});

export default DetailedAttendanceStep;
