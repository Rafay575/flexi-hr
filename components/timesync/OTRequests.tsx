import React, { useMemo, useState } from "react";
import {
  Clock,
  Plus,
  Search,
  Calendar,
  TrendingUp,
  X,
  History,
  FileText,
  ArrowRight,
  Briefcase,
  MoreVertical,
  Edit3,
  Undo2,
  Info,
  Download,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

type OTRequestStatus = "PENDING" | "APPROVED" | "REJECTED";
type OTRequestType = "PRE_APPROVAL" | "POST_APPROVAL";

interface OTRequest {
  id: string;
  date: string; // YYYY-MM-DD
  type: OTRequestType;
  hours: number;
  rate: string; // e.g. 1.5x
  reason: string;
  project?: string;
  status: OTRequestStatus;
  createdAt?: string;
  updatedAt?: string;
}

type ModalMode = "create" | "view" | "edit" | "delete";

const initialData: OTRequest[] = [
  { id: "OT-4001", date: "2025-01-12", type: "POST_APPROVAL", hours: 2.5, rate: "1.5x", reason: "Critical bug fix for production deployment", project: "PayEdge v2", status: "APPROVED", createdAt: "2025-01-12 19:22" },
  { id: "OT-4002", date: "2025-01-14", type: "PRE_APPROVAL", hours: 3.0, rate: "1.5x", reason: "Scheduled database maintenance window", project: "Infrastructure", status: "PENDING", createdAt: "2025-01-14 10:05" },
  { id: "OT-4003", date: "2025-01-08", type: "POST_APPROVAL", hours: 1.5, rate: "1.5x", reason: "Quarterly compliance audit preparation", project: "Compliance", status: "APPROVED", createdAt: "2025-01-08 18:10" },
  { id: "OT-4004", date: "2025-01-05", type: "PRE_APPROVAL", hours: 4.0, rate: "2.0x", reason: "Sunday emergency server patching", project: "Security", status: "REJECTED", createdAt: "2025-01-05 09:40", updatedAt: "2025-01-06 11:05" },
  { id: "OT-4005", date: "2025-01-15", type: "PRE_APPROVAL", hours: 2.0, rate: "1.5x", reason: "User acceptance testing support", project: "Flexi HRMS", status: "PENDING", createdAt: "2025-01-15 08:30" },
  { id: "OT-4006", date: "2025-01-01", type: "POST_APPROVAL", hours: 8.5, rate: "2.5x", reason: "Public Holiday duty - On-call support", project: "Support", status: "APPROVED", createdAt: "2025-01-01 21:12" },
  { id: "OT-4011", date: "2025-01-10", type: "PRE_APPROVAL", hours: 1.5, rate: "1.5x", reason: "Payroll sync reconciliation", project: "Payroll", status: "PENDING", createdAt: "2025-01-10 12:18" },
  { id: "OT-4014", date: "2025-01-16", type: "PRE_APPROVAL", hours: 4.0, rate: "2.0x", reason: "Planned DR drill support", project: "Business Continuity", status: "PENDING", createdAt: "2025-01-16 09:10" },
];

const nowStamp = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });

const nextId = (existing: OTRequest[]) => {
  const nums = existing
    .map((x) => Number(x.id.replace("OT-", "")))
    .filter((n) => Number.isFinite(n));
  const max = nums.length ? Math.max(...nums) : 4000;
  return `OT-${max + 1}`;
};

