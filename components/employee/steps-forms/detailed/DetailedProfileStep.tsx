// src/features/enrollment/steps/DetailedProfileStep.tsx
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

const inputClass =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 disabled:bg-gray-50";
const textareaClass =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 min-h-[84px] resize-none disabled:bg-gray-50";

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-[11px] font-semibold mb-1 block" style={{ color: colors.primary }}>
      {children}{" "}
      {required ? (
        <span className="inline-block w-1 h-1 rounded-full align-middle" style={{ background: colors.coral }} />
      ) : null}
    </label>
  );
}

// ✅ ONLY these fields
const schema = z.object({
  professional_summary: z.string().optional().or(z.literal("")),

  degree_title: z.string().min(1, "Degree title is required"),
  year_of_passing: z.string().min(1, "Year of passing is required"),
  grade_gpa: z.string().min(1, "Grade/CGPA is required"),

  second_degree: z.string().optional().or(z.literal("")),
  second_institution: z.string().optional().or(z.literal("")),
  certifications: z.string().optional().or(z.literal("")),

  previous_employer: z.string().min(1, "Previous employer is required"),
  previous_salary: z.string().min(1, "Previous salary is required"),
  reason_for_leaving: z.string().min(1, "Reason for leaving is required"),
  previous_designation: z.string().min(1, "Previous designation is required"),

  skills_and_expertise: z.string().min(1, "Skills & Expertise is required"),
});

type Values = z.infer<typeof schema>;
const resolver = zodResolver(schema) as unknown as Resolver<Values>;

type ProfileApiValues = Record<string, any> | any[];
type ProfileSectionResponse = {
  success: boolean;
  data: {
    id: number;
    section: "profile";
    values: ProfileApiValues;
  };
};

const DEFAULTS: Values = {
  professional_summary: "",

  degree_title: "",
  year_of_passing: "",
  grade_gpa: "",

  second_degree: "",
  second_institution: "",
  certifications: "",

  previous_employer: "",
  previous_salary: "",
  reason_for_leaving: "",
  previous_designation: "",

  skills_and_expertise: "",
};

function normalizeValues(values: ProfileApiValues): Record<string, any> {
  if (!values) return {};
  if (Array.isArray(values)) return {}; // backend sometimes returns []
  if (typeof values === "object") return values;
  return {};
}

