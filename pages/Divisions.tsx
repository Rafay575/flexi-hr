import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
} from "@/components/ui/Card";
import { Plus, Layers, Pencil, Download, Upload, MoreVertical, Eye, Search } from "lucide-react";
import { DataTable, DataTableQuery } from "@/components/ui/CustomDatatable";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { downloadCSV } from "@/services/csvUtils";
import { DivisionModal } from "@/components/DivisionModal";
import { DivisionViewModal } from "@/components/DivisionViewModal";
import { api } from "@/components/api/client";
import { Division } from "../types";
// ------------ Types -------------
export type DivisionStatus = "active" | "inactive";
type StatusFilter = "all" | "active" | "inactive";
type ViewMode = "table" | "card"; // Removed tree view

type DivisionForUI = Division & {
  status: DivisionStatus;
  regionName: string | null;
  departments?: number | null;
  employees?: number | null;
};

type DivisionApi = {
  id: number;
  company_id: number;
  region_id: number | null;
  name: string;
  code: string;
  active: boolean;
  description: string | null;
  head_employee_id: number | null;
  is_draft: number;
  draft_batch_id: string | null;
  superseded_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  company_name: string;
  region_name: string | null;
  departments_count?: number;
  employees_count?: number;
};

type DivisionsApiResponse = {
  data: DivisionApi[];
  meta?: {
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
  };
  pagination?: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
  };
};

type TableQuery = {
  pageIndex: number;
  pageSize: number;
  search: string;
};

function mapDivisionApiToDivision(d: DivisionApi): DivisionForUI {
  return {
    id: d.id,
    name: d.name,
    code: d.code,
    company_id: String(d.company_id),
    companyName: d.company_name,
    region_id: d.region_id !== null ? String(d.region_id) : null,
    regionName: d.region_name,
    active: d.active,
    status: d.active ? "active" : "inactive",
    description: d.description,
    headOfDivisionId: d.head_employee_id,
    createdAt: d.created_at,
    updatedAt: d.updated_at,
    departments: d.departments_count || 0,
    employees: d.employees_count || 0,
  } as DivisionForUI;
}

// ------------ API -------------
async function fetchDivisionsTable(
  query: TableQuery,
  status: StatusFilter,
  companyId: number = 1
): Promise<DivisionsApiResponse> {
  const page = query.pageIndex + 1;
  const queryParams = new URLSearchParams({
    page: String(page),
    per_page: String(query.pageSize),
  });

  if (query.search.trim()) queryParams.append('q', query.search.trim());
  if (status !== "all") queryParams.append('status', status);

  const url = `/company-divisions/company_index?${queryParams.toString()}`;
  
  const res = await api.post<DivisionsApiResponse>(url, {
    company_id: companyId,
  }, {
    headers: {
      Accept: "application/json",
      'Content-Type': 'application/json',
    },
  });

  if (!res.data) throw new Error("Failed to fetch divisions");
  return res.data;
}

// -------------------- Page --------------------
function DivisionsPage() {
  const [viewMode, setViewMode] = React.useState<ViewMode>("table");
  const [tableQuery, setTableQuery] = React.useState<TableQuery>({
    pageIndex: 0,
    pageSize: 10,
    search: "",
  });
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isViewOpen, setIsViewOpen] = React.useState(false);
  const [editingDivision, setEditingDivision] = React.useState<Division | null>(null);
  const [viewingDivision, setViewingDivision] = React.useState<DivisionForUI | null>(null);
  const [totalItems, setTotalItems] = React.useState(0);
  const navigate = useNavigate();

  const companyId = 1;

  // Track previous values for page reset logic
  const prevSearchRef = React.useRef("");
  const prevStatusRef = React.useRef<StatusFilter>("all");

  // Reset page when search or filter changes
  React.useEffect(() => {
    const hasSearchChanged = tableQuery.search !== prevSearchRef.current;
    const hasStatusChanged = statusFilter !== prevStatusRef.current;

    if (hasSearchChanged) prevSearchRef.current = tableQuery.search;
    if (hasStatusChanged) prevStatusRef.current = statusFilter;

    if (hasSearchChanged || hasStatusChanged) {
      setTableQuery(prev => ({
        ...prev,
        pageIndex: 0,
      }));
    }
  }, [tableQuery.search, statusFilter]);

  // Fetch data
const divisionsQuery = useQuery({
  queryKey: ["divisions-table", tableQuery, statusFilter, companyId],
  queryFn: () => fetchDivisionsTable(tableQuery, statusFilter, companyId),
  enabled: true,
  // If using React Query v5 with full callback options
  ...("5" === "5" && {
    callbacks: {
      onSuccess: (data) => {
        console.log('data', data);
        setTotalItems(data.pagination?.total || data.meta?.total || 0);
      }
    }
  })
});

