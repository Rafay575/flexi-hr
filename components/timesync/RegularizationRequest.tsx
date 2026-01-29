import React, { useMemo, useState } from "react";
import {
  History,
  Calendar,
  Clock,
  AlertTriangle,
  Upload,
  ChevronRight,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
  FileText,
  Info,
  Zap,
  MoreVertical,
  X,
  MessageSquare,
  Plus,
  Search,
  Edit3,
  Undo2,
  Download,
  Trash2,
} from "lucide-react";

type RegularizationStatus = "PENDING" | "APPROVED" | "REJECTED";
type RegularizationIssue = "MISSING_IN" | "MISSING_OUT" | "WRONG_TIME" | "DEVICE_ISSUE" | "LOCATION_ISSUE";

interface RegularizationRequest {
  id: string;
  date: string; // YYYY-MM-DD
  issueType: RegularizationIssue;
  originalInTime: string;
  originalOutTime: string;
  proposedInTime: string;
  proposedOutTime: string;
  reason: string;
  evidenceUrl?: string;
  status: RegularizationStatus;
  calculatedHours: number;
  decisionNote?: string;
  approver?: string;
  createdAt?: string;
  updatedAt?: string;
}

type ModalMode = "create" | "view" | "edit" | "delete";

const initialData: RegularizationRequest[] = [
  { 
    id: "REG-4001", 
    date: "2025-01-12", 
    issueType: "MISSING_OUT", 
    originalInTime: "09:00",
    originalOutTime: "--",
    proposedInTime: "09:00",
    proposedOutTime: "18:30",
    reason: "Forgot to punch out after system maintenance", 
    status: "APPROVED", 
    calculatedHours: 8.5,
    decisionNote: "Approved by manager after verification",
    approver: "Sarah Chen",
    createdAt: "2025-01-12 20:15",
    updatedAt: "2025-01-13 09:30"
  },
  { 
    id: "REG-4002", 
    date: "2025-01-14", 
    issueType: "DEVICE_ISSUE", 
    originalInTime: "--",
    originalOutTime: "18:00",
    proposedInTime: "09:15",
    proposedOutTime: "18:00",
    reason: "Biometric device malfunction in morning", 
    evidenceUrl: "device_log.pdf",
    status: "PENDING", 
    calculatedHours: 7.75,
    createdAt: "2025-01-14 09:45"
  },
  { 
    id: "REG-4003", 
    date: "2025-01-08", 
    issueType: "WRONG_TIME", 
    originalInTime: "10:30",
    originalOutTime: "19:00",
    proposedInTime: "09:00",
    proposedOutTime: "18:30",
    reason: "Late arrival due to medical appointment", 
    status: "APPROVED", 
    calculatedHours: 8.5,
    decisionNote: "Medical certificate verified",
    approver: "Michael Rodriguez",
    createdAt: "2025-01-08 11:20",
    updatedAt: "2025-01-09 14:15"
  },
  { 
    id: "REG-4004", 
    date: "2025-01-05", 
    issueType: "LOCATION_ISSUE", 
    originalInTime: "--",
    originalOutTime: "--",
    proposedInTime: "10:00",
    proposedOutTime: "19:00",
    reason: "Working from client site, GPS issues", 
    status: "REJECTED", 
    calculatedHours: 8.0,
    decisionNote: "No prior approval for remote work",
    approver: "David Kim",
    createdAt: "2025-01-05 17:30",
    updatedAt: "2025-01-06 11:20"
  },
  { 
    id: "REG-4005", 
    date: "2025-01-15", 
    issueType: "MISSING_IN", 
    originalInTime: "--",
    originalOutTime: "17:45",
    proposedInTime: "08:45",
    proposedOutTime: "17:45",
    reason: "Morning meeting off-site, missed punch", 
    status: "PENDING", 
    calculatedHours: 8.0,
    createdAt: "2025-01-15 18:10"
  },
  { 
    id: "REG-4006", 
    date: "2025-01-02", 
    issueType: "DEVICE_ISSUE", 
    originalInTime: "09:00",
    originalOutTime: "19:30",
    proposedInTime: "09:00",
    proposedOutTime: "18:00",
    reason: "System crash during logout", 
    status: "APPROVED", 
    calculatedHours: 8.0,
    decisionNote: "System logs verified by IT",
    approver: "Sarah Chen",
    createdAt: "2025-01-02 20:00",
    updatedAt: "2025-01-03 10:45"
  },
  { 
    id: "REG-4007", 
    date: "2025-01-10", 
    issueType: "WRONG_TIME", 
    originalInTime: "08:15",
    originalOutTime: "16:15",
    proposedInTime: "08:45",
    proposedOutTime: "17:45",
    reason: "Accidentally punched early departure", 
    status: "PENDING", 
    calculatedHours: 8.0,
    createdAt: "2025-01-10 16:30"
  },
];

