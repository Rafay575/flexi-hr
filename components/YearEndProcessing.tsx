import React, { useState } from 'react';
import { 
  Calendar, ChevronRight, ChevronLeft, Info, AlertTriangle, 
  CheckCircle2, Download, Search, Filter, Database, 
  RefreshCw, FileText, ArrowRight, ShieldAlert, Zap
} from 'lucide-react';

interface SummaryRow {
  type: string;
  total: number;
  cf: number;
  lapse: number;
  encash: number;
}

const MOCK_SUMMARY: SummaryRow[] = [
  { type: 'Annual Leave', total: 2450, cf: 1250, lapse: 340, encash: 860 },
  { type: 'Sick Leave', total: 1100, cf: 1100, lapse: 0, encash: 0 },
  { type: 'Casual Leave', total: 850, cf: 0, lapse: 850, encash: 0 },
];

const MOCK_EMPLOYEES = [
  { name: 'Ahmed Khan', dept: 'Engineering', type: 'Annual', current: 14.5, carry: 10, lapse: 4.5, newOpening: 10 },
  { name: 'Sara Miller', dept: 'Product', type: 'Annual', current: 8, carry: 8, lapse: 0, newOpening: 8 },
  { name: 'Tom Chen', dept: 'Engineering', type: 'Annual', current: 18, carry: 10, lapse: 8, newOpening: 10, highLapse: true },
  { name: 'Anna Bell', dept: 'Design', type: 'Annual', current: 12, carry: 10, lapse: 2, newOpening: 10 },
  { name: 'Zoya Malik', dept: 'Engineering', type: 'Casual', current: 5, carry: 0, lapse: 5, newOpening: 0 },
];

