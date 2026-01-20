
import React, { useState } from 'react';
import { 
  ShieldCheck, Landmark, Calculator, Save, Plus, 
  Download, Search, Filter, Calendar, Users, 
  Info, AlertCircle, CheckCircle2, Building2,
  Settings2, UserPlus, FileSpreadsheet, ExternalLink
} from 'lucide-react';

interface EOBIEmployee {
  id: string;
  name: string;
  eobiNo: string;
  status: 'Registered' | 'Pending' | 'Exempt';
  doj: string;
}

const MOCK_EOBI_STAFF: EOBIEmployee[] = [
  { id: 'EMP-1001', name: 'Arsalan Khan', eobiNo: 'ABC12345678', status: 'Registered', doj: '2020-07-15' },
  { id: 'EMP-1102', name: 'Saira Ahmed', eobiNo: 'XYZ98765432', status: 'Registered', doj: '2021-03-10' },
  { id: 'EMP-1240', name: 'Faisal Raza', eobiNo: '--', status: 'Pending', doj: '2025-01-01' },
  { id: 'EMP-1005', name: 'Mustafa Kamal', eobiNo: 'LMN55667788', status: 'Registered', doj: '2018-06-15' },
];

export const EOBIConfiguration: React.FC = () => {
  const [minWage, setMinWage] = useState(32000);
  const [effectiveDate, setEffectiveDate] = useState('2024-07-01');
  const [selectedMonth, setSelectedMonth] = useState('2025-01');
  
  const eeShare = Math.round(minWage * 0.01);
  const erShare = Math.round(minWage * 0.05);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <Landmark className="text-primary" size={28} />
            EOBI Statutory Configuration [PK]
          </h2>
          <p className="text-sm text-gray-500">Employee Old-Age Benefits Institution compliance & contributions</p>
        </div>
        <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95">
          <Save size={18} /> Save Configuration
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Global Parameters */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-100 space-y-8">
             <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
                   <Building2 size={14} /> Employer Registration
                </h3>
                <div className="space-y-3">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-gray-500">Registration Number</label>
                      <input type="text" defaultValue="ISB-998811-A" className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-bold outline-none font-mono" />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-black uppercase text-gray-500">Reg. Date</label>
                         <input type="date" defaultValue="2020-01-01" className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs font-bold outline-none" />
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-black uppercase text-gray-500">Office</label>
                         <input type="text" defaultValue="Islamabad" className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs font-bold outline-none" />
                      </div>
                   </div>
                </div>
             </div>

             <div className="pt-6 border-t border-dashed space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
                   <Calculator size={14} /> Calculation Basis
                </h3>
                <div className="space-y-4">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-gray-500">Minimum Wage Limit (PKR)</label>
                      <input 
                        type="number" 
                        value={minWage}
                        onChange={(e) => setMinWage(Number(e.target.value))}
                        className="w-full px-4 py-3 bg-primary/5 border border-primary/20 rounded-xl text-xl font-black text-primary outline-none focus:ring-2 focus:ring-primary/10 transition-all" 
                      />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-gray-500">Effective From</label>
                      <input 
                        type="date" 
                        value={effectiveDate}
                        onChange={(e) => setEffectiveDate(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 border rounded-xl text-sm font-bold outline-none" 
                      />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-[9px] font-black text-gray-400 uppercase mb-1">EE Share (1%)</p>
                      <p className="text-lg font-black text-gray-800">{eeShare}/mo</p>
                   </div>
                   <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-[9px] font-black text-gray-400 uppercase mb-1">ER Share (5%)</p>
                      <p className="text-lg font-black text-primary">{erShare}/mo</p>
                   </div>
                </div>
             </div>

             <div className="pt-6 border-t border-dashed space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[2px] text-gray-400">Eligibility Toggles</h3>
                <div className="space-y-3">
                   <EligibilitySwitch label="Permanent Staff" active={true} />
                   <EligibilitySwitch label="Contract (> 1 Year)" active={true} />
                   <EligibilitySwitch label="Interns / Trainees" active={false} />
                   <EligibilitySwitch label="External Consultants" active={false} />
                </div>
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                   <p className="text-[9px] text-blue-700 font-bold leading-relaxed uppercase">
                     Calculations are automatically capped at PKR {minWage.toLocaleString()} even if gross salary is higher.
                   </p>
                </div>
             </div>
          </div>
        </div>

        {/* Right: Employee List & Return Generation */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden flex flex-col">
             <div className="p-6 border-b bg-gray-50/50 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                   <Users size={20} className="text-gray-400" />
                   <h3 className="text-sm font-black uppercase tracking-tight text-gray-700">Staff EOBI Registry</h3>
                </div>
                <div className="flex gap-2">
                   <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      <input type="text" placeholder="Search staff..." className="pl-9 pr-4 py-1.5 bg-white border rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary w-40" />
                   </div>
                   <button className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary/90">
                      <UserPlus size={14} /> Register New
                   </button>
                   <button className="flex items-center gap-2 px-3 py-1.5 bg-white border text-gray-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gray-50">
                      <FileSpreadsheet size={14} /> Portal Export
                   </button>
                </div>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                   <thead>
                      <tr className="bg-gray-50/50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                         <th className="px-6 py-4">Employee</th>
                         <th className="px-6 py-4">EOBI Number</th>
                         <th className="px-6 py-4 text-center">Status</th>
                         <th className="px-6 py-4 text-center">Joined</th>
                         <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50 font-medium">
                      {MOCK_EOBI_STAFF.map(emp => (
                        <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-primary/5 text-primary flex items-center justify-center font-black text-[10px]">{emp.name.charAt(0)}</div>
                                 <div>
                                    <p className="font-bold text-gray-800 leading-none">{emp.name}</p>
                                    <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">{emp.id}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-4 font-mono font-bold text-gray-600">{emp.eobiNo}</td>
                           <td className="px-6 py-4 text-center">
                              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${
                                emp.status === 'Registered' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100 animate-pulse'
                              }`}>{emp.status}</span>
                           </td>
                           <td className="px-6 py-4 text-center text-xs text-gray-400">{emp.doj}</td>
                           <td className="px-6 py-4 text-right">
                              <button className="text-primary p-2 hover:bg-primary/5 rounded-lg transition-all"><ExternalLink size={16} /></button>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
             <div className="p-4 bg-gray-50 border-t flex justify-between items-center text-[10px] font-black uppercase text-gray-400 tracking-widest">
                <p>Showing {MOCK_EOBI_STAFF.length} of 485 total employees</p>
                <div className="flex gap-4">
                   <button className="text-primary hover:underline">View All Records</button>
                </div>
             </div>
          </div>

          <div className="bg-primary rounded-3xl p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden flex items-center justify-between">
             <div className="relative z-10 space-y-4 max-w-md">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-accent rounded-xl text-primary"><Calendar size={24} /></div>
                   <h3 className="text-xl font-black uppercase tracking-tight">Monthly Return Generator</h3>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">
                  Generate the statutory monthly contribution file for upload to the EOBI portal. This file includes both employee and employer shares.
                </p>
                <div className="flex items-center gap-3">
                   <div className="relative flex-1">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40" size={16} />
                      <input 
                        type="month" 
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl text-primary text-sm font-bold outline-none" 
                      />
                   </div>
                   <button className="flex items-center gap-2 px-6 py-2.5 bg-accent text-primary rounded-xl text-sm font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg active:scale-95">
                      <Download size={18} /> Generate Return
                   </button>
                </div>
             </div>
             <div className="relative z-10 bg-white/10 p-6 rounded-3xl border border-white/10 backdrop-blur-md space-y-4">
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-white/40 uppercase">Projected Return Value</p>
                   <p className="text-3xl font-black text-accent">PKR 624,000</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-green-400">
                   <CheckCircle2 size={14} /> Ready for {selectedMonth}
                </div>
             </div>
             <Landmark className="absolute right-[-40px] top-[-40px] text-white/5 w-64 h-64 -rotate-12" />
          </div>

          <div className="p-6 bg-orange-50 border border-orange-100 rounded-3xl flex items-start gap-4 shadow-sm">
             <AlertCircle size={24} className="text-orange-500 mt-0.5 shrink-0" />
             <div className="space-y-1">
                <h5 className="text-sm font-black text-orange-900 uppercase tracking-tight leading-none">Min Wage Alert</h5>
                <p className="text-xs text-orange-700 leading-relaxed font-medium">
                  The minimum wage has been updated to <strong>PKR {minWage.toLocaleString()}</strong> in the system. Changing this value will mark the current payroll period for recalculation. Ensure your effective date matches the official government gazette.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EligibilitySwitch = ({ label, active }: { label: string, active: boolean }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 rounded-2xl transition-all group">
     <span className="text-xs font-bold text-gray-600 uppercase tracking-tight">{label}</span>
     <button className={`w-10 h-5 rounded-full relative transition-all ${active ? 'bg-green-500' : 'bg-gray-300'}`}>
        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${active ? 'right-0.5' : 'left-0.5'}`} />
     </button>
  </div>
);
