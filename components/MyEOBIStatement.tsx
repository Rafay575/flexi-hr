
import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, Download, Calendar, Landmark, 
  History, Info, ChevronRight, Search, 
  Filter, Building2, UserCheck, Calculator
} from 'lucide-react';

interface EOBIMonth {
  month: string;
  salaryBase: number;
  eeShare: number;
  erShare: number;
  status: 'Deposited' | 'Pending';
}

const MOCK_DATA_2024: EOBIMonth[] = [
  { month: 'December', salaryBase: 32000, eeShare: 320, erShare: 1600, status: 'Deposited' },
  { month: 'November', salaryBase: 32000, eeShare: 320, erShare: 1600, status: 'Deposited' },
  { month: 'October', salaryBase: 32000, eeShare: 320, erShare: 1600, status: 'Deposited' },
  { month: 'September', salaryBase: 32000, eeShare: 320, erShare: 1600, status: 'Deposited' },
  { month: 'August', salaryBase: 32000, eeShare: 320, erShare: 1600, status: 'Deposited' },
  { month: 'July', salaryBase: 32000, eeShare: 320, erShare: 1600, status: 'Deposited' },
  { month: 'June', salaryBase: 25000, eeShare: 250, erShare: 1250, status: 'Deposited' },
  { month: 'May', salaryBase: 25000, eeShare: 250, erShare: 1250, status: 'Deposited' },
  { month: 'April', salaryBase: 25000, eeShare: 250, erShare: 1250, status: 'Deposited' },
  { month: 'March', salaryBase: 25000, eeShare: 250, erShare: 1250, status: 'Deposited' },
  { month: 'February', salaryBase: 25000, eeShare: 250, erShare: 1250, status: 'Deposited' },
  { month: 'January', salaryBase: 25000, eeShare: 250, erShare: 1250, status: 'Deposited' },
];

