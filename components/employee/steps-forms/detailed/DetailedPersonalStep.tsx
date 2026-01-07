// src/features/enrollment/steps/DetailedPersonalStep.tsx
"use client";

import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/components/api/client";
import type { StepComponentProps, StepHandle } from "../../stepComponents";
import Loader from "@/components/common/Loader";
import { toast } from "sonner";

const colors = { primary: "#3D3A5C", coral: "#E8A99A" } as const;

type Option = { id: number; name: string; active?: boolean };
type ApiListResponse = { data: Option[] };

type PersonalSectionResponse = {
  success: boolean;
  data: {
    id: number;
    section: "personal";
    values: Partial<{
      marital_status_id: number | string | null;
      spouse_name: string | null;
      marriage_date: string | null;

      number_of_children: number | string | null;
      number_of_dependents: number | string | null;

      blood_group_id: number | string | null;

      religion: string | null;
      nationality: string | null;

      domicile_province: string | null;

      medical_fitness_date: string | null;
      medical_conditions: string | null;

      person_with_disability: boolean | number | string | null;

      passport_number: string | null;
    }>;
  };
};

const inputClass =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 disabled:bg-gray-50";
const textareaClass =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 min-h-[90px] resize-none disabled:bg-gray-50";

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

async function fetchOptions(url: string): Promise<Option[]> {
  const res = await api.get<ApiListResponse>(url, {
    headers: { Accept: "application/json", "X-Company-Id": "1" },
  });
  const list = Array.isArray(res.data?.data) ? res.data.data : [];
  return list.filter((x) => (typeof x.active === "boolean" ? x.active : true));
}

const schema = z.object({
  marital_status_id: z.coerce.number().int().positive("Marital status is required"),
  spouse_name: z.string().optional().or(z.literal("")),
  marriage_date: z.string().optional().or(z.literal("")),

  number_of_children: z.coerce.number().int().min(0, "Must be 0 or more"),
  number_of_dependents: z.coerce.number().int().min(0, "Must be 0 or more"),

  blood_group_id: z.coerce.number().int().positive("Blood group is required"),

  religion: z.string().min(1, "Religion is required"),
  nationality: z.string().min(1, "Nationality is required"),

  // IMPORTANT: your API sends "Lahore" here, so keep it a free text field to avoid mismatch
  domicile_province: z.string().min(1, "Domicile province is required"),

  medical_fitness_date: z.string().optional().or(z.literal("")),
  medical_conditions: z.string().optional().or(z.literal("")),

  person_with_disability: z.coerce.boolean().optional().default(false),

  passport_number: z.string().optional().or(z.literal("")),
});

type Values = z.infer<typeof schema>;
const resolver = zodResolver(schema) as unknown as Resolver<Values>;

