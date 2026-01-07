// src/features/enrollment/steps/DetailedOverviewStep.tsx
"use client";

import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/components/api/client";
import type { StepComponentProps, StepHandle } from "../../stepComponents";
import Loader from "@/components/common/Loader";
import { toast } from "sonner";

const colors = { primary: "#3D3A5C", coral: "#E8A99A" } as const;

type Gender = { id: number; name: string; active: boolean };
type GenderMetaResponse = { data: Gender[]; meta?: any };

type Dept = { id: number; name: string; status?: string | null };

type DesignationRaw = {
  id: number;
  name?: string | null;
  designation_name?: string | null;
  title?: string | null;
  designation?: string | null;
  active?: boolean | number | null;
};

type Designation = { id: number; name: string; active?: boolean | number | null };

type OverviewSectionResponse = {
  success: boolean;
  data: {
    id: number;
    section: "overview";
    values: Partial<{
      first_name: string | null;
      middle_name: string | null;
      last_name: string | null;
      father_or_husband_name: string | null;

      date_of_birth: string | null;
      gender_id: number | string | null;

      cnic_number: string | null;
      cnic_issue_date: string | null;
      cnic_expiry_date: string | null;

      date_of_joining: string | null;

      department_id: number | string | null;
      designation_id: number | string | null;
      employment_class: string | null;

      company_id: number | string | null;
      role_id: number | string | null;
    }>;
  };
};

type ValidateUniqueResponse = {
  success: boolean;
  message?: string;
};

type CnicStatus = "idle" | "checking" | "ok" | "taken";

const inputClass =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 disabled:bg-gray-50";

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="ml-2 inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-700">
      {children}
    </span>
  );
}

function Label({
  children,
  required,
  badge,
}: {
  children: React.ReactNode;
  required?: boolean;
  badge?: "NADRA" | "EOBI";
}) {
  return (
    <label className="text-[11px] font-semibold mb-1 block" style={{ color: colors.primary }}>
      {children}
      {badge ? <Badge>{badge}</Badge> : null}{" "}
      {required ? (
        <span className="inline-block w-1 h-1 rounded-full align-middle" style={{ background: colors.coral }} />
      ) : null}
    </label>
  );
}

