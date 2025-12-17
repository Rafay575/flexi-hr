import React, { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { api } from "@/components/api/client";
import { Switch } from "@/components/ui/switch";

import { BadgeDollarSign, Hash, Layers3, Banknote, ToggleLeft } from "lucide-react";

type Mode = "view" | "create" | "edit";

export type GradeFormValues = {
  name: string;
  code: string;
  hierarchy_level: number | null;
  currency_id: number | null;
  min_base_salary: number | null;
  max_base_salary: number | null;
  active: boolean;
};

type Option = { id: number; label: string };

interface GradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: Mode;
  gradeId?: number | string;
  gradeData?: Partial<GradeFormValues> | null; // prefill for edit/view
  refetchGrades: () => Promise<any> | void;
}

const toNumOrNull = (v: any): number | null => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
};

const toStr = (v: any): string => (v === null || v === undefined ? "" : String(v));

const clampNonNeg = (v: number | null) => (v == null ? null : Math.max(0, v));

const GradeModal: React.FC<GradeModalProps> = ({
  isOpen,
  onClose,
  mode,
  gradeId,
  gradeData,
  refetchGrades,
}) => {
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isCreate = mode === "create";

  // -----------------------------
  // Currency dropdown
  // -----------------------------
  const { data: currenciesRes, isLoading: currenciesLoading } = useQuery({
    queryKey: ["currencies_all"],
    enabled: isOpen,
    queryFn: async () => {
      // ⚠️ change this endpoint if yours is different
      const res = await api.get("/meta/companies/finance/currencies", { params: { per_page: "all" } });
      return res.data;
    },
  });

  const currencyOptions: Option[] = useMemo(() => {
    const rows = currenciesRes?.data || [];
    return rows.map((c: any) => ({
      id: Number(c.id),
      label: c.iso_code ? `${c.iso_code} — ${c.symbol ?? ""}` : c.symbol ?? `Currency #${c.id}`,
    }));
  }, [currenciesRes]);

  const findLabel = (opts: Option[], id: number | null | undefined) =>
    id ? opts.find((o) => o.id === id)?.label ?? "—" : "—";

  // -----------------------------
  // Form
  // -----------------------------
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
    watch,
  } = useForm<GradeFormValues>({
    defaultValues: {
      name: "",
      code: "",
      hierarchy_level: null,
      currency_id: null,
      min_base_salary: 0,
      max_base_salary: 0,
      active: true,
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    reset({
      name: gradeData?.name ?? "",
      code: gradeData?.code ?? "",
      hierarchy_level: toNumOrNull(gradeData?.hierarchy_level),
      currency_id: toNumOrNull(gradeData?.currency_id),
      min_base_salary: toNumOrNull(gradeData?.min_base_salary) ?? 0,
      max_base_salary: toNumOrNull(gradeData?.max_base_salary) ?? 0,
      active: gradeData?.active ?? true,
    });
  }, [isOpen, gradeData, reset]);

  const minSal = watch("min_base_salary");
  const maxSal = watch("max_base_salary");

  // -----------------------------
  // Mutations
  // -----------------------------
  const createMutation = useMutation({
    mutationFn: async (payload: GradeFormValues) => api.post("/meta/employee/grade", payload),
    onSuccess: async () => {
      await refetchGrades?.();
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: GradeFormValues) => {
      if (!gradeId) throw new Error("Grade ID missing");
      return api.put(`/meta/employee/grade/${gradeId}`, payload);
    },
    onSuccess: async () => {
      await refetchGrades?.();
      onClose();
    },
  });

  const onSubmit = async (values: GradeFormValues) => {
    const payload: GradeFormValues = {
      name: values.name.trim(),
      code: values.code.trim(),
      hierarchy_level: toNumOrNull(values.hierarchy_level),
      currency_id: toNumOrNull(values.currency_id),
      min_base_salary: clampNonNeg(toNumOrNull(values.min_base_salary)) ?? 0,
      max_base_salary: clampNonNeg(toNumOrNull(values.max_base_salary)) ?? 0,
      active: !!values.active,
    };

    // small safety: min > max => swap
    if (
      payload.min_base_salary != null &&
      payload.max_base_salary != null &&
      payload.min_base_salary > payload.max_base_salary
    ) {
      const t = payload.min_base_salary;
      payload.min_base_salary = payload.max_base_salary;
      payload.max_base_salary = t;
    }

    if (isCreate) return createMutation.mutateAsync(payload);
    if (isEdit) return updateMutation.mutateAsync(payload);
  };

  const modalTitle =
    mode === "create" ? "Add Grade" : mode === "edit" ? "Edit Grade" : "Grade Details";

  const saving = isSubmitting || createMutation.isPending || updateMutation.isPending;

  // -----------------------------
  // Sexy View
  // -----------------------------
  const SexyView = () => (
    <div className="space-y-4">
      <div className="rounded-xl border bg-white p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <BadgeDollarSign className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-semibold text-slate-900">{gradeData?.name || "—"}</div>
              <div className="text-sm text-slate-500">
                {gradeData?.code ? `Code: ${gradeData.code}` : "No code"}
              </div>
            </div>
          </div>

          <StatusBadge status={(gradeData?.active ?? true) ? "active" : "inactive"} />
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-lg bg-slate-50 p-3">
            <div className="flex items-center gap-2 text-slate-600 text-sm">
              <Layers3 className="h-4 w-4" /> Hierarchy Level
            </div>
            <div className="mt-1 font-medium text-slate-900">{gradeData?.hierarchy_level ?? "—"}</div>
          </div>

          <div className="rounded-lg bg-slate-50 p-3">
            <div className="flex items-center gap-2 text-slate-600 text-sm">
              <Hash className="h-4 w-4" /> Currency
            </div>
            <div className="mt-1 font-medium text-slate-900">
              {findLabel(currencyOptions, toNumOrNull(gradeData?.currency_id))}
            </div>
          </div>

          <div className="rounded-lg bg-slate-50 p-3">
            <div className="flex items-center gap-2 text-slate-600 text-sm">
              <Banknote className="h-4 w-4" /> Salary Range
            </div>
            <div className="mt-1 font-medium text-slate-900">
              {toStr(gradeData?.min_base_salary ?? 0)} — {toStr(gradeData?.max_base_salary ?? 0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      {isView ? (
        <div className="space-y-4">
          <SexyView />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-sm text-slate-600">Name</label>
            <Input placeholder="e.g. Senior Management" {...register("name", { required: true })} />
          </div>

          {/* Code + Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-600">Code</label>
              <Input placeholder="e.g. M-02" {...register("code")} />
            </div>

            <div>
              <label className="text-sm text-slate-600">Hierarchy Level</label>
              <Input type="number" placeholder="e.g. 1" {...register("hierarchy_level")} />
            </div>
          </div>

          {/* Currency */}
          <div>
            <label className="text-sm text-slate-600">Currency</label>
            <Controller
              name="currency_id"
              control={control}
              render={({ field }) => (
                <select
                  className="w-full border rounded-md h-10 px-3 bg-white"
                  disabled={currenciesLoading}
                  value={field.value == null ? "" : String(field.value)}
                  onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                >
                  <option value="">{currenciesLoading ? "Loading..." : "Select Currency"}</option>
                  {currencyOptions.map((o) => (
                    <option key={o.id} value={String(o.id)}>
                      {o.label}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>

          {/* Salary Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-600">Min Base Salary</label>
              <Input type="number" placeholder="0" {...register("min_base_salary")} />
            </div>

            <div>
              <label className="text-sm text-slate-600">Max Base Salary</label>
              <Input type="number" placeholder="0" {...register("max_base_salary")} />
            </div>

            {(minSal != null && maxSal != null && Number(minSal) > Number(maxSal)) && (
              <div className="md:col-span-2 text-xs text-amber-600 flex items-center gap-2">
                <ToggleLeft className="h-4 w-4" />
                Min salary is greater than Max — I’ll auto-swap on save.
              </div>
            )}
          </div>

          {/* Active switch */}
          <div className="rounded-lg border bg-slate-50 p-3 flex items-center justify-between">
            <div>
              <div className="font-medium text-slate-900">Status</div>
              <div className="text-xs text-slate-500">Enable/disable this grade</div>
            </div>

            <Controller
              name="active"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">{field.value ? "Active" : "Inactive"}</span>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </div>
              )}
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button type="submit" disabled={saving}>
              {isCreate ? "Create Grade" : "Update Grade"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default GradeModal;