export const OTRequests: React.FC = () => {
  const [rows, setRows] = useState<OTRequest[]>(initialData);
  const [activeTab, setActiveTab] = useState<OTRequestStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // form state (used for create + edit)
  const [form, setForm] = useState({
    date: "",
    hours: 1,
    project: "Unassigned",
    reason: "",
    rate: "1.5x",
  });

  const selected = useMemo(() => rows.find((r) => r.id === selectedId) || null, [rows, selectedId]);

  const stats = useMemo(() => {
    const approved = rows.filter((x) => x.status === "APPROVED").reduce((a, b) => a + b.hours, 0);
    const pending = rows.filter((x) => x.status === "PENDING").reduce((a, b) => a + b.hours, 0);
    const cap = 40;
    const remaining = Math.max(0, cap - approved - pending);
    return { approved: Number(approved.toFixed(1)), pending: Number(pending.toFixed(1)), cap, remaining: Number(remaining.toFixed(1)) };
  }, [rows]);

  const filteredRequests = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return rows.filter((req) => {
      const matchesTab = activeTab === "ALL" || req.status === activeTab;
      const matchesSearch =
        !q ||
        req.id.toLowerCase().includes(q) ||
        req.reason.toLowerCase().includes(q) ||
        (req.project || "").toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }, [rows, activeTab, searchQuery]);

  const statusDot = (s: OTRequestStatus) => (s === "PENDING" ? "bg-orange-400" : s === "APPROVED" ? "bg-green-500" : "bg-red-500");
  const statusText = (s: OTRequestStatus) => (s === "PENDING" ? "text-orange-500" : s === "APPROVED" ? "text-green-600" : "text-red-500");

  const closeModal = () => {
    setModalOpen(false);
    setSelectedId(null);
  };

  const openCreate = () => {
    setModalMode("create");
    setForm({
      date: new Date().toISOString().split("T")[0],
      hours: 1,
      project: "Unassigned",
      reason: "",
      rate: "1.5x",
    });
    setModalOpen(true);
  };

  const openView = (id: string) => {
    setSelectedId(id);
    setModalMode("view");
    setModalOpen(true);
  };

  const openEdit = (id: string) => {
    const item = rows.find((x) => x.id === id);
    if (!item) return;
    setSelectedId(id);
    setModalMode("edit");
    setForm({
      date: item.date,
      hours: item.hours,
      project: item.project || "Unassigned",
      reason: item.reason,
      rate: item.rate,
    });
    setModalOpen(true);
  };

  const openDelete = (id: string) => {
    setSelectedId(id);
    setModalMode("delete");
    setModalOpen(true);
  };

  const createRequest = () => {
    if (!form.date || !form.reason.trim()) return;

    const newRow: OTRequest = {
      id: nextId(rows),
      date: form.date,
      type: "PRE_APPROVAL",
      hours: Number(form.hours || 0),
      rate: form.rate,
      reason: form.reason.trim(),
      project: form.project === "Unassigned" ? undefined : form.project,
      status: "PENDING",
      createdAt: nowStamp(),
    };

    setRows((prev) => [newRow, ...prev]);
    closeModal();
  };

  const updateRequest = () => {
    if (!selected) return;
    if (!form.date || !form.reason.trim()) return;

    setRows((prev) =>
      prev.map((r) =>
        r.id !== selected.id
          ? r
          : {
              ...r,
              date: form.date,
              hours: Number(form.hours || 0),
              rate: form.rate,
              reason: form.reason.trim(),
              project: form.project === "Unassigned" ? undefined : form.project,
              updatedAt: nowStamp(),
            }
      )
    );

    closeModal();
  };

  const deleteRequest = () => {
    if (!selected) return;
    setRows((prev) => prev.filter((r) => r.id !== selected.id));
    closeModal();
  };

  const resubmit = (id: string) => {
    const item = rows.find((x) => x.id === id);
    if (!item) return;

    const copy: OTRequest = {
      ...item,
      id: nextId(rows),
      status: "PENDING",
      type: "PRE_APPROVAL",
      createdAt: nowStamp(),
      updatedAt: undefined,
    };

    setRows((prev) => [copy, ...prev]);
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

  const renderActions = (req: OTRequest) => {
    // PENDING + PRE_APPROVAL => View, Edit, Withdraw
    if (req.status === "PENDING" && req.type === "PRE_APPROVAL") {
      return (
        <>
          <ActionBtn title="View" onClick={() => openView(req.id)} icon={<FileText size={16} />} tone="indigo" />
          <ActionBtn title="Edit" onClick={() => openEdit(req.id)} icon={<Edit3 size={16} />} tone="blue" />
          <ActionBtn title="Withdraw" onClick={() => openDelete(req.id)} icon={<Trash2 size={16} />} tone="red" />
        </>
      );
    }

    // PENDING + POST_APPROVAL => View, Withdraw
    if (req.status === "PENDING" && req.type === "POST_APPROVAL") {
      return (
        <>
          <ActionBtn title="View" onClick={() => openView(req.id)} icon={<FileText size={16} />} tone="indigo" />
          <ActionBtn title="Withdraw" onClick={() => openDelete(req.id)} icon={<Trash2 size={16} />} tone="red" />
        </>
      );
    }

    // REJECTED => View, Resubmit (also allow delete)
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
        <ActionBtn title="Download Slip" onClick={() => console.log("Download", req.id)} icon={<Download size={16} />} tone="green" />
      </>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <Clock className="text-[#3E3B6F]" size={28} /> My Overtime
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Track extra work hours and compensation status</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus size={18} /> Request Pre-Approval
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Approved</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-green-600">{stats.approved}</span>
            <span className="text-xs font-bold text-gray-400">HRS</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Pending</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-orange-500">{stats.pending}</span>
            <span className="text-xs font-bold text-gray-400">HRS</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Monthly Cap</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#3E3B6F]">{stats.cap}</span>
            <span className="text-xs font-bold text-gray-400">HRS</span>
          </div>
        </div>
        <div className="bg-primary-gradient p-5 rounded-2xl shadow-xl shadow-[#3E3B6F]/20 text-white">
          <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">Remaining Limit</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#E8D5A3]">{stats.remaining}</span>
            <span className="text-xs font-bold text-white/50">HRS</span>
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
            placeholder="Search by id, reason, or project..."
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
                <th className="px-6 py-5">Type</th>
                <th className="px-6 py-5 text-center">Duration</th>
                <th className="px-6 py-5">Multiplier</th>
                <th className="px-6 py-5">Reason & Project</th>
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
                      className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                        req.type === "PRE_APPROVAL"
                          ? "bg-blue-50 text-blue-600 border-blue-100"
                          : "bg-purple-50 text-purple-600 border-purple-100"
                      }`}
                    >
                      {req.type.replace("_", " ")}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-center">
                    <div className="inline-flex items-center gap-1 text-sm font-black text-gray-700 tabular-nums">{req.hours}h</div>
                  </td>

                  <td className="px-6 py-5">
                    <span className="text-xs font-black text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                      {req.rate} Pay
                    </span>
                  </td>

                  <td className="px-6 py-5 max-w-xs">
                    <p className="text-xs font-bold text-gray-800 truncate">{req.reason}</p>
                    {req.project && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <Briefcase size={10} className="text-gray-400" />
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">{req.project}</span>
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${statusDot(req.status)}`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${statusText(req.status)}`}>{req.status}</span>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {renderActions(req)}
                      {/* <button className="p-2 text-gray-300 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition" title="More">
                        <MoreVertical size={16} />
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredRequests.length === 0 && (
            <div className="p-20 text-center opacity-30 flex flex-col items-center">
              <History size={64} className="text-gray-300 mb-4" />
              <p className="text-lg font-black uppercase tracking-widest text-gray-500">No OT records found</p>
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
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {modalMode === "create" && "Request Pre-Approval"}
                    {modalMode === "view" && "Overtime Request Details"}
                    {modalMode === "edit" && "Edit Request"}
                    {modalMode === "delete" && "Withdraw Request"}
                  </h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    {modalMode === "create" && "Create a new overtime pre-approval"}
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
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</p>
                    <p className="text-sm font-black text-gray-800 mt-1">{selected.type.replace("_", " ")}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hours / Rate</p>
                    <p className="text-sm font-black text-gray-800 mt-1">
                      {selected.hours}h • {selected.rate}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-gray-200">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Project</p>
                  <p className="text-sm font-bold text-gray-800 mt-1">{selected.project || "Unassigned"}</p>
                </div>

                <div className="p-4 rounded-2xl border border-gray-200">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reason</p>
                  <p className="text-sm font-medium text-gray-700 mt-2 leading-relaxed">{selected.reason}</p>
                </div>

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
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Date *</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Expected Hours *</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.5"
                        min={0.5}
                        value={form.hours}
                        onChange={(e) => setForm((p) => ({ ...p, hours: Number(e.target.value) }))}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-black text-[#3E3B6F]"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Hours
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Project / Task</label>
                    <select
                      value={form.project}
                      onChange={(e) => setForm((p) => ({ ...p, project: e.target.value }))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none"
                    >
                      <option>Unassigned</option>
                      <option>Flexi HRMS Phase 2</option>
                      <option>PayEdge Integration</option>
                      <option>Cloud Infrastructure</option>
                      <option>Security</option>
                      <option>Payroll</option>
                      <option>Platform</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rate</label>
                    <select
                      value={form.rate}
                      onChange={(e) => setForm((p) => ({ ...p, rate: e.target.value }))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none"
                    >
                      <option>1.5x</option>
                      <option>2.0x</option>
                      <option>2.5x</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reason for OT *</label>
                  <textarea
                    value={form.reason}
                    onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
                    placeholder="Briefly describe why extra hours are required..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-4 focus:ring-[#3E3B6F]/5 h-32"
                  />
                </div>

            

                {/* tiny validation hint */}
                {(!form.date || !form.reason.trim() || !form.hours) && (
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl flex gap-3">
                    <AlertCircle size={18} className="text-orange-600 shrink-0" />
                    <p className="text-[11px] text-orange-800 font-semibold leading-relaxed">
                      Please fill <span className="font-black">Date</span>, <span className="font-black">Hours</span>, and <span className="font-black">Reason</span>.
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
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Request</p>
                  <p className="text-sm font-black text-gray-900 mt-1">
                    {selected.id} • {formatDate(selected.date)} • {selected.hours}h • {selected.type.replace("_", " ")}
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
                  disabled={!form.date || !form.reason.trim() || !form.hours}
                  className="flex-[2] py-3 bg-[#3E3B6F] disabled:opacity-40 disabled:hover:scale-100 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  Submit for Approval <ArrowRight size={16} />
                </button>
              )}

              {modalMode === "edit" && (
                <button
                  onClick={updateRequest}
                  disabled={!form.date || !form.reason.trim() || !form.hours}
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
