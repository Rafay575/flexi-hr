import React, { useMemo, useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  RotateCcw,
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
  CalendarDays,
  CalendarRange,
  Briefcase,
  MapPin,
  BarChart3,
  Zap,
  MoreVertical,
  UserCheck,
  UserX,
} from "lucide-react";

type RoasterChangeStatus = "PENDING" | "APPROVED" | "REJECTED" | "WITHDRAWN";
type RoasterChangeType = "PERMANENT" | "TEMPORARY" | "SHIFT_PATTERN";

interface RoasterChangeRequest {
  id: string;
  effectiveDate: string;
  endDate?: string;
  type: RoasterChangeType;
  currentRoaster: {
    pattern: string;
    shift: string;
    hours: number;
    location?: string;
  };
  requestedRoaster: {
    pattern: string;
    shift: string;
    hours: number;
    location?: string;
  };
  reason: string;
  impactAssessment?: string;
  status: RoasterChangeStatus;
  approver?: string;
  decisionNote?: string;
  createdAt?: string;
  updatedAt?: string;
  duration?: number; // in days
}

type ModalMode = "create" | "view" | "edit" | "delete" | "impact";

const initialData: RoasterChangeRequest[] = [
  { 
    id: "RC-4001", 
    effectiveDate: "2025-02-01", 
    type: "PERMANENT", 
    currentRoaster: { pattern: "5-Day Week", shift: "Morning", hours: 40, location: "HQ Main" },
    requestedRoaster: { pattern: "4-Day Week", shift: "Extended Day", hours: 40, location: "HQ Main" },
    reason: "Better work-life balance and family commitments", 
    impactAssessment: "No impact on team coverage, maintains same productivity",
    status: "APPROVED", 
    approver: "Michael Chen",
    decisionNote: "Approved after productivity review",
    createdAt: "2025-01-10 11:30",
    updatedAt: "2025-01-12 14:45"
  },
  { 
    id: "RC-4002", 
    effectiveDate: "2025-01-20", 
    endDate: "2025-03-20",
    type: "TEMPORARY", 
    currentRoaster: { pattern: "Morning Shift", shift: "09:00-18:00", hours: 45 },
    requestedRoaster: { pattern: "Night Shift", shift: "22:00-06:00", hours: 40 },
    reason: "Temporary project requires night shift support for 2 months", 
    duration: 60,
    status: "PENDING", 
    createdAt: "2025-01-14 09:15"
  },
  { 
    id: "RC-4003", 
    effectiveDate: "2025-01-25", 
    type: "SHIFT_PATTERN", 
    currentRoaster: { pattern: "Rotating Shifts", shift: "Weekly Rotation", hours: 42 },
    requestedRoaster: { pattern: "Fixed Afternoon", shift: "13:00-22:00", hours: 40 },
    reason: "Health reasons - need consistent sleep schedule", 
    status: "REJECTED", 
    approver: "Sarah Johnson",
    decisionNote: "Current rotation required for team balance",
    createdAt: "2025-01-08 16:40",
    updatedAt: "2025-01-10 10:20"
  },
  { 
    id: "RC-4004", 
    effectiveDate: "2025-02-15", 
    type: "PERMANENT", 
    currentRoaster: { pattern: "Office Based", shift: "Standard", hours: 40, location: "HQ Main" },
    requestedRoaster: { pattern: "Hybrid Remote", shift: "Flexible", hours: 40, location: "Remote/HQ" },
    reason: "Relocating to another city, willing to travel for meetings", 
    status: "PENDING", 
    createdAt: "2025-01-13 14:30"
  },
  { 
    id: "RC-4005", 
    effectiveDate: "2025-01-30", 
    endDate: "2025-02-28",
    type: "TEMPORARY", 
    currentRoaster: { pattern: "9-5 Fixed", shift: "Standard", hours: 40 },
    requestedRoaster: { pattern: "Compressed Week", shift: "07:00-19:00", hours: 48 },
    reason: "Special project requiring extended hours for 4 weeks", 
    duration: 30,
    status: "APPROVED", 
    approver: "Robert Kim",
    decisionNote: "Approved for critical project timeline",
    createdAt: "2025-01-05 10:45",
    updatedAt: "2025-01-08 09:30"
  },
  { 
    id: "RC-4006", 
    effectiveDate: "2025-01-18", 
    type: "SHIFT_PATTERN", 
    currentRoaster: { pattern: "Weekend Work", shift: "Sat-Sun", hours: 32 },
    requestedRoaster: { pattern: "Weekday Only", shift: "Mon-Fri", hours: 40 },
    reason: "Family responsibilities on weekends", 
    status: "WITHDRAWN", 
    decisionNote: "Withdrawn by employee",
    createdAt: "2025-01-02 13:20",
    updatedAt: "2025-01-04 11:15"
  },
];

