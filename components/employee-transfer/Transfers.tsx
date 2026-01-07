import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ArrowRightLeft,
  Search,
  Filter,
  MoreHorizontal,
  ArrowRight,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
} from "lucide-react";

import { api } from "../api/client";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

// -----------------------------
// API Types (exactly your response)
// -----------------------------
type ApiEmployee = {
  id: number;
  emp_code: string;
  name: string;
  avatar_url: string | null;
  avatar_text: string | null;
};

type ApiTransferDetails = {
  type: string; // e.g. "DEPARTMENT"
  badge: string;
  from: string;
  to: string;
};

type ApiUser = { id: number; name: string };

type ApiDates = {
  requested_at: string;
  effective_date: string;
};

type ApiStatus = {
  key: string; // "APPROVED"
  label: string; // "Approved"
};

type ApiTransferRow = {
  id: number;
  employee: ApiEmployee;
  transfer: ApiTransferDetails;
  initiated_by: ApiUser;
  dates: ApiDates;
  status: ApiStatus;
};

type ApiMeta = {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
};

type ApiListResponse = {
  data: ApiTransferRow[];
  meta: ApiMeta;
};

// -----------------------------
// RHF Filters (server-side only)
// -----------------------------
type FiltersForm = {
  q: string;
  department_id: string; // "ALL" or "3"
  status: string; // "ALL" | "PENDING" | "APPROVED" | ...
  type: string; // "ALL" | "PROMOTION" | ...
  per_page: number;
};

type DepartmentOption = { id: number; name: string };

interface TransfersProps {
  // only used for dropdown options (not required)
  departments?: DepartmentOption[];
}

