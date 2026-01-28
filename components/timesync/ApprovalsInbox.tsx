import React, { useEffect, useMemo, useRef, useState } from "react";
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
  Clock,
  ArrowRightLeft,
  Zap,
  Calendar,
  ShieldAlert,
  History,
  AlertTriangle,
  Mail,
  MoreHorizontal,
  Pencil,
  Trash2,
  Plus,
  Info,
  Timer,
  Share2Icon,
  CornerUpLeft,
} from "lucide-react";

/**
 * Timesync Approvals Inbox — revamped (dummy data)
 * - Logical statuses + tabs
 * - View/Edit/Delete + Create modal
 * - Bulk actions
 * - Pagination + filters
 */

type ApprovalType =
  | "REGULARIZATION"
  | "OT"
  | "SWAP"
  | "MANUAL"
  | "ROSTER"
  | "RETRO";
type ApprovalStatus =
  | "PENDING"
  | "ESCALATED"
  | "DELEGATED"
  | "APPROVED"
  | "REJECTED";

type TabKey = "ALL" | "MY_QUEUE" | "ESCALATED" | "DELEGATED" | "COMPLETED";

interface ApprovalItem {
  id: string;
  employeeName: string;
  employeeId: string;
  avatar: string; // initials
  team: string;
  type: ApprovalType;
  status: ApprovalStatus;
  requestDate: string; // "2025-01-10"
  submittedAt: string; // ISO
  slaHoursRemaining: number;
  title: string; // summary
  details: string;
  reason: string;
  attachments?: { name: string; url?: string }[];
  delegatedTo?: string;
  escalatedLevel?: number;
  createdBy: string;
}

const TYPE_CONFIG: Record<
  ApprovalType,
  { label: string; pill: string; icon: React.ReactNode; hint: string }
> = {
  REGULARIZATION: {
    label: "Regularization",
    pill: "bg-blue-50 text-blue-700 border-blue-200",
    icon: <History size={14} />,
    hint: "Fix missing/incorrect punches for a day.",
  },
  OT: {
    label: "OT Request",
    pill: "bg-green-50 text-green-700 border-green-200",
    icon: <Clock size={14} />,
    hint: "Overtime hours approval for extra work.",
  },
  SWAP: {
    label: "Shift Swap",
    pill: "bg-purple-50 text-purple-700 border-purple-200",
    icon: <ArrowRightLeft size={14} />,
    hint: "Swap shift with another employee.",
  },
  MANUAL: {
    label: "Manual Punch",
    pill: "bg-orange-50 text-orange-700 border-orange-200",
    icon: <Zap size={14} />,
    hint: "Add missing punch manually (device/geo issues).",
  },
  ROSTER: {
    label: "Roster Change",
    pill: "bg-gray-50 text-gray-700 border-gray-200",
    icon: <Calendar size={14} />,
    hint: "Change roster schedule for upcoming dates.",
  },
  RETRO: {
    label: "Retro Correction",
    pill: "bg-red-50 text-red-700 border-red-200",
    icon: <ShieldAlert size={14} />,
    hint: "High-impact correction for payroll/attendance history.",
  },
};

const STATUS_CONFIG: Record<
  ApprovalStatus,
  { label: string; pill: string; dot: string; help: string }
> = {
  PENDING: {
    label: "Pending",
    pill: "bg-gray-50 text-gray-700 border-gray-200",
    dot: "bg-gray-400",
    help: "Waiting for your action.",
  },
  ESCALATED: {
    label: "Escalated",
    pill: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
    help: "SLA risk or escalated by policy/manager.",
  },
  DELEGATED: {
    label: "Delegated",
    pill: "bg-indigo-50 text-indigo-700 border-indigo-200",
    dot: "bg-indigo-500",
    help: "Delegated to another approver.",
  },
  APPROVED: {
    label: "Approved",
    pill: "bg-green-50 text-green-700 border-green-200",
    dot: "bg-green-500",
    help: "Approved and processed.",
  },
  REJECTED: {
    label: "Rejected",
    pill: "bg-orange-50 text-orange-700 border-orange-200",
    dot: "bg-orange-500",
    help: "Rejected with a reason.",
  },
};

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

