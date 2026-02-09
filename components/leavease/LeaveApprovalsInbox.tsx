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
  User,
  Plane,
  Heart,
  Briefcase,
  Coffee,
  GraduationCap,
  Home,
  Umbrella,
  CalendarDays,
  Clock4,
  CornerUpLeft,
} from "lucide-react";

/**
 * Leave Approvals Inbox — revamped (dummy data)
 * - Leave types + tabs
 * - View/Edit/Delete + Create modal
 * - Bulk actions
 * - Pagination + filters
 */

type LeaveType =
  | "ANNUAL"
  | "SICK"
  | "MATERNITY"
  | "PATERNITY"
  | "UNPAID"
  | "COMPASSIONATE"
  | "STUDY"
  | "RELOCATION"
  | "OTHER";

type LeaveStatus =
  | "PENDING"
  | "ESCALATED"
  | "DELEGATED"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

type TabKey = "ALL" | "MY_QUEUE" | "ESCALATED" | "DELEGATED" | "COMPLETED" | "CANCELLED";

interface LeaveItem {
  id: string;
  employeeName: string;
  employeeId: string;
  avatar: string; // initials
  department: string;
  position: string;
  leaveType: LeaveType;
  status: LeaveStatus;
  startDate: string; // "2025-01-15"
  endDate: string; // "2025-01-17"
  appliedDate: string; // ISO
  returnDate: string; // "2025-01-18"
  totalDays: number;
  balanceBefore: number;
  balanceAfter: number;
  slaHoursRemaining: number;
  reason: string;
  medicalCertificate?: boolean;
  emergencyContact?: string;
  attachments?: { name: string; url?: string }[];
  delegatedTo?: string;
  escalatedLevel?: number;
  approverComments?: string;
  createdBy: string;
}

const LEAVE_TYPE_CONFIG: Record<
  LeaveType,
  { label: string; pill: string; icon: React.ReactNode; hint: string; color: string }
> = {
  ANNUAL: {
    label: "Annual Leave",
    pill: "bg-blue-50 text-blue-700 border-blue-200",
    icon: <Plane size={14} />,
    hint: "Paid vacation leave",
    color: "#3B82F6",
  },
  SICK: {
    label: "Sick Leave",
    pill: "bg-green-50 text-green-700 border-green-200",
    icon: <Heart size={14} />,
    hint: "Medical leave with/without certificate",
    color: "#10B981",
  },
  MATERNITY: {
    label: "Maternity",
    pill: "bg-pink-50 text-pink-700 border-pink-200",
    icon: <User size={14} />,
    hint: "Maternity leave (typically 14-16 weeks)",
    color: "#EC4899",
  },
  PATERNITY: {
    label: "Paternity",
    pill: "bg-cyan-50 text-cyan-700 border-cyan-200",
    icon: <Briefcase size={14} />,
    hint: "Paternity leave (typically 2 weeks)",
    color: "#06B6D4",
  },
  UNPAID: {
    label: "Unpaid Leave",
    pill: "bg-gray-50 text-gray-700 border-gray-200",
    icon: <Coffee size={14} />,
    hint: "Leave without pay",
    color: "#6B7280",
  },
  COMPASSIONATE: {
    label: "Compassionate",
    pill: "bg-purple-50 text-purple-700 border-purple-200",
    icon: <Heart size={14} />,
    hint: "Bereavement or family emergency",
    color: "#8B5CF6",
  },
  STUDY: {
    label: "Study Leave",
    pill: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: <GraduationCap size={14} />,
    hint: "Leave for exams or study purposes",
    color: "#6366F1",
  },
  RELOCATION: {
    label: "Relocation",
    pill: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <Home size={14} />,
    hint: "Leave for moving houses",
    color: "#F59E0B",
  },
  OTHER: {
    label: "Other Leave",
    pill: "bg-slate-50 text-slate-700 border-slate-200",
    icon: <Umbrella size={14} />,
    hint: "Other types of leave",
    color: "#64748B",
  },
};

