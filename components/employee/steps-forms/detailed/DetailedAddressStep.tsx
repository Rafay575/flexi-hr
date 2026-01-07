// src/features/enrollment/steps/DetailedAddressStep.tsx
"use client";

import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useForm, type Resolver, useWatch } from "react-hook-form";
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
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 min-h-[92px] resize-none disabled:bg-gray-50";

type ApiItem = { id: number | string; name: string };

// 🇵🇰 fixed country for now
const FIXED_COUNTRY_ID = "167";

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
] as const;

type RelationValue = (typeof RELATION_OPTIONS)[number];

// ✅ Residence Type hard-coded (no API)
const RESIDENCE_TYPE_OPTIONS = ["Owned", "Rented", "Company Provided", "Other"] as const;
type ResidenceTypeValue = (typeof RESIDENCE_TYPE_OPTIONS)[number];

// ─────────────────────────────────────────────────────────────
// Countries/Provinces/Cities fetchers (IDs)
// ─────────────────────────────────────────────────────────────
export async function fetchAllCountries(): Promise<{ value: string; label: string }[]> {
  const res = await api.get<{ data: ApiItem[] }>("/countries", {
    params: { all: true, per_page: "all" },
  });
  return (res.data?.data ?? []).map((c) => ({ value: String(c.id), label: c.name }));
}

export async function fetchStatesByCountry(countryId?: string): Promise<{ value: string; label: string }[]> {
  if (!countryId) return [];
  const res = await api.get<{ data: ApiItem[] }>("/states", {
    params: { country_id: countryId, all: true, per_page: "all" },
  });
  return (res.data?.data ?? []).map((s) => ({ value: String(s.id), label: s.name }));
}

export async function fetchCitiesByState(stateId?: string): Promise<{ value: string; label: string }[]> {
  if (!stateId) return [];
  const res = await api.get<{ data: ApiItem[] }>("/cities", {
    params: { state_id: stateId, all: true, per_page: "all" },
  });
  return (res.data?.data ?? []).map((c) => ({ value: String(c.id), label: c.name }));
}

// ─────────────────────────────────────────────────────────────
// Prefill response type (IDs for city/province)
// ─────────────────────────────────────────────────────────────
type AddressSectionResponse = {
  success: boolean;
  data: {
    id: number;
    section: "address";
    values: Partial<{
      mobile_primary: string | null;
      mobile_secondary: string | null;
      landline: string | null;

      personal_email: string | null;
      company_email: string | null;

      residence_type: string | null; // nullable string max 50
      residence_since: string | null; // nullable date

      current_address: Partial<{
        line1: string | null;
        line2: string | null;
        city: number | string | null;
        province: number | string | null;
        postal_code: string | null;
      }> | null;

      permanent_address: Partial<{
        line1: string | null;
        line2: string | null;
        city: number | string | null;
        province: number | string | null;
        postal_code: string | null;
      }> | null;

      emergency_1: Partial<{
        name: string | null;
        phone: string | null;
        relation: string | null;
        address: string | null;
      }> | null;

      emergency_2: Partial<{
        name: string | null;
        phone: string | null;
        relation: string | null;
        address: string | null;
      }> | null;
    }>;
  };
};

// ─────────────────────────────────────────────────────────────
// Unique validation
// ─────────────────────────────────────────────────────────────
type UniqueKey = "mobile_primary" | "personal_email" | "company_email";
type UniqueStatus = "idle" | "checking" | "ok" | "taken";
type ValidateUniqueResponse = { success: boolean; message?: string };

// ─────────────────────────────────────────────────────────────
// UI helpers
// ─────────────────────────────────────────────────────────────
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
  badge?: "EOBI" | "Safety";
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

// ─────────────────────────────────────────────────────────────
// Schema
// - Mobile accepts 03XX-XXXXXXX OR 03XXXXXXXXX
// - province/city are IDs (string)
// - company_email required
// - postal_code required
// - residence_type optional string (max 50), residence_since optional date
// ─────────────────────────────────────────────────────────────
const mobileOk = (v: string) => /^03\d{2}-\d{7}$/.test(v) || /^03\d{9}$/.test(v);

