import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Filter,
  ShieldCheck,
  Activity,
  User,
  Clock,
  RefreshCw,
  Calendar,
} from "lucide-react";

import { PageHeader } from "../components/ui/PageHeader";
import { DataTable, Column } from "../components/ui/DataTable";
import { Button } from "../components/ui/button";

// ✅ Use your real axios client (same one you use in other pages)
import { api } from "@/components/api/client";

type AuditChange = { field: string; old: any; new: any };

type AuditRow = {
  id: number;
  event_title: string;
  event_detail: string;
  action: string; // "CREATED" | "UPDATED" | "LOGIN" ...
  changed_by: string;
  timestamp: string; // "2025-12-15 18:06:03"
  log_name: string; // "grade" | "designation" | "department" | "auth" ...
  causer_id: number | null;
  changes: AuditChange[];
};

type AuditApiResponse = {
  data: AuditRow[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
  filters?: {
    q?: string;
    entity?: string | null;
    action?: string | null;
    user_id?: number | null;
    from?: string | null;
    to?: string | null;
  };
};

function useDebouncedValue<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export const AuditLog: React.FC = () => {
  // UI filters
  const [searchTerm, setSearchTerm] = useState("");
  const [entityFilter, setEntityFilter] = useState(""); // maps to `entity`
  const [actionFilter, setActionFilter] = useState(""); // maps to `action`
  const [actorFilter, setActorFilter] = useState(""); // maps to `user_id`
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [dir, setDir] = useState<"asc" | "desc">("desc");

  // pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // debounce search
  const debouncedSearch = useDebouncedValue(searchTerm, 400);

  // whenever filters change, go back to page 1
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, entityFilter, actionFilter, actorFilter, dateFrom, dateTo, perPage, dir]);

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: [
      "audit-log",
      {
        q: debouncedSearch,
        entity: entityFilter,
        action: actionFilter,
        user_id: actorFilter,
        from: dateFrom,
        to: dateTo,
        page,
        per_page: perPage,
        dir,
      },
    ],
    queryFn: async () => {
      const res = await api.get<AuditApiResponse>("/meta/companies/audit-log", {
        params: {
          q: debouncedSearch || undefined,
          entity: entityFilter || undefined,
          action: actionFilter || undefined,
          user_id: actorFilter || undefined,
          from: dateFrom || undefined,
          to: dateTo || undefined,
          page,
          per_page: perPage,
          dir,
        },
      });
      return res.data;
    },
  });

  type AuditRowUI = Omit<AuditRow, "id"> & { id: string };

