import React, { useMemo, useState } from "react";
import {
  Users,
  Calendar,
  Clock,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ArrowRight,
  FileText,
  Search,
  Plus,
  X,
  Edit3,
  Undo2,
  Download,
  Trash2,
  AlertTriangle,
  UserCheck,
  UserX,
  Zap,
  MoreVertical,
  MessageSquare,
  Briefcase,
  MapPin,
} from "lucide-react";

type ShiftSwapStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
type ShiftType = "MORNING" | "AFTERNOON" | "NIGHT" | "FLEXI";

interface ShiftSwapRequest {
  id: string;
  swapDate: string; // Date to swap
  swapWithDate?: string; // Date to work instead (optional)
  shiftType: ShiftType;
  reason: string;
  swapWithEmployee?: {
    id: string;
    name: string;
    department: string;
  };
  requester: {
    id: string;
    name: string;
    department: string;
  };
  currentShift: {
    start: string;
    end: string;
    location?: string;
  };
  requestedShift?: {
    start: string;
    end: string;
    location?: string;
  };
  status: ShiftSwapStatus;
  approver?: string;
  decisionNote?: string;
  createdAt?: string;
  updatedAt?: string;
}

type ModalMode = "create" | "view" | "edit" | "delete" | "offer";

const initialData: ShiftSwapRequest[] = [
  { 
    id: "SS-4001", 
    swapDate: "2025-01-15", 
    swapWithDate: "2025-01-17",
    shiftType: "MORNING", 
    reason: "Medical appointment scheduled", 
    requester: { id: "EMP-1001", name: "Alex Johnson", department: "Engineering" },
    swapWithEmployee: { id: "EMP-1005", name: "Sarah Miller", department: "Support" },
    currentShift: { start: "09:00", end: "18:00", location: "HQ Main" },
    requestedShift: { start: "13:00", end: "22:00", location: "HQ Main" },
    status: "APPROVED", 
    approver: "Michael Chen",
    decisionNote: "Approved after team coordination",
    createdAt: "2025-01-10 14:30",
    updatedAt: "2025-01-11 10:15"
  },
  { 
    id: "SS-4002", 
    swapDate: "2025-01-18", 
    shiftType: "NIGHT", 
    reason: "Family event - cousin's wedding", 
    requester: { id: "EMP-1002", name: "Priya Sharma", department: "Support" },
    currentShift: { start: "22:00", end: "06:00", location: "Data Center" },
    status: "PENDING", 
    createdAt: "2025-01-12 09:45"
  },
  { 
    id: "SS-4003", 
    swapDate: "2025-01-14", 
    swapWithDate: "2025-01-16",
    shiftType: "AFTERNOON", 
    reason: "Need to attend university exam", 
    requester: { id: "EMP-1003", name: "David Wilson", department: "Operations" },
    swapWithEmployee: { id: "EMP-1007", name: "James Lee", department: "Operations" },
    currentShift: { start: "13:00", end: "21:00", location: "West Branch" },
    requestedShift: { start: "09:00", end: "17:00", location: "West Branch" },
    status: "REJECTED", 
    approver: "Robert Kim",
    decisionNote: "Insufficient notice period (less than 48 hours)",
    createdAt: "2025-01-09 16:20",
    updatedAt: "2025-01-10 11:30"
  },
  { 
    id: "SS-4004", 
    swapDate: "2025-01-20", 
    shiftType: "MORNING", 
    reason: "Car servicing appointment", 
    requester: { id: "EMP-1004", name: "Maria Garcia", department: "HR" },
    swapWithEmployee: { id: "EMP-1006", name: "Tom Baker", department: "HR" },
    currentShift: { start: "08:30", end: "17:30", location: "HQ Main" },
    status: "APPROVED", 
    approver: "Lisa Wang",
    decisionNote: "Swapped within same department",
    createdAt: "2025-01-13 11:10",
    updatedAt: "2025-01-14 09:45"
  },
  { 
    id: "SS-4005", 
    swapDate: "2025-01-19", 
    swapWithDate: "2025-01-22",
    shiftType: "FLEXI", 
    reason: "Volunteer work at community center", 
    requester: { id: "EMP-1001", name: "Alex Johnson", department: "Engineering" },
    currentShift: { start: "10:00", end: "19:00", location: "Remote" },
    status: "PENDING", 
    createdAt: "2025-01-14 15:30"
  },

];

