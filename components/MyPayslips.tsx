
import React, { useState, useMemo } from 'react';
import { 
  Download, Eye, Calendar, FileText, 
  Wallet, ShieldCheck, Landmark, TrendingUp,
  DownloadCloud, Search, Filter, ArrowUpRight,
  Calculator, History
} from 'lucide-react';
import { PayslipDetail } from './PayslipDetail';

interface PayslipMonth {
  month: string;
  gross: number;
  tax: number;
  pf: number;
  deductions: number;
  net: number;
  status: 'Published' | 'Paid';
}

const MOCK_DATA_2024: PayslipMonth[] = [
  { month: 'December', gross: 125000, tax: 12500, pf: 6250, deductions: 18750, net: 106250, status: 'Paid' },
  { month: 'November', gross: 125000, tax: 12500, pf: 6250, deductions: 18750, net: 106250, status: 'Paid' },
  { month: 'October', gross: 125000, tax: 12500, pf: 6250, deductions: 18750, net: 106250, status: 'Paid' },
  { month: 'September', gross: 125000, tax: 12500, pf: 6250, deductions: 18750, net: 106250, status: 'Paid' },
  { month: 'August', gross: 115000, tax: 10500, pf: 5750, deductions: 16250, net: 98750, status: 'Paid' },
  { month: 'July', gross: 115000, tax: 10500, pf: 5750, deductions: 16250, net: 98750, status: 'Paid' },
  { month: 'June', gross: 115000, tax: 10500, pf: 5750, deductions: 16250, net: 98750, status: 'Paid' },
  { month: 'May', gross: 115000, tax: 10500, pf: 5750, deductions: 16250, net: 98750, status: 'Paid' },
  { month: 'April', gross: 115000, tax: 10500, pf: 5750, deductions: 16250, net: 98750, status: 'Paid' },
  { month: 'March', gross: 115000, tax: 10500, pf: 5750, deductions: 16250, net: 98750, status: 'Paid' },
  { month: 'February', gross: 110000, tax: 9500, pf: 5500, deductions: 15000, net: 95000, status: 'Paid' },
  { month: 'January', gross: 110000, tax: 9500, pf: 5500, deductions: 15000, net: 95000, status: 'Paid' },
];

export const MyPayslips: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  
  const annualSummary = useMemo(() => {
    return MOCK_DATA_2024.reduce((acc, curr) => ({
      gross: acc.gross + curr.gross,
      tax: acc.tax + curr.tax,
      pf: acc.pf + curr.pf,
      net: acc.net + curr.net
    }), { gross: 0, tax: 0, pf: 0, net: 0 });
  }, []);

  const formatPKR = (val: number) => `PKR ${val.toLocaleString()}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">My Payslips</h2>
          <p className="text-sm text-gray-500">Access your historical payroll documents and annual tax statements</p>
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
            <DownloadCloud size={18} /> Download Annual Summary
          </button>
        </div>
      </div>

      {/* Year Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard label="Annual Gross" val={annualSummary.gross} icon={TrendingUp} color="text-gray-800" />
        <SummaryCard label="Annual Tax Paid" val={annualSummary.tax} icon={ShieldCheck} color="text-purple-600" />
        <SummaryCard label="Total PF Contribution" val={annualSummary.pf} icon={Landmark} color="text-blue-600" />
        <SummaryCard label="Total Net Received" val={annualSummary.net} icon={Wallet} color="text-primary" />
      </div>

      {/* Payslips Table */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-4 border-b bg-gray-50/30 flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
            <History size={14} /> Disbursement History: {selectedYear}
          </h3>
          <div className="flex items-center gap-2">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input type="text" placeholder="Search months..." className="pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none w-48" />
             </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50/50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-5">Month</th>
                <th className="px-6 py-5 text-right">Gross Salary</th>
                <th className="px-6 py-5 text-right">Tax Withheld</th>
                <th className="px-6 py-5 text-right">Deductions</th>
                <th className="px-6 py-5 text-right font-black">Net Payout</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_DATA_2024.map((row) => (
                <tr key={row.month} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-primary/5 text-primary rounded-lg">
                          <Calendar size={16} />
                       </div>
                       <span className="font-bold text-gray-700">{row.month} {selectedYear}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-gray-500">{row.gross.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-purple-400">{row.tax.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-red-400">-{row.deductions.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right font-mono font-black text-primary bg-primary/5 group-hover:bg-primary/10 transition-colors">
                    {row.net.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-[9px] font-black uppercase px-2.5 py-1 rounded-full border border-green-100 bg-green-50 text-green-600">
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <button 
                        onClick={() => setSelectedMonth(row.month)}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-100" 
                        title="Preview Payslip"
                       >
                         <Eye size={18} />
                       </button>
                       <button className="p-2 text-gray-400 hover:text-primary hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-100" title="Download PDF">
                         <Download size={18} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-start gap-4">
         <div className="p-3 bg-white rounded-xl text-indigo-600 shadow-sm">
            <FileText size={24} />
         </div>
         <div className="space-y-1">
            <h5 className="text-sm font-black text-indigo-900 uppercase tracking-tight">Need a Certified Salary Certificate?</h5>
            <p className="text-xs text-indigo-700 leading-relaxed font-medium">
              You can generate a digitally signed salary certificate for bank applications or visa processing. Certificates are valid for 30 days from the date of issuance.
            </p>
            <button className="text-[10px] font-black text-indigo-600 uppercase hover:underline flex items-center gap-1 mt-2">
              Generate Now <ArrowUpRight size={12} />
            </button>
         </div>
      </div>

      <PayslipDetail 
        isOpen={!!selectedMonth} 
        onClose={() => setSelectedMonth(null)} 
        month={selectedMonth || ''} 
      />
    </div>
  );
};

const SummaryCard = ({ label, val, icon: Icon, color }: { label: string, val: number, icon: any, color: string }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 relative overflow-hidden group hover:shadow-lg transition-all">
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{label}</p>
    <h4 className={`text-2xl font-black ${color}`}>PKR {val.toLocaleString()}</h4>
    <Icon className={`absolute -right-2 -bottom-2 opacity-5 w-20 h-20 group-hover:scale-110 transition-transform ${color}`} />
  </div>
);
