
import React, { useState } from 'react';
import { 
  X, Download, Mail, Calendar, CreditCard, 
  History, Clock, CheckCircle2, TrendingDown,
  ArrowDownRight, ArrowUpRight, Receipt, Info,
  Printer, Share2, Calculator, ShieldCheck
} from 'lucide-react';

interface LoanStatementProps {
  isOpen: boolean;
  onClose: () => void;
  loanId: string;
}

const MOCK_LOAN_DATA = {
  id: 'L-2025-485',
  empName: 'Arsalan Khan',
  empId: 'EMP-1001',
  type: 'Car Loan',
  disbursed: 'Oct 15, 2024',
  principal: 1200000,
  interest: 144000,
  emi: 56000,
  tenure: 24,
  paid: 168000,
  outstanding: 1176000,
  remainingEmis: 21,
  closure: 'Oct 2026',
};

const MOCK_TRANSACTIONS = [
  { date: 'Jan 31, 2025', desc: 'Monthly Payroll EMI Recovery', debit: 0, credit: 56000, balance: 1176000 },
  { date: 'Dec 31, 2024', desc: 'Monthly Payroll EMI Recovery', debit: 0, credit: 56000, balance: 1232000 },
  { date: 'Nov 30, 2024', desc: 'Monthly Payroll EMI Recovery', debit: 0, credit: 56000, balance: 1288000 },
  { date: 'Oct 15, 2024', desc: 'Loan Disbursement (HBL)', debit: 1200000, credit: 0, balance: 1344000 },
];

export const LoanStatement: React.FC<LoanStatementProps> = ({ isOpen, onClose, loanId }) => {
  const [activeView, setActiveView] = useState<'TRANSACTIONS' | 'UPCOMING'>('TRANSACTIONS');

  if (!isOpen) return null;

  const formatPKR = (val: number) => `PKR ${val.toLocaleString()}`;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh]">
        {/* Header Actions */}
        <div className="bg-gray-50 px-8 py-4 border-b flex items-center justify-between">
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-primary/90 shadow-md">
              <Download size={14} /> Download PDF
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-gray-50 shadow-sm">
              <Mail size={14} /> Email Statement
            </button>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {/* Main Summary Card */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="bg-primary p-6 text-white flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black">{MOCK_LOAN_DATA.empName}</h3>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded uppercase font-black">{MOCK_LOAN_DATA.id}</span>
                </div>
                <p className="text-xs text-white/60 font-bold uppercase tracking-widest">{MOCK_LOAN_DATA.type} • {MOCK_LOAN_DATA.empId}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-accent uppercase">Expected Closure</p>
                <p className="text-lg font-black">{MOCK_LOAN_DATA.closure}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 divide-x divide-gray-100 border-b">
              <SummaryItem label="Disbursed On" val={MOCK_LOAN_DATA.disbursed} />
              <SummaryItem label="Principal Amount" val={formatPKR(MOCK_LOAN_DATA.principal)} />
              <SummaryItem label="Total Interest" val={formatPKR(MOCK_LOAN_DATA.interest)} color="text-red-500" />
              <SummaryItem label="Monthly EMI" val={formatPKR(MOCK_LOAN_DATA.emi)} color="text-primary" />
            </div>

            <div className="p-8 grid grid-cols-3 gap-12 bg-gray-50/30">
               <div className="space-y-4">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Repayment Progress</p>
                  <div className="relative h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '12.5%' }} />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase">
                    <span>{formatPKR(MOCK_LOAN_DATA.paid)} Paid</span>
                    <span>12.5% Completed</span>
                  </div>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Outstanding Balance</p>
                  <h4 className="text-3xl font-black text-gray-800">{formatPKR(MOCK_LOAN_DATA.outstanding)}</h4>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Remaining EMIs</p>
                  <div className="flex items-center gap-2 text-primary font-black">
                    <Clock size={20} />
                    <span className="text-2xl">{MOCK_LOAN_DATA.remainingEmis} Months</span>
                  </div>
               </div>
            </div>
          </div>

          {/* Details Tabs */}
          <div className="flex border-b mb-6">
            <button 
              onClick={() => setActiveView('TRANSACTIONS')}
              className={`py-3 px-6 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border-b-2 transition-all ${activeView === 'TRANSACTIONS' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              <History size={14} /> Transaction History
            </button>
            <button 
              onClick={() => setActiveView('UPCOMING')}
              className={`py-3 px-6 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border-b-2 transition-all ${activeView === 'UPCOMING' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              <Calendar size={14} /> Upcoming Schedule
            </button>
          </div>

          {activeView === 'TRANSACTIONS' ? (
            <div className="bg-white border rounded-xl overflow-hidden animate-in fade-in duration-300">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4 text-right">Debit</th>
                    <th className="px-6 py-4 text-right">Credit</th>
                    <th className="px-6 py-4 text-right">Balance (PKR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-medium">
                  {MOCK_TRANSACTIONS.map((t, i) => (
                    <tr key={i} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 text-gray-500">{t.date}</td>
                      <td className="px-6 py-4 text-gray-700">{t.desc}</td>
                      <td className="px-6 py-4 text-right font-mono text-red-500">{t.debit > 0 ? t.debit.toLocaleString() : '--'}</td>
                      <td className="px-6 py-4 text-right font-mono text-green-600">{t.credit > 0 ? t.credit.toLocaleString() : '--'}</td>
                      <td className="px-6 py-4 text-right font-mono font-black text-gray-800">{t.balance.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white border rounded-xl overflow-hidden animate-in slide-in-from-right-2 duration-300">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    <th className="px-6 py-4">Month</th>
                    <th className="px-6 py-4">Inst. #</th>
                    <th className="px-6 py-4 text-right">Principal</th>
                    <th className="px-6 py-4 text-right">Interest</th>
                    <th className="px-6 py-4 text-right">EMI Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-medium">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 text-gray-700">{['Feb', 'Mar', 'Apr', 'May', 'Jun'][i]} 2025</td>
                      <td className="px-6 py-4 font-black text-gray-400">#0{i+4}</td>
                      <td className="px-6 py-4 text-right font-mono text-gray-500">50,000</td>
                      <td className="px-6 py-4 text-right font-mono text-gray-500">6,000</td>
                      <td className="px-6 py-4 text-right font-mono font-black text-primary">56,000</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 italic">
                    <td colSpan={5} className="px-6 py-3 text-center text-[10px] text-gray-400 uppercase font-black">... Further schedule available on download</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="px-8 py-4 bg-gray-50 border-t flex items-center justify-between">
           <div className="flex items-center gap-3">
              <ShieldCheck size={20} className="text-green-500" />
              <p className="text-[10px] text-gray-500 font-bold uppercase leading-tight">
                Statement verified by Treasury Control. Digital Hash: {Math.random().toString(36).substring(7).toUpperCase()}
              </p>
           </div>
           <button className="text-[10px] font-black text-primary uppercase hover:underline flex items-center gap-1">
             <Info size={12} /> Repayment Policy
           </button>
        </div>
      </div>
    </div>
  );
};

const SummaryItem = ({ label, val, color }: { label: string, val: string, color?: string }) => (
  <div className="p-6 space-y-1">
    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
    <p className={`text-base font-black ${color || 'text-gray-700'}`}>{val}</p>
  </div>
);
