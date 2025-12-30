// src/features/enrollment/steps/QuickSalaryStep.tsx
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
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

const inputClass =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 disabled:bg-gray-50";

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

// -------------------- API types --------------------
type BankApiItem = {
  id: number;
  bank_name: string;
  active: number | boolean;
};

type BankApiResponse = {
  data: BankApiItem[];
  meta?: any;
};

type SalarySectionResponse = {
  success: boolean;
  data: {
    id: number;
    section: "salary";
    values: Record<string, any>;
  };
};

// -------------------- Form schema (ONLY screenshot fields) --------------------
const schema = z.object({
  basic_salary: z.coerce.number().min(1, "Basic Salary is required"),

  salary_mode: z.string().min(1, "Salary Mode is required"),

  bank_id: z.coerce.number().int().optional(), // required only when BANK
  iban: z.string().optional(),
  account_title: z.string().optional(),

  ntn: z.string().min(3, "NTN is required"),
  filer_status: z.string().min(1, "Filer Status is required"),

  eobi_uan: z.string().min(1, "EOBI UAN is required"),
  eobi_reg_date: z.string().min(1, "EOBI Registration Date is required"),

  ss_number: z.string().min(1, "PESSI/SESSI Number is required"),
  ss_province: z.string().min(1, "SS Province is required"),
  ss_reg_date: z.string().min(1, "SS Registration Date is required"),
});

type Values = z.infer<typeof schema>;
const resolver = zodResolver(schema) as unknown as Resolver<Values>;

// -------------------- Helpers --------------------
async function fetchBanks() {
  const res = await api.get<BankApiResponse>("/meta/companies/finance/bank?per_page=all", {
    headers: { Accept: "application/json", "X-Company-Id": "1" },
  });

  const list = Array.isArray(res.data?.data) ? res.data.data : [];
  // active can be 1/0 or true/false
  return list.filter((b) => (typeof b.active === "boolean" ? b.active : b.active === 1 || b.active == null));
}

