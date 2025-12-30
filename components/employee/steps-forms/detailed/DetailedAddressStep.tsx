// src/features/enrollment/steps/DetailedAddressStep.tsx
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/components/api/client";
import type { StepComponentProps, StepHandle } from "../../stepComponents";

const colors = { primary: "#3D3A5C", coral: "#E8A99A" } as const;

const inputClass =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 disabled:bg-gray-50";
const textareaClass =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 min-h-[80px] disabled:bg-gray-50";

function Label({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
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
// Schema (matches your Postman payload)
// ─────────────────────────────────────────────────────────────
const addressSchema = z.object({
  line1: z.string().min(1, "Line 1 is required"),
  line2: z.string().optional().or(z.literal("")),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
  postal_code: z.string().min(1, "Postal code is required"),
});

const emergencySchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(6, "Phone is required"),
  relation: z.string().min(1, "Relation is required"),
});

const schema = z.object({
  mobile_primary: z.string().min(8, "Mobile primary is required"),
  mobile_secondary: z.string().optional().or(z.literal("")),
  landline: z.string().optional().or(z.literal("")),

  personal_email: z.string().email("Invalid email").optional().or(z.literal("")),
  company_email: z.string().email("Invalid email").optional().or(z.literal("")),

  current_address: addressSchema,
  permanent_address: addressSchema,

  emergency_1: emergencySchema,
  emergency_2: emergencySchema.partial().optional(),
});

type Values = z.infer<typeof schema>;

// ✅ Fix RHF resolver type issues
const resolver = zodResolver(schema) as unknown as Resolver<Values>;

