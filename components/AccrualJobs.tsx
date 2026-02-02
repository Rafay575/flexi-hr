import React, { useState, useMemo } from 'react';
import { 
  Play, History, Clock, Users, Database, 
  CheckCircle2, XCircle, AlertCircle, RefreshCw, 
  Search, Filter, ChevronRight, X, Info, 
  ArrowUpRight, Download, Settings2, ShieldCheck,
  Table, RotateCcw, Eye, Calculator
} from 'lucide-react';

interface AccrualJob {
  id: string;
  date: string;
  period: string;
  types: string;
  scope: string;
  status: 'Completed' | 'Running' | 'Failed' | 'Draft';
  employees: number;
  totalDays: number;
  errors: number;
}

const MOCK_JOBS: AccrualJob[] = [
  { id: 'JOB-2025-001', date: 'Jan 01, 2025', period: 'Jan 2025', types: 'All', scope: 'All Staff', status: 'Completed', employees: 450, totalDays: 820.5, errors: 0 },
  { id: 'JOB-2024-012', date: 'Dec 01, 2024', period: 'Dec 2024', types: 'Annual, Sick', scope: 'Engineering', status: 'Completed', employees: 142, totalDays: 284, errors: 2 },
  { id: 'JOB-2024-011', date: 'Nov 01, 2024', period: 'Nov 2024', types: 'All', scope: 'All Staff', status: 'Completed', employees: 445, totalDays: 812, errors: 1 },
  { id: 'JOB-2024-010', date: 'Oct 01, 2024', period: 'Oct 2024', types: 'All', scope: 'All Staff', status: 'Completed', employees: 442, totalDays: 805, errors: 0 },
];

