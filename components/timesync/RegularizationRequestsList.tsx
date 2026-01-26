
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  History, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  FileText, 
  AlertTriangle,
  Download,
  Trash2,
  Check,
  X,
  MoreVertical,
  Calendar,
  Zap,
  ShieldCheck,
  Smartphone
} from 'lucide-react';

type RegularizationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
type IssueType = 'MISSING_IN' | 'MISSING_OUT' | 'WRONG_TIME' | 'LOCATION' | 'DEVICE';

interface RegularizationRequest {
  id: string;
  employee: string;
  avatar: string;
  date: string;
  issueType: IssueType;
  submittedAt: string;
  status: RegularizationStatus;
  original: { in: string; out: string; status: string };
  proposed: { in: string; out: string; status: string };
  reason: string;
}

const ISSUE_CONFIG: Record<IssueType, { label: string; color: string }> = {
  MISSING_IN: { label: 'Missing In', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  MISSING_OUT: { label: 'Missing Out', color: 'bg-orange-50 text-orange-600 border-orange-100' },
  WRONG_TIME: { label: 'Wrong Time', color: 'bg-purple-50 text-purple-600 border-purple-100' },
  LOCATION: { label: 'Location Issue', color: 'bg-red-50 text-red-600 border-red-100' },
  DEVICE: { label: 'Device Failure', color: 'bg-gray-100 text-gray-600 border-gray-200' },
};

const MOCK_DATA: RegularizationRequest[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `REG-${2000 + i}`,
  employee: ['Sarah Chen', 'James Wilson', 'Ahmed Khan', 'Priya Das', 'Elena Frost', 'Marcus Low'][i % 6],
  avatar: ['SC', 'JW', 'AK', 'PD', 'EF', 'ML'][i % 6],
  date: `Jan ${10 - (i % 5)}, 2025`,
  issueType: (['MISSING_IN', 'MISSING_OUT', 'WRONG_TIME', 'LOCATION', 'DEVICE'] as IssueType[])[i % 5],
  submittedAt: 'Jan 11, 10:30 AM',
  status: i < 5 ? 'PENDING' : i < 15 ? 'APPROVED' : 'REJECTED',
  original: { in: '09:00 AM', out: i % 5 === 1 ? 'MISSING' : '05:00 PM', status: 'Incomplete' },
  proposed: { in: '09:00 AM', out: '06:30 PM', status: 'Present' },
  reason: i % 2 === 0 ? "Internet connectivity issue at remote location." : "Forgot to punch out while leaving for emergency."
}));

