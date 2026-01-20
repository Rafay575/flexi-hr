
import React, { useState } from 'react';
import { 
  HandCoins, Calendar, CreditCard, History, Clock, 
  CheckCircle2, ArrowRight, ShieldCheck, Landmark,
  Wallet, FileText, Plus, Info, AlertCircle,
  TrendingDown, ArrowUpRight,
  /* Corrected: Added missing Search and Filter imports */
  Search, Filter
} from 'lucide-react';
import { LoanStatement } from './LoanStatement';

interface LoanHistory {
  date: string;
  type: string;
  amount: number;
  status: 'Approved' | 'Rejected' | 'Paid' | 'Pending';
}

const MOCK_LOAN_HISTORY: LoanHistory[] = [
  { date: 'Jan 05, 2025', type: 'Salary Advance', amount: 45000, status: 'Pending' },
  { date: 'Oct 12, 2024', type: 'Car Loan', amount: 1200000, status: 'Paid' },
  { date: 'Jun 15, 2023', type: 'Emergency Loan', amount: 25000, status: 'Paid' },
];

export const MyLoans = () => {
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);

  const activeLoan = {
    id: 'L-2025-485',
    type: 'Car Loan',
    principal: 1200000,
    outstanding: 1176000,
    emi: 56000,
    remainingInst: 21,
    closureDate: 'Oct 2026',
    progress: 12.5
  };

  const eligibility = {
    withinLimit: true,
    maxEligible: 125000,
    tenureOk: true,
    pendingAdvance: true // Currently shows warning
  };

  const formatPKR = (val: number) => `PKR ${val.toLocaleString()}`;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">My Loans & Advances</h2>
          <p className="text-sm text-gray-500">Track your active liabilities and apply for short-term financial support</p>
        </div>
        <button 
   
          className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          <Plus size={18} /> Request Salary Advance
        </button>
      </div>

      {/* Active Loan Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden group">
          <div className="bg-primary p-8 text-white relative overflow-hidden">
             <div className="relative z-10 flex justify-between items-start">
                <div>
                   <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black bg-accent text-primary px-2 py-0.5 rounded uppercase tracking-widest">Active Liability</span>
                      <span className="text-[10px] font-black bg-white/10 px-2 py-0.5 rounded uppercase border border-white/10 tracking-widest">{activeLoan.id}</span>
                   </div>
                   <h3 className="text-3xl font-black tracking-tight">{activeLoan.type}</h3>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Expected Closure</p>
                   <p className="text-lg font-black text-accent">{activeLoan.closureDate}</p>
                </div>
             </div>

             <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 mt-10 border-t border-white/10 pt-8">
                <div>
                   <p className="text-[10px] font-bold text-white/40 uppercase mb-1">Principal</p>
                   <p className="text-sm font-black">{formatPKR(activeLoan.principal)}</p>
                </div>
                <div>
                   <p className="text-[10px] font-bold text-white/40 uppercase mb-1">Monthly EMI</p>
                   <p className="text-sm font-black">{formatPKR(activeLoan.emi)}</p>
                </div>
                <div>
                   <p className="text-[10px] font-bold text-white/40 uppercase mb-1">Remaining</p>
                   <p className="text-sm font-black">{activeLoan.remainingInst} Months</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-bold text-accent/60 uppercase mb-1">Outstanding</p>
                   <p className="text-xl font-black text-accent">{formatPKR(activeLoan.outstanding)}</p>
                </div>
             </div>
             <Landmark className="absolute right-[-30px] bottom-[-30px] text-white/5 w-64 h-64 rotate-12 group-hover:scale-110 transition-transform duration-700" />
          </div>

          <div className="p-8 space-y-6">
             <div className="space-y-2">
                <div className="flex justify-between items-end">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Repayment Progress</p>
                   <p className="text-xs font-black text-primary">{activeLoan.progress}% Completed</p>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                   <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${activeLoan.progress}%` }} />
                </div>
             </div>
             <div className="flex gap-4 pt-2">
                <button 
                  onClick={() => setSelectedLoanId(activeLoan.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition-all"
                >
                   <FileText size={16} /> View Statement
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-primary/20 text-primary rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm">
                   <CreditCard size={16} /> Early Settlement
                </button>
             </div>
          </div>
        </div>

        {/* Eligibility Panel */}
        <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-100 flex flex-col justify-between space-y-8">
           <div className="space-y-6">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px]">Advance Eligibility</h4>
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-xs font-bold text-gray-600">Service Tenure (&gt;6mo)</span>
                    <CheckCircle2 size={18} className="text-green-500" />
                 </div>
                 <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl border border-orange-100">
                    <span className="text-xs font-bold text-orange-700">Existing Req. Pending</span>
                    <AlertCircle size={18} className="text-orange-500" />
                 </div>
                 <div className="pt-4 border-t border-dashed">
                    <p className="text-[9px] font-black text-gray-400 uppercase mb-1 text-center">Available Liquidity Limit</p>
                    <h4 className="text-3xl font-black text-primary text-center tracking-tighter">{formatPKR(125000)}</h4>
                 </div>
              </div>
           </div>
           <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3">
              <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
              <p className="text-[9px] text-blue-700 font-bold uppercase leading-relaxed tracking-tight">
                 Advances are interest-free but subject to manager approval and available departmental budget.
              </p>
           </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6 border-b bg-gray-50/50 flex items-center justify-between">
           <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
             <History size={16} /> Request Archive
           </h3>
           <div className="flex gap-2">
              <button className="p-2 text-gray-400 hover:text-primary transition-all"><Search size={18}/></button>
              <button className="p-2 text-gray-400 hover:text-primary transition-all"><Filter size={18}/></button>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50/30 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-8 py-5">Application Date</th>
                <th className="px-8 py-5">Loan Category</th>
                <th className="px-8 py-5 text-right">Sanctioned Amount</th>
                <th className="px-8 py-5 text-center">Status</th>
                <th className="px-8 py-5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_LOAN_HISTORY.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-4 font-bold text-gray-700">{row.date}</td>
                  <td className="px-8 py-4">
                     <span className="text-[10px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10 uppercase tracking-tight">{row.type}</span>
                  </td>
                  <td className="px-8 py-4 text-right font-mono font-black text-gray-800">{formatPKR(row.amount)}</td>
                  <td className="px-8 py-4 text-center">
                    <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border shadow-sm ${
                      row.status === 'Paid' ? 'bg-green-50 text-green-600 border-green-200' :
                      row.status === 'Pending' ? 'bg-orange-50 text-orange-600 border-orange-200 animate-pulse' :
                      'bg-gray-50 text-gray-400 border-gray-200'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                     <button className="p-2 text-gray-300 hover:text-primary transition-all"><ArrowRight size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Loan Statement Viewer Modal */}
      <LoanStatement 
        isOpen={!!selectedLoanId} 
        onClose={() => setSelectedLoanId(null)} 
        loanId={selectedLoanId || ''} 
      />
    </div>
  );
};

const SummaryCard = ({ label, val, icon: Icon, color }: { label: string, val: string, icon: any, color: string }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex items-center justify-between group hover:shadow-lg transition-all">
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <h4 className={`text-xl font-black ${color}`}>{val}</h4>
    </div>
    <div className={`p-3 rounded-xl ${color.replace('text-', 'bg-').split(' ')[0]}/10 ${color}`}>
      <Icon size={20} />
    </div>
  </div>
);
