import React, { useState } from 'react';
import { 
  Calendar, ShieldCheck, Download, FileText, 
  Search, Filter, ChevronRight, CheckCircle2, 
  AlertCircle, Clock, Landmark, History, 
  Printer, ArrowUpRight, BarChart3, CalendarDays,
  FileCheck, Zap, DownloadCloud, Info
} from 'lucide-react';

type ReturnStatus = 'Pending' | 'Generated' | 'Paid' | 'Overdue';

interface ComplianceReturn {
  id: string;
  name: string;
  period: string;
  dueDate: string;
  daysRemaining: number;
  status: ReturnStatus;
  amount: number;
  type: 'EOBI' | 'PESSI' | 'WHT' | 'PF';
}

const MOCK_COMPLIANCE: ComplianceReturn[] = [
  { id: '1', name: 'EOBI Monthly Contribution', period: 'Jan 2025', dueDate: '2025-02-15', daysRemaining: 21, status: 'Generated', amount: 624000, type: 'EOBI' },
  { id: '2', name: 'PESSI (Punjab) Social Security', period: 'Jan 2025', dueDate: '2025-02-15', daysRemaining: 21, status: 'Pending', amount: 399900, type: 'PESSI' },
  { id: '3', name: 'Income Tax WHT (Annex-C)', period: 'Jan 2025', dueDate: '2025-02-15', daysRemaining: 21, status: 'Pending', amount: 3500000, type: 'WHT' },
  { id: '4', name: 'Provident Fund Deposit', period: 'Jan 2025', dueDate: '2025-02-10', daysRemaining: 16, status: 'Generated', amount: 5550000, type: 'PF' },
];

const MOCK_HISTORY = [
  { return: 'WHT Annex-C', period: 'Dec 2024', submitted: '2025-01-12', amount: 3420000, challan: 'FBR-99221-X' },
  { return: 'EOBI Contribution', period: 'Dec 2024', submitted: '2025-01-14', amount: 615000, challan: 'EOBI-ISB-001' },
  { return: 'PESSI Return', period: 'Dec 2024', submitted: '2025-01-14', amount: 385000, challan: 'PUN-SS-441' },
];

const ANNUAL_FILINGS = [
  { name: 'Annual Income Tax Return (Employer)', period: 'FY 2023-24', due: '2024-09-30', status: 'Completed' },
  { name: 'EOBI Annual Verification', period: '2024', due: '2024-12-31', status: 'Completed' },
  { name: 'PF Trust Audit Filing', period: 'FY 2023-24', due: '2025-03-31', status: 'In-Progress' },
];

