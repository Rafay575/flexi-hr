// src/features/enrollment/steps-forms/quick/QuickContactStep.tsx
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/components/api/client";
import type { StepComponentProps, StepHandle } from "../../stepComponents";
import Loader from "@/components/common/Loader";
import { toast } from "sonner";

const colors = {
  primary: "#3D3A5C",
  coral: "#E8A99A",
} as const;

// ✅ ONLY fields from your screenshot
const schema = z.object({
  mobile_primary: z
  .string()
  .trim()
  .regex(/^03\d{2}-\d{7}$/, "Mobile must be in format 03XX-XXXXXXX"),
  personal_email: z.string().email("Invalid email").optional().or(z.literal("")),
  current_full_address: z.string().min(5, "Current Address is required"),
  permanent_full_address: z.string().min(5, "Permanent Address is required"),
  emergency_1_name: z.string().min(2, "Emergency Contact Name is required"),
 emergency_1_phone: z
  .string()
  .trim()
  .regex(/^03\d{2}-\d{7}$/, "Phone must be in format 03XX-XXXXXXX"),

  emergency_1_relation: z.string().min(1, "Emergency Relation is required"),
});

type Values = z.infer<typeof schema>;

type ContactSectionResponse = {
  success: boolean;
  data: {
    id: number;
    section: "contact";
    values: Partial<{
      mobile_primary: string | null;
      personal_email: string | null;
      current_address: Partial<{ full_address: string | null }> | null;
      permanent_address: Partial<{ full_address: string | null }> | null;
      emergency_1: Partial<{ name: string | null; phone: string | null; relation: string | null }> | null;
    }>;
  };
};

const DEFAULTS: Values = {
  mobile_primary: "",
  personal_email: "",
  current_full_address: "",
  permanent_full_address: "",
  emergency_1_name: "",
  emergency_1_phone: "",
  emergency_1_relation: "",
};

const RELATION_OPTIONS = [
  "Father",
  "Mother",
  "Brother",
  "Sister",
  "Husband",
  "Wife",
  "Son",
  "Daughter",
  "Friend",
  "Other",
];

const inputClass =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 disabled:bg-gray-50";

function Field({
  label,
  required,
  error,
  badge,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-[11px] font-semibold mb-1 block" style={{ color: colors.primary }}>
        {label}{" "}
        {required && (
          <span className="inline-block w-1 h-1 rounded-full align-middle" style={{ background: colors.coral }} />
        )}
        {badge && (
          <span className="ml-2 inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-700">
            {badge}
          </span>
        )}
      </label>
      {children}
      {error && <p className="mt-1 text-[11px] text-red-600">{error}</p>}
    </div>
  );
}

const QuickContactStep = forwardRef<StepHandle, StepComponentProps>(function QuickContactStep(
  { enrollmentId, disabled },
  ref
) {
  const [saving, setSaving] = useState(false);
  const [prefillLoading, setPrefillLoading] = useState(false);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: DEFAULTS,
  });

  // ✅ PREFILL (GET) - /v1/enrollments/{id}/sections/contact
  useEffect(() => {
    let mounted = true;

    const prefill = async () => {
      if (!enrollmentId) return;

      try {
        setPrefillLoading(true);

        const res = await api.get<ContactSectionResponse>(`/v1/enrollments/${enrollmentId}/sections/contact`, {
          headers: { Accept: "application/json", "X-Company-Id": "1" },
        });

        const values = res?.data?.data?.values ?? {};

        // empty values => keep defaults
        if (!values || Object.keys(values).length === 0) return;
        if (!mounted) return;

        const cur = values.current_address ?? {};
        const per = values.permanent_address ?? {};
        const e1 = values.emergency_1 ?? {};

        const next: Values = {
          mobile_primary: values.mobile_primary ?? "",
          personal_email: values.personal_email ?? "",
          current_full_address: cur.full_address ?? "",
          permanent_full_address: per.full_address ?? "",
          emergency_1_name: e1.name ?? "",
          emergency_1_phone: e1.phone ?? "",
          emergency_1_relation: e1.relation ?? "",
        };

        form.reset(next, { keepDirty: false, keepTouched: false });
      } catch (e: any) {
        console.warn("Failed to prefill contact section", e?.response?.data || e);
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

  const isBusy = !!disabled || saving;
  const errors = form.formState.errors;

  // ✅ Payload: ONLY these fields (discard everything else)
  const buildPayload = (v: Values) => ({
    mobile_primary: v.mobile_primary,
    personal_email: v.personal_email || "",
    current_address: { full_address: v.current_full_address },
    permanent_address: { full_address: v.permanent_full_address },
    emergency_1: {
      name: v.emergency_1_name,
      phone: v.emergency_1_phone,
      relation: v.emergency_1_relation,
    },
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

      const values = form.getValues();
      const payload = buildPayload(values);

      await api.patch(`/v1/enrollments/${enrollmentId}/sections/contact`, payload, {
        headers: { Accept: "application/json", "X-Company-Id": "1" },
      });

      return true;
    } catch (e: any) {
      toast(e?.response?.data?.message || e?.message || "Failed to save Contact");
      return false;
    } finally {
      setSaving(false);
    }
  };

  useImperativeHandle(ref, () => ({ submit }), [enrollmentId]);

  // ✅ returns AFTER all hooks are declared (safe)
  if (!!enrollmentId && prefillLoading) {
    return <Loader message="Loading Contact details…" fullHeight={false} />;
  }

  if (saving) {
    return <Loader message="Saving Contact details…" fullHeight={false} />;
  }

  return (
      <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Row 1 */}
      <Field label="Mobile Number" required error={errors.mobile_primary?.message}>
        <input className={inputClass} disabled={isBusy} {...form.register("mobile_primary")} placeholder="03XX-XXXXXXX" />
      </Field>

      <Field label="Personal Email" error={errors.personal_email?.message}>
        <input className={inputClass} disabled={isBusy} {...form.register("personal_email")} placeholder="name@email.com" />
      </Field>

      {/* Row 2 */}
      <Field label="Current Address" required badge="EOBI" error={errors.current_full_address?.message}>
        <textarea
          className={`${inputClass} min-h-[84px] resize-none`}
          disabled={isBusy}
          {...form.register("current_full_address")}
          placeholder="House #, Street, Area, City"
        />
      </Field>

      <Field label="Permanent Address" required badge="EOBI" error={errors.permanent_full_address?.message}>
        <textarea
          className={`${inputClass} min-h-[84px] resize-none`}
          disabled={isBusy}
          {...form.register("permanent_full_address")}
          placeholder="House #, Street, Area, City"
        />
      </Field>

      {/* Row 3 */}
      
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 mt-4 gap-4">
      <Field label="Emergency Contact Name" required badge="Safety" error={errors.emergency_1_name?.message}>
        <input className={inputClass} disabled={isBusy} {...form.register("emergency_1_name")} placeholder="Full name" />
      </Field>

      <Field label="Emergency Contact Phone" required error={errors.emergency_1_phone?.message}>
        <input className={inputClass} disabled={isBusy} {...form.register("emergency_1_phone")} placeholder="03XX-XXXXXXX" />
      </Field>

      <Field label="Emergency Relation" required error={errors.emergency_1_relation?.message}>
        <select className={inputClass} disabled={isBusy} {...form.register("emergency_1_relation")}>
          <option value="" disabled>
            Select...
          </option>
          {RELATION_OPTIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </Field>
    </div>
    </>
  );
});

export default QuickContactStep;
