
import React, { useState, useMemo } from 'react';
import { 
  LayoutTemplate, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  RefreshCcw, 
  Calendar, 
  Clock, 
  Users, 
  ArrowRight, 
  ChevronRight, 
  X, 
  CheckCircle2, 
  Info,
  ShieldCheck,
  Zap,
  Layers,
  ArrowRightLeft
} from 'lucide-react';

type ShiftCode = 'M' | 'E' | 'N' | 'F' | 'OFF';

interface RosterTemplate {
  id: string;
  name: string;
  description: string;
  cycleDays: number;
  pattern: string;
  shifts: string[];
  teamCount: number;
  status: 'ACTIVE' | 'DRAFT';
}

const MOCK_TEMPLATES: RosterTemplate[] = [
  { id: 'RT-001', name: 'Standard 5-2 Office', description: 'Mon-Fri work, Sat-Sun off. Fixed 9 AM - 6 PM.', cycleDays: 7, pattern: '5 on / 2 off', shifts: ['M'], teamCount: 1, status: 'ACTIVE' },
  { id: 'RT-002', name: 'Rotating 3-Shift Factory', description: 'Continuous 24/7 rotation for production teams.', cycleDays: 21, pattern: 'Rotating 3-shift', shifts: ['M', 'E', 'N'], teamCount: 3, status: 'ACTIVE' },
  { id: 'RT-003', name: 'Support Alternate Saturday', description: 'Alternating 5 and 6 day work weeks.', cycleDays: 14, pattern: 'Alt Sat / Sun Off', shifts: ['M'], teamCount: 2, status: 'ACTIVE' },
  { id: 'RT-004', name: 'Night Owl Security', description: 'Permanent night duty with mid-week offs.', cycleDays: 7, pattern: 'Fixed Night', shifts: ['N'], teamCount: 1, status: 'ACTIVE' },
  { id: 'RT-005', name: 'Weekend Peak Retail', description: 'Heavier staffing for weekend operations.', cycleDays: 7, pattern: 'Custom Weekend', shifts: ['F'], teamCount: 1, status: 'DRAFT' },
];

const SHIFT_COLORS: Record<ShiftCode, string> = {
  M: 'bg-blue-500 text-white',
  E: 'bg-green-500 text-white',
  N: 'bg-purple-600 text-white',
  F: 'bg-teal-500 text-white',
  OFF: 'bg-gray-100 text-gray-400',
};

