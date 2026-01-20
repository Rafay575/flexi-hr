
import React, { useState } from 'react';
import { 
  Calculator, Download, Calendar, Users, TrendingUp, 
  ArrowUpRight, Building2, BarChart3, Search, Filter,
  ShieldCheck, Info, PieChart, ChevronRight, FileSpreadsheet
} from 'lucide-react';

interface BracketData {
  range: string;
  count: number;
  avg: number;
  total: number;
  perc: number;
}

const BRACKET_DATA: BracketData[] = [
  { range: '1 - 3 Years', count: 185, avg: 125000, total: 23125000, perc: 18.5 },
  { range: '3 - 5 Years', count: 142, avg: 285000, total: 40470000, perc: 32.4 },
  { range: '5 - 10 Years', count: 98, avg: 450000, total: 44100000, perc: 35.3 },
  { range: '10+ Years', count: 25, avg: 692000, total: 17305000, perc: 13.8 },
];

const DEPT_DATA = [
  { name: 'Engineering', count: 145, liability: 52400000, trend: '+3.2%' },
  { name: 'Operations', count: 210, liability: 41200000, trend: '+1.5%' },
  { name: 'Human Resources', count: 24, liability: 8500000, trend: '+0.8%' },
  { name: 'Finance & Legal', count: 18, liability: 12500000, trend: '+1.2%' },
  { name: 'Sales & Mktg', count: 53, liability: 10400000, trend: '+2.1%' },
];

