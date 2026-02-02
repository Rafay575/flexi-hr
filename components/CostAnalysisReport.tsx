
import React, { useState } from 'react';
import { 
  BarChart3, PieChart, TrendingUp, Download, Calendar, 
  ChevronDown, Building2, Users, Wallet, Landmark, 
  ArrowUpRight, ArrowDownRight, Info, Clock, 
  Layers, Database, FileText
} from 'lucide-react';

type GroupBy = 'Department' | 'Cost Center' | 'Grade';

export const CostAnalysisReport: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Jan 2025');
  const [groupBy, setGroupBy] = useState<GroupBy>('Department');

  const ctcBreakdown = [
    { label: 'Gross Salary', amount: 37000000, color: 'bg-primary' },
    { label: 'Provident Fund (ER)', amount: 2775000, color: 'bg-blue-500' },
    { label: 'EOBI (ER)', amount: 300000, color: 'bg-indigo-500' },
    { label: 'Gratuity Provision', amount: 2100000, color: 'bg-purple-500' },
    { label: 'Medical & Benefits', amount: 850000, color: 'bg-accent' },
  ];

  const totalCTC = ctcBreakdown.reduce((a, b) => a + b.amount, 0);

  const deptData = [
    { name: 'Engineering', count: 145, gross: 18500000, ctc: 21250000, perc: 49.3 },
    { name: 'Operations', count: 112, gross: 12200000, ctc: 14100000, perc: 32.8 },
    { name: 'Human Resources', count: 24, gross: 2800000, ctc: 3250000, perc: 7.5 },
    { name: 'Sales & Mktg', count: 44, gross: 3500000, ctc: 4425000, perc: 10.4 },
  ];

  const ccData = [
    { id: 'TECH-ISB-01', ctc: 21250000, budget: 20000000, var: 6.25 },
    { id: 'OPS-KHI-45', ctc: 14100000, budget: 14500000, var: -2.75 },
    { id: 'ADMIN-CORP', ctc: 7675000, budget: 8000000, var: -4.06 },
  ];

  const formatPKR = (val: number) => `PKR ${(val / 1000000).toFixed(2)}M`;
  const formatFullPKR = (val: number) => `PKR ${val.toLocaleString()}`;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header & Filters */}
      <div className="flex flex-wrap justify-between items-center gap-6 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-2xl">
            <Database size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Total Cost Analysis</h2>
            <p className="text-sm text-gray-500 font-medium">Holistic CTC impact and budget vs actual variance</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="pl-10 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-primary/10"
              >
                <option>Jan 2025</option>
                <option>Dec 2024</option>
              </select>
            </div>
            <div className="relative">
              <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select 
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value as GroupBy)}
                className="pl-10 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-primary/10"
              >
                <option>Department</option>
                <option>Cost Center</option>
                <option>Grade</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <button className="bg-white border border-gray-200 px-5 py-2 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2 transition-all">
              <Clock size={18} /> Schedule Monthly
            </button>
            <button className="bg-primary text-white px-5 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95">
              <Download size={18} /> Export
            </button>
          </div>
        </div>
      </div>

      {/* TOTAL CTC SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-100 flex flex-col justify-between h-full relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[2px] text-gray-400">Consolidated CTC</h3>
              <div>
                <p className="text-4xl font-black text-primary tracking-tighter">{formatPKR(totalCTC)}</p>
                <div className="flex items-center gap-1 mt-1 text-red-500 font-bold text-xs">
                  <ArrowUpRight size={14} /> +PKR 1.8M vs Dec
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t border-dashed">
                {ctcBreakdown.map((item, i) => (
                  <div key={i} className="flex items-center justify-between group/item">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${item.color}`} />
                      <span className="text-xs font-bold text-gray-500 uppercase">{item.label}</span>
                    </div>
                    <span className="text-xs font-mono font-black text-gray-800">{formatPKR(item.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
            <Wallet className="absolute right-[-20px] bottom-[-20px] text-primary/5 w-48 h-48 rotate-12" />
          </div>
        </div>

        {/* TRENDS CHART SECTION */}
        <div className="lg:col-span-8">
          <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-100 h-full">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
                <TrendingUp size={16} /> 6-Month Fiscal Trend
              </h3>
              <div className="flex gap-4 text-[9px] font-black uppercase text-gray-400">
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary" /> Total CTC</span>
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-accent" /> Per Employee</span>
              </div>
            </div>
            <div className="h-56 flex items-end justify-between gap-6 px-4">
              {[40, 55, 75, 60, 90, 85].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3 group relative h-full justify-end">
                  <div className="w-full bg-primary/10 rounded-t-xl overflow-hidden relative" style={{ height: `${h}%` }}>
                    <div className="absolute inset-x-0 bottom-0 bg-primary rounded-t-xl transition-all duration-1000 group-hover:bg-primary/80" style={{ height: '100%' }} />
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-accent/30 group-hover:bg-accent/50 transition-all" />
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'][i]}</p>
                  </div>
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded  transition-opacity whitespace-nowrap pointer-events-none z-20">
                    CTC: {formatPKR(totalCTC * (h/100))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-3 border-t border-gray-50 pt-6">
              <div className="text-center">
                <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Avg CTC / EE</p>
                <p className="text-lg font-black text-gray-800 tracking-tight">PKR 132,380</p>
              </div>
              <div className="text-center border-x border-gray-50">
                <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Peak Headcount</p>
                <p className="text-lg font-black text-gray-800 tracking-tight">325</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Efficiency Ratio</p>
                <p className="text-lg font-black text-green-600 tracking-tight">94.2%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED TABLES SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* BY DEPARTMENT */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-6 border-b bg-gray-50/50 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
                <Building2 size={16} /> Cost by Department
              </h3>
              <PieChart size={18} className="text-gray-300" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    <th className="px-8 py-5">Dept Name</th>
                    <th className="px-6 py-5 text-center">HC</th>
                    <th className="px-6 py-5 text-right">Gross Total</th>
                    <th className="px-6 py-5 text-right">Total CTC</th>
                    <th className="px-8 py-5 text-right">% of Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {deptData.map((d, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-8 py-4 font-bold text-gray-700">{d.name}</td>
                      <td className="px-6 py-4 text-center text-gray-500 font-bold">{d.count}</td>
                      <td className="px-6 py-4 text-right font-mono text-gray-400">{formatPKR(d.gross)}</td>
                      <td className="px-6 py-4 text-right font-mono font-black text-primary">{formatPKR(d.ctc)}</td>
                      <td className="px-8 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${d.perc}%` }} />
                          </div>
                          <span className="text-[10px] font-black text-gray-400">{d.perc}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* BY COST CENTER */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-6 border-b bg-gray-50/50 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
                <Landmark size={16} /> Budget Variance (CC)
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    <th className="px-6 py-5">Cost Center</th>
                    <th className="px-6 py-5 text-right">Actual CTC</th>
                    <th className="px-6 py-5 text-right">Budget</th>
                    <th className="px-6 py-5 text-right">Var %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {ccData.map((cc, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-primary">{cc.id}</td>
                      <td className="px-6 py-4 text-right font-mono font-black text-gray-800">{formatPKR(cc.ctc)}</td>
                      <td className="px-6 py-4 text-right font-mono text-gray-400">{formatPKR(cc.budget)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className={`inline-flex items-center gap-1 font-black text-[10px] px-2 py-0.5 rounded-full ${cc.var > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                          {cc.var > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                          {Math.abs(cc.var)}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl flex items-start gap-4">
            <Info size={24} className="text-blue-500 mt-1 shrink-0" />
            <div className="space-y-1">
              <p className="text-xs font-black text-blue-900 uppercase tracking-tight">Accrual Policy Note</p>
              <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                Provisioning for Gratuity and Bonus is calculated using the 12-month smoothing method. Budget variances exceeding 5% trigger an automated audit flag for the Finance Board.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
