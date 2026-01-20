
import React, { useState } from 'react';
import { 
  FileSpreadsheet, FileText, Download, Search, Filter, 
  ChevronDown, Layers, Building2, Landmark, ShieldCheck,
  LayoutList, PieChart, Info, MoreHorizontal, Printer
} from 'lucide-react';

type ReportType = 'FULL' | 'SUMMARY' | 'DEPARTMENT' | 'COST_CENTER' | 'BANK' | 'STATUTORY';

interface RegisterRow {
  id: string;
  name: string;
  dept: string;
  basic: number;
  allowances: number;
  gross: number;
  tax: number;
  pf: number;
  deducts: number;
  net: number;
}

const MOCK_DATA: RegisterRow[] = [
  { id: 'EMP-1001', name: 'Arsalan Khan', dept: 'Engineering', basic: 107500, allowances: 107500, gross: 215000, tax: 22500, pf: 7500, deducts: 30000, net: 185000 },
  { id: 'EMP-1005', name: 'Mustafa Kamal', dept: 'Engineering', basic: 275000, allowances: 275000, gross: 550000, tax: 110000, pf: 20000, deducts: 130000, net: 420000 },
  { id: 'EMP-1102', name: 'Saira Ahmed', dept: 'HR', basic: 62500, allowances: 62500, gross: 125000, tax: 12500, pf: 6250, deducts: 18750, net: 106250 },
  // Fixed: Removed 'ailments' which doesn't exist in RegisterRow type
  { id: 'EMP-1004', name: 'Zainab Bibi', dept: 'Operations', basic: 46000, allowances: 46000, gross: 92000, tax: 5000, pf: 5000, deducts: 10000, net: 82000 },
  { id: 'EMP-1003', name: 'Umar Farooq', dept: 'Sales', basic: 22500, allowances: 22500, gross: 45000, tax: 0, pf: 2500, deducts: 2500, net: 42500 },
];

