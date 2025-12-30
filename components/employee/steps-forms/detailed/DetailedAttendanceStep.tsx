// src/features/enrollment/steps/DetailedAttendanceStep.tsx
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/components/api/client";
import type { StepComponentProps, StepHandle } from "../../stepComponents";

const colors = { primary: "#3D3A5C", coral: "#E8A99A" } as const;

type Option = { id: number; name: string; active?: boolean };
type ApiListResponse = { data: Option[] };

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

// ─────────────────────────────────────────────────────────────
// Values + schema (matches your Postman body)
// Note: ids in screenshot are strings like "1" => we coerce to number then send as string if your API expects "1"
// ─────────────────────────────────────────────────────────────
const schema = z.object({
  branch_location: z.string().min(1, "Branch location is required"),
  default_shift_id: z.coerce.number().int().positive("Default shift is required"),
  shift_end_time: z.string().min(1, "Shift end time is required"),
  break_duration: z.coerce.number().int().min(0, "Break duration must be 0+"),
  weekly_off_pattern: z.string().min(1, "Weekly off pattern is required"),
  leave_policy_id: z.coerce.number().int().positive("Leave policy is required"),
  holiday_list_id: z.coerce.number().int().positive("Holiday list is required"),
  leave_approver_id: z.union([z.coerce.number().int().positive(), z.literal("")]),
  attendance_approver_id: z.union([z.coerce.number().int().positive(), z.literal("")]),
  biometric_device_id: z.string().optional().or(z.literal("")),
  biometric_enrollment_date: z.string().optional().or(z.literal("")),
  eligible_for_overtime: z.boolean(),
  flexible_arrival: z.boolean(),
  remote_work_permitted: z.boolean(),
});

type Values = z.infer<typeof schema>;

// ✅ avoid RHF resolver generic mismatch issues
const resolver = zodResolver(schema) as unknown as Resolver<Values>;

async function fetchOptions(url: string) {
  const res = await api.get<ApiListResponse>(url, {
    headers: { Accept: "application/json", "X-Company-Id": "1" },
  });
  const list = Array.isArray(res.data?.data) ? res.data.data : [];
  return list.filter((x) => (typeof x.active === "boolean" ? x.active : true));
}

