// src/features/enrollment/steps/DetailedAssetsStep.tsx
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

// only for dropdown UX (can edit later)
const SIM_PROVIDERS = ["Jazz", "Zong", "Telenor", "Ufone", "Warid", "Other"] as const;
const ASSET_CATEGORIES = ["Laptop", "Desktop", "Tablet", "Mobile", "Other"] as const;
const ASSET_CONDITIONS = ["New", "Good", "Fair", "Needs Repair"] as const;

// ✅ ONLY these fields
const schema = z
  .object({
    company_id_card_number: z.string().min(1, "Company ID Card # is required"),
    access_card_rfid: z.string().min(1, "Access Card RFID is required"),

    has_assigned_parking: z.boolean(),
    parking_slot_number: z.string().optional().or(z.literal("")),

    email_account: z.string().min(1, "Email account is required"),
    ad_username: z.string().min(1, "AD username is required"),

    vpn_enabled: z.boolean().optional(),
    erp_system_access: z.boolean().optional(),
    hrms_portal_access: z.boolean().optional(),

    company_sim_number: z.string().min(1, "Company SIM # is required"),
    sim_provider: z.string().min(1, "SIM provider is required"),

    asset_1_category: z.string().min(1, "Asset category is required"),
    asset_1_brand_model: z.string().min(1, "Asset brand/model is required"),
    asset_1_serial_number: z.string().min(1, "Asset serial number is required"),
    asset_1_condition: z.string().optional().or(z.literal("")),
    asset_1_issue_date: z.string().min(1, "Asset issue date is required"),

    company_vehicle_assigned: z.string().optional().or(z.literal("")),
    vehicle_registration: z.string().optional().or(z.literal("")),
    vehicle_model: z.string().optional().or(z.literal("")),
  })
  .superRefine((v, ctx) => {
    // if parking assigned => parking slot required
    if (v.has_assigned_parking && !(v.parking_slot_number || "").trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["parking_slot_number"],
        message: "Parking Slot # is required when parking is assigned",
      });
    }

    // if company_vehicle_assigned has value => require registration + model
    const vehicleName = (v.company_vehicle_assigned || "").trim();
    if (vehicleName) {
      if (!(v.vehicle_registration || "").trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["vehicle_registration"],
          message: "Vehicle registration is required when a vehicle is assigned",
        });
      }
      if (!(v.vehicle_model || "").trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["vehicle_model"],
          message: "Vehicle model is required when a vehicle is assigned",
        });
      }
    }
  });

type Values = z.infer<typeof schema>;
const resolver = zodResolver(schema) as unknown as Resolver<Values>;

type AssetsSectionResponse = {
  success: boolean;
  data: {
    id: number;
    section: "assets";
    values: Partial<Record<keyof Values, any>>;
  };
};

const DEFAULTS: Values = {
  company_id_card_number: "",
  access_card_rfid: "",

  has_assigned_parking: false,
  parking_slot_number: "",

  email_account: "",
  ad_username: "",

  vpn_enabled: false,
  erp_system_access: false,
  hrms_portal_access: false,

  company_sim_number: "",
  sim_provider: "",

  asset_1_category: "",
  asset_1_brand_model: "",
  asset_1_serial_number: "",
  asset_1_condition: "",
  asset_1_issue_date: "",

  company_vehicle_assigned: "",
  vehicle_registration: "",
  vehicle_model: "",
};