const ISSUE_OPTIONS = [
  { value: "MISSING_IN", label: "Missing In Punch" },
  { value: "MISSING_OUT", label: "Missing Out Punch" },
  { value: "WRONG_TIME", label: "Incorrect Time Recorded" },
  { value: "DEVICE_ISSUE", label: "Device/System Issue" },
  { value: "LOCATION_ISSUE", label: "Location/GPS Issue" },
] as const;

const nowStamp = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });

const nextId = (existing: RegularizationRequest[]) => {
  const nums = existing
    .map((x) => Number(x.id.replace("REG-", "")))
    .filter((n) => Number.isFinite(n));
  const max = nums.length ? Math.max(...nums) : 4000;
  return `REG-${max + 1}`;
};

const calculateHours = (inTime: string, outTime: string): number => {
  if (!inTime || !outTime || inTime === "--" || outTime === "--") return 0;
  
  const [inHour, inMin] = inTime.split(":").map(Number);
  const [outHour, outMin] = outTime.split(":").map(Number);
  
  const totalMinutes = (outHour * 60 + outMin) - (inHour * 60 + inMin);
  return Math.max(0, totalMinutes / 60);
};

export const RegularizationRequest: React.FC = () => {
  const [requests, setRequests] = useState<RegularizationRequest[]>(initialData);
  const [activeTab, setActiveTab] = useState<RegularizationStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("2025-01-14");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    issueType: "MISSING_OUT" as RegularizationIssue,
    originalInTime: "09:00",
    originalOutTime: "--",
    proposedInTime: "18:30",
    proposedOutTime: "18:30",
    reason: "",
    evidenceFile: null as File | null,
  });

  const selected = useMemo(() => requests.find((r) => r.id === selectedId) || null, [requests, selectedId]);

  const stats = useMemo(() => {
    const approved = requests.filter((x) => x.status === "APPROVED").length;
    const pending = requests.filter((x) => x.status === "PENDING").length;
    const rejected = requests.filter((x) => x.status === "REJECTED").length;
    const totalHours = requests
      .filter((x) => x.status === "APPROVED")
      .reduce((a, b) => a + b.calculatedHours, 0);
    
    return { 
      approved, 
      pending, 
      rejected, 
      totalHours: Number(totalHours.toFixed(1)),
      monthlyQuota: 10,
      remaining: 10 - approved
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
        req.issueType.toLowerCase().includes(q) ||
        (req.approver || "").toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }, [requests, activeTab, searchQuery]);

  const statusDot = (s: RegularizationStatus) => 
    s === "PENDING" ? "bg-orange-400" : s === "APPROVED" ? "bg-green-500" : "bg-red-500";
  
  const statusText = (s: RegularizationStatus) => 
    s === "PENDING" ? "text-orange-500" : s === "APPROVED" ? "text-green-600" : "text-red-500";

  const issueTypeColor = (t: RegularizationIssue) => {
    switch(t) {
      case "MISSING_IN": return "bg-blue-50 text-blue-600 border-blue-100";
      case "MISSING_OUT": return "bg-purple-50 text-purple-600 border-purple-100";
      case "WRONG_TIME": return "bg-amber-50 text-amber-600 border-amber-100";
      case "DEVICE_ISSUE": return "bg-red-50 text-red-600 border-red-100";
      case "LOCATION_ISSUE": return "bg-indigo-50 text-indigo-600 border-indigo-100";
      default: return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedId(null);
  };

  const openCreate = () => {
    setModalMode("create");
    setForm({
      date: new Date().toISOString().split("T")[0],
      issueType: "MISSING_OUT",
      originalInTime: "09:00",
      originalOutTime: "--",
      proposedInTime: "18:30",
      proposedOutTime: "18:30",
      reason: "",
      evidenceFile: null,
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
      date: item.date,
      issueType: item.issueType,
      originalInTime: item.originalInTime,
      originalOutTime: item.originalOutTime,
      proposedInTime: item.proposedInTime,
      proposedOutTime: item.proposedOutTime,
      reason: item.reason,
      evidenceFile: null,
    });
    setModalOpen(true);
  };

  const openDelete = (id: string) => {
    setSelectedId(id);
    setModalMode("delete");
    setModalOpen(true);
  };

  const createRequest = () => {
    if (!form.date || !form.reason.trim() || form.reason.length < 20) return;

    const hours = calculateHours(form.proposedInTime, form.proposedOutTime);
    
    const newRequest: RegularizationRequest = {
      id: nextId(requests),
      date: form.date,
      issueType: form.issueType,
      originalInTime: form.originalInTime,
      originalOutTime: form.originalOutTime,
      proposedInTime: form.proposedInTime,
      proposedOutTime: form.proposedOutTime,
      reason: form.reason.trim(),
      status: "PENDING",
      calculatedHours: hours,
      createdAt: nowStamp(),
    };

    setRequests((prev) => [newRequest, ...prev]);
    closeModal();
  };

  const updateRequest = () => {
    if (!selected) return;
    if (!form.date || !form.reason.trim() || form.reason.length < 20) return;

    const hours = calculateHours(form.proposedInTime, form.proposedOutTime);
    
    setRequests((prev) =>
      prev.map((r) =>
        r.id !== selected.id
          ? r
          : {
              ...r,
              date: form.date,
              issueType: form.issueType,
              originalInTime: form.originalInTime,
              originalOutTime: form.originalOutTime,
              proposedInTime: form.proposedInTime,
              proposedOutTime: form.proposedOutTime,
              reason: form.reason.trim(),
              calculatedHours: hours,
              updatedAt: nowStamp(),
            }
      )
    );

    closeModal();
  };

  const deleteRequest = () => {
    if (!selected) return;
    setRequests((prev) => prev.filter((r) => r.id !== selected.id));
    closeModal();
  };

  const resubmit = (id: string) => {
    const item = requests.find((x) => x.id === id);
    if (!item) return;

    const copy: RegularizationRequest = {
      ...item,
      id: nextId(requests),
      status: "PENDING",
      createdAt: nowStamp(),
      updatedAt: undefined,
      decisionNote: undefined,
      approver: undefined,
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
    tone?: "gray" | "blue" | "red" | "indigo" | "green";
  }) => {
    const toneCls = {
      gray: "text-gray-400 hover:text-gray-700 hover:bg-gray-50",
      blue: "text-gray-400 hover:text-blue-600 hover:bg-blue-50",
      indigo: "text-gray-400 hover:text-indigo-600 hover:bg-indigo-50",
      green: "text-gray-400 hover:text-green-600 hover:bg-green-50",
      red: "text-gray-400 hover:text-red-600 hover:bg-red-50",
    };
    return (
      <button type="button" title={title} onClick={onClick} className={`p-2 rounded-lg transition-all ${toneCls[tone]} inline-flex items-center justify-center`}>
        {icon}
      </button>
    );
  };

  const renderActions = (req: RegularizationRequest) => {
    // PENDING => View, Edit, Withdraw
    if (req.status === "PENDING") {
      return (
        <>
          <ActionBtn title="View" onClick={() => openView(req.id)} icon={<FileText size={16} />} tone="indigo" />
          <ActionBtn title="Edit" onClick={() => openEdit(req.id)} icon={<Edit3 size={16} />} tone="blue" />
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
            <History className="text-[#3E3B6F]" size={28} /> Regularization Requests
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Correct attendance anomalies for management approval</p>
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
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Approved</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-green-600">{stats.approved}</span>
            <span className="text-xs font-bold text-gray-400">REQS</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Pending</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-orange-500">{stats.pending}</span>
            <span className="text-xs font-bold text-gray-400">REQS</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Rejected</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-red-500">{stats.rejected}</span>
            <span className="text-xs font-bold text-gray-400">REQS</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Hours Recovered</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#3E3B6F]">{stats.totalHours}</span>
            <span className="text-xs font-bold text-gray-400">HRS</span>
          </div>
        </div>
        <div className="bg-primary-gradient p-5 rounded-2xl shadow-xl shadow-[#3E3B6F]/20 text-white">
          <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">Monthly Quota</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#E8D5A3]">{stats.remaining}</span>
            <span className="text-xs font-bold text-white/50">/{stats.monthlyQuota}</span>
          </div>
        </div>
      </div>

      {/* FILTER & TABS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex p-1 bg-gray-50 rounded-xl">
          {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 text-xs font-bold rounded-lg transition-all ${
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
            placeholder="Search by ID, reason, or approver..."
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
                <th className="px-8 py-5">Request Date</th>
                <th className="px-6 py-5">Issue Type</th>
                <th className="px-6 py-5">Original Record</th>
                <th className="px-6 py-5">Proposed Correction</th>
                <th className="px-6 py-5">Hours</th>
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
                        <p className="text-xs font-bold text-gray-800 tabular-nums">{formatDate(req.date)}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{req.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${issueTypeColor(req.issueType)}`}
                    >
                      {req.issueType.replace("_", " ")}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock size={12} className="text-gray-400" />
                        <span className="text-xs font-bold text-gray-800">{req.originalInTime}</span>
                        <span className="text-[10px] text-gray-400 font-black">IN</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={12} className="text-gray-400" />
                        <span className="text-xs font-bold text-gray-800">{req.originalOutTime}</span>
                        <span className="text-[10px] text-gray-400 font-black">OUT</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock size={12} className="text-green-500" />
                        <span className="text-xs font-bold text-green-600">{req.proposedInTime}</span>
                        <span className="text-[10px] text-green-500 font-black">IN</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={12} className="text-green-500" />
                        <span className="text-xs font-bold text-green-600">{req.proposedOutTime}</span>
                        <span className="text-[10px] text-green-500 font-black">OUT</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="inline-flex items-center gap-1 text-sm font-black text-[#3E3B6F] tabular-nums">
                      {req.calculatedHours}h
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
              <History size={64} className="text-gray-300 mb-4" />
              <p className="text-lg font-black uppercase tracking-widest text-gray-500">No regularization records found</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL WRAPPER */}
      {modalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-0 !m-0 ">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={closeModal} />
          <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col">
            {/* HEADER */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center text-white shadow-lg">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {modalMode === "create" && "New Regularization Request"}
                    {modalMode === "view" && "Request Details"}
                    {modalMode === "edit" && "Edit Regularization"}
                    {modalMode === "delete" && "Withdraw Request"}
                  </h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    {modalMode === "create" && "Correct attendance anomaly"}
                    {modalMode === "view" && selected?.id}
                    {modalMode === "edit" && selected?.id}
                    {modalMode === "delete" && selected?.id}
                  </p>
                </div>
              </div>

              <button onClick={closeModal} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400">
                <X size={24} />
              </button>
            </div>

            {/* BODY */}
            {modalMode === "view" && selected && (
              <div className="p-7 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</p>
                    <p className="text-sm font-black text-gray-800 mt-1">{formatDate(selected.date)}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${statusDot(selected.status)}`} />
                      <p className={`text-xs font-black uppercase tracking-widest ${statusText(selected.status)}`}>{selected.status}</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Issue Type</p>
                    <p className="text-sm font-black text-gray-800 mt-1">{selected.issueType.replace("_", " ")}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hours</p>
                    <p className="text-sm font-black text-gray-800 mt-1">{selected.calculatedHours}h</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border border-gray-200">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Original Record</p>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500">In:</span>
                        <span className="text-sm font-bold text-gray-800">{selected.originalInTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500">Out:</span>
                        <span className="text-sm font-bold text-gray-800">{selected.originalOutTime}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl border border-green-100 bg-green-50/50">
                    <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Proposed Correction</p>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-green-500">In:</span>
                        <span className="text-sm font-bold text-green-600">{selected.proposedInTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-green-500">Out:</span>
                        <span className="text-sm font-bold text-green-600">{selected.proposedOutTime}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-gray-200">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reason</p>
                  <p className="text-sm font-medium text-gray-700 mt-2 leading-relaxed">{selected.reason}</p>
                </div>

                {selected.evidenceUrl && (
                  <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/50">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Evidence</p>
                    <div className="mt-2 flex items-center gap-3">
                      <FileText size={16} className="text-blue-500" />
                      <span className="text-sm font-bold text-blue-700">{selected.evidenceUrl}</span>
                      <button className="ml-auto text-xs font-black text-blue-600 hover:text-blue-800">
                        Download
                      </button>
                    </div>
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
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date *</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Issue Type *</label>
                    <select
                      value={form.issueType}
                      onChange={(e) => setForm((p) => ({ ...p, issueType: e.target.value as RegularizationIssue }))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none"
                    >
                      {ISSUE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Proposed In Time *</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="time"
                        value={form.proposedInTime}
                        onChange={(e) => setForm((p) => ({ ...p, proposedInTime: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Proposed Out Time *</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="time"
                        value={form.proposedOutTime}
                        onChange={(e) => setForm((p) => ({ ...p, proposedOutTime: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reason for Correction *</label>
                  <textarea
                    value={form.reason}
                    onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
                    placeholder="Explain why the record is incorrect or missing (Minimum 20 characters)..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-4 focus:ring-[#3E3B6F]/5 h-32"
                  />
                  <div className="flex justify-between text-xs">
                    <span className={`font-bold ${form.reason.length < 20 ? 'text-orange-500' : 'text-green-600'}`}>
                      {form.reason.length} / 20 characters minimum
                    </span>
                    <span className="text-gray-400">Required</span>
                  </div>
                </div>

                <div className="p-6 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 hover:border-[#3E3B6F]/30 transition-all cursor-pointer">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Upload size={28} className="text-gray-400" />
                    <div className="text-center">
                      <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Upload Evidence (Optional)</p>
                      <p className="text-[10px] text-gray-400 mt-1">Supporting documents like screenshots, logs, or notes</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      id="evidence-upload"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={(e) => setForm((p) => ({ ...p, evidenceFile: e.target.files?.[0] || null }))}
                    />
                    <label
                      htmlFor="evidence-upload"
                      className="px-4 py-2 text-xs font-bold text-[#3E3B6F] bg-white border border-[#3E3B6F] rounded-lg cursor-pointer hover:bg-[#3E3B6F] hover:text-white transition-all"
                    >
                      Choose File
                    </label>
                    {form.evidenceFile && (
                      <p className="text-xs text-green-600 font-bold mt-2">
                        ✓ {form.evidenceFile.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Validation hint */}
                {(!form.date || !form.reason.trim() || form.reason.length < 20) && (
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl flex gap-3">
                    <AlertTriangle size={18} className="text-orange-600 shrink-0" />
                    <p className="text-[11px] text-orange-800 font-semibold leading-relaxed">
                      Please fill <span className="font-black">Date</span>, <span className="font-black">Times</span>, and provide a reason with at least <span className="font-black">20 characters</span>.
                    </p>
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
                      <p className="text-sm font-black text-red-800">Withdraw this request?</p>
                      <p className="text-[11px] text-red-700 mt-1 font-medium leading-relaxed">
                        This will remove the request from your list. You can create a new one anytime.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-gray-200">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Request Details</p>
                  <p className="text-sm font-black text-gray-900 mt-1">
                    {selected.id} • {formatDate(selected.date)} • {selected.issueType.replace("_", " ")}
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
                {modalMode === "view" ? "Close" : "Cancel"}
              </button>

              {modalMode === "create" && (
                <button
                  onClick={createRequest}
                  disabled={!form.date || !form.reason.trim() || form.reason.length < 20}
                  className="flex-[2] py-3 bg-[#3E3B6F] disabled:opacity-40 disabled:hover:scale-100 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  Submit for Approval <ArrowRight size={16} />
                </button>
              )}

              {modalMode === "edit" && (
                <button
                  onClick={updateRequest}
                  disabled={!form.date || !form.reason.trim() || form.reason.length < 20}
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
                  Withdraw <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};