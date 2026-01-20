import React, { useState } from 'react';
import { 
  Play, History, ChevronRight, X, User, CheckCircle2, 
  AlertCircle, RotateCcw, Clock, Eye, Search, Filter,
  Calculator, Download, RefreshCw, FileText, Zap, ShieldAlert,
  /* Added missing Info and ArrowUpRight imports */
  Info, ArrowUpRight
} from 'lucide-react';

interface AwardRun {
  id: string;
  rule: string;
  period: string;
  runDate: string;
  status: 'Completed' | 'Running' | 'Failed' | 'Dry Run';
  qualified: number;
  awarded: number;
  exceptions: number;
  runBy: string;
}

const MOCK_RUNS: AwardRun[] = [
  { id: 'RUN-2025-001', rule: 'Perfect Attendance Monthly', period: 'Jan 2025', runDate: 'Feb 02, 2025', status: 'Completed', qualified: 125, awarded: 125, exceptions: 0, runBy: 'Sarah Admin' },
  { id: 'RUN-2025-002', rule: 'Punctuality Award', period: 'Jan 2025', runDate: 'Feb 02, 2025', status: 'Completed', qualified: 310, awarded: 305, exceptions: 5, runBy: 'Sarah Admin' },
  { id: 'RUN-2025-003', rule: 'Quarterly Wellness', period: 'Q4 2024', runDate: 'Jan 05, 2025', status: 'Completed', qualified: 88, awarded: 88, exceptions: 0, runBy: 'System' },
  { id: 'RUN-2025-004', rule: 'Perfect Attendance Monthly', period: 'Feb 2025', runDate: 'Now', status: 'Running', qualified: 0, awarded: 0, exceptions: 0, runBy: 'John Doe' },
  { id: 'RUN-2025-005', rule: 'Loyalty Leave', period: 'Year 2024', runDate: 'Jan 01, 2025', status: 'Dry Run', qualified: 215, awarded: 0, exceptions: 2, runBy: 'Sarah Admin' },
];

