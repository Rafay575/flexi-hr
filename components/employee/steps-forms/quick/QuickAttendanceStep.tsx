// src/features/enrollment/steps/QuickAttendanceStep.tsx
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { z } from "zod";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/components/api/client";
import type { StepComponentProps, StepHandle } from "../../stepComponents";
import Loader from "@/components/common/Loader";
import { toast } from "sonner";

const colors = {
  primary: "#3D3A5C",
  coral: "#E8A99A",
} as const;

const inputClass =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 disabled:bg-gray-50";

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-[11px] font-semibold mb-1 block" style={{ color: colors.primary }}>
      {children}{" "}
      {required && (
        <span className="inline-block w-1 h-1 rounded-full align-middle" style={{ background: colors.coral }} />
      )}
    </label>
  );
}

// -------------------- API types --------------------
type AttendanceSectionResponse = {
  success: boolean;
  data: {
    id: number;
    section: "attendance";
    values: Record<string, any>;
  };
};

// -------------------- Schema (screenshot fields + biometric_device_id only) --------------------
// Dropdowns are present but disabled; we still validate as number >= 1 and always send 1.
const schema = z.object({
  default_shift_id: z.coerce.number().int().min(1, "Default Shift is required"),
  weekly_off_pattern_id: z.coerce.number().int().min(1, "Weekly Off Pattern is required"),
  leave_policy_id: z.coerce.number().int().min(1, "Leave Policy is required"),
  holiday_list_id: z.coerce.number().int().min(1, "Holiday List is required"),

  biometric_device_id: z.string().default("1"),

  // ONLY this checkbox required by you (dynamic from backend)
  overtime_eligible: z.boolean(),
});

type Values = z.infer<typeof schema>;
const resolver = zodResolver(schema) as unknown as Resolver<Values>;

// -------------------- Dummy dropdowns (no APIs yet) --------------------
const dummy = [{ id: 1, name: "Select..." }];

const QuickAttendanceStep = forwardRef<StepHandle, StepComponentProps>(function QuickAttendanceStep(
  { enrollmentId, disabled },
  ref
) {
  const [saving, setSaving] = useState(false);
  const [prefillLoading, setPrefillLoading] = useState(false);

  const form = useForm<Values>({
    resolver,
    mode: "onTouched",
    defaultValues: {
      default_shift_id: 1,
      weekly_off_pattern_id: 1,
      leave_policy_id: 1,
      holiday_list_id: 1,

      biometric_device_id: "1",

      overtime_eligible: false,
    },
  });

  const e = form.formState.errors;
  const isBusy = !!disabled || saving || prefillLoading;

  // ✅ Prefill
  useEffect(() => {
    let mounted = true;

    const prefill = async () => {
      if (!enrollmentId) return;

      try {
        setPrefillLoading(true);

        const res = await api.get<AttendanceSectionResponse>(
          `/v1/enrollments/${enrollmentId}/sections/attendance`,
          { headers: { Accept: "application/json", "X-Company-Id": "1" } }
        );

        const values = res?.data?.data?.values ?? {};
        if (!mounted) return;

        // empty => keep defaults (all dropdowns = 1)
        if (!values || Object.keys(values).length === 0) return;

        form.reset(
          {
            default_shift_id: Number(values.default_shift_id ?? 1) || 1,
            weekly_off_pattern_id: Number(values.weekly_off_pattern_id ?? 1) || 1,
            leave_policy_id: Number(values.leave_policy_id ?? 1) || 1,
            holiday_list_id: Number(values.holiday_list_id ?? 1) || 1,

            biometric_device_id: String(values.biometric_device_id ?? "1") || "1",

            overtime_eligible: !!values.overtime_eligible,
          },
          { keepDirty: false, keepTouched: false }
        );
      } catch (err: any) {
        console.warn("Failed to prefill attendance", err?.response?.data || err);
      } finally {
        if (mounted) setPrefillLoading(false);
      }
    };

    prefill();
    return () => {
      mounted = false;
    };
  }, [enrollmentId, form]);

  const submit = async () => {
    const ok = await form.trigger();
    if (!ok) return false;

    if (!enrollmentId) {
      toast("Enrollment draft not ready yet.");
      return false;
    }

    try {
      setSaving(true);

      const v = form.getValues();

      // ✅ send 1 for all dropdowns (as you asked)
      const payload = {
        default_shift_id: 1,
        weekly_off_pattern_id: 1,
        leave_policy_id: 1,
        holiday_list_id: 1,

        biometric_device_id: "1",

        // ✅ dynamic checkbox value (from backend or user changes)
        overtime_eligible: !!v.overtime_eligible,
      };

      await api.patch(`/v1/enrollments/${enrollmentId}/sections/attendance`, payload, {
        headers: { Accept: "application/json", "X-Company-Id": "1" },
      });

      return true;
    } catch (err: any) {
      toast(err?.response?.data?.message || err?.message || "Failed to save Attendance");
      return false;
    } finally {
      setSaving(false);
    }
  };

  useImperativeHandle(ref, () => ({ submit }), [submit]);

  // ✅ loading
  if (prefillLoading) return <Loader message="Loading Attendance details…" fullHeight={false} />;
  if (saving) return <Loader message="Saving Attendance details…" fullHeight={false} />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {/* Default Shift */}
      <div>
        <Label required>Default Shift</Label>
        <select className={inputClass} disabled={true} {...form.register("default_shift_id")}>
          {dummy.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </select>
        {e.default_shift_id && <p className="mt-1 text-[11px] text-red-600">{e.default_shift_id.message}</p>}
      </div>

      {/* Weekly Off Pattern */}
      <div>
        <Label required>Weekly Off Pattern</Label>
        <select className={inputClass} disabled={true} {...form.register("weekly_off_pattern_id")}>
          {dummy.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </select>
        {e.weekly_off_pattern_id && (
          <p className="mt-1 text-[11px] text-red-600">{e.weekly_off_pattern_id.message}</p>
        )}
      </div>

      {/* Leave Policy */}
      <div>
        <Label required>Leave Policy</Label>
        <select className={inputClass} disabled={true} {...form.register("leave_policy_id")}>
          {dummy.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </select>
        {e.leave_policy_id && <p className="mt-1 text-[11px] text-red-600">{e.leave_policy_id.message}</p>}
      </div>

      {/* Holiday List */}
      <div>
        <Label required>Holiday List</Label>
        <select className={inputClass} disabled={true} {...form.register("holiday_list_id")}>
          {dummy.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </select>
        {e.holiday_list_id && <p className="mt-1 text-[11px] text-red-600">{e.holiday_list_id.message}</p>}
      </div>

      {/* Biometric Device ID (dummy + disabled) */}
 {/* Biometric Device (dropdown dummy + disabled) */}
<div>
  <Label>Biometric Device</Label>

  <select
    className={inputClass}
    disabled={true}
    {...form.register("biometric_device_id")}
    defaultValue="1"
  >
    <option value="1">Device #1</option>
  </select>

  {e.biometric_device_id && (
    <p className="mt-1 text-[11px] text-red-600">{String(e.biometric_device_id.message)}</p>
  )}
</div>

      {/* Checkbox (dynamic) */}
      <div className="md:col-span-2 lg:col-span-3">
        <label className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
          <input type="checkbox" disabled={isBusy} {...form.register("overtime_eligible")} />
          <span className="text-[12px]" style={{ color: colors.primary }}>
            Employee is eligible for overtime pay
          </span>
        </label>
      </div>
    </div>
  );
});

export default QuickAttendanceStep;
