// src/pages/Grades/GradesTable.tsx
import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable, DataTableQuery } from "@/components/ui/CustomDatatable";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Eye, Pencil, MoreVertical, Download, Upload, Plus, Layers } from "lucide-react";

import fetchGrades from "./fetchGrades";
import { GradeForUI } from "./types";
import { mapGradeData } from "./mapGradeData";
import GradeModal, { GradeFormValues } from "./GradeModal";

const fmtMoney = (val?: string, symbol?: string | null) => {
  const num = Number(val ?? 0);
  const s = symbol || "";
  if (Number.isNaN(num)) return `${s}0`;
  return `${s}${num.toLocaleString()}`;
};

const toNumOrNull = (v: any): number | null => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
};

const GradesTable: React.FC = () => {
  const [tableQuery, setTableQuery] = useState<DataTableQuery>({
    pageIndex: 0,
    pageSize: 10,
    search: "",
  });

  // ✅ Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "create" | "edit">("view");
  const [selectedGrade, setSelectedGrade] = useState<GradeForUI | null>(null);
  const [selectedGradeId, setSelectedGradeId] = useState<string | number>("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["employee_grades", tableQuery.pageIndex, tableQuery.pageSize, tableQuery.search],
    queryFn: () => fetchGrades(tableQuery.pageIndex + 1, tableQuery.pageSize, tableQuery.search),
  });

  const grades: GradeForUI[] = useMemo(() => (data?.data ? mapGradeData(data.data) : []), [data]);

  // ✅ Modal handlers
  const handleCreate = () => {
    setModalMode("create");
    setSelectedGrade(null);
    setSelectedGradeId("");
    setIsModalOpen(true);
  };

  const handleEdit = (grade: GradeForUI, e: React.MouseEvent) => {
    e.stopPropagation();
    setModalMode("edit");
    setSelectedGrade(grade);
    setSelectedGradeId(grade.id);
    setIsModalOpen(true);
  };

  const handleView = (grade: GradeForUI, e: React.MouseEvent) => {
    e.stopPropagation();
    setModalMode("view");
    setSelectedGrade(grade);
    setSelectedGradeId(grade.id);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedGrade(null);
    setSelectedGradeId("");
  };

  // ✅ Map listing row -> modal payload (matching GradeModal GradeFormValues)
  const getGradeDataForModal = (): Partial<GradeFormValues> | null => {
    if (!selectedGrade) return null;

    const g: any = selectedGrade;

    return {
      name: g.name ?? "",
      code: g.code ?? "",
      hierarchy_level: toNumOrNull(g.hierarchy_level),
      currency_id: toNumOrNull(g.currency_id), // IMPORTANT: make sure mapGradeData keeps currency_id
      min_base_salary: toNumOrNull(g.min_base_salary) ?? 0,
      max_base_salary: toNumOrNull(g.max_base_salary) ?? 0,
      active: !!g.active,
    };
  };

  const handleExport = () => {
    if (!grades.length) return;

    const exportData = grades.map((g, index) => ({
      "Sr No": tableQuery.pageIndex * tableQuery.pageSize + index + 1,
      "Grade Name": g.name,
      "Code": g.code || "—",
      "Hierarchy Level": g.hierarchy_level ?? "—",
      "Currency": g.currency_name ?? "—",
      "Min Salary": fmtMoney(g.min_base_salary, g.currency_code),
      "Max Salary": fmtMoney(g.max_base_salary, g.currency_code),
      "Status": g.active ? "Active" : "Inactive",
    }));

    console.log("Export data:", exportData);
    // use your CSV utility here
  };

  const columns: ColumnDef<GradeForUI>[] = [
    {
      id: "name",
      header: "Grade",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="font-medium text-slate-900">{row.original.name}</div>
            <div className="text-xs text-slate-500">{row.original.code || "—"}</div>
          </div>
        </div>
      ),
      meta: { headerClassName: "text-left pl-2" },
    },
    {
      id: "hierarchy_level",
      header: "Level",
      cell: ({ row }) => <span className="text-slate-600">{row.original.hierarchy_level ?? "—"}</span>,
      meta: { headerClassName: "text-left pl-2" },
    },
    {
      id: "currency",
      header: "Currency",
      cell: ({ row }) => (
        <span className="text-slate-600">
          {row.original.currency_name || "—"}{" "}
          {row.original.currency_code ? `(${row.original.currency_code})` : ""}
        </span>
      ),
      meta: { headerClassName: "text-left pl-2" },
    },
    {
      id: "salary_range",
      header: "Salary Range",
      cell: ({ row }) => (
        <span className="text-slate-600">
          {fmtMoney(row.original.min_base_salary, row.original.currency_code)} -{" "}
          {fmtMoney(row.original.max_base_salary, row.original.currency_code)}
        </span>
      ),
      meta: { headerClassName: "text-left pl-2" },
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.active ? "active" : "inactive"} />,
      meta: { headerClassName: "text-left" },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const grade = row.original;
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
                  onClick={(e) => handleView(grade, e)}
                >
                  <Eye className="h-3 w-3" /> View
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full justify-start gap-2 text-sm"
                  onClick={(e) => handleEdit(grade, e)}
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

  const handleQueryChange = (query: DataTableQuery) => setTableQuery(query);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Employee Grades</h1>
          <p className="text-sm text-gray-500">Manage grades, levels, and salary ranges</p>
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
            onClick={handleCreate}
            className="my-0 transition-all duration-500 hover:bg-[#1E1B4B] hover:text-white"
          >
            <Plus size={18} className="mr-2" />
            Add Grade
          </Button>
        </div>
      </div>

      <DataTable<GradeForUI, unknown>
        columns={columns}
        data={grades}
        totalItems={data?.meta.total || 0}
        serverSide={true}
        isLoading={isLoading}
        onQueryChange={handleQueryChange}
        emptyMessage="No grades found."
        initialPageSize={10}
        showSrColumn={true}
        className="mb-6"
      />

      {/* ✅ Grade Modal */}
      <GradeModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        mode={modalMode}
        gradeId={selectedGradeId}
        gradeData={getGradeDataForModal()}
        refetchGrades={refetch}
      />
    </div>
  );
};

export default GradesTable;
