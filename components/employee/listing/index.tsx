import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Settings2,
  Download,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Check,
  X,
  UserPlus,
  Keyboard,
  Mail,
  MoreHorizontal,
  Pencil,
  Trash2,
  Plus,
  Info,
  Grid3X3,
  List,
  Building2,
  MapPin,
  Briefcase,
  Phone,
  BadgeCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * Employee Directory (Timesync / Flexi style)
 * - Same UI vibe as your Approvals Inbox
 * - List view + Grid view
 * - Tabs + filters + search
 * - Bulk actions + pagination
 * - View/Edit/Create/Delete (dummy)
 */

type EmpStatus = "ACTIVE" | "ON_LEAVE" | "INACTIVE";
type EmploymentType = "PERMANENT" | "CONTRACT" | "INTERN";
type TabKey = "ALL" | "ACTIVE" | "ON_LEAVE" | "INACTIVE";

interface EmployeeItem {
  id: string; // internal row id
  employeeId: string; // EMP-1021
  name: string;
  avatar: string; // initials
  email: string;
  phone: string;
  department: string;
  designation: string;
  location: string;
  employmentType: EmploymentType;
  status: EmpStatus;
  joinedAt: string; // YYYY-MM-DD
  createdAt: string; // ISO
  managerName?: string;
}

const STATUS_CONFIG: Record<
  EmpStatus,
  { label: string; pill: string; dot: string; help: string }
> = {
  ACTIVE: {
    label: "Active",
    pill: "bg-green-50 text-green-700 border-green-200",
    dot: "bg-green-500",
    help: "Employee is active and working.",
  },
  ON_LEAVE: {
    label: "On Leave",
    pill: "bg-yellow-50 text-yellow-700 border-yellow-200",
    dot: "bg-yellow-500",
    help: "Employee is on approved leave.",
  },
  INACTIVE: {
    label: "Inactive",
    pill: "bg-gray-50 text-gray-700 border-gray-200",
    dot: "bg-gray-400",
    help: "Employee is inactive (resigned/disabled).",
  },
};

const TYPE_CONFIG: Record<
  EmploymentType,
  { label: string; pill: string; hint: string }
> = {
  PERMANENT: {
    label: "Permanent",
    pill: "bg-blue-50 text-blue-700 border-blue-200",
    hint: "Full-time employee (permanent).",
  },
  CONTRACT: {
    label: "Contract",
    pill: "bg-purple-50 text-purple-700 border-purple-200",
    hint: "Time-bound contract employee.",
  },
  INTERN: {
    label: "Intern",
    pill: "bg-indigo-50 text-indigo-700 border-indigo-200",
    hint: "Internship / trainee role.",
  },
};

const DEPARTMENTS = ["Engineering", "Product", "HR", "Finance", "Ops", "IT"];
const LOCATIONS = ["Lahore", "Islamabad", "Karachi", "Remote"];
const DESIGNATIONS = [
  "Software Engineer",
  "Senior Engineer",
  "Team Lead",
  "Product Analyst",
  "HR Officer",
  "Accountant",
  "Ops Coordinator",
  "IT Support",
];

