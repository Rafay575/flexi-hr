// components/cost-centers/CostCenterTable.tsx
"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable, DataTableQuery } from "@/components/ui/CustomDatatable";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Eye, Pencil, MoreVertical, Building, Download, Upload, Plus, Trash2, Calendar } from "lucide-react";
import { fetchCostCenters } from "./costCenterApi";
import { CostCenterForUI } from "./types";
import { mapCostCenterData } from "./mapCostCenterData";
import CostCenterModal from "./CostCenterModal";
import { toast } from "sonner";

interface CostCenterTableProps {
  companyId: number;
}

const CostCenterTable: React.FC<CostCenterTableProps> = ({ companyId }) => {
  const [tableQuery, setTableQuery] = useState<DataTableQuery>({
    pageIndex: 0,
    pageSize: 10,
    search: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "create" | "edit">("view");
  const [selectedCostCenter, setSelectedCostCenter] = useState<CostCenterForUI | null>(null);
  const [selectedCostCenterId, setSelectedCostCenterId] = useState<string | number>("");

  // Fetch data using react-query
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["cost-centers", companyId, tableQuery.pageIndex, tableQuery.pageSize, tableQuery.search],
    queryFn: () => fetchCostCenters(
      companyId, 
      tableQuery.pageIndex + 1, 
      tableQuery.pageSize,
      tableQuery.search
    ),
    enabled: !!companyId,
  });

  // Map data for the table
  const costCenters: CostCenterForUI[] = data?.data ? mapCostCenterData(data.data) : [];

  // --- HANDLERS ---
  const handleCreate = () => {
    setModalMode("create");
    setSelectedCostCenter(null);
    setSelectedCostCenterId("");
    setIsModalOpen(true);
  };

  const handleEdit = (costCenter: CostCenterForUI, e: React.MouseEvent) => {
    e.stopPropagation();
    setModalMode("edit");
    setSelectedCostCenter(costCenter);
    setSelectedCostCenterId(costCenter.id);
    setIsModalOpen(true);
  };
  
  const handleView = (costCenter: CostCenterForUI, e: React.MouseEvent) => {
    e.stopPropagation();
    setModalMode("view");
    setSelectedCostCenter(costCenter);
    setSelectedCostCenterId(costCenter.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (costCenter: CostCenterForUI, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm(`Are you sure you want to delete "${costCenter.name}"?`)) {
      return;
    }

    try {
      // You'll need to implement deleteCostCenter function
      // await deleteCostCenter(costCenter.id);
      
      toast.success("Cost center deleted successfully");
      await refetch();
    } catch (error) {
      console.error("Error deleting cost center:", error);
      toast.error("Failed to delete cost center");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCostCenter(null);
    setSelectedCostCenterId("");
  };

  const handleRefetch = async () => {
    await refetch();
  };

  const handleExport = () => {
    if (!costCenters.length) return;
    const exportData = costCenters.map((costCenter, index) => ({
      'Sr No': (tableQuery.pageIndex * tableQuery.pageSize) + index + 1,
      'GL Code': costCenter.code,
      'Name': costCenter.name,
      'Department': costCenter.department_name || "—",
      'Location': costCenter.location_name || "—",
      'Valid From': costCenter.valid_from ? new Date(costCenter.valid_from).toLocaleDateString() : "—",
      'Status': costCenter.status,
    }));
    
    console.log("Export data:", exportData);
    // Implement your CSV export logic here
  };

  // Format date for display
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString();
  };

  // Columns definition
  const columns: ColumnDef<CostCenterForUI>[] = [
    {
      id: "code",
      header: "GL Code",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <div className="font-medium text-slate-900">{row.original.code}</div>
            <div className="text-xs text-slate-500">
              ID: {row.original.id}
            </div>
          </div>
        </div>
      ),
      meta: { headerClassName: "text-left pl-2" },
    },
    {
      id: "name",
      header: "Name",
      cell: ({ row }) => (
        <span className="text-slate-600">
          {row.original.name}
        </span>
      ),
      meta: { headerClassName: "text-left pl-2" },
    },
    {
      id: "department_name",
      header: "Department",
      cell: ({ row }) => (
        <span className="text-slate-600">
          {row.original.department_name || "—"}
        </span>
      ),
      meta: { headerClassName: "text-left pl-2" },
    },
    {
      id: "location_name",
      header: "Location",
      cell: ({ row }) => (
        <span className="text-slate-600">
          {row.original.location_name || "—"}
        </span>
      ),
      meta: { headerClassName: "text-left pl-2" },
    },
    {
      id: "valid_from",
      header: "Valid From",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-slate-600">
          <Calendar className="h-4 w-4 text-slate-400" />
          {formatDate(row.original.valid_from)}
        </div>
      ),
      meta: { headerClassName: "text-left pl-2" },
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
      meta: { headerClassName: "text-left" },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const costCenter = row.original;
        return (
          <div className="flex justify-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                align="end"
                className="w-40 p-2 bg-white flex flex-col gap-1"
              >
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full justify-start gap-2 text-sm hover:bg-blue-50"
                  onClick={(event) => handleView(costCenter, event)}
                >
                  <Eye className="h-3 w-3" /> View
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full justify-start gap-2 text-sm hover:bg-green-50"
                  onClick={(event) => handleEdit(costCenter, event)}
                >
                  <Pencil className="h-3 w-3" /> Edit
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full justify-start gap-2 text-sm hover:bg-red-50 text-red-600"
                  onClick={(event) => handleDelete(costCenter, event)}
                >
                  <Trash2 className="h-3 w-3" /> Delete
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        );
      },
      meta: { headerClassName: "text-center" },
    },
  ];

  const handleQueryChange = (query: DataTableQuery) => {
    setTableQuery(query);
  };

  // Prepare cost center data for the modal
  const getCostCenterDataForModal = (): any => {
    if (!selectedCostCenter) return null;
    
    return {
      code: selectedCostCenter.code || "",
      name: selectedCostCenter.name || "",
      department_id: selectedCostCenter.department_id?.toString() || "",
      location_id: selectedCostCenter.location_id?.toString() || "",
      parent_id: selectedCostCenter.parent_id?.toString() || "",
      valid_from: selectedCostCenter.valid_from || "",
      valid_to: selectedCostCenter.valid_to || "",
      active: selectedCostCenter.active,
    };
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Cost Centers</h1>
          <p className="text-sm text-gray-500">Manage company cost centers and allocations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="my-0" onClick={handleExport}>
            <Download size={16} className="mr-2" /> Export
          </Button>
          <Button
            variant="outline"
            className="my-0"
            // onClick={() => setIsImportOpen(true)}
          >
            <Upload size={16} className="mr-2" /> Import
          </Button>

          <Button
            variant="outline"
            onClick={handleCreate}
            className="my-0 transition-all duration-500 hover:bg-[#1E1B4B] hover:text-white"
          >
            <Plus size={18} className="mr-2" />
            Add Cost Center
          </Button>
        </div>
      </div>

      <DataTable<CostCenterForUI, unknown>
        columns={columns}
        data={costCenters}
        totalItems={data?.meta.total || 0}
        serverSide={true}
        isLoading={isLoading}
        onQueryChange={handleQueryChange}
        emptyMessage="No cost centers found."
        initialPageSize={10}
        showSrColumn={true}
        className="mb-6"
      />

      {/* Cost Center Modal */}
      <CostCenterModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        mode={modalMode}
        costCenterData={getCostCenterDataForModal()}
        costCenterId={selectedCostCenterId}
        refetchCostCenters={handleRefetch}
        companyId={companyId}
      />
    </div>
  );
};

export default CostCenterTable;