export const PayrollRegisters: React.FC = () => {
  const [reportType, setReportType] = useState<ReportType>('FULL');
  const [selectedRun, setSelectedRun] = useState('Jan 2025 (v1.2)');
  const [search, setSearch] = useState('');

  const formatPKR = (val: number) => val.toLocaleString(undefined, { minimumFractionDigits: 0 });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Payroll Registers</h2>
          <p className="text-sm text-gray-500">Comprehensive audit reports and statutory compliance registers</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg font-bold text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-all">
            <Printer size={18} /> Print View
          </button>
          <div className="relative group">
            <button className="bg-primary text-white px-5 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95">
              <Download size={18} /> Export Report <ChevronDown size={14} />
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 py-2 hidden group-hover:block animate-in fade-in slide-in-from-top-2">
               <button className="w-full text-left px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-primary/5 hover:text-primary flex items-center gap-3"><FileSpreadsheet size={16} className="text-green-600"/> Excel (.xlsx)</button>
               <button className="w-full text-left px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-primary/5 hover:text-primary flex items-center gap-3"><FileText size={16} className="text-red-500"/> PDF Document</button>
               <button className="w-full text-left px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-primary/5 hover:text-primary flex items-center gap-3"><LayoutList size={16} className="text-blue-500"/> CSV (Raw Data)</button>
            </div>
          </div>
        </div>
      </div>

      {/* Selectors */}
      <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative min-w-[220px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase">Run:</span>
            <select 
              value={selectedRun}
              onChange={(e) => setSelectedRun(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold outline-none appearance-none"
            >
              <option>Jan 2025 (v1.2)</option>
              <option>Dec 2024 Final</option>
            </select>
          </div>
          <div className="relative min-w-[260px]">
             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase">Type:</span>
             <select 
              value={reportType}
              onChange={(e) => setReportType(e.target.value as ReportType)}
              className="w-full pl-14 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold outline-none appearance-none"
            >
              <option value="FULL">Full Payroll Register</option>
              <option value="SUMMARY">Executive Summary</option>
              <option value="DEPARTMENT">Department-wise Breakdown</option>
              <option value="COST_CENTER">Cost Center Report</option>
              <option value="BANK">Bank-wise Disbursement</option>
              <option value="STATUTORY">Statutory (FBR/EOBI) Register</option>
            </select>
          </div>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search records..." 
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Main Report Area */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {reportType === 'FULL' ? (
          <div className="overflow-x-auto relative custom-scrollbar">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-primary text-white border-b border-primary-dark">
                  <th className="px-6 py-4 sticky left-0 z-20 bg-primary min-w-[120px] font-black uppercase text-[10px] tracking-widest shadow-[2px_0_5px_rgba(0,0,0,0.1)]">Emp ID</th>
                  <th className="px-6 py-4 sticky left-[120px] z-20 bg-primary min-w-[200px] font-black uppercase text-[10px] tracking-widest shadow-[2px_0_5px_rgba(0,0,0,0.1)]">Full Name</th>
                  <th className="px-6 py-4 min-w-[150px] font-black uppercase text-[10px] tracking-widest opacity-70">Department</th>
                  <th className="px-6 py-4 text-right min-w-[120px] font-black uppercase text-[10px] tracking-widest text-accent">Basic Salary</th>
                  <th className="px-6 py-4 text-right min-w-[120px] font-black uppercase text-[10px] tracking-widest text-accent">Allowances</th>
                  <th className="px-6 py-4 text-right min-w-[120px] font-black uppercase text-[10px] tracking-widest text-accent">Gross Pay</th>
                  <th className="px-6 py-4 text-right min-w-[120px] font-black uppercase text-[10px] tracking-widest text-red-300">Income Tax</th>
                  <th className="px-6 py-4 text-right min-w-[120px] font-black uppercase text-[10px] tracking-widest text-red-300">PF Share</th>
                  <th className="px-6 py-4 text-right min-w-[120px] font-black uppercase text-[10px] tracking-widest text-red-300">Total Deducts</th>
                  <th className="px-6 py-4 text-right min-w-[140px] font-black uppercase text-[10px] tracking-widest text-green-400">Net Payable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {/* Engineering Subgroup */}
                <tr className="bg-gray-50/80 font-black text-[10px] text-gray-400 uppercase tracking-widest">
                   <td colSpan={10} className="px-6 py-2 border-y">Engineering Division (Sub-total Active)</td>
                </tr>
                {MOCK_DATA.filter(r => r.dept === 'Engineering').map(row => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 sticky left-0 z-10 bg-white font-mono font-bold text-primary group-hover:bg-gray-50 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">{row.id}</td>
                    <td className="px-6 py-4 sticky left-[120px] z-10 bg-white font-bold text-gray-800 group-hover:bg-gray-50 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">{row.name}</td>
                    <td className="px-6 py-4 text-gray-500 font-medium">{row.dept}</td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-gray-600">{formatPKR(row.basic)}</td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-gray-600">{formatPKR(row.allowances)}</td>
                    <td className="px-6 py-4 text-right font-mono font-black text-gray-800 bg-gray-50/30">{formatPKR(row.gross)}</td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-red-400">({formatPKR(row.tax)})</td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-red-400">({formatPKR(row.pf)})</td>
                    <td className="px-6 py-4 text-right font-mono font-black text-red-500 bg-red-50/10">({formatPKR(row.deducts)})</td>
                    <td className="px-6 py-4 text-right font-mono font-black text-primary bg-primary/5">{formatPKR(row.net)}</td>
                  </tr>
                ))}
                {/* Engineering Total Row */}
                <tr className="bg-gray-100/50 font-bold border-t-2 border-gray-200">
                   <td colSpan={3} className="px-6 py-3 text-right uppercase text-[10px] text-gray-400">Engineering Total</td>
                   <td className="px-6 py-3 text-right font-mono">{formatPKR(382500)}</td>
                   <td className="px-6 py-3 text-right font-mono">{formatPKR(382500)}</td>
                   <td className="px-6 py-3 text-right font-mono">{formatPKR(765000)}</td>
                   <td className="px-6 py-3 text-right font-mono text-red-500">({formatPKR(132500)})</td>
                   <td className="px-6 py-3 text-right font-mono text-red-500">({formatPKR(27500)})</td>
                   <td className="px-6 py-3 text-right font-mono text-red-600">({formatPKR(160000)})</td>
                   <td className="px-6 py-3 text-right font-mono text-primary font-black">{formatPKR(605000)}</td>
                </tr>

                {/* Other Departments Sample */}
                <tr className="bg-gray-50/80 font-black text-[10px] text-gray-400 uppercase tracking-widest">
                   <td colSpan={10} className="px-6 py-2 border-y">Other Divisions (Summary)</td>
                </tr>
                {MOCK_DATA.filter(r => r.dept !== 'Engineering').map(row => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors group opacity-80">
                    <td className="px-6 py-4 sticky left-0 z-10 bg-white font-mono font-bold text-gray-400 group-hover:bg-gray-50">{row.id}</td>
                    <td className="px-6 py-4 sticky left-[120px] z-10 bg-white font-bold text-gray-600 group-hover:bg-gray-50">{row.name}</td>
                    <td className="px-6 py-4 text-gray-400 font-medium">{row.dept}</td>
                    <td className="px-6 py-4 text-right font-mono">{formatPKR(row.basic)}</td>
                    <td className="px-6 py-4 text-right font-mono">{formatPKR(row.allowances)}</td>
                    <td className="px-6 py-4 text-right font-mono">{formatPKR(row.gross)}</td>
                    <td className="px-6 py-4 text-right font-mono">({formatPKR(row.tax)})</td>
                    <td className="px-6 py-4 text-right font-mono">({formatPKR(row.pf)})</td>
                    <td className="px-6 py-4 text-right font-mono">({formatPKR(row.deducts)})</td>
                    <td className="px-6 py-4 text-right font-mono font-black text-primary">{formatPKR(row.net)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-primary text-white">
                  <th colSpan={3} className="px-6 py-6 text-right font-black uppercase text-xs tracking-widest border-t-4 border-accent">Company Grand Total (Jan 2025)</th>
                  <th className="px-6 py-6 text-right font-mono text-lg border-t-4 border-accent">{formatPKR(22500000)}</th>
                  <th className="px-6 py-6 text-right font-mono text-lg border-t-4 border-accent">{formatPKR(14500000)}</th>
                  <th className="px-6 py-6 text-right font-mono text-lg border-t-4 border-accent text-accent">{formatPKR(37000000)}</th>
                  <th className="px-6 py-6 text-right font-mono text-lg border-t-4 border-accent">({formatPKR(3500000)})</th>
                  <th className="px-6 py-6 text-right font-mono text-lg border-t-4 border-accent">({formatPKR(2775000)})</th>
                  <th className="px-6 py-6 text-right font-mono text-lg border-t-4 border-accent text-red-300">({formatPKR(7200000)})</th>
                  <th className="px-6 py-6 text-right font-mono text-2xl border-t-4 border-accent text-accent font-black underline decoration-double">{formatPKR(29800000)}</th>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <div className="p-12 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-300">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
                <PieChart size={40} strokeWidth={1} />
             </div>
             <h3 className="text-xl font-black text-gray-800 tracking-tight">Report Transformation Engine</h3>
             <p className="text-sm text-gray-500 mt-2 max-w-sm">Aggregating records for <strong>{reportType.replace('_', ' ')}</strong> mode. This usually takes &lt; 2 seconds for a batch of 485 employees.</p>
             <div className="mt-8 flex gap-3">
                <button className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20">Preview Summary</button>
                <button className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-black uppercase tracking-widest">Back to Full List</button>
             </div>
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-start gap-4">
        <ShieldCheck size={20} className="text-indigo-600 mt-0.5" />
        <div className="space-y-1">
          <p className="text-[11px] text-indigo-700 font-bold uppercase tracking-tight">Audit Confirmation</p>
          <p className="text-xs text-indigo-600 leading-relaxed">
            The register data displayed above corresponds to <strong>Authorization ID: FX-AUTH-9922</strong>. Any post-disbursement corrections will be reflected as arrears in the subsequent February 2025 cycle.
          </p>
        </div>
      </div>
    </div>
  );
};
