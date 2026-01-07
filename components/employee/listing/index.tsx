import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MoreHorizontal,
  MapPin,
  Briefcase,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Edit,
  ArrowRightLeft,
  LogOut,
  UserCircle,
  LayoutGrid,
  List,
  Rows,
  ChevronLeft,
  ChevronRight,
  Settings2,
  Loader,
  X,
  Download,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

import { Employee, FilterState, SavedView } from "./types";
import FilterBar from "./FilterBar";
import { Button } from "@/components/ui/button";
import { useEmployeesDirectory } from "./useEmployeesDirectory";

type SortConfig = {
  key: keyof Employee;
  direction: "asc" | "desc";
};

interface DirectoryProps {
  companyId: number; // ✅ now server driven
}

function useDebounce<T>(value: T, delay = 350) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

const Directory: React.FC<DirectoryProps> = ({ companyId }) => {
  // View States
  const [viewMode, setViewMode] = useState<"list" | "grid" | "mini">("list");
  const [showSettings, setShowSettings] = useState(false);

  // Pagination & Loading States
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [isInfiniteScroll, setIsInfiniteScroll] = useState(false);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 350);

  const [filters, setFilters] = useState<FilterState>({
    department: [],
    location: [],
    grade: [],
    status: [],
    tags: [],
    designation: [],
  });

  const [savedViews, setSavedViews] = useState<SavedView[]>([
    {
      id: "v1",
      name: "Remote Engineers",
      filters: {
        department: ["Engineering"],
        location: ["Remote"],
        grade: [],
        status: [],
        tags: [],
        designation: [],
      },
      isDefault: false,
    },
    {
      id: "v2",
      name: "High Risks (Notice/Exit)",
      filters: {
        department: [],
        location: [],
        grade: [],
        status: ["Notice Period"],
        tags: ["Flight Risk"],
        designation: [],
      },
      isDefault: false,
    },
  ]);

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "name",
    direction: "asc",
  });

  const [activeActionRow, setActiveActionRow] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const rootRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  // ---------------------------
  // Outside click handling
  // ---------------------------
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (showSettings && settingsRef.current && !settingsRef.current.contains(target)) {
        setShowSettings(false);
      }

      const clickedInsideAction =
        !!target.closest("[data-action-menu]") || !!target.closest("[data-action-button]");

      if (!clickedInsideAction) setActiveActionRow(null);
    };

    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [showSettings]);

  // ---------------------------
  // Reset pagination on query changes
  // ---------------------------
  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]);
  }, [filters, debouncedSearch, itemsPerPage]);

  // ---------------------------
  // Saved Views handlers
  // ---------------------------
  const handleSaveView = (name: string) => {
    const newView: SavedView = {
      id: Date.now().toString(),
      name,
      filters: { ...filters },
    };
    setSavedViews((prev) => [...prev, newView]);
  };

  const handleUpdateView = (updatedView: SavedView) => {
    setSavedViews((prev) => prev.map((v) => (v.id === updatedView.id ? updatedView : v)));
  };

  const handleDeleteView = (id: string) => {
    setSavedViews((prev) => prev.filter((v) => v.id !== id));
  };

  const handleApplyView = (view: SavedView) => {
    setFilters(view.filters);
  };

  // ---------------------------
  // Server filters mapping
  // ---------------------------
  const serverFilters = useMemo(() => {
    // API params shown: status_id + search + paging + sort
    // Your FilterState stores arrays; we take first value (single-select behavior)
    const statusRaw = filters.status?.[0]; // could be "1" or "ACTIVE"
    const status_id = statusRaw && /^\d+$/.test(statusRaw) ? Number(statusRaw) : undefined;

    return {
      status_id,
      status: status_id ? undefined : statusRaw || undefined,
      department: filters.department?.[0] || undefined,
      designation: filters.designation?.[0] || undefined,
      location: filters.location?.[0] || undefined,
      grade: filters.grade?.[0] || undefined,
      tags: filters.tags || [],
    };
  }, [filters]);

  // ---------------------------
  // Server Query (TanStack)
  // ---------------------------
  const {
    rows: displayedEmployees,
    meta,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useEmployeesDirectory({
    companyId,
    search: debouncedSearch,
    page: currentPage,
    perPage: itemsPerPage,
    sortKey: sortConfig.key as string,
    sortDir: sortConfig.direction,
    filters: {
      status: serverFilters.status,
      status_id: serverFilters.status_id,
      department: serverFilters.department,
      designation: serverFilters.designation,
    },
    infinite: isInfiniteScroll,
  });

  const totalPages = meta?.last_page ?? 1;
  const totalFound = meta?.total ?? 0;
  const totalShown = displayedEmployees.length;

  // ---------------------------
  // Sort handler (server-side)
  // ---------------------------
  const handleSort = (key: keyof Employee) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  // ---------------------------
  // Infinite scroll observer (server-side)
  // ---------------------------
  useEffect(() => {
    if (!isInfiniteScroll) return;
    if (!observerTarget.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [isInfiniteScroll, hasNextPage, fetchNextPage, isFetching]);

  // ---------------------------
  // Selection
  // ---------------------------
  const isAllSelected =
    displayedEmployees.length > 0 && selectedIds.length === displayedEmployees.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < displayedEmployees.length;

  const handleSelectAll = () => {
    if (isAllSelected) setSelectedIds([]);
    else setSelectedIds(displayedEmployees.map((e) => e.id));
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const clearAll = () => {
    setFilters({ department: [], location: [], grade: [], status: [], tags: [], designation: [] });
    setSearchQuery("");
  };

  const isMini = viewMode === "mini";

  // ---------------------------
  // Columns
  // ---------------------------
  const columns: { key: keyof Employee; label: string; sortable: boolean; miniHide?: boolean }[] = [
    { key: "name", label: "Employee", sortable: true },
    { key: "employeeId", label: "ID", sortable: true },
    { key: "role", label: "Designation", sortable: true },
    { key: "department", label: "Department", sortable: true },
    { key: "location", label: "Location", sortable: true },
    { key: "joinDate", label: "Joined", sortable: true, miniHide: true },
    { key: "status", label: "Status", sortable: true },
  ];

  // ---------------------------
  // UI helpers
  // ---------------------------
  const StatusPill = ({ status }: { status: Employee["status"] }) => {
    // API returns "ACTIVE" — your UI earlier used "Active"
    const normalized = String(status || "").toUpperCase();

    const isActive = normalized === "ACTIVE";
    const isLeave = normalized === "ON_LEAVE" || normalized === "ON LEAVE";

    const base = "inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold border";
    const dot = "w-2 h-2 rounded-full";

    const cls = isActive
      ? "bg-green-50 text-state-success border-green-200"
      : isLeave
      ? "bg-flexi-gold-light text-flexi-gold border-flexi-gold/30"
      : "bg-flexi-coral-light text-flexi-coral border-flexi-coral/30";

    const dotCls = isActive ? "bg-state-success" : isLeave ? "bg-flexi-gold" : "bg-flexi-coral";

    const label = status; // keep raw

    if (isMini) {
      return (
        <div className="flex items-center gap-2">
          <span className={`${dot} ${dotCls}`} />
          <span className="text-xs font-medium text-neutral-primary">{label}</span>
        </div>
      );
    }

    return (
      <span className={`${base} ${cls}`}>
        <span className={`${dot} ${dotCls}`} />
        {label}
      </span>
    );
  };

  const ActionMenu = ({ empId }: { empId: string }) => (
    <div
      data-action-menu
      className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-neutral-border z-30 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-2">
        <div className="px-3 py-2 text-[11px] font-bold tracking-wider text-neutral-muted uppercase">
          Quick Actions
        </div>

        <div className="space-y-1">
          <button className="w-full text-left px-3 py-2.5 text-sm font-medium text-neutral-primary hover:bg-neutral-page rounded-xl flex items-center gap-2">
            <UserCircle className="w-4 h-4 text-neutral-muted" /> View 360 Profile
          </button>
          <button className="w-full text-left px-3 py-2.5 text-sm font-medium text-neutral-primary hover:bg-neutral-page rounded-xl flex items-center gap-2">
            <Edit className="w-4 h-4 text-neutral-muted" /> Edit Details
          </button>

          <div className="h-px bg-neutral-border my-2" />

          <button className="w-full text-left px-3 py-2.5 text-sm font-medium text-flexi-primary hover:bg-flexi-gold-light rounded-xl flex items-center gap-2 transition-colors">
            <ArrowRightLeft className="w-4 h-4" /> Start Transfer
          </button>
          <button className="w-full text-left px-3 py-2.5 text-sm font-medium text-flexi-coral hover:bg-flexi-coral-light rounded-xl flex items-center gap-2 transition-colors">
            <LogOut className="w-4 h-4" /> Start Exit
          </button>
        </div>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center text-neutral-muted py-20">
      <div className="w-16 h-16 bg-neutral-page rounded-2xl flex items-center justify-center mb-4 border border-neutral-border shadow-sm">
        <Search className="w-8 h-8 text-neutral-muted" />
      </div>
      <h3 className="text-lg font-bold text-neutral-primary">No employees found</h3>
      <p className="text-sm mt-1 max-w-md text-center">
        Try adjusting filters, removing tags, or searching by name / ID / department.
      </p>
      <button
        onClick={clearAll}
        className="mt-5 px-4 py-3 text-sm font-bold text-white bg-flexi-primary rounded-xl hover:bg-flexi-secondary transition-colors shadow-sm"
      >
        Clear filters & search
      </button>
    </div>
  );

  const TableSkeleton = () => (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <tr key={i} className="animate-pulse border-b border-neutral-border/60">
          <td className={isMini ? "px-3 py-2" : "p-4"}>
            <div className="w-4 h-4 bg-flexi-light rounded" />
          </td>
          <td className={isMini ? "px-3 py-2" : "p-4"}>
            <div className="flex items-center gap-3">
              <div className={`${isMini ? "w-7 h-7" : "w-10 h-10"} rounded-full bg-flexi-light`} />
              <div className="space-y-2">
                <div className="w-28 h-3 bg-flexi-light rounded" />
                {!isMini && <div className="w-40 h-2 bg-neutral-page rounded" />}
              </div>
            </div>
          </td>
          <td className={isMini ? "px-3 py-2" : "p-4"}>
            <div className="w-20 h-4 bg-neutral-page rounded" />
          </td>
          <td className={isMini ? "px-3 py-2" : "p-4"}>
            <div className="w-28 h-4 bg-neutral-page rounded" />
          </td>
          <td className={isMini ? "px-3 py-2" : "p-4"}>
            <div className="w-24 h-4 bg-neutral-page rounded" />
          </td>
          <td className={isMini ? "px-3 py-2" : "p-4"}>
            <div className="w-24 h-4 bg-neutral-page rounded" />
          </td>
          {!isMini && (
            <td className="p-4">
              <div className="w-20 h-4 bg-neutral-page rounded" />
            </td>
          )}
          <td className={isMini ? "px-3 py-2" : "p-4"}>
            <div className="w-20 h-7 bg-flexi-light rounded-full" />
          </td>
          <td className={`${isMini ? "px-3 py-2" : "p-4"} text-right`}>
            <div className="w-10 h-10 bg-neutral-page rounded-xl ml-auto" />
          </td>
        </tr>
      ))}
    </>
  );

  const CardSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-neutral-border bg-white p-6 animate-pulse shadow-sm"
        >
          <div className="flex flex-col items-center mb-4">
            <div className="w-20 h-20 rounded-full bg-flexi-light mb-3" />
            <div className="w-32 h-4 bg-flexi-light rounded mb-2" />
            <div className="w-24 h-3 bg-neutral-page rounded" />
          </div>
          <div className="space-y-3">
            <div className="w-full h-4 bg-neutral-page rounded" />
            <div className="w-2/3 h-4 bg-neutral-page rounded" />
          </div>
        </div>
      ))}
    </div>
  );

  // Pagination pages
  const getPageButtons = () => {
    const pages: number[] = [];
    const maxButtons = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxButtons - 1);
    start = Math.max(1, end - maxButtons + 1);

    for (let p = start; p <= end; p++) pages.push(p);
    return pages;
  };

  return (
    <div ref={rootRef} className="space-y-6 relative min-h-screen pb-28">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold text-neutral-primary tracking-tight">
              Employee Directory
            </h2>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-neutral-page border border-neutral-border text-neutral-secondary">
              {totalFound} found
            </span>
          </div>
          <p className="text-sm text-neutral-secondary font-medium opacity-85">
            Search, filter, and manage employee records across the organization.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick actions */}
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="my-0 transition-all duration-500 hover:bg-[#1E1B4B] hover:text-white"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>

          <Button
            variant="outline"
            className="my-0 transition-all duration-500 hover:bg-[#1E1B4B] hover:text-white"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>

          {/* Settings */}
          <div className="relative" ref={settingsRef}>
            <Button
              onClick={() => setShowSettings((s) => !s)}
              variant="outline"
              className="my-0 transition-all duration-500 hover:bg-[#1E1B4B] hover:text-white"
            >
              <Settings2 className="w-4 h-4" />
              <span className="hidden sm:inline">View Settings</span>
            </Button>

            {showSettings && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-neutral-border z-30 animate-in fade-in zoom-in-95 p-2">
                <div className="px-3 py-2 text-[11px] font-bold text-neutral-muted uppercase tracking-wider">
                  Pagination
                </div>

                <div className="px-2 space-y-2">
                  <div className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-page">
                    <span className="text-sm font-medium text-neutral-primary">Infinite Scroll</span>
                    <button
                      onClick={() => setIsInfiniteScroll((v) => !v)}
                      className={`w-10 h-5 rounded-full relative transition-colors ${
                        isInfiniteScroll ? "bg-flexi-primary" : "bg-neutral-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 bg-white w-3 h-3 rounded-full transition-transform ${
                          isInfiniteScroll ? "translate-x-5" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {!isInfiniteScroll && (
                    <div className="p-2">
                      <span className="text-sm text-neutral-primary font-medium block mb-2">
                        Rows per page
                      </span>
                      <div className="flex gap-2">
                        {[20, 50, 100].map((num) => (
                          <button
                            key={num}
                            onClick={() => setItemsPerPage(num)}
                            className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-colors ${
                              itemsPerPage === num
                                ? "bg-flexi-primary text-white border-flexi-primary"
                                : "bg-white text-neutral-secondary border-neutral-border hover:bg-neutral-page"
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* View segmented control */}
          <div className="flex h-9 items-center bg-white rounded-md border border-neutral-border shadow-sm p-0 gap-2 px-1">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setViewMode("list")}
              className={`h-7 w-7 p-0 rounded-md transition-all ${
                viewMode === "list"
                  ? "bg-primary text-white hover:bg-primary"
                  : "text-secondary hover:text-primary hover:bg-page"
              }`}
              title="List View"
            >
              <List className="w-5 h-5" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => setViewMode("mini")}
              className={`h-7 w-7 p-0 rounded-md transition-all ${
                viewMode === "mini"
                  ? "bg-primary text-white hover:bg-primary"
                  : "text-secondary hover:text-primary hover:bg-page"
              }`}
              title="Compact View"
            >
              <Rows className="w-5 h-5" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => setViewMode("grid")}
              className={`h-7 w-7 p-0 rounded-md transition-all ${
                viewMode === "grid"
                  ? "bg-primary text-white hover:bg-primary"
                  : "text-secondary hover:text-primary hover:bg-page"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bulk bar */}
      {selectedIds.length > 0 && (
        <div className="sticky top-0 z-30 -mx-6 px-6 md:-mx-8 md:px-8 pt-3">
          <div className="bg-white border border-neutral-border rounded-2xl shadow-soft px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-bold text-neutral-primary">
              <CheckCircle2 className="w-4 h-4 text-flexi-primary" />
              {selectedIds.length} selected
              <button
                onClick={() => setSelectedIds([])}
                className="ml-2 inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-neutral-page border border-neutral-border text-neutral-secondary hover:text-neutral-primary"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 rounded-xl text-sm font-bold bg-neutral-page border border-neutral-border hover:bg-white">
                Export Selected
              </button>
              <button className="px-4 py-2 rounded-xl text-sm font-bold bg-flexi-primary text-white hover:bg-flexi-secondary shadow-sm">
                Bulk Action
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky filters */}
      <div className="sticky top-0 bg-white z-20 bg-neutral-page/85 backdrop-blur-md -mx-6 px-6 md:-mx-8 md:px-8 py-4 border-b border-neutral-border/60">
        <div className="bg-white border border-neutral-border rounded-2xl shadow-sm p-3">
          <FilterBar
            filters={filters}
            onFilterChange={setFilters}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            savedViews={savedViews}
            onSaveView={handleSaveView}
            onUpdateView={handleUpdateView}
            onDeleteView={handleDeleteView}
            onApplyView={handleApplyView}
          />
        </div>
      </div>

      {/* Content */}
      {viewMode === "list" || viewMode === "mini" ? (
        <div className="bg-white rounded-2xl border border-neutral-border shadow-card overflow-visible">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-neutral-page/50 border-b border-neutral-border">
                <tr>
                  <th className={isMini ? "px-3 py-2 w-10" : "p-4 w-12"}>
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(input) => {
                        if (input) input.indeterminate = isIndeterminate;
                      }}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-flexi-secondary text-flexi-primary focus:ring-flexi-primary cursor-pointer"
                    />
                  </th>

                  {columns.map((col) => {
                    if (isMini && col.miniHide) return null;

                    const isSorted = sortConfig.key === col.key;
                    const icon = !col.sortable ? null : isSorted ? (
                      sortConfig.direction === "asc" ? (
                        <ArrowUp className="w-3 h-3" />
                      ) : (
                        <ArrowDown className="w-3 h-3" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 opacity-40 group-hover:opacity-80" />
                    );

                    return (
                      <th
                        key={String(col.key)}
                        onClick={() => col.sortable && handleSort(col.key)}
                        className={[
                          isMini ? "px-3 py-2 text-[10px]" : "p-4 text-xs",
                          "font-bold text-neutral-secondary uppercase tracking-wider",
                          col.sortable
                            ? "cursor-pointer hover:bg-neutral-border/40 transition-colors group select-none"
                            : "",
                        ].join(" ")}
                      >
                        <div className="flex items-center gap-2">
                          {col.label}
                          {col.sortable && (
                            <span className="text-neutral-muted group-hover:text-flexi-primary">
                              {icon}
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}

                  <th
                    className={`${
                      isMini ? "px-3 py-2" : "p-4"
                    } text-xs font-bold text-neutral-secondary uppercase tracking-wider text-right`}
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-border">
                {isLoading ? (
                  <TableSkeleton />
                ) : displayedEmployees.length > 0 ? (
                  displayedEmployees.map((emp) => {
                    const isSelected = selectedIds.includes(emp.id);

                    return (
                      <tr
                        key={emp.id}
                        className={[
                          "transition-colors group relative",
                          isSelected ? "bg-flexi-light/40" : "hover:bg-[#F5F4FA]",
                        ].join(" ")}
                      >
                        <td className={isMini ? "px-3 py-2" : "p-4"}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(emp.id)}
                            className="w-4 h-4 rounded border-flexi-secondary text-flexi-primary focus:ring-flexi-primary cursor-pointer"
                          />
                        </td>

                        {/* Employee */}
                        <td className={isMini ? "px-3 py-2" : "p-4"}>
                          <div className="flex items-center gap-3">
                            <img
                              src={emp.avatar}
                              alt={emp.name}
                              className={`${
                                isMini ? "w-7 h-7" : "w-10 h-10"
                              } rounded-full border border-neutral-border object-cover shadow-sm`}
                            />
                            <div className="min-w-0">
                              <div
                                className={`${
                                  isMini ? "text-xs" : "text-sm"
                                } font-bold text-neutral-primary truncate`}
                              >
                                {emp.name}
                              </div>
                              {!isMini && (
                                <div className="text-xs text-neutral-muted font-medium truncate">
                                  {emp.email}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* ID */}
                        <td className={isMini ? "px-3 py-2" : "p-4"}>
                          <span
                            className={`${
                              isMini ? "text-[10px]" : "text-xs"
                            } text-neutral-secondary font-mono bg-neutral-page px-2 py-1 rounded-lg border border-neutral-border`}
                          >
                            {emp.employeeId}
                          </span>
                        </td>

                        {/* Role / Grade */}
                        <td className={isMini ? "px-3 py-2" : "p-4"}>
                          <div
                            className={`${
                              isMini ? "text-xs" : "text-sm"
                            } font-semibold text-neutral-primary`}
                          >
                            {emp.role}
                          </div>
                          {!isMini && (
                            <div className="text-xs text-neutral-muted mt-1 font-medium">
                              {emp.grade}
                            </div>
                          )}
                        </td>

                        {/* Department */}
                        <td className={isMini ? "px-3 py-2" : "p-4"}>
                          <div
                            className={`${
                              isMini ? "text-xs" : "text-sm"
                            } text-neutral-secondary flex items-center gap-2 font-medium`}
                          >
                            <Briefcase className="w-4 h-4 text-neutral-muted" />
                            {emp.department}
                          </div>
                        </td>

                        {/* Location */}
                        <td className={isMini ? "px-3 py-2" : "p-4"}>
                          <div
                            className={`${
                              isMini ? "text-xs" : "text-sm"
                            } text-neutral-secondary flex items-center gap-2 font-medium`}
                          >
                            <MapPin className="w-4 h-4 text-neutral-muted" />
                            {emp.location}
                          </div>
                        </td>

                        {/* Join date */}
                        {!isMini && (
                          <td className="p-4">
                            <div className="text-sm font-semibold text-neutral-primary">
                              {emp.joinDate}
                            </div>
                          </td>
                        )}

                        {/* Status */}
                        <td className={isMini ? "px-3 py-2" : "p-4"}>
                          <StatusPill status={emp.status} />
                        </td>

                        {/* Actions */}
                        <td className={`${isMini ? "px-3 py-2" : "p-4"} text-right relative`}>
                          <button
                            data-action-button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveActionRow((cur) => (cur === emp.id ? null : emp.id));
                            }}
                            className={[
                              "p-2 rounded-xl transition-colors",
                              activeActionRow === emp.id
                                ? "bg-flexi-light text-flexi-primary"
                                : "text-neutral-muted hover:bg-neutral-page hover:text-flexi-primary",
                            ].join(" ")}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>

                          {activeActionRow === emp.id && <ActionMenu empId={emp.id} />}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={isMini ? 8 : 9} className="p-12">
                      <EmptyState />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Infinite scroll sentinel */}
          {isInfiniteScroll && (
            <div ref={observerTarget} className="h-14 flex items-center justify-center p-4">
              {(isFetching || isLoading) && (
                <Loader className="w-6 h-6 animate-spin text-flexi-primary" />
              )}
            </div>
          )}

          {/* Pagination */}
          {!isInfiniteScroll && totalPages > 1 && (
            <div className="p-4 border-t border-neutral-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-page/30">
              <div className="text-sm font-medium text-neutral-secondary">
                Showing{" "}
                <span className="font-bold text-neutral-primary">{totalShown}</span> of{" "}
                <span className="font-bold text-neutral-primary">{totalFound}</span>
              </div>

              <div className="flex items-center gap-2 justify-end">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-2 border border-neutral-border rounded-xl bg-white disabled:opacity-50 hover:bg-neutral-page transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {getPageButtons().map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={[
                      "min-w-[38px] px-3 py-2 rounded-xl text-sm font-bold border transition-colors",
                      p === currentPage
                        ? "bg-flexi-primary text-white border-flexi-primary"
                        : "bg-white text-neutral-secondary border-neutral-border hover:bg-neutral-page",
                    ].join(" ")}
                  >
                    {p}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-2 border border-neutral-border rounded-xl bg-white disabled:opacity-50 hover:bg-neutral-page transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        // GRID VIEW
        <div className="space-y-6">
          {isLoading ? (
            <CardSkeleton />
          ) : displayedEmployees.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedEmployees.map((emp) => (
                <div
                  key={emp.id}
                  className="group relative bg-white border border-neutral-border rounded-2xl p-6 shadow-card hover:shadow-soft hover:border-flexi-primary/40 transition-all"
                >
                  <div className="absolute top-3 right-3">
                    <button
                      data-action-button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveActionRow((cur) => (cur === emp.id ? null : emp.id));
                      }}
                      className="p-2 text-neutral-muted hover:bg-neutral-page rounded-xl"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>

                    {activeActionRow === emp.id && (
                      <div className="absolute right-0 top-full mt-2 z-30">
                        <ActionMenu empId={emp.id} />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={emp.avatar}
                      alt={emp.name}
                      className="w-14 h-14 rounded-full border border-neutral-border object-cover shadow-sm"
                    />
                    <div className="min-w-0">
                      <h3 className="font-bold text-neutral-primary text-base truncate">
                        {emp.name}
                      </h3>
                      <p className="text-sm text-flexi-primary font-semibold truncate">{emp.role}</p>
                      <div className="mt-2">
                        <StatusPill status={emp.status} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2 border-t border-neutral-border pt-4">
                    <div className="flex items-center justify-between text-xs text-neutral-secondary font-medium">
                      <span className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-neutral-muted" /> Department
                      </span>
                      <span className="font-bold text-neutral-primary">{emp.department}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-neutral-secondary font-medium">
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-neutral-muted" /> Location
                      </span>
                      <span className="font-bold text-neutral-primary">{emp.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState />
          )}

          {isInfiniteScroll && (
            <div ref={observerTarget} className="h-14 flex items-center justify-center p-4">
              {(isFetching || isLoading) && (
                <Loader className="w-6 h-6 animate-spin text-flexi-primary" />
              )}
            </div>
          )}

          {!isInfiniteScroll && totalPages > 1 && (
            <div className="flex justify-center pt-4">
              <div className="flex items-center gap-2 bg-white border border-neutral-border rounded-2xl shadow-sm p-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-2 rounded-xl hover:bg-neutral-page disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {getPageButtons().map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={[
                      "min-w-[38pxs] px-3 py-2 rounded-xl text-sm font-bold border transition-colors",
                      p === currentPage
                        ? "bg-flexi-primary text-white border-flexi-primary"
                        : "bg-white text-neutral-secondary border-neutral-border hover:bg-neutral-page",
                    ].join(" ")}
                  >
                    {p}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-2 rounded-xl hover:bg-neutral-page disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Directory;