export const MyEOBIStatement: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState(2024);

  const summary = useMemo(() => {
    const eeTotal = MOCK_DATA_2024.reduce((acc, curr) => acc + curr.eeShare, 0);
    const erTotal = MOCK_DATA_2024.reduce((acc, curr) => acc + curr.erShare, 0);
    return {
      eobiNo: 'ABC-12345678',
      regDate: 'July 15, 2020',
      months: 54,
      eeTotal,
      erTotal,
      grandTotal: eeTotal + erTotal
    };
  }, []);

  const formatPKR = (val: number) => `PKR ${val.toLocaleString()}`;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">EOBI Contribution Statement</h2>
          <p className="text-sm text-gray-500">Employee Old-Age Benefits Institution retirement fund tracking</p>
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
            <Download size={18} /> Download Statement
          </button>
        </div>
      </div>

      {/* Summary Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-md border border-gray-100 flex flex-col justify-between relative overflow-hidden group">
          <div className="relative z-10 space-y-6">
            <div className="flex justify-between items-start">
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Registered Account</p>
                  <h3 className="text-2xl font-black text-primary tracking-tighter">{summary.eobiNo}</h3>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Registration Date</p>
                  <p className="text-sm font-bold text-gray-700">{summary.regDate}</p>
               </div>
            </div>
            <div className="flex items-center gap-8 pt-4 border-t border-gray-50">
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase">Contribution Period</p>
                  <p className="text-xl font-black text-gray-800">{summary.months} <span className="text-xs text-gray-400">Months</span></p>
               </div>
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase">Current Status</p>
                  <div className="flex items-center gap-1.5 text-green-600 font-black uppercase text-[10px]">
                     <UserCheck size={14} /> Active Beneficiary
                  </div>
               </div>
            </div>
          </div>
          <Landmark className="absolute right-[-20px] bottom-[-20px] text-primary/5 w-40 h-40 rotate-12" />
        </div>

        <div className="lg:col-span-2 bg-primary p-8 rounded-3xl text-white shadow-xl shadow-primary/20 relative overflow-hidden">
          <div className="relative z-10 flex flex-col h-full justify-between">
             <div>
                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Total Accumulated Fund</p>
                <h2 className="text-5xl font-black text-accent tracking-tighter">{formatPKR(summary.grandTotal)}</h2>
             </div>
             <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10 mt-6">
                <div>
                   <p className="text-[10px] font-bold text-white/40 uppercase mb-1">EE Contribution (1%)</p>
                   <p className="text-lg font-black">{formatPKR(summary.eeTotal)}</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-bold text-white/40 uppercase mb-1">ER Contribution (5%)</p>
                   <p className="text-lg font-black">{formatPKR(summary.erTotal)}</p>
                </div>
             </div>
          </div>
          <ShieldCheck className="absolute right-[-10px] top-[-10px] text-white/5 w-48 h-48 -rotate-12" />
        </div>
      </div>

      {/* Contribution Table */}
      <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6 border-b bg-gray-50/50 flex items-center justify-between">
           <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
             <History size={16} /> Monthly Contribution Ledger: {selectedYear}
           </h3>
           <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
                * Calculated on min wage cap PKR 32K
              </span>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-8 py-5">Month</th>
                <th className="px-8 py-5 text-right">Applicable Base</th>
                <th className="px-8 py-5 text-right text-red-500">EE Share (1%)</th>
                <th className="px-8 py-5 text-right text-blue-600">ER Share (5%)</th>
                <th className="px-8 py-5 text-right font-black">Total Deposit</th>
                <th className="px-8 py-5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_DATA_2024.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-8 py-4">
                     <div className="flex items-center gap-3">
                        <Calendar size={14} className="text-gray-300" />
                        <span className="font-bold text-gray-700">{row.month}</span>
                     </div>
                  </td>
                  <td className="px-8 py-4 text-right font-mono text-gray-500">{row.salaryBase.toLocaleString()}</td>
                  <td className="px-8 py-4 text-right font-mono font-bold text-red-400">-{row.eeShare.toLocaleString()}</td>
                  <td className="px-8 py-4 text-right font-mono font-bold text-blue-400">{row.erShare.toLocaleString()}</td>
                  <td className="px-8 py-4 text-right font-mono font-black text-primary bg-primary/[0.02] group-hover:bg-primary/5">
                    {(row.eeShare + row.erShare).toLocaleString()}
                  </td>
                  <td className="px-8 py-4 text-center">
                    <span className="text-[9px] font-black uppercase px-2.5 py-1 rounded-full border border-green-100 bg-green-50 text-green-600">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-100 font-black border-t-2 border-gray-200">
               <tr>
                  <td className="px-8 py-6 uppercase text-[10px] text-gray-400 tracking-widest">Yearly Contribution Total</td>
                  <td className="px-8 py-6 text-right font-mono text-gray-400">--</td>
                  <td className="px-8 py-6 text-right font-mono text-red-600">3,420</td>
                  <td className="px-8 py-6 text-right font-mono text-blue-700">17,100</td>
                  <td className="px-8 py-6 text-right font-mono text-primary text-xl underline decoration-double underline-offset-8">20,520</td>
                  <td></td>
               </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Policy Note */}
      <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl flex items-start gap-5 max-w-4xl mx-auto shadow-sm">
         <div className="p-2 bg-white rounded-xl text-blue-500 shadow-sm">
            <Info size={24} />
         </div>
         <div className="space-y-1">
            <h5 className="text-sm font-black text-blue-900 uppercase tracking-tight leading-none">Statutory Contribution Rules</h5>
            <p className="text-xs text-blue-700 leading-relaxed font-medium">
              As per current EOBI guidelines, contributions are capped at the government-notified minimum wage. Effective July 2024, the calculation base is PKR 32,000. Employee share (1%) is PKR 320 and Employer share (5%) is PKR 1,600 monthly. Historical records prior to July reflect the previous PKR 25,000 cap.
            </p>
         </div>
      </div>
    </div>
  );
};
