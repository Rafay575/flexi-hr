
import React, { useState } from 'react';
import { 
  Landmark, ShieldCheck, Calculator, Save, Plus, 
  Download, Users, PiggyBank, History, Info, 
  CheckCircle2, Building2, HandCoins, TrendingUp,
  Percent, FileText, Settings2, ShieldAlert,
  ArrowRight, Search, Filter
} from 'lucide-react';

interface PFMember {
  id: string;
  name: string;
  pfNo: string;
  totalBalance: number;
  eePortion: number;
  erPortion: number;
  vestedPerc: number;
  doj: string;
}

const MOCK_MEMBERS: PFMember[] = [
  { id: 'EMP-1001', name: 'Arsalan Khan', pfNo: 'PF-ISB-2020-001', totalBalance: 450000, eePortion: 225000, erPortion: 225000, vestedPerc: 100, doj: '2020-07-15' },
  { id: 'EMP-1102', name: 'Saira Ahmed', pfNo: 'PF-ISB-2021-045', totalBalance: 285000, eePortion: 142500, erPortion: 142500, vestedPerc: 80, doj: '2021-03-10' },
  { id: 'EMP-1205', name: 'Mustafa Kamal', pfNo: 'PF-ISB-2018-005', totalBalance: 1250000, eePortion: 625000, erPortion: 625000, vestedPerc: 100, doj: '2018-06-15' },
  { id: 'EMP-1301', name: 'Ayesha Malik', pfNo: 'PF-ISB-2024-112', totalBalance: 45000, eePortion: 22500, erPortion: 22500, vestedPerc: 20, doj: '2024-01-05' },
];

