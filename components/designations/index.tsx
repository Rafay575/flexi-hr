import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable, DataTableQuery } from "@/components/ui/CustomDatatable";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Eye, Pencil, MoreVertical, Download, Upload, Plus, Briefcase, GitBranch, List } from "lucide-react";

import fetchDesignations, { DesignationsMode } from "./fetchDesignations";
import { DesignationForUI } from "./types";
import { mapDesignationData } from "./mapDesignationData";
import DesignationModal from "./DesignationModal";
import DesignationTreeFlow from "./DesignationTreeFlow"; // 

interface DesignationsTableProps {
  companyId: number;
}

type TreeDesignation = Omit<DesignationForUI, "active_emp_count"> & {
  active_emp_count: number;
  children?: TreeDesignation[];
};

const mapDesignationTreeData = (arr: any[]): TreeDesignation[] => {
  const walk = (items: any[]): TreeDesignation[] =>
    (items || []).map((x) => ({
      id: x.id,
      title: x.title ?? "",
      code: x.code ?? null,
      job_level: x.job_level ?? null,
      job_level_label: x.job_level_label ?? null,
      department_id: x.department_id ?? null,
      department_name: x.department_name ?? null,
      grade_id: x.grade_id ?? null,
      grade_name: x.grade_name ?? null,
      reports_to_id: x.reports_to_id ?? null,
      reports_to_title: x.reports_to_title ?? null,
      active_emp_count: Number(x.active_emp_count ?? 0) || 0,
      active: !!x.active,
      company_id: x.company_id ?? undefined,
      sort_order: x.sort_order ?? 0,
      children: walk(x.children || []),
    }));

  return walk(arr || []);
};

const flattenTree = (nodes: TreeDesignation[]) => {
  const out: TreeDesignation[] = [];
  const dfs = (arr: TreeDesignation[]) => {
    for (const n of arr) {
      out.push(n);
      if (n.children?.length) dfs(n.children);
    }
  };
  dfs(nodes);
  return out;
};

const buildFocusHierarchy = (roots: TreeDesignation[], targetId: string): TreeDesignation[] => {
  const flat = flattenTree(roots);
  const nodeMap = new Map<string, TreeDesignation>();
  flat.forEach((n) => nodeMap.set(String(n.id), n));

  // parent map from tree structure
  const parentMap = new Map<string, string>(); // childId -> parentId
  const dfsParents = (arr: TreeDesignation[]) => {
    for (const n of arr) {
      for (const c of n.children || []) parentMap.set(String(c.id), String(n.id));
      if (n.children?.length) dfsParents(n.children);
    }
  };
  dfsParents(roots);

  const target = nodeMap.get(targetId);
  if (!target) return roots;

  // chain root -> ... -> target
  const chain: string[] = [];
  let cur: string | undefined = targetId;
  while (cur) {
    chain.push(cur);
    cur = parentMap.get(cur);
  }
  chain.reverse();

  const cloneDeep = (n: TreeDesignation): TreeDesignation => ({
    ...n,
    children: (n.children || []).map(cloneDeep),
  });

  // if selected is already a root
  if (chain.length === 1) return [cloneDeep(nodeMap.get(chain[0])!)];

  const build = (idx: number): TreeDesignation => {
    const id = chain[idx];
    const n = nodeMap.get(id)!;

    // target -> full subtree
    if (idx === chain.length - 1) return cloneDeep(n);

    const nextId = chain[idx + 1];
    const next = (n.children || []).find((c) => String(c.id) === nextId);

    return {
      ...n,
      children: next ? [build(idx + 1)] : [],
    };
  };

  return [build(0)];
};

