
import React, { useState, useMemo } from 'react';
import { 
  Plus, Search, Filter, FileSpreadsheet, ArrowUpRight, 
  ArrowDownRight, MoreHorizontal, Eye, RotateCcw, 
  ChevronRight, Calendar, Info, CheckCircle2, Clock, 
  XCircle, User, Database, ShieldCheck
} from 'lucide-react';
import { BalanceAdjustmentForm } from './BalanceAdjustmentForm';

interface Adjustment {
  id: string;
  date: string;
  employee: string;
  avatar: string;
  leaveType: string;
  type: 'Credit' | 'Debit';
  amount: number;
  reason: 'Correction' | 'Joining Bonus' | 'Policy Change' | 'Manual' | 'Exception';
  adjustedBy: string;
  status: 'Applied' | 'Pending' | 'Rejected';
  description: string;
}

const MOCK_ADJUSTMENTS: Adjustment[] = Array.from({ length: 25 }, (_, i) => ({
  id: `ADJ-2025-${500 + i}`,
  date: 'Feb 12, 2025',
  employee: ['Ahmed Khan', 'Sara Miller', 'Tom Chen', 'Anna Bell', 'Zoya Malik'][i % 5],
  avatar: ['AK', 'SM', 'TC', 'AB', 'ZM'][i % 5],
  leaveType: ['Annual Leave', 'Casual Leave', 'Sick Leave', 'Comp-Off'][i % 4],
  type: i % 3 === 0 ? 'Debit' : 'Credit',
  amount: (i % 5) + 1,
  reason: ['Correction', 'Joining Bonus', 'Policy Change', 'Manual', 'Exception'][i % 5] as any,
  adjustedBy: 'Sarah Admin',
  status: i < 3 ? 'Pending' : i === 4 ? 'Rejected' : 'Applied',
  description: 'Manual correction for carry-forward mismatch from previous system.'
}));