const DetailedAttendanceStep = forwardRef<StepHandle, StepComponentProps>(function DetailedAttendanceStep(
  { enrollmentId, disabled },
  ref
) {
  const [saving, setSaving] = useState(false);
  const [loadingMeta, setLoadingMeta] = useState(false);

  // dropdowns (replace endpoints with your real meta endpoints)
  const [shifts, setShifts] = useState<Option[]>([]);
  const [leavePolicies, setLeavePolicies] = useState<Option[]>([]);
  const [holidayLists, setHolidayLists] = useState<Option[]>([]);
  const [leaveApprovers, setLeaveApprovers] = useState<Option[]>([]);
  const [attendanceApprovers, setAttendanceApprovers] = useState<Option[]>([]);

  const form = useForm<Values>({
    resolver,
    mode: "onTouched",
    defaultValues: {
      branch_location: "Main Office",
      default_shift_id: 0,
      shift_end_time: "06:00 PM",
      break_duration: 60,
      weekly_off_pattern: "Sunday",
      leave_policy_id: 0,
      holiday_list_id: 0,
      leave_approver_id: "",
      attendance_approver_id: "",
      biometric_device_id: "",
      biometric_enrollment_date: "",
      eligible_for_overtime: true,
      flexible_arrival: true,
      remote_work_permitted: true,
    },
  });

  const e = form.formState.errors;
  const isBusy = !!disabled || saving || loadingMeta;

  // ─────────────────────────────────────────────────────────────
  // Load meta dropdowns
  // ⚠️ Replace URLs below with your actual meta endpoints.
  // Keep the pattern same as gender endpoint you already have.
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setLoadingMeta(true);

        const [shiftList, leaveList, holidayList, leaveAppr, attAppr] = await Promise.all([
          fetchOptions("/meta/attendance/shifts?per_page=all"),
          fetchOptions("/meta/attendance/leave-policies?per_page=all"),
          fetchOptions("/meta/attendance/holiday-lists?per_page=all"),
          fetchOptions("/meta/attendance/leave-approvers?per_page=all"),
          fetchOptions("/meta/attendance/attendance-approvers?per_page=all"),
        ]);

        if (!mounted) return;

        setShifts(shiftList);
        setLeavePolicies(leaveList);
        setHolidayLists(holidayList);
        setLeaveApprovers(leaveAppr);
        setAttendanceApprovers(attAppr);

        // auto-select first options if empty
        if (shiftList[0] && !form.getValues("default_shift_id")) form.setValue("default_shift_id", shiftList[0].id as any);
        if (leaveList[0] && !form.getValues("leave_policy_id")) form.setValue("leave_policy_id", leaveList[0].id as any);
        if (holidayList[0] && !form.getValues("holiday_list_id")) form.setValue("holiday_list_id", holidayList[0].id as any);
      } catch (err: any) {
        alert(err?.response?.data?.message || err?.message || "Failed to load Attendance dropdowns");
      } finally {
        if (mounted) setLoadingMeta(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [form]);

  // ─────────────────────────────────────────────────────────────
  // Submit (PATCH /sections/attendance)
  // ─────────────────────────────────────────────────────────────
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

      const payload = {
        branch_location: v.branch_location,
        default_shift_id: String(Number(v.default_shift_id)),
        shift_end_time: v.shift_end_time,
        break_duration: Number(v.break_duration),
        weekly_off_pattern: v.weekly_off_pattern,
        leave_policy_id: String(Number(v.leave_policy_id)),
        holiday_list_id: String(Number(v.holiday_list_id)),
        leave_approver_id: v.leave_approver_id === "" ? "" : String(Number(v.leave_approver_id)),
        attendance_approver_id: v.attendance_approver_id === "" ? "" : String(Number(v.attendance_approver_id)),
        biometric_device_id: v.biometric_device_id || "",
        biometric_enrollment_date: v.biometric_enrollment_date || "",
        eligible_for_overtime: !!v.eligible_for_overtime,
        flexible_arrival: !!v.flexible_arrival,
        remote_work_permitted: !!v.remote_work_permitted,
      };

      await api.patch(`/v1/enrollments/${enrollmentId}/sections/attendance`, payload, {
        headers: { Accept: "application/json", "X-Company-Id": "1" },
      });

      return true;
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || "Failed to save Attendance");
      return false;
    } finally {
      setSaving(false);
    }
  };

  useImperativeHandle(ref, () => ({ submit }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {/* Branch Location */}
      <div>
        <Label required>Branch Location</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("branch_location")} placeholder="Main Office" />
        {e.branch_location && <p className="mt-1 text-[11px] text-red-600">{e.branch_location.message}</p>}
      </div>

      {/* Default Shift */}
      <div>
        <Label required>Default Shift</Label>
        <select className={inputClass} disabled={isBusy} {...form.register("default_shift_id")}>
          {shifts.length === 0 ? <option value="">No shifts</option> : null}
          {shifts.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </select>
        {e.default_shift_id && <p className="mt-1 text-[11px] text-red-600">{e.default_shift_id.message}</p>}
      </div>

      {/* Shift End Time */}
      <div>
        <Label required>Shift End Time</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("shift_end_time")} placeholder="06:00 PM" />
        {e.shift_end_time && <p className="mt-1 text-[11px] text-red-600">{e.shift_end_time.message}</p>}
      </div>

      {/* Break Duration */}
      <div>
        <Label required>Break Duration (mins)</Label>
        <input className={inputClass} type="number" disabled={isBusy} {...form.register("break_duration")} />
        {e.break_duration && <p className="mt-1 text-[11px] text-red-600">{e.break_duration.message}</p>}
      </div>

      {/* Weekly Off Pattern */}
      <div>
        <Label required>Weekly Off Pattern</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("weekly_off_pattern")} placeholder="Sunday" />
        {e.weekly_off_pattern && <p className="mt-1 text-[11px] text-red-600">{e.weekly_off_pattern.message}</p>}
      </div>

      {/* Leave Policy */}
      <div>
        <Label required>Leave Policy</Label>
        <select className={inputClass} disabled={isBusy} {...form.register("leave_policy_id")}>
          {leavePolicies.length === 0 ? <option value="">No leave policies</option> : null}
          {leavePolicies.map((x) => (
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
        <select className={inputClass} disabled={isBusy} {...form.register("holiday_list_id")}>
          {holidayLists.length === 0 ? <option value="">No holiday lists</option> : null}
          {holidayLists.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </select>
        {e.holiday_list_id && <p className="mt-1 text-[11px] text-red-600">{e.holiday_list_id.message}</p>}
      </div>

      {/* Leave Approver */}
      <div>
        <Label>Leave Approver</Label>
        <select className={inputClass} disabled={isBusy} {...form.register("leave_approver_id")}>
          <option value="">—</option>
          {leaveApprovers.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </select>
        {e.leave_approver_id && <p className="mt-1 text-[11px] text-red-600">{String(e.leave_approver_id.message)}</p>}
      </div>

      {/* Attendance Approver */}
      <div>
        <Label>Attendance Approver</Label>
        <select className={inputClass} disabled={isBusy} {...form.register("attendance_approver_id")}>
          <option value="">—</option>
          {attendanceApprovers.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </select>
        {e.attendance_approver_id && (
          <p className="mt-1 text-[11px] text-red-600">{String(e.attendance_approver_id.message)}</p>
        )}
      </div>

      {/* Biometric Device */}
      <div>
        <Label>Biometric Device ID</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("biometric_device_id")} placeholder="Optional" />
        {e.biometric_device_id && <p className="mt-1 text-[11px] text-red-600">{e.biometric_device_id.message}</p>}
      </div>

      {/* Biometric Enrollment Date */}
      <div>
        <Label>Biometric Enrollment Date</Label>
        <input className={inputClass} type="date" disabled={isBusy} {...form.register("biometric_enrollment_date")} />
        {e.biometric_enrollment_date && (
          <p className="mt-1 text-[11px] text-red-600">{e.biometric_enrollment_date.message}</p>
        )}
      </div>

      {/* Checkboxes */}
      <div className="md:col-span-2 lg:col-span-3">
        <div className="rounded-xl border border-gray-200 p-3 flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" disabled={isBusy} {...form.register("eligible_for_overtime")} />
            <span className="text-[12px]" style={{ color: colors.primary }}>
              Eligible for overtime
            </span>
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" disabled={isBusy} {...form.register("flexible_arrival")} />
            <span className="text-[12px]" style={{ color: colors.primary }}>
              Flexible arrival
            </span>
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" disabled={isBusy} {...form.register("remote_work_permitted")} />
            <span className="text-[12px]" style={{ color: colors.primary }}>
              Remote work permitted
            </span>
          </label>
        </div>
      </div>

      {(saving || loadingMeta) && (
        <div className="lg:col-span-3 text-[11px] text-gray-500">{loadingMeta ? "Loading dropdowns..." : "Saving..."}</div>
      )}
    </div>
  );
});

export default DetailedAttendanceStep;
