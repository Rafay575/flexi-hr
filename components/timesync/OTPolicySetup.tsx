
import React, { useState } from 'react';
import { 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  X, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Users, 
  Zap, 
  ShieldCheck, 
  ArrowRight,
  Info,
  Briefcase,
  AlertTriangle,
  RefreshCcw,
  Check
} from 'lucide-react';

type OTType = 'Standard' | 'Comp-Off' | 'Hybrid';

interface OTPolicy {
  id: string;
  name: string;
  type: OTType;
  eligibility: string;
  threshold: string;
  cap: string;
  rate: string;
  status: 'ACTIVE' | 'INACTIVE';
}

const MOCK_POLICIES: OTPolicy[] = [
  { id: 'OT-001', name: 'Standard Factory OT', type: 'Standard', eligibility: 'Factory Staff', threshold: '30m', cap: 'Daily: 4h | Monthly: 40h', rate: '1.5x / 2.0x', status: 'ACTIVE' },
  { id: 'OT-002', name: 'Management Comp-Off', type: 'Comp-Off', eligibility: 'Grade L1-L4', threshold: '1h', cap: 'Weekly: 8h', rate: '1:1 Ratio', status: 'ACTIVE' },
  { id: 'OT-003', name: 'Sales Hybrid Policy', type: 'Hybrid', eligibility: 'Field Sales', threshold: '45m', cap: 'None', rate: 'Choice Based', status: 'ACTIVE' },
  { id: 'OT-004', name: 'Project Overtime', type: 'Standard', eligibility: 'Engineering', threshold: '15m', cap: 'Monthly: 20h', rate: '1.5x Fixed', status: 'INACTIVE' },
];