export const GratuityProvisionReport: React.FC = () => {
  const [asOfDate, setAsOfDate] = useState('2025-01-31');
  const [search, setSearch] = useState('');

  const formatPKR = (val: number) => `PKR ${(val / 1000000).toFixed(1)}M`;
  const formatFullPKR = (val: number) => `PKR ${val.toLocaleString()}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Gratuity Provision Report</h2>
          <p className="text-sm text-gray-500">Actuarial estimation of total end-of-service liability</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="date" 
              value={asOfDate}
              onChange={(e) => setAsOfDate(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10"
            />
          </div>
          <button className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95">
            <Download size={18} /> Download Full Report
          </button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 relative overflow-hidden">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Eligible Staff</p>
          <h4 className="text-3xl font-black text-gray-800">450</h4>
          <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-tight italic">Excludes staff &lt; 1yr</p>
          <Users className="absolute -right-2 -bottom-2 text-gray-50 w-20 h-20" />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 relative overflow-hidden">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Estimated Liability</p>
          <h4 className="text-3xl font-black text-primary">PKR 125M</h4>
          <div className="flex items-center gap-1 mt-2 text-green-600">
             <TrendingUp size={12} />
             <span className="text-[10px] font-black uppercase tracking-tighter">+2.5M vs Dec 2024</span>
          </div>
          <Calculator className="absolute -right-2 -bottom-2 text-primary/5 w-20 h-20" />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Annual Growth</p>
          <h4 className="text-3xl font-black text-red-500">+PKR 15M</h4>
          <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-tight italic">Since Jan 2024</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col justify-between">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Avg Provision / EE</p>
           <h4 className="text-2xl font-black text-gray-700">{formatFullPKR(277000)}</h4>
           <div className="h-1 w-full bg-gray-100 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-primary" style={{ width: '65%' }} />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Service Bracket Table & Mini Chart */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-4 border-b bg-gray-50/50 flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <BarChart3 size={14} /> Analysis by Service Tenure
              </h4>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-primary"></div>
                 <span className="text-[9px] font-black text-gray-500 uppercase">Liability Weight</span>
              </div>
            </div>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50/30 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Service Range</th>
                  <th className="px-6 py-4 text-center">Employees</th>
                  <th className="px-6 py-4 text-right">Avg Provision</th>
                  <th className="px-6 py-4 text-right">Total Liability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {BRACKET_DATA.map((b, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                       <span className="font-bold text-gray-700">{b.range}</span>
                       <div className="h-1 w-full bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                          <div className="h-full bg-primary group-hover:bg-accent transition-all" style={{ width: `${b.perc}%` }} />
                       </div>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-gray-500">{b.count}</td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-gray-600">{formatFullPKR(b.avg)}</td>
                    <td className="px-6 py-4 text-right font-mono font-black text-primary">{formatPKR(b.total)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50/50 font-black border-t">
                 <tr>
                    <td className="px-6 py-4 text-[10px] uppercase text-gray-400">Consolidated Summary</td>
                    <td className="px-6 py-4 text-center">450</td>
                    <td className="px-6 py-4 text-right text-gray-500 font-mono italic">--</td>
                    <td className="px-6 py-4 text-right font-mono text-primary text-lg">PKR 125.0M</td>
                 </tr>
              </tfoot>
            </table>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-4">
             <Info size={24} className="text-blue-500 mt-0.5 shrink-0" />
             <div className="space-y-1">
                <h5 className="text-sm font-black text-blue-900 uppercase leading-none tracking-tight">Provisioning Methodology</h5>
                <p className="text-xs text-blue-700 leading-relaxed font-medium">
                  Values are calculated based on the "Last Drawn Basic" as of the selected date. System applies the 2024 revised industrial rules: 15-day basic for the first 5 years and 30-day basic for each subsequent year.
                </p>
             </div>
          </div>
        </div>

        {/* Department-wise Liability */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
             <div className="p-4 border-b bg-gray-50/50">
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <Building2 size={14} /> Department Liability
                </h4>
             </div>
             <div className="p-6 space-y-4">
                {DEPT_DATA.map((dept, i) => (
                  <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-all border border-transparent hover:border-gray-100">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/5 text-primary flex items-center justify-center font-bold text-[10px]">{dept.name.charAt(0)}</div>
                        <div>
                           <p className="text-xs font-bold text-gray-700">{dept.name}</p>
                           <p className="text-[9px] text-gray-400 font-bold uppercase">{dept.count} Members</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-sm font-black text-primary">{formatPKR(dept.liability)}</p>
                        <p className="text-[9px] font-black text-green-600 uppercase flex items-center justify-end gap-1"><ArrowUpRight size={10}/> {dept.trend}</p>
                     </div>
                  </div>
                ))}
             </div>
             <div className="p-4 bg-gray-50 border-t text-center">
                <button className="text-[10px] font-black text-primary uppercase hover:underline">View All Departments</button>
             </div>
          </div>

          <div className="bg-primary rounded-2xl p-6 text-white shadow-xl shadow-primary/20 space-y-6 relative overflow-hidden">
             <div className="relative z-10 space-y-1">
                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Actuarial Status</p>
                <div className="flex items-center gap-2 text-accent font-black">
                   <ShieldCheck size={18} />
                   <span className="text-sm uppercase tracking-tighter">Certified Calculation Model</span>
                </div>
             </div>
             <div className="relative z-10 bg-white/10 p-4 rounded-xl border border-white/5">
                <p className="text-xs leading-relaxed text-white/80">
                  Provisioning records are ready for monthly general ledger posting (JV-EOS-JAN25).
                </p>
             </div>
             <PieChart className="absolute right-[-20px] bottom-[-20px] text-white/5 w-40 h-40 rotate-12" />
          </div>
        </div>

        {/* Employee-wise Detail List */}
        <div className="lg:col-span-12 space-y-4">
           <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
                <Users size={16} className="text-primary" /> Employee-wise Detailed Provisions
              </h3>
              <div className="flex items-center gap-2">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                      type="text" 
                      placeholder="Find staff..." 
                      className="pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none w-48"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                 </div>
                 <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"><Filter size={16}/></button>
              </div>
           </div>
           <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm">
                 <thead>
                    <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                       <th className="px-6 py-5">Staff Member</th>
                       <th className="px-6 py-5">Designation</th>
                       <th className="px-6 py-5 text-center">Service Years</th>
                       <th className="px-6 py-5 text-right">Last Basic</th>
                       <th className="px-6 py-5 text-right">Monthly Provision</th>
                       <th className="px-6 py-5 text-right font-black">Accumulated Provision</th>
                       <th className="px-6 py-5 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                    {[
                      { id: 'EMP-1001', name: 'Arsalan Khan', desig: 'Senior Lead', service: '4.5Y', basic: 107500, monthly: 5375, accum: 185000 },
                      { id: 'EMP-1105', name: 'Zainab Bibi', desig: 'Analyst', service: '1.2Y', basic: 46000, monthly: 1916, accum: 27500 },
                      { id: 'EMP-1088', name: 'Mustafa Kamal', desig: 'Director', service: '12.0Y', basic: 275000, monthly: 22916, accum: 1250000 },
                      { id: 'EMP-1201', name: 'Ayesha Malik', desig: 'Specialist', service: '3.8Y', basic: 62500, monthly: 2604, accum: 85000 },
                    ].map(emp => (
                      <tr key={emp.id} className="hover:bg-gray-50 transition-colors group">
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-primary/5 text-primary flex items-center justify-center font-bold text-[10px]">{emp.name.charAt(0)}</div>
                               <div>
                                  <p className="font-bold text-gray-800">{emp.name}</p>
                                  <p className="text-[10px] text-gray-400 font-bold uppercase">{emp.id}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-4 text-xs font-medium text-gray-500">{emp.desig}</td>
                         <td className="px-6 py-4 text-center font-bold text-gray-600">{emp.service}</td>
                         <td className="px-6 py-4 text-right font-mono font-bold text-gray-500">{emp.basic.toLocaleString()}</td>
                         <td className="px-6 py-4 text-right font-mono font-bold text-gray-400">{emp.monthly.toLocaleString()}</td>
                         <td className="px-6 py-4 text-right font-mono font-black text-primary bg-primary/5">{formatFullPKR(emp.accum)}</td>
                         <td className="px-6 py-4 text-right">
                            <button className="p-2 text-gray-300 hover:text-primary transition-all"><ChevronRight size={18}/></button>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
           <div className="p-6 bg-gray-50 rounded-2xl flex items-center justify-between border border-gray-100">
              <div className="flex items-center gap-4">
                 <div className="p-2 bg-green-50 text-green-600 rounded-lg"><FileSpreadsheet size={20}/></div>
                 <p className="text-xs font-bold text-gray-600">Complete dataset (450 rows) verified for the January 2025 financial close.</p>
              </div>
              <button className="text-[10px] font-black text-primary uppercase bg-white px-4 py-2 rounded-lg border shadow-sm hover:bg-gray-50 transition-all">Download Audit Log</button>
           </div>
        </div>
      </div>
    </div>
  );
};
