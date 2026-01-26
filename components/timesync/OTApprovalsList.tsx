
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
  Briefcase
} from 'lucide-react';

type OTStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
type OTType = 'PRE_APPROVAL' | 'POST_APPROVAL';

interface OTRequest {
  id: string;
  employee: string;
  avatar: string;
  date: string;
  hours: number;
  multiplier: 1.5 | 2.0;
  type: OTType;
  reason: string;
  status: OTStatus;
  estimatedCost: number;
  exceedsCap?: boolean;
}

const MOCK_DATA: OTRequest[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `OT-${3000 + i}`,
  employee: ['Sarah Chen', 'James Wilson', 'Ahmed Khan', 'Priya Das', 'Elena Frost', 'Marcus Low'][i % 6],
  avatar: ['SC', 'JW', 'AK', 'PD', 'EF', 'ML'][i % 6],
  date: `Jan ${12 - (i % 3)}, 2025`,
  hours: [2, 3, 4, 2.5, 1.5][i % 5],
  multiplier: i % 4 === 0 ? 2.0 : 1.5,
  type: i % 2 === 0 ? 'PRE_APPROVAL' : 'POST_APPROVAL',
  reason: i % 3 === 0 ? "Urgent server migration window" : "Q1 Financial closing assistance",
  status: 'PENDING',
  estimatedCost: ([2, 3, 4, 2.5, 1.5][i % 5]) * (i % 4 === 0 ? 2000 : 1500),
  exceedsCap: i === 2 || i === 7
}));

export const OTApprovalsList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<OTType | 'APPROVED' | 'REJECTED'>('PRE_APPROVAL');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    return MOCK_DATA.filter(item => {
      const matchesTab = 
        activeTab === 'APPROVED' ? item.status === 'APPROVED' :
        activeTab === 'REJECTED' ? item.status === 'REJECTED' :
        item.type === activeTab;
      const matchesSearch = item.employee.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  const totalPendingHours = MOCK_DATA.reduce((acc, curr) => acc + curr.hours, 0);
  const totalEstimatedCost = MOCK_DATA.reduce((acc, curr) => acc + curr.estimatedCost, 0);

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-hidden">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">OT Approvals</h2>
          <p className="text-sm text-gray-500 font-medium">Manage and authorize overtime compensation</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3E3B6F]" size={16} />
            <input 
              type="text" 
              placeholder="Filter employee..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium w-64 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5 focus:border-[#3E3B6F] transition-all"
            />
          </div>
          <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* SUMMARY BAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-[#3E3B6F]/20 transition-all">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Pending Hours</p>
            <p className="text-2xl font-black text-[#3E3B6F]">{totalPendingHours}h</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
            <Clock size={24} />
          </div>
        </div>
        <div className="bg-[#3E3B6F] p-5 rounded-3xl shadow-xl shadow-[#3E3B6F]/10 flex items-center justify-between text-white relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Est. Payroll Impact</p>
            <p className="text-2xl font-black text-[#E8D5A3]">PKR {totalEstimatedCost.toLocaleString()}</p>
          </div>
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-[#E8D5A3] relative z-10">
            <DollarSign size={24} />
          </div>
          <BarChart2 size={80} className="absolute -right-4 -bottom-4 text-white/5 opacity-20" />
        </div>
        <div className="bg-orange-50 p-5 rounded-3xl border border-orange-100 flex items-center justify-between group">
          <div>
            <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Policy Exceptions</p>
            <p className="text-2xl font-black text-orange-600">2 Alerts</p>
          </div>
          <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-500 animate-pulse">
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-2xl p-1 mb-6 shadow-sm shrink-0">
        {[
          { id: 'PRE_APPROVAL', label: 'Pre-Approval', count: 8 },
          { id: 'POST_APPROVAL', label: 'Post-Approval', count: 7 },
          { id: 'APPROVED', label: 'Approved', count: null },
          { id: 'REJECTED', label: 'Rejected', count: null },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === tab.id
                ? 'bg-[#3E3B6F] text-white shadow-lg' 
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {tab.label}
            {tab.count !== null && (
              <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ACTION BAR */}
      {selectedIds.size > 0 && (
        <div className="mb-4 p-4 bg-[#3E3B6F] rounded-2xl flex items-center justify-between animate-in slide-in-from-top-4 duration-300 shadow-2xl">
          <div className="flex items-center gap-6 pl-2">
            <div>
               <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Selected</p>
               <p className="text-sm font-black text-white leading-none">{selectedIds.size} Requests</p>
            </div>
            <div className="h-8 w-px bg-white/10"></div>
            <div>
               <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Batch Cost</p>
               <p className="text-sm font-black text-[#E8D5A3] leading-none">PKR 14,250</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-6 py-2.5 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-all flex items-center gap-2">
              <CheckCircle2 size={14} /> Batch Authorize
            </button>
            <button onClick={() => setSelectedIds(new Set())} className="p-2.5 text-white/40 hover:text-white">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="flex-1 bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col relative">
        <div className="overflow-auto custom-scrollbar flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-20 bg-gray-50/90 backdrop-blur-md border-b border-gray-100">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-4 w-12">
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
                <th className="px-6 py-4 text-center">Date</th>
                <th className="px-6 py-4">OT Hours & Rate</th>
                <th className="px-6 py-4">Reason & Type</th>
                <th className="px-6 py-4 text-right">Est. Cost</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredItems.map((item) => (
                <tr key={item.id} className={`group hover:bg-gray-50/80 transition-all ${selectedIds.has(item.id) ? 'bg-[#3E3B6F]/5' : ''}`}>
                  <td className="px-6 py-4">
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
                      <div>
                        <p className="text-xs font-bold text-gray-800">{item.employee}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">{item.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-[11px] font-bold text-gray-500 tabular-nums">{item.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-gray-800 tabular-nums">{item.hours}h</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${item.multiplier === 2.0 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                          {item.multiplier}x Rate
                        </span>
                      </div>
                      {item.exceedsCap && (
                        <div className="flex items-center gap-1 text-[9px] font-bold text-orange-600">
                          <AlertTriangle size={10} /> Exceeds daily 4h cap
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <p className="text-[11px] font-bold text-gray-800 truncate">{item.reason}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[9px] font-black uppercase tracking-widest ${item.type === 'PRE_APPROVAL' ? 'text-blue-500' : 'text-purple-500'}`}>
                        {item.type.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-sm font-black text-[#3E3B6F] tabular-nums">PKR {item.estimatedCost.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-500 hover:text-white transition-all shadow-sm">
                        <Check size={14} />
                      </button>
                      <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm">
                        <X size={14} />
                      </button>
                      <button className="p-2 bg-white border border-gray-200 text-gray-400 rounded-lg hover:text-[#3E3B6F] hover:border-[#3E3B6F] transition-all">
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* FOOTER */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Pending: {MOCK_DATA.length} requests</span>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all">
              <Download size={14} /> Payroll Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all">
              <TrendingUp size={14} /> Forecasting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
