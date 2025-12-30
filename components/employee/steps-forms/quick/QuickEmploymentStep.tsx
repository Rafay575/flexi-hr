// src/features/enrollment/steps/QuickEmploymentStep.tsx
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/components/api/client";
import type { StepComponentProps, StepHandle } from "../../stepComponents";
import type { Resolver } from "react-hook-form";
import Loader from "@/components/common/Loader";
import { toast } from "sonner";

const colors = {
  primary: "#3D3A5C",
  coral: "#E8A99A",
} as const;

// ---------------- Types ----------------
type Dept = { id: number; name: string; status?: string };
type Designation = { id: number; title: string; active?: number | boolean };
type Role = { id: number; name: string; deleted_at?: string | null };

type EmploymentSectionResponse = {
  success: boolean;
  data: {
    id: number;
    section: "employment";
    values: Partial<{
      date_of_joining: string | null;
      department_id: number | null;
      designation_id: number | null;
      employment_class: string | null;
      employment_type: string | null;
      reporting_manager_id: number | null;
      probation_months: number | null;
      notice_period_days: number | null;
      role_id: string | number | null;
    }>;
  };
};

// ---------------- Schema ----------------
type Values = {
  date_of_joining: string;

  department_id: number;
  designation_id: number;
  role_id: number;

  employment_class: string;
  employment_type: string;

  probation_months: number;
  notice_period_days: number;

  // disabled, always null in payload
  reporting_manager_id?: number | "";
};

// keep your TS happy (resolver mismatch in zod v4)
const schema = z.object({
  date_of_joining: z.string().min(1, "Date of joining is required"),

  department_id: z.coerce.number().int().positive("Department is required"),
  designation_id: z.coerce.number().int().positive("Designation is required"),
  role_id: z.coerce.number().int().positive("Role is required"),

  employment_class: z.string().min(1, "Employment class is required"),
  employment_type: z.string().min(1, "Employment type is required"),

  probation_months: z.coerce.number().int().min(0, "Probation must be 0 or more"),
  notice_period_days: z.coerce.number().int().min(0, "Notice must be 0 or more"),

  reporting_manager_id: z.union([z.coerce.number().int().positive(), z.literal("")]).optional(),
});

const DEFAULTS: Values = {
  date_of_joining: "",
  department_id: 0,
  designation_id: 0,
  role_id: 0,
  employment_class: "White Collar",
  employment_type: "Permanent",
  probation_months: 6,
  notice_period_days: 30,
  reporting_manager_id: "",
};

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

// ---------------- API helpers ----------------
async function fetchDepartments() {
  const res = await api.post<{ data: Dept[] }>(
    "/departments/departments_index",
    { company_id: 1, per_page: 10 },
    { headers: { Accept: "application/json", "X-Company-Id": "1" } }
  );

  const list = Array.isArray(res.data?.data) ? res.data.data : [];
  // optional: only Active
  return list.filter((d) => (d.status ? d.status.toLowerCase() === "active" : true));
}

async function fetchDesignations() {
  const res = await api.post<{ data: Designation[] }>(
    "/meta/companies/designation/designation_index",
    { per_page: "all" },
    { headers: { Accept: "application/json", "X-Company-Id": "1" } }
  );

  const list = Array.isArray(res.data?.data) ? res.data.data : [];
  // active: 1/0 or true/false
  return list.filter((x) => (typeof x.active === "boolean" ? x.active : x.active === 1 || x.active == null));
}

async function fetchRoles() {
  const res = await api.get<Role[]>("/roles" );

  const list = Array.isArray(res.data) ? res.data : [];
  // remove soft-deleted
  return list.filter((r) => r.deleted_at == null);
}

