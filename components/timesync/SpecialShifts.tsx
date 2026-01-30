
import React, { useState } from 'react';
import { 
  Moon, 
  Sun, 
  Snowflake, 
  Calendar, 
  Plus, 
  Clock, 
  Users, 
  MoreVertical,  
  Edit3, 
  Power, 
  X,
  ShieldCheck,
  Bell,
  Info,
  Sparkles
} from 'lucide-react';

type SpecialType = 'RAMZAN' | 'SUMMER' | 'WINTER' | 'EVENT' | 'CUSTOM';
type SpecialStatus = 'UPCOMING' | 'ACTIVE' | 'COMPLETED';

interface SpecialShift {
  id: string;
  name: string;
  type: SpecialType;
  startDate: string;
  endDate: string;
  baseShift: string;
  modifiedTiming: string;
  scope: string;
  status: SpecialStatus;
  employeeCount: number;
}

const MOCK_SPECIALS: SpecialShift[] = [
  { id: 'SS-001', name: 'Ramzan Timing 2025', type: 'RAMZAN', startDate: 'Mar 1, 2025', endDate: 'Mar 30, 2025', baseShift: 'All Shifts', modifiedTiming: '9:00 AM - 4:00 PM', scope: 'Muslim Employees', status: 'ACTIVE', employeeCount: 350 },
  { id: 'SS-002', name: 'Summer Core Hours', type: 'SUMMER', startDate: 'Jun 1, 2025', endDate: 'Aug 31, 2025', baseShift: 'General Flexi', modifiedTiming: '8:00 AM - 3:00 PM', scope: 'All Departments', status: 'UPCOMING', employeeCount: 850 },
  { id: 'SS-003', name: 'Annual Strategy Week', type: 'EVENT', startDate: 'Jan 15, 2025', endDate: 'Jan 20, 2025', baseShift: 'Head Office', modifiedTiming: '10:00 AM - 5:00 PM', scope: 'Management', status: 'UPCOMING', employeeCount: 45 },
  { id: 'SS-004', name: 'Winter Daylight Shift', type: 'WINTER', startDate: 'Nov 1, 2024', endDate: 'Dec 31, 2024', baseShift: 'Field Ops', modifiedTiming: '8:30 AM - 4:30 PM', scope: 'Field Staff', status: 'COMPLETED', employeeCount: 120 },
];

const TYPE_CONFIG: Record<SpecialType, { label: string; color: string; icon: React.ReactNode }> = {
  RAMZAN: { label: 'Ramzan', color: 'bg-amber-50 text-amber-600 border-amber-100', icon: <Moon size={14} /> },
  SUMMER: { label: 'Summer', color: 'bg-orange-50 text-orange-600 border-orange-100', icon: <Sun size={14} /> },
  WINTER: { label: 'Winter', color: 'bg-blue-50 text-blue-600 border-blue-100', icon: <Snowflake size={14} /> },
  EVENT: { label: 'Event', color: 'bg-purple-50 text-purple-600 border-purple-100', icon: <Sparkles size={14} /> },
  CUSTOM: { label: 'Custom', color: 'bg-gray-50 text-gray-600 border-gray-100', icon: <Calendar size={14} /> },
};