const ROASTER_TYPES = [
  { value: "PERMANENT", label: "Permanent Change", color: "bg-blue-50 text-blue-600 border-blue-100" },
  { value: "TEMPORARY", label: "Temporary Change", color: "bg-purple-50 text-purple-600 border-purple-100" },
  { value: "SHIFT_PATTERN", label: "Shift Pattern Change", color: "bg-amber-50 text-amber-600 border-amber-100" },
] as const;

const ROASTER_PATTERNS = [
  { value: "5-Day Week", label: "5-Day Week", hours: 40 },
  { value: "4-Day Week", label: "4-Day Week", hours: 40 },
  { value: "Compressed Week", label: "Compressed Week", hours: 48 },
  { value: "Part-Time", label: "Part-Time", hours: 30 },
  { value: "Rotating Shifts", label: "Rotating Shifts", hours: 42 },
  { value: "Fixed Shift", label: "Fixed Shift", hours: 40 },
  { value: "Hybrid Remote", label: "Hybrid Remote", hours: 40 },
  { value: "Remote Only", label: "Remote Only", hours: 40 },
  { value: "Flexi Hours", label: "Flexi Hours", hours: 40 },
] as const;

const SHIFT_OPTIONS = [
  { value: "Morning", label: "Morning (09:00-18:00)" },
  { value: "Afternoon", label: "Afternoon (13:00-22:00)" },
  { value: "Night", label: "Night (22:00-06:00)" },
  { value: "Extended Day", label: "Extended Day (07:00-19:00)" },
  { value: "Standard", label: "Standard (08:30-17:30)" },
  { value: "Flexible", label: "Flexible Hours" },
  { value: "Weekend", label: "Weekend Shift" },
] as const;

const nowStamp = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });

const nextId = (existing: RoasterChangeRequest[]) => {
  const nums = existing
    .map((x) => Number(x.id.replace("RC-", "")))
    .filter((n) => Number.isFinite(n));
  const max = nums.length ? Math.max(...nums) : 4000;
  return `RC-${max + 1}`;
};