// ---------------- Component ----------------
const QuickEmploymentStep = forwardRef<StepHandle, StepComponentProps>(function QuickEmploymentStep(
  { enrollmentId, disabled },
  ref
) {
  const [saving, setSaving] = useState(false);
  const [loadingMeta, setLoadingMeta] = useState(false);
  const [prefillLoading, setPrefillLoading] = useState(false);

  const [departments, setDepartments] = useState<Dept[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  // ✅ resolver cast (fixes the "unknown" TS issue)
  const resolver: Resolver<Values> = zodResolver(schema) as unknown as Resolver<Values>;

  const form = useForm<Values>({
    resolver,
    mode: "onTouched",
    defaultValues: DEFAULTS,
  });

  const e = form.formState.errors;
  const isBusy = !!disabled || saving || loadingMeta;

  // ✅ Load dropdowns (no branches)
  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setLoadingMeta(true);

        const [d, des, r] = await Promise.all([fetchDepartments(), fetchDesignations(), fetchRoles()]);

        if (!mounted) return;

        setDepartments(d);
        setDesignations(des);
        setRoles(r);
      } catch (err: any) {
        toast(err?.response?.data?.message || err?.message || "Failed to load Employment dropdowns");
      } finally {
        if (mounted) setLoadingMeta(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, []);

  // ✅ Prefill from section API
  useEffect(() => {
    let mounted = true;

    const prefill = async () => {
      if (!enrollmentId) return;

      try {
        setPrefillLoading(true);

        const res = await api.get<EmploymentSectionResponse>(`/v1/enrollments/${enrollmentId}/sections/employment`, {
          headers: { Accept: "application/json", "X-Company-Id": "1" },
        });

        const values = res?.data?.data?.values ?? {};
        if (!values || Object.keys(values).length === 0) return;
        if (!mounted) return;

        const next: Values = {
          date_of_joining: values.date_of_joining ?? "",

          department_id: values.department_id ?? 0,
          designation_id: values.designation_id ?? 0,
          role_id: values.role_id ? Number(values.role_id) : 0,

          employment_class: values.employment_class ?? "White Collar",
          employment_type: values.employment_type ?? "Permanent",

          probation_months: values.probation_months ?? 6,
          notice_period_days: values.notice_period_days ?? 30,

          // disabled
          reporting_manager_id: "",
        };

        form.reset(next, { keepDirty: false, keepTouched: false });
      } catch (err: any) {
        console.warn("Failed to prefill employment", err?.response?.data || err);
      } finally {
        if (mounted) setPrefillLoading(false);
      }
    };

    prefill();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enrollmentId]);

  const showBlockingLoader = loadingMeta || (!!enrollmentId && prefillLoading);

  const buildPayload = (v: Values) => ({
    date_of_joining: v.date_of_joining,
    department_id: Number(v.department_id),
    designation_id: Number(v.designation_id),
    employment_class: v.employment_class,
    employment_type: v.employment_type,
    probation_months: Number(v.probation_months),
    notice_period_days: Number(v.notice_period_days),

    // ✅ forced null + disabled
    reporting_manager_id: null,

    // backend wants string
    role_id: String(Number(v.role_id)),
  });

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
      const payload = buildPayload(v);

      await api.patch(`/v1/enrollments/${enrollmentId}/sections/employment`, payload, {
        headers: { Accept: "application/json", "X-Company-Id": "1" },
      });

      return true;
    } catch (err: any) {
      toast(err?.response?.data?.message || err?.message || "Failed to save Employment");
      return false;
    } finally {
      setSaving(false);
    }
  };

  useImperativeHandle(ref, () => ({ submit }), [enrollmentId]);

  if (showBlockingLoader) return <Loader message="Loading Employment details…" fullHeight={false} />;
  if (saving) return <Loader message="Saving Employment details…" fullHeight={false} />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {/* Date of joining */}
      <div>
        <Label required>Date of Joining</Label>
        <input className={inputClass} type="date" disabled={isBusy} {...form.register("date_of_joining")} />
        {e.date_of_joining && <p className="mt-1 text-[11px] text-red-600">{e.date_of_joining.message}</p>}
      </div>

      {/* Department */}
      <div>
        <Label required>Department</Label>
        <select className={inputClass} disabled={isBusy} {...form.register("department_id")}>
          <option value={0}>Select department...</option>
          {departments.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </select>
        {e.department_id && <p className="mt-1 text-[11px] text-red-600">{e.department_id.message}</p>}
      </div>

      {/* Designation (title) */}
      <div>
        <Label required>Designation</Label>
        <select className={inputClass} disabled={isBusy} {...form.register("designation_id")}>
          <option value={0}>Select designation...</option>
          {designations.map((x) => (
            <option key={x.id} value={x.id}>
              {x.title}
            </option>
          ))}
        </select>
        {e.designation_id && <p className="mt-1 text-[11px] text-red-600">{e.designation_id.message}</p>}
      </div>

      {/* Role */}
      <div>
        <Label required>Role</Label>
        <select className={inputClass} disabled={isBusy} {...form.register("role_id")}>
          <option value={0}>Select role...</option>
          {roles.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </select>
        {e.role_id && <p className="mt-1 text-[11px] text-red-600">{e.role_id.message}</p>}
      </div>

      {/* Reporting manager (disabled) */}
      <div>
        <Label>Reporting Manager</Label>
        <input className={inputClass} disabled value="—" readOnly />
        <p className="mt-1 text-[11px] text-gray-400">Disabled for now (assigned by HR).</p>
      </div>

      {/* Employment class */}
      <div>
        <Label required>Employment Class</Label>
        <select className={inputClass} disabled={isBusy} {...form.register("employment_class")}>
          {["White Collar", "Blue Collar", "Labor", "Contractual", "Intern"].map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
        {e.employment_class && <p className="mt-1 text-[11px] text-red-600">{e.employment_class.message}</p>}
      </div>

      {/* Employment type */}
      <div>
        <Label required>Employment Type</Label>
        <select className={inputClass} disabled={isBusy} {...form.register("employment_type")}>
          {["Permanent", "Probation", "Contract", "Daily Wage"].map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
        {e.employment_type && <p className="mt-1 text-[11px] text-red-600">{e.employment_type.message}</p>}
      </div>

      {/* Probation */}
      <div>
        <Label required>Probation (months)</Label>
        <input className={inputClass} type="number" disabled={isBusy} {...form.register("probation_months")} />
        {e.probation_months && <p className="mt-1 text-[11px] text-red-600">{e.probation_months.message}</p>}
      </div>

      {/* Notice */}
      <div>
        <Label required>Notice Period (days)</Label>
        <input className={inputClass} type="number" disabled={isBusy} {...form.register("notice_period_days")} />
        {e.notice_period_days && <p className="mt-1 text-[11px] text-red-600">{e.notice_period_days.message}</p>}
      </div>
    </div>
  );
});

export default QuickEmploymentStep;
