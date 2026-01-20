import React, { useState } from 'react';
import { 
  ShieldCheck, Landmark, Calculator, Save, Plus, 
  Download, Search, Filter, Calendar, Users, 
  Info, AlertCircle, CheckCircle2, Building2,
  Settings2, UserPlus, FileSpreadsheet, MapPin,
  ExternalLink, ArrowRight, FileText
} from 'lucide-react';

type Province = 'Punjab (PESSI)' | 'Sindh (SESSI)' | 'KPK (ESSI)' | 'Balochistan (BESSI)';

interface SSEmployee {
  id: string;
  name: string;
  ssNo: string;
  wages: number;
  contribution: number;
  status: 'Covered' | 'Exempt (Above Cap)';
}

const MOCK_SS_STAFF: SSEmployee[] = [
  { id: 'EMP-1025', name: 'Zainab Bibi', ssNo: 'SS-PUN-99221', wages: 31000, contribution: 1860, status: 'Covered' },
  { id: 'EMP-1104', name: 'Ahmed Raza', ssNo: 'SS-PUN-88112', wages: 28500, contribution: 1710, status: 'Covered' },
  { id: 'EMP-1001', name: 'Arsalan Khan', ssNo: '--', wages: 185000, contribution: 0, status: 'Exempt (Above Cap)' },
  { id: 'EMP-1205', name: 'Kamran Ali', ssNo: 'SS-PUN-77334', wages: 31000, contribution: 1860, status: 'Covered' },
];

