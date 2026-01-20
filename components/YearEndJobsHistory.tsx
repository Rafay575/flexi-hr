import React, { useState } from 'react';
import { 
  History, Download, Search, Filter, Eye, ChevronRight, 
  X, FileText, CheckCircle2, AlertCircle, User, 
  Calendar, Database, ArrowUpRight, TrendingUp, Info
} from 'lucide-react';

interface YearEndJob {
  id: string;
  year: number;
  processedDate: string;
  processedBy: string;
  status: 'Completed' | 'Failed' | 'Partial';
  employees: number;
  carried: number;
  lapsed: number;
  encashed: number;
}

const MOCK_HISTORY_JOBS: YearEndJob[] = [
  // Fixed: Renamed 'encash' to 'encashed' to match YearEndJob interface
  { id: 'YE-2024-001', year: 2024, processedDate: 'Jan 02, 2025', processedBy: 'Sarah Admin', status: 'Completed', employees: 500, carried: 1250, lapsed: 340, encashed: 860 },
  // Fixed: Renamed 'encash' to 'encashed' to match YearEndJob interface
  { id: 'YE-2023-001', year: 2023, processedDate: 'Jan 04, 2024', processedBy: 'John Manager', status: 'Completed', employees: 480, carried: 1100, lapsed: 290, encashed: 750 },
  // Fixed: Renamed 'encash' to 'encashed' to match YearEndJob interface
  { id: 'YE-2022-001', year: 2022, processedDate: 'Jan 01, 2023', processedBy: 'System Auto', status: 'Completed', employees: 450, carried: 980, lapsed: 410, encashed: 620 },
  // Fixed: Renamed 'encash' to 'encashed' to match YearEndJob interface
  { id: 'YE-2024-ERR', year: 2024, processedDate: 'Jan 01, 2025', processedBy: 'Sarah Admin', status: 'Failed', employees: 0, carried: 0, lapsed: 0, encashed: 0 },
];

const MOCK_DRILLDOWN = [
  { name: 'Ahmed Khan', dept: 'Engineering', type: 'Annual', current: 14.5, carry: 10, lapse: 4.5, encash: 0 },
  { name: 'Sara Miller', dept: 'Product', type: 'Annual', current: 8, carry: 8, lapse: 0, encash: 0 },
  { name: 'Tom Chen', dept: 'Engineering', type: 'Annual', current: 18, carry: 10, lapse: 3, encash: 5 },
  { name: 'Anna Bell', dept: 'Design', type: 'Annual', current: 12, carry: 10, lapse: 2, encash: 0 },
  { name: 'Zoya Malik', dept: 'Engineering', type: 'Casual', current: 5, carry: 0, lapse: 5, encash: 0 },
];