const SHIFT_TYPES = [
  { value: "MORNING", label: "Morning Shift", color: "bg-blue-50 text-blue-600 border-blue-100", hours: "09:00 - 18:00" },
  { value: "AFTERNOON", label: "Afternoon Shift", color: "bg-purple-50 text-purple-600 border-purple-100", hours: "13:00 - 22:00" },
  { value: "NIGHT", label: "Night Shift", color: "bg-indigo-50 text-indigo-600 border-indigo-100", hours: "22:00 - 06:00" },
  { value: "FLEXI", label: "Flexi Shift", color: "bg-amber-50 text-amber-600 border-amber-100", hours: "Flexible" },
] as const;

const AVAILABLE_EMPLOYEES = [
  { id: "EMP-1005", name: "Sarah Miller", department: "Support", shift: "AFTERNOON" },
  { id: "EMP-1007", name: "James Lee", department: "Operations", shift: "MORNING" },
  { id: "EMP-1006", name: "Tom Baker", department: "HR", shift: "MORNING" },
  { id: "EMP-1009", name: "Emma Davis", department: "Engineering", shift: "FLEXI" },
  { id: "EMP-1010", name: "Ryan Brown", department: "Support", shift: "NIGHT" },
];

const nowStamp = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });

const nextId = (existing: ShiftSwapRequest[]) => {
  const nums = existing
    .map((x) => Number(x.id.replace("SS-", "")))
    .filter((n) => Number.isFinite(n));
  const max = nums.length ? Math.max(...nums) : 4000;
  return `SS-${max + 1}`;
};