export const RosterTemplates: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cycleLength, setCycleLength] = useState(7);
  const [rotationWeeks, setRotationWeeks] = useState(3);
  const [isRotating, setIsRotating] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <LayoutTemplate className="text-[#3E3B6F]" size={28} /> Roster Templates
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Design and manage modular workforce scheduling patterns</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus size={18} /> Create Template
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Search templates..." className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium outline-none focus:ring-4 focus:ring-[#3E3B6F]/5" />
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-gray-400 hover:text-[#3E3B6F] bg-white border border-gray-100 rounded-lg transition-all"><Filter size={14} /></button>
          </div>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/30 border-b border-gray-100">
                <th className="px-8 py-4">Template Name</th>
                <th className="px-6 py-4">Pattern Type</th>
                <th className="px-6 py-4 text-center">Cycle Days</th>
                <th className="px-6 py-4">Included Shifts</th>
                <th className="px-6 py-4 text-center">Active Teams</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_TEMPLATES.map((tpl) => (
                <tr key={tpl.id} className="group hover:bg-gray-50/80 transition-all cursor-default">
                  <td className="px-8 py-5">
                    <div>
                      <p className="text-xs font-bold text-gray-800">{tpl.name}</p>
                      <p className="text-[9px] text-gray-400 font-medium truncate max-w-[180px]">{tpl.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100 uppercase tracking-tighter">
                      {tpl.pattern}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-xs font-black text-gray-700 tabular-nums">{tpl.cycleDays}d</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-1">
                      {tpl.shifts.map(s => (
                        <div key={s} className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-black ${SHIFT_COLORS[s as ShiftCode]}`}>
                          {s}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-lg text-xs font-black text-gray-500 tabular-nums">
                      <Users size={12} /> {tpl.teamCount}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      tpl.status === 'ACTIVE' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                      {tpl.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1  transition-all">
                      <button className="p-2 text-gray-400 hover:text-[#3E3B6F] hover:bg-white rounded-lg transition-all shadow-none"><RefreshCcw size={16}/></button>
                      <button className="p-2 text-gray-300 hover:text-gray-600"><MoreVertical size={16}/></button>
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
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[95vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center text-white shadow-lg">
                    <Layers size={20} />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-gray-800">Design Roster Template</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Visual Pattern Builder</p>
                 </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400"><X size={24}/></button>
            </div>

            <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
               {/* BASIC INFO */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Template Name *</label>
                        <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none" placeholder="e.g. 24/7 Security Rotation" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</label>
                        <textarea className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none min-h-[80px]" placeholder="Explain the coverage logic..." />
                     </div>
                  </div>
                  <div className="space-y-6 bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100 h-fit">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#3E3B6F] uppercase tracking-widest">Cycle Strategy</label>
                        <div className="flex items-center gap-2 p-1 bg-white border border-indigo-100 rounded-xl">
                           <button onClick={() => setIsRotating(false)} className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all ${!isRotating ? 'bg-[#3E3B6F] text-white shadow-md' : 'text-gray-400'}`}>FIXED</button>
                           <button onClick={() => setIsRotating(true)} className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all ${isRotating ? 'bg-[#3E3B6F] text-white shadow-md' : 'text-gray-400'}`}>ROTATING</button>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#3E3B6F] uppercase tracking-widest">Cycle Length (Days)</label>
                        <input type="number" value={cycleLength} onChange={(e) => setCycleLength(Number(e.target.value))} className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-2 text-sm font-black text-[#3E3B6F]" />
                     </div>
                  </div>
               </div>

               {/* PATTERN BUILDER */}
               <div className="space-y-6 pt-4">
                  <div className="flex items-center justify-between">
                     <h4 className="text-xs font-black text-gray-800 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Clock size={16} /> Pattern Sequence
                     </h4>
                     <div className="flex gap-4">
                        {['M', 'E', 'N', 'F', 'OFF'].map(c => (
                          <div key={c} className="flex items-center gap-1.5">
                             <div className={`w-4 h-4 rounded shadow-sm border border-black/5 ${SHIFT_COLORS[c as ShiftCode]}`}></div>
                             <span className="text-[9px] font-black text-gray-400">{c}</span>
                          </div>
                        ))}
                     </div>
                  </div>

                  {!isRotating ? (
                    <div className="bg-gray-50 rounded-3xl border border-gray-100 p-6 flex flex-wrap gap-2 animate-in slide-in-from-left-4 duration-300">
                       {Array.from({ length: cycleLength }).map((_, i) => (
                         <div key={i} className="space-y-2">
                            <p className="text-[8px] font-black text-gray-400 text-center uppercase">Day {i + 1}</p>
                            <button className={`w-12 h-12 rounded-xl flex items-center justify-center text-xs font-black shadow-sm transition-all hover:scale-105 active:scale-95 ${i < 5 ? SHIFT_COLORS['M'] : SHIFT_COLORS['OFF']}`}>
                               {i < 5 ? 'M' : 'OFF'}
                            </button>
                         </div>
                       ))}
                       <button className="w-12 h-12 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 hover:border-[#3E3B6F] hover:text-[#3E3B6F] transition-all mt-4 ml-2">
                          <Plus size={16} />
                       </button>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                       <div className="overflow-x-auto rounded-3xl border border-gray-200 bg-white">
                          <table className="w-full text-left">
                             <thead>
                                <tr className="bg-gray-50/80 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                                   <th className="px-6 py-3 border-r border-gray-100">Week</th>
                                   {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <th key={d} className="px-6 py-3 text-center">{d}</th>)}
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-gray-50">
                                {[1, 2, 3].map(w => (
                                  <tr key={w}>
                                     <td className="px-6 py-4 border-r border-gray-100 text-[10px] font-black text-[#3E3B6F] tabular-nums">W{w}</td>
                                     {['M','M','M','M','M','OFF','OFF'].map((s, i) => {
                                       const actualShift = w === 1 ? 'M' : w === 2 ? 'E' : 'N';
                                       const isOff = i >= 5;
                                       const shift = isOff ? 'OFF' : actualShift;
                                       return (
                                         <td key={i} className="px-1 py-2 text-center">
                                            <div className={`mx-auto w-10 h-10 rounded-lg flex items-center justify-center text-[10px] font-black shadow-sm cursor-pointer hover:scale-105 transition-transform ${SHIFT_COLORS[shift as ShiftCode]}`}>
                                               {shift}
                                            </div>
                                         </td>
                                       )
                                     })}
                                  </tr>
                                ))}
                             </tbody>
                          </table>
                       </div>
                    </div>
                  )}
               </div>

               {/* TEAMS & ROTATION */}
               {isRotating && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    <div className="space-y-4">
                       <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                          <Users size={16} className="text-indigo-500" /> Team Allocation
                       </h4>
                       <div className="p-6 bg-gray-50 rounded-3xl border border-gray-200 space-y-4">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase">Number of Teams</label>
                             <div className="flex items-center gap-4">
                                <input type="number" defaultValue="3" className="w-20 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-black text-[#3E3B6F]" />
                                <div className="flex -space-x-2">
                                   {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-indigo-200 border-2 border-white flex items-center justify-center text-[9px] font-black text-indigo-700 uppercase">T{i}</div>)}
                                </div>
                             </div>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase">Rotation Direction</label>
                             <div className="flex gap-2">
                                <button className="flex-1 py-2 bg-white border-2 border-[#3E3B6F] text-[#3E3B6F] rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2">
                                   <ArrowRight size={14} /> Forward
                                </button>
                                <button className="flex-1 py-2 bg-white border border-gray-200 text-gray-400 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2">
                                   <ArrowRightLeft size={14} /> Backward
                                </button>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                          <Zap size={16} className="text-yellow-500" /> Pattern Insights
                       </h4>
                       <div className="p-6 bg-[#3E3B6F] rounded-3xl text-white relative overflow-hidden h-full">
                          <div className="relative z-10 space-y-3">
                             <div className="flex justify-between text-[10px] font-bold text-white/60"><span>Coverage Pattern:</span> <span>24/7 Continuity</span></div>
                             <div className="flex justify-between text-[10px] font-bold text-white/60"><span>Weekend Equity:</span> <span>High (Rotational)</span></div>
                             <div className="flex justify-between text-[10px] font-bold text-white/60"><span>Rest Compliance:</span> <span className="text-green-400">PASSED ✓</span></div>
                             <div className="pt-2 border-t border-white/10 mt-2">
                                <p className="text-[11px] leading-relaxed text-white/80 italic font-medium">"This 3-week rotation ensures every team gets a full weekend off once every 21 days."</p>
                             </div>
                          </div>
                          <ShieldCheck size={80} className="absolute -right-4 -bottom-4 opacity-10" />
                       </div>
                    </div>
                 </div>
               )}

               <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex gap-3">
                  <Info size={20} className="text-indigo-500 shrink-0" />
                  <p className="text-[10px] text-indigo-700 leading-relaxed font-medium">
                    Templates define the <span className="font-bold">Skeleton of the Roster</span>. Once published, you can assign these templates to departments or sites where the actual dates will be populated.
                  </p>
               </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4 shrink-0">
               <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-white border border-gray-200 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">
                 Discard
               </button>
               <button className="flex-[2] py-4 bg-[#3E3B6F] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                 <CheckCircle2 size={16} /> Save Template
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