export const AccrualJobs = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentEmp, setCurrentEmp] = useState('');
  const [selectedJob, setSelectedJob] = useState<AccrualJob | null>(null);

  const handleRun = () => {
    setIsRunning(true);
    setProgress(0);
    const emps = ['Ahmed Khan', 'Sara Miller', 'Tom Chen', 'Zoya Malik', 'Ali Raza'];
    let current = 0;
    
    const interval = setInterval(() => {
      current += 10;
      setProgress(current);
      setCurrentEmp(emps[Math.floor(Math.random() * emps.length)]);
      
      if (current >= 100) {
        clearInterval(interval);
        setIsRunning(false);
        setProgress(0);
      }
    }, 300);
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500 font-['League_Spartan']">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-[#3E3B6F]">Accrual Jobs</h2>
          <p className="text-gray-500 font-medium">Batch process leave credits and monitor automated distribution.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Run Form */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
              <RefreshCw size={20} className="text-[#3E3B6F]" />
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Run Accrual</h3>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Period</label>
                <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-[#3E3B6F] outline-none focus:bg-white focus:border-[#3E3B6F]">
                  <option>February 2025</option>
                  <option>January 2025</option>
                  <option>March 2025 (Forecast)</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Leave Types</label>
                <div className="flex gap-4">
                  <label className="flex-1 flex items-center justify-center gap-2 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-[#3E3B6F] group">
                    <input type="radio" name="types" defaultChecked className="text-[#3E3B6F]" />
                    <span className="text-xs font-bold text-gray-700">All</span>
                  </label>
                  <label className="flex-1 flex items-center justify-center gap-2 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-[#3E3B6F]">
                    <input type="radio" name="types" className="text-[#3E3B6F]" />
                    <span className="text-xs font-bold text-gray-700">Specific</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Scope</label>
                <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold outline-none">
                  <option>All Staff</option>
                  <option>Engineering Dept</option>
                  <option>Sales Dept</option>
                  <option>Remote Workers</option>
                </select>
              </div>

              <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl cursor-pointer group hover:bg-white transition-all border border-transparent hover:border-indigo-100">
                <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-[#3E3B6F] focus:ring-[#3E3B6F]" />
                <div>
                  <p className="text-sm font-bold text-gray-700">Dry Run Only</p>
                  <p className="text-[10px] text-gray-400 uppercase">Preview only, no ledger updates</p>
                </div>
              </label>

              <button 
                onClick={handleRun}
                disabled={isRunning}
                className="w-full bg-[#3E3B6F] text-white py-4 rounded-2xl font-bold shadow-xl shadow-[#3E3B6F]/20 hover:bg-[#4A4680] transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
              >
                {isRunning ? <RefreshCw className="animate-spin" size={18} /> : <Play size={18} />}
                {isRunning ? 'Processing...' : 'Run Accrual Job'}
              </button>
            </div>
          </div>

          {isRunning && (
            <div className="bg-indigo-900 rounded-[32px] p-8 text-white space-y-6 animate-in slide-in-from-top-4">
              <div className="flex justify-between items-center">
                 <h4 className="text-sm font-bold uppercase tracking-widest text-indigo-200">Live Progress</h4>
                 <button onClick={() => setIsRunning(false)} className="text-xs font-bold text-white/50 hover:text-white">Cancel</button>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between text-xs font-bold">
                    <span>{Math.round(450 * (progress/100))} / 450 Employees</span>
                    <span className="text-[#E8D5A3]">{progress}%</span>
                 </div>
                 <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#E8D5A3] transition-all duration-300" style={{ width: `${progress}%` }} />
                 </div>
                 <p className="text-[10px] text-indigo-300 italic flex items-center gap-2">
                    <RefreshCw size={12} className="animate-spin" /> Processing {currentEmp}...
                 </p>
              </div>
            </div>
          )}

          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-indigo-50 text-[#3E3B6F] rounded-lg"><Clock size={18}/></div>
               <h4 className="text-sm font-bold text-gray-800">Schedule Info</h4>
             </div>
             <div className="space-y-1">
               <p className="text-xs text-gray-500 font-medium">Auto-run: <span className="text-gray-900 font-bold">Monthly on 1st at 12:00 AM</span></p>
               <p className="text-xs text-gray-500 font-medium">Next run: <span className="text-indigo-600 font-bold">Feb 1, 2025</span></p>
             </div>
             <button className="text-[10px] font-bold text-[#3E3B6F] uppercase tracking-widest hover:underline flex items-center gap-1">
               Change Schedule <ChevronRight size={12} />
             </button>
          </div>
        </div>

        {/* Job History */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/30 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2">
                <History size={18} className="text-gray-400" /> Job History
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Job ID / Date</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Period</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Credits</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Errors</th>
                    <th className="px-8 py-5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {MOCK_JOBS.map((job) => (
                    <tr 
                      key={job.id} 
                      className="hover:bg-gray-50/30 transition-colors group cursor-pointer"
                      onClick={() => setSelectedJob(job)}
                    >
                      <td className="px-8 py-5">
                        <p className="text-xs font-bold text-[#3E3B6F] font-mono uppercase">{job.id}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{job.date}</p>
                      </td>
                      <td className="px-8 py-5 text-center text-sm font-bold text-gray-700">{job.period}</td>
                      <td className="px-8 py-5 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                          job.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <p className="text-sm font-bold text-[#3E3B6F]">{job.totalDays.toFixed(1)} Days</p>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">{job.employees} staff</p>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className={`text-xs font-bold ${job.errors > 0 ? 'text-red-500' : 'text-gray-300'}`}>
                          {job.errors}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2  transition-all">
                           {/* Fixed Error: RotateCcw is now imported correctly above */}
                           <button className="p-2 text-gray-400 hover:text-[#3E3B6F] hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-gray-100"><RotateCcw size={16}/></button>
                           {/* Fixed Error: Eye is now imported correctly above */}
                           <button className="p-2 text-gray-400 hover:text-[#3E3B6F] hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-gray-100"><Eye size={16}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-amber-50 p-6 rounded-[32px] border border-amber-100 flex items-start gap-4">
             <Info className="text-amber-500 shrink-0 mt-0.5" size={20} />
             <div>
               <h5 className="text-sm font-bold text-amber-900 mb-1">Accrual Proration Logic</h5>
               <p className="text-xs text-amber-800/70 leading-relaxed font-medium">
                 The system automatically applies proration for new hires and exiting employees based on their joining/termination dates. You can verify these calculations in the <strong>Job Details</strong> drill-down.
               </p>
             </div>
          </div>
        </div>
      </div>

      {/* Detail Drawer */}
      {selectedJob && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedJob(null)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-[650px] bg-[#F5F5F5] shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="p-8 bg-white border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 text-[#3E3B6F] rounded-2xl">
                  <Database size={24}/>
                </div>
                <div>
                   <h3 className="text-xl font-bold text-gray-900">Job Detail: {selectedJob.id}</h3>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{selectedJob.period} Accrual Run</p>
                </div>
              </div>
              <button onClick={() => setSelectedJob(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-modal-scroll">
              {/* Parameters */}
              <div className="grid grid-cols-3 gap-4">
                 <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                    <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Types</p>
                    <p className="text-xs font-bold text-gray-700">{selectedJob.types}</p>
                 </div>
                 <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                    <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Scope</p>
                    <p className="text-xs font-bold text-gray-700">{selectedJob.scope}</p>
                 </div>
                 <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                    <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Errors</p>
                    <p className={`text-xs font-bold ${selectedJob.errors > 0 ? 'text-red-500' : 'text-emerald-600'}`}>{selectedJob.errors}</p>
                 </div>
              </div>

              {/* Employee Breakdown */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
                   <h5 className="text-xs font-bold text-gray-700 uppercase tracking-widest">Employee Credit Log</h5>
                   <div className="flex items-center gap-2">
                      <Search size={14} className="text-gray-400" />
                      <input type="text" placeholder="Search staff..." className="bg-transparent border-none text-xs font-medium outline-none w-32" />
                   </div>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                     <thead>
                       <tr className="bg-gray-50/30">
                         <th className="px-6 py-3 text-[9px] font-bold text-gray-400 uppercase">Employee</th>
                         <th className="px-6 py-3 text-[9px] font-bold text-gray-400 uppercase">Type</th>
                         <th className="px-6 py-3 text-[9px] font-bold text-gray-400 uppercase text-center">Base</th>
                         <th className="px-6 py-3 text-[9px] font-bold text-gray-400 uppercase text-center">Proration</th>
                         <th className="px-6 py-3 text-[9px] font-bold text-gray-400 uppercase text-right">Credited</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50">
                       {[
                         { name: 'Ahmed Khan', type: 'Annual', base: 2.0, pror: 1.0, cred: 2.0, status: 'OK' },
                         { name: 'Sara Miller', type: 'Annual', base: 2.0, pror: 0.5, cred: 1.0, status: 'Prorated (Joined Jan 15)' },
                         { name: 'Tom Chen', type: 'Annual', base: 2.0, pror: 1.0, cred: 2.0, status: 'OK' },
                         { name: 'Zoya Malik', type: 'Annual', base: 2.0, pror: 0, cred: 0, status: 'Failed: Missing Pay ID', error: true },
                       ].map((row, i) => (
                         <tr key={i} className="hover:bg-gray-50/50">
                           <td className="px-6 py-4">
                              <p className="text-xs font-bold text-gray-900">{row.name}</p>
                              <p className={`text-[8px] font-bold uppercase ${row.error ? 'text-red-500' : 'text-gray-400'}`}>{row.status}</p>
                           </td>
                           <td className="px-6 py-4 text-xs text-gray-500">{row.type}</td>
                           <td className="px-6 py-4 text-xs font-medium text-gray-700 text-center">{row.base.toFixed(2)}</td>
                           <td className="px-6 py-4 text-xs font-medium text-gray-700 text-center">x {row.pror.toFixed(2)}</td>
                           <td className="px-6 py-4 text-right">
                              <span className={`text-xs font-bold ${row.error ? 'text-gray-300' : 'text-emerald-600'}`}>+{row.cred.toFixed(2)} d</span>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                </div>
              </div>

              {/* Proration Formula Info */}
              <div className="p-6 bg-indigo-50 rounded-[28px] border border-indigo-100 flex items-start gap-4">
                 {/* Fixed Error: Calculator is now imported correctly above */}
                 <Calculator className="text-indigo-400 shrink-0" size={20} />
                 <div>
                    <p className="text-xs font-bold text-indigo-900 uppercase tracking-widest mb-1">Proration Formula</p>
                    <code className="text-[10px] text-indigo-700 font-mono bg-white/50 px-2 py-1 rounded border border-indigo-100">
                      (Days in Service / Total Days in Period) * Period Quota
                    </code>
                 </div>
              </div>
            </div>

            <div className="p-8 bg-white border-t border-gray-100 flex gap-3 shrink-0">
               <button className="flex-1 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                 <Download size={16} /> Export CSV
               </button>
               {/* Fixed Error: RotateCcw is now imported correctly above */}
               <button className="flex-1 py-3 bg-[#3E3B6F] text-white rounded-xl text-xs font-bold hover:bg-[#4A4680] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#3E3B6F]/20">
                 <RotateCcw size={16} /> Re-run Job
               </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          .custom-modal-scroll::-webkit-scrollbar { width: 4px; }
          .custom-modal-scroll::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
          .custom-form-scroll::-webkit-scrollbar { width: 4px; }
          .custom-form-scroll::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
        `}
      </style>
    </div>
  );
};