export const SpecialShifts: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeRamzan = MOCK_SPECIALS.find(s => s.type === 'RAMZAN' && s.status === 'ACTIVE');

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Special Shifts</h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Manage time-limited overrides for seasonal or religious periods</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus size={18} /> Create Special Shift
        </button>
      </div>

      {/* ACTIVE HIGHLIGHT CARD */}
      {activeRamzan && (
        <div className="bg-white rounded-3xl border border-amber-100 shadow-xl shadow-amber-500/5 overflow-hidden">
          <div className="bg-amber-50 px-8 py-4 border-b border-amber-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20 animate-pulse">
                <Moon size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-amber-900 leading-tight">🌙 Ramzan Timing - ACTIVE</h3>
                <p className="text-[10px] text-amber-700 font-black uppercase tracking-widest">Currently Applied Policy</p>
              </div>
            </div>
            <div className="flex gap-2">
               <button className="px-4 py-1.5 bg-white text-amber-600 rounded-lg text-xs font-bold border border-amber-200 hover:bg-amber-50 transition-all">End Early</button>
               <button className="px-4 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-bold shadow-md hover:bg-amber-700 transition-all">View Schedule</button>
            </div>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Effective Period</p>
              <p className="text-sm font-bold text-gray-800">{activeRamzan.startDate} - {activeRamzan.endDate}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Modified Window</p>
              <p className="text-sm font-bold text-amber-600">{activeRamzan.modifiedTiming}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Break Logic</p>
              <p className="text-sm font-bold text-gray-800">12:00 PM - 12:30 PM (30m)</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Applied Scope</p>
              <div className="flex items-center gap-2">
                <Users size={14} className="text-gray-400" />
                <span className="text-sm font-bold text-gray-800">{activeRamzan.employeeCount} Employees</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SPECIAL SHIFTS TABLE */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <th className="px-8 py-5">Name & Type</th>
                <th className="px-6 py-5">Dates</th>
                <th className="px-6 py-5">Base Shift</th>
                <th className="px-6 py-5">Override Timing</th>
                <th className="px-6 py-5 text-center">Scope</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_SPECIALS.map((shift) => (
                <tr key={shift.id} className="group hover:bg-gray-50/80 transition-all cursor-default">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-sm ${TYPE_CONFIG[shift.type].color}`}>
                        {TYPE_CONFIG[shift.type].icon}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">{shift.name}</p>
                        <span className="text-[9px] font-black uppercase text-gray-400">{shift.type}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col text-[11px] font-bold text-gray-600">
                       <span className="flex items-center gap-1"><Calendar size={10} className="text-gray-300" /> {shift.startDate}</span>
                       <span className="flex items-center gap-1 text-gray-400 font-medium">to {shift.endDate}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-xs font-bold text-gray-500 italic">
                    {shift.baseShift}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-xs font-black text-[#3E3B6F]">
                       <Clock size={14} className="text-blue-500" />
                       {shift.modifiedTiming}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-lg">
                      <Users size={12} className="text-indigo-400" />
                      <span className="text-[10px] font-bold text-indigo-700">{shift.employeeCount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      shift.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                      shift.status === 'UPCOMING' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                      {shift.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-2 text-gray-400 hover:text-[#3E3B6F] hover:bg-white rounded-lg transition-all"><Edit3 size={16} /></button>
                      <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-all"><Power size={16} /></button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all"><MoreVertical size={16} /></button>
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center text-white shadow-lg">
                    <Calendar size={20} />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-gray-800">New Special Timing</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Temporary Override Wizard</p>
                 </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400"><X size={24}/></button>
            </div>

            <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Policy Name *</label>
                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5" placeholder="e.g. Ramzan 2025" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Override Type</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold">
                       <option value="RAMZAN">Ramzan Period</option>
                       <option value="SUMMER">Summer Timing</option>
                       <option value="WINTER">Winter Timing</option>
                       <option value="EVENT">Event Specific</option>
                       <option value="CUSTOM">Custom Range</option>
                    </select>
                  </div>
               </div>

               <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Calendar size={14} className="text-[#3E3B6F]" /> Effective Period
                  </h4>
                  <div className="grid grid-cols-2 gap-6 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                     <div className="space-y-1">
                        <p className="text-[9px] text-gray-400 font-bold uppercase">From Date</p>
                        <input type="date" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-xs font-bold" />
                     </div>
                     <div className="space-y-1">
                        <p className="text-[9px] text-gray-400 font-bold uppercase">To Date</p>
                        <input type="date" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-xs font-bold" />
                     </div>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Clock size={14} className="text-[#3E3B6F]" /> New Timing Window
                    </h4>
                    <span className="text-[9px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded underline cursor-pointer">Select Base Shifts (All)</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="space-y-1">
                        <p className="text-[9px] text-gray-400 font-bold uppercase">New Start</p>
                        <input type="time" defaultValue="09:00" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-black text-[#3E3B6F]" />
                     </div>
                     <div className="space-y-1">
                        <p className="text-[9px] text-gray-400 font-bold uppercase">New End</p>
                        <input type="time" defaultValue="16:00" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-black text-[#3E3B6F]" />
                     </div>
                     <div className="space-y-1">
                        <p className="text-[9px] text-gray-400 font-bold uppercase">New Break</p>
                        <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold">
                           <option>Ramzan Short Break (30m)</option>
                           <option>Standard Lunch (60m)</option>
                           <option>Tea Only (15m)</option>
                        </select>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                       <ShieldCheck size={14} /> Eligibility & Scope
                     </h4>
                     <div className="space-y-3">
                        {['All Employees', 'Muslim Employees Only', 'Specific Departments', 'Manual Selection'].map((opt, i) => (
                          <label key={opt} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-indigo-50/30 transition-all">
                             <input type="radio" name="scope" defaultChecked={i === 0} className="w-4 h-4 text-[#3E3B6F]" />
                             <span className="text-xs font-bold text-gray-700">{opt}</span>
                          </label>
                        ))}
                     </div>
                  </div>
                  <div className="space-y-4">
                     <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                       <Bell size={14} /> Automation & Alerts
                     </h4>
                     <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                        <div className="flex items-center justify-between">
                           <span className="text-[11px] font-bold text-gray-600">Auto-assign Shift</span>
                           <div className="w-10 h-5 bg-green-500 rounded-full relative p-1">
                              <div className="w-3 h-3 bg-white rounded-full absolute right-1"></div>
                           </div>
                        </div>
                        <div className="space-y-2">
                           <p className="text-[11px] font-bold text-gray-600">Notify employees (days before)</p>
                           <input type="number" defaultValue="3" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-black" />
                        </div>
                        <div className="flex gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                           <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
                           <p className="text-[9px] text-blue-700 leading-relaxed font-medium">System will trigger push notifications and emails to all eligible staff upon activation.</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4 shrink-0">
               <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-white border border-gray-200 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">
                 Cancel
               </button>
               <button className="flex-[2] py-3 bg-[#3E3B6F] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all">
                 Authorize & Publish
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
