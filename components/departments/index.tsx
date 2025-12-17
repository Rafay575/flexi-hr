// src/pages/Departments/DepartmentsTable.tsx
import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable, DataTableQuery } from "@/components/ui/CustomDatatable";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Eye, Pencil, MoreVertical, Download, Upload, Plus, Building2 } from "lucide-react";

import fetchDepartments from "./fetchDepartments";
import { DepartmentForUI } from "./types";
import { mapDepartmentData } from "./mapDepartmentData";
import DepartmentModal from "./DepartmentModal";

interface DepartmentsTableProps {
  companyId: number;
}

const DepartmentsTable: React.FC<DepartmentsTableProps> = ({ companyId }) => {
  const [tableQuery, setTableQuery] = useState<DataTableQuery>({
    pageIndex: 0,
    pageSize: 10,
    search: "",
  });

  // ✅ Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "create" | "edit">("view");
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentForUI | null>(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | number>("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["departments", companyId, tableQuery.pageIndex, tableQuery.pageSize, tableQuery.search],
    queryFn: () =>
      fetchDepartments(
        companyId,
        tableQuery.pageIndex + 1,
        tableQuery.pageSize,
        tableQuery.search
      ),
    enabled: !!companyId,
  });

  const departments: DepartmentForUI[] = useMemo(
    () => (data?.data ? mapDepartmentData(data.data) : []),
    [data]
  );

  // ✅ Modal handlers
  const handleCreate = () => {
    setModalMode("create");
    setSelectedDepartment(null);
    setSelectedDepartmentId("");
    setIsModalOpen(true);
  };

  const handleView = (dept: DepartmentForUI, e: React.MouseEvent) => {
    e.stopPropagation();
    setModalMode("view");
    setSelectedDepartment(dept);
    setSelectedDepartmentId(dept.id);
    setIsModalOpen(true);
  };

  const handleEdit = (dept: DepartmentForUI, e: React.MouseEvent) => {
    e.stopPropagation();
    setModalMode("edit");
    setSelectedDepartment(dept);
    setSelectedDepartmentId(dept.id);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDepartment(null);
    setSelectedDepartmentId("");
  };

// ✅ helpers (keep inside component)
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

const getDepartmentDataForModal = () => {
  if (!selectedDepartment) return null;

  // ✅ read optional fields safely
  const extra = selectedDepartment as any;

  return {
    division_id: toNumOrEmpty(selectedDepartment.division_id),

    // ✅ take real unit_type if available (fallback Department)
    unit_type: (extra.unit_type ?? "Department") as
      | "Department"
      | "Sub-Department"
      | "Line / Function"
      | "Team",

    name: selectedDepartment.name ?? "",
    code: selectedDepartment.code ?? "",
    short_name: selectedDepartment.short_name ?? "",
    category: (selectedDepartment.category ?? "Operational") as
      | "Operational"
      | "Support"
      | "Strategic",

    // ✅ keep these (modal has it disabled but type is needed)
    head_of_department_id: toNumOrNull(extra.head_of_department_id),

    status: (selectedDepartment.status ?? "Active") as "Active" | "Inactive",

    // ✅ cost center + description may not exist in listing response
    cost_centre_id: toNumOrNull(extra.cost_centre_id),
    description: (extra.description ?? "") as string,
  };
};


  const handleExport = () => {
    if (!departments.length) return;

    const exportData = departments.map((d, index) => ({
      "Sr No": tableQuery.pageIndex * tableQuery.pageSize + index + 1,
      "Department": d.name,
      "Code": d.code || "—",
      "Short Name": d.short_name || "—",
      "Division": d.division_name || "—",
      "Cost Centre": d.cost_centre_name || "—",
      "Category": d.category || "—",
      "Status": d.status,
      "Draft": d.is_draft ? "Yes" : "No",
    }));

    console.log("Export data:", exportData);
  };

  const columns: ColumnDef<DepartmentForUI>[] = [
    {
      id: "name",
      header: "Department",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-slate-50 text-slate-700 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="font-medium text-slate-900">{row.original.name}</div>
            <div className="text-xs text-slate-500">
              {row.original.code || "—"} {row.original.short_name ? `• ${row.original.short_name}` : ""}
            </div>
          </div>
        </div>
      ),
      meta: { headerClassName: "text-left pl-2" },
    },
    {
      id: "division",
      header: "Division",
      cell: ({ row }) => <span className="text-slate-600">{row.original.division_name || "—"}</span>,
      meta: { headerClassName: "text-left pl-2" },
    },
    {
      id: "cost_centre",
      header: "Cost Centre",
      cell: ({ row }) => <span className="text-slate-600">{row.original.cost_centre_name || "—"}</span>,
      meta: { headerClassName: "text-left pl-2" },
    },
    {
      id: "category",
      header: "Category",
      cell: ({ row }) => <span className="text-slate-600">{row.original.category || "—"}</span>,
      meta: { headerClassName: "text-left pl-2" },
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge status={row.original.status === "Active" ? "active" : "inactive"} />
      ),
      meta: { headerClassName: "text-left" },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const dept = row.original;
        return (
          <div className="flex justify-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </PopoverTrigger>

              <PopoverContent align="end" className="w-40 p-2 bg-white flex flex-col gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full justify-start gap-2 text-sm"
                  onClick={(e) => handleView(dept, e)}
                >
                  <Eye className="h-3 w-3" /> View
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full justify-start gap-2 text-sm"
                  onClick={(e) => handleEdit(dept, e)}
                >
                  <Pencil className="h-3 w-3" /> Edit
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        );
      },
      meta: { headerClassName: "text-center" },
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Departments</h1>
          <p className="text-sm text-gray-500">Manage departments, divisions, and cost centres</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="my-0" onClick={handleExport}>
            <Download size={16} className="mr-2" /> Export
          </Button>

          <Button variant="outline" className="my-0">
            <Upload size={16} className="mr-2" /> Import
          </Button>

          <Button
            variant="outline"
            className="my-0 transition-all duration-500 hover:bg-[#1E1B4B] hover:text-white"
            onClick={handleCreate}
          >
            <Plus size={18} className="mr-2" />
            Add Department
          </Button>
        </div>
      </div>

      <DataTable<DepartmentForUI, unknown>
        columns={columns}
        data={departments}
        totalItems={data?.pagination?.total || 0}
        serverSide={true}
        isLoading={isLoading}
        onQueryChange={setTableQuery}
        emptyMessage="No departments found."
        initialPageSize={10}
        showSrColumn={true}
        className="mb-6"
      />

      {/* ✅ Department Modal */}
      <DepartmentModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        mode={modalMode}
        companyId={companyId}
        departmentId={selectedDepartmentId}
        departmentData={getDepartmentDataForModal()}
        refetchDepartments={refetch}
      />
    </div>
  );
};

export default DepartmentsTable;
