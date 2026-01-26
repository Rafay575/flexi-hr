
import React, { useState, useMemo } from 'react';
import { 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  Calendar, 
  TrendingUp, 
  AlertCircle, 
  X, 
  CheckCircle2, 
  History, 
  FileText, 
  ArrowRight,
  Zap,
  Briefcase,
  DollarSign,
  MoreVertical,
  Edit3,
  Undo2,
  // Fixed: Added missing Info icon import
  Info
} from 'lucide-react';

type OTRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
type OTRequestType = 'PRE_APPROVAL' | 'POST_APPROVAL';

interface OTRequest {
  id: string;
  date: string;
  type: OTRequestType;
  hours: number;
  rate: string;
  reason: string;
  project?: string;
  status: OTRequestStatus;
}

const MOCK_OT: OTRequest[] = [
  { id: 'OT-4001', date: '2025-01-12', type: 'POST_APPROVAL', hours: 2.5, rate: '1.5x', reason: 'Critical bug fix for production deployment', project: 'PayEdge v2', status: 'APPROVED' },
  { id: 'OT-4002', date: '2025-01-14', type: 'PRE_APPROVAL', hours: 3.0, rate: '1.5x', reason: 'Scheduled database maintenance window', project: 'Infrastructure', status: 'PENDING' },
  { id: 'OT-4003', date: '2025-01-08', type: 'POST_APPROVAL', hours: 1.5, rate: '1.5x', reason: 'Quarterly compliance audit preparation', status: 'APPROVED' },
  { id: 'OT-4004', date: '2025-01-05', type: 'PRE_APPROVAL', hours: 4.0, rate: '2.0x', reason: 'Sunday emergency server patching', project: 'Security', status: 'REJECTED' },
  { id: 'OT-4005', date: '2025-01-15', type: 'PRE_APPROVAL', hours: 2.0, rate: '1.5x', reason: 'User acceptance testing support', project: 'Flexi HRMS', status: 'PENDING' },
  { id: 'OT-4006', date: '2025-01-01', type: 'POST_APPROVAL', hours: 8.5, rate: '2.5x', reason: 'Public Holiday duty - On-call support', status: 'APPROVED' },
];

export const OTRequests: React.FC = () => {
  const [activeTab, setActiveTab] = useState<OTRequestStatus | 'ALL'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRequests = useMemo(() => {
    return MOCK_OT.filter(req => {
      const matchesTab = activeTab === 'ALL' || req.status === activeTab;
      const matchesSearch = req.reason.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           req.project?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  const stats = {
    approved: 12.5,
    pending: 3.5,
    cap: 40,
    remaining: 24
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
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus size={18} /> Request Pre-Approval
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Approved This Month</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-green-600">{stats.approved}</span>
            <span className="text-xs font-bold text-gray-400">HRS</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Pending Approval</p>
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
          {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === tab ? 'bg-white shadow-sm text-[#3E3B6F]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
          <input 
            type="text" 
            placeholder="Search by reason or project..." 
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
                <tr key={req.id} className="group hover:bg-gray-50/80 transition-all cursor-default">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm">
                        <Calendar size={18} />
                      </div>
                      <p className="text-xs font-bold text-gray-800 tabular-nums">
                        {new Date(req.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                      req.type === 'PRE_APPROVAL' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100'
                    }`}>
                      {req.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="inline-flex items-center gap-1 text-sm font-black text-gray-700 tabular-nums">
                      {req.hours}h
                    </div>
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
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        req.status === 'PENDING' ? 'bg-orange-400' : 
                        req.status === 'APPROVED' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${
                        req.status === 'PENDING' ? 'text-orange-500' : 
                        req.status === 'APPROVED' ? 'text-green-600' : 'text-red-500'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      {req.status === 'PENDING' ? (
                        <>
                          <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-white rounded-lg transition-all" title="Edit"><Edit3 size={16}/></button>
                          <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-all" title="Cancel"><X size={16}/></button>
                        </>
                      ) : req.status === 'REJECTED' ? (
                        <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all" title="Resubmit"><Undo2 size={16}/></button>
                      ) : (
                        <button className="p-2 text-gray-400 hover:text-[#3E3B6F] hover:bg-white rounded-lg transition-all" title="View Details"><FileText size={16}/></button>
                      )}
                      <button className="p-2 text-gray-300 hover:text-gray-600"><MoreVertical size={16} /></button>
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

      {/* PRE-APPROVAL MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center text-white shadow-lg">
                    <TrendingUp size={20} />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-gray-800">Request Pre-Approval</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Plan your extra work hours</p>
                 </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400"><X size={24}/></button>
            </div>

            <div className="p-8 space-y-6">
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Date *</label>
                    <input type="date" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5" min={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Expected Hours *</label>
                    <div className="relative">
                      <input type="number" step="0.5" defaultValue="1.0" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-black text-[#3E3B6F]" />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Hours</span>
                    </div>
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Project / Task (Optional)</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none">
                     <option>Unassigned</option>
                     <option>Flexi HRMS Phase 2</option>
                     <option>PayEdge Integration</option>
                     <option>Cloud Infrastructure</option>
                  </select>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reason for OT *</label>
                  <textarea 
                    placeholder="Briefly describe why extra hours are required..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-4 focus:ring-[#3E3B6F]/5 h-32" 
                  />
               </div>

               <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex gap-3">
                  <Info size={20} className="text-indigo-500 shrink-0" />
                  <p className="text-[10px] text-indigo-700 leading-relaxed font-medium">
                    Pre-approvals help line managers plan budgets. Approved pre-OT sessions are automatically reconciled against actual punches.
                  </p>
               </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4 shrink-0">
               <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-white border border-gray-200 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">
                 Discard
               </button>
               <button className="flex-[2] py-3 bg-[#3E3B6F] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                 Submit for Approval <ArrowRight size={16} />
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
