
import React, { useState } from 'react';
import { 
  ArrowUpRight, ArrowDownRight, Download, Search, Filter, 
  ChevronRight, Calendar, PieChart, BarChart3, TrendingUp, 
  TrendingDown, AlertTriangle, Layers, Users, Info, Building2,
  // Added missing ShieldCheck import
  ShieldCheck
} from 'lucide-react';

type ComparisonType = 'Month vs Month' | 'Quarter vs Quarter' | 'Year vs Year';

interface VarianceMetric {
  label: string;
  p1: number;
  p2: number;
}

export const VarianceReport: React.FC = () => {
  const [compType, setCompType] = useState<ComparisonType>('Month vs Month');
  const [period1, setPeriod1] = useState('Dec 2024');
  const [period2, setPeriod2] = useState('Jan 2025');

  const summaryMetrics: VarianceMetric[] = [
    { label: 'Total Net Payout', p1: 28900000, p2: 29800000 },
    { label: 'Gross Payroll', p1: 35800000, p2: 37000000 },
    { label: 'Total Deductions', p1: 6900000, p2: 7200000 },
    { label: 'Employee Headcount', p1: 312, p2: 325 },
  ];

  const componentBreakdown = [
    { name: 'Basic Salary', type: 'Earning', p1: 21800000, p2: 22500000 },
    { name: 'House Rent', type: 'Earning', p1: 9810000, p2: 10125000 },
    { name: 'Overtime', type: 'Earning', p1: 420000, p2: 580000 },
    { name: 'Income Tax', type: 'Deduction', p1: 3120000, p2: 3500000 },
    { name: 'Loan Recovery', type: 'Deduction', p1: 490000, p2: 580000 },
  ];

  const highVarianceEmployees = [
    { id: 'EMP-1001', name: 'Arsalan Khan', p1: 150000, p2: 185000, change: 23.3, reason: 'Annual Grade Promotion (G17 > G18)' },
    { id: 'EMP-1256', name: 'Zohaib Ali', p1: 82000, p2: 105000, change: 28.0, reason: 'Performance Incentive Applied' },
    { id: 'EMP-1199', name: 'Umar Jafri', p1: 110000, p2: 145000, change: 31.8, reason: 'Correction of Nov Arrears' },
    { id: 'EMP-1044', name: 'Raza Jafri', p1: 95000, p2: 78000, change: -17.8, reason: 'LWP (Unpaid Leaves) for 8 Days' },
  ];

  const formatPKR = (val: number) => val >= 1000000 ? `${(val / 1000000).toFixed(2)}M` : val.toLocaleString();
  const formatFullPKR = (val: number) => `PKR ${val.toLocaleString()}`;

  const calculateChange = (p1: number, p2: number) => {
    const diff = p2 - p1;
    const perc = ((diff / p1) * 100).toFixed(1);
    return { diff, perc };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header & Selectors */}
      <div className="flex flex-wrap justify-between items-center gap-6 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-2xl">
            <BarChart3 size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Payroll Variance Analysis</h2>
            <p className="text-sm text-gray-500 font-medium">Comparative fiscal auditing and trend detection</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
            {(['Month vs Month', 'Quarter vs Quarter', 'Year vs Year'] as ComparisonType[]).map(type => (
              <button
                key={type}
                onClick={() => setCompType(type)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  compType === type ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <select className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10">
              <option>{period1}</option>
            </select>
            <span className="text-gray-300 font-bold">vs</span>
            <select className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10">
              <option>{period2}</option>
            </select>
          </div>
          <button className="bg-primary text-white px-5 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95 ml-2">
            <Download size={18} /> Export Full Report
          </button>
        </div>
      </div>

      {/* SUMMARY METRICS */}
      <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6 border-b bg-gray-50/50 flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
            <TrendingUp size={16} /> Executive Variance Summary
          </h3>
          <div className="flex items-center gap-2 text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
            <ShieldCheck size={12} /> Data Verified
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-8 py-5">Financial Metric</th>
                <th className="px-8 py-5 text-right">{period1}</th>
                <th className="px-8 py-5 text-right">{period2}</th>
                <th className="px-8 py-5 text-right">Absolute Change</th>
                <th className="px-8 py-5 text-right">Variance (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {summaryMetrics.map((m, i) => {
                const { diff, perc } = calculateChange(m.p1, m.p2);
                const isUp = diff > 0;
                return (
                  <tr key={i} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-8 py-4 font-bold text-gray-700">{m.label}</td>
                    <td className="px-8 py-4 text-right font-mono text-gray-400">{formatPKR(m.p1)}</td>
                    <td className="px-8 py-4 text-right font-mono font-black text-gray-800">{formatPKR(m.p2)}</td>
                    <td className={`px-8 py-4 text-right font-mono font-bold ${isUp ? 'text-red-500' : 'text-green-600'}`}>
                      {isUp ? '+' : ''}{formatPKR(diff)}
                    </td>
                    <td className="px-8 py-4 text-right">
                       <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-black text-[10px] ${isUp ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                          {isUp ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
                          {perc}%
                       </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* COMPONENT BREAKDOWN */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden h-full">
            <div className="p-6 border-b bg-gray-50/50">
               <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
                 <Layers size={16} /> Component-level Delta
               </h3>
            </div>
            <div className="p-6 space-y-5">
              {componentBreakdown.map((c, i) => {
                const { perc } = calculateChange(c.p1, c.p2);
                const isDeduct = c.type === 'Deduction';
                return (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                       <span className="text-gray-500 flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${isDeduct ? 'bg-red-400' : 'bg-green-400'}`} />
                          {c.name}
                       </span>
                       <span className={`font-mono ${Number(perc) > 5 ? 'text-red-500' : 'text-gray-400'}`}>+{perc}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex">
                       <div className="h-full bg-primary/20" style={{ width: '70%' }} />
                       <div className={`h-full ${isDeduct ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${perc}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-6 bg-primary/5 border-t border-primary/10">
               <div className="flex items-start gap-3">
                  <Info size={16} className="text-primary mt-0.5 shrink-0" />
                  <p className="text-[10px] text-primary/70 font-medium leading-relaxed uppercase tracking-tight italic">
                    Component variances are primarily driven by annual performance reviews and new FBR tax slabs effective from July.
                  </p>
               </div>
            </div>
          </div>
        </div>

        {/* EMPLOYEE-LEVEL (HIGH VARIANCE) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-6 border-b bg-gray-50/50 flex items-center justify-between">
               <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
                 <Users size={16} /> High Variance Analysis (10%)
               </h3>
               <span className="bg-red-100 text-red-600 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">12 Flags Found</span>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                  <thead>
                     <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                        <th className="px-6 py-4">Employee</th>
                        <th className="px-6 py-4 text-right">Net Variance</th>
                        <th className="px-6 py-4">Primary Reason</th>
                        <th className="px-6 py-4 text-center">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {highVarianceEmployees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/5 text-primary flex items-center justify-center font-bold text-[10px]">{emp.name.charAt(0)}</div>
                              <div>
                                <p className="font-bold text-gray-800 leading-none mb-1">{emp.name}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{emp.id}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex flex-col items-end">
                              <span className={`font-black text-sm ${emp.change > 0 ? 'text-red-500' : 'text-green-600'}`}>{emp.change > 0 ? '+' : ''}{emp.change}%</span>
                              <span className="text-[10px] font-mono text-gray-400">Δ {Math.abs(emp.p2 - emp.p1).toLocaleString()}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4 max-w-[200px]">
                           <p className="text-xs text-gray-600 font-medium italic">"{emp.reason}"</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                           <button className="p-1.5 hover:bg-primary/5 text-primary rounded transition-all"><ChevronRight size={18}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
            <div className="p-4 bg-gray-50 border-t text-center">
               <button className="text-[10px] font-black text-primary uppercase hover:underline">View All Exceptions</button>
            </div>
          </div>
        </div>
      </div>

      {/* Intelligence Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-indigo-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden group">
           <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-white/10 rounded-xl"><PieChart size={24} className="text-accent" /></div>
                 <h3 className="text-lg font-black uppercase tracking-tight">Cost Driver Intelligence</h3>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">
                The 3.1% increase in Gross Payroll is primarily attributed to <span className="text-accent font-bold">13 new joiners</span> in the Technology department and a <span className="text-accent font-bold">PKR 160K OT spike</span> at the Karachi facility.
              </p>
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[2px] text-accent hover:text-white transition-colors">
                View Full Narrative <ChevronRight size={14} />
              </button>
           </div>
           <Building2 className="absolute right-[-20px] bottom-[-20px] text-white/5 w-48 h-48 rotate-12 group-hover:scale-110 transition-transform duration-700" />
        </div>

        <div className="p-8 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center space-y-4">
           <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
              <AlertTriangle size={32} />
           </div>
           <div>
              <h4 className="font-bold text-gray-800">Unexplained Variances?</h4>
              <p className="text-xs text-gray-500 max-w-xs mx-auto mt-1 leading-relaxed">
                Our AI auditor detected 3 profiles where variance reason is missing. Please update justifications to finalize the audit.
              </p>
           </div>
           <button className="px-6 py-2 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">
             Audit Workspace
           </button>
        </div>
      </div>
    </div>
  );
};
