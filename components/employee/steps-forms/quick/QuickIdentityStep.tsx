// src/features/enrollment/steps-forms/quick/QuickIdentityStep.tsx
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/components/api/client";
import type { StepComponentProps, StepHandle } from "../../stepComponents";
import Loader from "@/components/common/Loader";
import { toast } from "sonner";

type Gender = {
  id: number;
  name: string;
  active: boolean;
};

const schema = z.object({
  first_name: z.string().min(1, "First Name is required"),
  middle_name: z.string().optional().or(z.literal("")),
  last_name: z.string().min(1, "Last Name is required"),
  father_or_husband_name: z.string().min(1, "Father/Husband Name is required"),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  gender_id: z.number().min(1, "Gender is required"),
cnic_number: z
  .string()
  .trim()
  .regex(/^\d{5}-\d{7}-\d{1}$/, "CNIC must be in format XXXXX-XXXXXXX-X"),

  cnic_issue_date: z.string().min(1, "CNIC issue date is required"),
  cnic_expiry_date: z.string().min(1, "CNIC expiry date is required"),
});

type Values = z.infer<typeof schema>;

type GenderMetaResponse = {
  data: Gender[];
  meta?: any;
};

type SectionResponse = {
  success: boolean;
  data: {
    id: number;
    section: "identity";
    values: Partial<{
      first_name: string | null;
      middle_name: string | null;
      last_name: string | null;
      father_or_husband_name: string | null;
      date_of_birth: string | null;
      gender_id: number | null;
      cnic_number: string | null;
      cnic_issue_date: string | null;
      cnic_expiry_date: string | null;
    }>;
  };
};

const DEFAULTS: Values = {
  first_name: "",
  middle_name: "",
  last_name: "",
  father_or_husband_name: "",
  date_of_birth: "",
  gender_id: 0,
  cnic_number: "",
  cnic_issue_date: "",
  cnic_expiry_date: "",
};