const toDate = (s: string) => {
  const d = new Date(`${s}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
};

// ✅ Your exact fetching style
async function fetchGenders() {
  const res = await api.get<GenderMetaResponse>("/meta/employee/gender?per_page=all", {
    headers: { Accept: "application/json", "X-Company-Id": "1" },
  });

  const list = Array.isArray(res.data?.data) ? res.data.data : [];
  return list.filter((g) => g.active !== false);
}

async function fetchDepartments() {
  const res = await api.post<{ data: Dept[] }>(
    "/departments/departments_index",
    { company_id: 1, per_page: 10 },
    { headers: { Accept: "application/json", "X-Company-Id": "1" } }
  );

  const list = Array.isArray(res.data?.data) ? res.data.data : [];
  return list.filter((d) => (d.status ? d.status.toLowerCase() === "active" : true));
}

const pickName = (x: DesignationRaw) => String(x.name ?? x.designation_name ?? x.title ?? x.designation ?? "").trim();

async function fetchDesignations() {
  const res = await api.post<{ data: DesignationRaw[] }>(
    "/meta/companies/designation/designation_index",
    { per_page: "all" },
    { headers: { Accept: "application/json", "X-Company-Id": "1" } }
  );

  const list = Array.isArray(res.data?.data) ? res.data.data : [];

  const normalized: Designation[] = list
    .map((x) => ({ id: x.id, name: pickName(x), active: x.active }))
    .filter((x) => x.name.length > 0) // ✅ remove blank options
    .filter((x) => (typeof x.active === "boolean" ? x.active : x.active === 1 || x.active == null));

  return normalized;
}

// ✅ Schema + issue/expiry compare
const schema = z
  .object({
    first_name: z.string().min(1, "First name is required"),
    middle_name: z.string().optional().or(z.literal("")),
    last_name: z.string().min(1, "Last name is required"),
    father_or_husband_name: z.string().min(1, "Father/Husband name is required"),

    date_of_birth: z.string().min(1, "DOB is required"),
    gender_id: z.coerce.number().int().positive("Gender is required"),

    cnic_number: z
      .string()
      .trim()
      .regex(/^\d{5}-\d{7}-\d{1}$/, "CNIC must be in format XXXXX-XXXXXXX-X"),
    cnic_issue_date: z.string().min(1, "CNIC issue date is required"),
    cnic_expiry_date: z.string().min(1, "CNIC expiry date is required"),

    date_of_joining: z.string().min(1, "DOJ is required"),

    department_id: z.coerce.number().int().positive("Department is required"),
    designation_id: z.coerce.number().int().positive("Designation is required"),

    employment_class: z.string().min(1, "Employment class is required"),

    // hidden but required by backend payload
    company_id: z.coerce.number().int().positive("Company is required"),
    role_id: z.coerce.number().int().positive("Role is required"),
  })
  .superRefine((val, ctx) => {
    const issue = toDate(val.cnic_issue_date);
    const expiry = toDate(val.cnic_expiry_date);

    if (!issue || !expiry) return;
    if (expiry <= issue) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cnic_expiry_date"],
        message: "CNIC expiry date must be after issue date",
      });
    }
  });

type Values = z.infer<typeof schema>;
const resolver = zodResolver(schema) as unknown as Resolver<Values>;

const DetailedOverviewStep = forwardRef<StepHandle, StepComponentProps>(function DetailedOverviewStep(
  { enrollmentId, disabled },
  ref
) {
  const [saving, setSaving] = useState(false);
  const [prefillLoading, setPrefillLoading] = useState(false);
  const [loadingMeta, setLoadingMeta] = useState(false);

  const [genders, setGenders] = useState<Gender[]>([]);
  const [departments, setDepartments] = useState<Dept[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);

  // ✅ CNIC uniqueness UI state (same as your QuickIdentityStep)
  const [cnicStatus, setCnicStatus] = useState<CnicStatus>("idle");
  const [cnicStatusMsg, setCnicStatusMsg] = useState<string>("");

  const lastCnicCheckRef = useRef<string>("");

  const cnicCacheRef = useRef<{ value: string; ok: boolean; msg?: string } | null>(null);
  const cnicInFlightRef = useRef<{ value: string; promise: Promise<boolean> } | null>(null);

  const form = useForm<Values>({
    resolver,
    mode: "onTouched",
    defaultValues: {
      first_name: "",
      middle_name: "",
      last_name: "",
      father_or_husband_name: "",

      date_of_birth: "",
      gender_id: 0,

      cnic_number: "",
      cnic_issue_date: "",
      cnic_expiry_date: "",

      date_of_joining: "",

      department_id: 0,
      designation_id: 0,

      employment_class: "White Collar",

      // hidden defaults
      company_id: 1,
      role_id: 2,
    },
  });

  const e = form.formState.errors;
  const isBusy = !!disabled || saving || loadingMeta || prefillLoading;

  const resetCnicUi = () => {
    setCnicStatus("idle");
    setCnicStatusMsg("");
    lastCnicCheckRef.current = "";
    cnicCacheRef.current = null;
    cnicInFlightRef.current = null;

    // clear manual error only (keep regex errors)
    if (form.formState.errors.cnic_number?.type === "manual") {
      form.clearErrors("cnic_number");
    }
  };

  /**
   * ✅ CNIC unique validation (copied behavior from QuickIdentityStep)
   */
  const validateCnicUnique = async (cnic: string): Promise<boolean> => {
    if (!enrollmentId) return true;

    const normalized = (cnic || "").trim();
    if (!normalized) return true;

    // 1) cache hit
    if (cnicCacheRef.current?.value === normalized) {
      return cnicCacheRef.current.ok;
    }

    // 2) in-flight hit
    if (cnicInFlightRef.current?.value === normalized) {
      return await cnicInFlightRef.current.promise;
    }

    lastCnicCheckRef.current = normalized;
    setCnicStatus("checking");
    setCnicStatusMsg("");

    const promise = (async () => {
      try {
        const res = await api.post<ValidateUniqueResponse>(
          `/v1/enrollments/${enrollmentId}/validate-unique`,
          { cnic_number: normalized },
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "X-Company-Id": "1",
            },
          }
        );

        const ok = !!res?.data?.success;
        const msg = res?.data?.message || "";

        // ignore outdated response
        if (lastCnicCheckRef.current !== normalized) return false;

        if (ok) {
          setCnicStatus("ok");
          setCnicStatusMsg(msg || "CNIC is available");

          if (form.formState.errors.cnic_number?.type === "manual") {
            form.clearErrors("cnic_number");
          }

          cnicCacheRef.current = { value: normalized, ok: true, msg };
          return true;
        }

        const takenMsg = msg || "CNIC already exists in the system";
        setCnicStatus("taken");
        setCnicStatusMsg(takenMsg);
        form.setError("cnic_number", { type: "manual", message: takenMsg });

        cnicCacheRef.current = { value: normalized, ok: false, msg: takenMsg };
        return false;
      } catch (err: any) {
        const status = err?.response?.status;

        if (status === 422) {
          const msgFromErrors =
            err?.response?.data?.errors?.cnic_number?.[0] ||
            err?.response?.data?.message ||
            "This CNIC is already registered.";

          if (lastCnicCheckRef.current !== normalized) return false;

          setCnicStatus("taken");
          setCnicStatusMsg(msgFromErrors);
          form.setError("cnic_number", { type: "manual", message: msgFromErrors });

          cnicCacheRef.current = { value: normalized, ok: false, msg: msgFromErrors };
          return false;
        }

        const msg = err?.response?.data?.message || err?.message || "Could not validate CNIC right now";
        setCnicStatus("idle");
        setCnicStatusMsg("");
        toast(msg);

        cnicCacheRef.current = { value: normalized, ok: false, msg };
        return false;
      } finally {
        if (cnicInFlightRef.current?.value === normalized) {
          cnicInFlightRef.current = null;
        }
      }
    })();

    cnicInFlightRef.current = { value: normalized, promise };
    return await promise;
  };

  // ✅ Load dropdowns
  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setLoadingMeta(true);

        const [gen, dep, des] = await Promise.all([fetchGenders(), fetchDepartments(), fetchDesignations()]);

        if (!mounted) return;

        setGenders(gen);
        setDepartments(dep);
        setDesignations(des);

        if (gen[0] && !Number(form.getValues("gender_id"))) form.setValue("gender_id", gen[0].id);
        if (dep[0] && !Number(form.getValues("department_id"))) form.setValue("department_id", dep[0].id);
        if (des[0] && !Number(form.getValues("designation_id"))) form.setValue("designation_id", des[0].id);
      } catch (err: any) {
        toast(err?.response?.data?.message || err?.message || "Failed to load Overview dropdowns");
      } finally {
        if (mounted) setLoadingMeta(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Prefill overview
  useEffect(() => {
    let mounted = true;

    const prefill = async () => {
      if (!enrollmentId) return;

      try {
        setPrefillLoading(true);

        const res = await api.get<OverviewSectionResponse>(`/v1/enrollments/${enrollmentId}/sections/overview`, {
          headers: { Accept: "application/json", "X-Company-Id": "1" },
        });

        const values = res?.data?.data?.values ?? {};
        if (!values || Object.keys(values).length === 0) return;
        if (!mounted) return;

        const next: Partial<Values> = {
          first_name: values.first_name ?? "",
          middle_name: values.middle_name ?? "",
          last_name: values.last_name ?? "",
          father_or_husband_name: values.father_or_husband_name ?? "",

          date_of_birth: values.date_of_birth ?? "",
          gender_id: values.gender_id ? Number(values.gender_id) : 0,

          cnic_number: values.cnic_number ?? "",
          cnic_issue_date: values.cnic_issue_date ?? "",
          cnic_expiry_date: values.cnic_expiry_date ?? "",

          date_of_joining: values.date_of_joining ?? "",

          department_id: values.department_id ? Number(values.department_id) : 0,
          designation_id: values.designation_id ? Number(values.designation_id) : 0,

          employment_class: values.employment_class ?? "White Collar",

          company_id: values.company_id ? Number(values.company_id) : form.getValues("company_id"),
          role_id: values.role_id ? Number(values.role_id) : form.getValues("role_id"),
        };

        form.reset(next as Values, { keepDirty: false, keepTouched: false });

        // ✅ reset CNIC uniqueness UI/cache on prefill (same as QuickIdentity)
        resetCnicUi();
      } catch (err: any) {
        console.warn("Failed to prefill overview section", err?.response?.data || err);
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

  const buildPayload = (v: Values) => ({
    first_name: String(v.first_name),
    middle_name: String(v.middle_name || ""),
    last_name: String(v.last_name),
    father_or_husband_name: String(v.father_or_husband_name),

    gender_id: String(Number(v.gender_id)),
    cnic_number: String(v.cnic_number),
    cnic_issue_date: v.cnic_issue_date,
    cnic_expiry_date: v.cnic_expiry_date,

    date_of_birth: v.date_of_birth,
    date_of_joining: v.date_of_joining,

    company_id: String(Number(v.company_id)),
    department_id: String(Number(v.department_id)),
    designation_id: String(Number(v.designation_id)),

    employment_class: v.employment_class,
    role_id: String(Number(v.role_id)),
  });

  const submit = async () => {
    const ok = await form.trigger();
    if (!ok) return false;

    if (!enrollmentId) {
      toast("Enrollment draft not ready yet.");
      return false;
    }

    // ✅ ensure CNIC unique before saving (same as QuickIdentity)
    const currentCnic = (form.getValues("cnic_number") || "").trim();
    if (currentCnic) {
      const onlyRegexOk = await form.trigger("cnic_number");
      if (!onlyRegexOk) return false;

      const uniqueOk = await validateCnicUnique(currentCnic);
      if (!uniqueOk) {
        form.setFocus("cnic_number");
        return false;
      }
    }

    try {
      setSaving(true);
      const payload = buildPayload(form.getValues());

      await api.patch(`/v1/enrollments/${enrollmentId}/sections/overview`, payload, {
        headers: { Accept: "application/json", "X-Company-Id": "1" },
      });

      return true;
    } catch (err: any) {
      toast(err?.response?.data?.message || err?.message || "Failed to save Overview");
      return false;
    } finally {
      setSaving(false);
    }
  };

  useImperativeHandle(ref, () => ({ submit }), [enrollmentId]);

  // ✅ loaders (no hooks error)
  if (!!enrollmentId && prefillLoading) return <Loader message="Loading Overview details…" fullHeight={false} />;
  if (saving) return <Loader message="Saving Overview details…" fullHeight={false} />;

  // CNIC register with custom blur handler (regex first -> unique check)
  const cnicReg = form.register("cnic_number");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {/* First name */}
      <div>
        <Label required badge="NADRA">
          First Name
        </Label>
        <input className={inputClass} disabled={isBusy} {...form.register("first_name")} placeholder="As per CNIC" />
        {e.first_name && <p className="mt-1 text-[11px] text-red-600">{e.first_name.message}</p>}
      </div>

      {/* Middle */}
      <div>
        <Label>Middle Name</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("middle_name")} />
        {e.middle_name && <p className="mt-1 text-[11px] text-red-600">{e.middle_name.message}</p>}
      </div>

      {/* Last */}
      <div>
        <Label required badge="NADRA">
          Last Name
        </Label>
        <input className={inputClass} disabled={isBusy} {...form.register("last_name")} placeholder="As per CNIC" />
        {e.last_name && <p className="mt-1 text-[11px] text-red-600">{e.last_name.message}</p>}
      </div>

      {/* Father/Husband */}
      <div className="md:col-span-2">
        <Label required badge="EOBI">
          Father's/Husband's Name
        </Label>
        <input className={inputClass} disabled={isBusy} {...form.register("father_or_husband_name")} />
        {e.father_or_husband_name && (
          <p className="mt-1 text-[11px] text-red-600">{e.father_or_husband_name.message}</p>
        )}
      </div>

      {/* DOB */}
      <div>
        <Label required badge="EOBI">
          Date of Birth
        </Label>
        <input className={inputClass} type="date" disabled={isBusy} {...form.register("date_of_birth")} />
        {e.date_of_birth && <p className="mt-1 text-[11px] text-red-600">{e.date_of_birth.message}</p>}
      </div>

      {/* Gender */}
      <div>
        <Label required>Gender</Label>
        <select className={inputClass} disabled={isBusy} {...form.register("gender_id")}>
          <option value={0} disabled>
            Select...
          </option>
          {genders.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </select>
        {e.gender_id && <p className="mt-1 text-[11px] text-red-600">{e.gender_id.message}</p>}
      </div>

      {/* CNIC */}
      <div>
        <label className="text-[11px] font-semibold mb-1 block" style={{ color: colors.primary }}>
          CNIC Number <Badge>NADRA</Badge>{" "}
          <span className="inline-block w-1 h-1 rounded-full align-middle" style={{ background: colors.coral }} />
          {cnicStatus === "checking" && <span className="ml-2 text-[10px] text-gray-500">Checking…</span>}
          {cnicStatus === "ok" && <span className="ml-2 text-[10px] text-green-600 font-semibold">✓ Available</span>}
        </label>

        <input
          className={inputClass}
          disabled={isBusy}
          {...cnicReg}
          placeholder="35202-8945776-6"
          onChange={(ev) => {
            cnicReg.onChange(ev);
            resetCnicUi();
          }}
          onBlur={async (ev) => {
            cnicReg.onBlur(ev);

            const v = (ev.target.value || "").trim();
            if (!v) return;

            // ✅ first regex validation (zod)
            const ok = await form.trigger("cnic_number");
            if (!ok) return;

            // ✅ then API uniqueness check
            await validateCnicUnique(v);
          }}
        />

        {e.cnic_number && <p className="mt-1 text-[11px] text-red-600">{e.cnic_number.message}</p>}
        {!e.cnic_number?.message &&
          cnicStatusMsg &&
          (cnicStatus === "ok" ? (
            <p className="mt-1 text-[11px] text-green-600">{cnicStatusMsg}</p>
          ) : cnicStatus === "taken" ? (
            <p className="mt-1 text-[11px] text-red-600">{cnicStatusMsg}</p>
          ) : null)}
      </div>

      <div>
        <Label required>CNIC Issue Date</Label>
        <input className={inputClass} type="date" disabled={isBusy} {...form.register("cnic_issue_date")} />
        {e.cnic_issue_date && <p className="mt-1 text-[11px] text-red-600">{e.cnic_issue_date.message}</p>}
      </div>

      <div>
        <Label required>CNIC Expiry Date</Label>
        <input className={inputClass} type="date" disabled={isBusy} {...form.register("cnic_expiry_date")} />
        {e.cnic_expiry_date && <p className="mt-1 text-[11px] text-red-600">{e.cnic_expiry_date.message}</p>}
      </div>

      {/* DOJ */}
      <div>
        <Label required>Date of Joining</Label>
        <input className={inputClass} type="date" disabled={isBusy} {...form.register("date_of_joining")} />
        {e.date_of_joining && <p className="mt-1 text-[11px] text-red-600">{e.date_of_joining.message}</p>}
      </div>

      {/* Department */}
      <div>
        <Label required>Department</Label>
        <select className={inputClass} disabled={isBusy} {...form.register("department_id")}>
          <option value={0} disabled>
            Select...
          </option>
          {departments.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </select>
        {e.department_id && <p className="mt-1 text-[11px] text-red-600">{e.department_id.message}</p>}
      </div>

      {/* Designation */}
      <div>
        <Label required>Designation</Label>
        <select className={inputClass} disabled={isBusy} {...form.register("designation_id")}>
          <option value={0} disabled>
            Select...
          </option>
          {designations.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </select>
        {e.designation_id && <p className="mt-1 text-[11px] text-red-600">{e.designation_id.message}</p>}
      </div>

      {/* Employment Class */}
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

      {/* hidden required */}
      <input type="hidden" {...form.register("company_id")} />
      <input type="hidden" {...form.register("role_id")} />

      {loadingMeta && <div className="lg:col-span-3 text-[11px] text-gray-500">Loading dropdowns...</div>}
    </div>
  );
});

export default DetailedOverviewStep;