export const YearEndProcessing = () => {
  const [step, setStep] = useState(1);
  const [isDryRun, setIsDryRun] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle');
  const [confirmed, setConfirmed] = useState(false);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const startProcessing = () => {
    setIsExecuting(true);
    let current = 0;
    const interval = setInterval(() => {
      current += 5;
      setProgress(current);
      if (current === 30) setStatus('Creating carry forward entries...');
      if (current === 60) setStatus('Creating lapse entries...');
      if (current === 90) setStatus('Resetting balances...');
      if (current >= 100) {
        clearInterval(interval);
        setIsExecuting(false);
        setStep(5); // Completion step
      }
    }, 150);
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500 font-['League_Spartan']">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-[#3E3B6F] rounded-2xl">
            <RefreshCw size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#3E3B6F]">Year-End Processing</h2>
            <p className="text-gray-500 font-medium">Finalize leave balances and carry forward entitlements to the new fiscal year.</p>
          </div>
        </div>
      </div>

      {/* Stepper */}
      {step < 5 && (
        <div className="flex items-center justify-center gap-4 max-w-3xl mx-auto mb-12">
          {[1, 2, 3, 4].map(s => (
            <React.Fragment key={s}>
              <div className={`flex flex-col items-center gap-2 ${step >= s ? 'text-[#3E3B6F]' : 'text-gray-300'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all ${step === s ? 'bg-[#3E3B6F] border-[#3E3B6F] text-white shadow-lg' : step > s ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-gray-200'}`}>
                  {step > s ? <CheckCircle2 size={20} /> : s}
                </div>
              </div>
              {s < 4 && <div className={`flex-1 h-0.5 max-w-[60px] ${step > s ? 'bg-emerald-500' : 'bg-gray-200'}`} />}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Step 1: Select Year */}
      {step === 1 && (
        <div className="max-w-2xl mx-auto bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 space-y-8 animate-in slide-in-from-bottom-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Year Ending</label>
              <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-[#3E3B6F] outline-none">
                <option>2024</option>
                <option>2023</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Processing Date</label>
              <input type="date" defaultValue="2025-01-01" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-800 outline-none" />
            </div>
            <label className="flex items-center gap-4 p-5 bg-indigo-50/50 rounded-2xl cursor-pointer border border-transparent hover:border-indigo-100 transition-all">
              <input 
                type="checkbox" 
                checked={isDryRun} 
                onChange={(e) => setIsDryRun(e.target.checked)}
                className="w-6 h-6 rounded border-gray-300 text-[#3E3B6F] focus:ring-[#3E3B6F]" 
              />
              <div>
                <p className="font-bold text-indigo-900">Dry Run (Preview Only)</p>
                <p className="text-xs text-indigo-700/60">Generate reports and preview impact without modifying ledger.</p>
              </div>
            </label>
          </div>
          <button onClick={handleNext} className="w-full py-4 bg-[#3E3B6F] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#4A4680] transition-all shadow-xl shadow-[#3E3B6F]/20">
            Next Step <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Step 2: Preview Summary */}
      {step === 2 && (
        <div className="space-y-8 animate-in slide-in-from-right-4">
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Aggregation Summary</h3>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Year: 2024</span>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Leave Type</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Balance</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-indigo-600">Carry Forward</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-red-600">Lapse</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-emerald-600">Encash Eligible</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-bold">
                {MOCK_SUMMARY.map(row => (
                  <tr key={row.type}>
                    <td className="px-8 py-5 text-gray-900">{row.type}</td>
                    <td className="px-8 py-5 text-gray-600">{row.total} d</td>
                    <td className="px-8 py-5 text-indigo-600">+{row.cf} d</td>
                    <td className="px-8 py-5 text-red-600">-{row.lapse} d</td>
                    <td className="px-8 py-5 text-emerald-600">{row.encash} d</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50/50 border-t border-gray-100">
                <tr className="text-lg text-[#3E3B6F] font-bold">
                  <td className="px-8 py-5">TOTALS</td>
                  <td className="px-8 py-5 font-mono">4,400 d</td>
                  <td className="px-8 py-5 font-mono">2,350 d</td>
                  <td className="px-8 py-5 font-mono">1,190 d</td>
                  <td className="px-8 py-5 font-mono">860 d</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 space-y-4">
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-widest flex items-center gap-2"><Info size={16} /> Policy Reminders</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium text-amber-800/80">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-400" /> <strong>Annual Leave:</strong> Max 10 days CF, expires Mar 31, 2025.</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-400" /> <strong>Casual Leave:</strong> No carry forward allowed, full lapse on Dec 31.</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-400" /> <strong>Sick Leave:</strong> Unlimited carry forward as per health policy.</li>
            </ul>
          </div>
          <div className="flex justify-between">
            <button onClick={handleBack} className="px-8 py-3 text-gray-500 font-bold flex items-center gap-2"><ChevronLeft size={20} /> Back</button>
            <button onClick={handleNext} className="px-10 py-3 bg-[#3E3B6F] text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-[#3E3B6F]/20">Next Step <ChevronRight size={20} /></button>
          </div>
        </div>
      )}

      {/* Step 3: Employee Breakdown */}
      {step === 3 && (
        <div className="space-y-6 animate-in slide-in-from-right-4">
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-6 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="text" placeholder="Search employee name..." className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none" />
                </div>
                <select className="p-2 border-none bg-transparent text-xs font-bold text-gray-500 outline-none">
                  <option>All Departments</option>
                </select>
                <select className="p-2 border-none bg-transparent text-xs font-bold text-gray-500 outline-none">
                  <option>All Leave Types</option>
                </select>
              </div>
              <button className="flex items-center gap-2 text-xs font-bold text-[#3E3B6F] hover:underline">
                <Download size={16} /> Export Preview
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/20">
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase">Employee</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase">Dept</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase">Type</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase">Current</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-indigo-600 uppercase">Carry</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-red-600 uppercase">Lapse</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-900 uppercase">New Opening</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {MOCK_EMPLOYEES.map((emp, i) => (
                    <tr key={i} className={`hover:bg-gray-50/50 ${emp.highLapse ? 'bg-red-50/30' : ''}`}>
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent-peach flex items-center justify-center text-[10px] font-bold text-[#3E3B6F]">{emp.name.split(' ')[0][0]}{emp.name.split(' ')[1][0]}</div>
                          <span className="text-xs font-bold text-gray-900">{emp.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase">{emp.dept}</td>
                      <td className="px-8 py-4 text-xs font-medium text-gray-600">{emp.type}</td>
                      <td className="px-8 py-4 text-xs font-bold">{emp.current} d</td>
                      <td className="px-8 py-4 text-xs font-bold text-indigo-600">+{emp.carry} d</td>
                      <td className="px-8 py-4">
                        <span className={`text-xs font-bold ${emp.lapse > 5 ? 'text-red-600 bg-red-100 px-2 py-0.5 rounded-full' : 'text-red-400'}`}>
                          -{emp.lapse} d
                        </span>
                      </td>
                      <td className="px-8 py-4 text-xs font-bold text-[#3E3B6F]">{emp.newOpening} d</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-center">
               <div className="flex gap-1">
                 <button className="w-8 h-8 rounded bg-[#3E3B6F] text-white text-xs font-bold shadow-md">1</button>
                 <button className="w-8 h-8 rounded hover:bg-gray-100 text-gray-500 text-xs font-bold">2</button>
                 <button className="w-8 h-8 rounded hover:bg-gray-100 text-gray-500 text-xs font-bold">3</button>
               </div>
            </div>
          </div>
          <div className="flex justify-between">
            <button onClick={handleBack} className="px-8 py-3 text-gray-500 font-bold flex items-center gap-2"><ChevronLeft size={20} /> Back</button>
            <button onClick={handleNext} className="px-10 py-3 bg-[#3E3B6F] text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-[#3E3B6F]/20">Next Step <ChevronRight size={20} /></button>
          </div>
        </div>
      )}

      {/* Step 4: Confirm & Execute */}
      {step === 4 && (
        <div className="max-w-3xl mx-auto space-y-8 animate-in zoom-in duration-300">
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl overflow-hidden">
            <div className="bg-[#3E3B6F] p-10 text-white relative overflow-hidden">
               <div className="relative z-10 space-y-4">
                 <h3 className="text-2xl font-bold text-[#E8D5A3]">Ready for Year-End Execution</h3>
                 <p className="text-sm text-white/70 max-w-md">Final audit complete. The following actions will be performed on the <strong>Leave Ledger</strong> for the 2024 fiscal year.</p>
               </div>
               <Zap className="absolute -bottom-10 -right-10 opacity-10" size={180} />
            </div>
            <div className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-1">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Employees</p>
                   <p className="text-3xl font-bold text-gray-900">500</p>
                 </div>
                 <div className="space-y-1">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-indigo-600">Carry Forward</p>
                   <p className="text-3xl font-bold text-indigo-600">1,250 <span className="text-sm">Days</span></p>
                 </div>
                 <div className="space-y-1">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-red-600">To Lapse</p>
                   <p className="text-3xl font-bold text-red-600">340 <span className="text-sm">Days</span></p>
                 </div>
                 <div className="space-y-1">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-emerald-600">Auto-Encash</p>
                   <p className="text-3xl font-bold text-emerald-600">0 <span className="text-sm">Days</span></p>
                 </div>
              </div>

              <div className="p-6 bg-red-50 border border-red-100 rounded-3xl space-y-4">
                <div className="flex items-center gap-3 text-red-600">
                  <ShieldAlert size={20} />
                  <p className="text-sm font-bold uppercase tracking-tight">Irreversible Action</p>
                </div>
                <label className="flex items-start gap-4 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={confirmed} 
                    onChange={(e) => setConfirmed(e.target.checked)}
                    className="w-6 h-6 rounded border-red-200 text-red-600 focus:ring-red-600 mt-0.5" 
                  />
                  <span className="text-sm text-red-800/80 font-medium leading-relaxed group-hover:text-red-900 transition-colors">
                    I understand that this action is irreversible. The system will perform ledger adjustments for 500 staff members. This will be the permanent starting point for the 2025 fiscal year.
                  </span>
                </label>
              </div>

              <div className="flex gap-4">
                <button onClick={handleBack} className="flex-1 py-4 text-gray-500 font-bold bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all">Go Back & Review</button>
                <button 
                  onClick={startProcessing}
                  disabled={!confirmed}
                  className="flex-[2] bg-[#3E3B6F] text-white py-4 rounded-2xl font-bold shadow-2xl shadow-[#3E3B6F]/20 hover:bg-[#4A4680] transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
                >
                  <RefreshCw size={20} /> Process Year-End Transition
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress State */}
      {isExecuting && (
        <div className="fixed inset-0 z-[300] bg-[#3E3B6F]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-10 animate-in fade-in zoom-in duration-500">
             <div className="relative inline-block">
               <RefreshCw size={80} className="text-[#E8D5A3] animate-spin" />
               <Database size={24} className="absolute inset-0 m-auto text-white" />
             </div>
             <div className="space-y-4">
               <h3 className="text-3xl font-bold text-white uppercase tracking-tight">Processing...</h3>
               <p className="text-indigo-200 font-medium italic">{status}</p>
             </div>
             <div className="space-y-2">
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#E8D5A3] transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest">{progress}% Complete</p>
             </div>
          </div>
        </div>
      )}

      {/* Completion State */}
      {step === 5 && (
        <div className="max-w-2xl mx-auto bg-emerald-50 border border-emerald-100 rounded-[40px] p-12 text-center space-y-8 animate-in zoom-in duration-700">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-emerald-500 mx-auto shadow-sm border border-emerald-50">
            <CheckCircle2 size={56} />
          </div>
          <div>
            <h3 className="text-4xl font-bold text-emerald-900 uppercase tracking-tight mb-2">Year-End Complete!</h3>
            <p className="text-emerald-700 font-medium">All leave balances have been successfully transitioned to 2025.</p>
          </div>
          
          <div className="bg-white/50 border border-emerald-100 rounded-3xl p-8 grid grid-cols-2 gap-y-6">
             <div className="text-center">
               <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Staff Processed</p>
               <p className="text-2xl font-bold text-emerald-900">500</p>
             </div>
             <div className="text-center border-l border-emerald-100">
               <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Days CF</p>
               <p className="text-2xl font-bold text-emerald-900">1,250</p>
             </div>
             <div className="text-center pt-4 border-t border-emerald-100">
               <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Days Lapsed</p>
               <p className="text-2xl font-bold text-red-600">340</p>
             </div>
             <div className="text-center pt-4 border-t border-l border-emerald-100">
               <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Errors</p>
               <p className="text-2xl font-bold text-gray-900">0</p>
             </div>
          </div>

          <div className="flex gap-4">
            <button className="flex-1 py-4 bg-[#3E3B6F] text-white rounded-2xl font-bold shadow-xl shadow-[#3E3B6F]/20 flex items-center justify-center gap-2">
              <Download size={20} /> Download Full Report
            </button>
            <button className="flex-1 py-4 bg-white border border-emerald-100 text-emerald-700 rounded-2xl font-bold hover:bg-emerald-100 transition-all flex items-center justify-center gap-2">
              <FileText size={20} /> View Audit Log
            </button>
          </div>
          <button onClick={() => setStep(1)} className="text-xs font-bold text-[#3E3B6F] hover:underline uppercase tracking-widest">Restart Wizard</button>
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