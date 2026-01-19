
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowRightLeft, 
  Timer, 
  History, 
  Zap, 
  ChevronRight, 
  AlertTriangle, 
  UserPlus, 
  MoreHorizontal,
  Mail,
  ShieldAlert,
  Calendar,
  Check,
  X,
  Keyboard,
  Settings2,
  Download,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import { ApprovalDetailModal, RequestType } from './ApprovalDetailModal';

type ApprovalType = 'REGULARIZATION' | 'OT' | 'SWAP' | 'MANUAL' | 'ROSTER' | 'RETRO';

interface ApprovalItem {
  id: string;
  employee: string;
  avatar: string;
  type: ApprovalType;
  details: string;
  date: string;
  slaHours: number;
  status: 'PENDING' | 'ESCALATED' | 'DELEGATED' | 'COMPLETED';
}

const TYPE_CONFIG: Record<ApprovalType, { label: string, color: string, icon: React.ReactNode }> = {
  REGULARIZATION: { label: 'Regularization', color: 'bg-blue-50 text-blue-600 border-blue-100', icon: <History size={14} /> },
  OT: { label: 'OT Request', color: 'bg-green-50 text-green-600 border-green-100', icon: <Clock size={14} /> },
  SWAP: { label: 'Shift Swap', color: 'bg-purple-50 text-purple-600 border-purple-100', icon: <ArrowRightLeft size={14} /> },
  MANUAL: { label: 'Manual Punch', color: 'bg-orange-50 text-orange-600 border-orange-100', icon: <Zap size={14} /> },
  ROSTER: { label: 'Roster Change', color: 'bg-gray-100 text-gray-600 border-gray-200', icon: <Calendar size={14} /> },
  RETRO: { label: 'Retro Correction', color: 'bg-red-50 text-red-600 border-red-100', icon: <ShieldAlert size={14} /> },
};

const MOCK_DATA: ApprovalItem[] = Array.from({ length: 25 }).map((_, i) => ({
  id: `REQ-${1000 + i}`,
  employee: ['Ahmed Khan', 'Sarah Chen', 'James Wilson', 'Priya Das', 'Marcus Low', 'Elena Frost'][i % 6],
  avatar: ['AK', 'SC', 'JW', 'PD', 'ML', 'EF'][i % 6],
  type: (['REGULARIZATION', 'OT', 'SWAP', 'MANUAL', 'ROSTER', 'RETRO'] as ApprovalType[])[i % 6],
  details: i % 2 === 0 ? 'Missing Out Punch (Jan 10)' : 'Project Deadline Extension',
  date: `Jan ${10 - (i % 5)}, 2025`,
  slaHours: Math.floor(Math.random() * 48),
  status: i === 0 ? 'ESCALATED' : i === 1 ? 'DELEGATED' : 'PENDING'
}));