const Transfers: React.FC<TransfersProps> = ({ departments = [] }) => {
  const [rows, setRows] = useState<ApiTransferRow[]>([]);
  const [meta, setMeta] = useState<ApiMeta>({
    current_page: 1,
    per_page: 12,
    total: 0,
    last_page: 1,
  });
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const debounceRef = useRef<number | null>(null);

  const { register, watch, setValue } = useForm<FiltersForm>({
    defaultValues: {
      q: "",
      department_id: "ALL",
      status: "ALL",
      type: "ALL",
      per_page: 12,
    },
  });

  const q = watch("q");
  const department_id = watch("department_id");
  const status = watch("status");
  const type = watch("type");
  const per_page = watch("per_page");

  // ✅ ONLY server-side params (no frontend filtering)
  const params = useMemo(() => {
    const p: Record<string, any> = {
      page,
      per_page,
    };

    if (q?.trim()) p.q = q.trim();
    if (department_id && department_id !== "ALL") p.department_id = Number(department_id);
    if (status !== "ALL") p.status = status; // send uppercase keys
    if (type !== "ALL") p.type = type;

    return p;
  }, [q, department_id, status, type, page, per_page]);

  const fetchTransfers = async (p: Record<string, any>) => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get<ApiListResponse>("/employee-transfers", { params: p });
      setRows(res.data?.data ?? []);
      setMeta(res.data?.meta ?? { current_page: 1, per_page: p.per_page ?? 12, total: 0, last_page: 1 });
    } catch (e: any) {
      setRows([]);
      setMeta((m) => ({ ...m, total: 0, last_page: 1 }));
      setError(e?.response?.data?.message || "Failed to load transfers.");
    } finally {
      setLoading(false);
    }
  };

  // reset page when filters change
  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [department_id, status, type, per_page]);

  // fetch with debounce (especially for q)
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);

    debounceRef.current = window.setTimeout(() => {
      fetchTransfers(params);
    }, 350);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  // -----------------------------
  // UI helpers
  // -----------------------------
  const getStatusColor = (key: string) => {
    const s = (key || "").toUpperCase();
    switch (s) {
      case "APPROVED":
        return "bg-green-50 text-state-success border-green-200";
      case "REJECTED":
        return "bg-red-50 text-state-error border-red-200";
      case "IN_PROGRESS":
      case "IN PROGRESS":
        return "bg-blue-50 text-flexi-blue border-blue-200";
      case "PENDING":
        return "bg-yellow-50 text-state-warning border-yellow-200";
      default:
        return "bg-neutral-page text-neutral-secondary border-neutral-border";
    }
  };

  const getStatusIcon = (key: string) => {
    const s = (key || "").toUpperCase();
    switch (s) {
      case "APPROVED":
        return <CheckCircle className="w-3.5 h-3.5" />;
      case "REJECTED":
        return <XCircle className="w-3.5 h-3.5" />;
      case "IN_PROGRESS":
      case "IN PROGRESS":
        return <ArrowRightLeft className="w-3.5 h-3.5" />;
      case "PENDING":
        return <Clock className="w-3.5 h-3.5" />;
      default:
        return <Clock className="w-3.5 h-3.5" />;
    }
  };

  const inputClass =
    "w-full pl-9 pr-4 py-2.5 bg-white border border-neutral-border rounded-lg text-sm text-neutral-primary focus:outline-none focus:ring-2 focus:ring-flexi-primary/20 focus:border-flexi-primary transition-all placeholder:text-neutral-muted";
  const selectClass =
    "w-full pl-3 pr-8 py-2.5 bg-white border border-neutral-border rounded-lg text-sm text-neutral-primary appearance-none focus:ring-2 focus:ring-flexi-primary/20 focus:border-flexi-primary outline-none cursor-pointer transition-all";

  const pageNumbers = useMemo(() => {
    const last = meta.last_page || 1;
    const cur = meta.current_page || 1;
    const nums: number[] = [];

    const start = Math.max(1, cur - 1);
    const end = Math.min(last, cur + 1);

    if (start > 1) nums.push(1);
    for (let i = start; i <= end; i++) nums.push(i);
    if (end < last) nums.push(last);

    return Array.from(new Set(nums));
  }, [meta.current_page, meta.last_page]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-primary tracking-tight mb-2">
            Transfers & Promotions
          </h2>
          <p className="text-neutral-secondary font-light">
            Server-side list, search, filters & pagination.
          </p>
        </div>
          <Button
          onClick={()=>navigate('/peoplehub/transfers-wizard')}
            variant="outline"
            className="my-0 transition-all duration-500 hover:bg-[#1E1B4B] hover:text-white"
          >
            <Plus className="w-4 h-4" />
            Initiate Transfer
          </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-xl border border-neutral-border shadow-card flex flex-col md:flex-row gap-4 items-center">
        {/* Search (server-side q) */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted h-4 w-4" />
          <input
            type="text"
            placeholder="Search (server-side)..."
            className={inputClass}
            {...register("q")}
          />
        </div>

        {/* Filters (server-side) */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
          {/* Department */}
          <div className="relative min-w-[160px]">
            <select className={selectClass} {...register("department_id")}>
              <option value="ALL">All Depts</option>
              {departments.map((d) => (
                <option key={d.id} value={String(d.id)}>
                  {d.name}
                </option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-muted pointer-events-none" />
          </div>

          {/* Status */}
          <div className="relative min-w-[160px]">
            <select className={selectClass} {...register("status")}>
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-muted pointer-events-none" />
          </div>

          {/* Type */}
          <div className="relative min-w-[160px]">
            <select className={selectClass} {...register("type")}>
              <option value="ALL">All Types</option>
              <option value="DEPARTMENT">Department</option>
              <option value="LOCATION">Location</option>
              <option value="ROLE">Role Change</option>
              <option value="PROMOTION">Promotion</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-muted pointer-events-none" />
          </div>

          {/* Per Page */}
          <div className="relative min-w-[130px]">
            <select
              className={selectClass}
              value={per_page}
              onChange={(e) => setValue("per_page", Number(e.target.value))}
            >
              <option value={10}>10 / page</option>
              <option value={12}>12 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-muted pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Error */}
      {error ? (
        <div className="bg-white p-6 rounded-xl border border-neutral-border shadow-card">
          <div className="text-state-error font-semibold">{error}</div>
        </div>
      ) : null}

      {/* Table */}
      <div className="bg-white rounded-xl border border-neutral-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-neutral-page border-b border-neutral-border">
              <tr>
                <th className="p-4 text-xs font-semibold text-neutral-secondary uppercase tracking-wider">
                  Employee
                </th>
                <th className="p-4 text-xs font-semibold text-neutral-secondary uppercase tracking-wider">
                  Transfer Details
                </th>
                <th className="p-4 text-xs font-semibold text-neutral-secondary uppercase tracking-wider">
                  Initiated By
                </th>
                <th className="p-4 text-xs font-semibold text-neutral-secondary uppercase tracking-wider">
                  Dates
                </th>
                <th className="p-4 text-xs font-semibold text-neutral-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 text-xs font-semibold text-neutral-secondary uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-neutral-secondary">
                    Loading...
                  </td>
                </tr>
              ) : rows.length ? (
                rows.map((r) => {
                  const statusKey = r.status?.key || "";
                  const statusLabel = r.status?.label || statusKey;

                  return (
                    <tr key={r.id} className="hover:bg-[#F0EFF6] transition-colors group">
                      {/* Employee */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {r.employee.avatar_url ? (
                            <img
                              src={r.employee.avatar_url}
                              alt={r.employee.name}
                              className="w-9 h-9 rounded-full border border-neutral-border object-cover"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full border border-neutral-border bg-neutral-page flex items-center justify-center text-xs font-bold text-neutral-700">
                              {r.employee.avatar_text || r.employee.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}

                          <div>
                            <div className="font-semibold text-neutral-primary text-sm">
                              {r.employee.name}
                            </div>
                            <div className="text-xs text-neutral-muted font-mono">
                              {r.employee.emp_code}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Transfer */}
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-bold text-neutral-secondary uppercase tracking-wider bg-neutral-page w-fit px-1.5 py-0.5 rounded border border-neutral-200">
                            {r.transfer.badge || r.transfer.type}
                          </span>
                          <div className="flex items-center gap-2 text-sm text-neutral-primary font-medium mt-1">
                            <span className="text-neutral-500 line-through decoration-neutral-300">
                              {r.transfer.from}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                            <span className="text-flexi-primary">{r.transfer.to}</span>
                          </div>
                        </div>
                      </td>

                      {/* Initiator */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-[10px] font-bold text-neutral-600">
                            {r.initiated_by?.name?.charAt(0) || "U"}
                          </div>
                          <span className="text-sm text-neutral-primary">{r.initiated_by?.name}</span>
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-xs text-neutral-secondary">
                            <Clock className="w-3 h-3" /> Req: {r.dates.requested_at}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-neutral-primary font-medium">
                            <Calendar className="w-3 h-3 text-flexi-primary" /> Eff: {r.dates.effective_date}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(statusKey)}`}
                        >
                          {getStatusIcon(statusKey)}
                          {statusLabel}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <button className="p-2 text-neutral-muted hover:bg-neutral-page hover:text-flexi-primary rounded-lg transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center bg-white rounded-xl">
                      <div className="w-12 h-12 bg-neutral-page rounded-full flex items-center justify-center mb-3">
                        <ArrowRightLeft className="w-6 h-6 text-neutral-muted" />
                      </div>
                      <h3 className="text-neutral-primary font-semibold">No transfers found</h3>
                      <p className="text-neutral-secondary text-sm mt-1">
                        Try adjusting your filters.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination (server-side via meta) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 px-4 py-4 border-t border-neutral-border bg-white">
          <div className="text-sm text-neutral-secondary">
            Total: <span className="font-semibold text-neutral-primary">{meta.total}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={meta.current_page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-2 rounded-lg border border-neutral-border text-sm text-neutral-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-page"
            >
              Prev
            </button>

            {pageNumbers.map((n) => (
              <button
                key={n}
                disabled={loading}
                onClick={() => setPage(n)}
                className={`px-3 py-2 rounded-lg border text-sm ${
                  n === meta.current_page
                    ? "border-flexi-primary bg-flexi-primary text-white"
                    : "border-neutral-border text-neutral-primary hover:bg-neutral-page"
                }`}
              >
                {n}
              </button>
            ))}

            <button
              disabled={meta.current_page >= meta.last_page || loading}
              onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
              className="px-3 py-2 rounded-lg border border-neutral-border text-sm text-neutral-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-page"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transfers;