export const RegularizationRequestsList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<RegularizationStatus | 'ALL'>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [items, setItems] = useState(MOCK_DATA);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesTab = activeTab === 'ALL' || item.status === activeTab;
      const matchesSearch = item.employee.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [items, activeTab, searchQuery]);

  const toggleRow = (id: string) => {
    const next = new Set(expandedRows);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedRows(next);
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleBulkAction = (newStatus: RegularizationStatus) => {
    setItems(prev => prev.map(item => 
      selectedIds.has(item.id) ? { ...item, status: newStatus } : item
    ));
    setSelectedIds(new Set());
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-hidden">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Regularization Requests</h2>
          <p className="text-sm text-gray-500 font-medium">Review and audit attendance correction claims</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3E3B6F]" size={16} />
            <input 
              type="text" 
              placeholder="Search employee..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium w-64 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5 focus:border-[#3E3B6F] transition-all"
            />
          </div>
          <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-2xl p-1 mb-6 shadow-sm shrink-0">
        {(['PENDING', 'APPROVED', 'REJECTED', 'ALL'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === tab
                ? 'bg-[#3E3B6F] text-white shadow-lg' 
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
            <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black ${
              activeTab === tab ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              {tab === 'ALL' ? items.length : items.filter(i => i.status === tab).length}
            </span>
          </button>
        ))}
      </div>

      {/* ACTION BAR */}
      {selectedIds.size > 0 && (
        <div className="mb-4 p-3 bg-white border border-[#3E3B6F] rounded-2xl flex items-center justify-between animate-in slide-in-from-top-4 duration-300 shadow-xl">
          <div className="flex items-center gap-4 pl-3">
            <span className="text-xs font-black text-[#3E3B6F] uppercase tracking-widest">{selectedIds.size} Selected</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => handleBulkAction('APPROVED')}
              className="px-6 py-2 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-all flex items-center gap-2"
            >
              <Check size={14} /> Approve Selected
            </button>
            <button 
              onClick={() => handleBulkAction('REJECTED')}
              className="px-6 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all flex items-center gap-2"
            >
              <X size={14} /> Reject Selected
            </button>
            <button onClick={() => setSelectedIds(new Set())} className="p-2 text-gray-400 hover:text-gray-600">
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
                <th className="px-6 py-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    onChange={(e) => {
                      if (e.target.checked) setSelectedIds(new Set(filteredItems.map(i => i.id)));
                      else setSelectedIds(new Set());
                    }}
                    checked={selectedIds.size === filteredItems.length && filteredItems.length > 0}
                    className="w-4 h-4 rounded border-gray-300 text-[#3E3B6F]"
                  />
                </th>
                <th className="px-6 py-4">ID & Employee</th>
                <th className="px-6 py-4 text-center">Date</th>
                <th className="px-6 py-4">Issue Type</th>
                <th className="px-6 py-4">Proposed Correction</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredItems.map((item) => {
                const isExpanded = expandedRows.has(item.id);
                const isSelected = selectedIds.has(item.id);
                const config = ISSUE_CONFIG[item.issueType];

                return (
                  <React.Fragment key={item.id}>
                    <tr 
                      onClick={() => toggleRow(item.id)}
                      className={`group cursor-pointer transition-all ${isExpanded ? 'bg-gray-50/50' : 'hover:bg-gray-50/80'} ${isSelected ? 'bg-[#3E3B6F]/5' : ''}`}
                    >
                      <td className="px-6 py-4 text-center">
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onClick={(e) => toggleSelect(item.id, e)}
                          onChange={() => {}}
                          className="w-4 h-4 rounded border-gray-300 text-[#3E3B6F]"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary-gradient flex items-center justify-center text-white text-[10px] font-black">
                            {item.avatar}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-800">{item.employee}</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase">{item.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-[11px] font-bold text-gray-500 tabular-nums">{item.date}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${config.color}`}>
                          {config.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-800">
                          <span className="text-gray-400 line-through">MISSING</span>
                          <ArrowRight size={12} className="text-blue-500" />
                          <span className="text-blue-600">{item.proposed.out}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                          item.status === 'PENDING' ? 'text-orange-500' : 
                          item.status === 'APPROVED' ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-gray-400 hover:text-[#3E3B6F] transition-all">
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* EXPANDED CONTENT */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={7} className="px-10 py-8 bg-white border-b border-gray-100">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in slide-in-from-top-2 duration-300">
                            {/* COMPARISON */}
                            <div className="space-y-4">
                              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Zap size={14} className="text-[#3E3B6F]" /> Proposed vs System Data
                              </h4>
                              <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden shadow-inner">
                                <div className="grid grid-cols-3 p-3 bg-gray-100/50 text-[9px] font-black text-gray-400 uppercase">
                                  <div>Metric</div>
                                  <div>Current Record</div>
                                  <div>Proposed Correction</div>
                                </div>
                                <div className="divide-y divide-gray-100">
                                  <div className="grid grid-cols-3 p-4 text-xs font-bold">
                                    <div className="text-gray-500">Punch In</div>
                                    <div>{item.original.in}</div>
                                    <div className="text-blue-600">{item.proposed.in}</div>
                                  </div>
                                  <div className="grid grid-cols-3 p-4 text-xs font-bold bg-blue-50/30">
                                    <div className="text-gray-500">Punch Out</div>
                                    <div className="text-red-500 italic">{item.original.out}</div>
                                    <div className="text-green-600 font-black">{item.proposed.out}</div>
                                  </div>
                                  <div className="grid grid-cols-3 p-4 text-xs font-bold">
                                    <div className="text-gray-500">Status</div>
                                    <div className="text-orange-500">{item.original.status}</div>
                                    <div className="text-green-600 font-black">{item.proposed.status} ✓</div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* AUDIT & REASON */}
                            <div className="space-y-6">
                              <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                                <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                                  <FileText size={14} /> Employee Reason
                                </h4>
                                <p className="text-xs text-gray-700 italic font-medium leading-relaxed">
                                  "{item.reason}"
                                </p>
                              </div>
                              
                              <div className="space-y-3">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Auto-Verification Results</h4>
                                <div className="flex flex-col gap-2">
                                  <div className="flex items-center gap-2 text-[10px] font-bold text-green-600 bg-green-50 p-2 rounded-lg border border-green-100">
                                    <ShieldCheck size={14} /> Submitted within 72h window
                                  </div>
                                  <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600 bg-blue-50 p-2 rounded-lg border border-blue-100">
                                    <Smartphone size={14} /> Geolocation matches Office HQ (Jan 10)
                                  </div>
                                </div>
                              </div>

                              <div className="flex gap-2 pt-4">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setItems(prev => prev.map(i => i.id === item.id ? {...i, status: 'APPROVED'} : i)) }}
                                  className="flex-1 py-3 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-100 hover:scale-[1.02] transition-all"
                                >
                                  Approve Correction
                                </button>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setItems(prev => prev.map(i => i.id === item.id ? {...i, status: 'REJECTED'} : i)) }}
                                  className="flex-1 py-3 bg-white border border-gray-200 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all"
                                >
                                  Reject
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
          {filteredItems.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center p-20 text-center opacity-30">
              <History size={64} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-black uppercase tracking-widest text-gray-500">No Requests Found</h3>
              <p className="text-sm font-medium mt-2">Adjust your filters or search criteria.</p>
            </div>
          )}
        </div>
        
        {/* FOOTER */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Showing {filteredItems.length} of {items.length} requests</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all">
            <Download size={14} /> Export Audit Log
          </button>
        </div>
      </div>
    </div>
  );
};