export const ApprovalsInbox: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'MY_QUEUE' | 'ESCALATED' | 'DELEGATED' | 'COMPLETED'>('ALL');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState(MOCK_DATA);
  
  // Modal State
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<{ id: string, type: RequestType } | null>(null);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIds.size === 0) return;
      if (e.key.toLowerCase() === 'a') handleAction('APPROVE');
      if (e.key.toLowerCase() === 'r') handleAction('REJECT');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIds]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesTab = activeTab === 'ALL' || item.status === activeTab;
      const matchesSearch = item.employee.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [items, activeTab, searchQuery]);

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleAction = (action: 'APPROVE' | 'REJECT') => {
    setItems(prev => prev.filter(item => !selectedIds.has(item.id)));
    setSelectedIds(new Set());
  };

  const openDetails = (id: string, type: ApprovalType) => {
    // Map internal types to Modal supported types
    const modalType: RequestType = (type === 'REGULARIZATION' || type === 'MANUAL' || type === 'RETRO') ? 'REGULARIZATION' : 
                                   (type === 'OT' ? 'OT' : 'SWAP');
    setSelectedDetail({ id, type: modalType });
    setIsDetailModalOpen(true);
  };

  const getSlaInfo = (hours: number) => {
    if (hours < 4) return { text: `${hours}h remaining`, color: 'text-red-500 bg-red-50' };
    if (hours < 12) return { text: `${hours}h remaining`, color: 'text-orange-500 bg-orange-50' };
    return { text: `${hours}h remaining`, color: 'text-green-600 bg-green-50' };
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-hidden">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Approvals Inbox</h2>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Stats:</span>
            <div className="flex gap-3">
              <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1"><CheckCircle2 size={12} className="text-green-500" /> Total: 25</span>
              <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1"><AlertTriangle size={12} className="text-red-500" /> Overdue: 3</span>
              <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1"><Clock size={12} className="text-blue-500" /> Avg Response: 4.2h</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3E3B6F]" size={16} />
            <input 
              type="text" 
              placeholder="Search employee or ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium w-64 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5 focus:border-[#3E3B6F] transition-all"
            />
          </div>
          <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50">
            <Settings2 size={18} />
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-2xl p-1 mb-6 shadow-sm shrink-0">
        {[
          { id: 'ALL', label: 'All Pending', count: 25 },
          { id: 'MY_QUEUE', label: 'My Queue', count: 15 },
          { id: 'ESCALATED', label: 'Escalated', count: 3 },
          { id: 'DELEGATED', label: 'Delegated', count: 2 },
          { id: 'COMPLETED', label: 'Completed', count: null },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-xl transition-all ${
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
        <div className="mb-4 p-3 bg-[#3E3B6F] rounded-2xl flex items-center justify-between animate-in slide-in-from-top-4 duration-300 shadow-xl shadow-[#3E3B6F]/20">
          <div className="flex items-center gap-4 pl-3">
            <span className="text-xs font-black text-white uppercase tracking-widest">{selectedIds.size} Items Selected</span>
            <div className="h-4 w-px bg-white/20"></div>
            <div className="flex items-center gap-2 text-white/60 text-[10px] font-bold">
              <Keyboard size={14} /> 
              <span>Press <kbd className="bg-white/10 px-1 rounded text-white border border-white/20">A</kbd> to Approve or <kbd className="bg-white/10 px-1 rounded text-white border border-white/20">R</kbd> to Reject</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => handleAction('APPROVE')}
              className="px-6 py-2 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-all flex items-center gap-2"
            >
              <Check size={14} /> Batch Approve
            </button>
            <button className="px-6 py-2 bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all flex items-center gap-2">
              <UserPlus size={14} /> Delegate
            </button>
            <button 
              onClick={() => setSelectedIds(new Set())}
              className="p-2 text-white/60 hover:text-white transition-all"
            >
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
                <th className="px-6 py-4">Request Type</th>
                <th className="px-6 py-4">Summary & Details</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-center">SLA</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredItems.map((item) => {
                const sla = getSlaInfo(item.slaHours);
                const type = TYPE_CONFIG[item.type];
                const isSelected = selectedIds.has(item.id);
                
                return (
                  <tr key={item.id} className={`group hover:bg-gray-50/80 transition-all ${isSelected ? 'bg-[#3E3B6F]/5' : ''}`}>
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
                        <div className="w-8 h-8 rounded-lg bg-[#3E3B6F] flex items-center justify-center text-white text-[10px] font-black shadow-lg shadow-[#3E3B6F]/10">
                          {item.avatar}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-800 truncate">{item.employee}</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase">{item.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${type.color}`}>
                        {type.icon}
                        {type.label}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-[11px] font-bold text-gray-800 truncate">{item.details}</p>
                      <p className="text-[9px] text-gray-400 font-medium italic truncate mt-0.5">Automated validation: PASSED ✓</p>
                    </td>
                    <td className="px-6 py-4 text-[11px] font-bold text-gray-500 tabular-nums">{item.date}</td>
                    <td className="px-6 py-4">
                      <div className={`mx-auto w-fit px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${sla.color}`}>
                        {sla.text}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-500 hover:text-white transition-all shadow-sm" title="Quick Approve">
                          <Check size={14} />
                        </button>
                        <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm" title="Quick Reject">
                          <X size={14} />
                        </button>
                        <button 
                          onClick={() => openDetails(item.id, item.type)}
                          className="p-2 bg-white border border-gray-200 text-gray-400 rounded-lg hover:text-[#3E3B6F] hover:border-[#3E3B6F] transition-all"
                        >
                          <ExternalLink size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredItems.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center p-20 text-center opacity-30">
              <Mail size={64} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-black uppercase tracking-widest text-gray-500">Inbox Zero</h3>
              <p className="text-sm font-medium mt-2">All requests have been processed.</p>
            </div>
          )}
        </div>
        
        {/* FOOTER */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Showing 1-25 of 150 requests</span>
             <div className="flex gap-1">
               <button className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#3E3B6F] transition-all"><ChevronLeft size={16} /></button>
               <button className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#3E3B6F] transition-all"><ChevronRight size={16} /></button>
             </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all">
            <Download size={14} /> Download Batch Report
          </button>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedDetail && (
        <ApprovalDetailModal 
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          type={selectedDetail.type}
          requestId={selectedDetail.id}
        />
      )}
    </div>
  );
};