export const StatutoryReturnsDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Jan 2025');
  const [viewMode, setViewMode] = useState<'TABLE' | 'CALENDAR'>('TABLE');

  const formatPKR = (val: number) => `PKR ${val.toLocaleString()}`;

  const getStatusStyle = (status: ReturnStatus) => {
    switch (status) {
      case 'Pending': return 'bg-gray-100 text-gray-500 border-gray-200';
      case 'Generated': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'Paid': return 'bg-green-50 text-green-600 border-green-200';
      case 'Overdue': return 'bg-red-50 text-red-600 border-red-200 animate-pulse';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <ShieldCheck className="text-primary" size={28} />
            Statutory Compliance Dashboard
          </h2>
          <p className="text-sm text-gray-500">Consolidated monitoring for FBR, EOBI, and Provincial Institutions</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10"
          >
            <option>Jan 2025</option>
            <option>Dec 2024</option>
            <option>Nov 2024</option>
          </select>
          <button className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95">
            <Zap size={18} /> Generate All Pending
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Compliance Tracker */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-6 border-b bg-gray-50/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 p-1 bg-gray-200/50 rounded-xl">
                  <button 
                    onClick={() => setViewMode('TABLE')}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'TABLE' ? 'bg-white text-primary shadow-sm' : 'text-gray-400'}`}
                  >
                    Table View
                  </button>
                  <button 
                    onClick={() => setViewMode('CALENDAR')}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'CALENDAR' ? 'bg-white text-primary shadow-sm' : 'text-gray-400'}`}
                  >
                    Calendar
                  </button>
                </div>
                <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400">Current Cycle Returns</h3>
              </div>
              <button className="text-[10px] font-black text-primary uppercase hover:underline flex items-center gap-1">
                <DownloadCloud size={14} /> Export Calendar
              </button>
            </div>

            {viewMode === 'TABLE' ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      <th className="px-6 py-4">Return / Form</th>
                      <th className="px-6 py-4 text-center">Period</th>
                      <th className="px-6 py-4 text-center">Due Date</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-right">Liability</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {MOCK_COMPLIANCE.map((ret) => (
                      <tr key={ret.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/5 text-primary flex items-center justify-center">
                               <FileText size={16} />
                            </div>
                            <span className="font-bold text-gray-700">{ret.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center font-medium text-gray-500">{ret.period}</td>
                        <td className="px-6 py-4 text-center">
                          <p className="font-bold text-gray-700">{ret.dueDate}</p>
                          <p className="text-[9px] font-black text-orange-500 uppercase">{ret.daysRemaining} Days Left</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border ${getStatusStyle(ret.status)}`}>
                            {ret.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-mono font-black text-primary">{formatPKR(ret.amount)}</td>
                        <td className="px-6 py-4 text-right">
                           <button className="p-2 text-gray-400 hover:text-primary transition-all">
                              <ArrowUpRight size={18} />
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 grid grid-cols-7 gap-px bg-gray-200 animate-in zoom-in-95 duration-300">
                {/* Simplified Calendar Preview */}
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
                  <div key={d} className="bg-gray-50 p-2 text-center text-[9px] font-black text-gray-400 uppercase">{d}</div>
                ))}
                {Array.from({ length: 31 }).map((_, i) => {
                  const day = i + 1;
                  const isDue = [10, 15].includes(day);
                  return (
                    <div key={i} className="bg-white min-h-[80px] p-2 relative group hover:bg-gray-50 transition-colors">
                      <span className="text-[10px] font-bold text-gray-400">{day}</span>
                      {isDue && (
                        <div className={`mt-1 p-1 rounded text-[8px] font-black uppercase truncate ${day === 10 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                          {day === 10 ? 'PF Deposit' : 'FBR/EOBI'}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Submission History */}
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-6 border-b bg-gray-50/50 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
                <History size={16} /> Recent Submission Audit
              </h3>
            </div>
            <table className="w-full text-left text-sm">
               <thead>
                  <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                     <th className="px-6 py-4">Return Type</th>
                     <th className="px-6 py-4 text-center">Period</th>
                     <th className="px-6 py-4 text-center">Submitted</th>
                     <th className="px-6 py-4 text-right">Paid Amount</th>
                     <th className="px-6 py-4">Challan Ref</th>
                     <th className="px-6 py-4 text-right">Proof</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {MOCK_HISTORY.map((h, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                       <td className="px-6 py-4 font-bold text-gray-700">{h.return}</td>
                       <td className="px-6 py-4 text-center text-gray-500 font-medium">{h.period}</td>
                       <td className="px-6 py-4 text-center text-gray-500 font-medium">{h.submitted}</td>
                       <td className="px-6 py-4 text-right font-mono font-bold text-green-600">{formatPKR(h.amount)}</td>
                       <td className="px-6 py-4 font-mono text-[10px] text-gray-400 font-bold">{h.challan}</td>
                       <td className="px-6 py-4 text-right">
                          <button className="p-1.5 hover:bg-primary/5 text-primary rounded transition-all"><Download size={16}/></button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar: Annual Filings & Reminders */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-primary p-8 rounded-3xl text-white shadow-xl shadow-primary/20 space-y-6 relative overflow-hidden group">
             <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white/10 rounded-xl"><CalendarDays size={24} className="text-accent" /></div>
                   <h3 className="text-lg font-black uppercase tracking-tight leading-none">Annual Statutory Filings</h3>
                </div>
                <div className="space-y-4">
                   {ANNUAL_FILINGS.map((f, i) => (
                     <div key={i} className="bg-white/10 p-4 rounded-2xl border border-white/5 space-y-2 group-hover:bg-white/15 transition-all">
                        <div className="flex justify-between items-start">
                           <p className="text-xs font-black leading-tight max-w-[70%]">{f.name}</p>
                           <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${f.status === 'Completed' ? 'bg-green-500 text-white' : 'bg-accent text-primary'}`}>{f.status}</span>
                        </div>
                        <div className="flex justify-between items-end">
                           <p className="text-[9px] font-bold text-white/40 uppercase">Period: {f.period}</p>
                           <p className="text-[9px] font-bold text-accent uppercase">Due: {f.due}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
             <Landmark className="absolute right-[-20px] bottom-[-20px] text-white/5 w-48 h-48 rotate-12" />
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md space-y-6">
             <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Info size={16} /> Compliance Reminders
             </h3>
             <div className="space-y-4">
                <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-start gap-3">
                   <AlertCircle size={20} className="text-orange-500 shrink-0 mt-0.5" />
                   <p className="text-[10px] text-orange-700 leading-relaxed font-bold uppercase tracking-tight">
                     January 2025 WHT Annex-C requires 08 employee NTNs to be updated before Feb 15th filing.
                   </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
                   <CheckCircle2 size={20} className="text-blue-500 shrink-0 mt-0.5" />
                   <p className="text-[10px] text-blue-700 font-bold uppercase tracking-tight">
                     Provident Fund Trust interest rate (10.5%) applied successfully for FY 2024-25.
                   </p>
                </div>
             </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
             <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Quick Stats (MTD)</h4>
             <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold">
                   <span className="text-gray-500">Returns Generated</span>
                   <span className="text-primary">02 / 04</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                   <div className="h-full bg-primary" style={{ width: '50%' }} />
                </div>
                <div className="flex justify-between text-xs font-bold pt-2">
                   <span className="text-gray-500">Liability Settled</span>
                   <span className="text-green-600">PKR 5.5M</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};