const schema = z.object({
  mobile_primary: z.string().trim().refine(mobileOk, "Mobile must be 03XX-XXXXXXX or 03XXXXXXXXX"),
  mobile_secondary: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || mobileOk(v), { message: "Mobile must be 03XX-XXXXXXX or 03XXXXXXXXX" }),
  landline: z.string().trim().optional().or(z.literal("")),

  personal_email: z.string().trim().email("Invalid email").optional().or(z.literal("")),
  company_email: z.string().trim().email("Invalid email").min(1, "Company Email is required"),

  residence_type: z.string().trim().max(50, "Max 50 chars").optional().or(z.literal("")),
  residence_since: z.string().trim().optional().or(z.literal("")),

  // Current
  current_line1: z.string().min(1, "Current Address Line 1 is required"),
  current_line2: z.string().optional().or(z.literal("")),
  current_province: z.string().min(1, "Current Province is required"),
  current_city: z.string().min(1, "Current City is required"),
  current_postal_code: z.string().min(1, "Current Postal Code is required"),

  // Permanent
  permanent_line1: z.string().min(1, "Permanent Address Line 1 is required"),
  permanent_line2: z.string().optional().or(z.literal("")),
  permanent_province: z.string().min(1, "Permanent Province is required"),
  permanent_city: z.string().min(1, "Permanent City is required"),
  permanent_postal_code: z.string().min(1, "Permanent Postal Code is required"),

  // Emergency 1
  emergency_1_name: z.string().min(2, "Emergency #1 name is required"),
  emergency_1_phone: z.string().trim().refine(mobileOk, "Phone must be 03XX-XXXXXXX or 03XXXXXXXXX"),
  emergency_1_relation: z
    .string()
    .min(1, "Emergency #1 relation is required")
    .refine((v) => (RELATION_OPTIONS as readonly string[]).includes(v), { message: "Invalid relation" }),
  
  // Emergency 2
  emergency_2_name: z.string().trim().optional().or(z.literal("")),
  emergency_2_phone: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || mobileOk(v), { message: "Phone must be 03XX-XXXXXXX or 03XXXXXXXXX" }),
  emergency_2_relation: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || (RELATION_OPTIONS as readonly string[]).includes(v), { message: "Invalid relation" }),
 
});

type Values = z.infer<typeof schema>;
const resolver = zodResolver(schema) as unknown as Resolver<Values>;

const DEFAULTS: Values = {
  mobile_primary: "",
  mobile_secondary: "",
  landline: "",

  personal_email: "",
  company_email: "",

  residence_type: "",
  residence_since: "",

  current_line1: "",
  current_line2: "",
  current_province: "",
  current_city: "",
  current_postal_code: "",

  permanent_line1: "",
  permanent_line2: "",
  permanent_province: "",
  permanent_city: "",
  permanent_postal_code: "",

  emergency_1_name: "",
  emergency_1_phone: "",
  emergency_1_relation: "Father",


  emergency_2_name: "",
  emergency_2_phone: "",
  emergency_2_relation: "",

};

