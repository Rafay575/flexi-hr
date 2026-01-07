// src/features/enrollment/steps-forms/quick/QuickIdentityStep.tsx
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/components/api/client";
import type { StepComponentProps, StepHandle } from "../../stepComponents";
import Loader from "@/components/common/Loader";
import { toast } from "sonner";
// ✅ Add this helper above schema (same file)
const toDate = (s: string) => {
  // input type="date" => "YYYY-MM-DD"
  const d = new Date(`${s}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
};
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
  })
  .superRefine((val, ctx) => {
    const issue = toDate(val.cnic_issue_date);
    const expiry = toDate(val.cnic_expiry_date);

    // if either missing/invalid, base validators already handle required,
    // but we avoid comparing invalid values.
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

type ValidateUniqueResponse = {
  success: boolean;
  message?: string;
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

type CnicStatus = "idle" | "checking" | "ok" | "taken";

const QuickIdentityStep = forwardRef<StepHandle, StepComponentProps>(
  function QuickIdentityStep({ enrollmentId, disabled }, ref) {
    const [saving, setSaving] = useState(false);
    const [prefillLoading, setPrefillLoading] = useState(false);

    const [loadingGenders, setLoadingGenders] = useState(false);
    const [genders, setGenders] = useState<Gender[]>([]);

    // ✅ CNIC uniqueness check UI state
    const [cnicStatus, setCnicStatus] = useState<CnicStatus>("idle");
    const [cnicStatusMsg, setCnicStatusMsg] = useState<string>("");

    // last checked value (for outdated-response guard)
    const lastCnicCheckRef = useRef<string>("");

    // ✅ cache + in-flight lock (prevents duplicate calls on blur + submit)
    const cnicCacheRef = useRef<{ value: string; ok: boolean; msg?: string } | null>(
      null
    );
    const cnicInFlightRef = useRef<{ value: string; promise: Promise<boolean> } | null>(
      null
    );

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

          // reset CNIC validation UI/cache
          setCnicStatus("idle");
          setCnicStatusMsg("");
          lastCnicCheckRef.current = "";
          cnicCacheRef.current = null;
          cnicInFlightRef.current = null;
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

          const res = await api.get<GenderMetaResponse>(
            "/meta/employee/gender?per_page=all",
            {
              headers: {
                Accept: "application/json",
                "X-Company-Id": "1",
              },
            }
          );

          const list = Array.isArray(res.data?.data) ? res.data.data : [];
          const active = list.filter((g) => g.active !== false);

          if (!mounted) return;
          setGenders(active);

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

    /**
     * ✅ CNIC unique validation
     * - Uses cache + in-flight lock to avoid duplicate calls (blur + submit).
     * - Returns boolean so submit() can block like other validation errors.
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

          // if API ever returns success:false
          const takenMsg = msg || "CNIC already exists in the system";
          setCnicStatus("taken");
          setCnicStatusMsg(takenMsg);
          form.setError("cnic_number", { type: "manual", message: takenMsg });

          cnicCacheRef.current = { value: normalized, ok: false, msg: takenMsg };
          return false;
        } catch (e: any) {
          const status = e?.response?.status;

          // ✅ 422 = already exists (Laravel validation style)
          if (status === 422) {
            const msgFromErrors =
              e?.response?.data?.errors?.cnic_number?.[0] ||
              e?.response?.data?.message ||
              "This CNIC is already registered.";

            if (lastCnicCheckRef.current !== normalized) return false;

            setCnicStatus("taken");
            setCnicStatusMsg(msgFromErrors);
            form.setError("cnic_number", { type: "manual", message: msgFromErrors });

            cnicCacheRef.current = { value: normalized, ok: false, msg: msgFromErrors };
            return false;
          }

          // other errors -> block submit (safe)
          const msg =
            e?.response?.data?.message ||
            e?.message ||
            "Could not validate CNIC right now";

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

    const submit = async () => {
      const ok = await form.trigger();
      if (!ok) return false;

      if (!enrollmentId) {
        toast("Enrollment draft not ready yet.");
        return false;
      }

      // ✅ ensure CNIC unique before saving
      const currentCnic = (form.getValues("cnic_number") || "").trim();
      if (currentCnic) {
        const uniqueOk = await validateCnicUnique(currentCnic);
        if (!uniqueOk) {
          form.setFocus("cnic_number");
          return false;
        }
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

    // CNIC register with custom blur handler (regex first -> unique check)
    const cnicReg = form.register("cnic_number");

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* First Name */}
        <div>
          <label className="flex items-center gap-1 text-[11px] font-semibold mb-1" style={labelStyle}>
            First Name {reqDot}
          </label>
          <input className={inputClass} disabled={isBusy} {...form.register("first_name")} placeholder="As per CNIC" />
          {errorText(form.formState.errors.first_name?.message)}
        </div>

        {/* Middle Name */}
        <div>
          <label className="flex items-center gap-1 text-[11px] font-semibold mb-1" style={labelStyle}>
            Middle Name
          </label>
          <input className={inputClass} disabled={isBusy} {...form.register("middle_name")} placeholder="Optional" />
          {errorText(form.formState.errors.middle_name?.message)}
        </div>

        {/* Last Name */}
        <div>
          <label className="flex items-center gap-1 text-[11px] font-semibold mb-1" style={labelStyle}>
            Last Name {reqDot}
          </label>
          <input className={inputClass} disabled={isBusy} {...form.register("last_name")} placeholder="As per CNIC" />
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
          <label className="flex items-center gap-2 text-[11px] font-semibold mb-1" style={labelStyle}>
            CNIC Number {reqDot}

            {cnicStatus === "checking" && (
              <span className="inline-flex items-center gap-1 text-[10px] text-gray-500">
                <span className="relative inline-flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gray-300 opacity-60" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-gray-400" />
                </span>
                Checking…
              </span>
            )}

            {cnicStatus === "ok" && <span className="text-[10px] text-green-600 font-semibold">✓ Available</span>}
          </label>

          <input
            className={inputClass}
            disabled={isBusy}
            {...cnicReg}
            placeholder="35202-8945776-6"
            onChange={(e) => {
              cnicReg.onChange(e);

              // reset UI + cache on edit
              setCnicStatus("idle");
              setCnicStatusMsg("");
              lastCnicCheckRef.current = "";
              cnicCacheRef.current = null;
              cnicInFlightRef.current = null;

              // clear manual error while typing (regex error will still show if invalid)
              if (form.formState.errors.cnic_number?.type === "manual") {
                form.clearErrors("cnic_number");
              }
            }}
            onBlur={async (e) => {
              cnicReg.onBlur(e);

              const v = (e.target.value || "").trim();
              if (!v) return;

              // ✅ first run zod/regex for CNIC only
              const ok = await form.trigger("cnic_number");
              if (!ok) return;

              // ✅ then validate unique via API (cached/locked)
              await validateCnicUnique(v);
            }}
          />

          {errorText(form.formState.errors.cnic_number?.message)}
          {!form.formState.errors.cnic_number?.message &&
            cnicStatusMsg &&
            (cnicStatus === "ok" ? (
              <p className="mt-1 text-[11px] text-green-600">{cnicStatusMsg}</p>
            ) : cnicStatus === "taken" ? (
              <p className="mt-1 text-[11px] text-red-600">{cnicStatusMsg}</p>
            ) : null)}
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
  }
);

export default QuickIdentityStep;
