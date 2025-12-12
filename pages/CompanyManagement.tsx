import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Link, useNavigate } from "react-router-dom";

import { DataTable } from "@/components/ui/CustomDatatable";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import {
  Eye,
  Pencil,
  MoreVertical,
  Building2,
  PlusIcon,
  Download,
  Upload,
} from "lucide-react";
import { api } from "@/components/api/client"; // or "@/lib/apiClient" if you renamed it
import { CompanyProvider, useCompanyContext } from "@/context/CompanyContext";

// ---------- Types ----------
type Company = {
  id: number;
  legal_name: string;
  registration_no: string;
  entity_type: string | null;
  status: string | null; // e.g. "active", "inactive", "draft"
  divisions: number | null;
  departments: number | null;
  employees: number | null;
  website: string | null;
};

type CompaniesResponse = {
  success: boolean;
  data: Company[];
  meta: {
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
  };
};

type TableQuery = {
  pageIndex: number; // 0-based for DataTable
  pageSize: number;
  search: string;
};

type StatusFilter = "all" | "active" | "inactive";

// ---------- API ----------
async function fetchCompanies(
  query: TableQuery,
  status: StatusFilter
): Promise<CompaniesResponse> {
  const page = query.pageIndex + 1; // backend is 1-based

  const params: Record<string, string> = {
    page: String(page),
    per_page: String(query.pageSize),
  };

  if (query.search.trim()) {
    params.q = query.search.trim();
  }

  if (status !== "all") {
    params.status = status;
  }

  const res = await api.get<CompaniesResponse>("/v1/companies", {
    params,
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.data.success) {
    throw new Error("Network response was not ok");
  }

  return res.data;
}

// ---------- Inner page that can use context ----------
function CompaniesPageInner() {
  const [tableQuery, setTableQuery] = React.useState<TableQuery>({
    pageIndex: 0,
    pageSize: 10,
    search: "",
  });

  const [statusFilter, setStatusFilter] =
    React.useState<StatusFilter>("all");

  const navigate = useNavigate();
  const { setCompanyData } = useCompanyContext();

  const { data, isFetching } = useQuery({
    queryKey: ["companies", tableQuery, statusFilter],
    queryFn: () => fetchCompanies(tableQuery, statusFilter),
  });

  const companies = data?.data ?? [];
  const totalItems = data?.meta.total ?? 0;

  // columns need access to setCompanyData and navigate → define INSIDE component
  const columns = React.useMemo<ColumnDef<Company>[]>(() => {
    return [
      {
        accessorKey: "legal_name",
        header: "Name",
        meta: { headerClassName: "text-left pl-2" },
        cell: ({ row }) => {
          const company = row.original;
          return (
            <div className="flex gap-1 justify-start">
              <div className="flex p-2 items-center justify-center rounded-md bg-muted text-xs font-medium">
                <Building2 className="h-4 w-4" />
              </div>
              <div className="ml-2 flex flex-col">
                <span className="font-medium text-sm">
                  {company.legal_name}
                </span>
                <span className="font-medium text-xs">
                  {company.website ?? "—"}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "registration_no",
        header: "Code / Reg No.",
        meta: { headerClassName: "text-left pl-2" },
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.registration_no || "—"}
          </span>
        ),
      },
      {
        accessorKey: "entity_type",
        header: "Entity type",
        meta: { headerClassName: "text-left pl-2" },
        cell: ({ row }) => (
          <span className="text-sm">
            {row.original.entity_type && row.original.entity_type !== ""
              ? row.original.entity_type
              : "--"}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const rawStatus = (row.original.status ?? "").toLowerCase();

          let label = "DRAFT";
          let className =
            "bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-center w-fit mx-auto text-[11px] font-semibold";

          if (rawStatus === "active") {
            label = "ACTIVE";
            className =
              "bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-center w-fit mx-auto text-[11px] font-semibold";
          } else if (rawStatus === "inactive") {
            label = "INACTIVE";
            className =
              "bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-full text-center w-fit mx-auto text-[11px] font-semibold";
          }

          return <div className={className}>{label}</div>;
        },
      },
      {
        accessorKey: "divisions",
        header: "Divisions",
        meta: { headerClassName: "text-center" },
        cell: ({ row }) => (
          <div className="flex h-7 px-4 w-fit items-center justify-center rounded-md mx-auto bg-muted text-xs font-medium">
            {row.original.divisions ?? 0}
          </div>
        ),
      },
      {
        accessorKey: "departments",
        header: "Depts",
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
          const company = row.original;

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
                    asChild
                    size="sm"
                    variant="ghost"
                    className="w-full justify-start gap-2 text-sm"
                  >
                    <Link
                      to={`/flexi-hq/hr-groundzero/companies/${company.id}/summary`}
                    >
                      <Eye className="h-3 w-3" />
                      View
                    </Link>
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full justify-start gap-2 text-sm"
                    onClick={() => {
                      setCompanyData(company.id, "");
                      navigate("/flexi-hq/hr-groundzero/companies/create");
                    }}
                  >
                    <Pencil className="h-3 w-3" />
                    Edit
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
          );
        },
      },
    ];
  }, [setCompanyData, navigate]);

  const filtersSlot = (
    <Select
      value={statusFilter}
      onValueChange={(value) => setStatusFilter(value as StatusFilter)}
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
    <div className="p-2">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Companies</h1>
          <p className="text-sm">
            Manage your legal entities, subsidiaries, and registration details.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="my-0">
            <Download />
            Import
          </Button>
          <Button variant="outline" className="my-0">
            <Upload />
            Export
          </Button>
          <Link to="/company-create">
            <Button
              variant="outline"
              className="my-0 transition-all duration-500 hover:bg-[#1E1B4B]  hover:text-white "
            >
              <PlusIcon />
              Add Company
            </Button>
          </Link>
        </div>
      </div>

      <DataTable<Company, unknown>
        columns={columns}
        data={companies}
        totalItems={totalItems}
        serverSide
        onQueryChange={(q) => setTableQuery(q)}
        isLoading={isFetching}
        filtersSlot={filtersSlot}
      />
    </div>
  );
}

// ---------- Wrapper with Provider on top ----------
const CompaniesPage: React.FC = () => {
  return (
    <CompanyProvider>
      <CompaniesPageInner />
    </CompanyProvider>
  );
};

export default CompaniesPage;