const QuickSalaryStep = forwardRef<StepHandle, StepComponentProps>(function QuickSalaryStep(
  { enrollmentId, disabled },
  ref
) {
  const [saving, setSaving] = useState(false);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [prefillLoading, setPrefillLoading] = useState(false);

  const [banks, setBanks] = useState<BankApiItem[]>([]);

  // ✅ store server values (for fields NOT shown in UI) so backend doesn’t break
  const serverSnapshotRef = useRef<Record<string, any> | null>(null);

  const form = useForm<Values>({
    resolver,
    mode: "onTouched",
    defaultValues: {
      basic_salary: 0,

      salary_mode: "BANK",

      bank_id: 0,
      iban: "",
      account_title: "",

      ntn: "",
      filer_status: "Filer",

      eobi_uan: "",
      eobi_reg_date: "",

      ss_number: "",
      ss_province: "Punjab",
      ss_reg_date: "",
    },
  });

  const e = form.formState.errors;
  const isBusy = !!disabled || saving || loadingBanks || prefillLoading;

  // ✅ 1) Load banks once
  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setLoadingBanks(true);
        const list = await fetchBanks();
        if (!mounted) return;

        setBanks(list);

        // if BANK and bank not selected, select first
        const mode = form.getValues("salary_mode");
        const currentBank = Number(form.getValues("bank_id") || 0);
        if (mode === "BANK" && (!currentBank || currentBank < 1) && list[0]?.id) {
          form.setValue("bank_id", list[0].id, { shouldValidate: true });
        }
      } catch (err: any) {
        console.warn("Failed to load banks", err?.response?.data || err);
      } finally {
        if (mounted) setLoadingBanks(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [form]);

  // ✅ 2) Prefill salary section
  useEffect(() => {
    let mounted = true;

    const prefill = async () => {
      if (!enrollmentId) return;

      try {
        setPrefillLoading(true);

        const res = await api.get<SalarySectionResponse>(`/v1/enrollments/${enrollmentId}/sections/salary`, {
          headers: { Accept: "application/json", "X-Company-Id": "1" },
        });

        const values = res?.data?.data?.values ?? {};
        serverSnapshotRef.current = values; // keep everything

        if (!mounted) return;

        // if empty -> keep defaults
        if (!values || Object.keys(values).length === 0) return;

        // ✅ only reset fields we show in UI
        form.reset(
          {
            basic_salary: Number(values.basic_salary ?? 0),
            salary_mode: String(values.salary_mode ?? "BANK"),

            bank_id: Number(values.bank_id ?? 0),
            iban: String(values.iban ?? ""),
            account_title: String(values.account_title ?? ""),

            ntn: String(values.ntn ?? ""),
            filer_status: String(values.filer_status ?? "Filer"),

            eobi_uan: String(values.eobi_uan ?? ""),
            eobi_reg_date: String(values.eobi_reg_date ?? ""),

            ss_number: String(values.ss_number ?? ""),
            ss_province: String(values.ss_province ?? "Punjab"),
            ss_reg_date: String(values.ss_reg_date ?? ""),
          },
          { keepDirty: false, keepTouched: false }
        );
      } catch (err: any) {
        console.warn("Failed to prefill salary", err?.response?.data || err);
      } finally {
        if (mounted) setPrefillLoading(false);
      }
    };

    prefill();
    return () => {
      mounted = false;
    };
  }, [enrollmentId, form]);

  // ✅ keep bank_id required only when BANK
  const salaryMode = form.watch("salary_mode");

  const submit = async () => {
    // extra conditional validation for bank
    if (form.getValues("salary_mode") === "BANK") {
      const bankId = Number(form.getValues("bank_id") || 0);
      if (!bankId || bankId < 1) {
        form.setError("bank_id", { type: "manual", message: "Bank Name is required" });
        return false;
      }
    }

    const ok = await form.trigger();
    if (!ok) return false;

    if (!enrollmentId) {
      toast("Enrollment draft not ready yet.");
      return false;
    }

    try {
      setSaving(true);

      const v = form.getValues();

      // ✅ merge server snapshot so backend-required keys remain intact
      const snapshot = serverSnapshotRef.current || {};

      // sensible defaults if backend expects them but snapshot empty
      const safeBase = {
        gross_salary: snapshot.gross_salary ?? null,
        currency_id: snapshot.currency_id ?? "1",
        pay_frequency: snapshot.pay_frequency ?? "Monthly",
        pay_cutoff_day: snapshot.pay_cutoff_day ?? 30,
        account_number: snapshot.account_number ?? "", // hidden (not in UI)
      };

      const payload = {
        ...safeBase,
        ...snapshot, // keep any other keys the backend expects
        // ✅ overwrite only the fields we control in UI
        basic_salary: Number(v.basic_salary),
        salary_mode: v.salary_mode,

        bank_id: v.salary_mode === "BANK" ? Number(v.bank_id || 0) : null,
        iban: v.salary_mode === "BANK" ? String(v.iban || "") : "",
        account_title: v.salary_mode === "BANK" ? String(v.account_title || "") : "",

        ntn: String(v.ntn || ""),
        filer_status: v.filer_status,

        eobi_uan: String(v.eobi_uan || ""),
        eobi_reg_date: v.eobi_reg_date,

        ss_number: String(v.ss_number || ""),
        ss_province: v.ss_province,
        ss_reg_date: v.ss_reg_date,
      };

      await api.patch(`/v1/enrollments/${enrollmentId}/sections/salary`, payload, {
        headers: { Accept: "application/json", "X-Company-Id": "1" },
      });

      return true;
    } catch (err: any) {
      toast(err?.response?.data?.message || err?.message || "Failed to save Salary");
      return false;
    } finally {
      setSaving(false);
    }
  };

  useImperativeHandle(ref, () => ({ submit }), [submit]);

  // ✅ loader until banks + (if enrollmentId) prefill is done
  const showBlockingLoader = loadingBanks || (!!enrollmentId && prefillLoading);
  if (showBlockingLoader) return <Loader message="Loading Salary details…" fullHeight={false} />;
  if (saving) return <Loader message="Saving Salary details…" fullHeight={false} />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {/* Basic Salary */}
      <div>
        <Label required>Basic Salary (PKR)</Label>
        <input className={inputClass} disabled={isBusy} type="number" {...form.register("basic_salary")} />
        {e.basic_salary && <p className="mt-1 text-[11px] text-red-600">{e.basic_salary.message}</p>}
      </div>

      {/* Salary Mode */}
      <div>
        <Label required>Salary Mode</Label>
        <select className={inputClass} disabled={isBusy} {...form.register("salary_mode")}>
          <option value="">Select...</option>
          {["BANK", "CASH", "CHEQUE", "MOBILE_WALLET"].map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
        {e.salary_mode && <p className="mt-1 text-[11px] text-red-600">{e.salary_mode.message}</p>}
      </div>

      {/* Bank Name (only BANK) */}
      <div>
        <Label required={salaryMode === "BANK"}>Bank Name</Label>
        <select className={inputClass} disabled={isBusy || salaryMode !== "BANK"} {...form.register("bank_id")}>
          <option value={0}>Select...</option>
          {banks.map((b) => (
            <option key={b.id} value={b.id}>
              {b.bank_name}
            </option>
          ))}
        </select>
        {e.bank_id && <p className="mt-1 text-[11px] text-red-600">{String(e.bank_id.message)}</p>}
      </div>

      {/* IBAN */}
      <div className="md:col-span-1">
        <Label>Bank Account / IBAN</Label>
        <input className={inputClass} disabled={isBusy || salaryMode !== "BANK"} {...form.register("iban")} placeholder="PK00XXXXXXXXXXXX..." />
        {e.iban && <p className="mt-1 text-[11px] text-red-600">{String(e.iban.message)}</p>}
      </div>

      {/* Account Title */}
      <div className="md:col-span-1">
        <Label>Account Title</Label>
        <input className={inputClass} disabled={isBusy || salaryMode !== "BANK"} {...form.register("account_title")} placeholder="Ali Khan" />
        {e.account_title && <p className="mt-1 text-[11px] text-red-600">{String(e.account_title.message)}</p>}
      </div>

      {/* NTN */}
      <div>
        <Label required>NTN</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("ntn")} placeholder="0000000-0" />
        {e.ntn && <p className="mt-1 text-[11px] text-red-600">{e.ntn.message}</p>}
      </div>

      {/* Filer Status */}
      <div>
        <Label required>Filer Status</Label>
        <select className={inputClass} disabled={isBusy} {...form.register("filer_status")}>
          <option value="">Select...</option>
          {["Filer", "Non-Filer", "Late Filer"].map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
        {e.filer_status && <p className="mt-1 text-[11px] text-red-600">{e.filer_status.message}</p>}
      </div>

      {/* EOBI UAN */}
      <div>
        <Label required>EOBI UAN</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("eobi_uan")} placeholder="EOBI123456" />
        {e.eobi_uan && <p className="mt-1 text-[11px] text-red-600">{e.eobi_uan.message}</p>}
      </div>

      {/* EOBI Registration Date */}
      <div>
        <Label required>EOBI Registration Date</Label>
        <input className={inputClass} disabled={isBusy} type="date" {...form.register("eobi_reg_date")} />
        {e.eobi_reg_date && <p className="mt-1 text-[11px] text-red-600">{e.eobi_reg_date.message}</p>}
      </div>

      {/* SS Number */}
      <div>
        <Label required>PESSI/SESSI Number</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("ss_number")} placeholder="SS123456" />
        {e.ss_number && <p className="mt-1 text-[11px] text-red-600">{e.ss_number.message}</p>}
      </div>

      {/* SS Province */}
      <div>
        <Label required>SS Province</Label>
        <select className={inputClass} disabled={isBusy} {...form.register("ss_province")}>
          <option value="">Select...</option>
          {["Punjab", "Sindh", "KPK", "Balochistan", "Islamabad"].map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
        {e.ss_province && <p className="mt-1 text-[11px] text-red-600">{e.ss_province.message}</p>}
      </div>

      {/* SS Registration Date */}
      <div>
        <Label required>SS Registration Date</Label>
        <input className={inputClass} disabled={isBusy} type="date" {...form.register("ss_reg_date")} />
        {e.ss_reg_date && <p className="mt-1 text-[11px] text-red-600">{e.ss_reg_date.message}</p>}
      </div>
    </div>
  );
});

export default QuickSalaryStep;