export const YearEndJobsHistory = () => {
  const [selectedJob, setSelectedJob] = useState<YearEndJob | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusBadge = (status: YearEndJob['status']) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Failed': return 'bg-red-50 text-red-700 border-red-200';
      case 'Partial': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500 font-['League_Spartan']">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-[#3E3B6F] rounded-2xl">
            <History size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#3E3B6F]">Year-End Processing History</h2>
            <p className="text-gray-500 font-medium">Historical record of all annual leave balance finalizations and carry-forward tasks.</p>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/30 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by Job ID or Year..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#3E3B6F]/10 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2 text-gray-400 hover:text-[#3E3B6F] transition-colors">
            <Filter size={20} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Job ID</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Year</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Processed Date</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Processed By</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Employees</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Carried / Lapsed</th>
                <th className="px-8 py-5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_HISTORY_JOBS.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <span className="font-mono text-xs font-bold text-[#3E3B6F]">{job.id}</span>
                  </td>
                  <td className="px-8 py-5 text-center font-bold text-gray-700">{job.year}</td>
                  <td className="px-8 py-5 text-xs font-medium text-gray-600">{job.processedDate}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-[8px] font-bold text-[#3E3B6F]">
                        {job.processedBy.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-xs font-medium text-gray-800">{job.processedBy}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase border tracking-wider ${getStatusBadge(job.status)}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center font-bold text-gray-700">{job.employees}</td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold text-indigo-600">+{job.carried} d</span>
                      <span className="text-[10px] font-bold text-red-400">-{job.lapsed} d</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => setSelectedJob(job)}
                        className="p-2 bg-indigo-50 text-[#3E3B6F] rounded-lg hover:bg-[#3E3B6F] hover:text-white transition-all shadow-sm"
                        title="View Report"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-gray-100 transition-all shadow-sm"
                        title="Download CSV"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drill-down Drawer */}
      {selectedJob && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedJob(null)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-[650px] bg-[#F5F5F5] shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="p-8 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 text-[#3E3B6F] rounded-2xl">
                  <Database size={24}/>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Job Detail: {selectedJob.id}</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Finalized {selectedJob.year} Balances</p>
                </div>
              </div>
              <button onClick={() => setSelectedJob(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-modal-scroll">
              {/* Status Header */}
              {selectedJob.status === 'Failed' ? (
                <div className="p-6 bg-red-50 rounded-3xl border border-red-100 flex items-start gap-4">
                  <AlertCircle size={24} className="text-red-500 shrink-0 mt-1" />
                  <div>
                    <h4 className="text-red-900 font-bold">Execution Failed</h4>
                    <p className="text-sm text-red-700/80 leading-relaxed mt-1">Job terminated unexpectedly at 45% progress due to a ledger deadlock. No balances were updated. Please re-run the job after system maintenance.</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total CF</p>
                    <p className="text-xl font-bold text-indigo-600">+{selectedJob.carried} d</p>
                  </div>
                  <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Lapsed</p>
                    <p className="text-xl font-bold text-red-500">-{selectedJob.lapsed} d</p>
                  </div>
                  <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Impacted</p>
                    <p className="text-xl font-bold text-[#3E3B6F]">{selectedJob.employees} Staff</p>
                  </div>
                </div>
              )}

              {/* Job Parameters */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><Info size={14}/> Job Parameters</h4>
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div className="flex justify-between border-r border-gray-50 pr-4">
                    <span className="text-gray-500">Year Ending</span>
                    <span className="font-bold text-gray-800">{selectedJob.year}</span>
                  </div>
                  <div className="flex justify-between pl-4">
                    <span className="text-gray-500">Processing Date</span>
                    <span className="font-bold text-gray-800">{selectedJob.processedDate}</span>
                  </div>
                  <div className="flex justify-between border-r border-gray-50 pr-4">
                    <span className="text-gray-500">Dry Run</span>
                    <span className="font-bold text-emerald-600">No</span>
                  </div>
                  <div className="flex justify-between pl-4">
                    <span className="text-gray-500">Auto-Encash</span>
                    <span className="font-bold text-gray-800">Disabled</span>
                  </div>
                </div>
              </div>

              {/* Employee Log */}
              {selectedJob.status !== 'Failed' && (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                  <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Employee Transition Log</h4>
                    <Search size={14} className="text-gray-300" />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50/20 text-[9px] font-bold text-gray-400 uppercase border-b border-gray-50">
                          <th className="px-6 py-3">Employee</th>
                          <th className="px-6 py-3 text-center">Current</th>
                          <th className="px-6 py-3 text-center text-indigo-600">Carry</th>
                          <th className="px-6 py-3 text-center text-red-500">Lapse</th>
                          <th className="px-6 py-3 text-center">New Bal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {MOCK_DRILLDOWN.map((row, i) => (
                          <tr key={i} className="hover:bg-gray-50/50">
                            <td className="px-6 py-3">
                              <p className="text-xs font-bold text-gray-900 leading-none">{row.name}</p>
                              <p className="text-[9px] text-gray-400 uppercase mt-1">{row.dept}</p>
                            </td>
                            <td className="px-6 py-3 text-center text-xs font-medium text-gray-500">{row.current} d</td>
                            <td className="px-6 py-3 text-center text-xs font-bold text-indigo-600">+{row.carry} d</td>
                            <td className="px-6 py-3 text-center text-xs font-bold text-red-400">-{row.lapse} d</td>
                            <td className="px-6 py-3 text-center">
                              <span className="px-2 py-0.5 bg-indigo-50 text-[#3E3B6F] rounded text-xs font-bold">
                                {row.carry} d
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex justify-center gap-1">
                    <button className="w-6 h-6 rounded bg-[#3E3B6F] text-white text-[10px] font-bold">1</button>
                    <button className="w-6 h-6 rounded hover:bg-gray-100 text-gray-500 text-[10px] font-bold">2</button>
                    <button className="w-6 h-6 rounded hover:bg-gray-100 text-gray-500 text-[10px] font-bold">3</button>
                  </div>
                </div>
              )}

              {/* Audit Trail */}
              <div className="space-y-4">
                 <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Audit Trail</h4>
                 <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                    <div className="relative">
                      <div className="absolute left-[-25px] top-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                      <p className="text-xs font-bold text-gray-800 uppercase tracking-tight">Job Started</p>
                      <p className="text-[10px] text-gray-400">Jan 02, 2025 • 09:00:01 AM</p>
                    </div>
                    <div className="relative">
                      <div className="absolute left-[-25px] top-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                      <p className="text-xs font-bold text-gray-800 uppercase tracking-tight">Ledger Snapshotted</p>
                      <p className="text-[10px] text-gray-400">Created 4,200 baseline entries</p>
                    </div>
                    <div className="relative">
                      <div className={`absolute left-[-25px] top-1.5 w-3 h-3 rounded-full border-2 border-white ${selectedJob.status === 'Completed' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <p className="text-xs font-bold text-gray-800 uppercase tracking-tight">Job {selectedJob.status}</p>
                      <p className="text-[10px] text-gray-400">{selectedJob.status === 'Completed' ? 'All records finalized' : 'Execution halted due to error code: ERR_442'}</p>
                    </div>
                 </div>
              </div>
            </div>

            <div className="p-8 bg-white border-t border-gray-100 flex gap-4 shrink-0">
               <button className="flex-1 py-4 bg-white border border-gray-200 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                 <Download size={20} /> Download Report
               </button>
               {selectedJob.status === 'Failed' && (
                 <button className="flex-1 py-4 bg-[#3E3B6F] text-white rounded-2xl font-bold shadow-xl shadow-[#3E3B6F]/20 hover:bg-[#4A4680] transition-all flex items-center justify-center gap-2">
                   <ArrowUpRight size={20} /> Restart Year-End
                 </button>
               )}
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          .custom-modal-scroll::-webkit-scrollbar { width: 4px; }
          .custom-modal-scroll::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
        `}
      </style>
    </div>
  );
};