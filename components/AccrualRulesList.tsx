
import React, { useState } from 'react';
import { 
  Clock, Play, Plus, Search, Filter, MoreHorizontal, Edit3, 
  History, Power, ChevronRight, Info, Calendar, RefreshCw,
  AlertCircle, CheckCircle2, Zap
} from 'lucide-react';
import { AccrualRuleForm } from './AccrualRuleForm';

interface AccrualRule {
  id: string;
  leaveType: string;
  frequency: 'Monthly' | 'Quarterly' | 'Annual' | 'On Join';
  amount: string;
  cap: string;
  proration: string;
  lapse: string;
  status: 'Active' | 'Inactive';
  lastRun: string;
}

const MOCK_RULES: AccrualRule[] = [
  { id: 'AC-1', leaveType: 'Annual Leave', frequency: 'Monthly', amount: '2.0 days/month', cap: '30 days max', proration: 'Join ✓ Exit ✓', lapse: 'End of year', status: 'Active', lastRun: 'Jan 1, 2025' },
  { id: 'AC-2', leaveType: 'Sick Leave', frequency: 'Monthly', amount: '1.0 days/month', cap: '12 days max', proration: 'Join ✓ Exit ✗', lapse: 'Never', status: 'Active', lastRun: 'Jan 1, 2025' },
  { id: 'AC-3', leaveType: 'Casual Leave', frequency: 'Annual', amount: '10.0 days/year', cap: '10 days max', proration: 'None', lapse: 'End of year', status: 'Active', lastRun: 'Jan 1, 2025' },
  { id: 'AC-4', leaveType: 'Maternity Leave', frequency: 'On Join', amount: '90.0 days', cap: 'No cap', proration: 'None', lapse: 'Never', status: 'Active', lastRun: 'N/A' },
  { id: 'AC-5', leaveType: 'Short Leave', frequency: 'Monthly', amount: '2.0 hours/month', cap: 'No cap', proration: 'None', lapse: 'After 3 months', status: 'Active', lastRun: 'Jan 1, 2025' },
  { id: 'AC-6', leaveType: 'Study Leave', frequency: 'On Join', amount: '15.0 days', cap: '15 days max', proration: 'None', lapse: 'Never', status: 'Inactive', lastRun: 'N/A' },
];

export const AccrualRulesList = () => {
  const [filterType, setFilterType] = useState('All');
  const [isRunning, setIsRunning] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AccrualRule | null>(null);

  const handleRunNow = () => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 2000);
  };

  const handleCreate = () => {
    setEditingRule(null);
    setIsFormOpen(true);
  };

  const handleEdit = (rule: AccrualRule) => {
    setEditingRule(rule);
    setIsFormOpen(true);
  };

  const getFreqBadge = (freq: string) => {
    switch (freq) {
      case 'Monthly': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Quarterly': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'Annual': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'On Join': return 'bg-orange-50 text-orange-600 border-orange-100';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-[#3E3B6F]">Accrual Rules</h2>
          <p className="text-gray-500 font-medium">Define automated logic for crediting employee leave balances.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-[#3E3B6F] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#4A4680] shadow-lg shadow-[#3E3B6F]/20 transition-all"
        >
          <Plus size={18} /> Create Rule
        </button>
      </div>

      {/* Accrual Scheduler Banner */}
      <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-[#3E3B6F] shadow-inner">
            <Calendar size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-700">Next scheduled accrual run:</p>
            <p className="text-xl font-bold text-[#3E3B6F]">Feb 1, 2025 at 12:00 AM</p>
          </div>
        </div>
        <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
          <div className="flex-1 md:flex-none text-right hidden sm:block">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">System Health</p>
            <p className="text-xs font-bold text-emerald-500 flex items-center gap-1 justify-end">
              <CheckCircle2 size={12} /> Connected to Payroll
            </p>
          </div>
          <button 
            onClick={handleRunNow}
            disabled={isRunning}
            className="flex-1 md:flex-none px-8 py-3 bg-[#E8D5A3] text-[#3E3B6F] font-bold rounded-2xl hover:bg-[#ebdcae] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#E8D5A3]/20 disabled:opacity-50"
          >
            {isRunning ? <RefreshCw size={18} className="animate-spin" /> : <Play size={18} />}
            {isRunning ? 'Processing...' : 'Run Now'}
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-full bg-gray-50/50 -skew-x-12 translate-x-32" />
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        {/* Table Filters */}
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/30 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search rules..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#3E3B6F]/10 transition-all"
            />
          </div>
          <select 
            className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All Leave Types</option>
            <option>Annual Leave</option>
            <option>Sick Leave</option>
            <option>Casual Leave</option>
          </select>
          <button className="p-2.5 text-gray-400 hover:text-[#3E3B6F] transition-colors bg-white border border-gray-200 rounded-xl">
            <Filter size={20} />
          </button>
        </div>

        {/* Rules Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Leave Type</th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Frequency</th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cap</th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Proration</th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lapse</th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_RULES.map((rule) => (
                <tr key={rule.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-6 rounded-full bg-[#3E3B6F]" />
                      <p className="text-sm font-bold text-gray-900">{rule.leaveType}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getFreqBadge(rule.frequency)}`}>
                      {rule.frequency}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-[#3E3B6F]">{rule.amount}</p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-medium text-gray-600">{rule.cap}</p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded inline-block">
                      {rule.proration}
                    </p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
                      <Clock size={12} className="text-gray-400" /> {rule.lapse}
                    </p>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                      rule.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
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
                           <button 
                            onClick={() => handleEdit(rule)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 rounded-lg"
                           >
                            <Edit3 size={14}/> Edit Rule
                           </button>
                           <button className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 rounded-lg"><History size={14}/> View History</button>
                           <div className="h-px bg-gray-50 my-1" />
                           <button className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg"><Power size={14}/> Deactivate</button>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Zap size={16} className="text-[#3E3B6F]" /> Pro-tip: Accrual Batching
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed font-medium">
            Accruals are calculated based on the employee's active service period. Use "On Join" for one-time quotas and "Monthly" for recurring entitlements. Proration ensures fair allocation for staff joining mid-period.
          </p>
          <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
             <button className="text-xs font-bold text-[#3E3B6F] hover:underline flex items-center gap-2">
               Learn about Proration Methods <ChevronRight size={14} />
             </button>
          </div>
        </div>

        <div className="bg-[#3E3B6F] p-8 rounded-[32px] text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 space-y-4">
            <h4 className="text-xl font-bold">Accrual Audit Logs</h4>
            <p className="text-white/60 text-sm">Review detailed records of every leave credit generated by the system for payroll auditing.</p>
            <button className="bg-white/10 hover:bg-white/20 border border-white/10 px-6 py-2.5 rounded-xl font-bold text-xs transition-all">
              View All Audit Logs
            </button>
          </div>
          <AlertCircle className="absolute -bottom-10 -right-10 text-white/5 w-64 h-64 -rotate-12" />
        </div>
      </div>

      {/* Form Modal */}
      <AccrualRuleForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        initialData={editingRule} 
      />
    </div>
  );
};