export const BalanceAdjustmentsList = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filteredData = useMemo(() => {
    return MOCK_ADJUSTMENTS.filter(adj => {
      const matchesSearch = adj.employee.toLowerCase().includes(search.toLowerCase()) || adj.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || adj.status === statusFilter;
      const matchesType = typeFilter === 'All' || adj.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [search, statusFilter, typeFilter]);

  const getReasonBadge = (reason: Adjustment['reason']) => {
    switch (reason) {
      case 'Correction': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Joining Bonus': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'Policy Change': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'Exception': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const getStatusStyle = (status: Adjustment['status']) => {
    switch (status) {
      case 'Applied': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Rejected': return 'bg-red-50 text-red-700 border-red-200';
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500 font-['League_Spartan']">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-[#3E3B6F]">Balance Adjustments</h2>
          <p className="text-gray-500 font-medium">Manual overrides and audit-trail adjustments for leave entitlements.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 text-gray-600 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm">
            <FileSpreadsheet size={18} className="text-emerald-600" /> Export Excel
          </button>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-[#3E3B6F] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#4A4680] shadow-lg shadow-[#3E3B6F]/20 transition-all active:scale-95"
          >
            <Plus size={18} /> New Adjustment
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="p-4 bg-indigo-50 text-[#3E3B6F] rounded-2xl"><Calendar size={24}/></div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Adjustments This Month</p>
            <p className="text-2xl font-bold text-gray-900">15</p>
            <p className="text-[10px] text-gray-400 font-medium italic">Across all leave types</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl"><Database size={24}/></div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Net Days Adjusted</p>
            <p className="text-2xl font-bold text-emerald-600">+12.0 <span className="text-sm">Days</span></p>
            <p className="text-[10px] text-gray-400 font-medium italic">Total Credits - Debits</p>
          </div>
        </div>
        <div className="bg-[#3E3B6F] p-6 rounded-[32px] shadow-lg shadow-[#3E3B6F]/20 flex items-center gap-5 text-white relative overflow-hidden">
          <div className="p-4 bg-white/10 text-[#E8D5A3] rounded-2xl relative z-10"><Clock size={24}/></div>
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Pending Approvals</p>
            <p className="text-2xl font-bold text-white">3 Requests</p>
            <p className="text-[10px] text-[#E8D5A3] font-bold uppercase tracking-tighter">Requires HR Head Review</p>
          </div>
          <ShieldCheck size={120} className="absolute -right-8 -bottom-8 opacity-5 -rotate-12" />
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        {/* Filters Header */}
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/30 space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by Employee name or Adjustment ID..." 
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#3E3B6F]/10 transition-all shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <select 
                className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold text-gray-600 outline-none shadow-sm"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="Credit">Credit Only</option>
                <option value="Debit">Debit Only</option>
              </select>
              <select 
                className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold text-gray-600 outline-none shadow-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Applied">Applied</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
              <button className="p-3 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-[#3E3B6F] transition-all shadow-sm">
                <Filter size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID / Date</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Employee</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Leave Type</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Amount</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reason Category</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Adjusted By</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((adj) => (
                <tr key={adj.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <p className="text-xs font-bold text-[#3E3B6F] font-mono">{adj.id}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{adj.date}</p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-accent-peach flex items-center justify-center font-bold text-[#3E3B6F] text-xs">
                        {adj.avatar}
                      </div>
                      <span className="text-sm font-bold text-gray-900">{adj.employee}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-medium text-gray-700">{adj.leaveType}</span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className={`inline-flex items-center gap-1 font-bold text-sm ${adj.type === 'Credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {adj.type === 'Credit' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {adj.type === 'Credit' ? `+${adj.amount}` : `-${adj.amount}`}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getReasonBadge(adj.reason)}`}>
                      {adj.reason}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-medium text-gray-500">{adj.adjustedBy}</span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(adj.status)}`}>
                      {adj.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="relative inline-block group/menu">
                      <button className="p-2 text-gray-400 hover:text-[#3E3B6F] hover:bg-gray-100 rounded-lg transition-all">
                        <MoreHorizontal size={18} />
                      </button>
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl invisible group-hover/menu:visible opacity-0 group-hover/menu:opacity-100 transition-all z-20">
                         <div className="p-2 space-y-1">
                           <button className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 rounded-lg text-left transition-colors"><Eye size={14}/> View Details</button>
                           {adj.status === 'Applied' && (
                             <button className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg text-left transition-colors"><RotateCcw size={14}/> Reverse Entry</button>
                           )}
                           <div className="h-px bg-gray-50 my-1" />
                           <button className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 rounded-lg text-left transition-colors"><Info size={14}/> Audit Trail</button>
                         </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between">
           <p className="text-xs text-gray-500 font-medium">Showing <span className="font-bold">25</span> of <span className="font-bold">142</span> records</p>
           <div className="flex items-center gap-2">
             <button className="p-2 border border-gray-200 rounded-lg bg-white text-gray-400 cursor-not-allowed"><ChevronRight size={18} className="rotate-180" /></button>
             <div className="flex gap-1">
               <button className="w-8 h-8 rounded-lg bg-[#3E3B6F] text-white text-xs font-bold shadow-md shadow-[#3E3B6F]/10">1</button>
               <button className="w-8 h-8 rounded-lg hover:bg-white border border-transparent hover:border-gray-200 text-gray-500 text-xs font-bold">2</button>
               <button className="w-8 h-8 rounded-lg hover:bg-white border border-transparent hover:border-gray-200 text-gray-500 text-xs font-bold">3</button>
             </div>
             <button className="p-2 border border-gray-200 rounded-lg bg-white text-gray-500 hover:bg-gray-50"><ChevronRight size={18} /></button>
           </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-amber-50 p-6 rounded-[32px] border border-amber-100 flex items-start gap-4">
        <Info className="text-amber-500 shrink-0 mt-0.5" size={20} />
        <div>
          <h5 className="text-sm font-bold text-amber-900 mb-1">Administrative Override Note</h5>
          <p className="text-xs text-amber-800/70 leading-relaxed font-medium">
            Balance adjustments should only be used for correcting system errors, processing joining bonuses, or applying legal policy changes. Every adjustment generates a mandatory entry in the <span className="font-bold underline cursor-pointer">Balance Ledger</span> and is flagged in the monthly Payroll Audit.
          </p>
        </div>
      </div>

      <BalanceAdjustmentForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
};
