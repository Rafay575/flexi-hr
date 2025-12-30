// src/features/enrollment/steps/DetailedSalaryStep.tsx
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/components/api/client";
import type { StepComponentProps, StepHandle } from "../../stepComponents";

const colors = { primary: "#3D3A5C", coral: "#E8A99A" } as const;

type Option = { id: number; name: string; active?: boolean };
type ApiListResponse = { data: Option[] };

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

// ─────────────────────────────────────────────────────────────
// Schema (matches your screenshot body)
// NOTE: API shows ids as strings "1" => we accept input as number-ish and send as string.
// ─────────────────────────────────────────────────────────────
const schema = z.object({
  basic_salary: z.coerce.number().int().positive("Basic salary is required"),
  gross_salary: z.coerce.number().int().positive("Gross salary is required"),

  currency_id: z.coerce.number().int().positive("Currency is required"),
  pay_frequency: z.string().min(1, "Pay frequency is required"),
  pay_cutoff_day: z.coerce.number().int().min(1).max(31),

  salary_mode: z.enum(["BANK", "CASH", "CHEQUE", "MOBILE_WALLET"]).or(z.string().min(1)),
  bank_id: z.coerce.number().int().positive("Bank is required"),

  bank_name: z.string().min(1, "Bank name is required"),
  iban: z.string().min(5, "IBAN is required"),

  account_title: z.string().min(1, "Account title is required"),
  account_number: z.string().min(4, "Account number is required"),

  ntn: z.string().min(3, "NTN is required"),
  filer_status: z.string().min(1, "Filer status is required"),

  eobi_uan: z.string().min(1, "EOBI UAN is required"),
  eobi_reg_date: z.string().min(1, "EOBI reg date is required"),

  ss_number: z.string().min(1, "SS number is required"),
  ss_province: z.string().min(1, "SS province is required"),
  ss_reg_date: z.string().min(1, "SS reg date is required"),
});

type Values = z.infer<typeof schema>;

// ✅ avoid RHF resolver generic mismatch issues
const resolver = zodResolver(schema) as unknown as Resolver<Values>;

async function fetchOptions(url: string) {
  const res = await api.get<ApiListResponse>(url, {
    headers: { Accept: "application/json", "X-Company-Id": "1" },
  });
  const list = Array.isArray(res.data?.data) ? res.data.data : [];
  return list.filter((x) => (typeof x.active === "boolean" ? x.active : true));
}