const seedDummy = (): ApprovalItem[] => {
  const employees = [
    { name: "Ahmed Khan", id: "EMP-1021", avatar: "AK", team: "Engineering" },
    { name: "Sarah Chen", id: "EMP-1043", avatar: "SC", team: "Product" },
    { name: "James Wilson", id: "EMP-1009", avatar: "JW", team: "Ops" },
    { name: "Priya Das", id: "EMP-1091", avatar: "PD", team: "Engineering" },
    { name: "Marcus Low", id: "EMP-1066", avatar: "ML", team: "IT" },
    { name: "Elena Frost", id: "EMP-1018", avatar: "EF", team: "HR" },
  ];

  const types: ApprovalType[] = [
    "REGULARIZATION",
    "OT",
    "SWAP",
    "MANUAL",
    "ROSTER",
    "RETRO",
  ];

  const base = Array.from({ length: 34 }).map((_, i) => {
    const emp = employees[i % employees.length];
    const type = types[i % types.length];

    const status: ApprovalStatus =
      i === 0
        ? "ESCALATED"
        : i === 1
          ? "DELEGATED"
          : i % 11 === 0
            ? "APPROVED"
            : i % 13 === 0
              ? "REJECTED"
              : "PENDING";

    const day = 10 - (i % 8); // Jan 2..10
    const reqDate = `2025-01-${String(day).padStart(2, "0")}`;

    const sla = status === "ESCALATED" ? 2 : Math.max(1, 48 - ((i * 2) % 48));

    const title =
      type === "REGULARIZATION"
        ? `Missing punch on ${formatPrettyDate(reqDate)}`
        : type === "MANUAL"
          ? `Manual punch required (${formatPrettyDate(reqDate)})`
          : type === "OT"
            ? `Overtime request (${(i % 4) + 1}.0h)`
            : type === "SWAP"
              ? `Shift swap request`
              : type === "ROSTER"
                ? `Roster change for next week`
                : `Retro correction request`;

    const details =
      type === "SWAP"
        ? "Swap Morning ↔ Evening with another resource"
        : type === "OT"
          ? `Requested OT hours: ${(i % 4) + 1}.0h`
          : type === "ROSTER"
            ? "Requested roster change: General → Night"
            : "System detected mismatch between punches and shift policy";

    return {
      id: `REQ-${1200 + i}`,
      employeeName: emp.name,
      employeeId: emp.id,
      avatar: emp.avatar,
      team: emp.team,
      type,
      status,
      requestDate: reqDate,
      submittedAt: new Date(
        Date.parse("2025-01-10T12:00:00Z") - i * 3 * 60 * 60 * 1000,
      ).toISOString(),
      slaHoursRemaining: sla,
      title,
      details,
      reason:
        i % 2 === 0
          ? "Device issue / network problem at punch time."
          : "Team deadline support / operational need.",
      attachments:
        i % 5 === 0
          ? [{ name: "proof.png" }, { name: "policy-note.pdf" }]
          : undefined,
      delegatedTo: status === "DELEGATED" ? "Team Lead (Dummy)" : undefined,
      escalatedLevel: status === "ESCALATED" ? 2 : undefined,
      createdBy: "System / Employee",
    };
  });

  return base;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function buildSlaBadge(hours: number) {
  if (hours <= 4)
    return {
      text: `${hours}h left`,
      cls: "text-red-600 bg-red-50 border-red-200",
    };
  if (hours <= 12)
    return {
      text: `${hours}h left`,
      cls: "text-orange-600 bg-orange-50 border-orange-200",
    };
  return {
    text: `${hours}h left`,
    cls: "text-green-700 bg-green-50 border-green-200",
  };
}

/** ---------- Small UI helpers (no external deps) ---------- */

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
    className={`p-2 rounded-xl border transition-all ${className ?? "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"}`}
  >
    {children}
  </button>
);