export const RoasterChangeRequest: React.FC = () => {
  const [requests, setRequests] = useState<RoasterChangeRequest[]>(initialData);
  const [activeTab, setActiveTab] = useState<RoasterChangeStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    effectiveDate: "",
    endDate: "",
    type: "PERMANENT" as RoasterChangeType,
    currentPattern: "5-Day Week",
    currentShift: "Morning",
    currentHours: 40,
    currentLocation: "HQ Main",
    requestedPattern: "4-Day Week",
    requestedShift: "Extended Day",
    requestedHours: 40,
    requestedLocation: "HQ Main",
    reason: "",
    duration: 0,
    impactAssessment: "",
  });

  const selected = useMemo(() => requests.find((r) => r.id === selectedId) || null, [requests, selectedId]);

  const stats = useMemo(() => {
    const pending = requests.filter((x) => x.status === "PENDING").length;
    const approved = requests.filter((x) => x.status === "APPROVED").length;
    const rejected = requests.filter((x) => x.status === "REJECTED").length;
    const withdrawn = requests.filter((x) => x.status === "WITHDRAWN").length;
    const successRate = requests.length > 0 ? Math.round((approved / requests.length) * 100) : 0;
    const avgProcessingDays = 3.5; // Mock average
    
    return { 
      pending, 
      approved, 
      rejected, 
      withdrawn,
      successRate,
      avgProcessingDays,
      currentYear: 2025,
      changesThisYear: approved + pending + rejected + withdrawn
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
        req.type.toLowerCase().includes(q) ||
        req.currentRoaster.pattern.toLowerCase().includes(q) ||
        req.requestedRoaster.pattern.toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }, [requests, activeTab, searchQuery]);

  const statusDot = (s: RoasterChangeStatus) => {
    switch(s) {
      case "PENDING": return "bg-orange-400";
      case "APPROVED": return "bg-green-500";
      case "REJECTED": return "bg-red-500";
      case "WITHDRAWN": return "bg-gray-400";
      default: return "bg-gray-300";
    }
  };
  
  const statusText = (s: RoasterChangeStatus) => {
    switch(s) {
      case "PENDING": return "text-orange-500";
      case "APPROVED": return "text-green-600";
      case "REJECTED": return "text-red-600";
      case "WITHDRAWN": return "text-gray-500";
      default: return "text-gray-400";
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedId(null);
  };

  const openCreate = () => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    setModalMode("create");
    setForm({
      effectiveDate: nextMonth.toISOString().split("T")[0],
      endDate: "",
      type: "PERMANENT",
      currentPattern: "5-Day Week",
      currentShift: "Morning",
      currentHours: 40,
      currentLocation: "HQ Main",
      requestedPattern: "4-Day Week",
      requestedShift: "Extended Day",
      requestedHours: 40,
      requestedLocation: "HQ Main",
      reason: "",
      duration: 0,
      impactAssessment: "",
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
      effectiveDate: item.effectiveDate,
      endDate: item.endDate || "",
      type: item.type,
      currentPattern: item.currentRoaster.pattern,
      currentShift: item.currentRoaster.shift,
      currentHours: item.currentRoaster.hours,
      currentLocation: item.currentRoaster.location || "HQ Main",
      requestedPattern: item.requestedRoaster.pattern,
      requestedShift: item.requestedRoaster.shift,
      requestedHours: item.requestedRoaster.hours,
      requestedLocation: item.requestedRoaster.location || "HQ Main",
      reason: item.reason,
      duration: item.duration || 0,
      impactAssessment: item.impactAssessment || "",
    });
    setModalOpen(true);
  };

  const openDelete = (id: string) => {
    setSelectedId(id);
    setModalMode("delete");
    setModalOpen(true);
  };

  const openImpact = (id: string) => {
    setSelectedId(id);
    setModalMode("impact");
    setModalOpen(true);
  };

  const createRequest = () => {
    if (!form.effectiveDate || !form.reason.trim() || form.reason.length < 30) return;

    const newRequest: RoasterChangeRequest = {
      id: nextId(requests),
      effectiveDate: form.effectiveDate,
      endDate: form.endDate || undefined,
      type: form.type,
      currentRoaster: {
        pattern: form.currentPattern,
        shift: form.currentShift,
        hours: form.currentHours,
        location: form.currentLocation,
      },
      requestedRoaster: {
        pattern: form.requestedPattern,
        shift: form.requestedShift,
        hours: form.requestedHours,
        location: form.requestedLocation,
      },
      reason: form.reason.trim(),
      impactAssessment: form.impactAssessment || undefined,
      status: "PENDING",
      duration: form.type === "TEMPORARY" && form.endDate 
        ? Math.ceil((new Date(form.endDate).getTime() - new Date(form.effectiveDate).getTime()) / (1000 * 3600 * 24))
        : undefined,
      createdAt: nowStamp(),
    };

    setRequests((prev) => [newRequest, ...prev]);
    closeModal();
  };

  const updateRequest = () => {
    if (!selected) return;
    if (!form.effectiveDate || !form.reason.trim() || form.reason.length < 30) return;

    setRequests((prev) =>
      prev.map((r) =>
        r.id !== selected.id
          ? r
          : {
              ...r,
              effectiveDate: form.effectiveDate,
              endDate: form.endDate || undefined,
              type: form.type,
              currentRoaster: {
                pattern: form.currentPattern,
                shift: form.currentShift,
                hours: form.currentHours,
                location: form.currentLocation,
              },
              requestedRoaster: {
                pattern: form.requestedPattern,
                shift: form.requestedShift,
                hours: form.requestedHours,
                location: form.requestedLocation,
              },
              reason: form.reason.trim(),
              impactAssessment: form.impactAssessment || undefined,
              duration: form.type === "TEMPORARY" && form.endDate 
                ? Math.ceil((new Date(form.endDate).getTime() - new Date(form.effectiveDate).getTime()) / (1000 * 3600 * 24))
                : undefined,
              updatedAt: nowStamp(),
            }
      )
    );

    closeModal();
  };

  const deleteRequest = () => {
    if (!selected) return;
    
    // If withdrawing, update status instead of deleting
    if (selected.status === "PENDING") {
      setRequests((prev) =>
        prev.map((r) =>
          r.id !== selected.id
            ? r
            : {
                ...r,
                status: "WITHDRAWN",
                updatedAt: nowStamp(),
                decisionNote: "Withdrawn by employee",
              }
        )
      );
    } else {
      setRequests((prev) => prev.filter((r) => r.id !== selected.id));
    }
    
    closeModal();
  };

  const resubmit = (id: string) => {
    const item = requests.find((x) => x.id === id);
    if (!item) return;

    const copy: RoasterChangeRequest = {
      ...item,
      id: nextId(requests),
      status: "PENDING",
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

  const renderActions = (req: RoasterChangeRequest) => {
    // PENDING => View, Edit, Withdraw, Impact
    if (req.status === "PENDING") {
      return (
        <>
          <ActionBtn title="View" onClick={() => openView(req.id)} icon={<FileText size={16} />} tone="indigo" />
          <ActionBtn title="Edit" onClick={() => openEdit(req.id)} icon={<Edit3 size={16} />} tone="blue" />
          <ActionBtn title="Impact" onClick={() => openImpact(req.id)} icon={<BarChart3 size={16} />} tone="green" />
          <ActionBtn title="Withdraw" onClick={() => openDelete(req.id)} icon={<Trash2 size={16} />} tone="red" />
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

    // WITHDRAWN => View, Delete
    if (req.status === "WITHDRAWN") {
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

  const calculateImpact = (request: RoasterChangeRequest) => {
    const hourDiff = request.requestedRoaster.hours - request.currentRoaster.hours;
    const patternChange = request.currentRoaster.pattern !== request.requestedRoaster.pattern;
    const locationChange = request.currentRoaster.location !== request.requestedRoaster.location;
    
    let impact = "";
    if (hourDiff > 0) {
      impact += `Increase of ${hourDiff} hours/week. `;
    } else if (hourDiff < 0) {
      impact += `Decrease of ${Math.abs(hourDiff)} hours/week. `;
    }
    
    if (patternChange) impact += `Pattern change from ${request.currentRoaster.pattern} to ${request.requestedRoaster.pattern}. `;
    if (locationChange) impact += `Location change to ${request.requestedRoaster.location}. `;
    
    return impact || "Minimal impact expected.";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <CalendarDays className="text-[#3E3B6F]" size={28} /> Roaster Change Requests
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Request changes to your work schedule, shift pattern, or work arrangement</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus size={18} /> New Request
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Pending Review</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-orange-500">{stats.pending}</span>
            <span className="text-xs font-bold text-gray-400">REQS</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Approved</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-green-600">{stats.approved}</span>
            <span className="text-xs font-bold text-gray-400">REQS</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Success Rate</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#3E3B6F]">{stats.successRate}%</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Avg Processing</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-600">{stats.avgProcessingDays}</span>
            <span className="text-xs font-bold text-gray-400">DAYS</span>
          </div>
        </div>
        <div className="bg-primary-gradient p-5 rounded-2xl shadow-xl shadow-[#3E3B6F]/20 text-white">
          <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">Changes in {stats.currentYear}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#E8D5A3]">{stats.changesThisYear}</span>
            <span className="text-xs font-bold text-white/50">Total</span>
          </div>
        </div>
      </div>

      {/* FILTER & TABS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex p-1 bg-gray-50 rounded-xl">
          {(["ALL", "PENDING", "APPROVED", "REJECTED", "WITHDRAWN"] as const).map((tab) => (
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
            placeholder="Search by ID, reason, or pattern..."
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
                <th className="px-8 py-5">Effective Date</th>
                <th className="px-6 py-5">Current Roaster</th>
                <th className="px-6 py-5">Requested Roaster</th>
                <th className="px-6 py-5">Type</th>
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
                        <p className="text-xs font-bold text-gray-800 tabular-nums">{formatDate(req.effectiveDate)}</p>
                        {req.endDate && (
                          <p className="text-[10px] font-bold text-purple-600 mt-1">
                            Until {formatDate(req.endDate)}
                          </p>
                        )}
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{req.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-gray-800">{req.currentRoaster.pattern}</p>
                      <div className="flex items-center gap-2 text-[10px] text-gray-600">
                        <Clock size={10} />
                        <span>{req.currentRoaster.shift} • {req.currentRoaster.hours}h/wk</span>
                      </div>
                      {req.currentRoaster.location && (
                        <div className="flex items-center gap-2 text-[10px] text-gray-500">
                          <MapPin size={10} />
                          <span>{req.currentRoaster.location}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-green-600">{req.requestedRoaster.pattern}</p>
                      <div className="flex items-center gap-2 text-[10px] text-green-600">
                        <Clock size={10} />
                        <span>{req.requestedRoaster.shift} • {req.requestedRoaster.hours}h/wk</span>
                      </div>
                      {req.requestedRoaster.location && (
                        <div className="flex items-center gap-2 text-[10px] text-green-500">
                          <MapPin size={10} />
                          <span>{req.requestedRoaster.location}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                      ROASTER_TYPES.find(t => t.value === req.type)?.color
                    }`}>
                      {req.type.toLowerCase().replace("_", " ")}
                    </span>
                    {req.duration && (
                      <p className="text-[9px] text-gray-500 mt-1">{req.duration} days</p>
                    )}
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
              <CalendarDays size={64} className="text-gray-300 mb-4" />
              <p className="text-lg font-black uppercase tracking-widest text-gray-500">No roaster change requests found</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL WRAPPER */}
      {modalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-0 !m-0 ">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={closeModal} />
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
            {/* HEADER */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center text-white shadow-lg">
                  {modalMode === "impact" ? <BarChart3 size={20} /> : <CalendarDays size={20} />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {modalMode === "create" && "New Roaster Change Request"}
                    {modalMode === "view" && "Roaster Change Details"}
                    {modalMode === "edit" && "Edit Request"}
                    {modalMode === "delete" && "Withdraw Request"}
                    {modalMode === "impact" && "Impact Assessment"}
                  </h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    {modalMode === "create" && "Request changes to your work schedule"}
                    {modalMode === "view" && selected?.id}
                    {modalMode === "edit" && selected?.id}
                    {modalMode === "delete" && selected?.id}
                    {modalMode === "impact" && selected?.id}
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
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Effective Date</p>
                    <p className="text-sm font-black text-gray-800 mt-1">{formatDate(selected.effectiveDate)}</p>
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
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</p>
                    <p className="text-sm font-black text-gray-800 mt-1">{selected.type.replace("_", " ")}</p>
                  </div>
                  {selected.endDate && (
                    <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
                      <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest">End Date</p>
                      <p className="text-sm font-black text-purple-800 mt-1">{formatDate(selected.endDate)}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border border-gray-200">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Roaster</p>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Pattern:</span>
                        <span className="text-sm font-bold text-gray-800">{selected.currentRoaster.pattern}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Shift:</span>
                        <span className="text-sm font-bold text-gray-800">{selected.currentRoaster.shift}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Hours:</span>
                        <span className="text-sm font-bold text-gray-800">{selected.currentRoaster.hours}h/week</span>
                      </div>
                      {selected.currentRoaster.location && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Location:</span>
                          <span className="text-sm font-bold text-gray-800">{selected.currentRoaster.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-green-100 bg-green-50/50">
                    <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Requested Roaster</p>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-green-500">Pattern:</span>
                        <span className="text-sm font-bold text-green-600">{selected.requestedRoaster.pattern}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-green-500">Shift:</span>
                        <span className="text-sm font-bold text-green-600">{selected.requestedRoaster.shift}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-green-500">Hours:</span>
                        <span className="text-sm font-bold text-green-600">{selected.requestedRoaster.hours}h/week</span>
                      </div>
                      {selected.requestedRoaster.location && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-green-500">Location:</span>
                          <span className="text-sm font-bold text-green-600">{selected.requestedRoaster.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-gray-200">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reason for Change</p>
                  <p className="text-sm font-medium text-gray-700 mt-2 leading-relaxed">{selected.reason}</p>
                </div>

                {selected.impactAssessment && (
                  <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/50">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Impact Assessment</p>
                    <p className="text-sm font-medium text-blue-700 mt-2 leading-relaxed">{selected.impactAssessment}</p>
                  </div>
                )}

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
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Change Type *</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as RoasterChangeType }))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none"
                    >
                      {ROASTER_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Effective Date *</label>
                    <input
                      type="date"
                      value={form.effectiveDate}
                      onChange={(e) => setForm((p) => ({ ...p, effectiveDate: e.target.value }))}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5"
                    />
                  </div>
                </div>

                {form.type === "TEMPORARY" && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">End Date *</label>
                    <input
                      type="date"
                      value={form.endDate}
                      onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
                      min={form.effectiveDate}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Pattern</label>
                    <select
                      value={form.currentPattern}
                      onChange={(e) => {
                        const pattern = ROASTER_PATTERNS.find(p => p.value === e.target.value);
                        setForm((p) => ({
                          ...p,
                          currentPattern: e.target.value,
                          currentHours: pattern?.hours || p.currentHours
                        }));
                      }}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none"
                    >
                      {ROASTER_PATTERNS.map((pattern) => (
                        <option key={pattern.value} value={pattern.value}>
                          {pattern.label} ({pattern.hours}h)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Shift</label>
                    <select
                      value={form.currentShift}
                      onChange={(e) => setForm((p) => ({ ...p, currentShift: e.target.value }))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none"
                    >
                      {SHIFT_OPTIONS.map((shift) => (
                        <option key={shift.value} value={shift.value}>
                          {shift.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Requested Pattern *</label>
                    <select
                      value={form.requestedPattern}
                      onChange={(e) => {
                        const pattern = ROASTER_PATTERNS.find(p => p.value === e.target.value);
                        setForm((p) => ({
                          ...p,
                          requestedPattern: e.target.value,
                          requestedHours: pattern?.hours || p.requestedHours
                        }));
                      }}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none"
                    >
                      {ROASTER_PATTERNS.map((pattern) => (
                        <option key={pattern.value} value={pattern.value}>
                          {pattern.label} ({pattern.hours}h)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Requested Shift *</label>
                    <select
                      value={form.requestedShift}
                      onChange={(e) => setForm((p) => ({ ...p, requestedShift: e.target.value }))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none"
                    >
                      {SHIFT_OPTIONS.map((shift) => (
                        <option key={shift.value} value={shift.value}>
                          {shift.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reason for Change *</label>
                  <textarea
                    value={form.reason}
                    onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
                    placeholder="Explain why you need to change your roaster (Minimum 30 characters)..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-4 focus:ring-[#3E3B6F]/5 h-32"
                  />
                  <div className="flex justify-between text-xs">
                    <span className={`font-bold ${form.reason.length < 30 ? 'text-orange-500' : 'text-green-600'}`}>
                      {form.reason.length} / 30 characters minimum
                    </span>
                    <span className="text-gray-400">Required</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Impact Assessment (Optional)</label>
                  <textarea
                    value={form.impactAssessment}
                    onChange={(e) => setForm((p) => ({ ...p, impactAssessment: e.target.value }))}
                    placeholder="Describe any potential impact on your work, team, or productivity..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-4 focus:ring-[#3E3B6F]/5 h-24"
                  />
                </div>

                {/* Validation hint */}
                {(!form.effectiveDate || !form.reason.trim() || form.reason.length < 30 || (form.type === "TEMPORARY" && !form.endDate)) && (
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl flex gap-3">
                    <AlertTriangle size={18} className="text-orange-600 shrink-0" />
                    <p className="text-[11px] text-orange-800 font-semibold leading-relaxed">
                      Please fill all required fields including <span className="font-black">Effective Date</span>, 
                      {form.type === "TEMPORARY" && <span className="font-black"> End Date</span>}, and provide a reason with at least <span className="font-black">30 characters</span>.
                    </p>
                  </div>
                )}
              </div>
            )}

            {modalMode === "impact" && selected && (
              <div className="p-8 space-y-6 overflow-y-auto">
                <div className="p-5 rounded-2xl border border-blue-200 bg-blue-50/50">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                      <BarChart3 size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-blue-800">Impact Assessment</p>
                      <p className="text-[11px] text-blue-700 mt-1 font-medium leading-relaxed">
                        This analysis shows how the requested change might affect your work and team.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border border-gray-200">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hours Change</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-2xl font-black text-gray-800">{selected.currentRoaster.hours}h</span>
                      <ArrowRight size={16} className="text-gray-400" />
                      <span className={`text-2xl font-black ${selected.requestedRoaster.hours > selected.currentRoaster.hours ? 'text-green-600' : 'text-blue-600'}`}>
                        {selected.requestedRoaster.hours}h
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">
                      {selected.requestedRoaster.hours > selected.currentRoaster.hours 
                        ? `Increase of ${selected.requestedRoaster.hours - selected.currentRoaster.hours}h per week`
                        : selected.requestedRoaster.hours < selected.currentRoaster.hours
                        ? `Decrease of ${selected.currentRoaster.hours - selected.requestedRoaster.hours}h per week`
                        : 'No change in hours'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl border border-gray-200">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pattern Change</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm font-bold text-gray-800 line-clamp-1">{selected.currentRoaster.pattern}</p>
                      <ArrowRight size={12} className="text-gray-400 mx-auto" />
                      <p className="text-sm font-bold text-green-600 line-clamp-1">{selected.requestedRoaster.pattern}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/50">
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Key Considerations</p>
                  <ul className="mt-3 space-y-2 text-sm text-amber-800">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5" />
                      <span>Team coverage during your new schedule</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5" />
                      <span>Communication with colleagues in different time zones</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5" />
                      <span>Meeting schedules and collaboration requirements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5" />
                      <span>System access and support availability</span>
                    </li>
                  </ul>
                </div>

                {selected.impactAssessment && (
                  <div className="p-4 rounded-2xl border border-green-200 bg-green-50/50">
                    <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Your Assessment</p>
                    <p className="text-sm font-medium text-green-700 mt-2 leading-relaxed">{selected.impactAssessment}</p>
                  </div>
                )}
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
                        {selected.status === "PENDING" ? "Withdraw this request?" : "Delete this request?"}
                      </p>
                      <p className="text-[11px] text-red-700 mt-1 font-medium leading-relaxed">
                        {selected.status === "PENDING"
                          ? "This will withdraw the roaster change request. You can submit a new request anytime."
                          : "This will permanently remove the request from your records."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-gray-200">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Request Details</p>
                  <p className="text-sm font-black text-gray-900 mt-1">
                    {selected.id} • {formatDate(selected.effectiveDate)} • {selected.type.replace("_", " ")}
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
                {modalMode === "view" || modalMode === "impact" ? "Close" : "Cancel"}
              </button>

              {modalMode === "create" && (
                <button
                  onClick={createRequest}
                  disabled={!form.effectiveDate || !form.reason.trim() || form.reason.length < 30 || (form.type === "TEMPORARY" && !form.endDate)}
                  className="flex-[2] py-3 bg-[#3E3B6F] disabled:opacity-40 disabled:hover:scale-100 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  Submit Request <ArrowRight size={16} />
                </button>
              )}

              {modalMode === "edit" && (
                <button
                  onClick={updateRequest}
                  disabled={!form.effectiveDate || !form.reason.trim() || form.reason.length < 30 || (form.type === "TEMPORARY" && !form.endDate)}
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
                  {selected?.status === "PENDING" ? "Withdraw Request" : "Delete"} <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};