const DetailedProfileStep = forwardRef<StepHandle, StepComponentProps>(function DetailedProfileStep(
  { enrollmentId, disabled },
  ref
) {
  const [saving, setSaving] = useState(false);
  const [prefillLoading, setPrefillLoading] = useState(false);

  const form = useForm<Values>({
    resolver,
    mode: "onTouched",
    defaultValues: DEFAULTS,
  });

  const e = form.formState.errors;
  const isBusy = !!disabled || saving || prefillLoading;

  // ✅ Prefill (GET) /sections/profile
  useEffect(() => {
    let mounted = true;

    const prefill = async () => {
      if (!enrollmentId) return;

      try {
        setPrefillLoading(true);

        const res = await api.get<ProfileSectionResponse>(`/v1/enrollments/${enrollmentId}/sections/profile`, {
          headers: { Accept: "application/json", "X-Company-Id": "1" },
        });

        const raw = normalizeValues(res?.data?.data?.values);

        if (!raw || Object.keys(raw).length === 0) return;
        if (!mounted) return;

        const next: Values = {
          professional_summary: raw.professional_summary ?? "",

          degree_title: raw.degree_title ?? "",
          year_of_passing: raw.year_of_passing ?? "",
          grade_gpa: raw.grade_gpa ?? "",

          second_degree: raw.second_degree ?? "",
          second_institution: raw.second_institution ?? "",
          certifications: raw.certifications ?? "",

          previous_employer: raw.previous_employer ?? "",
          previous_salary: raw.previous_salary ?? "",
          reason_for_leaving: raw.reason_for_leaving ?? "",
          previous_designation: raw.previous_designation ?? "",

          skills_and_expertise: raw.skills_and_expertise ?? "",
        };

        form.reset(next, { keepDirty: false, keepTouched: false });
      } catch (err: any) {
        console.warn("Failed to prefill profile section", err?.response?.data || err);
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

  // ✅ Submit (PATCH) /sections/profile (payload = EXACT same keys)
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
        professional_summary: v.professional_summary || "",

        degree_title: v.degree_title,
        year_of_passing: v.year_of_passing,
        grade_gpa: v.grade_gpa,

        second_degree: v.second_degree || "",
        second_institution: v.second_institution || "",
        certifications: v.certifications || "",

        previous_employer: v.previous_employer,
        previous_salary: v.previous_salary,
        reason_for_leaving: v.reason_for_leaving,
        previous_designation: v.previous_designation,

        skills_and_expertise: v.skills_and_expertise,
      };

      await api.patch(`/v1/enrollments/${enrollmentId}/sections/profile`, payload, {
        headers: { Accept: "application/json", "X-Company-Id": "1" },
      });

      return true;
    } catch (err: any) {
      toast(err?.response?.data?.message || err?.message || "Failed to save Profile");
      return false;
    } finally {
      setSaving(false);
    }
  };

  useImperativeHandle(ref, () => ({ submit }), [enrollmentId]);

  if (!!enrollmentId && prefillLoading) return <Loader message="Loading Profile details…" fullHeight={false} />;
  if (saving) return <Loader message="Saving Profile details…" fullHeight={false} />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {/* Professional Summary */}
      <div className="lg:col-span-3">
        <Label>Professional Summary</Label>
        <textarea className={textareaClass} disabled={isBusy} {...form.register("professional_summary")} />
        {e.professional_summary && <p className="mt-1 text-[11px] text-red-600">{e.professional_summary.message}</p>}
      </div>

      {/* Degree Title */}
      <div>
        <Label required>Degree Title</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("degree_title")} />
        {e.degree_title && <p className="mt-1 text-[11px] text-red-600">{e.degree_title.message}</p>}
      </div>

      {/* Year of Passing */}
      <div>
        <Label required>Year of Passing</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("year_of_passing")} />
        {e.year_of_passing && <p className="mt-1 text-[11px] text-red-600">{e.year_of_passing.message}</p>}
      </div>

      {/* Grade/CGPA */}
      <div>
        <Label required>Grade/CGPA</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("grade_gpa")} />
        {e.grade_gpa && <p className="mt-1 text-[11px] text-red-600">{e.grade_gpa.message}</p>}
      </div>

      {/* Second Degree */}
      <div>
        <Label>Second Degree</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("second_degree")} />
      </div>

      {/* Second Institution */}
      <div>
        <Label>Second Institution</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("second_institution")} />
      </div>

      {/* Certifications */}
      <div className="lg:col-span-3">
        <Label>Certifications</Label>
        <textarea className={textareaClass} disabled={isBusy} {...form.register("certifications")} />
      </div>

      {/* Previous Employer */}
      <div>
        <Label required>Previous Employer</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("previous_employer")} />
        {e.previous_employer && <p className="mt-1 text-[11px] text-red-600">{e.previous_employer.message}</p>}
      </div>

      {/* Previous Designation */}
      <div>
        <Label required>Previous Designation</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("previous_designation")} />
        {e.previous_designation && <p className="mt-1 text-[11px] text-red-600">{e.previous_designation.message}</p>}
      </div>

      {/* Previous Salary */}
      <div>
        <Label required>Previous Salary</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("previous_salary")} />
        {e.previous_salary && <p className="mt-1 text-[11px] text-red-600">{e.previous_salary.message}</p>}
      </div>

      {/* Reason for Leaving */}
      <div className="lg:col-span-3">
        <Label required>Reason for Leaving</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("reason_for_leaving")} />
        {e.reason_for_leaving && <p className="mt-1 text-[11px] text-red-600">{e.reason_for_leaving.message}</p>}
      </div>

      {/* Skills & Expertise */}
      <div className="lg:col-span-3">
        <Label required>Skills & Expertise</Label>
        <textarea className={textareaClass} disabled={isBusy} {...form.register("skills_and_expertise")} />
        {e.skills_and_expertise && <p className="mt-1 text-[11px] text-red-600">{e.skills_and_expertise.message}</p>}
      </div>
    </div>
  );
});

export default DetailedProfileStep;