const rows: AuditRowUI[] = useMemo(() => {
  const apiRows = data?.data ?? [];
  return apiRows.map((r) => ({
    ...r,
    id: String(r.id), // ✅ fix: DataTable expects string id
  }));
}, [data]);

  const meta = data?.meta;

  // actors list from response (name + id)
  const actorOptions = useMemo(() => {
    const map = new Map<number, string>();
    rows.forEach((r) => {
      if (r.causer_id) map.set(r.causer_id, r.changed_by);
    });
    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [rows]);

  const getActionColor = (action: string) => {
    const a = (action || "").toUpperCase();
    switch (a) {
      case "CREATED":
        return "text-green-600 bg-green-50 border-green-100";
      case "UPDATED":
        return "text-blue-600 bg-blue-50 border-blue-100";
      case "DELETED":
        return "text-red-600 bg-red-50 border-red-100";
      case "LOGIN":
        return "text-emerald-600 bg-emerald-50 border-emerald-100";
      default:
        return "text-slate-600 bg-slate-50 border-slate-100";
    }
  };

  const columns: Column<AuditRowUI>[] = [
    {
      header: "Event",
      accessor: (log) => (
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg border ${getActionColor(log.action)}`}>
            <Activity size={16} />
          </div>
          <div>
            <div className="font-medium text-slate-900">
              {log.event_title}
              <span className="text-xs text-slate-400 ml-2">
                ({log.log_name})
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">{log.event_detail}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Action",
      accessor: (log) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide border ${getActionColor(
            log.action
          )}`}
        >
          {log.action}
        </span>
      ),
    },
    {
      header: "Changed By",
      accessor: (log) => (
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <User size={12} />
          </div>
          {log.changed_by || "—"}
        </div>
      ),
    },
    {
      header: "Timestamp",
      accessor: (log) => (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Clock size={14} />
          {log.timestamp}
        </div>
      ),
    },
    {
      header: "Changes",
      width: "320px",
      accessor: (log) =>
        log.changes && log.changes.length ? (
          <div className="text-xs space-y-1 max-h-20 overflow-y-auto">
            {log.changes.slice(0, 3).map((c, idx) => (
              <div key={`${c.field}-${idx}`} className="grid grid-cols-[90px_1fr] gap-1">
                <span className="text-slate-500 truncate font-medium">{c.field}:</span>
                <div className="flex items-center gap-1 font-mono text-[10px]">
                  <span className="text-red-400 line-through opacity-70 truncate max-w-[90px]">
                    {c.old === null || c.old === undefined ? "null" : String(c.old)}
                  </span>
                  <span className="text-slate-300">→</span>
                  <span className="text-green-600 truncate max-w-[90px]">
                    {c.new === null || c.new === undefined ? "null" : String(c.new)}
                  </span>
                </div>
              </div>
            ))}
            {log.changes.length > 3 && (
              <span className="text-[10px] text-primary-600 italic">
                +{log.changes.length - 3} more fields...
              </span>
            )}
          </div>
        ) : (
          <span className="text-xs text-slate-400 italic">No specific field diff</span>
        ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Audit Log"
        description="Comprehensive system-wide event history, security logs, and data changes."
        breadcrumbs={[{ label: "Flexi HQ", href: "/" }, { label: "Audit Log" }]}
        actions={
          <Button variant="outline" onClick={() => refetch()} disabled={isRefetching}>
            <RefreshCw size={16} className={`mr-2 ${isRefetching ? "animate-spin" : ""}`} />
            Refresh Log
          </Button>
        }
      />

      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm space-y-4">
        {/* Search */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search logs (q)..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Entity */}
          <div className="relative">
            <Filter
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <select
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500 bg-white appearance-none text-sm"
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
            >
              <option value="">All Entities</option>
              {/* match your backend log_name/entity values */}
              <option value="department">Department</option>
              <option value="designation">Designation</option>
              <option value="grade">Grade</option>
              <option value="division">Division</option>
              <option value="region">Region</option>
              <option value="location">Location</option>
              <option value="cost_center">Cost Center</option>
              <option value="auth">Auth</option>
            </select>
          </div>

          {/* Action */}
          <div className="relative">
            <Activity
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <select
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500 bg-white appearance-none text-sm"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
            >
              <option value="">All Actions</option>
              {/* match backend expected values */}
              <option value="created">Created</option>
              <option value="updated">Updated</option>
              <option value="deleted">Deleted</option>
              <option value="login">Login</option>
            </select>
          </div>

          {/* Actor */}
          <div className="relative">
            <User
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <select
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500 bg-white appearance-none text-sm"
              value={actorFilter}
              onChange={(e) => setActorFilter(e.target.value)}
            >
              <option value="">All Users</option>
              {actorOptions.map((a) => (
                <option key={a.id} value={String(a.id)}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {/* From */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Calendar size={16} />
            </div>
            <input
              type="date"
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500 text-sm text-slate-600"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          {/* To */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Calendar size={16} />
            </div>
            <input
              type="date"
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500 text-sm text-slate-600"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>

          {/* Per Page + Dir */}
          <div className="flex gap-2">
            <select
              className="w-1/2 px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm"
              value={String(perPage)}
              onChange={(e) => setPerPage(Number(e.target.value))}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>

            <select
              className="w-1/2 px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm"
              value={dir}
              onChange={(e) => setDir(e.target.value as "asc" | "desc")}
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        isLoading={isLoading}
        emptyState={
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <ShieldCheck size={40} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No audit records found</h3>
            <p className="text-slate-500 mt-2 max-w-md text-center">
              Try adjusting filters or performing some actions in the system.
            </p>
          </div>
        }
      />

      {/* ✅ Pagination (server-side) */}
      {meta && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-slate-600">
            Showing page <b>{meta.current_page}</b> of <b>{meta.last_page}</b> — Total:{" "}
            <b>{meta.total}</b>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={meta.current_page <= 1 || isLoading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </Button>

            <Button
              variant="outline"
              disabled={meta.current_page >= meta.last_page || isLoading}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