const DetailedAddressStep = forwardRef<StepHandle, StepComponentProps>(function DetailedAddressStep(
  { enrollmentId, disabled },
  ref
) {
  const [saving, setSaving] = useState(false);
  const [prefillLoading, setPrefillLoading] = useState(false);
  const [loadingMeta, setLoadingMeta] = useState(false);

  // dropdowns
  const [countries, setCountries] = useState<{ value: string; label: string }[]>([]);
  const [provinces, setProvinces] = useState<{ value: string; label: string }[]>([]);
  const [currentCities, setCurrentCities] = useState<{ value: string; label: string }[]>([]);
  const [permanentCities, setPermanentCities] = useState<{ value: string; label: string }[]>([]);

  // unique status
  const [uniq, setUniq] = useState<Record<UniqueKey, { status: UniqueStatus; msg: string }>>({
    mobile_primary: { status: "idle", msg: "" },
    personal_email: { status: "idle", msg: "" },
    company_email: { status: "idle", msg: "" },
  });

  const setUniqState = (key: UniqueKey, status: UniqueStatus, msg = "") =>
    setUniq((prev) => ({ ...prev, [key]: { status, msg } }));

  const lastCheckRef = useRef<Record<UniqueKey, string>>({
    mobile_primary: "",
    personal_email: "",
    company_email: "",
  });

  const uniqCacheRef = useRef<Record<UniqueKey, { value: string; ok: boolean; msg?: string } | null>>({
    mobile_primary: null,
    personal_email: null,
    company_email: null,
  });

  const uniqInFlightRef = useRef<Record<UniqueKey, { value: string; promise: Promise<boolean> } | null>>({
    mobile_primary: null,
    personal_email: null,
    company_email: null,
  });

  const form = useForm<Values>({
    resolver,
    mode: "onTouched",
    defaultValues: DEFAULTS,
  });

  const e = form.formState.errors;
  const isBusy = !!disabled || saving || prefillLoading || loadingMeta;

  const currentProvinceId = useWatch({ control: form.control, name: "current_province" });
  const permanentProvinceId = useWatch({ control: form.control, name: "permanent_province" });

  const UniqueBadge = ({ k }: { k: UniqueKey }) => {
    const st = uniq[k].status;
    if (st === "checking") {
      return (
        <span className="ml-2 inline-flex items-center gap-1 text-[10px] text-gray-500">
          <span className="relative inline-flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gray-300 opacity-60" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-gray-400" />
          </span>
          Checking…
        </span>
      );
    }
    if (st === "ok") return <span className="ml-2 text-[10px] text-green-600 font-semibold">✓ Available</span>;
    return null;
  };

  const validateUnique = async (key: UniqueKey, valueRaw: string): Promise<boolean> => {
    if (!enrollmentId) return true;
    const value = (valueRaw || "").trim();
    if (!value) return true;

    if (uniqCacheRef.current[key]?.value === value) return !!uniqCacheRef.current[key]?.ok;
    if (uniqInFlightRef.current[key]?.value === value) return await uniqInFlightRef.current[key]!.promise;

    lastCheckRef.current[key] = value;
    setUniqState(key, "checking", "");

    const promise = (async () => {
      try {
        const res = await api.post<ValidateUniqueResponse>(
          `/v1/enrollments/${enrollmentId}/validate-unique`,
          { [key]: value },
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

        if (lastCheckRef.current[key] !== value) return false;

        if (ok) {
          setUniqState(key, "ok", msg || "Available");
          if ((form.formState.errors as any)[key]?.type === "manual") form.clearErrors(key as any);
          uniqCacheRef.current[key] = { value, ok: true, msg };
          return true;
        }

        const takenMsg = msg || "Already registered";
        setUniqState(key, "taken", takenMsg);
        form.setError(key as any, { type: "manual", message: takenMsg });
        uniqCacheRef.current[key] = { value, ok: false, msg: takenMsg };
        return false;
      } catch (err: any) {
        const status = err?.response?.status;

        if (status === 422) {
          const msgFromErrors =
            err?.response?.data?.errors?.[key]?.[0] || err?.response?.data?.message || "Already registered";
          if (lastCheckRef.current[key] !== value) return false;

          setUniqState(key, "taken", msgFromErrors);
          form.setError(key as any, { type: "manual", message: msgFromErrors });
          uniqCacheRef.current[key] = { value, ok: false, msg: msgFromErrors };
          return false;
        }

        toast.error(err?.response?.data?.message || err?.message || "Could not validate right now");
        setUniqState(key, "idle", "");
        uniqCacheRef.current[key] = { value, ok: false, msg: "Could not validate right now" };
        return false;
      } finally {
        if (uniqInFlightRef.current[key]?.value === value) uniqInFlightRef.current[key] = null;
      }
    })();

    uniqInFlightRef.current[key] = { value, promise };
    return await promise;
  };

  const bindUniqueField = (key: UniqueKey) => {
    const reg = form.register(key as any);
    return {
      ...reg,
      onChange: (ev: any) => {
        reg.onChange(ev);
        setUniqState(key, "idle", "");
        lastCheckRef.current[key] = "";
        uniqCacheRef.current[key] = null;
        uniqInFlightRef.current[key] = null;
        if ((form.formState.errors as any)[key]?.type === "manual") form.clearErrors(key as any);
      },
      onBlur: async (ev: any) => {
        reg.onBlur(ev);
        const v = (ev.target.value || "").trim();
        if (!v) return;

        const ok = await form.trigger(key as any);
        if (!ok) return;

        await validateUnique(key, v);
      },
    };
  };

  // Load country + provinces (fixed country)
  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setLoadingMeta(true);
        const [cts, provs] = await Promise.all([fetchAllCountries(), fetchStatesByCountry(FIXED_COUNTRY_ID)]);
        if (!mounted) return;

        setCountries(cts);
        setProvinces(provs);

        if (!form.getValues("current_province") && provs[0]?.value) form.setValue("current_province", provs[0].value);
        if (!form.getValues("permanent_province") && provs[0]?.value) form.setValue("permanent_province", provs[0].value);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || err?.message || "Failed to load provinces/countries");
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

  // Load current cities
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        if (!currentProvinceId) {
          if (mounted) setCurrentCities([]);
          return;
        }
        const list = await fetchCitiesByState(currentProvinceId);
        if (!mounted) return;
        setCurrentCities(list);

        const curCity = form.getValues("current_city");
        if (!curCity && list[0]?.value) form.setValue("current_city", list[0].value);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || err?.message || "Failed to load current cities");
      }
    };

    load();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProvinceId]);

  // Load permanent cities
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        if (!permanentProvinceId) {
          if (mounted) setPermanentCities([]);
          return;
        }
        const list = await fetchCitiesByState(permanentProvinceId);
        if (!mounted) return;
        setPermanentCities(list);

        const perCity = form.getValues("permanent_city");
        if (!perCity && list[0]?.value) form.setValue("permanent_city", list[0].value);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || err?.message || "Failed to load permanent cities");
      }
    };

    load();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permanentProvinceId]);

  // Prefill
  useEffect(() => {
    let mounted = true;

    const prefill = async () => {
      if (!enrollmentId) return;

      try {
        setPrefillLoading(true);

        const res = await api.get<AddressSectionResponse>(`/v1/enrollments/${enrollmentId}/sections/address`, {
          headers: { Accept: "application/json", "X-Company-Id": "1" },
        });

        const v = res?.data?.data?.values ?? {};
        if (!v || Object.keys(v).length === 0) return;
        if (!mounted) return;

        const cur = v.current_address ?? {};
        const per = v.permanent_address ?? {};
        const em1 = v.emergency_1 ?? {};
        const em2 = v.emergency_2 ?? {};

        const next: Partial<Values> = {
          mobile_primary: v.mobile_primary ?? "",
          mobile_secondary: v.mobile_secondary ?? "",
          landline: v.landline ?? "",

          personal_email: v.personal_email ?? "",
          company_email: v.company_email ?? "",

          residence_type: v.residence_type ?? "",
          residence_since: v.residence_since ?? "",

          current_line1: cur.line1 ?? "",
          current_line2: cur.line2 ?? "",
          current_province: cur.province ? String(cur.province) : "",
          current_city: cur.city ? String(cur.city) : "",
          current_postal_code: cur.postal_code ?? "",

          permanent_line1: per.line1 ?? "",
          permanent_line2: per.line2 ?? "",
          permanent_province: per.province ? String(per.province) : "",
          permanent_city: per.city ? String(per.city) : "",
          permanent_postal_code: per.postal_code ?? "",

          emergency_1_name: em1.name ?? "",
          emergency_1_phone: em1.phone ?? "",
          emergency_1_relation: (em1.relation as RelationValue) ?? "Father",
         

          emergency_2_name: em2.name ?? "",
          emergency_2_phone: em2.phone ?? "",
          emergency_2_relation: (em2.relation as any) ?? "",
        
        };

        form.reset(next as Values, { keepDirty: false, keepTouched: false });

        (["mobile_primary", "personal_email", "company_email"] as UniqueKey[]).forEach((k) => {
          setUniqState(k, "idle", "");
          lastCheckRef.current[k] = "";
          uniqCacheRef.current[k] = null;
          uniqInFlightRef.current[k] = null;
        });
      } catch (err: any) {
        console.warn("Failed to prefill address section", err?.response?.data || err);
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
    mobile_primary: v.mobile_primary,
    mobile_secondary: v.mobile_secondary || "",
    landline: v.landline || "",

    personal_email: v.personal_email || "",
    company_email: v.company_email,

    residence_type: v.residence_type || null,
    residence_since: v.residence_since || null,

    current_address: {
      line1: v.current_line1,
      line2: v.current_line2 || "",
      city: String(v.current_city),
      province: String(v.current_province),
      postal_code: v.current_postal_code,
      country_id: FIXED_COUNTRY_ID,
    },

    permanent_address: {
      line1: v.permanent_line1,
      line2: v.permanent_line2 || "",
      city: String(v.permanent_city),
      province: String(v.permanent_province),
      postal_code: v.permanent_postal_code,
      country_id: FIXED_COUNTRY_ID,
    },

    emergency_1: {
      name: v.emergency_1_name,
      phone: v.emergency_1_phone,
      relation: v.emergency_1_relation,
     
    },

    emergency_2: {
      name: v.emergency_2_name || "",
      phone: v.emergency_2_phone || "",
      relation: v.emergency_2_relation || "",
    
    },
  });

  const submit = async () => {
    const ok = await form.trigger();
    if (!ok) return false;

    if (!enrollmentId) {
      toast("Enrollment draft not ready yet.");
      return false;
    }

    const mobile = (form.getValues("mobile_primary") || "").trim();
    if (!(await validateUnique("mobile_primary", mobile))) {
      form.setFocus("mobile_primary");
      return false;
    }

    const personal = (form.getValues("personal_email") || "").trim();
    if (personal && !(await validateUnique("personal_email", personal))) {
      form.setFocus("personal_email");
      return false;
    }

    const company = (form.getValues("company_email") || "").trim();
    if (!(await validateUnique("company_email", company))) {
      form.setFocus("company_email");
      return false;
    }

    try {
      setSaving(true);
      const payload = buildPayload(form.getValues());
      await api.patch(`/v1/enrollments/${enrollmentId}/sections/address`, payload, {
        headers: { Accept: "application/json", "X-Company-Id": "1" },
      });
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to save Address");
      return false;
    } finally {
      setSaving(false);
    }
  };

  useImperativeHandle(ref, () => ({ submit }), [enrollmentId]);

  const showLoader = (!!enrollmentId && prefillLoading) || saving;

  return showLoader ? (
    <Loader message={saving ? "Saving Address details…" : "Loading Address details…"} fullHeight={false} />
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      <div>
        <Label required>
          Mobile (Primary) <UniqueBadge k="mobile_primary" />
        </Label>
        <input
          className={inputClass}
          disabled={isBusy}
          placeholder="03XX-XXXXXXX or 03XXXXXXXXX"
          {...bindUniqueField("mobile_primary")}
        />
        {e.mobile_primary && <p className="mt-1 text-[11px] text-red-600">{e.mobile_primary.message}</p>}
      </div>

      <div>
        <Label>Mobile (Secondary)</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("mobile_secondary")} placeholder="Optional" />
        {e.mobile_secondary && <p className="mt-1 text-[11px] text-red-600">{e.mobile_secondary.message}</p>}
      </div>

      <div>
        <Label>Landline</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("landline")} placeholder="Optional" />
      </div>

      <div>
        <Label>
          Personal Email <UniqueBadge k="personal_email" />
        </Label>
        <input className={inputClass} disabled={isBusy} placeholder="name@email.com" {...bindUniqueField("personal_email")} />
        {e.personal_email && <p className="mt-1 text-[11px] text-red-600">{e.personal_email.message}</p>}
      </div>

      <div>
        <Label required>
          Company Email <UniqueBadge k="company_email" />
        </Label>
        <input className={inputClass} disabled={isBusy} placeholder="name@company.com" {...bindUniqueField("company_email")} />
        {e.company_email && <p className="mt-1 text-[11px] text-red-600">{e.company_email.message}</p>}
      </div>

      <div>
        <Label>Country</Label>
        <select className={inputClass} disabled>
          <option value={FIXED_COUNTRY_ID}>{countries.find((x) => x.value === FIXED_COUNTRY_ID)?.label || "Pakistan"}</option>
        </select>
      </div>

      {/* Residence Type (Hard-coded) */}
      <div>
        <Label>Residence Type</Label>
        <select className={inputClass} disabled={isBusy} {...form.register("residence_type")}>
          <option value="">Select...</option>
          {RESIDENCE_TYPE_OPTIONS.map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
        {e.residence_type && <p className="mt-1 text-[11px] text-red-600">{e.residence_type.message}</p>}
      </div>

      <div>
        <Label>Residence Since</Label>
        <input className={inputClass} disabled={isBusy} type="date" {...form.register("residence_since")} />
      </div>

      {/* Current Address */}
      <div className="lg:col-span-3">
        <div className="rounded-xl border border-gray-200 p-3">
          <div className="text-[12px] font-bold mb-2" style={{ color: colors.primary }}>
            Current Address
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <Label required badge="EOBI">Line 1</Label>
              <input className={inputClass} disabled={isBusy} {...form.register("current_line1")} />
              {e.current_line1 && <p className="mt-1 text-[11px] text-red-600">{e.current_line1.message}</p>}
            </div>

            <div>
              <Label>Line 2</Label>
              <input className={inputClass} disabled={isBusy} {...form.register("current_line2")} />
            </div>

            <div>
              <Label required>Province</Label>
              <select
                className={inputClass}
                disabled={isBusy}
                {...form.register("current_province")}
                onChange={(ev) => {
                  form.setValue("current_province", ev.target.value, { shouldValidate: true });
                  form.setValue("current_city", "", { shouldValidate: true });
                }}
              >
                <option value="" disabled>Select...</option>
                {provinces.map((x) => (
                  <option key={x.value} value={x.value}>
                    {x.label}
                  </option>
                ))}
              </select>
              {e.current_province && <p className="mt-1 text-[11px] text-red-600">{e.current_province.message}</p>}
            </div>

            <div>
              <Label required>City</Label>
              <select className={inputClass} disabled={isBusy || !currentProvinceId} {...form.register("current_city")}>
                <option value="" disabled>Select...</option>
                {currentCities.map((x) => (
                  <option key={x.value} value={x.value}>
                    {x.label}
                  </option>
                ))}
              </select>
              {e.current_city && <p className="mt-1 text-[11px] text-red-600">{e.current_city.message}</p>}
            </div>

            <div>
              <Label required>Postal Code</Label>
              <input className={inputClass} disabled={isBusy} {...form.register("current_postal_code")} />
              {e.current_postal_code && <p className="mt-1 text-[11px] text-red-600">{e.current_postal_code.message}</p>}
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
              <input className={inputClass} disabled={isBusy} {...form.register("permanent_line1")} />
              {e.permanent_line1 && <p className="mt-1 text-[11px] text-red-600">{e.permanent_line1.message}</p>}
            </div>

            <div>
              <Label>Line 2</Label>
              <input className={inputClass} disabled={isBusy} {...form.register("permanent_line2")} />
            </div>

            <div>
              <Label required>Province</Label>
              <select
                className={inputClass}
                disabled={isBusy}
                {...form.register("permanent_province")}
                onChange={(ev) => {
                  form.setValue("permanent_province", ev.target.value, { shouldValidate: true });
                  form.setValue("permanent_city", "", { shouldValidate: true });
                }}
              >
                <option value="" disabled>Select...</option>
                {provinces.map((x) => (
                  <option key={x.value} value={x.value}>
                    {x.label}
                  </option>
                ))}
              </select>
              {e.permanent_province && <p className="mt-1 text-[11px] text-red-600">{e.permanent_province.message}</p>}
            </div>

            <div>
              <Label required>City</Label>
              <select className={inputClass} disabled={isBusy || !permanentProvinceId} {...form.register("permanent_city")}>
                <option value="" disabled>Select...</option>
                {permanentCities.map((x) => (
                  <option key={x.value} value={x.value}>
                    {x.label}
                  </option>
                ))}
              </select>
              {e.permanent_city && <p className="mt-1 text-[11px] text-red-600">{e.permanent_city.message}</p>}
            </div>

            <div>
              <Label required>Postal Code</Label>
              <input className={inputClass} disabled={isBusy} {...form.register("permanent_postal_code")} />
              {e.permanent_postal_code && <p className="mt-1 text-[11px] text-red-600">{e.permanent_postal_code.message}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency 1 */}
      <div className="lg:col-span-3">
        <div className="rounded-xl border border-gray-200 p-3">
          <div className="text-[12px] font-bold mb-2" style={{ color: colors.primary }}>
            Emergency #1
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <Label required badge="Safety">Name</Label>
              <input className={inputClass} disabled={isBusy} {...form.register("emergency_1_name")} />
              {e.emergency_1_name && <p className="mt-1 text-[11px] text-red-600">{e.emergency_1_name.message}</p>}
            </div>

            <div>
              <Label required>Phone</Label>
              <input className={inputClass} disabled={isBusy} {...form.register("emergency_1_phone")} />
              {e.emergency_1_phone && <p className="mt-1 text-[11px] text-red-600">{e.emergency_1_phone.message}</p>}
            </div>

            <div>
              <Label required>Relation</Label>
              <select className={inputClass} disabled={isBusy} {...form.register("emergency_1_relation")}>
                <option value="" disabled>Select...</option>
                {RELATION_OPTIONS.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
              {e.emergency_1_relation && <p className="mt-1 text-[11px] text-red-600">{e.emergency_1_relation.message}</p>}
            </div>


          </div>
        </div>
      </div>

      {/* Emergency 2 */}
      <div className="lg:col-span-3">
        <div className="rounded-xl border border-gray-200 p-3">
          <div className="text-[12px] font-bold mb-2" style={{ color: colors.primary }}>
            Emergency #2 (Optional)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <Label>Name</Label>
              <input className={inputClass} disabled={isBusy} {...form.register("emergency_2_name")} />
            </div>

            <div>
              <Label>Phone</Label>
              <input className={inputClass} disabled={isBusy} {...form.register("emergency_2_phone")} />
              {e.emergency_2_phone && <p className="mt-1 text-[11px] text-red-600">{e.emergency_2_phone.message}</p>}
            </div>

            <div>
              <Label>Relation</Label>
              <select className={inputClass} disabled={isBusy} {...form.register("emergency_2_relation")}>
                <option value="">Select...</option>
                {RELATION_OPTIONS.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
              {e.emergency_2_relation && <p className="mt-1 text-[11px] text-red-600">{e.emergency_2_relation.message}</p>}
            </div>

           
          </div>
        </div>
      </div>

      {loadingMeta && (
        <div className="lg:col-span-3 text-[11px] text-gray-500">
          Loading dropdowns...
        </div>
      )}
    </div>
  );
});

export default DetailedAddressStep;