const DesignationsTable: React.FC<DesignationsTableProps> = ({ companyId }) => {
  const [tableQuery, setTableQuery] = useState<DataTableQuery>({
    pageIndex: 0,
    pageSize: 10,
    search: "",
  });

  const [mode, setMode] = useState<DesignationsMode>("list");

  // ✅ tree focus dropdown state
  const [treeFocusId, setTreeFocusId] = useState<string>("all");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "create" | "edit">("view");
  const [selectedDesignation, setSelectedDesignation] = useState<DesignationForUI | null>(null);
  const [selectedDesignationId, setSelectedDesignationId] = useState<string | number>("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["designations", companyId, mode, tableQuery.pageIndex, tableQuery.pageSize, tableQuery.search],
    queryFn: () =>
      fetchDesignations(companyId, tableQuery.pageIndex + 1, tableQuery.pageSize, tableQuery.search, mode),
    enabled: !!companyId,
  });

  const designationsList: DesignationForUI[] = useMemo(
    () => (data?.data ? mapDesignationData(data.data) : []),
    [data]
  );

  const designationsTree: TreeDesignation[] = useMemo(
    () => (data?.data ? mapDesignationTreeData(data.data) : []),
    [data]
  );

  const total = data?.meta?.total || 0;

  // dropdown options from tree (full list)
  const treeOptions = useMemo(() => {
    const flat = flattenTree(designationsTree);
    return flat
      .map((n) => ({
        id: String(n.id),
        label: `${n.title || "—"}${n.code ? ` (${n.code})` : ""}`,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [designationsTree]);

  // visible roots based on dropdown
  const visibleTreeRoots = useMemo(() => {
    if (treeFocusId === "all") return designationsTree;
    return buildFocusHierarchy(designationsTree, treeFocusId);
  }, [designationsTree, treeFocusId]);

  // handlers
  const handleCreate = () => {
    setModalMode("create");
    setSelectedDesignation(null);
    setSelectedDesignationId("");
    setIsModalOpen(true);
  };

  const handleView = (d: DesignationForUI, e?: React.MouseEvent) => {
    e?.stopPropagation?.();
    setModalMode("view");
    setSelectedDesignation(d);
    setSelectedDesignationId(d.id);
    setIsModalOpen(true);
  };

  const handleEdit = (d: DesignationForUI, e?: React.MouseEvent) => {
    e?.stopPropagation?.();
    setModalMode("edit");
    setSelectedDesignation(d);
    setSelectedDesignationId(d.id);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDesignation(null);
    setSelectedDesignationId("");
  };

  const getDesignationDataForModal = () => {
    if (!selectedDesignation) return null;

    return {
      company_id: (selectedDesignation as any).company_id,
      title: selectedDesignation.title ?? "",
      code: selectedDesignation.code ?? null,
      job_level: selectedDesignation.job_level ?? null,
      grade_id: (selectedDesignation as any).grade_id ?? null,
      department_id: selectedDesignation.department_id ?? null,
      reports_to_id: selectedDesignation.reports_to_id ?? null,
      active: !!selectedDesignation.active,
      sort_order: (selectedDesignation as any).sort_order ?? 0,
    };
  };

  const handleExport = () => {
    const rows = mode === "tree" ? flattenTree(designationsTree) : (designationsList as any[]);
    if (!rows.length) return;

    const exportData = rows.map((d: any, index: number) => ({
      "Sr No": index + 1,
      "Title": d.title,
      "Code": d.code || "—",
      "Job Level": d.job_level ?? "—",
      "Department": d.department_name || "—",
      "Grade": d.grade_name || "—",
      "Reports To": d.reports_to_title || "—",
      "Active Emp.": Number(d.active_emp_count ?? 0) || 0,
      "Status": d.active ? "Active" : "Inactive",
    }));

    console.log("Export data:", exportData);
  };

  const columns: ColumnDef<DesignationForUI>[] = [
    {
      id: "title",
      header: "Designation",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="font-medium text-slate-900">{row.original.title}</div>
            <div className="text-xs text-slate-500">{row.original.code || "—"}</div>
          </div>
        </div>
      ),
      meta: { headerClassName: "text-left pl-2" },
    },
    {
      id: "department_name",
      header: "Department",
      cell: ({ row }) => <span className="text-slate-600">{row.original.department_name || "—"}</span>,
      meta: { headerClassName: "text-left pl-2" },
    },
    {
      id: "grade_name",
      header: "Grade",
      cell: ({ row }) => <span className="text-slate-600">{row.original.grade_name || "—"}</span>,
      meta: { headerClassName: "text-left pl-2" },
    },
    {
      id: "job_level",
      header: "Level",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-slate-600">{row.original.job_level ?? "—"}</span>
          {!!(row.original as any).job_level_label && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {(row.original as any).job_level_label}
            </span>
          )}
        </div>
      ),
      meta: { headerClassName: "text-left pl-2" },
    },
    {
      id: "reports_to_title",
      header: "Reports To",
      cell: ({ row }) => <span className="text-slate-600">{row.original.reports_to_title || "—"}</span>,
      meta: { headerClassName: "text-left pl-2" },
    },
    {
      id: "active_emp_count",
      header: "Active Emp.",
      cell: ({ row }) => (
        <div className="text-slate-600 mx-auto text-center">{Number(row.original.active_emp_count ?? 0) || 0}</div>
      ),
      meta: { headerClassName: "text-center" },
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
        const designation = row.original;
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
                  onClick={(e) => handleView(designation, e)}
                >
                  <Eye className="h-3 w-3" /> View
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full justify-start gap-2 text-sm"
                  onClick={(e) => handleEdit(designation, e)}
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
      <div className="flex items-start justify-between mb-4 gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Designations</h1>
          <p className="text-sm text-gray-500">Manage designations, grades, and reporting structure</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          <div className="inline-flex items-center rounded-xl border bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => {
                setMode("list");
                setTreeFocusId("all");
              }}
              className={[
                "px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition",
                mode === "list" ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100",
              ].join(" ")}
            >
              <List className="h-4 w-4" />
              List
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("tree");
                setTableQuery((p) => ({ ...p, pageIndex: 0 }));
              }}
              className={[
                "px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition",
                mode === "tree" ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100",
              ].join(" ")}
            >
              <GitBranch className="h-4 w-4" />
              Tree
            </button>
          </div>

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
            Add Designation
          </Button>
        </div>
      </div>

      {/* ✅ Dropdown only in tree mode */}
      {mode === "tree" && (
        <div className="mb-3 flex items-center gap-3 flex-wrap">
          <div className="text-sm text-slate-600">Hierarchy:</div>

          <select
            className="h-10 rounded-xl border bg-white px-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-slate-200"
            value={treeFocusId}
            onChange={(e) => setTreeFocusId(e.target.value)}
          >
            <option value="all">All designations</option>
            {treeOptions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>

          {treeFocusId !== "all" && (
            <Button variant="outline" className="h-10" onClick={() => setTreeFocusId("all")}>
              Reset
            </Button>
          )}
        </div>
      )}

      {/* ✅ Tree Flow OR List Table */}
      {mode === "tree" ? (
        <DesignationTreeFlow
          roots={visibleTreeRoots}
          isLoading={isLoading}
          onView={(d) => handleView(d as any)}
          onEdit={(d) => handleEdit(d as any)}
        />
      ) : (
        <DataTable<DesignationForUI, unknown>
          columns={columns}
          data={designationsList}
          totalItems={total}
          serverSide={true}
          isLoading={isLoading}
          onQueryChange={setTableQuery}
          emptyMessage="No designations found."
          initialPageSize={10}
          showSrColumn={true}
          className="mb-6"
        />
      )}

      <DesignationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        mode={modalMode}
        companyId={companyId}
        designationId={selectedDesignationId}
        designationData={getDesignationDataForModal()}
        refetchDesignations={refetch}
      />
    </div>
  );
};

export default DesignationsTable;
