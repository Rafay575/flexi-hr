
import React, { useState } from 'react';
import { 
  Gift, Plus, MoreHorizontal, Eye, Edit3, Copy, Play, 
  Power, Info, CheckCircle2, Search, Filter, Zap, 
  Clock, AlertCircle, ChevronRight, ArrowUpRight
} from 'lucide-react';
import { IncentiveRuleForm } from './IncentiveRuleForm';

interface IncentiveRule {
  id: string;
  name: string;
  window: 'Monthly' | 'Quarterly' | 'Annual';
  conditions: string[];
  award: string;
  eligibleCount: number;
  status: 'Active' | 'Inactive';
  lastProcessed?: string;
}

const MOCK_INCENTIVES: IncentiveRule[] = [
  {
    id: 'INC-001',
    name: 'Perfect Attendance Bonus',
    window: 'Monthly',
    conditions: ['No unpaid', '0 lates', 'No short leave'],
    award: '1 day Annual Leave',
    eligibleCount: 142,
    status: 'Active',
    lastProcessed: 'Jan 02, 2025'
  },
  {
    id: 'INC-002',
    name: 'Punctuality Award',
    window: 'Monthly',
    conditions: ['< 3 lates', 'No unauthorized'],
    award: '0.5 day Casual Leave',
    eligibleCount: 310,
    status: 'Active',
    lastProcessed: 'Jan 02, 2025'
  },
  {
    id: 'INC-003',
    name: 'Quarterly Wellness Reward',
    window: 'Quarterly',
    conditions: ['< 2 sick days', 'No lates'],
    award: '2 days Annual Leave',
    eligibleCount: 88,
    status: 'Active',
    lastProcessed: 'Oct 05, 2024'
  },
  {
    id: 'INC-004',
    name: 'Loyalty Leave Credit',
    window: 'Annual',
    conditions: ['Tenure > 12m', 'Rating > 4.0'],
    award: '5 days Annual Leave',
    eligibleCount: 215,
    status: 'Inactive'
  }
];

export const IncentiveRulesList = () => {
  const [rules] = useState<IncentiveRule[]>(MOCK_INCENTIVES);
  const [isRunning, setIsRunning] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<any>(null);

  const handleRunNow = (id: string) => {
    setIsRunning(id);
    setTimeout(() => setIsRunning(null), 2000);
  };

  const handleEdit = (rule: IncentiveRule) => {
    setEditingRule(rule);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingRule(null);
    setIsFormOpen(true);
  };

  const getWindowBadge = (window: string) => {
    switch (window) {
      case 'Monthly': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Quarterly': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'Annual': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500 font-['League_Spartan']">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-[#3E3B6F] rounded-2xl">
            <Gift size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#3E3B6F]">Earned Leave Incentive Rules</h2>
            <p className="text-gray-500 font-medium">Automate leave credits based on attendance and performance benchmarks.</p>
          </div>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-[#3E3B6F] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#4A4680] shadow-lg shadow-[#3E3B6F]/20 transition-all active:scale-95"
        >
          <Plus size={18} /> Create Rule
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-[24px] p-5 flex items-start gap-4">
        <div className="p-2 bg-white rounded-lg text-[#3E3B6F] shadow-sm">
          <Info size={20} />
        </div>
        <p className="text-sm text-indigo-900 font-medium leading-relaxed">
          Incentive awards are processed after <span className="font-bold">payroll lock</span> to ensure accurate attendance data. Once processed, credits are immediately added to the employee's chosen leave balance.
        </p>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/30 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search rules..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#3E3B6F]/10 transition-all shadow-sm"
            />
          </div>
          <button className="p-2.5 text-gray-400 hover:text-[#3E3B6F] transition-colors bg-white border border-gray-200 rounded-xl shadow-sm">
            <Filter size={20} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rule Name</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Window</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Conditions</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Award</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Eligible</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rules.map((rule) => (
                <tr key={rule.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-gray-900">{rule.name}</p>
                    <p className="text-[10px] text-gray-400 font-mono">{rule.id}</p>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getWindowBadge(rule.window)}`}>
                      {rule.window}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-wrap gap-1.5">
                      {rule.conditions.map((c, i) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[9px] font-bold rounded-md border border-gray-200 uppercase">
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="flex flex-col items-center">
                      <Zap size={14} className="text-amber-500 mb-1" />
                      <p className="text-xs font-bold text-[#3E3B6F] whitespace-nowrap">{rule.award}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <p className="text-sm font-bold text-gray-800">{rule.eligibleCount}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase">Staff</p>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      rule.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {rule.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="relative inline-block group/menu">
                      <button className="p-2 text-gray-400 hover:text-[#3E3B6F] hover:bg-gray-100 rounded-lg transition-all">
                        <MoreHorizontal size={18} />
                      </button>
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl invisible group-hover/menu:visible opacity-0 group-hover/menu:opacity-100 transition-all z-20">
                         <div className="p-2 space-y-1">
                           <button className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 rounded-lg transition-colors text-left"><Eye size={14}/> View Analytics</button>
                           <button 
                            onClick={() => handleEdit(rule)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 rounded-lg transition-colors text-left"
                           >
                            <Edit3 size={14}/> Edit Rule
                           </button>
                           <button className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 rounded-lg transition-colors text-left"><Copy size={14}/> Clone Rule</button>
                           {rule.status === 'Active' && (
                             <button 
                              onClick={() => handleRunNow(rule.id)}
                              disabled={!!isRunning}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-left"
                             >
                               {isRunning === rule.id ? <Clock size={14} className="animate-spin" /> : <Play size={14}/>}
                               Run Now
                             </button>
                           )}
                           <div className="h-px bg-gray-50 my-1" />
                           <button className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"><Power size={14}/> Deactivate</button>
                         </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-500" /> Compliance Notes
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed font-medium">
            Rule triggers are cross-checked with the <span className="font-bold">TimeSync</span> and <span className="font-bold">PayEdge</span> modules. All incentive distributions generate an audit trail item in the employee's Balance Ledger.
          </p>
          <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
             <button className="text-xs font-bold text-[#3E3B6F] hover:underline flex items-center gap-2">
               View Distribution History <ChevronRight size={14} />
             </button>
             <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">ISO 27001 Verified</span>
          </div>
        </div>

        <div className="bg-[#3E3B6F] rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 space-y-4">
            <h4 className="text-xl font-bold">Upcoming Batch</h4>
            <p className="text-white/60 text-sm">Feb 2025 incentives will be calculated automatically on Mar 02. Projected staff eligible: <span className="text-[#E8D5A3] font-bold">~420</span>.</p>
            <button className="bg-white/10 hover:bg-white/20 border border-white/10 px-6 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2">
              Preview February Awards <ArrowUpRight size={14} />
            </button>
          </div>
          <AlertCircle className="absolute -bottom-10 -right-10 text-white/5 w-64 h-64 -rotate-12" />
        </div>
      </div>

      <IncentiveRuleForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} initialData={editingRule} />
    </div>
  );
};
