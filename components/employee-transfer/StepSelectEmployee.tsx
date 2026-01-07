// src/features/employeeTransfers/components/StepSelectEmployee.tsx
import React from "react";
import { Search, CheckCircle, Loader2, RefreshCw } from "lucide-react";
import type { ApiTransferEmployee } from "./useTransferEmployees";

type Props = {
  items: ApiTransferEmployee[];
  loading: boolean;
  error: string;
  search: string;
  setSearch: (v: string) => void;
  sentinelRef: React.RefObject<HTMLDivElement>;
  selected: ApiTransferEmployee | null;
  onSelect: (emp: ApiTransferEmployee) => void;
  onRefresh: () => void;
};

export default function StepSelectEmployee({
  items,
  loading,
  error,
  search,
  setSearch,
  sentinelRef,
  selected,
  onSelect,
  onRefresh,
}: Props) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-muted w-5 h-5" />
          <input
            autoFocus
            type="text"
            placeholder="Search by name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-neutral-border shadow-sm text-lg focus:ring-2 focus:ring-flexi-primary focus:border-transparent outline-none placeholder:text-neutral-muted"
          />
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="px-4 rounded-xl border border-neutral-border bg-white hover:bg-neutral-page transition flex items-center gap-2 text-sm font-bold text-neutral-secondary"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {error ? (
        <div className="p-4 rounded-xl border border-neutral-border bg-white text-state-error font-semibold">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((emp) => {
          const isSelected = selected?.id === emp.id;

          return (
            <div
              key={emp.id}
              onClick={() => onSelect(emp)}
              className={`cursor-pointer p-4 rounded-xl border transition-all relative flex items-center gap-4
                ${
                  isSelected
                    ? "bg-flexi-light/30 border-flexi-primary shadow-md ring-1 ring-flexi-primary"
                    : "bg-white border-neutral-border hover:border-flexi-primary/50 hover:shadow-sm"
                }`}
            >
              {emp.avatar_url ? (
                <img
                  src={emp.avatar_url}
                  alt={emp.name}
                  className="w-12 h-12 rounded-full border border-neutral-border object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full border border-neutral-border bg-neutral-page flex items-center justify-center text-sm font-extrabold text-neutral-700">
                  {emp.avatar_text || emp.name?.slice(0, 2)?.toUpperCase() || "U"}
                </div>
              )}

              <div className="min-w-0">
                <h4 className="font-bold text-neutral-primary text-sm truncate">{emp.name}</h4>
                <p className="text-xs text-neutral-secondary truncate">
                  {emp.designation || emp.role || "-"} • {emp.department || "-"}
                </p>
                <p className="text-[10px] text-neutral-muted font-mono mt-0.5">{emp.emp_code}</p>
                <p className="text-[10px] text-neutral-muted mt-0.5">
                  {emp.location ? `📍 ${emp.location}` : ""} {emp.grade ? ` • 🎖 ${emp.grade}` : ""}
                </p>
              </div>

              {isSelected && (
                <div className="absolute top-3 right-3 text-flexi-primary">
                  <CheckCircle className="w-5 h-5 fill-flexi-primary text-white" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div ref={sentinelRef} />

      <div className="flex items-center justify-center py-4">
        {loading ? (
          <div className="flex items-center gap-2 text-neutral-secondary text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading more...
          </div>
        ) : items.length === 0 ? (
          <div className="text-neutral-muted text-sm">No employees found</div>
        ) : null}
      </div>
    </div>
  );
}