const LEAVE_STATUS_CONFIG: Record<
  LeaveStatus,
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
    help: "Leave approved and scheduled.",
  },
  REJECTED: {
    label: "Rejected",
    pill: "bg-orange-50 text-orange-700 border-orange-200",
    dot: "bg-orange-500",
    help: "Leave rejected with a reason.",
  },
  CANCELLED: {
    label: "Cancelled",
    pill: "bg-slate-50 text-slate-700 border-slate-200",
    dot: "bg-slate-500",
    help: "Leave cancelled by employee.",
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

const seedDummyLeave = (): LeaveItem[] => {
  const employees = [
    { name: "Ahmed Khan", id: "EMP-1021", avatar: "AK", department: "Engineering", position: "Senior Developer" },
    { name: "Sarah Chen", id: "EMP-1043", avatar: "SC", department: "Product", position: "Product Manager" },
    { name: "James Wilson", id: "EMP-1009", avatar: "JW", department: "Operations", position: "Ops Lead" },
    { name: "Priya Das", id: "EMP-1091", avatar: "PD", department: "Engineering", position: "QA Engineer" },
    { name: "Marcus Low", id: "EMP-1066", avatar: "ML", department: "IT", position: "System Admin" },
    { name: "Elena Frost", id: "EMP-1018", avatar: "EF", department: "HR", position: "HR Manager" },
    { name: "David Park", id: "EMP-1102", avatar: "DP", department: "Marketing", position: "Marketing Lead" },
    { name: "Lisa Wong", id: "EMP-1075", avatar: "LW", department: "Sales", position: "Account Executive" },
  ];

  const types: LeaveType[] = [
    "ANNUAL",
    "SICK",
    "MATERNITY",
    "PATERNITY",
    "UNPAID",
    "COMPASSIONATE",
    "STUDY",
    "RELOCATION",
    "OTHER",
  ];

  const base = Array.from({ length: 42 }).map((_, i) => {
    const emp = employees[i % employees.length];
    const type = types[i % types.length];
    
    // Adjust status distribution
    const status: LeaveStatus =
      i === 0
        ? "ESCALATED"
        : i === 1
          ? "DELEGATED"
          : i === 2
            ? "CANCELLED"
            : i % 9 === 0
              ? "APPROVED"
              : i % 11 === 0
                ? "REJECTED"
                : "PENDING";

    // Generate dates
    const startDay = 10 + (i % 20);
    const duration = Math.max(1, (i % 7) + 1); // 1-7 days
    const startDate = `2025-01-${String(startDay).padStart(2, "0")}`;
    const endDate = `2025-01-${String(startDay + duration - 1).padStart(2, "0")}`;
    
    const sla = status === "ESCALATED" ? 4 : Math.max(1, 72 - ((i * 3) % 72));

    // Balance calculations
    const balanceBefore = type === "ANNUAL" ? 18 - (i % 12) : 0;
    const balanceAfter = Math.max(0, balanceBefore - duration);

    // Reason based on type
    const reasons = {
      ANNUAL: ["Family vacation", "Personal time off", "Travel abroad", "Staycation"],
      SICK: ["Flu symptoms", "Medical appointment", "Recovery from surgery", "Migraine"],
      MATERNITY: ["Maternity leave", "Childbirth and recovery"],
      PATERNITY: ["Newborn care", "Support spouse"],
      UNPAID: ["Personal reasons", "Extended travel"],
      COMPASSIONATE: ["Family emergency", "Bereavement"],
      STUDY: ["Final exams", "Course completion"],
      RELOCATION: ["Moving houses", "Setting up new home"],
      OTHER: ["Personal leave", "Special circumstances"],
    };

    const reason = reasons[type][i % reasons[type].length];

    return {
      id: `LEAVE-${2024 + i}`,
      employeeName: emp.name,
      employeeId: emp.id,
      avatar: emp.avatar,
      department: emp.department,
      position: emp.position,
      leaveType: type,
      status,
      startDate,
      endDate,
      appliedDate: new Date(
        Date.parse("2025-01-01T12:00:00Z") - i * 6 * 60 * 60 * 1000,
      ).toISOString(),
      returnDate: `2025-01-${String(startDay + duration).padStart(2, "0")}`,
      totalDays: duration,
      balanceBefore,
      balanceAfter,
      slaHoursRemaining: sla,
      reason,
      medicalCertificate: type === "SICK" && i % 3 === 0,
      emergencyContact: i % 4 === 0 ? "+1 (555) 123-4567" : undefined,
      attachments:
        i % 5 === 0
          ? [{ name: "medical-certificate.pdf" }, { name: "travel-itinerary.pdf" }]
          : undefined,
      delegatedTo: status === "DELEGATED" ? "Department Head (Dummy)" : undefined,
      escalatedLevel: status === "ESCALATED" ? Math.max(1, (i % 3) + 1) : undefined,
      approverComments: i % 7 === 0 ? "Please provide medical certificate" : undefined,
      createdBy: "Employee Self-Service",
    };
  });

  return base;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function buildSlaBadge(hours: number) {
  if (hours <= 8)
    return {
      text: `${hours}h left`,
      cls: "text-red-600 bg-red-50 border-red-200",
    };
  if (hours <= 24)
    return {
      text: `${hours}h left`,
      cls: "text-orange-600 bg-orange-50 border-orange-200",
    };
  return {
    text: `${hours}h left`,
    cls: "text-green-700 bg-green-50 border-green-200",
  };
}

/** ---------- Small UI helpers ---------- */

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
                : "bg-primary hover:opacity-90 text-white"
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

export const LeaveApprovalsInbox: React.FC = () => {
  const currentApproverName = "You (Manager)";

  const [items, setItems] = useState<LeaveItem[]>(seedDummyLeave());

  // tabs / filters
  const [activeTab, setActiveTab] = useState<TabKey>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | LeaveType>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | LeaveStatus>("ALL");
  const [departmentFilter, setDepartmentFilter] = useState<string>("ALL");

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

  // keyboard shortcuts
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
      if (e.key.toLowerCase() === "a") bulkUpdateStatus("APPROVED");
      if (e.key.toLowerCase() === "r") bulkUpdateStatus("REJECTED");
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedIds, viewId, editId, createOpen, deleteTargetId]);

  // Get unique departments
  const departments = useMemo(() => {
    const deptSet = new Set(items.map(item => item.department));
    return Array.from(deptSet);
  }, [items]);

  const counts = useMemo(() => {
    const all = items.length;
    const pending = items.filter((x) => x.status === "PENDING").length;
    const escalated = items.filter((x) => x.status === "ESCALATED").length;
    const delegated = items.filter((x) => x.status === "DELEGATED").length;
    const completed = items.filter(
      (x) => x.status === "APPROVED" || x.status === "REJECTED",
    ).length;
    const cancelled = items.filter((x) => x.status === "CANCELLED").length;

    const myQueue = items.filter(
      (x) => x.status === "PENDING" || x.status === "ESCALATED",
    ).length;

    return { all, pending, escalated, delegated, completed, cancelled, myQueue };
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
    } else if (activeTab === "CANCELLED") {
      list = list.filter((x) => x.status === "CANCELLED");
    }
    // else ALL - keep all

    // filter dropdowns
    if (typeFilter !== "ALL") list = list.filter((x) => x.leaveType === typeFilter);
    if (statusFilter !== "ALL") list = list.filter((x) => x.status === statusFilter);
    if (departmentFilter !== "ALL") list = list.filter((x) => x.department === departmentFilter);

    // search
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (x) =>
          x.employeeName.toLowerCase().includes(q) ||
          x.employeeId.toLowerCase().includes(q) ||
          x.id.toLowerCase().includes(q) ||
          x.department.toLowerCase().includes(q) ||
          x.position.toLowerCase().includes(q),
      );
    }

    // sorting: escalated first, then pending, then delegated, then others
    const order: Record<LeaveStatus, number> = {
      ESCALATED: 0,
      PENDING: 1,
      DELEGATED: 2,
      APPROVED: 3,
      REJECTED: 4,
      CANCELLED: 5,
    };

    list.sort((a, b) => {
      const d = order[a.status] - order[b.status];
      if (d !== 0) return d;
      // closer SLA first
      return a.slaHoursRemaining - b.slaHoursRemaining;
    });

    return list;
  }, [items, activeTab, typeFilter, statusFilter, departmentFilter, searchQuery]);

  // reset page when filters change
  useEffect(
    () => setPageIndex(0),
    [activeTab, typeFilter, statusFilter, departmentFilter, searchQuery],
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

  const bulkUpdateStatus = (status: LeaveStatus) => {
    setItems((prev) =>
      prev.map((x) => (selectedIds.has(x.id) ? { ...x, status } : x)),
    );
    setSelectedIds(new Set());
  };

  const quickUpdateStatus = (id: string, status: LeaveStatus) => {
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

  const createRequest = (payload: Partial<LeaveItem>) => {
    const next: LeaveItem = {
      id: `LEAVE-${Math.floor(3000 + Math.random() * 700)}`,
      employeeName: payload.employeeName ?? "New Employee",
      employeeId: payload.employeeId ?? "EMP-0000",
      avatar: payload.avatar ?? "NE",
      department: payload.department ?? "Unknown",
      position: payload.position ?? "Staff",
      leaveType: payload.leaveType ?? "ANNUAL",
      status: "PENDING",
      startDate: payload.startDate ?? "2025-01-15",
      endDate: payload.endDate ?? "2025-01-17",
      appliedDate: nowIso(),
      returnDate: payload.returnDate ?? "2025-01-18",
      totalDays: payload.totalDays ?? 3,
      balanceBefore: payload.balanceBefore ?? 15,
      balanceAfter: payload.balanceAfter ?? 12,
      slaHoursRemaining: payload.slaHoursRemaining ?? 48,
      reason: payload.reason ?? "Personal reasons",
      medicalCertificate: payload.medicalCertificate ?? false,
      emergencyContact: payload.emergencyContact,
      attachments: payload.attachments ?? [],
      createdBy: currentApproverName,
    };
    setItems((prev) => [next, ...prev]);
  };

  /** ---------- Render ---------- */

  const GlobalStats = () => {
    const overdue = items.filter(
      (x) =>
        x.slaHoursRemaining <= 8 &&
        (x.status === "PENDING" || x.status === "ESCALATED"),
    ).length;
    
    const onLeave = items.filter(x => 
      x.status === "APPROVED" && 
      new Date(x.startDate) <= new Date() && 
      new Date(x.endDate) >= new Date()
    ).length;

    const avg = (() => {
      const arr = items
        .filter((x) => x.status === "APPROVED" || x.status === "REJECTED")
        .slice(0, 12);
      if (!arr.length) return "—";
      return "6.5h";
    })();

    return (
      <div className="flex items-center gap-4 mt-1">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          Leave Stats:
        </span>
        <div className="flex gap-3 flex-wrap">
          <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
            <CalendarDays size={12} className="text-blue-500" /> Total: {items.length}
          </span>
          <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
            <AlertTriangle size={12} className="text-red-500" /> Critical SLA: {overdue}
          </span>
          <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
            <Clock4 size={12} className="text-green-500" /> Currently on Leave: {onLeave}
          </span>
          <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
            <Clock size={12} className="text-purple-500" /> Avg Response: {avg}
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
            Leave Approvals Inbox
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Review leave requests, check team coverage, and manage approvals efficiently.
          </p>
          <GlobalStats />
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-end">
          <div className="relative group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary"
              size={16}
            />
            <input
              type="text"
              placeholder="Search name / employee ID / request ID / department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium w-[320px] outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
            />
          </div>

          {/* Department filter */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 outline-none focus:ring-4 focus:ring-primary/5"
          >
            <option value="ALL">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 outline-none focus:ring-4 focus:ring-primary/5"
          >
            <option value="ALL">All Leave Types</option>
            {Object.keys(LEAVE_TYPE_CONFIG).map((t) => (
              <option key={t} value={t}>
                {LEAVE_TYPE_CONFIG[t as LeaveType].label}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 outline-none focus:ring-4 focus:ring-primary/5"
          >
            <option value="ALL">All Status</option>
            {Object.keys(LEAVE_STATUS_CONFIG).map((s) => (
              <option key={s} value={s}>
                {LEAVE_STATUS_CONFIG[s as LeaveStatus].label}
              </option>
            ))}
          </select>

          <IconBtn title="Settings">
            <Settings2 size={18} />
          </IconBtn>

          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-xs font-black shadow-lg hover:opacity-90 transition-all"
          >
            <Plus size={14} /> Create Leave Request
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-2xl p-1 mb-4 shadow-sm shrink-0 overflow-x-auto">
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
          {
            id: "CANCELLED" as const,
            label: "Cancelled",
            count: counts.cancelled,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2 text-xs font-black rounded-xl transition-all ${
              activeTab === tab.id
                ? "bg-primary text-white shadow-lg"
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
        <div className="mb-4 p-3 bg-primary rounded-2xl flex items-center justify-between animate-in slide-in-from-top-4 duration-200 shadow-xl shadow-primary/20">
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
                setItems((prev) =>
                  prev.map((x) =>
                    selectedIds.has(x.id)
                      ? {
                          ...x,
                          status: "DELEGATED",
                          delegatedTo: "HR Manager (Dummy)",
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
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-20 bg-gray-50/90 backdrop-blur-md border-b border-gray-100">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-4 w-12">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={(e) => toggleSelectAllVisible(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </th>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Leave Type</th>
                <th className="px-6 py-4">Period</th>
                <th className="px-6 py-4 text-center">Duration</th>
                <th className="px-6 py-4 text-center">SLA</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {paged.rows.map((item) => {
                const type = LEAVE_TYPE_CONFIG[item.leaveType];
                const status = LEAVE_STATUS_CONFIG[item.status];
                const sla = buildSlaBadge(item.slaHoursRemaining);
                const isSelected = selectedIds.has(item.id);

                return (
                  <tr
                    key={item.id}
                    className={`group hover:bg-gray-50/70 transition-all ${isSelected ? "bg-primary/5" : ""}`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(item.id)}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[10px] font-black shadow-lg"
                          style={{ backgroundColor: type.color }}
                        >
                          {item.avatar}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-gray-800 truncate">
                            {item.employeeName}
                          </p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase truncate">
                            {item.employeeId} • {item.department}
                          </p>
                          <p className="text-[9px] text-gray-500 font-medium truncate">
                            {item.position}
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
                      {item.medicalCertificate && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-red-50 text-red-700 text-[8px] font-black rounded-full">
                          MEDICAL CERT
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-[11px] font-bold text-gray-700">
                        {formatPrettyDate(item.startDate)} → {formatPrettyDate(item.endDate)}
                      </div>
                      <div className="text-[9px] text-gray-500 font-medium">
                        Applied: {formatPrettyDateTime(item.appliedDate)}
                      </div>
                      <div className="text-[9px] text-gray-400 font-medium italic truncate mt-1">
                        "{item.reason}"
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="text-lg font-black text-gray-800">
                          {item.totalDays}
                        </span>
                        <span className="text-[9px] text-gray-500 font-bold uppercase">
                          Days
                        </span>
                      </div>
                      {item.leaveType === "ANNUAL" && (
                        <div className="text-[9px] text-gray-500 font-medium mt-1">
                          Bal: {item.balanceBefore} → {item.balanceAfter}
                        </div>
                      )}
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
                          To: {item.delegatedTo}
                        </div>
                      )}
                      {item.status === "ESCALATED" && item.escalatedLevel && (
                        <div className="text-[9px] text-red-600 font-bold mt-1">
                          Level: {item.escalatedLevel}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 transition-all">
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
                          className="p-2 bg-white border border-gray-200 text-gray-500 rounded-xl hover:text-primary hover:border-primary transition-all"
                          title="View Details"
                        >
                          <ExternalLink size={14} />
                        </button>

                        <button
                          onClick={() => setEditId(item.id)}
                          className="p-2 bg-white border border-gray-200 text-gray-500 rounded-xl hover:text-primary hover:border-primary transition-all"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>

                        <button
                          className="p-2 bg-white border border-gray-200 text-gray-500 rounded-xl hover:text-orange-600 hover:border-orange-300 transition-all"
                          title="Request Changes"
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
              <Calendar size={56} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-black uppercase tracking-widest text-gray-500">
                No Leave Requests
              </h3>
              <p className="text-sm font-medium mt-2 text-gray-500">
                No leave requests match your filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setTypeFilter("ALL");
                  setStatusFilter("ALL");
                  setDepartmentFilter("ALL");
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
                className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-primary transition-all disabled:opacity-40"
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
                className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-primary transition-all disabled:opacity-40"
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
            <Download size={14} /> Download Leave Report
          </button>
        </div>
      </div>

      {/* -------------------- VIEW MODAL -------------------- */}
      <ModalShell
        open={!!viewItem}
        onClose={() => setViewId(null)}
        title={
          viewItem
            ? `${viewItem.id} • ${LEAVE_TYPE_CONFIG[viewItem.leaveType].label}`
            : "Leave Request"
        }
        subtitle={
          viewItem
            ? `${viewItem.employeeName} (${viewItem.employeeId}) • ${viewItem.department} `
            : undefined
        }
        size="xl"
        footer={
          viewItem ? (
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
                <Info size={14} className="text-gray-400" />
                {LEAVE_STATUS_CONFIG[viewItem.status].help}
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
                  className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-primary hover:opacity-90 text-white"
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
                <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
                  <div className="flex items-center gap-2">
                    <Pill className={LEAVE_TYPE_CONFIG[viewItem.leaveType].pill}>
                      {LEAVE_TYPE_CONFIG[viewItem.leaveType].icon}
                      {LEAVE_TYPE_CONFIG[viewItem.leaveType].label}
                    </Pill>

                    <Pill className={LEAVE_STATUS_CONFIG[viewItem.status].pill}>
                      <span
                        className={`w-2 h-2 rounded-full ${LEAVE_STATUS_CONFIG[viewItem.status].dot}`}
                      />
                      {LEAVE_STATUS_CONFIG[viewItem.status].label}
                    </Pill>

                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${buildSlaBadge(viewItem.slaHoursRemaining).cls}`}
                    >
                      <Timer size={14} />
                      {buildSlaBadge(viewItem.slaHoursRemaining).text}
                    </span>
                  </div>

                  <div className="text-[11px] text-gray-500 font-medium">
                    Applied:{" "}
                    <span className="font-bold text-gray-700">
                      {formatPrettyDateTime(viewItem.appliedDate)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Leave Period
                    </p>
                    <p className="text-sm font-black text-gray-900">
                      {formatPrettyDate(viewItem.startDate)} → {formatPrettyDate(viewItem.endDate)}
                    </p>
                    <p className="text-[11px] text-gray-500 font-medium">
                      Return Date: {formatPrettyDate(viewItem.returnDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Duration
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-gray-900">
                        {viewItem.totalDays}
                      </span>
                      <span className="text-sm font-bold text-gray-600">
                        day{viewItem.totalDays !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {viewItem.leaveType === "ANNUAL" && (
                    <>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          Balance Before
                        </p>
                        <p className="text-lg font-black text-gray-900">
                          {viewItem.balanceBefore} days
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          Balance After
                        </p>
                        <p className="text-lg font-black text-gray-900">
                          {viewItem.balanceAfter} days
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Reason for Leave
                    </p>
                    <p className="text-sm font-medium text-gray-700 leading-relaxed p-3 bg-gray-50 rounded-xl">
                      {viewItem.reason}
                    </p>
                  </div>

                  {viewItem.emergencyContact && (
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Emergency Contact
                      </p>
                      <p className="text-sm font-medium text-gray-700">
                        {viewItem.emergencyContact}
                      </p>
                    </div>
                  )}

                  {viewItem.medicalCertificate && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={16} className="text-red-600" />
                        <p className="text-sm font-bold text-red-700">
                          Medical Certificate Required
                        </p>
                      </div>
                    </div>
                  )}

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

                  {viewItem.approverComments && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                      <p className="text-[10px] font-black text-yellow-800 uppercase tracking-widest">
                        Approver Comments
                      </p>
                      <p className="text-sm font-medium text-yellow-700 mt-1">
                        {viewItem.approverComments}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: timeline and team info */}
            <div className="space-y-5">
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                  Approval Timeline
                </p>

                <div className="space-y-4">
                  {[
                    { at: viewItem.appliedDate, txt: "Leave request submitted" },
                    {
                      at: nowIso(),
                      txt:
                        viewItem.status === "ESCALATED"
                          ? "Escalated due to SLA risk"
                          : viewItem.status === "DELEGATED"
                            ? `Delegated to ${viewItem.delegatedTo}`
                            : "Waiting for approver action",
                    },
                  ].map((t, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
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

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                <div className="flex gap-3">
                  <div className="bg-blue-100 p-2 rounded-xl h-fit">
                    <Calendar size={18} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-blue-800 uppercase tracking-widest">
                      Team Coverage Check
                    </p>
                    <p className="text-[11px] text-blue-700 font-medium leading-relaxed mt-2">
                      {viewItem.totalDays > 5 
                        ? "Long leave period - check team capacity and handover requirements."
                        : "Standard leave duration - ensure coverage is arranged."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </ModalShell>

      {/* -------------------- EDIT MODAL -------------------- */}
      <EditLeaveModal
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
      <CreateLeaveModal
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
        title="Delete leave request?"
        description="This will permanently remove the leave request from the system (dummy behavior)."
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

const CreateLeaveModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onCreate: (payload: Partial<LeaveItem>) => void;
}> = ({ open, onClose, onCreate }) => {
  const [type, setType] = useState<LeaveType>("ANNUAL");
  const [employeeName, setEmployeeName] = useState("Ahmed Khan");
  const [employeeId, setEmployeeId] = useState("EMP-1021");
  const [department, setDepartment] = useState("Engineering");
  const [position, setPosition] = useState("Senior Developer");
  const [startDate, setStartDate] = useState("2025-01-15");
  const [endDate, setEndDate] = useState("2025-01-17");
  const [totalDays, setTotalDays] = useState(3);
  const [reason, setReason] = useState("Family vacation");
  const [medicalCertificate, setMedicalCertificate] = useState(false);
  const [sla, setSla] = useState(48);
  const [balanceBefore, setBalanceBefore] = useState(18);

  useEffect(() => {
    if (!open) return;
    setType("ANNUAL");
    setEmployeeName("Ahmed Khan");
    setEmployeeId("EMP-1021");
    setDepartment("Engineering");
    setPosition("Senior Developer");
    setStartDate("2025-01-15");
    setEndDate("2025-01-17");
    setTotalDays(3);
    setReason("Family vacation");
    setMedicalCertificate(false);
    setSla(48);
    setBalanceBefore(18);
  }, [open]);

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Create Leave Request"
      subtitle="Dummy flow — creates a new leave request in Pending status."
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
                leaveType: type,
                employeeName,
                employeeId,
                department,
                position,
                avatar: employeeName
                  .split(" ")
                  .slice(0, 2)
                  .map((x) => x[0]?.toUpperCase())
                  .join(""),
                startDate,
                endDate,
                returnDate: endDate,
                totalDays: Number(totalDays),
                reason,
                medicalCertificate,
                slaHoursRemaining: Number(sla),
                balanceBefore: Number(balanceBefore),
                balanceAfter: Number(balanceBefore) - Number(totalDays),
              })
            }
            className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-primary hover:opacity-90 text-white"
          >
            Create
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Leave Type">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as LeaveType)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-primary/5"
          >
            {Object.keys(LEAVE_TYPE_CONFIG).map((t) => (
              <option key={t} value={t}>
                {LEAVE_TYPE_CONFIG[t as LeaveType].label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Employee Name">
          <input
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 outline-none focus:ring-4 focus:ring-primary/5"
          />
        </Field>

        <Field label="Employee ID">
          <input
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 outline-none focus:ring-4 focus:ring-primary/5"
          />
        </Field>

        <Field label="Department">
          <input
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 outline-none focus:ring-4 focus:ring-primary/5"
          />
        </Field>

        <Field label="Position">
          <input
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 outline-none focus:ring-4 focus:ring-primary/5"
          />
        </Field>

        <Field label="Start Date">
          <input
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            type="date"
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-primary/5"
          />
        </Field>

        <Field label="End Date">
          <input
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            type="date"
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-primary/5"
          />
        </Field>

        <Field label="Total Days">
          <input
            value={totalDays}
            onChange={(e) => setTotalDays(Number(e.target.value))}
            type="number"
            min={1}
            max={30}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-primary/5"
          />
        </Field>

        <Field label="SLA Hours Remaining">
          <input
            value={sla}
            onChange={(e) => setSla(Number(e.target.value))}
            type="number"
            min={1}
            max={168}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-primary/5"
          />
        </Field>

        {type === "ANNUAL" && (
          <Field label="Balance Before (days)">
            <input
              value={balanceBefore}
              onChange={(e) => setBalanceBefore(Number(e.target.value))}
              type="number"
              min={0}
              max={30}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-primary/5"
            />
          </Field>
        )}

        {type === "SICK" && (
          <div className="md:col-span-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={medicalCertificate}
                onChange={(e) => setMedicalCertificate(e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-700">
                Requires Medical Certificate
              </span>
            </label>
          </div>
        )}

        <div className="md:col-span-2">
          <Field label="Reason">
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 outline-none focus:ring-4 focus:ring-primary/5"
            />
          </Field>
        </div>
      </div>
    </ModalShell>
  );
};

/** ---------- Edit Modal ---------- */

const EditLeaveModal: React.FC<{
  open: boolean;
  item: LeaveItem | null;
  onClose: () => void;
  onSave: (item: LeaveItem) => void;
  onDelete: (id: string) => void;
}> = ({ open, item, onClose, onSave, onDelete }) => {
  const [draft, setDraft] = useState<LeaveItem | null>(item);

  useEffect(() => setDraft(item), [item]);

  if (!open) return null;

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={draft ? `Edit ${draft.id}` : "Edit Leave Request"}
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
              className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-primary hover:opacity-90 text-white"
            >
              Save
            </button>
          </div>
        </div>
      }
    >
      {draft && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Leave Type">
            <select
              value={draft.leaveType}
              onChange={(e) =>
                setDraft({ ...draft, leaveType: e.target.value as LeaveType })
              }
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-primary/5"
            >
              {Object.keys(LEAVE_TYPE_CONFIG).map((t) => (
                <option key={t} value={t}>
                  {LEAVE_TYPE_CONFIG[t as LeaveType].label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Status">
            <select
              value={draft.status}
              onChange={(e) =>
                setDraft({ ...draft, status: e.target.value as LeaveStatus })
              }
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-primary/5"
            >
              {Object.keys(LEAVE_STATUS_CONFIG).map((s) => (
                <option key={s} value={s}>
                  {LEAVE_STATUS_CONFIG[s as LeaveStatus].label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Start Date">
            <input
              type="date"
              value={draft.startDate}
              onChange={(e) =>
                setDraft({ ...draft, startDate: e.target.value })
              }
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-primary/5"
            />
          </Field>

          <Field label="End Date">
            <input
              type="date"
              value={draft.endDate}
              onChange={(e) =>
                setDraft({ ...draft, endDate: e.target.value })
              }
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-primary/5"
            />
          </Field>

          <Field label="Total Days">
            <input
              type="number"
              min={1}
              max={30}
              value={draft.totalDays}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  totalDays: Number(e.target.value),
                })
              }
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-primary/5"
            />
          </Field>

          <Field label="SLA Hours Remaining">
            <input
              type="number"
              min={1}
              max={168}
              value={draft.slaHoursRemaining}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  slaHoursRemaining: Number(e.target.value),
                })
              }
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-primary/5"
            />
          </Field>

          {draft.leaveType === "ANNUAL" && (
            <>
              <Field label="Balance Before">
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={draft.balanceBefore}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      balanceBefore: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-primary/5"
                />
              </Field>

              <Field label="Balance After">
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={draft.balanceAfter}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      balanceAfter: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-primary/5"
                />
              </Field>
            </>
          )}

          <div className="md:col-span-2">
            <Field label="Reason">
              <textarea
                rows={3}
                value={draft.reason}
                onChange={(e) =>
                  setDraft({ ...draft, reason: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 outline-none focus:ring-4 focus:ring-primary/5"
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