const DetailedPersonalStep = forwardRef<StepHandle, StepComponentProps>(function DetailedPersonalStep(
  { enrollmentId, disabled },
  ref
) {
  const [saving, setSaving] = useState(false);
  const [prefillLoading, setPrefillLoading] = useState(false);
  const [loadingMeta, setLoadingMeta] = useState(false);

  const [maritalStatuses, setMaritalStatuses] = useState<Option[]>([]);
  const [bloodGroups, setBloodGroups] = useState<Option[]>([]);

  const form = useForm<Values>({
    resolver,
    mode: "onTouched",
    defaultValues: {
      marital_status_id: 0,
      spouse_name: "",
      marriage_date: "",
      number_of_children: 0,
      number_of_dependents: 0,
      blood_group_id: 0,
      religion: "",
      nationality: "",
      domicile_province: "",
      medical_fitness_date: "",
      medical_conditions: "",
      person_with_disability: false,
      passport_number: "",
    },
  });

  const e = form.formState.errors;
  const isBusy = !!disabled || saving || prefillLoading || loadingMeta;

  // ✅ Load meta dropdowns (your exact endpoints)
  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setLoadingMeta(true);

        const [ms, bg] = await Promise.all([
          fetchOptions("/meta/employee/marital-statuses?per_page=all"),
          fetchOptions("/meta/employee/blood-groups?per_page=all"),
        ]);

        if (!mounted) return;

        setMaritalStatuses(ms);
        setBloodGroups(bg);

        // Auto-select first if still empty
        if (ms[0] && !Number(form.getValues("marital_status_id"))) form.setValue("marital_status_id", ms[0].id);
        if (bg[0] && !Number(form.getValues("blood_group_id"))) form.setValue("blood_group_id", bg[0].id);
      } catch (err: any) {
        toast(err?.response?.data?.message || err?.message || "Failed to load Personal dropdowns");
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

  // ✅ Prefill from section API
  useEffect(() => {
    let mounted = true;

    const prefill = async () => {
      if (!enrollmentId) return;

      try {
        setPrefillLoading(true);

        const res = await api.get<PersonalSectionResponse>(`/v1/enrollments/${enrollmentId}/sections/personal`, {
          headers: { Accept: "application/json", "X-Company-Id": "1" },
        });

        const values = res?.data?.data?.values ?? {};
        if (!mounted) return;

        // if empty, just keep defaults (do not reset to avoid wiping user's typing)
        if (!values || Object.keys(values).length === 0) return;

        form.reset(
          {
            marital_status_id: values.marital_status_id ? Number(values.marital_status_id) : form.getValues("marital_status_id") || 0,
            spouse_name: values.spouse_name ?? "",
            marriage_date: values.marriage_date ?? "",

            number_of_children: values.number_of_children != null ? Number(values.number_of_children) : 0,
            number_of_dependents: values.number_of_dependents != null ? Number(values.number_of_dependents) : 0,

            blood_group_id: values.blood_group_id ? Number(values.blood_group_id) : form.getValues("blood_group_id") || 0,

            religion: values.religion ?? "",
            nationality: values.nationality ?? "",

            domicile_province: values.domicile_province ?? "",

            medical_fitness_date: values.medical_fitness_date ?? "",
            medical_conditions: values.medical_conditions ?? "",

            person_with_disability:
              values.person_with_disability === true || values.person_with_disability === 1 || values.person_with_disability === "1",

            passport_number: values.passport_number ?? "",
          },
          { keepDirty: false, keepTouched: false }
        );
      } catch (err: any) {
        toast(err?.response?.data?.message || err?.message || "Failed to prefill Personal section");
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

      const payload = {
        marital_status_id: String(Number(v.marital_status_id)),
        spouse_name: v.spouse_name || "N/A",
        marriage_date: v.marriage_date || "",

        number_of_children: Number(v.number_of_children),
        number_of_dependents: Number(v.number_of_dependents),

        blood_group_id: String(Number(v.blood_group_id)),

        religion: v.religion,
        nationality: v.nationality,

        domicile_province: v.domicile_province,

        medical_fitness_date: v.medical_fitness_date || "",
        medical_conditions: v.medical_conditions || "",

        person_with_disability: !!v.person_with_disability,

        passport_number: v.passport_number || "",
      };

      await api.patch(`/v1/enrollments/${enrollmentId}/sections/personal`, payload, {
        headers: { Accept: "application/json", "X-Company-Id": "1" },
      });

      return true;
    } catch (err: any) {
      toast(err?.response?.data?.message || err?.message || "Failed to save Personal section");
      return false;
    } finally {
      setSaving(false);
    }
  };

  useImperativeHandle(ref, () => ({ submit }));

  if (!!enrollmentId && prefillLoading) return <Loader message="Loading Personal details…" fullHeight={false} />;
  if (saving) return <Loader message="Saving Personal details…" fullHeight={false} />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      <div>
        <Label required>Marital Status</Label>
        <select className={inputClass} disabled={isBusy} {...form.register("marital_status_id")}>
          <option value={0} disabled>
            Select...
          </option>
          {maritalStatuses.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </select>
        {e.marital_status_id && <p className="mt-1 text-[11px] text-red-600">{e.marital_status_id.message}</p>}
      </div>

      <div>
        <Label>Spouse Name</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("spouse_name")} />
      </div>

      <div>
        <Label>Marriage Date</Label>
        <input className={inputClass} type="date" disabled={isBusy} {...form.register("marriage_date")} />
      </div>

      <div>
        <Label required>Number of Children</Label>
        <input className={inputClass} type="number" disabled={isBusy} {...form.register("number_of_children")} />
        {e.number_of_children && <p className="mt-1 text-[11px] text-red-600">{e.number_of_children.message}</p>}
      </div>

      <div>
        <Label required>Number of Dependents</Label>
        <input className={inputClass} type="number" disabled={isBusy} {...form.register("number_of_dependents")} />
        {e.number_of_dependents && <p className="mt-1 text-[11px] text-red-600">{e.number_of_dependents.message}</p>}
      </div>

      <div>
        <Label required>Blood Group</Label>
        <select className={inputClass} disabled={isBusy} {...form.register("blood_group_id")}>
          <option value={0} disabled>
            Select...
          </option>
          {bloodGroups.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </select>
        {e.blood_group_id && <p className="mt-1 text-[11px] text-red-600">{e.blood_group_id.message}</p>}
      </div>

      <div>
        <Label required>Religion</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("religion")} placeholder="Islam" />
        {e.religion && <p className="mt-1 text-[11px] text-red-600">{e.religion.message}</p>}
      </div>

      <div>
        <Label required>Nationality</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("nationality")} placeholder="Pakistani" />
        {e.nationality && <p className="mt-1 text-[11px] text-red-600">{e.nationality.message}</p>}
      </div>

      <div>
        <Label required>Domicile Province</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("domicile_province")} placeholder="Lahore" />
        {e.domicile_province && <p className="mt-1 text-[11px] text-red-600">{e.domicile_province.message}</p>}
      </div>

      <div>
        <Label>Medical Fitness Date</Label>
        <input className={inputClass} type="date" disabled={isBusy} {...form.register("medical_fitness_date")} />
      </div>

      <div className="lg:col-span-2">
        <Label>Medical Conditions</Label>
        <textarea className={textareaClass} disabled={isBusy} {...form.register("medical_conditions")} placeholder="None" />
      </div>

      <div className="lg:col-span-3">
        <label className="flex items-center gap-2 text-[12px]" style={{ color: colors.primary }}>
          <input type="checkbox" disabled={isBusy} {...form.register("person_with_disability")} />
          Person with Disability
        </label>
      </div>

      <div>
        <Label>Passport Number</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("passport_number")} placeholder="ABC-1487" />
      </div>

      {loadingMeta && <div className="lg:col-span-3 text-[11px] text-gray-500">Loading dropdowns...</div>}
    </div>
  );
});

export default DetailedPersonalStep;
