
import React, { useState } from 'react';
import { 
  Trophy, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  X, 
  Target, 
  DollarSign, 
  Calendar, 
  Users, 
  Zap, 
  ShieldCheck, 
  Clock, 
  ChevronRight,
  Info,
  Gift,
  ArrowRight
} from 'lucide-react';

type BonusPeriod = 'Monthly' | 'Quarterly' | 'Annual';

interface BonusRule {
  id: string;
  name: string;
  period: BonusPeriod;
  criteria: string;
  bonus: string;
  eligibleCount: number;
  status: 'ACTIVE' | 'INACTIVE';
}

const MOCK_RULES: BonusRule[] = [
  { id: 'BR-001', name: 'Perfect Attendance Monthly', period: 'Monthly', criteria: '0 Abs, ≤2 Late', bonus: '1d CL + PKR 2,000', eligibleCount: 142, status: 'ACTIVE' },
  { id: 'BR-002', name: 'Quarterly Star', period: 'Quarterly', criteria: '<3 Abs, <5 Late', bonus: '2d Annual Leave', eligibleCount: 85, status: 'ACTIVE' },
  { id: 'BR-003', name: 'Annual Excellence', period: 'Annual', criteria: '<10 Absences', bonus: '5d AL + PKR 25,000', eligibleCount: 24, status: 'ACTIVE' },
  { id: 'BR-004', name: 'Punctuality Pro', period: 'Monthly', criteria: '0 Late, 0 Early Out', bonus: 'PKR 1,500 Gift Card', eligibleCount: 12, status: 'INACTIVE' },
];

