import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Link, useNavigate } from "react-router-dom";

import dagre from "dagre";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeTypes,
  type NodeProps,
} from "@xyflow/react";

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
  GitBranch,
  List,
} from "lucide-react";

import { api } from "@/components/api/client";
import { CompanyProvider, useCompanyContext } from "@/context/CompanyContext";

// -------------------- Types (Table) --------------------
type Company = {
  id: number;
  legal_name: string;
  registration_no: string;
  entity_type: string | null;
  status: string | null; // "active" | "inactive" | "draft" etc
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

// -------------------- Types (Tree) --------------------
type TreeDesignation = {
  id: number;
  title: string;
  code: string | null;
  job_level: number | null;
  reports_to_id: number | null;
  total_employees: number | null;
};

type TreeDepartment = {
  id: number;
  name: string;
  code: string | null;
  unit_type: string | null;
  total_employees: number | null;
  designations: TreeDesignation[];
};

type TreeDivision = {
  id: number;
  name: string;
  code: string | null;
  total_employees: number | null;
  departments: TreeDepartment[];
};

type TreeCompany = {
  id: number;
  legal_name: string;
  website: string | null;
  registration_no: string | null;
  entity_type: string | null;
  entity_type_id: number | null;
  status: string | null;
  total_employees: number | null;
  divisions: TreeDivision[];
};

type CompaniesTreeResponse = {
  success: boolean;
  data: TreeCompany[];
  meta?: {
    mode?: string;
    total?: number;
  };
};

type ViewMode = "table" | "tree";

// -------------------- API --------------------
async function fetchCompaniesTable(
  query: TableQuery,
  status: StatusFilter
): Promise<CompaniesResponse> {
  const page = query.pageIndex + 1;

  const params: Record<string, string> = {
    page: String(page),
    per_page: String(query.pageSize),
  };

  if (query.search.trim()) params.q = query.search.trim();
  if (status !== "all") params.status = status;

  const res = await api.get<CompaniesResponse>("/v1/companies", {
    params,
    headers: { Accept: "application/json" },
  });

  if (!res.data.success) throw new Error("Failed to fetch companies");
  return res.data;
}

async function fetchCompaniesTree(
  query: TableQuery,
  status: StatusFilter
): Promise<CompaniesTreeResponse> {
  const params: Record<string, string> = {
    mode: "tree", // ✅ as you requested
  };

  // optional filters (if backend supports them)
  if (query.search.trim()) params.q = query.search.trim();
  if (status !== "all") params.status = status;

  const res = await api.get<CompaniesTreeResponse>("/v1/companies", {
    params,
    headers: { Accept: "application/json" },
  });

  if (!res.data.success) throw new Error("Failed to fetch companies (tree)");
  return res.data;
}

// -------------------- ReactFlow Node --------------------
type OrgNodeData = {
  title: string;
  subtitle?: string | null;
  badge?: string | null;
};

const OrgNodeCard: React.FC<NodeProps<Node<OrgNodeData>>> = ({ data }) => {
  return (
    <div className="relative rounded-xl border bg-white px-3 py-2 shadow-sm min-w-[220px]">
      {/* ✅ REQUIRED so edges/arrows connect properly */}
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-semibold text-sm truncate">{data.title}</div>
          {data.subtitle ? (
            <div className="text-xs text-muted-foreground truncate">
              {data.subtitle}
            </div>
          ) : null}
        </div>

        {data.badge ? (
          <div className="text-[10px] font-semibold px-2 py-[2px] rounded-full bg-muted">
            {data.badge}
          </div>
        ) : null}
      </div>
    </div>
  );
};

const nodeTypes: NodeTypes = {
  orgNode: OrgNodeCard,
};

// -------------------- Tree Graph Builder + Layout --------------------
const NODE_W = 240;
const NODE_H = 66;

function layoutWithDagre(nodes: Node[], edges: Edge[]) {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));

  g.setGraph({
    rankdir: "TB", // TB = top->bottom, LR = left->right
    ranksep: 70,
    nodesep: 30,
  });

  nodes.forEach((n) => g.setNode(n.id, { width: NODE_W, height: NODE_H }));
  edges.forEach((e) => g.setEdge(e.source, e.target));

  dagre.layout(g);

  const layoutedNodes = nodes.map((n) => {
    const p = g.node(n.id);
    return {
      ...n,
      position: {
        x: p.x - NODE_W / 2,
        y: p.y - NODE_H / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}

function buildCompanyTreeGraph(company: TreeCompany): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const companyId = `c-${company.id}`;

  nodes.push({
    id: companyId,
    type: "orgNode",
    position: { x: 0, y: 0 },
    data: {
      title: company.legal_name,
      subtitle: company.website ?? company.registration_no ?? "",
      badge: (company.status ?? "").toUpperCase() || "—",
    },
  });

  (company.divisions ?? []).forEach((div) => {
    const divId = `d-${div.id}`;
    nodes.push({
      id: divId,
      type: "orgNode",
      position: { x: 0, y: 0 },
      data: {
        title: div.name,
        subtitle: div.code ? `Code: ${div.code}` : "Division",
        badge: div.total_employees != null ? `${div.total_employees}` : null,
      },
    });

    edges.push({
      id: `e-${companyId}-${divId}`,
      source: companyId,
      target: divId,
    });

    (div.departments ?? []).forEach((dept) => {
      const deptId = `dept-${dept.id}`;
      nodes.push({
        id: deptId,
        type: "orgNode",
        position: { x: 0, y: 0 },
        data: {
          title: dept.name,
          subtitle: `${dept.unit_type ?? "Department"}${dept.code ? ` • ${dept.code}` : ""}`,
          badge: dept.total_employees != null ? `${dept.total_employees}` : null,
        },
      });

      edges.push({
        id: `e-${divId}-${deptId}`,
        source: divId,
        target: deptId,
      });

      (dept.designations ?? []).forEach((des) => {
        const desId = `des-${des.id}`;
        nodes.push({
          id: desId,
          type: "orgNode",
          position: { x: 0, y: 0 },
          data: {
            title: des.title,
            subtitle: `${des.code ?? "—"}${des.job_level != null ? ` • JL ${des.job_level}` : ""}`,
            badge: des.total_employees != null ? `${des.total_employees}` : null,
          },
        });

        edges.push({
          id: `e-${deptId}-${desId}`,
          source: deptId,
          target: desId,
        });
      });
    });
  });

  return layoutWithDagre(nodes, edges);
}

// -------------------- Page --------------------
function CompaniesPageInner() {
  const [viewMode, setViewMode] = React.useState<ViewMode>("table");

  const [tableQuery, setTableQuery] = React.useState<TableQuery>({
    pageIndex: 0,
    pageSize: 10,
    search: "",
  });

  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all");

  // ✅ Tree dropdown selection
  const [selectedCompanyId, setSelectedCompanyId] = React.useState<number | null>(null);

  const navigate = useNavigate();
  const { setCompanyData } = useCompanyContext();

  const companiesTableQuery = useQuery({
    queryKey: ["companies-table", tableQuery, statusFilter],
    queryFn: () => fetchCompaniesTable(tableQuery, statusFilter),
    enabled: viewMode === "table",
  });

  const companiesTreeQuery = useQuery({
    queryKey: ["companies-tree", tableQuery.search, statusFilter], // tree doesn't really need pagination
    queryFn: () => fetchCompaniesTree(tableQuery, statusFilter),
    enabled: viewMode === "tree",
  });

  const tableData = companiesTableQuery.data?.data ?? [];
  const totalItems = companiesTableQuery.data?.meta.total ?? 0;

  const treeCompanies = companiesTreeQuery.data?.data ?? [];

  // set default selected company when tree loads
  React.useEffect(() => {
    if (viewMode !== "tree") return;
    if (!treeCompanies.length) return;
    setSelectedCompanyId((prev) => (prev == null ? treeCompanies[0].id : prev));
  }, [viewMode, treeCompanies.length]);

  const isFetching = viewMode === "table" ? companiesTableQuery.isFetching : companiesTreeQuery.isFetching;

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
              <div className="w-8 h-8 rounded bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="ml-2 flex flex-col">
                <span className="font-medium text-sm">{company.legal_name}</span>
                <span className="font-medium text-xs">{company.website ?? "—"}</span>
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
                  <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent align="end" className="w-40 p-2 bg-white flex flex-col gap-1">
                  <Button asChild size="sm" variant="ghost" className="w-full justify-start gap-2 text-sm">
                    <Link to={`/companies/${company.id}/summary`}>
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
  }, [navigate, setCompanyData]);

  const statusFilterUI = (
    <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
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

  const headerRight = (
    <div className="flex gap-2 items-center">
      {/* ✅ View toggle */}
      <div className="flex rounded-lg border overflow-hidden">
        <Button
          type="button"
          variant={viewMode === "table" ? "default" : "ghost"}
          className="rounded-none h-9"
          onClick={() => setViewMode("table")}
        >
          <List className="h-4 w-4 mr-2" />
          Table
        </Button>
        <Button
          type="button"
          variant={viewMode === "tree" ? "default" : "ghost"}
          className="rounded-none h-9"
          onClick={() => setViewMode("tree")}
        >
          <GitBranch className="h-4 w-4 mr-2" />
          Tree
        </Button>
      </div>

      {viewMode === "tree" ? (
        <Select
          value={selectedCompanyId ? String(selectedCompanyId) : ""}
          onValueChange={(v) => setSelectedCompanyId(Number(v))}
        >
          <SelectTrigger className="h-9 w-[280px]">
            <SelectValue placeholder="Select company" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {treeCompanies.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.legal_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : null}

      {statusFilterUI}
    </div>
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

        <div className="flex gap-2 items-center">
          {headerRight}

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
              className="my-0 transition-all duration-500 hover:bg-[#1E1B4B] hover:text-white"
            >
              <PlusIcon />
              Add Company
            </Button>
          </Link>
        </div>
      </div>

      {/* -------------------- TABLE MODE -------------------- */}
      {viewMode === "table" ? (
        <DataTable<Company, unknown>
          columns={columns}
          data={tableData}
          totalItems={totalItems}
          serverSide
          onQueryChange={(q) => setTableQuery(q)}
          isLoading={isFetching}
          filtersSlot={null}
        />
      ) : (
        /* -------------------- TREE MODE -------------------- */
        <div className="rounded-xl border bg-white">
          <div className="p-4 border-b">
            <div className="font-semibold text-sm">Org Tree</div>
            <div className="text-xs text-muted-foreground">
              Select a company from the dropdown to view its divisions → departments → designations.
            </div>
          </div>

          <div className="p-4">
            {!treeCompanies.length ? (
              <div className="rounded-lg border p-6 text-sm text-muted-foreground">
                No tree data found.
              </div>
            ) : (
              (() => {
                const company = treeCompanies.find((c) => c.id === selectedCompanyId) ?? treeCompanies[0];
                if (!company) return null;

                const { nodes, edges } = buildCompanyTreeGraph(company);

                return (
                  <div className="h-[680px] rounded-xl border">
                    <ReactFlow
                      nodes={nodes}
                      edges={edges}
                      nodeTypes={nodeTypes}
                      fitView
                      defaultEdgeOptions={{
                        type: "smoothstep",
                        markerEnd: { type: MarkerType.ArrowClosed },
                        style: { strokeWidth: 2 },
                      }}
                    >
                      <Background />
                      <MiniMap />
                      <Controls />
                    </ReactFlow>
                  </div>
                );
              })()
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------- Wrapper --------------------
const CompaniesPage: React.FC = () => {
  return (
    <CompanyProvider>
      <CompaniesPageInner />
    </CompanyProvider>
  );
};

export default CompaniesPage;
