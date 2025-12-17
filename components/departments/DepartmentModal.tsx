// src/pages/Departments/DepartmentModal.tsx
import React, { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { api } from "@/components/api/client";

type Mode = "view" | "create" | "edit";

type UnitType = "Department" | "Sub-Department" | "Line / Function" | "Team";
type StatusType = "Active" | "Inactive";
type CategoryType = "Operational" | "Support" | "Strategic";

export type DepartmentFormValues = {
  company_id: number;
  division_id: number | "";
  unit_type: UnitType;
  name: string;
  code: string;
  short_name: string;
  category: CategoryType;
  head_of_department_id: number | null; // disabled for now
  status: StatusType;
  cost_centre_id: number | null;
  description: string;
};

interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: Mode;
  companyId: number;
  departmentId?: number | string;
  departmentData?: Partial<DepartmentFormValues> | null;
  refetchDepartments: () => Promise<any> | void;
}

const toNumOrEmpty = (v: any): number | "" => {
  if (v === null || v === undefined || v === "") return "";
  const n = Number(v);
  return Number.isNaN(n) ? "" : n;
};

const toNumOrNull = (v: any): number | null => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
};

const DepartmentModal: React.FC<DepartmentModalProps> = ({
  isOpen,
  onClose,
  mode,
  companyId,
  departmentId,
  departmentData,
  refetchDepartments,
}) => {
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isCreate = mode === "create";

  // ----------------------------
  // Dropdown data
  // ----------------------------

  // Divisions dropdown (POST, company_id in body)
  const { data: divisionsRes, isLoading: divisionsLoading } = useQuery({
    queryKey: ["company_divisions_all", companyId],
    enabled: !!companyId && isOpen,
    queryFn: async () => {
      const res = await api.post(
        "/company-divisions/company_index",
        { company_id: companyId },
        { params: { per_page: "all" } }
      );
      return res.data; // { data: [...], pagination: {...} }
    },
  });

  // Cost centers dropdown (GET)
  const { data: costCentersRes, isLoading: costCentersLoading } = useQuery({
    queryKey: ["cost_centers_all", companyId],
    enabled: !!companyId && isOpen,
    queryFn: async () => {
      const res = await api.get("/meta/companies/cost-centers", {
        params: { per_page: "all" },
      });
      return res.data; // { data: [...], meta: {...} }
    },
  });

  const divisions = useMemo(() => {
    const rows = divisionsRes?.data || [];
    return rows.map((d: any) => ({
      id: Number(d.id),
      name: d.name,
      code: d.code,
    }));
  }, [divisionsRes]);

  const costCenters = useMemo(() => {
    const rows = costCentersRes?.data || [];
    const filtered = rows.filter((c: any) => Number(c.company_id) === Number(companyId));
    return filtered.map((c: any) => ({
      id: Number(c.id),
      name: c.name,
      code: c.code,
    }));
  }, [costCentersRes, companyId]);

  // ----------------------------
  // Form
  // ----------------------------
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<DepartmentFormValues>({
    defaultValues: {
      company_id: companyId,
      division_id: "",
      unit_type: "Department",
      name: "",
      code: "",
      short_name: "",
      category: "Operational",
      head_of_department_id: null,
      status: "Active",
      cost_centre_id: null,
      description: "",
    },
  });

  // Prefill edit/view
  useEffect(() => {
    if (!isOpen) return;

    reset({
      company_id: companyId,
      division_id: toNumOrEmpty(departmentData?.division_id),
      unit_type: (departmentData?.unit_type as UnitType) ?? "Department",
      name: departmentData?.name ?? "",
      code: departmentData?.code ?? "",
      short_name: departmentData?.short_name ?? "",
      category: (departmentData?.category as CategoryType) ?? "Operational",
      head_of_department_id: toNumOrNull(departmentData?.head_of_department_id),
      status: (departmentData?.status as StatusType) ?? "Active",
      cost_centre_id: toNumOrNull(departmentData?.cost_centre_id),
      description: departmentData?.description ?? "",
    });
  }, [isOpen, companyId, departmentData, reset]);

  // ----------------------------
  // Mutations
  // ----------------------------
  const createMutation = useMutation({
    mutationFn: async (payload: DepartmentFormValues) => {
      return api.post("/departments/storedepartments", payload);
    },
    onSuccess: async () => {
      await refetchDepartments?.();
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: DepartmentFormValues) => {
      if (!departmentId) throw new Error("Department ID is missing");
      return api.put(`/departments/updatedepartments/${departmentId}`, payload);
    },
    onSuccess: async () => {
      await refetchDepartments?.();
      onClose();
    },
  });

  const onSubmit = async (values: DepartmentFormValues) => {
    const payload: DepartmentFormValues = {
      ...values,
      company_id: companyId,
      division_id: values.division_id === "" ? "" : Number(values.division_id),
      cost_centre_id: toNumOrNull(values.cost_centre_id),
      head_of_department_id: null, // ✅ disabled for now
    };

    if (isCreate) return createMutation.mutateAsync(payload);
    if (isEdit) return updateMutation.mutateAsync(payload);
  };

  const title =
    mode === "create"
      ? "Add Root Department"
      : mode === "edit"
      ? "Edit Department"
      : "View Department";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Division (CONTROLLED: fixes prefill bug) */}
        <div>
          <label className="text-sm text-slate-600">
            Division <span className="text-red-500">*</span>
          </label>

          <Controller
            name="division_id"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <select
                disabled={isView || divisionsLoading}
                className="w-full border rounded-md h-10 px-3 bg-white"
                value={field.value === "" ? "" : String(field.value)}
                onChange={(e) =>
                  field.onChange(e.target.value === "" ? "" : Number(e.target.value))
                }
              >
                <option value="">
                  {divisionsLoading ? "Loading..." : "Select Division"}
                </option>

                {divisions.map((d) => (
                  <option key={d.id} value={String(d.id)}>
                    {d.name}
                    {d.code ? ` (${d.code})` : ""}
                  </option>
                ))}
              </select>
            )}
          />
        </div>

        {/* Unit Type */}
        <div>
          <label className="text-sm text-slate-600">Unit Type</label>
          <select
            disabled={isView}
            className="w-full border rounded-md h-10 px-3 bg-white"
            {...register("unit_type")}
          >
            <optgroup label="Departmental Units">
              <option value="Department">Department</option>
              <option value="Sub-Department">Sub-Department</option>
            </optgroup>

            <optgroup label="Operational Lines">
              <option value="Line / Function">Line / Function</option>
              <option value="Team">Team</option>
            </optgroup>
          </select>
        </div>

        {/* Name */}
        <div>
          <label className="text-sm text-slate-600">Name</label>
          <Input disabled={isView} placeholder="e.g. Engineering" {...register("name", { required: true })} />
        </div>

        {/* Code + Short name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-slate-600">Code</label>
            <Input disabled={isView} placeholder="e.g. ENG" {...register("code")} />
          </div>
          <div>
            <label className="text-sm text-slate-600">Short Name</label>
            <Input disabled={isView} placeholder="e.g. Eng" {...register("short_name")} />
          </div>
        </div>

        {/* Category + Head of Department (disabled) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-slate-600">Category</label>
            <select
              disabled={isView}
              className="w-full border rounded-md h-10 px-3 bg-white"
              {...register("category")}
            >
              <option value="Operational">Operational</option>
              <option value="Support">Support</option>
              <option value="Strategic">Strategic</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-600">Head of Department</label>
            <select
              disabled={true}
              className="w-full border rounded-md h-10 px-3 bg-white opacity-70"
              value=""
              onChange={() => {}}
            >
              <option value="">Select Manager</option>
            </select>
          </div>
        </div>

        {/* Status + Cost Center (CONTROLLED: fixes prefill bug) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-slate-600">Status</label>
            <select
              disabled={isView}
              className="w-full border rounded-md h-10 px-3 bg-white"
              {...register("status")}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-600">Cost Center</label>

            <Controller
              name="cost_centre_id"
              control={control}
              render={({ field }) => (
                <select
                  disabled={isView || costCentersLoading}
                  className="w-full border rounded-md h-10 px-3 bg-white"
                  value={field.value == null ? "" : String(field.value)}
                  onChange={(e) =>
                    field.onChange(e.target.value === "" ? null : Number(e.target.value))
                  }
                >
                  <option value="">
                    {costCentersLoading ? "Loading..." : "Select Cost Center (Optional)"}
                  </option>

                  {costCenters.map((c) => (
                    <option key={c.id} value={String(c.id)}>
                      {c.name}
                      {c.code ? ` (${c.code})` : ""}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-sm text-slate-600">Description</label>
          <textarea
            disabled={isView}
            className="w-full border rounded-md p-3 min-h-[110px]"
            placeholder="This department is responsible for..."
            {...register("description")}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>

          {!isView && (
            <Button
              type="submit"
              disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
            >
              {isCreate ? "Create Unit" : "Update Unit"}
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default DepartmentModal;