export const AttendanceBonusRules: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <Trophy className="text-amber-500" size={28} /> Attendance Bonus Rules
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Incentivize workforce discipline with automated rewards and credits</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus size={18} /> Create Bonus Rule
        </button>
      </div>

      {/* SEARCH & FILTER */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search rules..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#3E3B6F]/10 outline-none" 
          />
        </div>
        <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-xl transition-all"><Filter size={18}/></button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-8 py-5">Rule Name</th>
                <th className="px-6 py-5">Period</th>
                <th className="px-6 py-5">Qualification Criteria</th>
                <th className="px-6 py-5">Bonus Award</th>
                <th className="px-6 py-5 text-center">Eligible Staff</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_RULES.map((rule) => (
                <tr key={rule.id} className="group hover:bg-gray-50/80 transition-all cursor-default">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100 shadow-sm">
                        <Trophy size={18} />
                      </div>
                      <p className="text-xs font-bold text-gray-800">{rule.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                      rule.period === 'Monthly' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      rule.period === 'Quarterly' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                      'bg-orange-50 text-orange-600 border-orange-100'
                    }`}>
                      {rule.period}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                      <Target size={14} className="text-gray-400" />
                      {rule.criteria}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-xs font-black text-[#3E3B6F]">
                      <Gift size={14} className="text-pink-500" />
                      {rule.bonus}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-lg text-[11px] font-black text-gray-500 tabular-nums">
                      <Users size={12} /> {rule.eligibleCount}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      rule.status === 'ACTIVE' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {rule.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-white rounded-lg transition-all"><Edit3 size={16}/></button>
                      <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-all"><Trash2 size={16}/></button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all"><MoreVertical size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[95vh]">
            {/* MODAL HEADER */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center text-white shadow-lg">
                    <Trophy size={20} />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-gray-800">New Attendance Bonus Rule</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Reward Builder Wizard</p>
                 </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400"><X size={24}/></button>
            </div>

            <div className="p-8 space-y-10 flex-1 overflow-y-auto custom-scrollbar">
              {/* SECTION 1: BASIC INFO */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-6">
                  <h4 className="text-[11px] font-black text-[#3E3B6F] uppercase tracking-widest border-b border-gray-100 pb-2">Basic Information</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rule Name *</label>
                      <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none" placeholder="Perfect Presence" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reward Period *</label>
                      <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none">
                         <option>Monthly</option>
                         <option>Quarterly</option>
                         <option>Annual</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</label>
                    <textarea className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none min-h-[80px]" placeholder="Briefly explain the goal of this reward..." />
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-[11px] font-black text-[#3E3B6F] uppercase tracking-widest border-b border-gray-100 pb-2">Global Settings</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                       <span className="text-xs font-bold text-gray-700">Rule Status</span>
                       <div className="w-10 h-5 bg-green-500 rounded-full relative p-1 cursor-pointer">
                          <div className="w-3 h-3 bg-white rounded-full absolute right-1"></div>
                       </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                       <span className="text-xs font-bold text-gray-700">Auto-Process</span>
                       <div className="w-10 h-5 bg-gray-200 rounded-full relative p-1 cursor-pointer">
                          <div className="w-3 h-3 bg-white rounded-full absolute left-1"></div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: QUALIFICATION */}
              <div className="space-y-6">
                <h4 className="text-[11px] font-black text-[#3E3B6F] uppercase tracking-widest border-b border-gray-100 pb-2">Qualification Criteria (Strict Enforcement)</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                   {[
                     { label: 'Max Absences', val: '0', unit: 'Days' },
                     { label: 'Max Late-ins', val: '2', unit: 'Times' },
                     { label: 'Max Early-outs', val: '2', unit: 'Times' },
                     { label: 'Max Short Days', val: '0', unit: 'Days' },
                     { label: 'Min. Presence', val: '95', unit: '%' },
                   ].map(c => (
                     <div key={c.label} className="p-4 bg-white border border-gray-200 rounded-2xl hover:border-[#3E3B6F] transition-all group">
                        <label className="flex items-center gap-2 mb-3">
                           <input type="checkbox" defaultChecked className="w-3 h-3 rounded border-gray-300" />
                           <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{c.label}</span>
                        </label>
                        <div className="relative">
                           <input type="text" defaultValue={c.val} className="w-full bg-gray-50 border-none rounded-xl px-3 py-2 text-sm font-black text-[#3E3B6F]" />
                           <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 pointer-events-none">{c.unit}</span>
                        </div>
                     </div>
                   ))}
                </div>
              </div>

              {/* SECTION 3: REWARD AWARD */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                   <h4 className="text-[11px] font-black text-[#3E3B6F] uppercase tracking-widest border-b border-gray-100 pb-2 flex items-center gap-2">
                     <Clock size={16} className="text-blue-500" /> Leave Credit Award
                   </h4>
                   <div className="p-6 bg-blue-50/30 rounded-3xl border border-blue-100 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <p className="text-[9px] font-black text-blue-400 uppercase">Leave Type</p>
                           <select className="w-full bg-white border border-blue-100 rounded-xl px-3 py-2 text-xs font-bold outline-none">
                              <option>Casual Leave</option>
                              <option>Annual Leave</option>
                              <option>Comp-Off</option>
                           </select>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[9px] font-black text-blue-400 uppercase">Days Count</p>
                           <input type="number" defaultValue="1" className="w-full bg-white border border-blue-100 rounded-xl px-3 py-2 text-xs font-bold" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-blue-400 uppercase">Validity Expiry</p>
                        <div className="relative">
                          <input type="number" defaultValue="3" className="w-full bg-white border border-blue-100 rounded-xl px-3 py-2 text-xs font-bold" />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-blue-400">MONTHS</span>
                        </div>
                      </div>
                   </div>
                </div>

                <div className="space-y-6">
                   <h4 className="text-[11px] font-black text-[#3E3B6F] uppercase tracking-widest border-b border-gray-100 pb-2 flex items-center gap-2">
                     <DollarSign size={16} className="text-green-600" /> Monetary Bonus
                   </h4>
                   <div className="p-6 bg-green-50/30 rounded-3xl border border-green-100 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <p className="text-[9px] font-black text-green-400 uppercase">Bonus Amount</p>
                           <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-green-400 uppercase">PKR</span>
                              <input type="number" defaultValue="2000" className="w-full bg-white border border-green-100 rounded-xl pl-12 pr-4 py-2 text-xs font-bold" />
                           </div>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[9px] font-black text-green-400 uppercase">Calculation Mode</p>
                           <select className="w-full bg-white border border-green-100 rounded-xl px-3 py-2 text-xs font-bold outline-none">
                              <option>Fixed Amount</option>
                              <option>% of Basic Salary</option>
                           </select>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-green-400 uppercase">Target Payroll Head</p>
                        <select className="w-full bg-white border border-green-100 rounded-xl px-3 py-2 text-xs font-bold outline-none">
                           <option>ATTENDANCE_INCENTIVE</option>
                           <option>PERFORMANCE_BONUS</option>
                           <option>OTHER_EARNINGS</option>
                        </select>
                      </div>
                   </div>
                </div>
              </div>

              {/* SECTION 4: ELIGIBILITY */}
              <div className="p-6 bg-gray-50 rounded-3xl border border-gray-200">
                <h4 className="text-[11px] font-black text-[#3E3B6F] uppercase tracking-widest mb-6 flex items-center gap-2">
                  <ShieldCheck size={18} /> Eligibility Scope
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-600">Exclude Probation</span>
                        <div className="w-8 h-4 bg-[#3E3B6F] rounded-full relative p-0.5 cursor-pointer">
                           <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 shadow-sm"></div>
                        </div>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Minimum Tenure</p>
                        <div className="relative">
                          <input type="number" defaultValue="6" className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold" />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-gray-400">MONTHS</span>
                        </div>
                     </div>
                  </div>
                  <div className="md:col-span-2 space-y-3">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Target Departments</p>
                     <div className="flex flex-wrap gap-2">
                        {['Engineering', 'Product', 'Design', 'Marketing', 'Operations', 'Sales', 'HR'].map(dept => (
                          <div key={dept} className="flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-600 cursor-pointer hover:border-[#3E3B6F] hover:text-[#3E3B6F] transition-all">
                             {dept} <X size={10} className="text-gray-300" />
                          </div>
                        ))}
                        <button className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest">+ Add Dept</button>
                     </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between shrink-0">
               <div className="flex items-center gap-3">
                  <Info size={16} className="text-indigo-500" />
                  <p className="text-[10px] text-gray-500 font-medium italic">Policy changes will take effect from the start of the next payroll cycle.</p>
               </div>
               <div className="flex gap-4">
                  <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 bg-white border border-gray-200 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">
                    Discard
                  </button>
                  <button className="px-10 py-3 bg-[#3E3B6F] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
                    Publish Rule <ArrowRight size={16} />
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