export const ProvidentFundConfiguration: React.FC = () => {
  const [interestRate, setInterestRate] = useState(10.5);
  const [eeRate, setEeRate] = useState(8.33);
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <PiggyBank className="text-primary" size={28} />
            Provident Fund Configuration
          </h2>
          <p className="text-sm text-gray-500">Manage PF Trust details, contribution rules, and vesting schedules</p>
        </div>
        <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95">
          <Save size={18} /> Save Trust Rules
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Trust & Policy Settings */}
        <div className="lg:col-span-5 space-y-6">
          {/* Trust Identity */}
          <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-100 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
              <Building2 size={14} /> Trust Registration Details
            </h3>
            <div className="space-y-4">
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-500">Trust Full Name</label>
                  <input type="text" defaultValue="Flexi HRMS Employees Provident Fund Trust" className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-bold outline-none" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-black uppercase text-gray-500">Reg. Number</label>
                     <input type="text" defaultValue="ISB-PF-99221" className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-bold outline-none font-mono" />
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-black uppercase text-gray-500">Trustee in Charge</label>
                     <input type="text" defaultValue="M. Ahmed Raza" className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-bold outline-none" />
                  </div>
               </div>
               <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
                  <Landmark size={24} className="text-primary/40" />
                  <div className="flex-1">
                     <p className="text-[10px] font-black text-gray-400 uppercase">Dedicated PF Bank Account</p>
                     <p className="text-xs font-bold text-gray-700">Meezan Bank - A/C: 0011-223344556</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Contribution Rates */}
          <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-100 space-y-8">
            <div className="space-y-6">
               <h3 className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
                 <Percent size={14} /> Contribution Rules
               </h3>
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-500 uppercase">EE Rate (% Basic)</label>
                     <div className="relative">
                        <input 
                          type="number" 
                          value={eeRate}
                          onChange={(e) => setEeRate(Number(e.target.value))}
                          className="w-full px-4 py-2.5 bg-primary/5 border border-primary/20 rounded-xl text-sm font-black text-primary outline-none" 
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/40 font-bold">%</span>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-500 uppercase">ER Match Type</label>
                     <select className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-bold outline-none">
                        <option>Full 1:1 Match</option>
                        <option>Fixed Amount</option>
                        <option>Tiered Match</option>
                     </select>
                  </div>
               </div>
               <div className="space-y-4 pt-4 border-t border-dashed">
                  <h4 className="text-[10px] font-black uppercase text-gray-400">Vesting Schedule (Employer Share)</h4>
                  <div className="grid grid-cols-5 gap-2">
                     {[20, 40, 60, 80, 100].map((v, i) => (
                       <div key={i} className="text-center">
                          <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Yr {i+1}</p>
                          <div className="py-2 bg-gray-50 border rounded-lg text-[10px] font-black text-primary">{v}%</div>
                       </div>
                     ))}
                  </div>
                  <p className="text-[9px] text-gray-400 italic">Vesting applies only to company portion upon separation.</p>
               </div>
            </div>

            <div className="pt-8 border-t border-dashed space-y-6">
               <h3 className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
                 <HandCoins size={14} /> PF Loan Policy
               </h3>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between">
                     <span className="text-xs font-bold text-gray-600 uppercase">Enable Loans</span>
                     <button className="w-10 h-5 bg-green-500 rounded-full relative"><div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"/></button>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between">
                     <span className="text-xs font-bold text-gray-600 uppercase">Interest Free</span>
                     <button className="w-10 h-5 bg-green-500 rounded-full relative"><div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"/></button>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-black text-gray-500 uppercase">Max % of EE Bal</label>
                     <input type="number" defaultValue={80} className="w-full px-4 py-2 bg-gray-50 border rounded-xl text-sm font-bold outline-none" />
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-black text-gray-500 uppercase">Max Tenure (Mo)</label>
                     <input type="number" defaultValue={36} className="w-full px-4 py-2 bg-gray-50 border rounded-xl text-sm font-bold outline-none" />
                  </div>
               </div>
            </div>

            <div className="pt-8 border-t border-dashed space-y-6">
               <h3 className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
                 <TrendingUp size={14} /> Interest Distribution
               </h3>
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-black text-gray-500 uppercase">Annual Int. Rate</label>
                     <div className="relative">
                        <input 
                          type="number" 
                          value={interestRate}
                          onChange={(e) => setInterestRate(Number(e.target.value))}
                          className="w-full px-4 py-2.5 bg-green-50/50 border border-green-200 rounded-xl text-sm font-black text-green-700 outline-none" 
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-700/40 font-bold">%</span>
                     </div>
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-black text-gray-500 uppercase">Frequency</label>
                     <select className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-bold outline-none">
                        <option>Annual Credit</option>
                        <option>Monthly Pro-rata</option>
                     </select>
                  </div>
               </div>
               <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
                  <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-blue-700 font-bold leading-relaxed uppercase">
                    Interest is calculated on the running balance with monthly compounding, credited at the close of the financial year (June 30th).
                  </p>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Member Tracking */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden flex flex-col">
             <div className="p-6 border-b bg-gray-50/50 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                   <Users size={20} className="text-gray-400" />
                   <h3 className="text-sm font-black uppercase tracking-tight text-gray-700">PF Member Registry</h3>
                </div>
                <div className="flex gap-2">
                   <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      <input 
                        type="text" 
                        placeholder="Search members..." 
                        className="pl-9 pr-4 py-1.5 bg-white border rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary w-40" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                   </div>
                   <button className="flex items-center gap-2 px-3 py-1.5 bg-white border text-gray-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 shadow-sm">
                      <Download size={14} /> Export Audit File
                   </button>
                </div>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                   <thead>
                      <tr className="bg-gray-50/50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                         <th className="px-6 py-4">Employee Member</th>
                         <th className="px-6 py-4">PF Account No</th>
                         <th className="px-6 py-4 text-right">Total Balance</th>
                         <th className="px-6 py-4 text-center">Vested (%)</th>
                         <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50 font-medium">
                      {MOCK_MEMBERS.map(member => (
                        <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-primary/5 text-primary flex items-center justify-center font-black text-[10px]">{member.name.charAt(0)}</div>
                                 <div>
                                    <p className="font-bold text-gray-800 leading-none mb-1">{member.name}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Joined {member.doj}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-4 font-mono font-bold text-gray-600 text-xs">{member.pfNo}</td>
                           <td className="px-6 py-4 text-right">
                              <p className="font-mono font-black text-gray-800">{(member.totalBalance).toLocaleString()}</p>
                              <div className="flex justify-end gap-2 text-[8px] font-black uppercase text-gray-400 mt-0.5">
                                 <span>EE: {(member.eePortion/1000).toFixed(0)}K</span>
                                 <span>ER: {(member.erPortion/1000).toFixed(0)}K</span>
                              </div>
                           </td>
                           <td className="px-6 py-4 text-center">
                              <div className="flex flex-col items-center gap-1.5">
                                 <span className="text-[10px] font-black text-primary">{member.vestedPerc}%</span>
                                 <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: `${member.vestedPerc}%` }} />
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-4 text-right">
                              <button className="text-primary p-2 hover:bg-primary/5 rounded-lg transition-all"><History size={16} /></button>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
             <div className="p-4 bg-gray-50 border-t flex justify-between items-center text-[10px] font-black uppercase text-gray-400 tracking-widest">
                <p>Showing {MOCK_MEMBERS.length} of 485 total fund members</p>
                <div className="flex gap-4">
                   <button className="text-primary hover:underline">View All Records</button>
                </div>
             </div>
          </div>

          <div className="bg-primary rounded-3xl p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden flex items-center justify-between">
             <div className="relative z-10 space-y-4 max-w-md">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-accent rounded-xl text-primary"><FileText size={24} /></div>
                   <h3 className="text-xl font-black uppercase tracking-tight">Annual PF Statements</h3>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">
                  Bulk generate the statutory annual member statements for the current financial year. Includes closing balances and accrued interest.
                </p>
                <div className="flex items-center gap-3">
                   <select className="px-4 py-2.5 bg-white rounded-xl text-primary text-sm font-bold outline-none min-w-[150px]">
                      <option>FY 2024-25</option>
                      <option>FY 2023-24</option>
                   </select>
                   <button className="flex items-center gap-2 px-6 py-2.5 bg-accent text-primary rounded-xl text-sm font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg active:scale-95">
                      <Download size={18} /> Generate Batch
                   </button>
                </div>
             </div>
             <div className="relative z-10 bg-white/10 p-6 rounded-3xl border border-white/10 backdrop-blur-md space-y-4">
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-white/40 uppercase">Total Trust Assets</p>
                   <p className="text-3xl font-black text-accent">PKR 45.2M</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-green-400">
                   <CheckCircle2 size={14} /> Ready for Audit
                </div>
             </div>
             <PiggyBank className="absolute right-[-40px] top-[-40px] text-white/5 w-64 h-64 -rotate-12" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Enrolment Logic</h4>
                   <Settings2 size={14} className="text-gray-300" />
                </div>
                <div className="space-y-3">
                   <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-xs font-bold text-gray-600">Auto-enroll (Months)</span>
                      <span className="text-sm font-black text-primary">6</span>
                   </div>
                   <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-xs font-bold text-gray-600">Allow Opt-out</span>
                      <button className="w-8 h-4 bg-gray-300 rounded-full relative"><div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full"/></button>
                   </div>
                </div>
             </div>
             <div className="bg-orange-50 border border-orange-100 p-6 rounded-3xl flex items-start gap-4">
                <ShieldAlert size={24} className="text-orange-500 mt-0.5 shrink-0" />
                <div className="space-y-1">
                   <h5 className="text-[10px] font-black text-orange-900 uppercase">Compliance Reminder</h5>
                   <p className="text-[10px] text-orange-700 leading-relaxed font-bold">
                     Ensure the PF Trust deed is renewed with FBR and Provincial authorities before June 30th to maintain tax-exempt status for contributions.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
