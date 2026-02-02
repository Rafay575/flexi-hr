import React, { useState } from 'react';
import { 
  CalendarCheck, 
  Lock, 
  Unlock, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  ArrowRight, 
  ShieldCheck, 
  History, 
  ChevronRight, 
  Download, 
  MoreVertical,
  Zap,
  Info,
  ArrowUpRight,
  ShieldAlert,
  // Added missing icon imports
  Search,
  Eye,
  RefreshCcw,
  X
} from 'lucide-react';

interface PayrollPeriod {
  id: string;
  name: string;
  start: string;
  end: string;
  status: 'OPEN' | 'LOCKED' | 'PROCESSING';
  lockedBy?: string;
  lockedAt?: string;
  pendingItems: {
    regularizations: number;
    ot: number;
    anomalies: number;
  };
}

const MOCK_PERIODS: PayrollPeriod[] = [
  { id: 'P25-01', name: 'January 2025', start: '2025-01-01', end: '2025-01-31', status: 'OPEN', pendingItems: { regularizations: 8, ot: 5, anomalies: 12 } },
  { id: 'P24-12', name: 'December 2024', start: '2024-12-01', end: '2024-12-31', status: 'LOCKED', lockedBy: 'Jane Doe (HR)', lockedAt: 'Jan 05, 2025', pendingItems: { regularizations: 0, ot: 0, anomalies: 0 } },
  { id: 'P24-11', name: 'November 2024', start: '2024-11-01', end: '2024-11-30', status: 'LOCKED', lockedBy: 'Jane Doe (HR)', lockedAt: 'Dec 03, 2024', pendingItems: { regularizations: 0, ot: 0, anomalies: 0 } },
  { id: 'P24-10', name: 'October 2024', start: '2024-10-01', end: '2024-10-31', status: 'LOCKED', lockedBy: 'Jane Doe (HR)', lockedAt: 'Nov 04, 2024', pendingItems: { regularizations: 0, ot: 0, anomalies: 0 } },
];