const formatPrettyDate = (isoDate: string) => {
  const d = new Date(isoDate);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatPrettyDateTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const nowIso = () => new Date().toISOString();

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/** ---------- UI helpers (no deps) ---------- */

const ModalShell: React.FC<{
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "md" | "lg" | "xl";
}> = ({ open, onClose, title, subtitle, children, footer, size = "lg" }) => {
  if (!open) return null;
  const w =
    size === "md" ? "max-w-lg" : size === "lg" ? "max-w-2xl" : "max-w-4xl";

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center !m-0">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative w-full ${w} bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden animate-in zoom-in duration-200`}
      >
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-gray-900 tracking-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-gray-500 font-medium mt-1">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-500"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-auto custom-scrollbar">
          {children}
        </div>

        {footer && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/60">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

const ConfirmDialog: React.FC<{
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  danger?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}> = ({
  open,
  title,
  description,
  confirmText = "Confirm",
  danger,
  onCancel,
  onConfirm,
}) => {
  return (
    <ModalShell
      open={open}
      onClose={onCancel}
      title={title}
      subtitle={description}
      size="md"
      footer={
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${
              danger
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-[#3E3B6F] hover:opacity-90 text-white"
            }`}
          >
            {confirmText}
          </button>
        </div>
      }
    >
      <div className="text-sm text-gray-600 font-medium leading-relaxed">
        {description}
      </div>
    </ModalShell>
  );
};

const Pill: React.FC<{ className: string; children: React.ReactNode }> = ({
  className,
  children,
}) => (
  <span
    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${className}`}
  >
    {children}
  </span>
);

const IconBtn: React.FC<{
  title: string;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}> = ({ title, onClick, className, children }) => (
  <button
    title={title}
    onClick={onClick}
    className={`p-2 rounded-xl border transition-all ${
      className ??
      "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
    }`}
  >
    {children}
  </button>
);

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="space-y-2">
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
      {label}
    </p>
    {children}
  </div>
);

/** ---------- Dummy data ---------- */

const seedEmployees = (): EmployeeItem[] => {
  const people = [
    { name: "Ahmed Khan", emp: "EMP-1021", team: "Engineering", avatar: "AK" },
    { name: "Sarah Chen", emp: "EMP-1043", team: "Product", avatar: "SC" },
    { name: "James Wilson", emp: "EMP-1009", team: "Ops", avatar: "JW" },
    { name: "Priya Das", emp: "EMP-1091", team: "Engineering", avatar: "PD" },
    { name: "Marcus Low", emp: "EMP-1066", team: "IT", avatar: "ML" },
    { name: "Elena Frost", emp: "EMP-1018", team: "HR", avatar: "EF" },
  ];

  const types: EmploymentType[] = ["PERMANENT", "CONTRACT", "INTERN"];
  const statuses: EmpStatus[] = ["ACTIVE", "ON_LEAVE", "INACTIVE"];

  return Array.from({ length: 34 }).map((_, i) => {
    const p = people[i % people.length];
    const employmentType = types[i % types.length];
    const status =
      i % 17 === 0 ? "INACTIVE" : i % 11 === 0 ? "ON_LEAVE" : "ACTIVE";

    const dept = DEPARTMENTS[i % DEPARTMENTS.length];
    const des = DESIGNATIONS[(i * 2) % DESIGNATIONS.length];
    const location = LOCATIONS[(i * 3) % LOCATIONS.length];

    const joinedMonth = 1 + (i % 12);
    const joinedDay = 1 + (i % 25);

    return {
      id: `EMP_ROW-${2000 + i}`,
      employeeId: p.emp,
      name: p.name,
      avatar: p.avatar,
      email: `${p.name.toLowerCase().replace(" ", ".")}@company.com`,
      phone: `+92 3${(10 + (i % 9)).toString()}${(
        10000000 +
        i * 137
      ).toString()
        .slice(0, 8)}`,
      department: dept,
      designation: des,
      location,
      employmentType,
      status: status as (typeof statuses)[number],
      joinedAt: `2024-${String(joinedMonth).padStart(2, "0")}-${String(
        joinedDay
      ).padStart(2, "0")}`,
      createdAt: new Date(
        Date.parse("2025-01-10T12:00:00Z") - i * 6 * 60 * 60 * 1000
      ).toISOString(),
      managerName: i % 2 === 0 ? "You (Manager)" : "Team Lead (Dummy)",
    };
  });
};

/** ---------- Main component ---------- */

export const EmployeeDirectory: React.FC = () => {
  const [items, setItems] = useState<EmployeeItem[]>(seedEmployees());

  // tabs / filters
  const [activeTab, setActiveTab] = useState<TabKey>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState<"ALL" | string>("ALL");
  const [typeFilter, setTypeFilter] = useState<"ALL" | EmploymentType>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | EmpStatus>("ALL");

  // view toggle
  const [viewMode, setViewMode] = useState<"LIST" | "GRID">("LIST");

  // selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // pagination
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 12;

  // modals
  const [viewId, setViewId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const viewItem = useMemo(
    () => items.find((x) => x.id === viewId) ?? null,
    [items, viewId]
  );
  const editItem = useMemo(
    () => items.find((x) => x.id === editId) ?? null,
    [items, editId]
  );
  const navigate = useNavigate();
  // ESC closes modals + keyboard bulk shortcuts (same pattern)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (viewId) setViewId(null);
        if (editId) setEditId(null);
        if (createOpen) setCreateOpen(false);
        if (deleteTargetId) setDeleteTargetId(null);
      }

      const anyModalOpen =
        !!viewId || !!editId || createOpen || !!deleteTargetId;
      if (anyModalOpen) return;

      if (selectedIds.size === 0) return;

      // A=active, L=leave, I=inactive
      if (e.key.toLowerCase() === "a") bulkUpdateStatus("ACTIVE");
      if (e.key.toLowerCase() === "l") bulkUpdateStatus("ON_LEAVE");
      if (e.key.toLowerCase() === "i") bulkUpdateStatus("INACTIVE");
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIds, viewId, editId, createOpen, deleteTargetId]);

  const counts = useMemo(() => {
    const all = items.length;
    const active = items.filter((x) => x.status === "ACTIVE").length;
    const onLeave = items.filter((x) => x.status === "ON_LEAVE").length;
    const inactive = items.filter((x) => x.status === "INACTIVE").length;
    return { all, active, onLeave, inactive };
  }, [items]);

  const filtered = useMemo(() => {
    let list = [...items];

    // tabs
    if (activeTab === "ACTIVE") list = list.filter((x) => x.status === "ACTIVE");
    if (activeTab === "ON_LEAVE")
      list = list.filter((x) => x.status === "ON_LEAVE");
    if (activeTab === "INACTIVE")
      list = list.filter((x) => x.status === "INACTIVE");

    // dropdown filters
    if (deptFilter !== "ALL") list = list.filter((x) => x.department === deptFilter);
    if (typeFilter !== "ALL")
      list = list.filter((x) => x.employmentType === typeFilter);
    if (statusFilter !== "ALL") list = list.filter((x) => x.status === statusFilter);

    // search (same behavior)
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (x) =>
          x.name.toLowerCase().includes(q) ||
          x.employeeId.toLowerCase().includes(q) ||
          x.email.toLowerCase().includes(q) ||
          x.department.toLowerCase().includes(q) ||
          x.designation.toLowerCase().includes(q) ||
          x.location.toLowerCase().includes(q)
      );
    }

    // sort like inbox: status priority then createdAt desc
    const order: Record<EmpStatus, number> = {
      ACTIVE: 0,
      ON_LEAVE: 1,
      INACTIVE: 2,
    };

    list.sort((a, b) => {
      const d = order[a.status] - order[b.status];
      if (d !== 0) return d;
      return Date.parse(b.createdAt) - Date.parse(a.createdAt);
    });

    return list;
  }, [items, activeTab, deptFilter, typeFilter, statusFilter, searchQuery]);

  // reset page when filters change
  useEffect(() => setPageIndex(0), [activeTab, deptFilter, typeFilter, statusFilter, searchQuery]);

  const paged = useMemo(() => {
    const total = filtered.length;
    const start = pageIndex * pageSize;
    const end = Math.min(total, start + pageSize);
    return { rows: filtered.slice(start, end), total, start, end };
  }, [filtered, pageIndex]);

  const allVisibleSelected =
    paged.rows.length > 0 && paged.rows.every((r) => selectedIds.has(r.id));

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAllVisible = (checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      paged.rows.forEach((r) => {
        if (checked) next.add(r.id);
        else next.delete(r.id);
      });
      return next;
    });
  };

  const bulkUpdateStatus = (status: EmpStatus) => {
    setItems((prev) =>
      prev.map((x) => (selectedIds.has(x.id) ? { ...x, status } : x))
    );
    setSelectedIds(new Set());
  };

  const quickUpdateStatus = (id: string, status: EmpStatus) => {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, status } : x)));
  };

  const deleteEmployee = (id: string) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    if (viewId === id) setViewId(null);
    if (editId === id) setEditId(null);
  };

  const createEmployee = (payload: Partial<EmployeeItem>) => {
    const name = payload.name ?? "New Employee";
    const avatar =
      payload.avatar ??
      name
        .split(" ")
        .slice(0, 2)
        .map((x) => x[0]?.toUpperCase())
        .join("");

    const next: EmployeeItem = {
      id: `EMP_ROW-${Math.floor(4000 + Math.random() * 900)}`,
      employeeId: payload.employeeId ?? `EMP-${Math.floor(2000 + Math.random() * 900)}`,
      name,
      avatar: avatar || "NE",
      email: payload.email ?? "new.employee@company.com",
      phone: payload.phone ?? "+92 300 0000000",
      department: payload.department ?? "Engineering",
      designation: payload.designation ?? "Software Engineer",
      location: payload.location ?? "Lahore",
      employmentType: payload.employmentType ?? "PERMANENT",
      status: payload.status ?? "ACTIVE",
      joinedAt: payload.joinedAt ?? "2025-01-01",
      createdAt: nowIso(),
      managerName: payload.managerName ?? "You (Manager)",
    };

    setItems((prev) => [next, ...prev]);
  };

  const StatusPill = ({ status }: { status: EmpStatus }) => (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${STATUS_CONFIG[status].pill}`}
    >
      <span className={`w-2 h-2 rounded-full ${STATUS_CONFIG[status].dot}`} />
      {STATUS_CONFIG[status].label}
    </span>
  );

  const GlobalStats = () => {
    const activePct = (() => {
      if (!items.length) return "—";
      const v = Math.round((counts.active / items.length) * 100);
      return `${v}%`;
    })();

    return (
      <div className="flex items-center gap-4 mt-1">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          Global Stats:
        </span>
        <div className="flex gap-3 flex-wrap">
          <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
            <Check size={12} className="text-green-500" /> Total: {items.length}
          </span>
          <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
            <BadgeCheck size={12} className="text-blue-500" /> Active Rate:{" "}
            {activePct}
          </span>
          <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
            <Info size={12} className="text-gray-400" /> Last Added:{" "}
            {items[0] ? formatPrettyDateTime(items[0].createdAt) : "—"}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-hidden">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            Employee Directory
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Manage employees, status, and records with list or grid view.
          </p>
          <GlobalStats />
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-end">
          <div className="relative group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3E3B6F]"
              size={16}
            />
            <input
              type="text"
              placeholder="Search name / EMP ID / email / dept / location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium w-[340px] outline-none focus:ring-4 focus:ring-[#3E3B6F]/5 focus:border-[#3E3B6F] transition-all"
            />
          </div>

          {/* Department filter */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value as any)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
          >
            <option value="ALL">All Departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
          >
            <option value="ALL">All Types</option>
            {Object.keys(TYPE_CONFIG).map((t) => (
              <option key={t} value={t}>
                {TYPE_CONFIG[t as EmploymentType].label}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
          >
            <option value="ALL">All Status</option>
            {Object.keys(STATUS_CONFIG).map((s) => (
              <option key={s} value={s}>
                {STATUS_CONFIG[s as EmpStatus].label}
              </option>
            ))}
          </select>

          {/* view toggle */}
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
            <button
              onClick={() => setViewMode("LIST")}
              className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                viewMode === "LIST"
                  ? "bg-[#3E3B6F] text-white shadow-lg"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
              title="List view"
            >
              <List size={14} /> List
            </button>
            <button
              onClick={() => setViewMode("GRID")}
              className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                viewMode === "GRID"
                  ? "bg-[#3E3B6F] text-white shadow-lg"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
              title="Grid view"
            >
              <Grid3X3 size={14} /> Grid
            </button>
          </div>

          <IconBtn title="Settings">
            <Settings2 size={18} />
          </IconBtn>

          <button
            onClick={() => navigate("/peoplehub/onboardx")}
            className="flex items-center gap-2 px-4 py-2 bg-[#3E3B6F] text-white rounded-xl text-xs font-black shadow-lg hover:opacity-90 transition-all"
          >
            <Plus size={14} /> Add Employee
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-2xl p-1 mb-4 shadow-sm shrink-0">
        {[
          { id: "ALL" as const, label: "All", count: counts.all },
          { id: "ACTIVE" as const, label: "Active", count: counts.active },
          { id: "ON_LEAVE" as const, label: "On Leave", count: counts.onLeave },
          { id: "INACTIVE" as const, label: "Inactive", count: counts.inactive },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-black rounded-xl transition-all ${
              activeTab === tab.id
                ? "bg-[#3E3B6F] text-white shadow-lg"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            {tab.label}
            <span
              className={`px-1.5 py-0.5 rounded-md text-[9px] font-black ${
                activeTab === tab.id
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* BULK ACTION BAR */}
      {selectedIds.size > 0 && (
        <div className="mb-4 p-3 bg-[#3E3B6F] rounded-2xl flex items-center justify-between animate-in slide-in-from-top-4 duration-200 shadow-xl shadow-[#3E3B6F]/20">
          <div className="flex items-center gap-4 pl-3 flex-wrap">
            <span className="text-xs font-black text-white uppercase tracking-widest">
              {selectedIds.size} selected
            </span>
            <div className="h-4 w-px bg-white/20 hidden md:block" />
            <div className="flex items-center gap-2 text-white/70 text-[10px] font-bold">
              <Keyboard size={14} />
              <span>
                Press{" "}
                <kbd className="bg-white/10 px-1 rounded text-white border border-white/20">
                  A
                </kbd>{" "}
                Active •{" "}
                <kbd className="bg-white/10 px-1 rounded text-white border border-white/20">
                  L
                </kbd>{" "}
                Leave •{" "}
                <kbd className="bg-white/10 px-1 rounded text-white border border-white/20">
                  I
                </kbd>{" "}
                Inactive
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => bulkUpdateStatus("ACTIVE")}
              className="px-5 py-2 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-all flex items-center gap-2"
            >
              <Check size={14} /> Active
            </button>

            <button
              onClick={() => bulkUpdateStatus("ON_LEAVE")}
              className="px-5 py-2 bg-yellow-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-yellow-600 transition-all flex items-center gap-2"
            >
              <UserPlus size={14} /> Leave
            </button>

            <button
              onClick={() => bulkUpdateStatus("INACTIVE")}
              className="px-5 py-2 bg-gray-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-900 transition-all flex items-center gap-2"
            >
              <X size={14} /> Inactive
            </button>

            <button
              onClick={() => setSelectedIds(new Set())}
              className="p-2 text-white/60 hover:text-white transition-all"
              title="Clear selection"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* WRAPPER */}
      <div className="flex-1 bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col relative">
        {/* LIST VIEW */}
        {viewMode === "LIST" ? (
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-20 bg-gray-50/90 backdrop-blur-md border-b border-gray-100">
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <th className="px-6 py-4 w-12">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={(e) => toggleSelectAllVisible(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-[#3E3B6F] focus:ring-[#3E3B6F]"
                    />
                  </th>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Work</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {paged.rows.map((emp) => {
                  const isSelected = selectedIds.has(emp.id);
                  return (
                    <tr
                      key={emp.id}
                      className={`group hover:bg-gray-50/70 transition-all ${
                        isSelected ? "bg-[#3E3B6F]/5" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(emp.id)}
                          className="w-4 h-4 rounded border-gray-300 text-[#3E3B6F] focus:ring-[#3E3B6F]"
                        />
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#3E3B6F] flex items-center justify-center text-white text-[10px] font-black shadow-lg shadow-[#3E3B6F]/10">
                            {emp.avatar}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-black text-gray-800 truncate">
                              {emp.name}
                            </p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase truncate">
                              {emp.employeeId} • Manager:{" "}
                              {emp.managerName ?? "—"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-[11px] font-bold text-gray-700 flex items-center gap-2">
                            <Briefcase size={14} className="text-gray-400" />
                            {emp.designation}
                          </div>
                          <div className="text-[10px] text-gray-500 font-medium flex items-center gap-2">
                            <Building2 size={14} className="text-gray-400" />
                            {emp.department}
                          </div>
                          <div className="text-[10px] text-gray-500 font-medium flex items-center gap-2">
                            <MapPin size={14} className="text-gray-400" />
                            {emp.location} • Joined {formatPrettyDate(emp.joinedAt)}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-[11px] font-bold text-gray-700 flex items-center gap-2">
                          <Mail size={14} className="text-gray-400" />
                          <span className="truncate">{emp.email}</span>
                        </div>
                        <div className="text-[10px] text-gray-500 font-medium flex items-center gap-2 mt-1">
                          <Phone size={14} className="text-gray-400" />
                          {emp.phone}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <Pill className={TYPE_CONFIG[emp.employmentType].pill}>
                          {TYPE_CONFIG[emp.employmentType].label}
                        </Pill>
                        <p className="text-[10px] text-gray-400 font-medium mt-1 hidden lg:block">
                          {TYPE_CONFIG[emp.employmentType].hint}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <StatusPill status={emp.status} />
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* quick status (only for active/leave) */}
                          {emp.status !== "INACTIVE" && (
                            <>
                              <button
                                onClick={() => quickUpdateStatus(emp.id, "ACTIVE")}
                                className="p-2 bg-green-50 text-green-700 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                                title="Mark Active"
                              >
                                <Check size={14} />
                              </button>
                              <button
                                onClick={() =>
                                  quickUpdateStatus(emp.id, "ON_LEAVE")
                                }
                                className="p-2 bg-yellow-50 text-yellow-700 rounded-xl hover:bg-yellow-600 hover:text-white transition-all shadow-sm"
                                title="Mark On Leave"
                              >
                                <UserPlus size={14} />
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => navigate("/peoplehub/employee360")}
                            className="p-2 bg-white border border-gray-200 text-gray-500 rounded-xl hover:text-[#3E3B6F] hover:border-[#3E3B6F] transition-all"
                            title="View"
                          >
                            <ExternalLink size={14} />
                          </button>

                          <button
                            onClick={() => setEditId(emp.id)}
                            className="p-2 bg-white border border-gray-200 text-gray-500 rounded-xl hover:text-[#3E3B6F] hover:border-[#3E3B6F] transition-all"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>

                          <button
                            onClick={() => setDeleteTargetId(emp.id)}
                            className="p-2 bg-white border border-gray-200 text-gray-500 rounded-xl hover:text-red-600 hover:border-red-300 transition-all"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {paged.total === 0 && (
              <EmptyState
                onReset={() => {
                  setSearchQuery("");
                  setDeptFilter("ALL");
                  setTypeFilter("ALL");
                  setStatusFilter("ALL");
                  setActiveTab("ALL");
                }}
              />
            )}
          </div>
        ) : (
          /* GRID VIEW */
          <div className="flex-1 overflow-auto p-5">
            {paged.total === 0 ? (
              <EmptyState
                onReset={() => {
                  setSearchQuery("");
                  setDeptFilter("ALL");
                  setTypeFilter("ALL");
                  setStatusFilter("ALL");
                  setActiveTab("ALL");
                }}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {paged.rows.map((emp) => {
                  const isSelected = selectedIds.has(emp.id);
                  return (
                    <div
                      key={emp.id}
                      className={`bg-white border rounded-3xl p-5 shadow-sm hover:shadow-md transition-all ${
                        isSelected
                          ? "border-[#3E3B6F] ring-4 ring-[#3E3B6F]/10"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-2xl bg-[#3E3B6F] flex items-center justify-center text-white text-sm font-black shadow-lg shadow-[#3E3B6F]/15">
                            {emp.avatar}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-black text-gray-900 truncate">
                              {emp.name}
                            </p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase truncate">
                              {emp.employeeId} • {emp.department}
                            </p>
                            <p className="text-[10px] text-gray-400 font-medium truncate mt-1">
                              Manager: {emp.managerName ?? "—"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(emp.id)}
                            className="w-4 h-4 rounded border-gray-300 text-[#3E3B6F] focus:ring-[#3E3B6F]"
                            title="Select"
                          />
                          <IconBtn
                            title="More"
                            className="bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                            onClick={() => setViewId(emp.id)}
                          >
                            <MoreHorizontal size={16} />
                          </IconBtn>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Pill className={TYPE_CONFIG[emp.employmentType].pill}>
                          {TYPE_CONFIG[emp.employmentType].label}
                        </Pill>
                        <StatusPill status={emp.status} />
                      </div>

                      <div className="mt-4 space-y-2 text-[12px]">
                        <div className="flex items-center gap-2 text-gray-700 font-bold">
                          <Briefcase size={14} className="text-gray-400" />
                          <span className="truncate">{emp.designation}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 font-medium">
                          <MapPin size={14} className="text-gray-400" />
                          {emp.location} • Joined {formatPrettyDate(emp.joinedAt)}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 font-medium">
                          <Mail size={14} className="text-gray-400" />
                          <span className="truncate">{emp.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 font-medium">
                          <Phone size={14} className="text-gray-400" />
                          {emp.phone}
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="text-[10px] text-gray-400 font-bold uppercase">
                          Added {formatPrettyDateTime(emp.createdAt)}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditId(emp.id)}
                            className="px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setViewId(emp.id)}
                            className="px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-[#3E3B6F] text-white hover:opacity-90"
                          >
                            View
                          </button>
                        </div>
                      </div>

                      {/* quick actions row */}
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => quickUpdateStatus(emp.id, "ACTIVE")}
                          className="flex-1 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-green-50 border border-green-200 text-green-700 hover:bg-green-600 hover:text-white transition-all"
                        >
                          Active
                        </button>
                        <button
                          onClick={() => quickUpdateStatus(emp.id, "ON_LEAVE")}
                          className="flex-1 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-yellow-50 border border-yellow-200 text-yellow-700 hover:bg-yellow-600 hover:text-white transition-all"
                        >
                          Leave
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(emp.id)}
                          className="px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white border border-gray-200 text-red-600 hover:bg-red-50 transition-all"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* FOOTER */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Showing {paged.total === 0 ? 0 : paged.start + 1}-{paged.end} of{" "}
              {paged.total}
            </span>

            <div className="flex gap-1">
              <button
                className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#3E3B6F] transition-all disabled:opacity-40"
                onClick={() =>
                  setPageIndex((p) =>
                    clamp(p - 1, 0, Math.ceil(paged.total / pageSize) - 1)
                  )
                }
                disabled={pageIndex === 0}
                title="Previous"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#3E3B6F] transition-all disabled:opacity-40"
                onClick={() =>
                  setPageIndex((p) =>
                    clamp(p + 1, 0, Math.ceil(paged.total / pageSize) - 1)
                  )
                }
                disabled={(pageIndex + 1) * pageSize >= paged.total}
                title="Next"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-black text-gray-600 hover:bg-gray-50 transition-all">
            <Download size={14} /> Download Directory
          </button>
        </div>
      </div>

      {/* VIEW MODAL */}
      <ModalShell
        open={!!viewItem}
        onClose={() => setViewId(null)}
        title={
          viewItem ? `${viewItem.employeeId} • ${viewItem.name}` : "Employee"
        }
        subtitle={
          viewItem
            ? `${viewItem.designation} • ${viewItem.department} • ${viewItem.location}`
            : undefined
        }
        size="xl"
        footer={
          viewItem ? (
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
                <Info size={14} className="text-gray-400" />
                {STATUS_CONFIG[viewItem.status].help}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditId(viewItem.id);
                    setViewId(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-[#3E3B6F] hover:opacity-90 text-white"
                >
                  Edit
                </button>
              </div>
            </div>
          ) : null
        }
      >
        {viewItem && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* left */}
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#3E3B6F] flex items-center justify-center text-white text-sm font-black shadow-lg shadow-[#3E3B6F]/15">
                      {viewItem.avatar}
                    </div>
                    <div>
                      <p className="text-lg font-black text-gray-900">
                        {viewItem.name}
                      </p>
                      <p className="text-xs text-gray-500 font-bold uppercase">
                        {viewItem.employeeId} • Manager:{" "}
                        {viewItem.managerName ?? "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Pill className={TYPE_CONFIG[viewItem.employmentType].pill}>
                      {TYPE_CONFIG[viewItem.employmentType].label}
                    </Pill>
                    <StatusPill status={viewItem.status} />
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoRow label="Department" value={viewItem.department} />
                  <InfoRow label="Designation" value={viewItem.designation} />
                  <InfoRow label="Location" value={viewItem.location} />
                  <InfoRow label="Joined At" value={formatPrettyDate(viewItem.joinedAt)} />
                  <InfoRow label="Email" value={viewItem.email} />
                  <InfoRow label="Phone" value={viewItem.phone} />
                </div>
              </div>
            </div>

            {/* right */}
            <div className="space-y-5">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                  Quick Actions
                </p>

                <div className="grid gap-2">
                  <button
                    onClick={() => quickUpdateStatus(viewItem.id, "ACTIVE")}
                    className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-green-600 hover:bg-green-700 text-white"
                  >
                    Mark Active
                  </button>
                  <button
                    onClick={() => quickUpdateStatus(viewItem.id, "ON_LEAVE")}
                    className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-yellow-500 hover:bg-yellow-600 text-white"
                  >
                    Mark On Leave
                  </button>
                  <button
                    onClick={() => quickUpdateStatus(viewItem.id, "INACTIVE")}
                    className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-gray-800 hover:bg-gray-900 text-white"
                  >
                    Mark Inactive
                  </button>
                  <button
                    onClick={() => {
                      setDeleteTargetId(viewItem.id);
                      setViewId(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-white border border-gray-200 text-red-600 hover:bg-red-50"
                  >
                    Delete Employee
                  </button>
                </div>
              </div>

              <div className="bg-[#E8B4A0]/10 border border-[#E8B4A0]/30 rounded-2xl p-5">
                <div className="flex gap-3">
                  <div className="bg-[#E8B4A0]/20 p-2 rounded-xl h-fit">
                    <Info size={18} className="text-[#3E3B6F]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-[#3E3B6F] uppercase tracking-widest">
                      Note
                    </p>
                    <p className="text-[11px] text-gray-700 font-medium leading-relaxed mt-2">
                      This is dummy UI. Hook it to your API and replace
                      create/edit/view payloads with backend fields.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </ModalShell>

      {/* EDIT MODAL */}
      <EditEmployeeModal
        open={!!editItem}
        item={editItem}
        onClose={() => setEditId(null)}
        onSave={(updated) => {
          setItems((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
          setEditId(null);
        }}
        onDelete={(id) => {
          setEditId(null);
          setDeleteTargetId(id);
        }}
      />

      {/* CREATE MODAL */}
      <CreateEmployeeModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={(payload) => {
          createEmployee(payload);
          setCreateOpen(false);
        }}
      />

      {/* DELETE CONFIRM */}
      <ConfirmDialog
        open={!!deleteTargetId}
        title="Delete employee?"
        description="This will permanently remove the employee from the directory (dummy behavior)."
        confirmText="Delete"
        danger
        onCancel={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (!deleteTargetId) return;
          deleteEmployee(deleteTargetId);
          setDeleteTargetId(null);
        }}
      />
    </div>
  );
};

/** ---------- UI bits ---------- */

const InfoRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div>
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
      {label}
    </p>
    <p className="text-sm font-bold text-gray-800 mt-1 truncate">{value}</p>
  </div>
);

const EmptyState: React.FC<{ onReset: () => void }> = ({ onReset }) => (
  <div className="h-full flex flex-col items-center justify-center p-16 text-center opacity-40">
    <Mail size={56} className="text-gray-300 mb-4" />
    <h3 className="text-lg font-black uppercase tracking-widest text-gray-500">
      No Employees
    </h3>
    <p className="text-sm font-medium mt-2 text-gray-500">
      No employees match your filters.
    </p>
    <button
      onClick={onReset}
      className="mt-4 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
    >
      Reset Filters
    </button>
  </div>
);

/** ---------- Create Modal ---------- */

const CreateEmployeeModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onCreate: (payload: Partial<EmployeeItem>) => void;
}> = ({ open, onClose, onCreate }) => {
  const [name, setName] = useState("Ahmed Khan");
  const [employeeId, setEmployeeId] = useState("EMP-2001");
  const [email, setEmail] = useState("ahmed.khan@company.com");
  const [phone, setPhone] = useState("+92 300 0000000");
  const [department, setDepartment] = useState("Engineering");
  const [designation, setDesignation] = useState("Software Engineer");
  const [location, setLocation] = useState("Lahore");
  const [employmentType, setEmploymentType] =
    useState<EmploymentType>("PERMANENT");
  const [status, setStatus] = useState<EmpStatus>("ACTIVE");
  const [joinedAt, setJoinedAt] = useState("2025-01-01");
  const [managerName, setManagerName] = useState("You (Manager)");

  useEffect(() => {
    if (!open) return;
    setName("Ahmed Khan");
    setEmployeeId("EMP-2001");
    setEmail("ahmed.khan@company.com");
    setPhone("+92 300 0000000");
    setDepartment("Engineering");
    setDesignation("Software Engineer");
    setLocation("Lahore");
    setEmploymentType("PERMANENT");
    setStatus("ACTIVE");
    setJoinedAt("2025-01-01");
    setManagerName("You (Manager)");
  }, [open]);

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Add Employee"
      subtitle="Dummy flow — adds a new employee to the directory."
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onCreate({
                name,
                employeeId,
                email,
                phone,
                department,
                designation,
                location,
                employmentType,
                status,
                joinedAt,
                managerName,
                avatar: name
                  .split(" ")
                  .slice(0, 2)
                  .map((x) => x[0]?.toUpperCase())
                  .join(""),
              })
            }
            className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-[#3E3B6F] hover:opacity-90 text-white"
          >
            Create
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
          />
        </Field>

        <Field label="Employee ID">
          <input
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
          />
        </Field>

        <Field label="Email">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
          />
        </Field>

        <Field label="Phone">
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
          />
        </Field>

        <Field label="Department">
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
          >
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Designation">
          <select
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
          >
            {DESIGNATIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Location">
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
          >
            {LOCATIONS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Employment Type">
          <select
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
          >
            {Object.keys(TYPE_CONFIG).map((t) => (
              <option key={t} value={t}>
                {TYPE_CONFIG[t as EmploymentType].label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Status">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
          >
            {Object.keys(STATUS_CONFIG).map((s) => (
              <option key={s} value={s}>
                {STATUS_CONFIG[s as EmpStatus].label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Joined At">
          <input
            type="date"
            value={joinedAt}
            onChange={(e) => setJoinedAt(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
          />
        </Field>

        <div className="md:col-span-2">
          <Field label="Manager Name">
            <input
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
            />
          </Field>
        </div>
      </div>
    </ModalShell>
  );
};

/** ---------- Edit Modal ---------- */

const EditEmployeeModal: React.FC<{
  open: boolean;
  item: EmployeeItem | null;
  onClose: () => void;
  onSave: (item: EmployeeItem) => void;
  onDelete: (id: string) => void;
}> = ({ open, item, onClose, onSave, onDelete }) => {
  const [draft, setDraft] = useState<EmployeeItem | null>(item);

  useEffect(() => setDraft(item), [item]);

  if (!open) return null;

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={draft ? `Edit ${draft.employeeId}` : "Edit Employee"}
      subtitle="Dummy flow — updates data locally."
      size="lg"
      footer={
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => draft && onDelete(draft.id)}
            className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-white border border-gray-200 text-red-600 hover:bg-red-50 flex items-center gap-2"
          >
            <Trash2 size={14} /> Delete
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => draft && onSave(draft)}
              className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-[#3E3B6F] hover:opacity-90 text-white"
            >
              Save
            </button>
          </div>
        </div>
      }
    >
      {draft && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Name">
            <input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
            />
          </Field>

          <Field label="Employee ID">
            <input
              value={draft.employeeId}
              onChange={(e) =>
                setDraft({ ...draft, employeeId: e.target.value })
              }
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
            />
          </Field>

          <Field label="Email">
            <input
              value={draft.email}
              onChange={(e) => setDraft({ ...draft, email: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
            />
          </Field>

          <Field label="Phone">
            <input
              value={draft.phone}
              onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
            />
          </Field>

          <Field label="Department">
            <select
              value={draft.department}
              onChange={(e) =>
                setDraft({ ...draft, department: e.target.value })
              }
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Designation">
            <select
              value={draft.designation}
              onChange={(e) =>
                setDraft({ ...draft, designation: e.target.value })
              }
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
            >
              {DESIGNATIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Location">
            <select
              value={draft.location}
              onChange={(e) => setDraft({ ...draft, location: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
            >
              {LOCATIONS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Employment Type">
            <select
              value={draft.employmentType}
              onChange={(e) =>
                setDraft({ ...draft, employmentType: e.target.value as any })
              }
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
            >
              {Object.keys(TYPE_CONFIG).map((t) => (
                <option key={t} value={t}>
                  {TYPE_CONFIG[t as EmploymentType].label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Status">
            <select
              value={draft.status}
              onChange={(e) =>
                setDraft({ ...draft, status: e.target.value as any })
              }
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
            >
              {Object.keys(STATUS_CONFIG).map((s) => (
                <option key={s} value={s}>
                  {STATUS_CONFIG[s as EmpStatus].label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Joined At">
            <input
              type="date"
              value={draft.joinedAt}
              onChange={(e) => setDraft({ ...draft, joinedAt: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
            />
          </Field>

          <div className="md:col-span-2">
            <Field label="Manager Name">
              <input
                value={draft.managerName ?? ""}
                onChange={(e) =>
                  setDraft({ ...draft, managerName: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
              />
            </Field>
          </div>
        </div>
      )}
    </ModalShell>
  );
};