const tableData = divisionsQuery.data?.data?.map(mapDivisionApiToDivision) ?? [];
  // const totalItems = divisionsQuery.data?.pagination?.total || 0;
  const isFetching = divisionsQuery.isFetching;

  // Handle page overflow
  React.useEffect(() => {
    if (totalItems > 0) {
      const totalPages = Math.ceil(totalItems / tableQuery.pageSize);
      const currentPage = tableQuery.pageIndex + 1;

      if (currentPage > totalPages) {
        setTableQuery(prev => ({
          ...prev,
          pageIndex: Math.max(0, totalPages - 1),
        }));
      }
    }
  }, [totalItems, tableQuery.pageSize]);

  // Handlers
  const handleCreate = () => {
    setEditingDivision(null);
    setIsModalOpen(true);
  };

  const handleExport = () => {
    if (!tableData.length) return;
    const exportData = tableData.map((d, index) => ({
      'Sr No': (tableQuery.pageIndex * tableQuery.pageSize) + index + 1,
      'Name': d.name,
      'Code': d.code,
      'Company': d.companyName,
      'Region': d.regionName || d.region_id || '',
      'Departments': d.departments || 0,
      'Employees': d.employees || 0,
      'Status': d.active ? 'Active' : 'Inactive',
      'Description': d.description || '',
    }));
    downloadCSV(exportData, `divisions_export_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  // Columns definition
  const columns = React.useMemo<ColumnDef<DivisionForUI>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "Division Name",
        meta: { headerClassName: "text-left pl-2" },
        cell: ({ row }) => {
          const division = row.original;
          return (
            <div className="flex gap-1 justify-start">
              <div className="w-8 h-8 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Layers className="h-5 w-5" />
              </div>
              <div className="ml-2 flex flex-col">
                <span className="font-medium text-sm">{division.name}</span>
                <span className="text-xs text-muted-foreground">{division.companyName ?? "—"}</span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "code",
        header: "Code",
        meta: { headerClassName: "text-left pl-2" },
        cell: ({ row }) => (
          <span className="font-mono text-sm text-muted-foreground">
            {row.original.code || "—"}
          </span>
        ),
      },
      {
        accessorKey: "regionName",
        header: "Region",
        meta: { headerClassName: "text-left pl-2" },
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.regionName || row.original.region_id || "—"}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        accessorKey: "departments",
        header: "Departments",
        meta: { headerClassName: "text-center" },
        cell: ({ row }) => (
          <div className="flex h-7 px-4 w-fit items-center justify-center rounded-md mx-auto bg-muted text-xs font-medium">
            {row.original.departments ?? 0}
          </div>
        ),
      },
      {
        accessorKey: "employees",
        header: "Employees",
        meta: { headerClassName: "text-center" },
        cell: ({ row }) => (
          <div className="flex h-7 px-4 w-fit items-center justify-center rounded-md mx-auto bg-muted text-xs font-medium">
            {row.original.employees ?? 0}
          </div>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const division = row.original;
          return (
            <div className="flex justify-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-40 p-2 bg-white flex flex-col gap-1">
                  <Button size="sm" variant="ghost" className="w-full justify-start gap-2 text-sm" onClick={() => setViewingDivision(division)}>
                    <Eye className="h-3 w-3" /> View
                  </Button>
                  <Button size="sm" variant="ghost" className="w-full justify-start gap-2 text-sm" onClick={() => setEditingDivision(division)}>
                    <Pencil className="h-3 w-3" /> Edit
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
          );
        },
      },
    ];
  }, []);

  const statusFilterUI = (
    <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
      <SelectTrigger className="h-9 w-[130px] bg-white">
        <SelectValue placeholder="All Status" />
      </SelectTrigger>
      <SelectContent className="bg-white">
        <SelectItem value="all">All Status</SelectItem>
        <SelectItem value="active">Active</SelectItem>
        <SelectItem value="inactive">Inactive</SelectItem>
      </SelectContent>
    </Select>
  );

  const perPageOptions = [10, 20, 50, 100];
  const perPageDropdown = (
    <Select
      value={String(tableQuery.pageSize)}
      onValueChange={(value) => {
        setTableQuery((prev) => ({
          ...prev,
          pageSize: Number(value),
          pageIndex: 0,
        }));
      }}
    >
      <SelectTrigger className="h-9 w-[100px] bg-white">
        <SelectValue placeholder="Per page" />
      </SelectTrigger>
      <SelectContent className="bg-white">
        {perPageOptions.map((size) => (
          <SelectItem key={size} value={String(size)}>
            {size}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Divisions & Groups</h1>
          <p className="text-sm">
            Manage top-level business units, regional groups, and functional divisions.
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <Button variant="outline" className="my-0" >
            <Upload className="h-4 w-4 mr-2" /> Import
          </Button>
          <Button variant="outline" className="my-0" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button
            variant="outline"
            className="my-0 transition-all duration-500 hover:bg-[#1E1B4B] hover:text-white"
            onClick={handleCreate}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Division
          </Button>
        </div>
      </div>

      {/* Filters Card */}
      <Card className="shadow-sm border-border/40">
        <CardContent className="p-4">
          <div className="flex flex-col md:items-center justify-between gap-4">
            {viewMode === "table" && (
              <div className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
                  <Input
                    placeholder="Search divisions by name, code, or region..."
                    value={tableQuery.search}
                    onChange={(e) => setTableQuery((prev) => ({ ...prev, search: e.target.value, pageIndex: 0 }))}
                    className="pl-9 w-full bg-white"
                  />
                </div>
              </div>
            )}
            <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
              {viewMode === "table" && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Show</span>
                  {perPageDropdown}
                  <span className="text-sm text-muted-foreground">entries</span>
                </div>
              )}
              {statusFilterUI}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Area */}
    
          <DataTable<DivisionForUI, unknown>
            columns={columns}
            data={tableData}
            totalItems={totalItems}
            serverSide
            onQueryChange={(q) => setTableQuery(q)}
            isLoading={isFetching}
            filtersSlot={null}
            initialPageSize={tableQuery.pageSize}
            showSrColumn={true}
            emptyMessage="No divisions found. Create your first division to get started."
            className="border-0"
          />
      
      {/* Modals */}
      <DivisionViewModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        division={viewingDivision}
      />

      <DivisionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        division={editingDivision}
      />
    </div>
  );
}

export default DivisionsPage;