export const PayrollPeriods: React.FC = () => {
  const [periods] = useState<PayrollPeriod[]>(MOCK_PERIODS);
  const currentPeriod = periods[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <CalendarCheck className="text-[#3E3B6F]" size={28} /> Payroll Control Center
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Govern attendance cycles and finalize data for payroll disbursement</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">
            <Download size={18} /> Reconciliation Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* CURRENT PERIOD FOCUS */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white rounded-[32px] border border-gray-200 shadow-xl overflow-hidden flex flex-col">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-gray-800 tabular-nums">{currentPeriod.name}</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Active Payroll Window</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 rounded-full border border-green-100 text-[10px] font-black uppercase">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Open
              </div>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="flex items-center gap-4 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                 <Clock size={20} className="text-[#3E3B6F]" />
                 <div>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1">Auto-Lock Schedule</p>
                    <p className="text-sm font-bold text-indigo-900">Feb 05, 2025 at 11:59 PM</p>
                 </div>
              </div>

              <div className="space-y-4">
                 <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <AlertTriangle size={14} className="text-orange-500" /> Pending Compliance Items
                 </h4>
                 <div className="space-y-2">
                    {[
                      { label: 'Regularizations', val: currentPeriod.pendingItems.regularizations, color: 'text-blue-600' },
                      { label: 'OT Approvals', val: currentPeriod.pendingItems.ot, color: 'text-indigo-600' },
                      { label: 'Anomalies Unresolved', val: currentPeriod.pendingItems.anomalies, color: 'text-orange-600' },
                    ].map(item => (
                      <div key={item.label} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition-all group">
                         <span className="text-xs font-bold text-gray-600 group-hover:text-gray-900">• {item.label}</span>
                         <span className={`text-xs font-black ${item.color} tabular-nums`}>{item.val}</span>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="pt-4 space-y-3">
                 <button className="w-full py-4 bg-[#3E3B6F] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                   <Lock size={16} /> Lock Period Now
                 </button>
                 <button className="w-full py-3 bg-white border border-gray-200 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all">
                   View Detail Summary
                 </button>
              </div>
            </div>
            
            <div className="p-4 bg-orange-50 border-t border-orange-100 flex items-center justify-center gap-2">
               <ShieldAlert size={14} className="text-orange-500" />
               <p className="text-[10px] text-orange-700 font-bold uppercase">Locking requires all pending items to be resolved</p>
            </div>
          </div>

          <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-[32px] flex gap-4 shadow-sm group hover:border-[#3E3B6F]/30 transition-all cursor-pointer">
             <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#3E3B6F] shrink-0 group-hover:scale-110 transition-transform">
                <History size={24} />
             </div>
             <div>
                <h4 className="text-sm font-black text-[#3E3B6F] uppercase tracking-widest mb-1">Retroactive Queue</h4>
                <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                   3 employees requested changes to <span className="font-bold">December 2024</span> records.
                </p>
                <div className="mt-3 flex items-center gap-1 text-[10px] font-black text-indigo-700 uppercase tracking-tighter">
                   Review Requests <ChevronRight size={12} />
                </div>
             </div>
          </div>
        </div>

        {/* PERIODS TABLE */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 bg-gray-50/30 flex justify-between items-center">
               <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                 <History size={18} className="text-[#3E3B6F]" /> Cycle History
               </h3>
               <div className="flex gap-2">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input type="text" placeholder="Search periods..." className="pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-medium outline-none w-48" />
                 </div>
               </div>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                    <th className="px-8 py-5">Period Cycle</th>
                    <th className="px-6 py-5">Date Range</th>
                    <th className="px-6 py-5 text-center">Status</th>
                    <th className="px-6 py-5">Locked By</th>
                    <th className="px-6 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {periods.map((p) => (
                    <tr key={p.id} className="group hover:bg-gray-50/80 transition-all cursor-default">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                           <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shadow-sm ${p.status === 'OPEN' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-50 text-gray-400 border-gray-200'}`}>
                              {p.status === 'OPEN' ? <Unlock size={14} /> : <Lock size={14} />}
                           </div>
                           <p className="text-sm font-black text-gray-800 tabular-nums">{p.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 tabular-nums">
                          <span>{p.start}</span>
                          <ArrowRight size={10} className="text-gray-300" />
                          <span>{p.end}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                         <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                           p.status === 'OPEN' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                         }`}>
                           {p.status}
                         </span>
                      </td>
                      <td className="px-6 py-5">
                        {p.lockedBy ? (
                          <div className="flex flex-col">
                             <span className="text-xs font-bold text-gray-700">{p.lockedBy}</span>
                             <span className="text-[9px] text-gray-400 font-medium tabular-nums">{p.lockedAt}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold text-gray-300 uppercase italic">Active Window</span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-1  transition-all">
                           <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-lg" title="View Audit"><Eye size={16}/></button>
                           <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-white rounded-lg" title="Download Export"><Download size={16}/></button>
                           {p.status === 'LOCKED' && (
                             <button className="p-2 text-gray-400 hover:text-orange-500 hover:bg-white rounded-lg" title="Unlock (Enterprise only)">
                                <Unlock size={16} />
                             </button>
                           )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RETRO QUEUE SECTION */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
             <div className="p-6 border-b border-gray-100 bg-indigo-50/20 flex justify-between items-center">
                <h3 className="text-xs font-black text-[#3E3B6F] uppercase tracking-widest flex items-center gap-2">
                  <RefreshCcw size={16} className="text-indigo-500" /> Retroactive Corrections
                </h3>
                <span className="text-[10px] font-black text-indigo-600 bg-white px-2 py-1 rounded border border-indigo-100 uppercase">3 New Requests</span>
             </div>
             <div className="divide-y divide-gray-50">
                {[
                  { emp: 'Sarah Chen', id: 'FLX-101', period: 'Dec 2024', change: 'Missing OT (4h)', reason: 'Shift data not synced on Jan 30' },
                  { emp: 'Ahmed Khan', id: 'FLX-204', period: 'Dec 2024', change: 'Regularization', reason: 'Medical proof submitted late' },
                  { emp: 'James Wilson', id: 'FLX-089', period: 'Nov 2024', change: 'Shift Correction', reason: 'Manual override required for public holiday' },
                ].map((row, i) => (
                  <div key={i} className="p-5 flex items-center justify-between group hover:bg-gray-50/50 transition-colors">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xs font-black text-gray-400">
                           {row.emp.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                           <p className="text-xs font-bold text-gray-800">{row.emp} <span className="text-[10px] text-gray-400 ml-1 font-medium">• {row.id}</span></p>
                           <p className="text-[10px] text-[#3E3B6F] font-black uppercase mt-0.5">Affects: {row.period}</p>
                        </div>
                     </div>
                     <div className="flex-1 px-8">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-orange-50 text-orange-600 text-[10px] font-black border border-orange-100 uppercase">
                           {row.change}
                        </div>
                        <p className="text-[9px] text-gray-400 font-medium italic mt-1 truncate max-w-[200px]">"{row.reason}"</p>
                     </div>
                     <div className="flex gap-2">
                        <button className="px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all">Review</button>
                        <button className="p-2 text-gray-300 hover:text-red-500  transition-all"><X size={16}/></button>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="p-6 bg-[#E8D5A3]/10 border border-[#E8D5A3]/30 rounded-[32px] flex flex-col md:flex-row items-center gap-6">
             <div className="w-16 h-16 bg-white rounded-[24px] flex items-center justify-center shadow-xl shadow-[#E8D5A3]/20 shrink-0">
                <ShieldCheck size={32} className="text-[#3E3B6F]" />
             </div>
             <div className="flex-1 space-y-1">
                <h4 className="text-sm font-black text-[#3E3B6F] uppercase tracking-widest">Audit Stability Protocol</h4>
                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                  Locked periods generate an immutable <span className="font-bold">Sync-ID</span> which must be matched by the PayEdge payroll system during processing. Any mismatch will halt the disbursement to ensure data integrity.
                </p>
             </div>
             <button className="px-6 py-2.5 bg-[#3E3B6F] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                Download Signed Ledger
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};