export const SocialSecurityConfiguration: React.FC = () => {
  const [province, setProvince] = useState<Province>('Punjab (PESSI)');
  const [wageCap, setWageCap] = useState(31000);
  const [erRate, setErRate] = useState(6); // 6% Employer share
  const [selectedMonth, setSelectedMonth] = useState('2025-01');

  const stats = {
    totalEligible: 215,
    totalContribution: 399900,
    minEmpRequirement: 10
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <Building2 className="text-primary" size={28} />
            Social Security Configuration [PK]
          </h2>
          <p className="text-sm text-gray-500">Provincial health and injury insurance compliance</p>
        </div>
        <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95">
          <Save size={18} /> Save Configuration
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Provincial & Legal Settings */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-100 space-y-8">
             <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
                   <MapPin size={14} /> Jurisdiction Selection
                </h3>
                <div className="space-y-2">
                   {(['Punjab (PESSI)', 'Sindh (SESSI)', 'KPK (ESSI)', 'Balochistan (BESSI)'] as Province[]).map((p) => (
                     <button
                       key={p}
                       onClick={() => setProvince(p)}
                       className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all ${
                         province === p ? 'bg-primary border-primary text-white shadow-md' : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200'
                       }`}
                     >
                       {p}
                       {province === p && <CheckCircle2 size={14} />}
                     </button>
                   ))}
                </div>
             </div>

             <div className="pt-6 border-t border-dashed space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
                   <Calculator size={14} /> Statutory Logic
                </h3>
                <div className="space-y-4">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-gray-500">Registration Number</label>
                      <input type="text" defaultValue="PUN-0099881-Z" className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-bold outline-none font-mono" />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-black uppercase text-gray-500">Employer Rate (%)</label>
                         <div className="relative">
                            <input 
                              type="number" 
                              value={erRate}
                              onChange={(e) => setErRate(Number(e.target.value))}
                              className="w-full px-4 py-2 bg-primary/5 border border-primary/20 rounded-xl text-sm font-black text-primary outline-none" 
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/40 font-bold">%</span>
                         </div>
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-black uppercase text-gray-500">Wage Cap (PKR)</label>
                         <input 
                            type="number" 
                            value={wageCap}
                            onChange={(e) => setWageCap(Number(e.target.value))}
                            className="w-full px-4 py-2 bg-gray-50 border rounded-xl text-sm font-bold outline-none" 
                          />
                      </div>
                   </div>
                   <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                      <p className="text-[9px] text-indigo-700 font-bold leading-relaxed uppercase">
                        Current Policy: Employer contributes {erRate}% of wages (Capped at {wageCap.toLocaleString()}) per month for each eligible worker.
                      </p>
                   </div>
                </div>
             </div>

             <div className="pt-6 border-t border-dashed space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[2px] text-gray-400">Establishment Threshold</h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                   <div>
                      <p className="text-xs font-bold text-gray-700">Minimum Workers</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">Legal requirement to enroll</p>
                   </div>
                   <span className="text-lg font-black text-primary">{stats.minEmpRequirement}</span>
                </div>
             </div>
          </div>
        </div>

        {/* Right: Enrolled Workers & Returns */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden flex flex-col">
             <div className="p-6 border-b bg-gray-50/50 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                   <Users size={20} className="text-gray-400" />
                   <h3 className="text-sm font-black uppercase tracking-tight text-gray-700">Enrolled Worker Registry</h3>
                </div>
                <div className="flex gap-2">
                   <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      <input type="text" placeholder="Search workers..." className="pl-9 pr-4 py-1.5 bg-white border rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary w-40" />
                   </div>
                   <button className="flex items-center gap-2 px-3 py-1.5 bg-white border text-gray-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gray-50">
                      <Download size={14} /> Export Enrolled
                   </button>
                </div>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                   <thead>
                      <tr className="bg-gray-50/50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                         <th className="px-6 py-4">Employee</th>
                         <th className="px-6 py-4">SS Registration No</th>
                         <th className="px-6 py-4 text-right">Applicable Wages</th>
                         <th className="px-6 py-4 text-right">Contribution ({erRate}%)</th>
                         <th className="px-6 py-4 text-center">Status</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50 font-medium">
                      {MOCK_SS_STAFF.map(emp => (
                        <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                           <td className="px-6 py-4">
                              <div>
                                 <p className="font-bold text-gray-800 leading-none">{emp.name}</p>
                                 <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">{emp.id}</p>
                              </div>
                           </td>
                           <td className="px-6 py-4 font-mono font-bold text-gray-600">{emp.ssNo}</td>
                           <td className="px-6 py-4 text-right font-mono text-gray-500">{emp.wages.toLocaleString()}</td>
                           <td className="px-6 py-4 text-right font-mono font-black text-primary">
                             {emp.contribution > 0 ? emp.contribution.toLocaleString() : '--'}
                           </td>
                           <td className="px-6 py-4 text-center">
                              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${
                                emp.status === 'Covered' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-100 text-gray-400 border-gray-200'
                              }`}>{emp.status}</span>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
             <div className="p-4 bg-gray-50 border-t flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <Info size={14} className="text-gray-400" />
                   <p className="text-[9px] text-gray-500 font-bold uppercase">Note: Only employees with gross salary below PKR {wageCap.toLocaleString()} are covered under provincial law.</p>
                </div>
                <button className="text-[10px] font-black text-primary uppercase hover:underline">View All 485 Employees</button>
             </div>
          </div>

          <div className="bg-primary rounded-3xl p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden flex items-center justify-between">
             <div className="relative z-10 space-y-4 max-w-md">
                <div className="flex items-center gap-3">
                   {/* Fix: FileText is now correctly imported */}
                   <div className="p-2 bg-accent rounded-xl text-primary"><FileText size={24} /></div>
                   <h3 className="text-xl font-black uppercase tracking-tight">Provincial Monthly Return</h3>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">
                  Generate the standardized {province.split(' ')[0]} return file for the current payroll cycle. Ensure all new hires are registered before generation.
                </p>
                <div className="flex items-center gap-3">
                   <input 
                     type="month" 
                     value={selectedMonth}
                     onChange={(e) => setSelectedMonth(e.target.value)}
                     className="pl-4 pr-4 py-2.5 bg-white rounded-xl text-primary text-sm font-bold outline-none" 
                   />
                   <button className="flex items-center gap-2 px-6 py-2.5 bg-accent text-primary rounded-xl text-sm font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg active:scale-95">
                      <Download size={18} /> Generate {province.split(' ')[1].replace('(','').replace(')','')} Return
                   </button>
                </div>
             </div>
             <div className="relative z-10 bg-white/10 p-6 rounded-3xl border border-white/10 backdrop-blur-md space-y-2">
                <p className="text-[9px] font-bold text-white/40 uppercase">Projected Liability</p>
                <p className="text-2xl font-black text-accent">{formatFullPKR(stats.totalContribution)}</p>
                <div className="pt-2 flex items-center gap-2 text-[8px] font-black uppercase text-green-400">
                   <CheckCircle2 size={12} /> {stats.totalEligible} Workers Covered
                </div>
             </div>
             <ShieldCheck className="absolute right-[-40px] top-[-40px] text-white/5 w-64 h-64 -rotate-12" />
          </div>
        </div>
      </div>
    </div>
  );
};

const formatFullPKR = (val: number) => `PKR ${val.toLocaleString()}`;