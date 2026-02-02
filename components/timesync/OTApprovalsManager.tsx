
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Download, 
  Check, 
  X, 
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  BarChart2,
  Calendar,
  Zap,
  Briefcase,
  Users,
  Timer,
  FileText,
  ShieldCheck,
  Info,
  ArrowRight
} from 'lucide-react';

type OTStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
type OTType = 'PRE_APPROVAL' | 'POST_APPROVAL';

interface OTRequest {
  id: string;
  employee: string;
  avatar: string;
  date: string;
  hours: number;
  multiplier: 1.5 | 2.0 | 2.5;
  type: OTType;
  reason: string;
  project: string;
  status: OTStatus;
  estimatedCost: number;
  slaHours: number;
  monthlyCapUsed: number;
}

const MOCK_DATA: OTRequest[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `OT-${3000 + i}`,
  employee: ['Sarah Chen', 'James Wilson', 'Ahmed Khan', 'Priya Das', 'Elena Frost', 'Marcus Low'][i % 6],
  avatar: ['SC', 'JW', 'AK', 'PD', 'EF', 'ML'][i % 6],
  date: `2025-01-${15 - (i % 5)}`,
  hours: [2, 3, 4, 2.5, 1.5, 8][i % 6],
  multiplier: i % 5 === 0 ? 2.0 : (i % 6 === 5 ? 2.5 : 1.5),
  type: i % 2 === 0 ? 'PRE_APPROVAL' : 'POST_APPROVAL',
  reason: i % 3 === 0 ? "Urgent production bug fix after hours" : "Support for quarterly audit window",
  project: i % 2 === 0 ? "Flexi HRMS" : "PayEdge Core",
  status: 'PENDING',
  estimatedCost: ([2, 3, 4, 2.5, 1.5, 8][i % 6]) * (i % 5 === 0 ? 2500 : 1800),
  slaHours: Math.floor(Math.random() * 48),
  monthlyCapUsed: [10, 15, 38, 5, 22, 12][i % 6]
}));

