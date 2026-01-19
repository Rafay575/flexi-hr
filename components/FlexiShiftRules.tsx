
import React, { useState } from 'react';
import { 
  Zap, 
  Settings2, 
  Clock, 
  Users, 
  Plus, 
  MoreVertical, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  Info,
  Calendar,
  X,
  Layers,
  ArrowRight
} from 'lucide-react';

interface FlexiRule {
  id: string;
  name: string;
  window: string;
  requiredHours: string;
  coreHours: string | 'None';
  employeeCount: number;
  status: 'ACTIVE' | 'INACTIVE';
}

const MOCK_RULES: FlexiRule[] = [
  { id: 'FR-001', name: 'Standard Flexi', window: '07:00 AM - 09:00 PM', requiredHours: '8h Daily', coreHours: '10:00 AM - 04:00 PM', employeeCount: 142, status: 'ACTIVE' },
  { id: 'FR-002', name: 'Field Flexi (No Core)', window: '06:00 AM - 10:00 PM', requiredHours: '8h Daily', coreHours: 'None', employeeCount: 28, status: 'ACTIVE' },
  { id: 'FR-003', name: 'Part-time Flexi', window: '09:00 AM - 06:00 PM', requiredHours: '4h Daily', coreHours: 'None', employeeCount: 12, status: 'ACTIVE' },
  { id: 'FR-004', name: 'Weekly Target Flexi', window: '07:00 AM - 11:00 PM', requiredHours: '40h Weekly', coreHours: '11:00 AM - 03:00 PM', employeeCount: 5, status: 'INACTIVE' },
];