const DetailedSalaryStep = forwardRef<StepHandle, StepComponentProps>(function DetailedSalaryStep(
  { enrollmentId, disabled },
  ref
) {
  const [saving, setSaving] = useState(false);
  const [loadingMeta, setLoadingMeta] = useState(false);

  // dropdowns
  const [currencies, setCurrencies] = useState<Option[]>([]);
  const [banks, setBanks] = useState<Option[]>([]);

  const form = useForm<Values>({
    resolver,
    mode: "onTouched",
    defaultValues: {
      basic_salary: 37000,
      gross_salary: 45000,
      currency_id: 0,
      pay_frequency: "Monthly",
      pay_cutoff_day: 28,
      salary_mode: "BANK",
      bank_id: 0,
      bank_name: "",
      iban: "",
      account_title: "",
      account_number: "",
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
  const isBusy = !!disabled || saving || loadingMeta;

  // ─────────────────────────────────────────────────────────────
  // Load meta dropdowns (replace URLs with your actual ones)
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setLoadingMeta(true);

        const [curList, bankList] = await Promise.all([
          fetchOptions("/meta/finance/currencies?per_page=all"),
          fetchOptions("/meta/finance/banks?per_page=all"),
        ]);

        if (!mounted) return;

        setCurrencies(curList);
        setBanks(bankList);

        if (curList[0] && !form.getValues("currency_id")) form.setValue("currency_id", curList[0].id as any);

        // bank: if first exists, set bank_id and also bank_name from option name (handy)
        if (bankList[0] && !form.getValues("bank_id")) {
          form.setValue("bank_id", bankList[0].id as any);
          form.setValue("bank_name", bankList[0].name);
        }
      } catch (err: any) {
        alert(err?.response?.data?.message || err?.message || "Failed to load Salary dropdowns");
      } finally {
        if (mounted) setLoadingMeta(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [form]);

  // when bank_id changes, auto-fill bank_name from selected option (keeps your payload clean)
  const bankId = form.watch("bank_id");
  useEffect(() => {
    const found = banks.find((b) => b.id === Number(bankId));
    if (found) form.setValue("bank_name", found.name);
  }, [bankId, banks, form]);

  // ─────────────────────────────────────────────────────────────
  // Submit (PATCH /sections/salary)
  // ─────────────────────────────────────────────────────────────
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

      const payload = {
        basic_salary: Number(v.basic_salary),
        gross_salary: Number(v.gross_salary),
        currency_id: String(Number(v.currency_id)),
        pay_frequency: v.pay_frequency,
        pay_cutoff_day: Number(v.pay_cutoff_day),
        salary_mode: v.salary_mode,
        bank_id: Number(v.bank_id),
        bank_name: v.bank_name,
        iban: v.iban,
        account_title: v.account_title,
        account_number: v.account_number,
        ntn: v.ntn,
        filer_status: v.filer_status,
        eobi_uan: v.eobi_uan,
        eobi_reg_date: v.eobi_reg_date,
        ss_number: v.ss_number,
        ss_province: v.ss_province,
        ss_reg_date: v.ss_reg_date,
      };

      await api.patch(`/v1/enrollments/${enrollmentId}/sections/salary`, payload, {
        headers: { Accept: "application/json", "X-Company-Id": "1" },
      });

      return true;
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || "Failed to save Salary");
      return false;
    } finally {
      setSaving(false);
    }
  };

  useImperativeHandle(ref, () => ({ submit }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {/* Basic salary */}
      <div>
        <Label required>Basic Salary</Label>
        <input className={inputClass} type="number" disabled={isBusy} {...form.register("basic_salary")} />
        {e.basic_salary && <p className="mt-1 text-[11px] text-red-600">{e.basic_salary.message}</p>}
      </div>

      {/* Gross salary */}
      <div>
        <Label required>Gross Salary</Label>
        <input className={inputClass} type="number" disabled={isBusy} {...form.register("gross_salary")} />
        {e.gross_salary && <p className="mt-1 text-[11px] text-red-600">{e.gross_salary.message}</p>}
      </div>

      {/* Currency */}
      <div>
        <Label required>Currency</Label>
        <select className={inputClass} disabled={isBusy} {...form.register("currency_id")}>
          {currencies.length === 0 ? <option value="">No currencies</option> : null}
          {currencies.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </select>
        {e.currency_id && <p className="mt-1 text-[11px] text-red-600">{e.currency_id.message}</p>}
      </div>

      {/* Pay frequency */}
      <div>
        <Label required>Pay Frequency</Label>
        <select className={inputClass} disabled={isBusy} {...form.register("pay_frequency")}>
          {["Monthly", "Bi-Weekly", "Weekly"].map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
        {e.pay_frequency && <p className="mt-1 text-[11px] text-red-600">{e.pay_frequency.message}</p>}
      </div>

      {/* Pay cutoff day */}
      <div>
        <Label required>Pay Cutoff Day</Label>
        <input className={inputClass} type="number" disabled={isBusy} {...form.register("pay_cutoff_day")} />
        {e.pay_cutoff_day && <p className="mt-1 text-[11px] text-red-600">{e.pay_cutoff_day.message}</p>}
      </div>

      {/* Salary mode */}
      <div>
        <Label required>Salary Mode</Label>
        <select className={inputClass} disabled={isBusy} {...form.register("salary_mode")}>
          <option value="BANK">BANK</option>
          <option value="CASH">CASH</option>
          <option value="CHEQUE">CHEQUE</option>
          <option value="MOBILE_WALLET">MOBILE_WALLET</option>
        </select>
        {e.salary_mode && <p className="mt-1 text-[11px] text-red-600">{e.salary_mode.message}</p>}
      </div>

      {/* Bank */}
      <div>
        <Label required>Bank</Label>
        <select className={inputClass} disabled={isBusy} {...form.register("bank_id")}>
          {banks.length === 0 ? <option value="">No banks</option> : null}
          {banks.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </select>
        {e.bank_id && <p className="mt-1 text-[11px] text-red-600">{e.bank_id.message}</p>}
      </div>

      {/* Bank name (auto-filled) */}
      <div>
        <Label required>Bank Name</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("bank_name")} placeholder="Auto-filled" />
        {e.bank_name && <p className="mt-1 text-[11px] text-red-600">{e.bank_name.message}</p>}
      </div>

      {/* IBAN */}
      <div>
        <Label required>IBAN</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("iban")} placeholder="PK..." />
        {e.iban && <p className="mt-1 text-[11px] text-red-600">{e.iban.message}</p>}
      </div>

      {/* Account title */}
      <div>
        <Label required>Account Title</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("account_title")} />
        {e.account_title && <p className="mt-1 text-[11px] text-red-600">{e.account_title.message}</p>}
      </div>

      {/* Account number */}
      <div>
        <Label required>Account Number</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("account_number")} />
        {e.account_number && <p className="mt-1 text-[11px] text-red-600">{e.account_number.message}</p>}
      </div>

      {/* NTN */}
      <div>
        <Label required>NTN</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("ntn")} />
        {e.ntn && <p className="mt-1 text-[11px] text-red-600">{e.ntn.message}</p>}
      </div>

      {/* Filer status */}
      <div>
        <Label required>Filer Status</Label>
        <select className={inputClass} disabled={isBusy} {...form.register("filer_status")}>
          <option value="Filer">Filer</option>
          <option value="Non-Filer">Non-Filer</option>
          <option value="Late Filer">Late Filer</option>
        </select>
        {e.filer_status && <p className="mt-1 text-[11px] text-red-600">{e.filer_status.message}</p>}
      </div>

      {/* EOBI UAN */}
      <div>
        <Label required>EOBI UAN</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("eobi_uan")} />
        {e.eobi_uan && <p className="mt-1 text-[11px] text-red-600">{e.eobi_uan.message}</p>}
      </div>

      {/* EOBI reg date */}
      <div>
        <Label required>EOBI Reg Date</Label>
        <input className={inputClass} type="date" disabled={isBusy} {...form.register("eobi_reg_date")} />
        {e.eobi_reg_date && <p className="mt-1 text-[11px] text-red-600">{e.eobi_reg_date.message}</p>}
      </div>

      {/* SS number */}
      <div>
        <Label required>SS Number</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("ss_number")} />
        {e.ss_number && <p className="mt-1 text-[11px] text-red-600">{e.ss_number.message}</p>}
      </div>

      {/* SS province */}
      <div>
        <Label required>SS Province</Label>
        <select className={inputClass} disabled={isBusy} {...form.register("ss_province")}>
          {["Punjab", "Sindh", "KPK", "Balochistan", "Islamabad"].map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
        {e.ss_province && <p className="mt-1 text-[11px] text-red-600">{e.ss_province.message}</p>}
      </div>

      {/* SS reg date */}
      <div>
        <Label required>SS Reg Date</Label>
        <input className={inputClass} type="date" disabled={isBusy} {...form.register("ss_reg_date")} />
        {e.ss_reg_date && <p className="mt-1 text-[11px] text-red-600">{e.ss_reg_date.message}</p>}
      </div>

      {(saving || loadingMeta) && (
        <div className="lg:col-span-3 text-[11px] text-gray-500">{loadingMeta ? "Loading dropdowns..." : "Saving..."}</div>
      )}
    </div>
  );
});

export default DetailedSalaryStep;