export const OTApprovalsManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<OTType | 'ALL_PENDING' | 'COMPLETED'>('ALL_PENDING');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<OTRequest | null>(null);

  const filteredItems = useMemo(() => {
    return MOCK_DATA.filter(item => {
      const matchesTab = 
        activeTab === 'ALL_PENDING' ? item.status === 'PENDING' :
        activeTab === 'COMPLETED' ? item.status !== 'PENDING' :
        item.type === activeTab && item.status === 'PENDING';
      const matchesSearch = item.employee.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.project.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  const stats = useMemo(() => {
    const pending = MOCK_DATA.filter(r => r.status === 'PENDING');
    return {
      count: pending.length,
      hours: pending.reduce((acc, curr) => acc + curr.hours, 0),
      cost: pending.reduce((acc, curr) => acc + curr.estimatedCost, 0)
    };
  }, []);

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const batchStats = useMemo(() => {
    const selected = MOCK_DATA.filter(r => selectedIds.has(r.id));
    return {
      hours: selected.reduce((acc, curr) => acc + curr.hours, 0),
      cost: selected.reduce((acc, curr) => acc + curr.estimatedCost, 0)
    };
  }, [selectedIds]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <Clock className="text-[#3E3B6F]" size={28} /> OT Approvals
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Review and authorize overtime payroll impacts</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-200 rounded-xl p-1 flex shadow-sm">
            <button className="px-4 py-2 text-xs font-bold text-[#3E3B6F] hover:bg-gray-50 rounded-lg transition-all">
              <Calendar size={14} className="inline mr-2" /> Date Range
            </button>
            <button className="px-4 py-2 text-xs font-bold text-[#3E3B6F] hover:bg-gray-50 rounded-lg transition-all border-l border-gray-100">
              <Users size={14} className="inline mr-2" /> Team: All
            </button>
          </div>
          <button className="p-2.5 bg-white border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50 transition-all">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-[#3E3B6F]/20 transition-all">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pending Requests</p>
            <p className="text-3xl font-black text-gray-800 tabular-nums">{stats.count}</p>
          </div>
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
            <Timer size={28} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-[#3E3B6F]/20 transition-all">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Pending Hours</p>
            <p className="text-3xl font-black text-gray-800 tabular-nums">{stats.hours}h</p>
          </div>
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
            <Clock size={28} />
          </div>
        </div>
        <div className="bg-primary-gradient p-6 rounded-3xl shadow-xl shadow-[#3E3B6F]/10 flex items-center justify-between text-white relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Est. Cost Impact</p>
            <p className="text-3xl font-black text-[#E8D5A3] tabular-nums">PKR {stats.cost.toLocaleString()}</p>
          </div>
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-[#E8D5A3] relative z-10">
            <DollarSign size={28} />
          </div>
          <BarChart2 size={120} className="absolute -right-8 -bottom-8 text-white/5 opacity-20" />
        </div>
      </div>

      {/* FILTER & TABS */}
      <div className="bg-white border border-gray-200 rounded-2xl p-1 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm shrink-0">
        <div className="flex flex-1 items-center gap-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'ALL_PENDING', label: 'All Pending' },
            { id: 'PRE_APPROVAL', label: 'Pre-Approvals' },
            { id: 'POST_APPROVAL', label: 'Post-Approvals' },
            { id: 'COMPLETED', label: 'History' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#3E3B6F] text-white shadow-lg' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="px-3 border-l border-gray-100 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
            <input 
              type="text" 
              placeholder="Search employee or project..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-xs font-medium w-64 outline-none focus:ring-2 focus:ring-[#3E3B6F]/10"
            />
          </div>
        </div>
      </div>

      {/* ACTION BAR */}
      {selectedIds.size > 0 && (
        <div className="p-4 bg-[#3E3B6F] rounded-2xl flex items-center justify-between animate-in slide-in-from-top-4 duration-300 shadow-2xl">
          <div className="flex items-center gap-6 pl-2">
            <div>
               <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Selected</p>
               <p className="text-sm font-black text-white leading-none tabular-nums">{selectedIds.size} Requests</p>
            </div>
            <div className="h-8 w-px bg-white/10"></div>
            <div>
               <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Cumulative</p>
               <p className="text-sm font-black text-[#E8D5A3] leading-none tabular-nums">{batchStats.hours}h • PKR {batchStats.cost.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-6 py-2.5 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-all flex items-center gap-2 shadow-lg shadow-green-900/20">
              <CheckCircle2 size={14} /> Batch Approve
            </button>
            <button onClick={() => setSelectedIds(new Set())} className="p-2.5 text-white/40 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* DATA TABLE */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    onChange={(e) => {
                      if (e.target.checked) setSelectedIds(new Set(filteredItems.map(i => i.id)));
                      else setSelectedIds(new Set());
                    }}
                    checked={selectedIds.size === filteredItems.length && filteredItems.length > 0}
                    className="w-4 h-4 rounded border-gray-300 text-[#3E3B6F] focus:ring-[#3E3B6F]"
                  />
                </th>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4 text-center">Hours</th>
                <th className="px-6 py-4 text-center">Rate</th>
                <th className="px-6 py-4 text-right">Est. Cost</th>
                <th className="px-6 py-4">SLA Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredItems.map((item) => (
                <tr key={item.id} className={`group hover:bg-gray-50/80 transition-all ${selectedIds.has(item.id) ? 'bg-[#3E3B6F]/5' : ''}`}>
                  <td className="px-6 py-4 text-center">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.has(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      className="w-4 h-4 rounded border-gray-300 text-[#3E3B6F] focus:ring-[#3E3B6F]"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary-gradient flex items-center justify-center text-white text-[11px] font-black shadow-lg shadow-[#3E3B6F]/10">
                        {item.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate">{item.employee}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">{item.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[11px] font-bold text-gray-500 tabular-nums">
                    {new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
                      item.type === 'PRE_APPROVAL' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100'
                    }`}>
                      {item.type === 'PRE_APPROVAL' ? 'Pre-Auth' : 'Post-Punch'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-black text-gray-700 tabular-nums">{item.hours}h</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black border ${
                      item.multiplier >= 2.0 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'
                    }`}>
                      {item.multiplier}x
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-xs font-black text-[#3E3B6F] tabular-nums">PKR {item.estimatedCost.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${
                      item.slaHours < 12 ? 'bg-red-50 text-red-500 border-red-100' : 'bg-gray-100 text-gray-400 border-gray-200'
                    }`}>
                      <Timer size={10} /> {item.slaHours}h left
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2  transition-all">
                      <button className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-500 hover:text-white transition-all shadow-sm">
                        <Check size={14} />
                      </button>
                      <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm">
                        <X size={14} />
                      </button>
                      <button 
                        onClick={() => setSelectedRequest(item)}
                        className="p-2 bg-white border border-gray-200 text-gray-400 rounded-lg hover:text-[#3E3B6F] hover:border-[#3E3B6F] transition-all"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredItems.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center justify-center opacity-30 grayscale">
              <ShieldCheck size={64} className="text-gray-300 mb-4" />
              <p className="text-lg font-black uppercase tracking-widest text-gray-500">Inbox Zero Reached</p>
              <p className="text-sm font-medium">All overtime requests have been processed.</p>
            </div>
          )}
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedRequest && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedRequest(null)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
            {/* MODAL HEADER */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
               <div className="flex items-center gap-3">
                 <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-[0.2em] border ${
                   selectedRequest.type === 'PRE_APPROVAL' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100'
                 }`}>
                   {selectedRequest.type.replace('_', ' ')}
                 </span>
                 <div className="h-4 w-px bg-gray-200"></div>
                 <h3 className="text-lg font-bold text-gray-800 tabular-nums">{selectedRequest.id}</h3>
               </div>
               <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400"><X size={20}/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {/* EMPLOYEE INFO */}
              <div className="flex items-center gap-5 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-16 h-16 rounded-2xl bg-primary-gradient flex items-center justify-center text-white text-xl font-black shadow-lg shadow-[#3E3B6F]/20">
                  {selectedRequest.avatar}
                </div>
                <div>
                  <h4 className="text-xl font-black text-gray-800 leading-tight">{selectedRequest.employee}</h4>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Senior Software Engineer • Grade L4</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* OT DETAILS */}
                <div className="space-y-4">
                  <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Clock size={14} className="text-[#3E3B6F]" /> Request Analysis
                  </h5>
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4 shadow-sm">
                    <div className="flex justify-between items-center text-xs">
                       <span className="text-gray-500 font-bold">Shift Context:</span>
                       <span className="font-black text-gray-800">9 AM - 6 PM</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                       <span className="text-gray-500 font-bold">Actual Punch Out:</span>
                       <span className="font-black text-blue-600">8:30 PM</span>
                    </div>
                    <div className="flex justify-between items-center text-xs pt-3 border-t border-gray-50">
                       <span className="text-gray-500 font-bold">Total OT Duration:</span>
                       <span className="text-lg font-black text-gray-800 tabular-nums">{selectedRequest.hours} Hours</span>
                    </div>
                  </div>
                </div>

                {/* FINANCIAL IMPACT */}
                <div className="space-y-4">
                  <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <DollarSign size={14} className="text-green-500" /> Payroll Impact
                  </h5>
                  <div className="bg-green-50/50 border border-green-100 rounded-2xl p-5 space-y-4 shadow-sm">
                    <div className="flex justify-between items-center text-xs">
                       <span className="text-green-700 font-bold">Calculated Rate:</span>
                       <span className="font-black text-green-800">{selectedRequest.multiplier}x Basic Hourly</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                       <span className="text-green-700 font-bold">Project Allocation:</span>
                       <span className="font-black text-indigo-700">{selectedRequest.project}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs pt-3 border-t border-green-100">
                       <span className="text-green-700 font-bold">Est. Compensation:</span>
                       <span className="text-lg font-black text-green-700 tabular-nums">PKR {selectedRequest.estimatedCost.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CAP STATUS */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
                 <div className="flex justify-between items-center mb-4">
                    <h5 className="text-[10px] font-black text-indigo-700 uppercase tracking-widest flex items-center gap-2">
                       <TrendingUp size={14} /> Monthly Cap Utilization
                    </h5>
                    <span className="text-[10px] font-black text-indigo-500 uppercase">Limit: 40h</span>
                 </div>
                 <div className="w-full bg-indigo-200 h-2 rounded-full overflow-hidden mb-2">
                    <div 
                      style={{ width: `${(selectedRequest.monthlyCapUsed / 40) * 100}%` }} 
                      className={`h-full transition-all ${selectedRequest.monthlyCapUsed > 30 ? 'bg-orange-500' : 'bg-indigo-600'}`}
                    />
                 </div>
                 <div className="flex justify-between items-center">
                    <p className="text-[10px] font-bold text-indigo-700">Currently Used: <span className="font-black">{selectedRequest.monthlyCapUsed}h</span></p>
                    {selectedRequest.monthlyCapUsed > 30 && (
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-orange-600">
                        <AlertTriangle size={12} /> High Utilization Alert
                      </div>
                    )}
                 </div>
              </div>

              {/* REASON & EVIDENCE */}
              <div className="space-y-4">
                <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <FileText size={14} className="text-[#3E3B6F]" /> Employee Statement
                </h5>
                <div className="p-6 bg-gray-50 border border-gray-100 rounded-3xl italic font-medium text-gray-600 text-sm leading-relaxed">
                  "{selectedRequest.reason}"
                </div>
                {selectedRequest.type === 'POST_APPROVAL' && (
                  <div className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl">
                     <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><ShieldCheck size={18} /></div>
                     <div className="flex-1">
                        <p className="text-xs font-bold text-gray-800">Verified System Logs</p>
                        <p className="text-[10px] text-gray-400">Activity detected on Workstation #142 until 8:15 PM.</p>
                     </div>
                     <button className="text-[10px] font-black text-blue-600 uppercase hover:underline">View Trace</button>
                  </div>
                )}
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4 shrink-0">
               <button onClick={() => setSelectedRequest(null)} className="flex-1 py-4 bg-white border border-gray-200 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-50 transition-all flex items-center justify-center gap-2">
                 <X size={16} /> Reject
               </button>
               <button className="flex-[2] py-4 bg-[#3E3B6F] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                 <Check size={16} /> Authorize Request
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