export const FlexiShiftRules: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shortfallHandling, setShortfallHandling] = useState('Mark as Short Day');

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <Zap className="text-[#3E3B6F]" size={28} /> Flexi Shift Configuration
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Define autonomous work windows with core collaboration hours</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus size={18} /> Create Flexi Rule
        </button>
      </div>

      {/* GLOBAL FLEXI SETTINGS CARD */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col lg:flex-row">
        <div className="p-8 border-b lg:border-b-0 lg:border-r border-gray-100 flex-1 space-y-6 bg-gray-50/30">
          <div className="flex items-center gap-2 mb-2">
            <Layers size={18} className="text-[#3E3B6F]" />
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Global Constraints</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
               <label className="text-[10px] font-black text-gray-500 uppercase">Master Window</label>
               <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-[9px] text-gray-400 font-bold uppercase">Earliest In</p>
                    <input type="time" defaultValue="07:00" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-black text-[#3E3B6F]" />
                  </div>
                  <ArrowRight size={14} className="text-gray-300 mt-4" />
                  <div className="flex-1 space-y-1">
                    <p className="text-[9px] text-gray-400 font-bold uppercase">Latest Out</p>
                    <input type="time" defaultValue="21:00" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-black text-[#3E3B6F]" />
                  </div>
               </div>
               <p className="text-[10px] text-gray-400 italic">"Employees can work their required hours anytime within this 14h window."</p>
            </div>

            <div className="space-y-4">
               <label className="text-[10px] font-black text-gray-500 uppercase">Hour Requirements</label>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[9px] text-gray-400 font-bold uppercase">Daily Min</p>
                    <div className="relative">
                      <input type="number" defaultValue="8" className="w-full bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-2 text-sm font-black text-[#3E3B6F]" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-gray-400">HRS</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] text-gray-400 font-bold uppercase">Weekly Target</p>
                    <div className="relative">
                      <input type="number" defaultValue="40" className="w-full bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-2 text-sm font-black text-[#3E3B6F]" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-gray-400">HRS</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="p-8 flex-1 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Settings2 size={18} className="text-orange-500" />
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Logic & Shortfall</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
               <label className="text-[10px] font-black text-gray-500 uppercase">Shortfall Handling</label>
               <select 
                 value={shortfallHandling}
                 onChange={(e) => setShortfallHandling(e.target.value)}
                 className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold text-[#3E3B6F] outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
               >
                 <option>Mark as Short Day</option>
                 <option>Carry forward to next day</option>
                 <option>Deduct from leave balance</option>
                 <option>Mark as Absent</option>
               </select>
               <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl flex gap-3">
                 <AlertCircle size={14} className="text-orange-500 shrink-0 mt-0.5" />
                 <p className="text-[10px] text-orange-700 leading-relaxed font-medium">
                   Current policy: Shortfall of {'>'} 2h triggers automatic Leave Deduction if balance exists.
                 </p>
               </div>
            </div>

            <div className="space-y-4">
               <div className="flex items-center justify-between">
                 <label className="text-[10px] font-black text-gray-500 uppercase">Enable Core Hours</label>
                 <div className="w-10 h-5 bg-[#3E3B6F] rounded-full relative p-1 cursor-pointer">
                   <div className="w-3 h-3 bg-white rounded-full absolute right-1"></div>
                 </div>
               </div>
               <div className="flex items-center gap-4 opacity-100 transition-opacity">
                  <div className="flex-1 space-y-1">
                    <p className="text-[9px] text-gray-400 font-bold uppercase">Core Start</p>
                    <input type="time" defaultValue="10:00" className="w-full bg-indigo-50/50 border border-indigo-100 rounded-xl px-4 py-2 text-sm font-black text-[#3E3B6F]" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-[9px] text-gray-400 font-bold uppercase">Core End</p>
                    <input type="time" defaultValue="16:00" className="w-full bg-indigo-50/50 border border-indigo-100 rounded-xl px-4 py-2 text-sm font-black text-[#3E3B6F]" />
                  </div>
               </div>
               <p className="text-[10px] text-gray-400 italic">"Employees must be present for meetings/collab during this block."</p>
            </div>
          </div>
        </div>
      </div>

      {/* RULES TABLE */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
           <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
             <ShieldCheck size={18} className="text-green-500" /> Department Rules
           </h3>
           <div className="flex items-center gap-2">
             <span className="text-[10px] font-bold text-gray-400 bg-white px-2 py-1 rounded border border-gray-100">Total: 4 Rules</span>
           </div>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/30 border-b border-gray-100">
                <th className="px-8 py-4">Rule Name</th>
                <th className="px-6 py-4">Punch Window</th>
                <th className="px-6 py-4">Required</th>
                <th className="px-6 py-4 text-center">Core Hours</th>
                <th className="px-6 py-4 text-center">Employees</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_RULES.map((rule) => (
                <tr key={rule.id} className="group hover:bg-gray-50/80 transition-all cursor-default">
                  <td className="px-8 py-5">
                    <div>
                      <p className="text-xs font-bold text-gray-800">{rule.name}</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">REF: {rule.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                      <Clock size={14} className="text-blue-500" />
                      {rule.window}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-black text-[#3E3B6F] bg-indigo-50 px-2 py-1 rounded-lg">
                      {rule.requiredHours}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    {rule.coreHours === 'None' ? (
                      <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">Open Schedule</span>
                    ) : (
                      <span className="text-[11px] font-bold text-orange-600 border-b border-orange-200">
                        {rule.coreHours}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600">
                      <Users size={14} className="opacity-40" /> {rule.employeeCount}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${rule.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${rule.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-400'}`}>
                        {rule.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 text-gray-300 hover:text-[#3E3B6F] hover:bg-white rounded-lg transition-all shadow-none hover:shadow-sm">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center text-white shadow-lg shadow-[#3E3B6F]/20">
                    <Zap size={20} />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-gray-800">New Flexi Policy</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Policy Creation Wizard</p>
                 </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400">
                <X size={24}/>
              </button>
            </div>

            <div className="p-10 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Policy Name *</label>
                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5" placeholder="e.g. Creative Flexi" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Employee Grades</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold">
                       <option>All Eligible Grades</option>
                       <option>Grade M1 - M5 (Management)</option>
                       <option>Grade E1 - E5 (Engineering)</option>
                    </select>
                  </div>
               </div>

               <div className="space-y-4">
                  <h4 className="text-xs font-black text-[#3E3B6F] uppercase tracking-widest flex items-center gap-2">
                    <Clock size={16} /> Operational Windows
                  </h4>
                  <div className="grid grid-cols-2 gap-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                     <div className="space-y-4">
                        <p className="text-[9px] font-black text-gray-400 uppercase">Daily Window</p>
                        <div className="flex items-center gap-3">
                           <input type="time" defaultValue="08:00" className="flex-1 bg-white border border-gray-100 rounded-xl px-4 py-2 text-xs font-bold" />
                           <ArrowRight size={14} className="text-gray-300" />
                           <input type="time" defaultValue="20:00" className="flex-1 bg-white border border-gray-100 rounded-xl px-4 py-2 text-xs font-bold" />
                        </div>
                     </div>
                     <div className="space-y-4">
                        <p className="text-[9px] font-black text-orange-400 uppercase">Core Period (Optional)</p>
                        <div className="flex items-center gap-3">
                           <input type="time" defaultValue="11:00" className="flex-1 bg-white border border-gray-100 rounded-xl px-4 py-2 text-xs font-bold" />
                           <ArrowRight size={14} className="text-gray-300" />
                           <input type="time" defaultValue="15:00" className="flex-1 bg-white border border-gray-100 rounded-xl px-4 py-2 text-xs font-bold" />
                        </div>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <h4 className="text-xs font-black text-[#3E3B6F] uppercase tracking-widest flex items-center gap-2">
                       <CheckCircle2 size={16} /> Break Rules
                     </h4>
                     <div className="space-y-3">
                        <label className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-indigo-50/30 transition-all">
                           <input type="radio" name="break" defaultChecked className="w-4 h-4 text-[#3E3B6F]" />
                           <span className="text-xs font-bold text-gray-700">Auto-deduct 60m fixed</span>
                        </label>
                        <label className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-indigo-50/30 transition-all">
                           <input type="radio" name="break" className="w-4 h-4 text-[#3E3B6F]" />
                           <span className="text-xs font-bold text-gray-700">Enforced Punch Break</span>
                        </label>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <h4 className="text-xs font-black text-[#3E3B6F] uppercase tracking-widest flex items-center gap-2">
                       <Info size={16} /> Summary Preview
                     </h4>
                     <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-2">
                        <div className="flex justify-between text-[10px] font-bold"><span className="text-gray-500 uppercase">Work Cap:</span> <span className="text-[#3E3B6F]">12h Window</span></div>
                        <div className="flex justify-between text-[10px] font-bold"><span className="text-gray-500 uppercase">Collab:</span> <span className="text-[#3E3B6F]">4h Core Required</span></div>
                        <div className="flex justify-between text-[10px] font-bold pt-2 border-t border-indigo-100/50"><span className="text-gray-500 uppercase">Shortfall:</span> <span className="text-red-600 font-black">MARK SHORT DAY</span></div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4 shrink-0">
               <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-white border border-gray-200 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">
                 Cancel
               </button>
               <button className="flex-[2] py-3 bg-[#3E3B6F] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all">
                 Publish Flexi Rule
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