export const IncentiveAwardRuns = () => {
  const [selectedRun, setSelectedRun] = useState<AwardRun | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<'qualified' | 'disqualified' | 'exceptions'>('qualified');

  const getStatusBadge = (status: AwardRun['status']) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Running': return 'bg-blue-50 text-blue-600 border-blue-100 animate-pulse';
      case 'Failed': return 'bg-red-50 text-red-600 border-red-100';
      case 'Dry Run': return 'bg-gray-100 text-gray-500 border-gray-200';
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500 font-['League_Spartan']">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-[#3E3B6F]">Incentive Award Runs</h2>
          <p className="text-gray-500 font-medium">Execute rules and audit leave distributions based on attendance data.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Run Form */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden sticky top-8">
            <div className="p-8 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2">
                <Play size={18} className="text-[#3E3B6F]" /> Run New Award
              </h3>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rule to Execute</label>
                <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold outline-none focus:bg-white focus:border-[#3E3B6F]">
                  <option>Perfect Attendance Monthly</option>
                  <option>Punctuality Award</option>
                  <option>Quarterly Wellness Reward</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Evaluation Period</label>
                <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold outline-none focus:bg-white focus:border-[#3E3B6F]">
                  <option>January 2025</option>
                  <option>December 2024</option>
                  <option>Q4 2024</option>
                </select>
              </div>
              <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl cursor-pointer group hover:bg-gray-100 transition-colors">
                <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-[#3E3B6F]" />
                <div>
                  <p className="text-sm font-bold text-gray-700">Dry Run Only</p>
                  <p className="text-[10px] text-gray-400 uppercase">Preview results without updating balances</p>
                </div>
              </label>
              <button className="w-full bg-[#3E3B6F] text-white py-4 rounded-2xl font-bold shadow-xl shadow-[#3E3B6F]/20 hover:bg-[#4A4680] transition-all flex items-center justify-center gap-2 active:scale-95">
                <Zap size={18} className="text-[#E8D5A3]" /> Execute Award Job
              </button>
            </div>
            <div className="p-6 bg-amber-50 text-amber-800 border-t border-amber-100 flex items-start gap-3">
              {/* Fix: Info is now imported correctly above */}
              <Info size={18} className="shrink-0 mt-0.5" />
              <p className="text-[10px] leading-relaxed font-medium">Job will verify attendance data via <strong>TimeSync</strong> before processing. Expected duration: 2-5 mins.</p>
            </div>
          </div>
        </div>

        {/* Job History */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/30 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2">
                <History size={18} className="text-gray-400" /> Job Execution History
              </h3>
              <div className="flex gap-2">
                <button className="p-2 text-gray-400 hover:text-[#3E3B6F] transition-colors"><Search size={18}/></button>
                <button className="p-2 text-gray-400 hover:text-[#3E3B6F] transition-colors"><Filter size={18}/></button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Job ID / Rule</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Period</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Qualified</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Exceptions</th>
                    <th className="px-8 py-5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {MOCK_RUNS.map((run) => (
                    <tr 
                      key={run.id} 
                      className="hover:bg-gray-50/30 transition-colors group cursor-pointer"
                      onClick={() => setSelectedRun(run)}
                    >
                      <td className="px-8 py-5">
                        <p className="text-sm font-bold text-gray-900 leading-none">{run.rule}</p>
                        <p className="text-[10px] text-gray-400 font-mono mt-1.5">{run.id}</p>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className="text-xs font-bold text-gray-600">{run.period}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(run.status)}`}>
                          {run.status === 'Running' && <RefreshCw size={10} className="inline mr-1 animate-spin" />}
                          {run.status}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div>
                          <p className="text-sm font-bold text-gray-800">{run.qualified} staff</p>
                          <p className="text-[10px] text-emerald-600 font-bold uppercase">{run.awarded} awarded</p>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`text-[10px] font-bold ${run.exceptions > 0 ? 'text-red-500' : 'text-gray-300'}`}>
                          {run.exceptions} {run.exceptions === 1 ? 'Error' : 'Errors'}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="p-2 text-gray-300 group-hover:text-[#3E3B6F] transition-all">
                          <ChevronRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Drawer */}
      {selectedRun && (
        <div className="fixed inset-0 z-[200] overflow-hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in" onClick={() => setSelectedRun(null)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-[550px] bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${getStatusBadge(selectedRun.status)}`}>
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Run Audit: {selectedRun.id}</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{selectedRun.rule} • {selectedRun.period}</p>
                </div>
              </div>
              <button onClick={() => setSelectedRun(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-modal-scroll">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Executed On</p>
                  <p className="text-sm font-bold text-gray-800">{selectedRun.runDate}</p>
                  <p className="text-[10px] text-gray-500 mt-1">by {selectedRun.runBy}</p>
                </div>
                <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Ledger Entries</p>
                  <p className="text-sm font-bold text-emerald-600">+{selectedRun.awarded} Entries</p>
                  <button className="text-[10px] font-bold text-[#3E3B6F] mt-1 hover:underline flex items-center gap-1">
                    {/* Fix: ArrowUpRight is now imported correctly above */}
                    View in Audit Log <ArrowUpRight size={10} />
                  </button>
                </div>
              </div>

              {/* Tabs for Lists */}
              <div className="space-y-6">
                <div className="flex gap-4 border-b border-gray-100 pb-1 shrink-0">
                   {['Qualified', 'Disqualified', 'Exceptions'].map(t => (
                     <button 
                      key={t}
                      onClick={() => setActiveDetailTab(t.toLowerCase() as any)}
                      className={`text-[10px] font-bold uppercase tracking-widest pb-3 px-1 transition-all relative ${activeDetailTab === t.toLowerCase() ? 'text-[#3E3B6F]' : 'text-gray-400'}`}
                     >
                       {t} {t === 'Qualified' ? `(${selectedRun.qualified})` : t === 'Exceptions' ? `(${selectedRun.exceptions})` : ''}
                       {activeDetailTab === t.toLowerCase() && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3E3B6F] rounded-full" />}
                     </button>
                   ))}
                </div>

                {activeDetailTab === 'qualified' && (
                  <div className="space-y-3 animate-in slide-in-from-bottom-2">
                    {[
                      { name: 'Ahmed Khan', id: 'EMP-101', award: '1.0 d Annual' },
                      { name: 'Sara Miller', id: 'EMP-102', award: '1.0 d Annual' },
                      { name: 'Tom Chen', id: 'EMP-103', award: '1.0 d Annual' },
                    ].map((emp, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-[#3E3B6F]/20 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-[10px]">OK</div>
                          <div>
                             <p className="text-xs font-bold text-gray-800">{emp.name}</p>
                             <p className="text-[9px] text-gray-400 uppercase tracking-tighter">{emp.id}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#3E3B6F]">{emp.award}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeDetailTab === 'disqualified' && (
                  <div className="space-y-3 animate-in slide-in-from-bottom-2">
                    {[
                      { name: 'Usman Ali', reason: 'Late Occurrences', actual: '3', target: 'Max 0' },
                      { name: 'Mona Shah', reason: 'Attendance %', actual: '92%', target: 'Min 95%' },
                      { name: 'Ali Raza', reason: 'Unpaid Leave Taken', actual: '1 d', target: '0 d' },
                    ].map((emp, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center font-bold text-[10px]">X</div>
                          <div>
                             <p className="text-xs font-bold text-gray-800">{emp.name}</p>
                             <p className="text-[9px] text-red-500 font-bold uppercase tracking-tighter">{emp.reason}</p>
                          </div>
                        </div>
                        <div className="text-right">
                           <p className="text-xs font-bold text-gray-400">{emp.actual} / <span className="text-gray-900">{emp.target}</span></p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeDetailTab === 'exceptions' && (
                   <div className="space-y-3 animate-in slide-in-from-bottom-2">
                      <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-3">
                        <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
                        <div>
                          <p className="text-xs font-bold text-red-900">Missing Payroll ID (5 Employees)</p>
                          <p className="text-[10px] text-red-700 leading-relaxed mt-1">Staff joining date in PayEdge does not match Flexi HRMS. Skipping distribution for security.</p>
                        </div>
                      </div>
                   </div>
                )}
              </div>

              {/* Reversal Panel */}
              <div className="pt-8 border-t border-gray-100">
                 <div className="p-6 bg-red-50/50 border border-red-100 rounded-[24px] space-y-4">
                    <div className="flex items-center gap-3 text-red-600">
                       <ShieldAlert size={20} />
                       <h4 className="text-sm font-bold uppercase tracking-widest">Enterprise: Reversal</h4>
                    </div>
                    <p className="text-xs text-gray-600 font-medium leading-relaxed">
                      If attendance data was corrected after this job was executed, you can reverse all awards. This will create debit entries in employee ledgers with reference <strong>REV-{selectedRun.id}</strong>.
                    </p>
                    <button className="w-full py-3 bg-white border border-red-200 text-red-600 rounded-xl text-xs font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2">
                      <RotateCcw size={14} /> Reverse Award Batch
                    </button>
                 </div>
              </div>
            </div>

            <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-3 shrink-0">
               <button className="flex-1 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                 <Download size={16} /> Export Detailed CSV
               </button>
               <button className="flex-1 py-3 bg-[#3E3B6F] text-white rounded-xl text-xs font-bold hover:bg-[#4A4680] transition-all flex items-center justify-center gap-2">
                 <RefreshCw size={16} /> Re-run Job
               </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          .custom-modal-scroll::-webkit-scrollbar { width: 4px; }
          .custom-modal-scroll::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
          .scrollbar-hide::-webkit-scrollbar { display: none; }
        `}
      </style>
    </div>
  );
};