const DetailedAssetsStep = forwardRef<StepHandle, StepComponentProps>(function DetailedAssetsStep(
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

  // ✅ Prefill (GET) /sections/assets
  useEffect(() => {
    let mounted = true;

    const prefill = async () => {
      if (!enrollmentId) return;

      try {
        setPrefillLoading(true);

        const res = await api.get<AssetsSectionResponse>(`/v1/enrollments/${enrollmentId}/sections/assets`, {
          headers: { Accept: "application/json", "X-Company-Id": "1" },
        });

        const v = (res?.data?.data?.values ?? {}) as any;
        if (!v || Object.keys(v).length === 0) return;
        if (!mounted) return;

        const next: Values = {
          company_id_card_number: v.company_id_card_number ?? "",
          access_card_rfid: v.access_card_rfid ?? "",

          has_assigned_parking: Boolean(v.has_assigned_parking),
          parking_slot_number: v.parking_slot_number ?? "",

          email_account: v.email_account ?? "",
          ad_username: v.ad_username ?? "",

          vpn_enabled: Boolean(v.vpn_enabled),
          erp_system_access: Boolean(v.erp_system_access),
          hrms_portal_access: Boolean(v.hrms_portal_access),

          company_sim_number: v.company_sim_number ?? "",
          sim_provider: v.sim_provider ?? "",

          asset_1_category: v.asset_1_category ?? "",
          asset_1_brand_model: v.asset_1_brand_model ?? "",
          asset_1_serial_number: v.asset_1_serial_number ?? "",
          asset_1_condition: v.asset_1_condition ?? "",
          asset_1_issue_date: v.asset_1_issue_date ?? "",

          // backend sends string like "Toyota Corolla"
          company_vehicle_assigned: v.company_vehicle_assigned ?? "",
          vehicle_registration: v.vehicle_registration ?? "",
          vehicle_model: v.vehicle_model ?? "",
        };

        form.reset(next, { keepDirty: false, keepTouched: false });
      } catch (err: any) {
        console.warn("Failed to prefill assets section", err?.response?.data || err);
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

  // ✅ Submit (PATCH) /sections/assets
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
        company_id_card_number: v.company_id_card_number,
        access_card_rfid: v.access_card_rfid,

        has_assigned_parking: !!v.has_assigned_parking,
        parking_slot_number: v.parking_slot_number || "",

        email_account: v.email_account,
        ad_username: v.ad_username,

        vpn_enabled: !!v.vpn_enabled,
        erp_system_access: !!v.erp_system_access,
        hrms_portal_access: !!v.hrms_portal_access,

        company_sim_number: v.company_sim_number,
        sim_provider: v.sim_provider,

        asset_1_category: v.asset_1_category,
        asset_1_brand_model: v.asset_1_brand_model,
        asset_1_serial_number: v.asset_1_serial_number,
        asset_1_condition: v.asset_1_condition || "",
        asset_1_issue_date: v.asset_1_issue_date,

        company_vehicle_assigned: v.company_vehicle_assigned || "",
        vehicle_registration: v.vehicle_registration || "",
        vehicle_model: v.vehicle_model || "",
      };

      await api.patch(`/v1/enrollments/${enrollmentId}/sections/assets`, payload, {
        headers: { Accept: "application/json", "X-Company-Id": "1" },
      });

      return true;
    } catch (err: any) {
      toast(err?.response?.data?.message || err?.message || "Failed to save Assets");
      return false;
    } finally {
      setSaving(false);
    }
  };

  useImperativeHandle(ref, () => ({ submit }), [enrollmentId]);

  if (!!enrollmentId && prefillLoading) return <Loader message="Loading Assets details…" fullHeight={false} />;
  if (saving) return <Loader message="Saving Assets details…" fullHeight={false} />;

  const parkingAssigned = form.watch("has_assigned_parking");
  const vehicleAssigned = !!(form.watch("company_vehicle_assigned") || "").trim();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      <div>
        <Label required>Company ID Card #</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("company_id_card_number")} />
        {e.company_id_card_number && <p className="mt-1 text-[11px] text-red-600">{e.company_id_card_number.message}</p>}
      </div>

      <div>
        <Label required>Access Card RFID</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("access_card_rfid")} />
        {e.access_card_rfid && <p className="mt-1 text-[11px] text-red-600">{e.access_card_rfid.message}</p>}
      </div>

      <div className="flex items-start gap-2 pt-6">
        <input type="checkbox" className="mt-1" disabled={isBusy} {...form.register("has_assigned_parking")} />
        <span className="text-[12px]" style={{ color: colors.primary }}>
          Has assigned parking
        </span>
      </div>

      <div>
        <Label required={parkingAssigned}>Parking Slot #</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("parking_slot_number")} />
        {e.parking_slot_number && <p className="mt-1 text-[11px] text-red-600">{e.parking_slot_number.message}</p>}
      </div>

      <div>
        <Label required>Email Account</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("email_account")} placeholder="ali@company.com" />
        {e.email_account && <p className="mt-1 text-[11px] text-red-600">{e.email_account.message}</p>}
      </div>

      <div>
        <Label required>AD Username</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("ad_username")} placeholder="ali_khan" />
        {e.ad_username && <p className="mt-1 text-[11px] text-red-600">{e.ad_username.message}</p>}
      </div>

      <div className="flex items-start gap-2">
        <input type="checkbox" className="mt-1" disabled={isBusy} {...form.register("vpn_enabled")} />
        <span className="text-[12px]" style={{ color: colors.primary }}>
          VPN enabled
        </span>
      </div>

      <div className="flex items-start gap-2">
        <input type="checkbox" className="mt-1" disabled={isBusy} {...form.register("erp_system_access")} />
        <span className="text-[12px]" style={{ color: colors.primary }}>
          ERP system access
        </span>
      </div>

      <div className="flex items-start gap-2">
        <input type="checkbox" className="mt-1" disabled={isBusy} {...form.register("hrms_portal_access")} />
        <span className="text-[12px]" style={{ color: colors.primary }}>
          HRMS portal access
        </span>
      </div>

      <div>
        <Label required>Company SIM #</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("company_sim_number")} />
        {e.company_sim_number && <p className="mt-1 text-[11px] text-red-600">{e.company_sim_number.message}</p>}
      </div>

      <div>
        <Label required>SIM Provider</Label>
        <select className={inputClass} disabled={isBusy} {...form.register("sim_provider")}>
          <option value="" disabled>
            Select...
          </option>
          {SIM_PROVIDERS.map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
        {e.sim_provider && <p className="mt-1 text-[11px] text-red-600">{e.sim_provider.message}</p>}
      </div>

      <div>
        <Label required>Asset 1 Category</Label>
        <select className={inputClass} disabled={isBusy} {...form.register("asset_1_category")}>
          <option value="" disabled>
            Select...
          </option>
          {ASSET_CATEGORIES.map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
        {e.asset_1_category && <p className="mt-1 text-[11px] text-red-600">{e.asset_1_category.message}</p>}
      </div>

      <div>
        <Label required>Asset 1 Brand/Model</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("asset_1_brand_model")} />
        {e.asset_1_brand_model && <p className="mt-1 text-[11px] text-red-600">{e.asset_1_brand_model.message}</p>}
      </div>

      <div>
        <Label required>Asset 1 Serial Number</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("asset_1_serial_number")} />
        {e.asset_1_serial_number && <p className="mt-1 text-[11px] text-red-600">{e.asset_1_serial_number.message}</p>}
      </div>

      <div>
        <Label>Asset 1 Condition</Label>
        <select className={inputClass} disabled={isBusy} {...form.register("asset_1_condition")}>
          <option value="">Select...</option>
          {ASSET_CONDITIONS.map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
        {e.asset_1_condition && <p className="mt-1 text-[11px] text-red-600">{e.asset_1_condition.message}</p>}
      </div>

      <div>
        <Label required>Asset 1 Issue Date</Label>
        <input className={inputClass} type="date" disabled={isBusy} {...form.register("asset_1_issue_date")} />
        {e.asset_1_issue_date && <p className="mt-1 text-[11px] text-red-600">{e.asset_1_issue_date.message}</p>}
      </div>

      <div className="lg:col-span-3">
        <Label>Company Vehicle Assigned</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("company_vehicle_assigned")} placeholder="e.g., Toyota Corolla" />
      </div>

      <div>
        <Label required={vehicleAssigned}>Vehicle Registration</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("vehicle_registration")} />
        {e.vehicle_registration && <p className="mt-1 text-[11px] text-red-600">{e.vehicle_registration.message}</p>}
      </div>

      <div>
        <Label required={vehicleAssigned}>Vehicle Model</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("vehicle_model")} />
        {e.vehicle_model && <p className="mt-1 text-[11px] text-red-600">{e.vehicle_model.message}</p>}
      </div>
    </div>
  );
});

export default DetailedAssetsStep;
