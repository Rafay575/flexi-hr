
import React, { useState, useMemo } from 'react';
import { 
  Landmark, Download, Calendar, ShieldCheck, 
  TrendingUp, History, Info, PiggyBank,
  ArrowUpRight, Calculator, Wallet, Filter, Search,
  // Fix: Added missing ChevronRight icon import
  ChevronRight
} from 'lucide-react';

interface PFTransaction {
  date: string;
  desc: string;
  ee: number;
  er: number;
  balance: number;
}

const MOCK_PF_DATA_2024: PFTransaction[] = [
  { date: 'Dec 31, 2024', desc: 'Monthly Contribution', ee: 8954, er: 8954, balance: 225000 },
  { date: 'Nov 30, 2024', desc: 'Monthly Contribution', ee: 8954, er: 8954, balance: 207092 },
  { date: 'Oct 31, 2024', desc: 'Monthly Contribution', ee: 8954, er: 8954, balance: 189184 },
  { date: 'Jun 30, 2024', desc: 'Annual Interest Credit (12%)', ee: 0, er: 0, balance: 171276 },
  { date: 'Sep 30, 2024', desc: 'Monthly Contribution', ee: 8954, er: 8954, balance: 153368 },
];

export const MyPFStatement: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState(2024);

  const summary = useMemo(() => {
    return {
      pfAccount: 'PF-1001-PK',
      memberSince: 'July 2020',
      openingBal: 125000,
      eeTotal: 107448,
      erTotal: 107448,
      interest: 18500,
      closingBal: 358396
    };
  }, [selectedYear]);

  const formatPKR = (val: number) => `PKR ${val.toLocaleString()}`;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Provident Fund Statement</h2>
          <p className="text-sm text-gray-500">Track your retirement savings and accrued employer matches</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-white border border-gray-200 rounded-xl shadow-sm">
            {[2023, 2024, 2025].map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${
                  selectedYear === year ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
          <button className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95">
            <Download size={18} /> Download Annual Statement
          </button>
        </div>
      </div>

      {/* Summary Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-md border border-gray-100 relative overflow-hidden group">
          <div className="relative z-10 space-y-6">
            <div className="flex justify-between items-start">
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">PF Account ID</p>
                  <h3 className="text-2xl font-black text-primary tracking-tighter">{summary.pfAccount}</h3>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Member Since</p>
                  <p className="text-sm font-bold text-gray-700">{summary.memberSince}</p>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-8 pt-4 border-t border-gray-50">
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase">Opening Balance ({selectedYear})</p>
                  <p className="text-xl font-black text-gray-800">{formatPKR(summary.openingBal)}</p>
               </div>
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase">Interest Earned</p>
                  <div className="flex items-center gap-1.5 text-green-600 font-black text-xl">
                     <TrendingUp size={18} /> {formatPKR(summary.interest)}
                  </div>
               </div>
            </div>
          </div>
          <PiggyBank className="absolute right-[-20px] bottom-[-20px] text-primary/5 w-40 h-40 rotate-12" />
        </div>

        <div className="lg:col-span-2 bg-primary p-8 rounded-3xl text-white shadow-xl shadow-primary/20 relative overflow-hidden">
          <div className="relative z-10 flex flex-col h-full justify-between">
             <div>
                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Total Accumulated Balance</p>
                <h2 className="text-5xl font-black text-accent tracking-tighter">{formatPKR(summary.closingBal)}</h2>
             </div>
             <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10 mt-6">
                <div>
                   <p className="text-[10px] font-bold text-white/40 uppercase mb-1">EE Portion (Principal)</p>
                   <p className="text-lg font-black">{formatPKR(summary.eeTotal)}</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-bold text-white/40 uppercase mb-1">ER Portion (Match)</p>
                   <p className="text-lg font-black">{formatPKR(summary.erTotal)}</p>
                </div>
             </div>
          </div>
          <ShieldCheck className="absolute right-[-10px] top-[-10px] text-white/5 w-48 h-48 -rotate-12" />
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6 border-b bg-gray-50/50 flex items-center justify-between">
           <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
             <History size={16} /> Transaction Ledger: {selectedYear}
           </h3>
           <div className="flex items-center gap-3">
              <button className="text-[10px] font-black text-primary uppercase flex items-center gap-1.5 hover:underline">
                <Calculator size={14} /> View Loan Eligibility
              </button>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-8 py-5">Value Date</th>
                <th className="px-8 py-5">Description</th>
                <th className="px-8 py-5 text-right text-primary">EE Contribution</th>
                <th className="px-8 py-5 text-right text-primary">ER Contribution</th>
                <th className="px-8 py-5 text-right font-black">Running Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_PF_DATA_2024.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-8 py-4">
                     <div className="flex items-center gap-3">
                        <Calendar size={14} className="text-gray-300" />
                        <span className="font-bold text-gray-700">{row.date}</span>
                     </div>
                  </td>
                  <td className="px-8 py-4 font-medium text-gray-500">{row.desc}</td>
                  <td className="px-8 py-4 text-right font-mono font-bold text-gray-600">
                    {row.ee > 0 ? row.ee.toLocaleString() : '--'}
                  </td>
                  <td className="px-8 py-4 text-right font-mono font-bold text-gray-600">
                    {row.er > 0 ? row.er.toLocaleString() : '--'}
                  </td>
                  <td className="px-8 py-4 text-right font-mono font-black text-primary bg-primary/[0.02] group-hover:bg-primary/5 transition-colors">
                    {row.balance.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-100 font-black border-t-2 border-gray-200">
               <tr>
                  <td className="px-8 py-6 uppercase text-[10px] text-gray-400 tracking-widest">Yearly Activity Summary</td>
                  <td className="px-8 py-6 text-right font-mono text-gray-400 italic">Totals:</td>
                  <td className="px-8 py-6 text-right font-mono text-primary">{summary.eeTotal.toLocaleString()}</td>
                  <td className="px-8 py-6 text-right font-mono text-primary">{summary.erTotal.toLocaleString()}</td>
                  <td className="px-8 py-6 text-right font-mono text-primary text-xl underline decoration-double underline-offset-8">
                    {summary.closingBal.toLocaleString()}
                  </td>
               </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Policy Note & Action */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 bg-blue-50 border border-blue-100 rounded-3xl flex items-start gap-5 shadow-sm h-fit">
           <div className="p-2 bg-white rounded-xl text-blue-500 shadow-sm border border-blue-50">
              <Info size={24} />
           </div>
           <div className="space-y-1">
              <h5 className="text-sm font-black text-blue-900 uppercase tracking-tight leading-none">PF Withdrawal Policy</h5>
              <p className="text-xs text-blue-700 leading-relaxed font-medium">
                You are eligible to apply for a loan against your Provident Fund balance (up to 80% of EE portion). Interest-free loans are available for medical emergencies, housing, and education. Full withdrawal is only permitted upon separation from the company.
              </p>
           </div>
        </div>
        <button className="bg-white border-2 border-primary/20 p-6 rounded-3xl flex flex-col items-center justify-center gap-3 hover:bg-primary group transition-all shadow-md">
           <Wallet className="text-primary group-hover:text-white transition-colors" size={32} />
           <p className="text-xs font-black text-primary group-hover:text-white uppercase tracking-widest">View PF Loan Options</p>
           <ChevronRight className="text-primary/40 group-hover:text-white" size={16} />
        </button>
      </div>
    </div>
  );
};
