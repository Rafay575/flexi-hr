import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import {
  Plus,
  Layers,
  Pencil,
  Download,
  Upload,
  MoreVertical,
  Eye,
} from "lucide-react";

import { api } from "@/components/api/client";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable, DataTableQuery } from "@/components/ui/CustomDatatable"; 
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { downloadCSV } from "@/services/csvUtils";
import { DivisionModal } from "@/components/DivisionModal";
import { DivisionViewModal } from "@/components/DivisionViewModal"; 
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Division } from "@/types"; 

// ------------ Types -------------
export type DivisionStatus = "active" | "inactive";
type StatusFilter = "all" | "active" | "inactive";

type DivisionForUI = Division & {
  status: DivisionStatus;
  regionName: string | null;
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
};

type DivisionsApiResponse = {
  data: DivisionApi[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
  };
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
  } as DivisionForUI;
}

// ------------ API with URL parameters -------------
async function fetchDivisions(
  companyId: number,
  page: number = 1,
  perPage: number = 10,
  searchQuery: string = "",
  statusFilter: StatusFilter = "all"
): Promise<DivisionsApiResponse> {
  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("per_page", String(perPage));
  
  if (searchQuery) {
    params.append("q", searchQuery);
  }
  
  if (statusFilter !== "all") {
    params.append("status", statusFilter);
  }

  const res = await api.post<DivisionsApiResponse>(
    `/company-divisions/company_index?${params.toString()}`,
    {
      company_id: companyId
    },
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  return res.data;
}

// ------------ Professional Implementation -------------
export const Divisions: React.FC = () => {
  const companyId = 1; 

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isViewOpen, setIsViewOpen] = React.useState(false);
  const [isImportOpen, setIsImportOpen] = React.useState(false);
  const [editingDivision, setEditingDivision] = React.useState<Division | null>(null);
  const [viewingDivision, setViewingDivision] = React.useState<DivisionForUI | null>(null);
  
  // Main table state
  const [tableQuery, setTableQuery] = React.useState<DataTableQuery>({
    pageIndex: 0,
    pageSize: 10,
    search: "",
  });
  
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all");
  
  // Track previous values to detect changes
  const prevSearchRef = React.useRef("");
  const prevStatusRef = React.useRef<StatusFilter>("all");
  const prevPageSizeRef = React.useRef(10);

  // Convert to API parameters
  const apiPage = tableQuery.pageIndex + 1;
  const apiPerPage = tableQuery.pageSize;
  const apiSearch = tableQuery.search;

  // Professional logic: Reset page only on search/filter changes, NOT on pageSize changes
  React.useEffect(() => {
    const hasSearchChanged = apiSearch !== prevSearchRef.current;
    const hasStatusChanged = statusFilter !== prevStatusRef.current;
    const hasPageSizeChanged = apiPerPage !== prevPageSizeRef.current;

    // Update refs
    if (hasSearchChanged) prevSearchRef.current = apiSearch;
    if (hasStatusChanged) prevStatusRef.current = statusFilter;
    if (hasPageSizeChanged) prevPageSizeRef.current = apiPerPage;

    // Reset to page 1 only when search or filter changes
    if (hasSearchChanged || hasStatusChanged) {
      setTableQuery(prev => ({ 
        ...prev, 
        pageIndex: 0 
      }));
    }
    
    // When pageSize changes, keep current page but adjust if needed
    if (hasPageSizeChanged) {
      // If we're on a page that might not exist with new pageSize,
      // we'll let the backend handle it or adjust in the query
      // Most backends handle this gracefully
    }
  }, [apiSearch, statusFilter, apiPerPage]);

  // Fetch data
  const { data, isLoading } = useQuery({
    queryKey: ["divisions", companyId, apiPage, apiPerPage, apiSearch, statusFilter],
    queryFn: () => fetchDivisions(companyId, apiPage, apiPerPage, apiSearch, statusFilter),
  });

  // Map data
  const divisions: DivisionForUI[] = React.useMemo(() => {
    return data?.data?.map(mapDivisionApiToDivision) ?? [];
  }, [data]);

  const totalItems = data?.pagination?.total || 0;

  // Handle query changes from DataTable
  const handleQueryChange = (query: DataTableQuery) => {
    setTableQuery(query);
  };

  // Handle status filter change
  const handleStatusChange = (value: StatusFilter) => {
    setStatusFilter(value);
  };

  // --- HANDLERS ---
  const handleEdit = (div: DivisionForUI, e: React.MouseEvent) => {
    e.stopPropagation();
    const { status, regionName, ...baseDivision } = div; 
    setEditingDivision(baseDivision);
    setIsModalOpen(true);
  };
  
  const handleView = (div: DivisionForUI, e: React.MouseEvent) => {
    e.stopPropagation();
    setViewingDivision(div);
    setIsViewOpen(true);
  };
  
  const handleCloseView = () => {
    setIsViewOpen(false);
    setViewingDivision(null);
  };

  const handleCreate = () => {
    setEditingDivision(null);
    setIsModalOpen(true);
  };
// Add this effect in your Divisions component
React.useEffect(() => {
  if (totalItems > 0) {
    const totalPages = Math.ceil(totalItems / apiPerPage);
    const currentPage = apiPage; // 1-based
    
    // If current page is beyond available pages, reset to last page
    if (currentPage > totalPages) {
      setTableQuery(prev => ({ 
        ...prev, 
        pageIndex: Math.max(0, totalPages - 1) // Convert to 0-based
      }));
    }
  }
}, [totalItems, apiPerPage, apiPage]);
  const handleExport = () => {
    if (!divisions.length) return;
    const exportData = divisions.map((d, index) => ({
      'Sr No': (tableQuery.pageIndex * tableQuery.pageSize) + index + 1,
      Name: d.name,
      Code: d.code,
      Company: d.companyName, 
      Region: d.regionName || d.region_id || '', 
      Status: d.active ? 'Active' : 'Inactive', 
      Description: d.description || '',
    }));
    downloadCSV(
      exportData,
      `divisions_export_${new Date().toISOString().slice(0, 10)}.csv`
    );
  };

  // Columns definition
  const columns: ColumnDef<DivisionForUI>[] = [
    {
      id: "name",
      header: "Division Name",
      cell: ({ row }) => {
        const d = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Layers size={16} />
            </div>
            <div>
              <div className="font-medium text-slate-900">{d.name}</div>
              <div className="text-xs text-slate-500">
                {d.companyName ?? "—"}
              </div>
            </div>
          </div>
        );
      },
      meta: { headerClassName: "text-left pl-2" },
    },
    {
      id: "code",
      header: "Code",
      cell: ({ row }) => (
        <span className="font-mono text-slate-600">{row.original.code}</span>
      ),
      meta: { headerClassName: "text-left pl-2" },
    },
    {
      id: "region",
      header: "Region",
      cell: ({ row }) => (
        <span className="text-slate-600">
          {row.original.regionName ?? row.original.region_id ?? "—"}
        </span>
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
        const division = row.original;
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
                  className="w-full justify-start gap-2 text-sm"
                  onClick={(event) => handleView(division, event)}
                >
                  <Eye className="h-3 w-3" /> View
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full justify-start gap-2 text-sm"
                  onClick={(event) => handleEdit(division, event)}
                >
                  <Pencil className="h-3 w-3" /> Edit
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        );
      },
    },
  ];

  // Status Filter component
  const StatusFilterComponent = () => (
    <Select
      value={statusFilter}
      onValueChange={handleStatusChange}
    >
      <SelectTrigger className="h-9 w-[130px]">
        <SelectValue placeholder="All Status" />
      </SelectTrigger>
      <SelectContent className="bg-white">
        <SelectItem value="all">All Status</SelectItem>
        <SelectItem value="active">Active</SelectItem>
        <SelectItem value="inactive">Inactive</SelectItem>
      </SelectContent>
    </Select>
  );

  return (
    <div>
      <div className="p-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold">Divisions & Groups</h1>
            <p className="text-sm">
              Manage top-level business units, regional groups, and functional
              divisions.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="my-0" onClick={handleExport}>
              <Download size={16} className="mr-2" /> Export
            </Button>
            <Button
              variant="outline"
              className="my-0"
              onClick={() => setIsImportOpen(true)}
            >
              <Upload size={16} className="mr-2" /> Import
            </Button>

            <Button
              variant="outline"
              onClick={handleCreate}
              className="my-0 transition-all duration-500 hover:bg-[#1E1B4B] hover:text-white "
            >
              <Plus size={18} className="mr-2" />
              Add Division
            </Button>
          </div>
        </div>
      </div>

      {/* DataTable */}
      <DataTable<DivisionForUI, unknown>
        columns={columns}
        data={divisions}
        totalItems={totalItems}
        serverSide={true}
        onQueryChange={handleQueryChange}
        filtersSlot={<StatusFilterComponent />}
        isLoading={isLoading}
        emptyMessage="No divisions found."
        initialPageSize={10}
        showSrColumn={true}
        className="mb-6"
      />

      {/* RENDER MODALS */}
      <DivisionViewModal
        isOpen={isViewOpen}
        onClose={handleCloseView}
        division={viewingDivision}
      />

      <DivisionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        division={editingDivision}
      />
    </div>
  );
};