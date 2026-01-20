
import React, { useState } from 'react';
import { 
  Calendar, ChevronLeft, ChevronRight, Download, Filter, 
  Search, MoreVertical, PauseCircle, Clock, CheckCircle2,
  BarChart3, Info, AlertCircle, X, Check
} from 'lucide-react';

interface RecoveryRecord {
  id: string;
  empId: string;
  empName: string;
  type: string;
  emi: number;
  outstanding: number;
  remainingInst: number;
  status: 'Scheduled' | 'Deferred' | 'Recovered';
}

const MOCK_RECOVERIES: RecoveryRecord[] = Array.from({ length: 45 }).map((_, i) => ({
  id: `L-2025-${500 - i}`,
  empId: `EMP-${1001 + i}`,
  empName: ['Arsalan Khan', 'Saira Ahmed', 'Umar Farooq', 'Zainab Bibi', 'Mustafa Kamal'][i % 5],
  type: i % 4 === 0 ? 'Car Loan' : i % 4 === 1 ? 'Salary Advance' : 'Personal Loan',
  emi: [15000, 25000, 5000, 45000][i % 4],
  outstanding: 150000 + (i * 10000),
  remainingInst: 5 + (i % 12),
  status: i === 3 ? 'Deferred' : i < 2 ? 'Recovered' : 'Scheduled'
}));

