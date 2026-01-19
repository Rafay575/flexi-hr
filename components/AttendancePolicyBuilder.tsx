
import React, { useState } from 'react';
import { 
  X, 
  Save, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  DollarSign, 
  Settings2, 
  Plus, 
  Trash2, 
  ChevronRight, 
  Info, 
  Zap, 
  History,
  Target,
  FileCheck,
  Building2,
  Globe,
  PieChart,
  ArrowRight,
  // Fix: Added missing XCircle import from lucide-react
  XCircle
} from 'lucide-react';

type TabId = 'basic' | 'thresholds' | 'late-early' | 'deductions' | 'bonus' | 'advanced';

export const AttendancePolicyBuilder: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<TabId>('basic');
  const [status, setStatus] = useState(true);

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'thresholds', label: 'Thresholds' },
    { id: 'late-early', label: 'Late / Early' },
    { id: 'deductions', label: 'Deductions' },
    { id: 'bonus', label: 'Bonus' },
    { id: 'advanced', label: 'Advanced' }
  ];

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-hidden bg-[#F5F5F5]">
      {/* HEADER */}
      <div className="bg-white px-8 py-4 border-b border-gray-200 flex justify-between items-center shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center text-white shadow-lg">
            <ShieldCheck size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">Configure Attendance Policy</h2>
              <span className="px-2 py-0.5 bg-[#3E3B6F]/5 text-[#3E3B6F] rounded text-[9px] font-black uppercase tracking-widest border border-[#3E3B6F]/10">v2.4 Draft</span>
            </div>
            <p className="text-xs text-gray-500 font-medium italic">Define work-hour rules and compliance logic</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all">Save Draft</button>
          <button className="px-6 py-2 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all">Publish Policy</button>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-all"><X size={24}/></button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* MAIN CONFIG AREA */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* TAB NAV */}
          <div className="flex border-b border-gray-100 px-8 bg-gray-50/50 shrink-0 overflow-x-auto no-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`px-6 py-4 text-[11px] font-black uppercase tracking-[0.1em] whitespace-nowrap transition-all border-b-2 -mb-px ${
                  activeTab === tab.id 
                    ? 'border-[#3E3B6F] text-[#3E3B6F]' 
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
            <div className="max-w-3xl space-y-10">
              
              {/* TAB 1: BASIC */}
              {activeTab === 'basic' && (
                <div className="space-y-8 animate-in slide-in-from-left-4">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Policy Code *</label>
                      <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-black uppercase focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none" placeholder="STD_OFF" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Display Name *</label>
                      <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none" placeholder="Standard Office Rules" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</label>
                    <textarea className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none min-h-[100px]" placeholder="Explain the purpose of this policy..." />
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Policy Type</label>
                      <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none">
                        <option>Office Staff</option>
                        <option>Factory Operations</option>
                        <option>Field Force</option>
                        <option>Flexi/Remote</option>
                        <option>Custom</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Calculation Priority</label>
                      <input type="number" defaultValue="1" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
                    <div>
                      <p className="text-xs font-bold text-gray-800">Policy Status</p>
                      <p className="text-[10px] text-gray-500 font-medium">Inactive policies won't be applied to roster calculations.</p>
                    </div>
                    <div 
                      onClick={() => setStatus(!status)}
                      className={`w-12 h-6 rounded-full relative p-1 cursor-pointer transition-colors ${status ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-all ${status ? 'translate-x-6' : 'translate-x-0'}`} />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: THRESHOLDS */}
              {activeTab === 'thresholds' && (
                <div className="space-y-10 animate-in slide-in-from-left-4">
                  <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50/50 p-4 border-b border-gray-100 flex items-center gap-2">
                      <Clock size={16} className="text-[#3E3B6F]" />
                      <h4 className="text-[10px] font-black text-[#3E3B6F] uppercase tracking-widest">Status Calculation Rules</h4>
                    </div>
                    <div className="p-8 space-y-8">
                      <div className="flex items-center gap-12 group">
                        <div className="w-32 shrink-0">
                          <p className="text-xs font-black text-green-600 uppercase tracking-tighter">PRESENT</p>
                        </div>
                        <div className="flex-1 flex items-center gap-4">
                          <span className="text-xs font-bold text-gray-400">Min:</span>
                          <input type="number" defaultValue="8" className="w-20 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs font-black text-center" />
                          <span className="text-xs font-medium text-gray-400">Hours</span>
                          <span className="text-xs font-bold text-gray-300 mx-2">OR</span>
                          <input type="number" defaultValue="100" className="w-20 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs font-black text-center" />
                          <span className="text-xs font-medium text-gray-400">% of Shift</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-12 group">
                        <div className="w-32 shrink-0">
                          <p className="text-xs font-black text-blue-600 uppercase tracking-tighter">HALF DAY</p>
                        </div>
                        <div className="flex-1 flex items-center gap-4">
                          <span className="text-xs font-bold text-gray-400">Min:</span>
                          <input type="number" defaultValue="4" className="w-20 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs font-black text-center" />
                          <span className="text-xs font-medium text-gray-400">Hours</span>
                          <span className="text-xs font-bold text-gray-300 mx-2">—</span>
                          <input type="number" defaultValue="50" className="w-20 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs font-black text-center" />
                          <span className="text-xs font-medium text-gray-400">% min</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-12 group">
                        <div className="w-32 shrink-0">
                          <p className="text-xs font-black text-orange-600 uppercase tracking-tighter">SHORT DAY</p>
                        </div>
                        <div className="flex-1 flex items-center gap-4">
                          <span className="text-xs font-bold text-gray-400">Min:</span>
                          <input type="number" defaultValue="2" className="w-20 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs font-black text-center" />
                          <span className="text-xs font-medium text-gray-400">Hours</span>
                          <span className="text-xs font-bold text-gray-300 mx-2">—</span>
                          <input type="number" defaultValue="25" className="w-20 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs font-black text-center" />
                          <span className="text-xs font-medium text-gray-400">% min</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Punch Requirements</h4>
                    <div className="grid grid-cols-2 gap-8">
                       <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
                          <span className="text-xs font-bold text-gray-700">Require Both In & Out</span>
                          <div className="w-10 h-5 bg-[#3E3B6F] rounded-full relative p-1 cursor-pointer">
                            <div className="w-3 h-3 bg-white rounded-full absolute right-1"></div>
                          </div>
                       </div>
                       <div className="space-y-2">
                          <p className="text-[10px] font-black text-gray-400 uppercase">Missing Out Handling</p>
                          <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold outline-none">
                             <option>Require Regularization</option>
                             <option>Treat as Absent</option>
                             <option>Treat as Half Day</option>
                             <option>Use Default Out Time</option>
                          </select>
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: LATE/EARLY */}
              {activeTab === 'late-early' && (
                <div className="space-y-10 animate-in slide-in-from-left-4">
                  <div className="p-6 bg-white rounded-3xl border border-gray-200 space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                       <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                         <Clock size={16} className="text-orange-500" /> Late Arrival Tracking
                       </h4>
                       <div className="w-10 h-5 bg-[#3E3B6F] rounded-full relative p-1 cursor-pointer">
                          <div className="w-3 h-3 bg-white rounded-full absolute right-1"></div>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-gray-400 uppercase">Grace Period (Mins)</label>
                          <input type="number" defaultValue="15" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-black text-[#3E3B6F]" />
                       </div>
                       <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <label className="text-[9px] font-black text-gray-400 uppercase">Monthly Grace Quota</label>
                            <div className="w-8 h-4 bg-gray-200 rounded-full relative p-0.5 cursor-pointer">
                               <div className="w-3 h-3 bg-white rounded-full"></div>
                            </div>
                          </div>
                          <p className="text-[9px] text-gray-400 italic">"Limit number of times grace can be used per month."</p>
                       </div>
                    </div>

                    <div className="space-y-4 pt-4">
                       <div className="flex justify-between items-center">
                          <label className="text-[9px] font-black text-gray-400 uppercase">Penalty Ranges</label>
                          <button className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded hover:bg-indigo-100 uppercase tracking-widest flex items-center gap-1">
                             <Plus size={10} /> Add Rule
                          </button>
                       </div>
                       <div className="border border-gray-100 rounded-2xl overflow-hidden">
                          <table className="w-full text-left text-[11px]">
                             <thead className="bg-gray-50 font-black text-gray-400 uppercase tracking-tighter">
                                <tr>
                                   <th className="p-3">Late Range</th>
                                   <th className="p-3">Penalty Label</th>
                                   <th className="p-3">Impact</th>
                                   <th className="p-3"></th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-gray-50 font-bold text-gray-700">
                                <tr>
                                   <td className="p-3">1 - 15 min</td>
                                   <td className="p-3">Warning</td>
                                   <td className="p-3 text-gray-400">None</td>
                                   <td className="p-3 text-right"><Trash2 size={12} className="text-gray-300" /></td>
                                </tr>
                                <tr>
                                   <td className="p-3">16 - 30 min</td>
                                   <td className="p-3 text-orange-600">Minor Late</td>
                                   <td className="p-3">Deduct 15m</td>
                                   <td className="p-3 text-right"><Trash2 size={12} className="text-gray-300" /></td>
                                </tr>
                             </tbody>
                          </table>
                       </div>
                    </div>
                  </div>

                  <div className="p-6 bg-[#3E3B6F]/5 rounded-3xl border border-[#3E3B6F]/10">
                     <h4 className="text-xs font-black text-[#3E3B6F] uppercase tracking-widest mb-4">Conflict Resolution</h4>
                     <div className="space-y-2">
                        <label className="text-[9px] font-black text-gray-400 uppercase">Late + Early same day handling</label>
                        <select className="w-full bg-white border border-[#3E3B6F]/20 rounded-xl px-4 py-2 text-xs font-bold outline-none">
                           <option>Apply higher penalty only</option>
                           <option>Sum all penalties</option>
                           <option>Apply special combined rule</option>
                        </select>
                     </div>
                  </div>
                </div>
              )}

              {/* TAB 4: DEDUCTIONS */}
              {activeTab === 'deductions' && (
                <div className="space-y-10 animate-in slide-in-from-left-4">
                  <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden">
                    <div className="bg-[#3E3B6F]/5 p-4 border-b border-gray-100 flex items-center gap-2">
                      <DollarSign size={16} className="text-[#3E3B6F]" />
                      <h4 className="text-[10px] font-black text-[#3E3B6F] uppercase tracking-widest">Absence Deduction Strategy</h4>
                    </div>
                    <div className="p-8 space-y-4">
                       {[
                         { id: 'none', label: 'No Deduction (Tracking Only)', desc: 'Record absence but do not trigger financial impact.' },
                         { id: 'leave', label: 'Auto-deduct from Leave Balance', desc: 'Deduct days in priority: Casual → Annual → Unpaid.' },
                         { id: 'salary', label: 'Direct Salary Deduction', desc: 'Deduct 1 day salary per instance of absence.', checked: true },
                         { id: 'both', label: 'Combined (Leave first, then Salary)', desc: 'Try to deduct leave, if zero balance, deduct salary.' }
                       ].map(opt => (
                         <label key={opt.id} className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${opt.checked ? 'border-[#3E3B6F] bg-[#3E3B6F]/5' : 'border-gray-100 hover:border-gray-200'}`}>
                            <div className={`mt-1 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${opt.checked ? 'border-[#3E3B6F]' : 'border-gray-300'}`}>
                               {opt.checked && <div className="w-2 h-2 bg-[#3E3B6F] rounded-full" />}
                            </div>
                            <div>
                               <p className="text-sm font-black text-gray-800 tracking-tight">{opt.label}</p>
                               <p className="text-[10px] text-gray-500 font-medium">{opt.desc}</p>
                            </div>
                         </label>
                       ))}
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 rounded-3xl border border-gray-200 space-y-6">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Waiver Scenarios</h4>
                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-gray-500 uppercase">First X occurrences per month (No Penalty)</label>
                          <input type="number" defaultValue="1" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 font-black text-[#3E3B6F]" />
                       </div>
                       <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100">
                          <span className="text-[11px] font-bold text-gray-600">Waiver for Probation Period</span>
                          <div className="w-8 h-4 bg-gray-200 rounded-full relative p-0.5 cursor-pointer">
                             <div className="w-3 h-3 bg-white rounded-full"></div>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: BONUS */}
              {activeTab === 'bonus' && (
                <div className="space-y-10 animate-in slide-in-from-left-4">
                  <div className="flex items-center justify-between p-6 bg-indigo-50 border border-indigo-100 rounded-3xl">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white text-indigo-600 rounded-2xl shadow-sm border border-indigo-100">
                        <Target size={24} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-indigo-900 uppercase tracking-widest">Attendance Bonus Engine</h4>
                        <p className="text-[10px] text-indigo-700/70 font-medium italic">Incentivize perfect attendance and punctuality.</p>
                      </div>
                    </div>
                    <div className="w-14 h-7 bg-indigo-500 rounded-full relative p-1 cursor-pointer">
                      <div className="w-5 h-5 bg-white rounded-full absolute right-1"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6 bg-white p-6 rounded-3xl border border-gray-200">
                       <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-3">Qualification Criteria</h4>
                       <div className="space-y-4">
                          <div className="flex items-center justify-between">
                             <span className="text-xs font-bold text-gray-600">Perfect Attendance (0 Absences)</span>
                             <div className="w-8 h-4 bg-indigo-200 rounded-full relative p-0.5 cursor-pointer">
                                <div className="w-3 h-3 bg-white rounded-full absolute right-0.5"></div>
                             </div>
                          </div>
                          <div className="flex items-center justify-between">
                             <span className="text-xs font-bold text-gray-600">Max Late Arrivals Allowed</span>
                             <input type="number" defaultValue="2" className="w-12 bg-gray-50 border border-gray-200 rounded-lg text-center text-xs font-black p-1" />
                          </div>
                          <div className="flex items-center justify-between">
                             <span className="text-xs font-bold text-gray-600">Min. Present Days Target</span>
                             <input type="number" defaultValue="22" className="w-12 bg-gray-50 border border-gray-200 rounded-lg text-center text-xs font-black p-1" />
                          </div>
                       </div>
                    </div>

                    <div className="space-y-6 bg-white p-6 rounded-3xl border border-gray-200">
                       <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-3">Bonus Value</h4>
                       <div className="space-y-4">
                          <div className="space-y-2">
                             <p className="text-[9px] font-black text-gray-400 uppercase">Leave Credit (Days)</p>
                             <input type="number" defaultValue="1" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 font-black text-[#3E3B6F]" />
                          </div>
                          <div className="space-y-2">
                             <p className="text-[9px] font-black text-gray-400 uppercase">Cash Bonus (Amount)</p>
                             <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400">PKR</span>
                                <input type="number" defaultValue="2000" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-2 font-black text-[#3E3B6F]" />
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-start gap-4">
                    <Info size={18} className="text-indigo-500 shrink-0" />
                    <p className="text-[11px] text-indigo-800 italic leading-relaxed">
                      "If employee has 100% attendance with ≤2 late arrivals in a month, award 1 day casual leave and PKR 2,000 bonus."
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 6: ADVANCED */}
              {activeTab === 'advanced' && (
                <div className="space-y-10 animate-in slide-in-from-left-4">
                  <div className="grid grid-cols-2 gap-10">
                     <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">In/Out Selection Logic</label>
                          <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none">
                             <option>First In / Last Out (Default)</option>
                             <option>Nearest to Shift Boundary</option>
                             <option>Optimal Duration Pair</option>
                          </select>
                        </div>
                        <div className="space-y-4 p-5 bg-white border border-gray-100 rounded-3xl shadow-sm">
                           <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-gray-700 uppercase tracking-tighter">Punch Rounding</span>
                              <div className="w-8 h-4 bg-gray-200 rounded-full relative p-0.5 cursor-pointer">
                                 <div className="w-3 h-3 bg-white rounded-full"></div>
                              </div>
                           </div>
                           <div className="grid grid-cols-2 gap-3 opacity-40">
                              <select disabled className="bg-gray-50 border-none rounded-lg p-2 text-[10px] font-bold">
                                 <option>15 Min Interval</option>
                              </select>
                              <select disabled className="bg-gray-50 border-none rounded-lg p-2 text-[10px] font-bold">
                                 <option>Round Nearest</option>
                              </select>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cross-Midnight Attribution</label>
                           <div className="flex gap-2">
                              <button className="flex-1 py-3 bg-[#3E3B6F] text-white rounded-xl text-[10px] font-black uppercase shadow-lg">Start Date</button>
                              <button className="flex-1 py-3 bg-white border border-gray-200 text-gray-400 rounded-xl text-[10px] font-bold uppercase hover:bg-gray-50">End Date</button>
                           </div>
                        </div>
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Consecutive Absence Action</label>
                           <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none">
                              <option>Alert HR after 3 Days</option>
                              <option>Require Explanation after 2 Days</option>
                              <option>Automatic Termination Warning (5 Days)</option>
                              <option>Escalate to Line Manager Only</option>
                           </select>
                        </div>
                     </div>
                  </div>

                  <div className="p-6 bg-red-50 border border-red-100 rounded-3xl flex gap-5 animate-pulse">
                     <AlertTriangle className="text-red-500 shrink-0" size={24} />
                     <div>
                        <p className="text-xs font-black text-red-800 uppercase tracking-widest mb-1">System Impact Warning</p>
                        <p className="text-[10px] text-red-700 leading-relaxed font-medium">
                          Rounding punch times may cause conflicts with specific labor laws in some regions. Ensure this configuration matches your local compliance requirements.
                        </p>
                     </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* RIGHT PREVIEW PANEL */}
        <div className="w-[380px] bg-white border-l border-gray-200 flex flex-col overflow-hidden shadow-2xl z-20 shrink-0">
           <div className="p-8 border-b border-gray-100 bg-gray-50/50 shrink-0 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 text-[#3E3B6F]">
                 <PieChart size={120} />
              </div>
              <h3 className="text-[10px] font-black text-[#3E3B6F] uppercase tracking-[0.2em] mb-8 flex items-center gap-2 relative z-10">
                <FileCheck size={16} /> Strategy Summary
              </h3>

              <div className="space-y-6 relative z-10">
                 <div className="bg-white p-4 rounded-2xl shadow-sm border border-indigo-100/50">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Workday Status</p>
                    <div className="space-y-2">
                       <div className="flex justify-between items-center text-[11px] font-bold">
                          <span className="text-gray-500">Present:</span>
                          <span className="text-[#3E3B6F]">≥ 8.0h</span>
                       </div>
                       <div className="flex justify-between items-center text-[11px] font-bold">
                          <span className="text-gray-500">Half Day:</span>
                          <span className="text-blue-600">4.0h - 7.9h</span>
                       </div>
                       <div className="flex justify-between items-center text-[11px] font-bold">
                          <span className="text-gray-500">Short Day:</span>
                          <span className="text-orange-600">2.0h - 3.9h</span>
                       </div>
                    </div>
                 </div>

                 <div className="bg-[#3E3B6F] p-4 rounded-2xl shadow-xl shadow-[#3E3B6F]/20 text-white">
                    <p className="text-[9px] font-black text-white/50 uppercase tracking-widest mb-3">Compliance Score</p>
                    <div className="flex items-center gap-4">
                       <div className="text-3xl font-black tabular-nums">98%</div>
                       <div className="h-8 w-px bg-white/10" />
                       <div className="text-[10px] font-medium leading-tight text-white/70 italic">
                         "Rules meet 2024 Corporate HR Standards."
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                   <Zap size={14} className="text-yellow-500" /> Auto-Logic Status
                 </h4>
                 <div className="space-y-3">
                    {[
                      { icon: <CheckCircle2 size={12} className="text-green-500" />, text: 'Late Deduction: 15m Scale' },
                      { icon: <CheckCircle2 size={12} className="text-green-500" />, text: 'Absence: Salary Deduct' },
                      { icon: <XCircle size={12} className="text-gray-300" />, text: 'Bonus: Active (Monthly)' },
                      { icon: <AlertTriangle size={12} className="text-orange-500" />, text: 'Rounding: Disabled' },
                    ].map((rule, i) => (
                      <div key={i} className="flex items-center gap-3 text-[11px] font-bold text-gray-600">
                         {rule.icon} {rule.text}
                      </div>
                    ))}
                 </div>
              </div>

              <div className="pt-8 border-t border-gray-100">
                 <button className="w-full py-4 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center gap-3 group hover:bg-[#3E3B6F] hover:text-white hover:border-[#3E3B6F] transition-all">
                    <span className="text-xs font-black uppercase tracking-widest">Test with Simulator</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                 </button>
                 <p className="text-[9px] text-gray-400 text-center mt-3 font-medium px-4">
                   Run a simulation against 100 random employee records to verify results.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