export const ShiftSwapRequest: React.FC = () => {
  const [requests, setRequests] = useState<ShiftSwapRequest[]>(initialData);
  const [activeTab, setActiveTab] = useState<ShiftSwapStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    swapDate: "",
    swapWithDate: "",
    shiftType: "MORNING" as ShiftType,
    reason: "",
    swapWithEmployeeId: "",
    location: "HQ Main",
    shiftHours: "09:00-18:00",
  });

  const selected = useMemo(() => requests.find((r) => r.id === selectedId) || null, [requests, selectedId]);

  const stats = useMemo(() => {
    const pending = requests.filter((x) => x.status === "PENDING").length;
    const approved = requests.filter((x) => x.status === "APPROVED").length;
    const rejected = requests.filter((x) => x.status === "REJECTED").length;
    const cancelled = requests.filter((x) => x.status === "CANCELLED").length;
    const successRate = requests.length > 0 ? Math.round((approved / requests.length) * 100) : 0;
    
    return { 
      pending, 
      approved, 
      rejected, 
      cancelled,
      successRate,
      monthlyLimit: 3,
      used: approved + pending,
      remaining: 3 - (approved + pending)
    };
  }, [requests]);

  const filteredRequests = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return requests.filter((req) => {
      const matchesTab = activeTab === "ALL" || req.status === activeTab;
      const matchesSearch =
        !q ||
        req.id.toLowerCase().includes(q) ||
        req.reason.toLowerCase().includes(q) ||
        req.requester.name.toLowerCase().includes(q) ||
        (req.swapWithEmployee?.name || "").toLowerCase().includes(q) ||
        req.shiftType.toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }, [requests, activeTab, searchQuery]);

  const statusDot = (s: ShiftSwapStatus) => {
    switch(s) {
      case "PENDING": return "bg-orange-400";
      case "APPROVED": return "bg-green-500";
      case "REJECTED": return "bg-red-500";
      case "CANCELLED": return "bg-gray-400";
      default: return "bg-gray-300";
    }
  };
  
  const statusText = (s: ShiftSwapStatus) => {
    switch(s) {
      case "PENDING": return "text-orange-500";
      case "APPROVED": return "text-green-600";
      case "REJECTED": return "text-red-600";
      case "CANCELLED": return "text-gray-500";
      default: return "text-gray-400";
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedId(null);
  };

  const openCreate = () => {
    const today = new Date().toISOString().split("T")[0];
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    
    setModalMode("create");
    setForm({
      swapDate: nextWeek,
      swapWithDate: "",
      shiftType: "MORNING",
      reason: "",
      swapWithEmployeeId: "",
      location: "HQ Main",
      shiftHours: "09:00-18:00",
    });
    setModalOpen(true);
  };

  const openView = (id: string) => {
    setSelectedId(id);
    setModalMode("view");
    setModalOpen(true);
  };

  const openEdit = (id: string) => {
    const item = requests.find((x) => x.id === id);
    if (!item) return;
    
    setSelectedId(id);
    setModalMode("edit");
    setForm({
      swapDate: item.swapDate,
      swapWithDate: item.swapWithDate || "",
      shiftType: item.shiftType,
      reason: item.reason,
      swapWithEmployeeId: item.swapWithEmployee?.id || "",
      location: item.currentShift.location || "HQ Main",
      shiftHours: `${item.currentShift.start}-${item.currentShift.end}`,
    });
    setModalOpen(true);
  };

  const openDelete = (id: string) => {
    setSelectedId(id);
    setModalMode("delete");
    setModalOpen(true);
  };

  const openOffer = (id: string) => {
    setSelectedId(id);
    setModalMode("offer");
    setModalOpen(true);
  };

  const createRequest = () => {
    if (!form.swapDate || !form.reason.trim()) return;

    const [start, end] = form.shiftHours.split("-");
    
    const newRequest: ShiftSwapRequest = {
      id: nextId(requests),
      swapDate: form.swapDate,
      swapWithDate: form.swapWithDate || undefined,
      shiftType: form.shiftType,
      reason: form.reason.trim(),
      requester: { id: "EMP-1001", name: "Alex Johnson", department: "Engineering" }, // Current user
      swapWithEmployee: form.swapWithEmployeeId 
        ? AVAILABLE_EMPLOYEES.find(e => e.id === form.swapWithEmployeeId)
        : undefined,
      currentShift: {
        start: start,
        end: end,
        location: form.location,
      },
      status: form.swapWithEmployeeId ? "PENDING" : "PENDING", // If no employee selected, it's open for anyone
      createdAt: nowStamp(),
    };

    setRequests((prev) => [newRequest, ...prev]);
    closeModal();
  };

  const updateRequest = () => {
    if (!selected) return;
    if (!form.swapDate || !form.reason.trim()) return;

    const [start, end] = form.shiftHours.split("-");
    
    setRequests((prev) =>
      prev.map((r) =>
        r.id !== selected.id
          ? r
          : {
              ...r,
              swapDate: form.swapDate,
              swapWithDate: form.swapWithDate || undefined,
              shiftType: form.shiftType,
              reason: form.reason.trim(),
              swapWithEmployee: form.swapWithEmployeeId 
                ? AVAILABLE_EMPLOYEES.find(e => e.id === form.swapWithEmployeeId)
                : undefined,
              currentShift: {
                ...r.currentShift,
                start: start,
                end: end,
                location: form.location,
              },
              updatedAt: nowStamp(),
            }
      )
    );

    closeModal();
  };

  const deleteRequest = () => {
    if (!selected) return;
    
    // If cancelling, update status instead of deleting
    if (selected.status === "PENDING") {
      setRequests((prev) =>
        prev.map((r) =>
          r.id !== selected.id
            ? r
            : {
                ...r,
                status: "CANCELLED",
                updatedAt: nowStamp(),
                decisionNote: "Cancelled by requester",
              }
        )
      );
    } else {
      setRequests((prev) => prev.filter((r) => r.id !== selected.id));
    }
    
    closeModal();
  };

  const acceptOffer = (requestId: string, employeeId: string) => {
    const employee = AVAILABLE_EMPLOYEES.find(e => e.id === employeeId);
    if (!employee) return;

    setRequests((prev) =>
      prev.map((r) =>
        r.id !== requestId
          ? r
          : {
              ...r,
              swapWithEmployee: employee,
              status: "PENDING",
              updatedAt: nowStamp(),
            }
      )
    );
    
    closeModal();
  };

  const resubmit = (id: string) => {
    const item = requests.find((x) => x.id === id);
    if (!item) return;

    const copy: ShiftSwapRequest = {
      ...item,
      id: nextId(requests),
      status: "PENDING",
      swapWithEmployee: undefined,
      decisionNote: undefined,
      approver: undefined,
      createdAt: nowStamp(),
      updatedAt: undefined,
    };

    setRequests((prev) => [copy, ...prev]);
  };

  const ActionBtn = ({
    title,
    onClick,
    icon,
    tone = "gray",
  }: {
    title: string;
    onClick: () => void;
    icon: React.ReactNode;
    tone?: "gray" | "blue" | "red" | "indigo" | "green" | "orange";
  }) => {
    const toneCls = {
      gray: "text-gray-400 hover:text-gray-700 hover:bg-gray-50",
      blue: "text-gray-400 hover:text-blue-600 hover:bg-blue-50",
      indigo: "text-gray-400 hover:text-indigo-600 hover:bg-indigo-50",
      green: "text-gray-400 hover:text-green-600 hover:bg-green-50",
      red: "text-gray-400 hover:text-red-600 hover:bg-red-50",
      orange: "text-gray-400 hover:text-orange-600 hover:bg-orange-50",
    };
    return (
      <button type="button" title={title} onClick={onClick} className={`p-2 rounded-lg transition-all ${toneCls[tone]} inline-flex items-center justify-center`}>
        {icon}
      </button>
    );
  };

  const renderActions = (req: ShiftSwapRequest) => {
    // PENDING with no swap partner => View, Edit, Cancel, Offer
    if (req.status === "PENDING" && !req.swapWithEmployee) {
      return (
        <>
          <ActionBtn title="View" onClick={() => openView(req.id)} icon={<FileText size={16} />} tone="indigo" />
          <ActionBtn title="Edit" onClick={() => openEdit(req.id)} icon={<Edit3 size={16} />} tone="blue" />
          <ActionBtn title="Cancel" onClick={() => openDelete(req.id)} icon={<Trash2 size={16} />} tone="red" />
          <ActionBtn title="Find Swap" onClick={() => openOffer(req.id)} icon={<Users size={16} />} tone="green" />
        </>
      );
    }

    // PENDING with swap partner => View, Cancel
    if (req.status === "PENDING") {
      return (
        <>
          <ActionBtn title="View" onClick={() => openView(req.id)} icon={<FileText size={16} />} tone="indigo" />
          <ActionBtn title="Cancel" onClick={() => openDelete(req.id)} icon={<Trash2 size={16} />} tone="red" />
        </>
      );
    }

    // REJECTED => View, Resubmit, Delete
    if (req.status === "REJECTED") {
      return (
        <>
          <ActionBtn title="View" onClick={() => openView(req.id)} icon={<FileText size={16} />} tone="indigo" />
          <ActionBtn title="Resubmit" onClick={() => resubmit(req.id)} icon={<Undo2 size={16} />} tone="blue" />
          <ActionBtn title="Delete" onClick={() => openDelete(req.id)} icon={<Trash2 size={16} />} tone="red" />
        </>
      );
    }

    // CANCELLED => View, Delete
    if (req.status === "CANCELLED") {
      return (
        <>
          <ActionBtn title="View" onClick={() => openView(req.id)} icon={<FileText size={16} />} tone="indigo" />
          <ActionBtn title="Delete" onClick={() => openDelete(req.id)} icon={<Trash2 size={16} />} tone="red" />
        </>
      );
    }

    // APPROVED => View, Download
    return (
      <>
        <ActionBtn title="View" onClick={() => openView(req.id)} icon={<FileText size={16} />} tone="indigo" />
        <ActionBtn title="Download Approval" onClick={() => console.log("Download", req.id)} icon={<Download size={16} />} tone="green" />
      </>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <RefreshCw className="text-[#3E3B6F]" size={28} /> Shift Swap Requests
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Exchange shifts with colleagues for better work-life balance</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus size={18} /> Request Swap
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Pending</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-orange-500">{stats.pending}</span>
            <span className="text-xs font-bold text-gray-400">SWAPS</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Approved</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-green-600">{stats.approved}</span>
            <span className="text-xs font-bold text-gray-400">SWAPS</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Success Rate</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#3E3B6F]">{stats.successRate}%</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Monthly Used</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-600">{stats.used}</span>
            <span className="text-xs font-bold text-gray-400">/{stats.monthlyLimit}</span>
          </div>
        </div>
        <div className="bg-primary-gradient p-5 rounded-2xl shadow-xl shadow-[#3E3B6F]/20 text-white">
          <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">Remaining Swaps</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#E8D5A3]">{stats.remaining}</span>
            <span className="text-xs font-bold text-white/50">Available</span>
          </div>
        </div>
      </div>

      {/* FILTER & TABS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex p-1 bg-gray-50 rounded-xl">
          {(["ALL", "PENDING", "APPROVED", "REJECTED", "CANCELLED"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === tab ? "bg-white shadow-sm text-[#3E3B6F]" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
          <input
            type="text"
            placeholder="Search by ID, reason, or employee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-transparent border-none focus:ring-0 outline-none"
          />
        </div>
      </div>

      {/* REQUESTS TABLE */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-8 py-5">Swap Date</th>
                <th className="px-6 py-5">Shift Details</th>
                <th className="px-6 py-5">Swap Partner</th>
                <th className="px-6 py-5">Reason</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50/80 transition-all cursor-default">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800 tabular-nums">{formatDate(req.swapDate)}</p>
                        {req.swapWithDate && (
                          <p className="text-[10px] font-bold text-green-600 mt-1">
                            ← {formatDate(req.swapWithDate)}
                          </p>
                        )}
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{req.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                        SHIFT_TYPES.find(s => s.value === req.shiftType)?.color
                      }`}>
                        {req.shiftType.toLowerCase()}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] text-gray-600">
                        <Clock size={10} />
                        <span className="font-bold">{req.currentShift.start} - {req.currentShift.end}</span>
                      </div>
                      {req.currentShift.location && (
                        <div className="flex items-center gap-2 text-[10px] text-gray-500">
                          <MapPin size={10} />
                          <span>{req.currentShift.location}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    {req.swapWithEmployee ? (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
                          <UserCheck size={14} className="text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-800">{req.swapWithEmployee.name}</p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase">{req.swapWithEmployee.department}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 opacity-60">
                        <div className="w-8 h-8 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center">
                          <UserX size={14} className="text-orange-500" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400">Awaiting volunteer</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">Open offer</p>
                        </div>
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-5 max-w-xs">
                    <p className="text-xs font-bold text-gray-800 line-clamp-2">{req.reason}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <Briefcase size={10} className="text-gray-400" />
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                        {req.requester.department}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${statusDot(req.status)}`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${statusText(req.status)}`}>
                        {req.status}
                      </span>
                    </div>
                    {req.approver && (
                      <p className="text-[9px] text-gray-500 mt-1 truncate">{req.approver}</p>
                    )}
                  </td>

                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {renderActions(req)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredRequests.length === 0 && (
            <div className="p-20 text-center opacity-30 flex flex-col items-center">
              <RefreshCw size={64} className="text-gray-300 mb-4" />
              <p className="text-lg font-black uppercase tracking-widest text-gray-500">No shift swap requests found</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL WRAPPER */}
      {modalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-0 !m-0 ">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={closeModal} />
          <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
            {/* HEADER */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center text-white shadow-lg">
                  {modalMode === "offer" ? <Users size={20} /> : <RefreshCw size={20} />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {modalMode === "create" && "New Shift Swap Request"}
                    {modalMode === "view" && "Shift Swap Details"}
                    {modalMode === "edit" && "Edit Swap Request"}
                    {modalMode === "delete" && "Cancel Swap Request"}
                    {modalMode === "offer" && "Find Swap Partner"}
                  </h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    {modalMode === "create" && "Request to exchange shifts"}
                    {modalMode === "view" && selected?.id}
                    {modalMode === "edit" && selected?.id}
                    {modalMode === "delete" && selected?.id}
                    {modalMode === "offer" && selected?.id}
                  </p>
                </div>
              </div>

              <button onClick={closeModal} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400">
                <X size={24} />
              </button>
            </div>

            {/* BODY */}
            {modalMode === "view" && selected && (
              <div className="p-7 space-y-5 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Swap Date</p>
                    <p className="text-sm font-black text-gray-800 mt-1">{formatDate(selected.swapDate)}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${statusDot(selected.status)}`} />
                      <p className={`text-xs font-black uppercase tracking-widest ${statusText(selected.status)}`}>
                        {selected.status}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Shift Type</p>
                    <p className="text-sm font-black text-gray-800 mt-1">{selected.shiftType.replace("_", " ")}</p>
                  </div>
                  {selected.swapWithDate && (
                    <div className="p-4 rounded-2xl bg-green-50 border border-green-200">
                      <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Work Instead On</p>
                      <p className="text-sm font-black text-green-800 mt-1">{formatDate(selected.swapWithDate)}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border border-gray-200">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Shift</p>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Time:</span>
                        <span className="text-sm font-bold text-gray-800">
                          {selected.currentShift.start} - {selected.currentShift.end}
                        </span>
                      </div>
                      {selected.currentShift.location && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Location:</span>
                          <span className="text-sm font-bold text-gray-800">{selected.currentShift.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {selected.requestedShift && (
                    <div className="p-4 rounded-2xl border border-green-100 bg-green-50/50">
                      <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Requested Shift</p>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-green-500">Time:</span>
                          <span className="text-sm font-bold text-green-600">
                            {selected.requestedShift.start} - {selected.requestedShift.end}
                          </span>
                        </div>
                        {selected.requestedShift.location && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-green-500">Location:</span>
                            <span className="text-sm font-bold text-green-600">{selected.requestedShift.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {selected.swapWithEmployee && (
                  <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/50">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Swap Partner</p>
                    <div className="mt-3 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center">
                        <Users size={20} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-black text-gray-800">{selected.swapWithEmployee.name}</p>
                        <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">
                          {selected.swapWithEmployee.department}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-4 rounded-2xl border border-gray-200">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reason for Swap</p>
                  <p className="text-sm font-medium text-gray-700 mt-2 leading-relaxed">{selected.reason}</p>
                </div>

                {selected.decisionNote && (
                  <div className="p-4 rounded-2xl border border-gray-200">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Decision Note</p>
                    <p className="text-sm font-medium text-gray-700 mt-2 leading-relaxed">{selected.decisionNote}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-[11px] text-gray-500 font-medium">
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Created</p>
                    <p className="mt-1 text-gray-700 font-bold">{selected.createdAt || "-"}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Updated</p>
                    <p className="mt-1 text-gray-700 font-bold">{selected.updatedAt || "-"}</p>
                  </div>
                </div>
              </div>
            )}

            {(modalMode === "create" || modalMode === "edit") && (
              <div className="p-8 space-y-6 overflow-y-auto">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Swap Date *</label>
                    <input
                      type="date"
                      value={form.swapDate}
                      onChange={(e) => setForm((p) => ({ ...p, swapDate: e.target.value }))}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Work Instead On</label>
                    <input
                      type="date"
                      value={form.swapWithDate}
                      onChange={(e) => setForm((p) => ({ ...p, swapWithDate: e.target.value }))}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5"
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Shift Type *</label>
                    <select
                      value={form.shiftType}
                      onChange={(e) => {
                        const shiftType = e.target.value as ShiftType;
                        setForm((p) => ({
                          ...p,
                          shiftType,
                          shiftHours: SHIFT_TYPES.find(s => s.value === shiftType)?.hours || p.shiftHours
                        }));
                      }}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none"
                    >
                      {SHIFT_TYPES.map((shift) => (
                        <option key={shift.value} value={shift.value}>
                          {shift.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</label>
                    <select
                      value={form.location}
                      onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none"
                    >
                      <option>HQ Main</option>
                      <option>West Branch</option>
                      <option>East Campus</option>
                      <option>Data Center</option>
                      <option>Remote</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Swap With (Optional)</label>
                  <select
                    value={form.swapWithEmployeeId}
                    onChange={(e) => setForm((p) => ({ ...p, swapWithEmployeeId: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none"
                  >
                    <option value="">Open for anyone to accept</option>
                    {AVAILABLE_EMPLOYEES.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} ({emp.department}) - {emp.shift}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reason for Swap *</label>
                  <textarea
                    value={form.reason}
                    onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
                    placeholder="Explain why you need to swap shifts (Minimum 20 characters)..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-4 focus:ring-[#3E3B6F]/5 h-32"
                  />
                  <div className="flex justify-between text-xs">
                    <span className={`font-bold ${form.reason.length < 20 ? 'text-orange-500' : 'text-green-600'}`}>
                      {form.reason.length} / 20 characters minimum
                    </span>
                    <span className="text-gray-400">Required</span>
                  </div>
                </div>

                {/* Validation hint */}
                {(!form.swapDate || !form.reason.trim() || form.reason.length < 20) && (
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl flex gap-3">
                    <AlertTriangle size={18} className="text-orange-600 shrink-0" />
                    <p className="text-[11px] text-orange-800 font-semibold leading-relaxed">
                      Please fill <span className="font-black">Swap Date</span> and provide a reason with at least <span className="font-black">20 characters</span>.
                    </p>
                  </div>
                )}
              </div>
            )}

            {modalMode === "offer" && selected && (
              <div className="p-8 space-y-6 overflow-y-auto">
                <div className="p-5 rounded-2xl border border-blue-200 bg-blue-50/50">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                      <Users size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-blue-800">Find a swap partner for your shift</p>
                      <p className="text-[11px] text-blue-700 mt-1 font-medium leading-relaxed">
                        Select an employee who can take your shift. They will be notified and can accept your request.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest">Available Employees</h4>
                  <div className="space-y-3">
                    {AVAILABLE_EMPLOYEES.map((emp) => (
                      <div key={emp.id} className="p-4 rounded-2xl border border-gray-200 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                              <span className="text-sm font-black text-gray-600">{emp.name.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-800">{emp.name}</p>
                              <p className="text-[10px] text-gray-500 font-bold uppercase">{emp.department} • {emp.shift}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => acceptOffer(selected.id, emp.id)}
                            className="px-4 py-2 bg-[#3E3B6F] text-white text-xs font-bold rounded-lg hover:bg-[#3E3B6F]/90 transition-all"
                          >
                            Request Swap
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {modalMode === "delete" && selected && (
              <div className="p-8 space-y-5">
                <div className="p-5 rounded-2xl border border-red-200 bg-red-50/60">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center">
                      <Trash2 size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-red-800">
                        {selected.status === "PENDING" ? "Cancel this request?" : "Delete this request?"}
                      </p>
                      <p className="text-[11px] text-red-700 mt-1 font-medium leading-relaxed">
                        {selected.status === "PENDING"
                          ? "This will cancel the swap request. You can create a new one anytime."
                          : "This will permanently remove the request from your records."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-gray-200">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Request Details</p>
                  <p className="text-sm font-black text-gray-900 mt-1">
                    {selected.id} • {formatDate(selected.swapDate)} • {selected.shiftType}
                  </p>
                  <p className="text-[11px] text-gray-600 mt-2 font-medium">{selected.reason}</p>
                </div>
              </div>
            )}

            {/* FOOTER */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4 shrink-0">
              <button
                onClick={closeModal}
                className="flex-1 py-3 bg-white border border-gray-200 text-gray-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
              >
                {modalMode === "view" || modalMode === "offer" ? "Close" : "Cancel"}
              </button>

              {modalMode === "create" && (
                <button
                  onClick={createRequest}
                  disabled={!form.swapDate || !form.reason.trim() || form.reason.length < 20}
                  className="flex-[2] py-3 bg-[#3E3B6F] disabled:opacity-40 disabled:hover:scale-100 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  Submit Request <ArrowRight size={16} />
                </button>
              )}

              {modalMode === "edit" && (
                <button
                  onClick={updateRequest}
                  disabled={!form.swapDate || !form.reason.trim() || form.reason.length < 20}
                  className="flex-[2] py-3 bg-[#3E3B6F] disabled:opacity-40 disabled:hover:scale-100 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  Save Changes <CheckCircle2 size={16} />
                </button>
              )}

              {modalMode === "delete" && (
                <button
                  onClick={deleteRequest}
                  className="flex-[2] py-3 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-600/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {selected?.status === "PENDING" ? "Cancel Request" : "Delete"} <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};