export const OTPolicySetup: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [policyType, setPolicyType] = useState<OTType>('Standard');

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <Clock className="text-[#3E3B6F]" size={28} /> Overtime Policy
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Define compensation rules for extra work hours and holiday duties</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus size={18} /> Create OT Policy
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-8 py-5">Policy Name</th>
                <th className="px-6 py-5">Type</th>
                <th className="px-6 py-5">Eligibility</th>
                <th className="px-6 py-5">Threshold</th>
                <th className="px-6 py-5">Limits / Cap</th>
                <th className="px-6 py-5">Multipliers</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_POLICIES.map((policy) => (
                <tr key={policy.id} className="group hover:bg-gray-50/80 transition-all cursor-default">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm">
                        <Clock size={18} />
                      </div>
                      <p className="text-xs font-bold text-gray-800">{policy.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                      policy.type === 'Standard' ? 'bg-green-50 text-green-600 border-green-100' :
                      policy.type === 'Comp-Off' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      'bg-purple-50 text-purple-600 border-purple-100'
                    }`}>
                      {policy.type}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                      <Users size={14} className="text-gray-400" />
                      {policy.eligibility}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-xs font-black text-gray-700 tabular-nums">
                    {policy.threshold}
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-[10px] font-bold text-gray-500">{policy.cap}</p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-[#3E3B6F]">
                      <TrendingUp size={12} className="text-green-500" />
                      {policy.rate}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      policy.status === 'ACTIVE' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {policy.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1  transition-all">
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
          <div className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[95vh]">
            {/* MODAL HEADER */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center text-white shadow-lg">
                    <TrendingUp size={20} />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-gray-800">Create OT Policy</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Policy Builder Wizard</p>
                 </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400"><X size={24}/></button>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* SIDE NAV */}
              <div className="w-56 bg-gray-50 border-r border-gray-100 p-4 space-y-1">
                {[
                  { id: 'basic', label: 'Basic Info', icon: <Zap size={14}/> },
                  { id: 'eligibility', label: 'Eligibility', icon: <Users size={14}/> },
                  { id: 'thresholds', label: 'Thresholds', icon: <Clock size={14}/> },
                  { id: 'caps', label: 'Limits & Caps', icon: <AlertTriangle size={14}/> },
                  { id: 'rates', label: 'Multipliers', icon: <TrendingUp size={14}/> },
                  { id: 'approvals', label: 'Workflows', icon: <ShieldCheck size={14}/> },
                ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-white shadow-sm text-[#3E3B6F]' : 'text-gray-400 hover:bg-gray-100'}`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>

              {/* CONTENT */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {activeTab === 'basic' && (
                  <div className="space-y-6 animate-in slide-in-from-right-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Policy Name *</label>
                        <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none" placeholder="Standard Production OT" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">OT Type *</label>
                        <select 
                          value={policyType}
                          onChange={(e) => setPolicyType(e.target.value as OTType)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none"
                        >
                           <option>Standard</option>
                           <option>Comp-Off</option>
                           <option>Hybrid</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</label>
                      <textarea className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none min-h-[100px]" placeholder="Define the scope and rules of this policy..." />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div>
                        <p className="text-xs font-bold text-gray-700">Policy Status</p>
                        <p className="text-[9px] text-gray-400 font-medium">Policy will be active upon publishing.</p>
                      </div>
                      <div className="w-10 h-5 bg-green-500 rounded-full relative p-1 cursor-pointer">
                        <div className="w-3 h-3 bg-white rounded-full absolute right-1"></div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'eligibility' && (
                  <div className="space-y-8 animate-in slide-in-from-right-4">
                    <div className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="text-[#3E3B6F]" size={20} />
                        <span className="text-xs font-bold text-gray-700">Apply to all employees</span>
                      </div>
                      <div className="w-8 h-4 bg-gray-200 rounded-full relative p-0.5 cursor-pointer">
                        <div className="w-3 h-3 bg-white rounded-full transition-all translate-x-0"></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Filter by Grades</label>
                          <div className="flex flex-wrap gap-2">
                             {['L1', 'L2', 'L3', 'L4', 'L5', 'L6'].map(g => (
                               <button key={g} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-500 hover:border-[#3E3B6F] hover:text-[#3E3B6F] transition-all">{g}</button>
                             ))}
                          </div>
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Filter by Department</label>
                          <div className="flex flex-wrap gap-2">
                             {['Factory', 'Warehousing', 'QA', 'Logistics'].map(d => (
                               <div key={d} className="flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-lg text-[10px] font-bold">
                                 {d} <X size={10} className="cursor-pointer" />
                               </div>
                             ))}
                             <button className="px-3 py-1 bg-white border border-dashed border-gray-300 rounded-lg text-[10px] font-bold text-gray-400">+ Add</button>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-50">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Employment Types</p>
                       <div className="grid grid-cols-3 gap-4">
                          {['Full-time', 'Part-time', 'Contractual', 'Seasonal', 'Trainee'].map(type => (
                            <label key={type} className="flex items-center gap-3 cursor-pointer group">
                               <div className="w-5 h-5 rounded border-2 border-gray-200 flex items-center justify-center group-hover:border-[#3E3B6F] transition-all">
                                  {type === 'Full-time' && <div className="w-2.5 h-2.5 bg-[#3E3B6F] rounded-sm" />}
                               </div>
                               <span className="text-xs font-bold text-gray-600">{type}</span>
                            </label>
                          ))}
                       </div>
                    </div>
                  </div>
                )}

                {activeTab === 'thresholds' && (
                  <div className="space-y-10 animate-in slide-in-from-right-4">
                     <div className="grid grid-cols-2 gap-10">
                        <div className="space-y-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Minimum Duration to Count</label>
                              <div className="relative">
                                 <input type="number" defaultValue="30" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-black text-[#3E3B6F]" />
                                 <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">MINS</span>
                              </div>
                              <p className="text-[9px] text-gray-400 font-medium italic">Work less than 30 mins won't be counted as OT.</p>
                           </div>

                           <div className="space-y-4">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">OT Calculation starts after</label>
                              <div className="space-y-3">
                                 <label className="flex items-center gap-3 p-4 bg-[#3E3B6F]/5 border-2 border-[#3E3B6F] rounded-2xl cursor-pointer">
                                    <div className="w-4 h-4 rounded-full border-2 border-[#3E3B6F] flex items-center justify-center"><div className="w-2 h-2 bg-[#3E3B6F] rounded-full" /></div>
                                    <div className="text-xs font-bold text-gray-800">Shift Completion (Scheduled Out)</div>
                                 </label>
                                 <label className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 transition-all">
                                    <div className="w-4 h-4 rounded-full border-2 border-gray-200" />
                                    <div className="text-xs font-bold text-gray-700">Fixed Time Boundary</div>
                                 </label>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-6">
                           <div className="p-6 bg-gray-50 rounded-3xl border border-gray-200 space-y-4">
                              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Punch Rounding Logic</h4>
                              <div className="grid grid-cols-2 gap-4">
                                 <select className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold text-[#3E3B6F] outline-none">
                                    <option>15 Min Interval</option>
                                    <option>30 Min Interval</option>
                                    <option>No Rounding</option>
                                 </select>
                                 <select className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold text-[#3E3B6F] outline-none">
                                    <option>Round Up</option>
                                    <option>Round Down</option>
                                    <option>Nearest</option>
                                 </select>
                              </div>
                              <div className="flex gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                                 <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
                                 <p className="text-[9px] text-blue-700 leading-relaxed italic">"Round 42 mins OT → 45 mins if 15m/Round-Up selected."</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                )}

                {activeTab === 'caps' && (
                  <div className="space-y-8 animate-in slide-in-from-right-4">
                     <div className="grid grid-cols-3 gap-6">
                        {[
                          { label: 'Daily Maximum', val: '4', color: 'text-orange-600' },
                          { label: 'Weekly Maximum', val: '12', color: 'text-blue-600' },
                          { label: 'Monthly Maximum', val: '40', color: 'text-[#3E3B6F]' },
                        ].map(cap => (
                          <div key={cap.label} className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm space-y-4 text-center">
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{cap.label}</p>
                             <div className="relative inline-block w-20">
                                <input type="number" defaultValue={cap.val} className={`w-full text-2xl font-black ${cap.color} bg-gray-50 rounded-xl p-2 text-center outline-none`} />
                             </div>
                             <p className="text-[9px] font-bold text-gray-400">HOURS</p>
                          </div>
                        ))}
                     </div>

                     <div className="p-8 bg-gray-50 rounded-3xl border border-gray-200 space-y-4">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">When Cap is reached:</h4>
                        <div className="grid grid-cols-3 gap-4">
                           {[
                             { id: 'stop', label: 'Stop Counting', active: true },
                             { id: 'req', label: 'Require Approval' },
                             { id: 'alert', label: 'Alert Only' },
                           ].map(action => (
                             <button key={action.id} className={`py-4 px-2 rounded-2xl border-2 transition-all text-xs font-black uppercase tracking-tighter ${action.active ? 'bg-white border-[#3E3B6F] text-[#3E3B6F] shadow-sm' : 'border-transparent text-gray-400 hover:bg-white hover:border-gray-200'}`}>
                               {action.label}
                             </button>
                           ))}
                        </div>
                     </div>
                  </div>
                )}

                {activeTab === 'rates' && (
                  <div className="space-y-8 animate-in slide-in-from-right-4">
                     <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden">
                        <table className="w-full text-left">
                           <thead className="bg-gray-50/50 border-b border-gray-100">
                              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                 <th className="p-6">Day Type</th>
                                 <th className="p-6">Paid Multiplier</th>
                                 <th className="p-6">Comp-Off Rate</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-50">
                              {[
                                { day: 'Weekday', mult: '1.5x', comp: '1:1 Ratio' },
                                { day: 'Saturday', mult: '1.5x', comp: '1:1 Ratio' },
                                { day: 'Sunday', mult: '2.0x', comp: '1.5:1 Ratio' },
                                { day: 'Holiday', mult: '2.5x', comp: '2:1 Ratio' },
                              ].map(row => (
                                <tr key={row.day}>
                                   <td className="p-6 text-xs font-bold text-gray-800">{row.day}</td>
                                   <td className="p-6">
                                      <div className="relative w-24">
                                         <input type="text" defaultValue={row.mult} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-black text-green-600" />
                                      </div>
                                   </td>
                                   <td className="p-6">
                                      <div className="relative w-32">
                                         <input type="text" defaultValue={row.comp} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-black text-blue-600" />
                                      </div>
                                   </td>
                                </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
                )}

                {activeTab === 'approvals' && (
                  <div className="space-y-8 animate-in slide-in-from-right-4">
                     <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                           <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                              <div className="space-y-0.5">
                                 <p className="text-xs font-bold text-gray-700">Pre-Approval Required</p>
                                 <p className="text-[9px] text-gray-400">Employee must request OT before shift start.</p>
                              </div>
                              <div className="w-8 h-4 bg-gray-200 rounded-full relative p-0.5 cursor-pointer">
                                 <div className="w-3 h-3 bg-white rounded-full"></div>
                              </div>
                           </div>
                           <div className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-100 rounded-2xl shadow-sm">
                              <div className="space-y-0.5">
                                 <p className="text-xs font-bold text-indigo-700">Post-Approval Required</p>
                                 <p className="text-[9px] text-indigo-400">Manager must authorize actual worked OT hours.</p>
                              </div>
                              <div className="w-8 h-4 bg-[#3E3B6F] rounded-full relative p-0.5 cursor-pointer">
                                 <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 shadow-sm"></div>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Auto-Approve Threshold</label>
                              <div className="relative">
                                 <input type="number" defaultValue="0.5" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-black text-[#3E3B6F]" />
                                 <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase">Hours</span>
                              </div>
                              <p className="text-[9px] text-gray-400 italic">Work below 30 mins will be auto-approved without manager action.</p>
                           </div>

                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Approval Hierarchy</label>
                              <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold">
                                 <option>Immediate Supervisor Only</option>
                                 <option>Supervisor & Department Head</option>
                                 <option>HR Authorization Required</option>
                              </select>
                           </div>
                        </div>
                     </div>

                     <div className="p-6 bg-gray-50 rounded-3xl border border-gray-200 space-y-4">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Payroll Head (PayEdge Integration)</h4>
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-1.5">
                              <p className="text-[9px] font-bold text-gray-400 uppercase">Select Earning Head</p>
                              <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#3E3B6F]">
                                 <option>OVERTIME_WAGES_BASIC</option>
                                 <option>SPECIAL_DUTY_ALLOWANCE</option>
                                 <option>LEAVE_IN_LIEU</option>
                              </select>
                           </div>
                           <div className="space-y-1.5">
                              <p className="text-[9px] font-bold text-gray-400 uppercase">Calculation Unit</p>
                              <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#3E3B6F]">
                                 <option>Per 1 Hour</option>
                                 <option>Per 30 Minutes</option>
                                 <option>Per 15 Minutes</option>
                              </select>
                           </div>
                        </div>
                     </div>
                  </div>
                )}
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between shrink-0">
               <div className="flex items-center gap-3">
                  <Info size={16} className="text-indigo-500" />
                  <p className="text-[10px] text-gray-500 font-medium italic">New OT policies take effect from the start of the next payroll cycle.</p>
               </div>
               <div className="flex gap-4">
                  <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 bg-white border border-gray-200 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">
                    Discard
                  </button>
                  <button className="px-10 py-3 bg-[#3E3B6F] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
                    Publish Policy <ArrowRight size={16} />
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
