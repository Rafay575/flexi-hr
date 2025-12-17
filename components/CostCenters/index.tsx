import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable, DataTableQuery } from "@/components/ui/CustomDatatable";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Eye, Pencil, MoreVertical, Download, Upload, Plus, Landmark } from "lucide-react";

import fetchCostCenters from "./fetchCostCenters";
import { mapCostCenterData } from "./mapCostCenterData";
import { CostCenterForUI } from "./types";
import CostCenterModal from "./CostCenterModal";

interface CostCentersTableProps {
  companyId: number;
}

const fmtDate = (v?: string | null) => {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return String(v);
  return d.toLocaleDateString();
};

const CostCentersTable: React.FC<CostCentersTableProps> = ({ companyId }) => {
  const [tableQuery, setTableQuery] = useState<DataTableQuery>({
    pageIndex: 0,
    pageSize: 10,
    search: "",
  });

  // ✅ Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "create" | "edit">("view");
  const [selectedCostCenter, setSelectedCostCenter] = useState<CostCenterForUI | null>(null);
  const [selectedCostCenterId, setSelectedCostCenterId] = useState<string | number>("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["cost_centers", companyId, tableQuery.pageIndex, tableQuery.pageSize, tableQuery.search],
    enabled: !!companyId,
    queryFn: () =>
      fetchCostCenters(companyId, tableQuery.pageIndex + 1, tableQuery.pageSize, tableQuery.search),
  });

  const costCenters: CostCenterForUI[] = useMemo(
    () => (data?.data ? mapCostCenterData(data.data) : []),
    [data]
  );

  // ✅ Modal handlers
  const handleCreate = () => {
    setModalMode("create");
    setSelectedCostCenter(null);
    setSelectedCostCenterId("");
    setIsModalOpen(true);
  };

  const handleView = (cc: CostCenterForUI, e: React.MouseEvent) => {
    e.stopPropagation();
    setModalMode("view");
    setSelectedCostCenter(cc);
    setSelectedCostCenterId(cc.id);
    setIsModalOpen(true);
  };

  const handleEdit = (cc: CostCenterForUI, e: React.MouseEvent) => {
    e.stopPropagation();
    setModalMode("edit");
    setSelectedCostCenter(cc);
    setSelectedCostCenterId(cc.id);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCostCenter(null);
    setSelectedCostCenterId("");
  };

  const getCostCenterDataForModal = () => {
    if (!selectedCostCenter) return null;

    return {
      company_id: selectedCostCenter.company_id,
      code: selectedCostCenter.code ?? null,
      name: selectedCostCenter.name ?? "",
      department_id: selectedCostCenter.department_id ?? null,
      location_id: selectedCostCenter.location_id ?? null,
      active: !!selectedCostCenter.active,
      valid_from: selectedCostCenter.valid_from ?? null,
      // if list doesn't return valid_to, it will stay null (still fine)
      valid_to: (selectedCostCenter as any).valid_to ?? null,
    };
  };

  const handleExport = () => {
    if (!costCenters.length) return;

    const exportData = costCenters.map((c, index) => ({
      "Sr No": tableQuery.pageIndex * tableQuery.pageSize + index + 1,
      "Name": c.name,
      "Code": c.code || "—",
      "Department": c.department_name || "—",
      "Location": c.location_name || "—",
      "Valid From": c.valid_from ? fmtDate(c.valid_from) : "—",
      "Draft": c.is_draft ? "Yes" : "No",
      "Status": c.active ? "Active" : "Inactive",
    }));

    console.log("Export data:", exportData);
  };

  const columns: ColumnDef<CostCenterForUI>[] = [
    {
      id: "name",
      header: "Cost Centre",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-slate-50 text-slate-700 flex items-center justify-center shrink-0">
            <Landmark className="w-5 h-5" />
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
      id: "department",
      header: "Department",
      cell: ({ row }) => <span className="text-slate-600">{row.original.department_name || "—"}</span>,
      meta: { headerClassName: "text-left pl-2" },
    },
    {
      id: "location",
      header: "Location",
      cell: ({ row }) => <span className="text-slate-600">{row.original.location_name || "—"}</span>,
      meta: { headerClassName: "text-left pl-2" },
    },
    {
      id: "valid_from",
      header: "Valid From",
      cell: ({ row }) => <span className="text-slate-600">{fmtDate(row.original.valid_from)}</span>,
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
        const cc = row.original;
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
                  onClick={(e) => handleView(cc, e)}
                >
                  <Eye className="h-3 w-3" /> View
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full justify-start gap-2 text-sm"
                  onClick={(e) => handleEdit(cc, e)}
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
          <h1 className="text-2xl font-semibold">Cost Centres</h1>
          <p className="text-sm text-gray-500">Manage cost centres and related mappings</p>
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
            Add Cost Centre
          </Button>
        </div>
      </div>

      <DataTable<CostCenterForUI, unknown>
        columns={columns}
        data={costCenters}
        totalItems={data?.meta?.total || 0}
        serverSide={true}
        isLoading={isLoading}
        onQueryChange={setTableQuery}
        emptyMessage="No cost centres found."
        initialPageSize={10}
        showSrColumn={true}
        className="mb-6"
      />

      {/* ✅ Cost Center Modal */}
      <CostCenterModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        mode={modalMode}
        companyId={companyId}
        costCenterId={selectedCostCenterId}
        costCenterData={getCostCenterDataForModal()}
        refetchCostCenters={refetch}
      />
    </div>
  );
};

export default CostCentersTable;
