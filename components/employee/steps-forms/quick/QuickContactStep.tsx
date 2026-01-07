// src/features/enrollment/steps-forms/quick/QuickContactStep.tsx
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
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

type ValidateUniqueResponse = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
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
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  badge?: string;
  hint?: React.ReactNode;
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
        {hint}
      </label>
      {children}
      {error && <p className="mt-1 text-[11px] text-red-600">{error}</p>}
    </div>
  );
}

/**
 * Maps 03XX-XXXXXXX -> +923XXXXXXXXX
 * Example: 0300-1234567 => +923001234567
 */

const toE164PK = (s: string) => {
  const v = (s || "").trim();
  if (!v) return "";
  // Already in correct format? keep it
  if (/^03\d{2}-\d{7}$/.test(v)) return v;

  // If user typed without dash: 03001234567 -> 0300-1234567
  const digits = v.replace(/\D/g, "");
  if (digits.startsWith("03") && digits.length === 11) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  }

  return v; // fallback (let backend decide)
};

type UStatus = "idle" | "checking" | "ok" | "taken";

const QuickContactStep = forwardRef<StepHandle, StepComponentProps>(function QuickContactStep(
  { enrollmentId, disabled },
  ref
) {
  const [saving, setSaving] = useState(false);
  const [prefillLoading, setPrefillLoading] = useState(false);

  // ✅ Unique check UI states
  const [mobileStatus, setMobileStatus] = useState<UStatus>("idle");
  const [mobileMsg, setMobileMsg] = useState<string>("");

  const [emailStatus, setEmailStatus] = useState<UStatus>("idle");
  const [emailMsg, setEmailMsg] = useState<string>("");

  // ✅ cache + inflight (mobile)
  const mobileCacheRef = useRef<{ value: string; ok: boolean; msg?: string } | null>(null);
  const mobileInFlightRef = useRef<{ value: string; promise: Promise<boolean> } | null>(null);
  const lastMobileRef = useRef<string>("");

  // ✅ cache + inflight (email)
  const emailCacheRef = useRef<{ value: string; ok: boolean; msg?: string } | null>(null);
  const emailInFlightRef = useRef<{ value: string; promise: Promise<boolean> } | null>(null);
  const lastEmailRef = useRef<string>("");

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

        // reset unique checks
        setMobileStatus("idle");
        setMobileMsg("");
        mobileCacheRef.current = null;
        mobileInFlightRef.current = null;
        lastMobileRef.current = "";

        setEmailStatus("idle");
        setEmailMsg("");
        emailCacheRef.current = null;
        emailInFlightRef.current = null;
        lastEmailRef.current = "";
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

  // ✅ shared unique validator (uses SAME API)
  const validateUnique = async ({
    field,
    rawValue,
    // UI state handlers
    setStatus,
    setMsg,
    // refs
    cacheRef,
    inflightRef,
    lastRef,
    // optional: transform (for mobile)
    transform,
    // error target (RHF field name)
    rhfField,
  }: {
    field: "mobile_primary" | "personal_email";
    rawValue: string;
    setStatus: React.Dispatch<React.SetStateAction<UStatus>>;
    setMsg: React.Dispatch<React.SetStateAction<string>>;
    cacheRef: React.MutableRefObject<{ value: string; ok: boolean; msg?: string } | null>;
    inflightRef: React.MutableRefObject<{ value: string; promise: Promise<boolean> } | null>;
    lastRef: React.MutableRefObject<string>;
    transform?: (v: string) => string;
    rhfField: keyof Values;
  }): Promise<boolean> => {
    if (!enrollmentId) return true;

    const normalized = (transform ? transform(rawValue) : (rawValue || "").trim()) || "";
    if (!normalized) {
      // empty email allowed -> treat as ok
      setStatus("idle");
      setMsg("");
      cacheRef.current = null;
      inflightRef.current = null;
      lastRef.current = "";
      form.clearErrors(rhfField as any);
      return true;
    }

    // cache
    if (cacheRef.current?.value === normalized) return cacheRef.current.ok;

    // in-flight
    if (inflightRef.current?.value === normalized) {
      return await inflightRef.current.promise;
    }

    lastRef.current = normalized;
    setStatus("checking");
    setMsg("");

    const promise = (async () => {
      try {
        const res = await api.post<ValidateUniqueResponse>(
          `/v1/enrollments/${enrollmentId}/validate-unique`,
          { [field]: normalized },
          { headers: { Accept: "application/json", "Content-Type": "application/json", "X-Company-Id": "1" } }
        );

        const ok = !!res?.data?.success;
        const msg = res?.data?.message || "";

        if (lastRef.current !== normalized) return false;

        if (ok) {
          setStatus("ok");
          setMsg(msg || "Available");
          if (form.formState.errors[rhfField]?.type === "manual") form.clearErrors(rhfField as any);
          cacheRef.current = { value: normalized, ok: true, msg };
          return true;
        }

        const takenMsg = msg || "Already exists in the system";
        setStatus("taken");
        setMsg(takenMsg);
        form.setError(rhfField as any, { type: "manual", message: takenMsg });

        cacheRef.current = { value: normalized, ok: false, msg: takenMsg };
        return false;
      } catch (e: any) {
        const status = e?.response?.status;

        if (status === 422) {
          const msgFromErrors =
            e?.response?.data?.errors?.[field]?.[0] ||
            e?.response?.data?.message ||
            "Already exists in the system";

          if (lastRef.current !== normalized) return false;

          setStatus("taken");
          setMsg(msgFromErrors);
          form.setError(rhfField as any, { type: "manual", message: msgFromErrors });

          cacheRef.current = { value: normalized, ok: false, msg: msgFromErrors };
          return false;
        }

        const msg = e?.response?.data?.message || e?.message || "Could not validate right now";
        setStatus("idle");
        setMsg("");
        toast(msg);

        cacheRef.current = { value: normalized, ok: false, msg };
        return false;
      } finally {
        if (inflightRef.current?.value === normalized) inflightRef.current = null;
      }
    })();

    inflightRef.current = { value: normalized, promise };
    return await promise;
  };

  const submit = async () => {
    const ok = await form.trigger();
    if (!ok) return false;

    if (!enrollmentId) {
      toast("Enrollment draft not ready yet.");
      return false;
    }

    // ✅ validate unique mobile
    const mob = (form.getValues("mobile_primary") || "").trim();
    if (mob) {
      const u1 = await validateUnique({
        field: "mobile_primary",
        rawValue: mob,
        transform: toE164PK, // API expects +923...
        setStatus: setMobileStatus,
        setMsg: setMobileMsg,
        cacheRef: mobileCacheRef,
        inflightRef: mobileInFlightRef,
        lastRef: lastMobileRef,
        rhfField: "mobile_primary",
      });
      if (!u1) {
        form.setFocus("mobile_primary");
        return false;
      }
    }

    // ✅ validate unique email (only if provided)
    const em = (form.getValues("personal_email") || "").trim();
    if (em) {
      const u2 = await validateUnique({
        field: "personal_email",
        rawValue: em,
        setStatus: setEmailStatus,
        setMsg: setEmailMsg,
        cacheRef: emailCacheRef,
        inflightRef: emailInFlightRef,
        lastRef: lastEmailRef,
        rhfField: "personal_email",
      });
      if (!u2) {
        form.setFocus("personal_email");
        return false;
      }
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

  const mobileReg = form.register("mobile_primary");
  const emailReg = form.register("personal_email");

  const spinner = (
    <span className="ml-2 inline-flex items-center gap-1 text-[10px] text-gray-500">
      <span className="relative inline-flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gray-300 opacity-60" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-gray-400" />
      </span>
      Checking…
    </span>
  );

  const okBadge = <span className="ml-2 text-[10px] text-green-600 font-semibold">✓ Available</span>;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Row 1 */}
        <Field
          label="Mobile Number"
          required
          error={errors.mobile_primary?.message}
          hint={
            mobileStatus === "checking"
              ? spinner
              : mobileStatus === "ok"
              ? okBadge
              : null
          }
        >
          <input
            className={inputClass}
            disabled={isBusy}
            {...mobileReg}
            placeholder="03XX-XXXXXXX"
            onChange={(e) => {
              mobileReg.onChange(e);
              setMobileStatus("idle");
              setMobileMsg("");
              mobileCacheRef.current = null;
              mobileInFlightRef.current = null;
              lastMobileRef.current = "";
              if (errors.mobile_primary?.type === "manual") form.clearErrors("mobile_primary");
            }}
            onBlur={async (e) => {
              mobileReg.onBlur(e);

              const v = (e.target.value || "").trim();
              if (!v) return;

              // regex first
              const ok = await form.trigger("mobile_primary");
              if (!ok) return;

              await validateUnique({
                field: "mobile_primary",
                rawValue: v,
                transform: toE164PK,
                setStatus: setMobileStatus,
                setMsg: setMobileMsg,
                cacheRef: mobileCacheRef,
                inflightRef: mobileInFlightRef,
                lastRef: lastMobileRef,
                rhfField: "mobile_primary",
              });
            }}
          />
          {!errors.mobile_primary?.message && mobileMsg && mobileStatus === "taken" && (
            <p className="mt-1 text-[11px] text-red-600">{mobileMsg}</p>
          )}
          {!errors.mobile_primary?.message && mobileMsg && mobileStatus === "ok" && (
            <p className="mt-1 text-[11px] text-green-600">{mobileMsg}</p>
          )}
        </Field>

        <Field
          label="Personal Email"
          error={errors.personal_email?.message}
          hint={
            emailStatus === "checking"
              ? spinner
              : emailStatus === "ok"
              ? okBadge
              : null
          }
        >
          <input
            className={inputClass}
            disabled={isBusy}
            {...emailReg}
            placeholder="name@email.com"
            onChange={(e) => {
              emailReg.onChange(e);
              setEmailStatus("idle");
              setEmailMsg("");
              emailCacheRef.current = null;
              emailInFlightRef.current = null;
              lastEmailRef.current = "";
              if (errors.personal_email?.type === "manual") form.clearErrors("personal_email");
            }}
            onBlur={async (e) => {
              emailReg.onBlur(e);

              const v = (e.target.value || "").trim();
              if (!v) return; // email optional -> no call

              // email format first
              const ok = await form.trigger("personal_email");
              if (!ok) return;

              await validateUnique({
                field: "personal_email",
                rawValue: v,
                setStatus: setEmailStatus,
                setMsg: setEmailMsg,
                cacheRef: emailCacheRef,
                inflightRef: emailInFlightRef,
                lastRef: lastEmailRef,
                rhfField: "personal_email",
              });
            }}
          />
          {!errors.personal_email?.message && emailMsg && emailStatus === "taken" && (
            <p className="mt-1 text-[11px] text-red-600">{emailMsg}</p>
          )}
          {!errors.personal_email?.message && emailMsg && emailStatus === "ok" && (
            <p className="mt-1 text-[11px] text-green-600">{emailMsg}</p>
          )}
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
