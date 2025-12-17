// src/pages/Designations/DesignationModal.tsx
import React, { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { api } from "@/components/api/client";
import { Briefcase, Building2, Layers, Hash, Users2 } from "lucide-react";

import { Switch } from "@/components/ui/switch";

type Mode = "view" | "create" | "edit";

export type DesignationFormValues = {
  company_id: number;
  title: string;
  code: string | null;
  job_level: number | null;
  grade_id: number | null;
  department_id: number | null;

  // ✅ keep in form (so it can show prefilled), but disable input
  reports_to_id: number | null;

  active: boolean;
};

type Option = { id: number; label: string };

interface DesignationModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: Mode;
  companyId: number;
  designationId?: number | string;
  designationData?: Partial<DesignationFormValues> | null; // prefill for edit/view
  refetchDesignations: () => Promise<any> | void;
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

const DesignationModal: React.FC<DesignationModalProps> = ({
  isOpen,
  onClose,
  mode,
  companyId,
  designationId,
  designationData,
  refetchDesignations,
}) => {
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isCreate = mode === "create";

  // -----------------------------
  // Dropdown Sources
  // -----------------------------

  // Departments (POST)
  const { data: departmentsRes, isLoading: departmentsLoading } = useQuery({
    queryKey: ["departments_all_for_designation", companyId],
    enabled: !!companyId && isOpen,
    queryFn: async () => {
      const res = await api.post("/departments/departments_index", {
        company_id: companyId,
        per_page: "all",
      });
      return res.data;
    },
  });

  // Grades (GET)
  const { data: gradesRes, isLoading: gradesLoading } = useQuery({
    queryKey: ["grades_all_for_designation", companyId],
    enabled: !!companyId && isOpen,
    queryFn: async () => {
      const res = await api.get("/meta/employee/grade", {
        params: { per_page: "all" },
      });
      return res.data;
    },
  });

  // Reports-to list (POST)
  const { data: reportsToRes, isLoading: reportsToLoading } = useQuery({
    queryKey: ["designations_reports_to_all", companyId],
    enabled: !!companyId && isOpen,
    queryFn: async () => {
      const res = await api.post(
        "/meta/companies/designation/designation_index",
        { company_id: companyId },
        { params: { per_page: 1000 } }
      );
      return res.data;
    },
  });

  const departmentOptions: Option[] = useMemo(() => {
    const rows = departmentsRes?.data || [];
    return rows.map((d: any) => ({ id: Number(d.id), label: d.name }));
  }, [departmentsRes]);

  const gradeOptions: Option[] = useMemo(() => {
    const rows = gradesRes?.data || [];
    return rows.map((g: any) => ({ id: Number(g.id), label: g.name }));
  }, [gradesRes]);

  const reportsToOptions: Option[] = useMemo(() => {
    const rows = reportsToRes?.data || [];
    return rows.map((r: any) => ({ id: Number(r.id), label: r.title }));
  }, [reportsToRes]);

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
  } = useForm<DesignationFormValues>({
    defaultValues: {
      company_id: companyId,
      title: "",
      code: null,
      job_level: null,
      grade_id: null,
      department_id: null,
      reports_to_id: null,
      active: true,
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    reset({
      company_id: companyId,
      title: designationData?.title ?? "",
      code: toStrOrNull(designationData?.code),
      job_level: toNumOrNull(designationData?.job_level),
      grade_id: toNumOrNull(designationData?.grade_id),
      department_id: toNumOrNull(designationData?.department_id),

      // ✅ prefill this so disabled field shows correct value
      reports_to_id: toNumOrNull(designationData?.reports_to_id),

      active: designationData?.active ?? true,
    });
  }, [isOpen, companyId, designationData, reset]);

  // -----------------------------
  // Mutations
  // -----------------------------
  const createMutation = useMutation({
    mutationFn: async (payload: DesignationFormValues) =>
      api.post("/meta/companies/designation/storedesignation", payload),
    onSuccess: async () => {
      await refetchDesignations?.();
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: DesignationFormValues) => {
      if (!designationId) throw new Error("Designation ID missing");
      return api.put(`/meta/companies/designation/updatedesignation/${designationId}`, payload);
    },
    onSuccess: async () => {
      await refetchDesignations?.();
      onClose();
    },
  });

  const onSubmit = async (values: DesignationFormValues) => {
    const payload: DesignationFormValues = {
      ...values,
      company_id: companyId,
      title: values.title.trim(),
      code: toStrOrNull(values.code),
      job_level: toNumOrNull(values.job_level),
      grade_id: toNumOrNull(values.grade_id),
      department_id: toNumOrNull(values.department_id),

      // ✅ keep it in payload (backend expects it), but user can't change it from UI
      reports_to_id: toNumOrNull(values.reports_to_id),

      active: !!values.active,
    };

    if (isCreate) return createMutation.mutateAsync(payload);
    if (isEdit) return updateMutation.mutateAsync(payload);
  };

  const modalTitle =
    mode === "create" ? "Add Designation" : mode === "edit" ? "Edit Designation" : "Designation Details";

  // -----------------------------
  // Sexy View Content
  // -----------------------------
  const SexyView = () => (
    <div className="space-y-4">
      <div className="rounded-xl border bg-white p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-semibold text-slate-900">{designationData?.title || "—"}</div>
              <div className="text-sm text-slate-500">
                {designationData?.code ? `Code: ${designationData.code}` : "No code"}
              </div>
            </div>
          </div>

          <StatusBadge status={(designationData?.active ?? true) ? "active" : "inactive"} />
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-lg bg-slate-50 p-3">
            <div className="flex items-center gap-2 text-slate-600 text-sm">
              <Layers className="h-4 w-4" /> Level
            </div>
            <div className="mt-1 font-medium text-slate-900">{designationData?.job_level ?? "—"}</div>
          </div>

          <div className="rounded-lg bg-slate-50 p-3">
            <div className="flex items-center gap-2 text-slate-600 text-sm">
              <Building2 className="h-4 w-4" /> Department
            </div>
            <div className="mt-1 font-medium text-slate-900">
              {findLabel(departmentOptions, toNumOrNull(designationData?.department_id))}
            </div>
          </div>

          <div className="rounded-lg bg-slate-50 p-3">
            <div className="flex items-center gap-2 text-slate-600 text-sm">
              <Hash className="h-4 w-4" /> Grade
            </div>
            <div className="mt-1 font-medium text-slate-900">
              {findLabel(gradeOptions, toNumOrNull(designationData?.grade_id))}
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-lg bg-indigo-50 p-3">
          <div className="flex items-center gap-2 text-slate-600 text-sm">
            <Users2 className="h-4 w-4" /> Reports To
          </div>
          <div className="mt-1 font-medium text-slate-900">
            {findLabel(reportsToOptions, toNumOrNull(designationData?.reports_to_id))}
          </div>
        </div>
      </div>
    </div>
  );

  const saving = isSubmitting || createMutation.isPending || updateMutation.isPending;

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
          {/* Title */}
          <div>
            <label className="text-sm text-slate-600">Title</label>
            <Input placeholder="e.g. Senior Product Manager" {...register("title", { required: true })} />
          </div>

          {/* Code + Job Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-600">Code</label>
              <Input placeholder="e.g. SPM-01" {...register("code")} />
            </div>

            <div>
              <label className="text-sm text-slate-600">Job Level</label>
              <Input type="number" placeholder="e.g. 10" {...register("job_level")} />
            </div>
          </div>

          {/* Department + Grade */}
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
                    <option value="">{departmentsLoading ? "Loading..." : "Select Department"}</option>
                    {departmentOptions.map((o) => (
                      <option key={o.id} value={String(o.id)}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>

            <div>
              <label className="text-sm text-slate-600">Grade</label>
              <Controller
                name="grade_id"
                control={control}
                render={({ field }) => (
                  <select
                    className="w-full border rounded-md h-10 px-3 bg-white"
                    disabled={gradesLoading}
                    value={field.value == null ? "" : String(field.value)}
                    onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                  >
                    <option value="">{gradesLoading ? "Loading..." : "Select Grade (optional)"}</option>
                    {gradeOptions.map((o) => (
                      <option key={o.id} value={String(o.id)}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>
          </div>

          {/* ✅ Reports To (Disabled but visible) */}
          <div>
            <label className="text-sm text-slate-600">Reports To</label>
            <Controller
              name="reports_to_id"
              control={control}
              render={({ field }) => (
                <select
                  className="w-full border rounded-md h-10 px-3 bg-slate-50 text-slate-600 cursor-not-allowed"
                  disabled={true}
                  value={field.value == null ? "" : String(field.value)}
                  onChange={() => {}}
                >
                  <option value="">
                    {reportsToLoading ? "Loading..." : "None"}
                  </option>

                  {reportsToOptions.map((o) => (
                    <option key={o.id} value={String(o.id)}>
                      {o.label}
                    </option>
                  ))}
                </select>
              )}
            />
            <div className="mt-1 text-xs text-slate-500">
              Reporting structure is locked for now.
            </div>
          </div>

          {/* ✅ Active Switch */}
          <div className="rounded-lg border bg-slate-50 p-3 flex items-center justify-between">
            <div>
              <div className="font-medium text-slate-900">Status</div>
              <div className="text-xs text-slate-500">Enable/disable this designation</div>
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
              {isCreate ? "Create Designation" : "Update Designation"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default DesignationModal;