const DetailedAddressStep = forwardRef<StepHandle, StepComponentProps>(function DetailedAddressStep(
  { enrollmentId, disabled },
  ref
) {
  const [saving, setSaving] = useState(false);

  const form = useForm<Values>({
    resolver,
    mode: "onTouched",
    defaultValues: {
      mobile_primary: "",
      mobile_secondary: "",
      landline: "",
      personal_email: "",
      company_email: "",

      current_address: { line1: "", line2: "", city: "", province: "", postal_code: "" },
      permanent_address: { line1: "", line2: "", city: "", province: "", postal_code: "" },

      emergency_1: { name: "", phone: "", relation: "" },
      emergency_2: { name: "", phone: "", relation: "" },
    },
  });

  const e = form.formState.errors;
  const isBusy = !!disabled || saving;

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

      // ✅ payload same as screenshot
      const payload = {
        mobile_primary: v.mobile_primary,
        mobile_secondary: v.mobile_secondary || "",
        landline: v.landline || "",
        personal_email: v.personal_email || "",
        company_email: v.company_email || "",

        current_address: {
          line1: v.current_address.line1,
          line2: v.current_address.line2 || "",
          city: v.current_address.city,
          province: v.current_address.province,
          postal_code: v.current_address.postal_code,
        },

        permanent_address: {
          line1: v.permanent_address.line1,
          line2: v.permanent_address.line2 || "",
          city: v.permanent_address.city,
          province: v.permanent_address.province,
          postal_code: v.permanent_address.postal_code,
        },

        emergency_1: {
          name: v.emergency_1.name,
          phone: v.emergency_1.phone,
          relation: v.emergency_1.relation,
        },

        emergency_2: {
          name: v.emergency_2?.name || "",
          phone: v.emergency_2?.phone || "",
          relation: v.emergency_2?.relation || "",
        },
      };

      await api.patch(`/v1/enrollments/${enrollmentId}/sections/address`, payload, {
        headers: { Accept: "application/json", "X-Company-Id": "1" },
      });

      return true;
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || "Failed to save Address");
      return false;
    } finally {
      setSaving(false);
    }
  };

  useImperativeHandle(ref, () => ({ submit }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {/* Mobile Primary */}
      <div>
        <Label required>Mobile (Primary)</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("mobile_primary")} placeholder="03XX-XXXXXXX" />
        {e.mobile_primary && <p className="mt-1 text-[11px] text-red-600">{e.mobile_primary.message}</p>}
      </div>

      {/* Mobile Secondary */}
      <div>
        <Label>Mobile (Secondary)</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("mobile_secondary")} placeholder="Optional" />
        {e.mobile_secondary && <p className="mt-1 text-[11px] text-red-600">{e.mobile_secondary.message}</p>}
      </div>

      {/* Landline */}
      <div>
        <Label>Landline</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("landline")} placeholder="Optional" />
        {e.landline && <p className="mt-1 text-[11px] text-red-600">{e.landline.message}</p>}
      </div>

      {/* Personal Email */}
      <div>
        <Label>Personal Email</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("personal_email")} placeholder="name@email.com" />
        {e.personal_email && <p className="mt-1 text-[11px] text-red-600">{e.personal_email.message}</p>}
      </div>

      {/* Company Email */}
      <div>
        <Label>Company Email</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("company_email")} placeholder="name@company.com" />
        {e.company_email && <p className="mt-1 text-[11px] text-red-600">{e.company_email.message}</p>}
      </div>

      {/* Current Address */}
      <div className="lg:col-span-3">
        <div className="rounded-xl border border-gray-200 p-3">
          <div className="text-[12px] font-bold mb-2" style={{ color: colors.primary }}>
            Current Address
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <Label required>Line 1</Label>
              <input className={inputClass} disabled={isBusy} {...form.register("current_address.line1")} />
              {e.current_address?.line1 && <p className="mt-1 text-[11px] text-red-600">{e.current_address.line1.message}</p>}
            </div>

            <div>
              <Label>Line 2</Label>
              <input className={inputClass} disabled={isBusy} {...form.register("current_address.line2")} />
              {e.current_address?.line2 && <p className="mt-1 text-[11px] text-red-600">{e.current_address.line2.message}</p>}
            </div>

            <div>
              <Label required>City</Label>
              <input className={inputClass} disabled={isBusy} {...form.register("current_address.city")} />
              {e.current_address?.city && <p className="mt-1 text-[11px] text-red-600">{e.current_address.city.message}</p>}
            </div>

            <div>
              <Label required>Province</Label>
              <input className={inputClass} disabled={isBusy} {...form.register("current_address.province")} />
              {e.current_address?.province && (
                <p className="mt-1 text-[11px] text-red-600">{e.current_address.province.message}</p>
              )}
            </div>

            <div>
              <Label required>Postal Code</Label>
              <input className={inputClass} disabled={isBusy} {...form.register("current_address.postal_code")} />
              {e.current_address?.postal_code && (
                <p className="mt-1 text-[11px] text-red-600">{e.current_address.postal_code.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Permanent Address */}
      <div className="lg:col-span-3">
        <div className="rounded-xl border border-gray-200 p-3">
          <div className="text-[12px] font-bold mb-2" style={{ color: colors.primary }}>
            Permanent Address
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <Label required>Line 1</Label>
              <input className={inputClass} disabled={isBusy} {...form.register("permanent_address.line1")} />
              {e.permanent_address?.line1 && (
                <p className="mt-1 text-[11px] text-red-600">{e.permanent_address.line1.message}</p>
              )}
            </div>

            <div>
              <Label>Line 2</Label>
              <input className={inputClass} disabled={isBusy} {...form.register("permanent_address.line2")} />
              {e.permanent_address?.line2 && (
                <p className="mt-1 text-[11px] text-red-600">{e.permanent_address.line2.message}</p>
              )}
            </div>

            <div>
              <Label required>City</Label>
              <input className={inputClass} disabled={isBusy} {...form.register("permanent_address.city")} />
              {e.permanent_address?.city && (
                <p className="mt-1 text-[11px] text-red-600">{e.permanent_address.city.message}</p>
              )}
            </div>

            <div>
              <Label required>Province</Label>
              <input className={inputClass} disabled={isBusy} {...form.register("permanent_address.province")} />
              {e.permanent_address?.province && (
                <p className="mt-1 text-[11px] text-red-600">{e.permanent_address.province.message}</p>
              )}
            </div>

            <div>
              <Label required>Postal Code</Label>
              <input className={inputClass} disabled={isBusy} {...form.register("permanent_address.postal_code")} />
              {e.permanent_address?.postal_code && (
                <p className="mt-1 text-[11px] text-red-600">{e.permanent_address.postal_code.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency #1 */}
      <div className="lg:col-span-3">
        <div className="rounded-xl border border-gray-200 p-3">
          <div className="text-[12px] font-bold mb-2" style={{ color: colors.primary }}>
            Emergency #1
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <Label required>Name</Label>
              <input className={inputClass} disabled={isBusy} {...form.register("emergency_1.name")} />
              {e.emergency_1?.name && <p className="mt-1 text-[11px] text-red-600">{e.emergency_1.name.message}</p>}
            </div>

            <div>
              <Label required>Phone</Label>
              <input className={inputClass} disabled={isBusy} {...form.register("emergency_1.phone")} />
              {e.emergency_1?.phone && <p className="mt-1 text-[11px] text-red-600">{e.emergency_1.phone.message}</p>}
            </div>

            <div>
              <Label required>Relation</Label>
              <input className={inputClass} disabled={isBusy} {...form.register("emergency_1.relation")} />
              {e.emergency_1?.relation && (
                <p className="mt-1 text-[11px] text-red-600">{e.emergency_1.relation.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency #2 */}
      <div className="lg:col-span-3">
        <div className="rounded-xl border border-gray-200 p-3">
          <div className="text-[12px] font-bold mb-2" style={{ color: colors.primary }}>
            Emergency #2 (Optional)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <Label>Name</Label>
              <input className={inputClass} disabled={isBusy} {...form.register("emergency_2.name")} />
              {e.emergency_2?.name && <p className="mt-1 text-[11px] text-red-600">{e.emergency_2.name.message}</p>}
            </div>

            <div>
              <Label>Phone</Label>
              <input className={inputClass} disabled={isBusy} {...form.register("emergency_2.phone")} />
              {e.emergency_2?.phone && <p className="mt-1 text-[11px] text-red-600">{e.emergency_2.phone.message}</p>}
            </div>

            <div>
              <Label>Relation</Label>
              <input className={inputClass} disabled={isBusy} {...form.register("emergency_2.relation")} />
              {e.emergency_2?.relation && (
                <p className="mt-1 text-[11px] text-red-600">{e.emergency_2.relation.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {saving && <div className="lg:col-span-3 text-[11px] text-gray-500">Saving...</div>}
    </div>
  );
});

export default DetailedAddressStep;