/** ---------- Main component ---------- */

export const ApprovalsInbox: React.FC = () => {
  // pretend current user is a manager
  const currentApproverName = "You (Manager)";

  const [items, setItems] = useState<ApprovalItem[]>(seedDummy());

  // tabs / filters
  const [activeTab, setActiveTab] = useState<TabKey>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | ApprovalType>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | ApprovalStatus>(
    "ALL",
  );

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
    [items, viewId],
  );
  const editItem = useMemo(
    () => items.find((x) => x.id === editId) ?? null,
    [items, editId],
  );

  // keyboard shortcuts (approve/reject selected) + ESC closes modals
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (viewId) setViewId(null);
        if (editId) setEditId(null);
        if (createOpen) setCreateOpen(false);
        if (deleteTargetId) setDeleteTargetId(null);
      }

      // Approve/Reject only when selection exists and no modal open
      const anyModalOpen =
        !!viewId || !!editId || createOpen || !!deleteTargetId;
      if (anyModalOpen) return;

      if (selectedIds.size === 0) return;
      if (e.key.toLowerCase() === "a") bulkUpdateStatus("APPROVED");
      if (e.key.toLowerCase() === "r") bulkUpdateStatus("REJECTED");
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIds, viewId, editId, createOpen, deleteTargetId]);

  const counts = useMemo(() => {
    const all = items.length;
    const pending = items.filter((x) => x.status === "PENDING").length;
    const escalated = items.filter((x) => x.status === "ESCALATED").length;
    const delegated = items.filter((x) => x.status === "DELEGATED").length;
    const completed = items.filter(
      (x) => x.status === "APPROVED" || x.status === "REJECTED",
    ).length;

    // for dummy: My Queue = pending+escalated only (not delegated)
    const myQueue = items.filter(
      (x) => x.status === "PENDING" || x.status === "ESCALATED",
    ).length;

    return { all, pending, escalated, delegated, completed, myQueue };
  }, [items]);

  const tabFiltered = useMemo(() => {
    let list = [...items];

    if (activeTab === "MY_QUEUE") {
      list = list.filter(
        (x) => x.status === "PENDING" || x.status === "ESCALATED",
      );
    } else if (activeTab === "ESCALATED") {
      list = list.filter((x) => x.status === "ESCALATED");
    } else if (activeTab === "DELEGATED") {
      list = list.filter((x) => x.status === "DELEGATED");
    } else if (activeTab === "COMPLETED") {
      list = list.filter(
        (x) => x.status === "APPROVED" || x.status === "REJECTED",
      );
    } else {
      // ALL
      // keep all
    }

    // filter dropdowns
    if (typeFilter !== "ALL") list = list.filter((x) => x.type === typeFilter);
    if (statusFilter !== "ALL")
      list = list.filter((x) => x.status === statusFilter);

    // search
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (x) =>
          x.employeeName.toLowerCase().includes(q) ||
          x.employeeId.toLowerCase().includes(q) ||
          x.id.toLowerCase().includes(q) ||
          x.team.toLowerCase().includes(q),
      );
    }

    // default sorting: escalated first, then pending, then delegated, then completed
    const order: Record<ApprovalStatus, number> = {
      ESCALATED: 0,
      PENDING: 1,
      DELEGATED: 2,
      APPROVED: 3,
      REJECTED: 4,
    };

    list.sort((a, b) => {
      const d = order[a.status] - order[b.status];
      if (d !== 0) return d;
      // closer SLA first
      return a.slaHoursRemaining - b.slaHoursRemaining;
    });

    return list;
  }, [items, activeTab, typeFilter, statusFilter, searchQuery]);

  // reset page when filters change
  useEffect(
    () => setPageIndex(0),
    [activeTab, typeFilter, statusFilter, searchQuery],
  );

  const paged = useMemo(() => {
    const total = tabFiltered.length;
    const start = pageIndex * pageSize;
    const end = Math.min(total, start + pageSize);
    return { rows: tabFiltered.slice(start, end), total, start, end };
  }, [tabFiltered, pageIndex]);

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

  const bulkUpdateStatus = (status: ApprovalStatus) => {
    setItems((prev) =>
      prev.map((x) => (selectedIds.has(x.id) ? { ...x, status } : x)),
    );
    setSelectedIds(new Set());
  };

  const quickUpdateStatus = (id: string, status: ApprovalStatus) => {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, status } : x)));
  };

  const deleteRequest = (id: string) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    if (viewId === id) setViewId(null);
    if (editId === id) setEditId(null);
  };

  const createRequest = (payload: Partial<ApprovalItem>) => {
    const next: ApprovalItem = {
      id: `REQ-${Math.floor(2000 + Math.random() * 700)}`,
      employeeName: payload.employeeName ?? "New Employee",
      employeeId: payload.employeeId ?? "EMP-0000",
      avatar: payload.avatar ?? "NE",
      team: payload.team ?? "Unknown",
      type: payload.type ?? "REGULARIZATION",
      status: "PENDING",
      requestDate: payload.requestDate ?? "2025-01-10",
      submittedAt: nowIso(),
      slaHoursRemaining: payload.slaHoursRemaining ?? 24,
      title: payload.title ?? "New request",
      details: payload.details ?? "Details not provided",
      reason: payload.reason ?? "Reason not provided",
      attachments: payload.attachments ?? [],
      createdBy: currentApproverName,
    };
    setItems((prev) => [next, ...prev]);
  };

  /** ---------- Render ---------- */

  const GlobalStats = () => {
    const overdue = items.filter(
      (x) =>
        x.slaHoursRemaining <= 4 &&
        (x.status === "PENDING" || x.status === "ESCALATED"),
    ).length;
    const avg = (() => {
      const arr = items
        .filter((x) => x.status === "APPROVED" || x.status === "REJECTED")
        .slice(0, 12);
      if (!arr.length) return "—";
      // fake avg response time
      return "4.2h";
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
            <AlertTriangle size={12} className="text-red-500" /> Critical SLA:{" "}
            {overdue}
          </span>
          <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
            <Clock size={12} className="text-blue-500" /> Avg Response: {avg}
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
            Approvals Inbox
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Review team requests, take action, delegate, and keep SLA under
            control.
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
              placeholder="Search name / employee ID / request ID / team..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium w-[320px] outline-none focus:ring-4 focus:ring-[#3E3B6F]/5 focus:border-[#3E3B6F] transition-all"
            />
          </div>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
          >
            <option value="ALL">All Types</option>
            {Object.keys(TYPE_CONFIG).map((t) => (
              <option key={t} value={t}>
                {TYPE_CONFIG[t as ApprovalType].label}
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
                {STATUS_CONFIG[s as ApprovalStatus].label}
              </option>
            ))}
          </select>

          <IconBtn title="Settings">
            <Settings2 size={18} />
          </IconBtn>

          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#3E3B6F] text-white rounded-xl text-xs font-black shadow-lg hover:opacity-90 transition-all"
          >
            <Plus size={14} /> Create Request
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-2xl p-1 mb-4 shadow-sm shrink-0">
        {[
          { id: "ALL" as const, label: "All", count: counts.all },
          { id: "MY_QUEUE" as const, label: "My Queue", count: counts.myQueue },
          {
            id: "ESCALATED" as const,
            label: "Escalated",
            count: counts.escalated,
          },
          {
            id: "DELEGATED" as const,
            label: "Delegated",
            count: counts.delegated,
          },
          {
            id: "COMPLETED" as const,
            label: "Completed",
            count: counts.completed,
          },
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

      {/* ACTION BAR (bulk) */}
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
                approve •{" "}
                <kbd className="bg-white/10 px-1 rounded text-white border border-white/20">
                  R
                </kbd>{" "}
                reject
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => bulkUpdateStatus("APPROVED")}
              className="px-5 py-2 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-all flex items-center gap-2"
            >
              <Check size={14} /> Approve
            </button>

            <button
              onClick={() => bulkUpdateStatus("REJECTED")}
              className="px-5 py-2 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all flex items-center gap-2"
            >
              <X size={14} /> Reject
            </button>

            <button
              onClick={() => {
                // dummy delegation: mark as delegated
                setItems((prev) =>
                  prev.map((x) =>
                    selectedIds.has(x.id)
                      ? {
                          ...x,
                          status: "DELEGATED",
                          delegatedTo: "Team Lead (Dummy)",
                        }
                      : x,
                  ),
                );
                setSelectedIds(new Set());
              }}
              className="px-5 py-2 bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <UserPlus size={14} /> Delegate
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

      {/* TABLE WRAPPER */}
      <div className="flex-1 bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col relative">
        <div className="overflow-x-auto  flex-1">
          <table className="w-full text-left border-collapse ">
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
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Summary</th>
                <th className="px-6 py-4">Requested For</th>
                <th className="px-6 py-4 text-center">SLA</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {paged.rows.map((item) => {
                const type = TYPE_CONFIG[item.type];
                const status = STATUS_CONFIG[item.status];
                const sla = buildSlaBadge(item.slaHoursRemaining);
                const isSelected = selectedIds.has(item.id);

                return (
                  <tr
                    key={item.id}
                    className={`group hover:bg-gray-50/70 transition-all ${isSelected ? "bg-[#3E3B6F]/5" : ""}`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(item.id)}
                        className="w-4 h-4 rounded border-gray-300 text-[#3E3B6F] focus:ring-[#3E3B6F]"
                      />
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#3E3B6F] flex items-center justify-center text-white text-[10px] font-black shadow-lg shadow-[#3E3B6F]/10">
                          {item.avatar}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-gray-800 truncate">
                            {item.employeeName}
                          </p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase truncate">
                            {item.employeeId} • {item.team} • {item.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <Pill className={type.pill}>
                        {type.icon}
                        {type.label}
                      </Pill>
                      <p className="text-[10px] text-gray-400 font-medium mt-1 hidden lg:block">
                        {type.hint}
                      </p>
                    </td>

                    <td className="px-6 py-4 max-w-[320px]">
                      <p className="text-[12px] font-black text-gray-800 truncate">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-gray-500 font-medium truncate mt-0.5">
                        {item.details}
                      </p>
                      <p className="text-[9px] text-gray-400 font-medium italic truncate mt-0.5">
                        “{item.reason}”
                      </p>
                    </td>

                    <td className="px-6 py-4 text-[11px] font-bold text-gray-600 tabular-nums">
                      {formatPrettyDate(item.requestDate)}
                      <div className="text-[9px] text-gray-400 font-medium mt-0.5">
                        Submitted: {formatPrettyDateTime(item.submittedAt)}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${sla.cls}`}
                      >
                        <Timer size={14} />
                        {sla.text}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${status.pill}`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${status.dot}`}
                        />
                        {status.label}
                      </span>
                      {item.status === "DELEGATED" && item.delegatedTo && (
                        <div className="text-[9px] text-indigo-600 font-bold mt-1">
                          Delegated to: {item.delegatedTo}
                        </div>
                      )}
                      {item.status === "ESCALATED" && item.escalatedLevel && (
                        <div className="text-[9px] text-red-600 font-bold mt-1">
                          Escalation Level: {item.escalatedLevel}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2  transition-all">
                        {/* quick approve/reject only if actionable */}
                        {(item.status === "PENDING" ||
                          item.status === "ESCALATED") && (
                          <>
                            <button
                              onClick={() =>
                                quickUpdateStatus(item.id, "APPROVED")
                              }
                              className="p-2 bg-green-50 text-green-700 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                              title="Quick Approve"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() =>
                                quickUpdateStatus(item.id, "REJECTED")
                              }
                              className="p-2 bg-red-50 text-red-700 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                              title="Quick Reject"
                            >
                              <X size={14} />
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => setViewId(item.id)}
                          className="p-2 bg-white border border-gray-200 text-gray-500 rounded-xl hover:text-[#3E3B6F] hover:border-[#3E3B6F] transition-all"
                          title="View"
                        >
                          <ExternalLink size={14} />
                        </button>

                        <button
                          onClick={() => setEditId(item.id)}
                          className="p-2 bg-white border border-gray-200 text-gray-500 rounded-xl hover:text-[#3E3B6F] hover:border-[#3E3B6F] transition-all"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>

                        <button
                          className="p-2 bg-white border border-gray-200 text-gray-500 rounded-xl hover:text-orange-600 hover:border-orange-300 transition-all"
                          title="Send Back"
                        >
                          <CornerUpLeft size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {paged.total === 0 && (
            <div className="h-full flex flex-col items-center justify-center p-16 text-center opacity-40">
              <Mail size={56} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-black uppercase tracking-widest text-gray-500">
                Inbox Zero
              </h3>
              <p className="text-sm font-medium mt-2 text-gray-500">
                No requests match your filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setTypeFilter("ALL");
                  setStatusFilter("ALL");
                  setActiveTab("ALL");
                }}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

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
                    clamp(p - 1, 0, Math.ceil(paged.total / pageSize) - 1),
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
                    clamp(p + 1, 0, Math.ceil(paged.total / pageSize) - 1),
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
            <Download size={14} /> Download Batch Report
          </button>
        </div>
      </div>

      {/* -------------------- VIEW MODAL -------------------- */}
      <ModalShell
        open={!!viewItem}
        onClose={() => setViewId(null)}
        title={
          viewItem
            ? `${viewItem.id} • ${TYPE_CONFIG[viewItem.type].label}`
            : "Request"
        }
        subtitle={
          viewItem
            ? `${viewItem.employeeName} (${viewItem.employeeId}) • ${viewItem.team}`
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
                {(viewItem.status === "PENDING" ||
                  viewItem.status === "ESCALATED") && (
                  <>
                    <button
                      onClick={() => {
                        quickUpdateStatus(viewItem.id, "REJECTED");
                        setViewId(null);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-white border border-gray-200 text-red-600 hover:bg-red-50"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => {
                        quickUpdateStatus(viewItem.id, "APPROVED");
                        setViewId(null);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-green-600 hover:bg-green-700 text-white"
                    >
                      Approve
                    </button>
                  </>
                )}

                <button
                  onClick={() => {
                    if (!viewItem) return;
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
            {/* Left: main details */}
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Pill className={TYPE_CONFIG[viewItem.type].pill}>
                      {TYPE_CONFIG[viewItem.type].icon}
                      {TYPE_CONFIG[viewItem.type].label}
                    </Pill>

                    <Pill className={STATUS_CONFIG[viewItem.status].pill}>
                      <span
                        className={`w-2 h-2 rounded-full ${STATUS_CONFIG[viewItem.status].dot}`}
                      />
                      {STATUS_CONFIG[viewItem.status].label}
                    </Pill>

                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${buildSlaBadge(viewItem.slaHoursRemaining).cls}`}
                    >
                      <Timer size={14} />
                      {buildSlaBadge(viewItem.slaHoursRemaining).text}
                    </span>
                  </div>

                  <div className="text-[11px] text-gray-500 font-medium">
                    Submitted:{" "}
                    <span className="font-bold text-gray-700">
                      {formatPrettyDateTime(viewItem.submittedAt)}
                    </span>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Title
                    </p>
                    <p className="text-sm font-black text-gray-900">
                      {viewItem.title}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Request Date
                    </p>
                    <p className="text-sm font-bold text-gray-700">
                      {formatPrettyDate(viewItem.requestDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Details
                    </p>
                    <p className="text-sm font-medium text-gray-700 leading-relaxed">
                      {viewItem.details}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Reason
                    </p>
                    <p className="text-sm font-medium text-gray-700 leading-relaxed">
                      “{viewItem.reason}”
                    </p>
                  </div>

                  {viewItem.attachments?.length ? (
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Attachments
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {viewItem.attachments.map((a, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-xl border border-gray-200 bg-gray-50 text-[10px] font-bold text-gray-600"
                          >
                            {a.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Validation / Notes */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  System Checks
                </p>
                <div className="space-y-2 text-[12px]">
                  <div className="flex items-center gap-2 text-green-700 font-bold">
                    <Check size={16} /> Automated validation: PASSED
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 font-medium">
                    <Info size={16} className="text-gray-400" /> Policy match:
                    OK (dummy)
                  </div>
                </div>
              </div>
            </div>

            {/* Right: timeline */}
            <div className="space-y-5">
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                  Activity Timeline
                </p>

                <div className="space-y-4">
                  {[
                    { at: viewItem.submittedAt, txt: "Request submitted" },
                    {
                      at: nowIso(),
                      txt:
                        viewItem.status === "ESCALATED"
                          ? "Escalated due to SLA risk"
                          : "Waiting for approver action",
                    },
                  ].map((t, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-[#3E3B6F]" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-gray-800">
                          {t.txt}
                        </p>
                        <p className="text-[10px] text-gray-500 font-medium">
                          {formatPrettyDateTime(t.at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#E8B4A0]/10 border border-[#E8B4A0]/30 rounded-2xl p-5">
                <div className="flex gap-3">
                  <div className="bg-[#E8B4A0]/20 p-2 rounded-xl h-fit">
                    <AlertTriangle size={18} className="text-[#3E3B6F]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-[#3E3B6F] uppercase tracking-widest">
                      Decision Tip
                    </p>
                    <p className="text-[11px] text-gray-700 font-medium leading-relaxed mt-2">
                      Check the reason + request date. If it impacts payroll,
                      prefer approving only with proof. (Dummy advice)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </ModalShell>

      {/* -------------------- EDIT MODAL -------------------- */}
      <EditRequestModal
        open={!!editItem}
        item={editItem}
        onClose={() => setEditId(null)}
        onSave={(updated) => {
          setItems((prev) =>
            prev.map((x) => (x.id === updated.id ? updated : x)),
          );
          setEditId(null);
        }}
        onDelete={(id) => {
          setEditId(null);
          setDeleteTargetId(id);
        }}
      />

      {/* -------------------- CREATE MODAL -------------------- */}
      <CreateRequestModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={(payload) => {
          createRequest(payload);
          setCreateOpen(false);
        }}
      />

      {/* -------------------- DELETE CONFIRM -------------------- */}
      <ConfirmDialog
        open={!!deleteTargetId}
        title="Delete request?"
        description="This will permanently remove the request from the inbox (dummy behavior)."
        confirmText="Delete"
        danger
        onCancel={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (!deleteTargetId) return;
          deleteRequest(deleteTargetId);
          setDeleteTargetId(null);
        }}
      />
    </div>
  );
};

/** ---------- Create Modal ---------- */

const CreateRequestModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onCreate: (payload: Partial<ApprovalItem>) => void;
}> = ({ open, onClose, onCreate }) => {
  const [type, setType] = useState<ApprovalType>("REGULARIZATION");
  const [employeeName, setEmployeeName] = useState("Ahmed Khan");
  const [employeeId, setEmployeeId] = useState("EMP-1021");
  const [team, setTeam] = useState("Engineering");
  const [requestDate, setRequestDate] = useState("2025-01-10");
  const [title, setTitle] = useState("Missing out punch");
  const [details, setDetails] = useState(
    "System shows missing out punch for shift end.",
  );
  const [reason, setReason] = useState("Network issue at punch time.");
  const [sla, setSla] = useState(24);

  useEffect(() => {
    if (!open) return;
    // reset light when opening
    setType("REGULARIZATION");
    setEmployeeName("Ahmed Khan");
    setEmployeeId("EMP-1021");
    setTeam("Engineering");
    setRequestDate("2025-01-10");
    setTitle("Missing out punch");
    setDetails("System shows missing out punch for shift end.");
    setReason("Network issue at punch time.");
    setSla(24);
  }, [open]);

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Create Approval Request"
      subtitle="Dummy flow — creates a new request in Pending status."
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
                type,
                employeeName,
                employeeId,
                team,
                avatar: employeeName
                  .split(" ")
                  .slice(0, 2)
                  .map((x) => x[0]?.toUpperCase())
                  .join(""),
                requestDate,
                title,
                details,
                reason,
                slaHoursRemaining: Number(sla),
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
        <Field label="Request Type">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as ApprovalType)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
          >
            {Object.keys(TYPE_CONFIG).map((t) => (
              <option key={t} value={t}>
                {TYPE_CONFIG[t as ApprovalType].label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Request Date">
          <input
            value={requestDate}
            onChange={(e) => setRequestDate(e.target.value)}
            type="date"
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
          />
        </Field>

        <Field label="Employee Name">
          <input
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
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

        <Field label="Team">
          <input
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
          />
        </Field>

        <Field label="SLA Hours Remaining">
          <input
            value={sla}
            onChange={(e) => setSla(Number(e.target.value))}
            type="number"
            min={1}
            max={72}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
          />
        </Field>

        <div className="md:col-span-2">
          <Field label="Title">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
            />
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field label="Details">
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
            />
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field label="Reason">
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
            />
          </Field>
        </div>
      </div>
    </ModalShell>
  );
};

/** ---------- Edit Modal ---------- */

const EditRequestModal: React.FC<{
  open: boolean;
  item: ApprovalItem | null;
  onClose: () => void;
  onSave: (item: ApprovalItem) => void;
  onDelete: (id: string) => void;
}> = ({ open, item, onClose, onSave, onDelete }) => {
  const [draft, setDraft] = useState<ApprovalItem | null>(item);

  useEffect(() => setDraft(item), [item]);

  if (!open) return null;

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={draft ? `Edit ${draft.id}` : "Edit Request"}
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
          <Field label="Type">
            <select
              value={draft.type}
              onChange={(e) =>
                setDraft({ ...draft, type: e.target.value as ApprovalType })
              }
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
            >
              {Object.keys(TYPE_CONFIG).map((t) => (
                <option key={t} value={t}>
                  {TYPE_CONFIG[t as ApprovalType].label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Status">
            <select
              value={draft.status}
              onChange={(e) =>
                setDraft({ ...draft, status: e.target.value as ApprovalStatus })
              }
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
            >
              {Object.keys(STATUS_CONFIG).map((s) => (
                <option key={s} value={s}>
                  {STATUS_CONFIG[s as ApprovalStatus].label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Request Date">
            <input
              type="date"
              value={draft.requestDate}
              onChange={(e) =>
                setDraft({ ...draft, requestDate: e.target.value })
              }
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
            />
          </Field>

          <Field label="SLA Hours Remaining">
            <input
              type="number"
              min={1}
              max={72}
              value={draft.slaHoursRemaining}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  slaHoursRemaining: Number(e.target.value),
                })
              }
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
            />
          </Field>

          <div className="md:col-span-2">
            <Field label="Title">
              <input
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label="Details">
              <textarea
                rows={3}
                value={draft.details}
                onChange={(e) =>
                  setDraft({ ...draft, details: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label="Reason">
              <textarea
                rows={3}
                value={draft.reason}
                onChange={(e) => setDraft({ ...draft, reason: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
              />
            </Field>
          </div>
        </div>
      )}
    </ModalShell>
  );
};

/** ---------- Field helper ---------- */

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
