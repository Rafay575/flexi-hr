import React, { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Switch } from "@/components/ui/switch";
import { api } from "@/components/api/client";
import { Building2, MapPin, CalendarDays, Landmark } from "lucide-react";

type Mode = "view" | "create" | "edit";

type Option = { id: number; label: string };

export type CostCenterFormValues = {
  company_id: number;
  code: string | null;
  name: string;
  department_id: number | null;
  location_id: number | null;
  active: boolean;
  valid_from: string | null; // "YYYY-MM-DD"
  valid_to: string | null;   // "YYYY-MM-DD"
};

interface CostCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: Mode;
  companyId: number;
  costCenterId?: number | string;
  costCenterData?: Partial<CostCenterFormValues> | null;
  refetchCostCenters: () => Promise<any> | void;
}

const toNumOrNull = (v: any): number | null => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
};

const toStrOrNull = (v: any): string | null => {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
};

const toDateOrNull = (v: any): string | null => {
  if (!v) return null;
  const s = String(v).trim();
  return s === "" ? null : s; // API wants YYYY-MM-DD, keep as-is
};

const fmtDate = (v?: string | null) => (v ? v : "—");

const CostCenterModal: React.FC<CostCenterModalProps> = ({
  isOpen,
  onClose,
  mode,
  companyId,
  costCenterId,
  costCenterData,
  refetchCostCenters,
}) => {
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isCreate = mode === "create";

  // -----------------------------
  // Dropdown sources
  // -----------------------------
  const { data: departmentsRes, isLoading: departmentsLoading } = useQuery({
    queryKey: ["departments_all_for_costcenter", companyId],
    enabled: !!companyId && isOpen,
    queryFn: async () => {
      // same one you used in DesignationModal
      const res = await api.post("/departments/departments_index", {
        company_id: companyId,
        per_page: "all",
      });
      return res.data;
    },
  });

  const { data: locationsRes, isLoading: locationsLoading } = useQuery({
    queryKey: ["locations_all_for_costcenter", companyId],
    enabled: !!companyId && isOpen,
    queryFn: async () => {
      // ⚠️ Update this endpoint if yours is different
      // Example: /meta/companies/locations/locations_index
      const res = await api.get("/meta/companies/locations", {
          headers:{ per_page: "all",}
      });
      return res.data;
    },
  });

  const departmentOptions: Option[] = useMemo(() => {
    const rows = departmentsRes?.data || [];
    return rows.map((d: any) => ({ id: Number(d.id), label: d.name }));
  }, [departmentsRes]);

  const locationOptions: Option[] = useMemo(() => {
    const rows = locationsRes?.data || [];
    return rows.map((l: any) => ({ id: Number(l.id), label: l.name }));
  }, [locationsRes]);

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
  } = useForm<CostCenterFormValues>({
    defaultValues: {
      company_id: companyId,
      code: null,
      name: "",
      department_id: null,
      location_id: null,
      active: true,
      valid_from: null,
      valid_to: null,
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    reset({
      company_id: companyId,
      code: toStrOrNull(costCenterData?.code),
      name: costCenterData?.name ?? "",
      department_id: toNumOrNull(costCenterData?.department_id),
      location_id: toNumOrNull(costCenterData?.location_id),
      active: costCenterData?.active ?? true,
      valid_from: toDateOrNull(costCenterData?.valid_from),
      valid_to: toDateOrNull(costCenterData?.valid_to),
    });
  }, [isOpen, companyId, costCenterData, reset]);

  // -----------------------------
  // Mutations
  // -----------------------------
  const createMutation = useMutation({
    mutationFn: async (payload: CostCenterFormValues) =>
      api.post("/meta/companies/cost-centers/store", payload),
    onSuccess: async () => {
      await refetchCostCenters?.();
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: CostCenterFormValues) => {
      if (!costCenterId) throw new Error("Cost center ID missing");
      return api.put(`/meta/companies/cost-centers/update/${costCenterId}`, payload);
    },
    onSuccess: async () => {
      await refetchCostCenters?.();
      onClose();
    },
  });

  const onSubmit = async (values: CostCenterFormValues) => {
    const payload: CostCenterFormValues = {
      company_id: companyId,
      code: toStrOrNull(values.code),
      name: values.name.trim(),
      department_id: toNumOrNull(values.department_id),
      location_id: toNumOrNull(values.location_id),
      active: !!values.active,
      valid_from: toDateOrNull(values.valid_from),
      valid_to: toDateOrNull(values.valid_to),
    };

    if (isCreate) return createMutation.mutateAsync(payload);
    if (isEdit) return updateMutation.mutateAsync(payload);
  };

  const modalTitle =
    mode === "create"
      ? "Add Cost Centre"
      : mode === "edit"
      ? "Edit Cost Centre"
      : "Cost Centre Details";

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
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-semibold text-slate-900">{costCenterData?.name || "—"}</div>
              <div className="text-sm text-slate-500">
                {costCenterData?.code ? `Code: ${costCenterData.code}` : "No code"}
              </div>
            </div>
          </div>

          <StatusBadge status={(costCenterData?.active ?? true) ? "active" : "inactive"} />
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-lg bg-slate-50 p-3">
            <div className="flex items-center gap-2 text-slate-600 text-sm">
              <Building2 className="h-4 w-4" /> Department
            </div>
            <div className="mt-1 font-medium text-slate-900">
              {findLabel(departmentOptions, toNumOrNull(costCenterData?.department_id))}
            </div>
          </div>

          <div className="rounded-lg bg-slate-50 p-3">
            <div className="flex items-center gap-2 text-slate-600 text-sm">
              <MapPin className="h-4 w-4" /> Location
            </div>
            <div className="mt-1 font-medium text-slate-900">
              {findLabel(locationOptions, toNumOrNull(costCenterData?.location_id))}
            </div>
          </div>

          <div className="rounded-lg bg-slate-50 p-3">
            <div className="flex items-center gap-2 text-slate-600 text-sm">
              <CalendarDays className="h-4 w-4" /> Validity
            </div>
            <div className="mt-1 font-medium text-slate-900">
              {fmtDate(costCenterData?.valid_from)} <span className="text-slate-400">→</span>{" "}
              {fmtDate(costCenterData?.valid_to)}
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
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-sm text-slate-600">Name</label>
            <Input placeholder="e.g. Research & Development" {...register("name", { required: true })} />
          </div>

          {/* Code */}
          <div>
            <label className="text-sm text-slate-600">Code</label>
            <Input placeholder="e.g. CC-1002" {...register("code")} />
          </div>

          {/* Department + Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-600">Department</label>
              <Controller
                name="department_id"
                control={control}
                render={({ field }) => (
                  <select
                    className="w-full border rounded-md h-10 px-3 bg-white"
                    disabled={departmentsLoading}
                    value={field.value == null ? "" : String(field.value)}
                    onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                  >
                    <option value="">{departmentsLoading ? "Loading..." : "Select Department (optional)"}</option>
                    {departmentOptions.map((o) => (
                      <option key={o.id} value={String(o.id)}>{o.label}</option>
                    ))}
                  </select>
                )}
              />
            </div>

            <div>
              <label className="text-sm text-slate-600">Location</label>
              <Controller
                name="location_id"
                control={control}
                render={({ field }) => (
                  <select
                    className="w-full border rounded-md h-10 px-3 bg-white"
                    disabled={locationsLoading}
                    value={field.value == null ? "" : String(field.value)}
                    onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                  >
                    <option value="">{locationsLoading ? "Loading..." : "Select Location (optional)"}</option>
                    {locationOptions.map((o) => (
                      <option key={o.id} value={String(o.id)}>{o.label}</option>
                    ))}
                  </select>
                )}
              />
            </div>
          </div>

          {/* Valid From + Valid To */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-600">Valid From</label>
              <Controller
                name="valid_from"
                control={control}
                render={({ field }) => (
                  <Input
                    type="date"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                  />
                )}
              />
            </div>

            <div>
              <label className="text-sm text-slate-600">Valid To</label>
              <Controller
                name="valid_to"
                control={control}
                render={({ field }) => (
                  <Input
                    type="date"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                  />
                )}
              />
            </div>
          </div>

          {/* Active Switch */}
          <div className="rounded-lg border bg-slate-50 p-3 flex items-center justify-between">
            <div>
              <div className="font-medium text-slate-900">Status</div>
              <div className="text-xs text-slate-500">Enable/disable this cost centre</div>
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
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving}>
              {isCreate ? "Create Cost Centre" : "Update Cost Centre"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default CostCenterModal;