const QuickIdentityStep = forwardRef<StepHandle, StepComponentProps>(function QuickIdentityStep(
  { enrollmentId, disabled },
  ref
) {
  const [saving, setSaving] = useState(false);
  const [prefillLoading, setPrefillLoading] = useState(false);

  const [loadingGenders, setLoadingGenders] = useState(false);
  const [genders, setGenders] = useState<Gender[]>([]);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: DEFAULTS,
  });

  // ✅ Prefill Identity data when enrollmentId exists
  useEffect(() => {
    let mounted = true;

    const prefill = async () => {
      if (!enrollmentId) return;

      try {
        setPrefillLoading(true);

        const res = await api.get<SectionResponse>(
          `/v1/enrollments/${enrollmentId}/sections/identity`,
          {
            headers: {
              Accept: "application/json",
              "X-Company-Id": "1",
            },
          }
        );

        const values = res?.data?.data?.values ?? {};

        // if empty -> keep defaults
        if (!values || Object.keys(values).length === 0) return;
        if (!mounted) return;

        const next: Values = {
          first_name: values.first_name ?? "",
          middle_name: values.middle_name ?? "",
          last_name: values.last_name ?? "",
          father_or_husband_name: values.father_or_husband_name ?? "",
          date_of_birth: values.date_of_birth ?? "",
          gender_id: values.gender_id ?? 0,
          cnic_number: values.cnic_number ?? "",
          cnic_issue_date: values.cnic_issue_date ?? "",
          cnic_expiry_date: values.cnic_expiry_date ?? "",
        };

        form.reset(next, { keepDirty: false, keepTouched: false });
      } catch (e: any) {
        console.warn("Failed to prefill identity section", e?.response?.data || e);
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

  // ✅ Fetch genders once (meta)
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoadingGenders(true);

        const res = await api.get<GenderMetaResponse>("/meta/employee/gender?per_page=all", {
          headers: {
            Accept: "application/json",
            "X-Company-Id": "1",
          },
        });

        const list = Array.isArray(res.data?.data) ? res.data.data : [];
        const active = list.filter((g) => g.active !== false);

        if (!mounted) return;
        setGenders(active);

        // ✅ auto-select only if not selected (0) and we have at least one active
        const current = form.getValues("gender_id");
        if ((!current || current === 0) && active[0]?.id) {
          form.setValue("gender_id", active[0].id, { shouldValidate: true });
        }
      } catch (e: any) {
        if (!mounted) return;
        setGenders([]);
        console.warn("Failed to load genders", e);
      } finally {
        if (mounted) setLoadingGenders(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async () => {
    const ok = await form.trigger();
    if (!ok) return false;

    if (!enrollmentId) {
      toast("Enrollment draft not ready yet.");
      return false;
    }

    try {
      setSaving(true);

      const values = form.getValues();

      await api.patch(`/v1/enrollments/${enrollmentId}/sections/identity`, values, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Company-Id": "1",
        },
      });

      return true;
    } catch (e: any) {
      toast(e?.response?.data?.message || e?.message || "Failed to save Identity section");
      return false;
    } finally {
      setSaving(false);
    }
  };

  useImperativeHandle(ref, () => ({ submit }), [enrollmentId]);

  const isBusy = !!disabled || saving;
  const genderOptions = useMemo(() => genders, [genders]);

  // ✅ Block UI until prefill completes (only when enrollmentId exists)
  const showBlockingLoader = !!enrollmentId && prefillLoading;
  if (showBlockingLoader) {
    return <Loader message="Loading Identity details…" fullHeight={false} />;
  }

  // Optional: block while saving
  if (saving) {
    return <Loader message="Saving Identity details…" fullHeight={false} />;
  }

  const labelStyle = { color: "#3D3A5C" };
  const reqDot = <span className="w-1 h-1 rounded-full" style={{ background: "#E8A99A" }} />;
  const inputClass =
    "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200";
  const errorText = (msg?: string) => (msg ? <p className="mt-1 text-[11px] text-red-600">{msg}</p> : null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {/* First Name */}
      <div>
        <label className="flex items-center gap-1 text-[11px] font-semibold mb-1" style={labelStyle}>
          First Name {reqDot}
        </label>
        <input
          className={inputClass}
          disabled={isBusy}
          {...form.register("first_name")}
          placeholder="As per CNIC"
        />
        {errorText(form.formState.errors.first_name?.message)}
      </div>

      {/* Middle Name */}
      <div>
        <label className="flex items-center gap-1 text-[11px] font-semibold mb-1" style={labelStyle}>
          Middle Name
        </label>
        <input
          className={inputClass}
          disabled={isBusy}
          {...form.register("middle_name")}
          placeholder="Optional"
        />
        {errorText(form.formState.errors.middle_name?.message)}
      </div>

      {/* Last Name */}
      <div>
        <label className="flex items-center gap-1 text-[11px] font-semibold mb-1" style={labelStyle}>
          Last Name {reqDot}
        </label>
        <input
          className={inputClass}
          disabled={isBusy}
          {...form.register("last_name")}
          placeholder="As per CNIC"
        />
        {errorText(form.formState.errors.last_name?.message)}
      </div>

      {/* Father/Husband Name */}
      <div>
        <label className="flex items-center gap-1 text-[11px] font-semibold mb-1" style={labelStyle}>
          Father / Husband Name {reqDot}
        </label>
        <input
          className={inputClass}
          disabled={isBusy}
          {...form.register("father_or_husband_name")}
          placeholder="Muhammad Yousaf"
        />
        {errorText(form.formState.errors.father_or_husband_name?.message)}
      </div>

      {/* DOB */}
      <div>
        <label className="flex items-center gap-1 text-[11px] font-semibold mb-1" style={labelStyle}>
          Date of Birth {reqDot}
        </label>
        <input type="date" className={inputClass} disabled={isBusy} {...form.register("date_of_birth")} />
        {errorText(form.formState.errors.date_of_birth?.message)}
      </div>

      {/* Gender */}
      <div>
        <label className="flex items-center gap-1 text-[11px] font-semibold mb-1" style={labelStyle}>
          Gender {reqDot}
          {loadingGenders && <span className="ml-1 text-[10px] text-gray-400">(loading)</span>}
        </label>

        <select
          className={inputClass}
          disabled={isBusy || loadingGenders}
          {...form.register("gender_id", { valueAsNumber: true })}
        >
          <option value={0} disabled>
            Select...
          </option>

          {genderOptions.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        {errorText(form.formState.errors.gender_id?.message as any)}
      </div>

      {/* CNIC */}
      <div>
        <label className="flex items-center gap-1 text-[11px] font-semibold mb-1" style={labelStyle}>
          CNIC Number {reqDot}
        </label>
        <input
          className={inputClass}
          disabled={isBusy}
          {...form.register("cnic_number")}
          placeholder="35202-8945776-6"
        />
        {errorText(form.formState.errors.cnic_number?.message)}
      </div>

      {/* CNIC Issue */}
      <div>
        <label className="flex items-center gap-1 text-[11px] font-semibold mb-1" style={labelStyle}>
          CNIC Issue Date {reqDot}
        </label>
        <input type="date" className={inputClass} disabled={isBusy} {...form.register("cnic_issue_date")} />
        {errorText(form.formState.errors.cnic_issue_date?.message)}
      </div>

      {/* CNIC Expiry */}
      <div>
        <label className="flex items-center gap-1 text-[11px] font-semibold mb-1" style={labelStyle}>
          CNIC Expiry Date {reqDot}
        </label>
        <input type="date" className={inputClass} disabled={isBusy} {...form.register("cnic_expiry_date")} />
        {errorText(form.formState.errors.cnic_expiry_date?.message)}
      </div>
    </div>
  );
});

export default QuickIdentityStep;