export const RecoverySchedule: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('January 2025');
  const [search, setSearch] = useState('');
  const [deferModalEmp, setDeferModalEmp] = useState<RecoveryRecord | null>(null);

  const stats = {
    totalLoans: 45,
    recoveryAmount: 582400,
    closingSoon: 3
  };

  const formatPKR = (val: number) => `PKR ${val.toLocaleString()}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Recovery Schedule</h2>
          <p className="text-sm text-gray-500">Monitor and manage loan deductions for the current payroll period</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
            <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400"><ChevronLeft size={18}/></button>
            <span className="text-sm font-black text-primary px-4 uppercase tracking-widest">{selectedPeriod}</span>
            <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400"><ChevronRight size={18}/></button>
          </div>
          <button className="bg-white border border-gray-200 px-4 py-2.5 rounded-lg font-bold text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-all">
            <Download size={18} /> Export Schedule
          </button>
        </div>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex items-center gap-5">
           <div className="p-4 bg-primary/5 text-primary rounded-2xl">
              <Clock size={28} />
           </div>
           <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Active Loans</p>
              <h4 className="text-3xl font-black text-gray-800">{stats.totalLoans}</h4>
           </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex items-center gap-5">
           <div className="p-4 bg-payroll-deduction/5 text-payroll-deduction rounded-2xl">
              <HandCoins size={28} />
           </div>
           <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Scheduled Recovery</p>
              <h4 className="text-3xl font-black text-payroll-deduction">{formatPKR(stats.recoveryAmount)}</h4>
           </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex items-center gap-5">
           <div className="p-4 bg-green-50 text-green-600 rounded-2xl">
              <CheckCircle2 size={28} />
           </div>
           <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Closing this Cycle</p>
              <h4 className="text-3xl font-black text-green-600">{stats.closingSoon}</h4>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Schedule Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between gap-4 bg-gray-50/30">
               <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search employee or loan ID..." 
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
               </div>
               <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50">
                  <Filter size={18} />
               </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    <th className="px-6 py-5">Employee Info</th>
                    <th className="px-6 py-5">Loan Type</th>
                    <th className="px-6 py-5 text-right">EMI Amount</th>
                    <th className="px-6 py-5 text-right">Outstanding</th>
                    <th className="px-6 py-5 text-center">Remaining</th>
                    <th className="px-6 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {MOCK_RECOVERIES.map((rec) => (
                    <tr key={rec.id} className={`hover:bg-gray-50 transition-colors group ${rec.status === 'Deferred' ? 'opacity-50 grayscale bg-gray-50/50' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">{rec.empName.charAt(0)}</div>
                           <div>
                             <p className="font-bold text-gray-800 leading-none mb-1">{rec.empName}</p>
                             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{rec.id}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded border">{rec.type}</span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-black text-payroll-deduction">
                        {rec.status === 'Deferred' ? '--' : rec.emi.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-gray-500">
                        {rec.outstanding.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col">
                           <span className="font-black text-gray-700">{rec.remainingInst}</span>
                           <span className="text-[8px] text-gray-400 font-black uppercase">Inst.</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                           {rec.status === 'Scheduled' && (
                             <button 
                              onClick={() => setDeferModalEmp(rec)}
                              className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all" 
                              title="Defer EMI"
                             >
                               <PauseCircle size={18} />
                             </button>
                           )}
                           <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                             <MoreVertical size={18} />
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Calendar Totals View */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                   <BarChart3 size={16} /> Recovery Roadmap
                </h3>
                <span className="text-[10px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded uppercase">6 Months View</span>
             </div>
             <div className="space-y-6">
                {[
                  { month: 'Jan', amount: 582400, perc: 95 },
                  { month: 'Feb', amount: 610000, perc: 100 },
                  { month: 'Mar', amount: 595000, perc: 98 },
                  { month: 'Apr', amount: 540000, perc: 88 },
                  { month: 'May', amount: 520000, perc: 85 },
                  { month: 'Jun', amount: 480000, perc: 78 },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                     <div className="flex justify-between items-end">
                        <span className="text-[11px] font-black text-gray-500 uppercase">{item.month} 2025</span>
                        <span className="text-xs font-mono font-bold text-primary">{formatPKR(item.amount)}</span>
                     </div>
                     <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                        <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${item.perc}%` }} />
                     </div>
                  </div>
                ))}
             </div>
             <div className="pt-4 border-t border-dashed">
                <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                   <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                   <p className="text-[10px] text-blue-700 leading-relaxed font-medium uppercase tracking-tight">
                     Forecast accounts for scheduled closures. New loan applications will shift these totals.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Deferral Modal */}
      {deferModalEmp && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setDeferModalEmp(null)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="p-6 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><PauseCircle size={20}/></div>
                   <div>
                      <h3 className="text-lg font-bold text-gray-800">Defer Installment</h3>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Skip current month repayment</p>
                   </div>
                </div>
                <button onClick={() => setDeferModalEmp(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400"><X size={20}/></button>
             </div>
             <div className="p-8 space-y-6">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                   <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Employee</p>
                   <p className="text-sm font-bold text-gray-700">{deferModalEmp.empName} ({deferModalEmp.empId})</p>
                   <div className="mt-4 flex justify-between text-xs font-bold">
                      <span className="text-gray-500">EMI to Skip:</span>
                      <span className="text-red-500">{formatPKR(deferModalEmp.emi)}</span>
                   </div>
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Reason for Deferral</label>
                   <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none">
                      <option>Financial Hardship</option>
                      <option>Salary Adjustment Correction</option>
                      <option>Exceptional Management Approval</option>
                      <option>Other</option>
                   </select>
                </div>
                <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-100 rounded-xl">
                   <AlertCircle size={18} className="text-orange-600 shrink-0 mt-0.5" />
                   <p className="text-[10px] text-orange-700 leading-relaxed font-bold uppercase tracking-tight">
                     Deferring this installment will increase the loan tenure by 1 month. Interest (if any) will be recalculated.
                   </p>
                </div>
             </div>
             <div className="p-6 border-t bg-gray-50 flex gap-3">
                <button onClick={() => setDeferModalEmp(null)} className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50">Cancel</button>
                <button onClick={() => setDeferModalEmp(null)} className="flex-[2] py-2.5 bg-orange-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-500/20 hover:bg-orange-700 flex items-center justify-center gap-2 active:scale-95 transition-all">
                   <Check size={18} /> Confirm Deferral
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

const HandCoins = ({ size, className }: { size?: number, className?: string }) => (
  <svg 
    width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" 
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    className={className}
  >
    <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" />
    <path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.8-2.8L13 15" />
    <circle cx="18" cy="5" r="3" />
  </svg>
);
