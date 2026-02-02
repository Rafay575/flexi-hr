
import React, { useState, useMemo } from 'react';
import { 
  X, 
  Save, 
  CheckCircle2, 
  Clock, 
  Coffee, 
  ShieldCheck, 
  TrendingUp, 
  Calendar, 
  AlertTriangle,
  Moon,
  Sun,
  Zap,
  LayoutGrid,
  Plus,
  Trash2,
  Info,
  ArrowRight,
  ChevronRight,
  Settings2,
  // Renaming History to HistoryIcon to avoid conflict with window.History
  History as HistoryIcon
} from 'lucide-react';

type ShiftType = 'FIXED' | 'FLEXI' | 'ROTATING' | 'SPLIT' | 'RAMZAN';
type TabId = 'basic' | 'timing' | 'breaks' | 'grace' | 'ot' | 'days';

export const ShiftTemplateForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<TabId>('basic');
  const [shiftType, setShiftType] = useState<ShiftType>('FIXED');

  // Form State
  const [formData, setFormData] = useState({
    code: 'MORN',
    name: 'Morning General',
    description: 'Standard morning shift for head office operations.',
    startTime: '09:00',
    endTime: '18:00',
    flexiRequiredHours: 8,
    flexiWindowStart: '07:00',
    flexiWindowEnd: '20:00',
    graceIn: 15,
    graceOut: 15,
    otAllowed: true,
    otThreshold: 30,
    fridayOverride: true,
    friBreakStart: '12:30',
    friBreakEnd: '14:30',
  });

  const [breaks, setBreaks] = useState([
    { id: '1', name: 'Lunch Break', start: '13:00', end: '14:00', type: 'UNPAID', autoDeduct: true }
  ]);

  const addBreak = () => {
    setBreaks([...breaks, { id: Date.now().toString(), name: 'New Break', start: '12:00', end: '12:30', type: 'UNPAID', autoDeduct: false }]);
  };

  const removeBreak = (id: string) => {
    setBreaks(breaks.filter(b => b.id !== id));
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-hidden bg-[#F5F5F5]">
      {/* HEADER */}
      <div className="bg-white px-8 py-6 border-b border-gray-200 flex justify-between items-center shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-gradient rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Settings2 size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Create Shift Template</h2>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-black uppercase tracking-widest border border-blue-100">v1.0 (Draft)</span>
            </div>
            <p className="text-sm text-gray-500 font-medium">Define timing, policies, and exception rules</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all">Save Draft</button>
          <button className="px-8 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-105 active:scale-95 transition-all">Publish Policy</button>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-all"><X size={24} /></button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT NAV / FORM BODY */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* TAB NAV */}
          <div className="flex border-b border-gray-100 px-8 bg-gray-50/50 shrink-0 overflow-x-auto no-scrollbar">
            {[
              { id: 'basic', label: 'Basic Info' },
              { id: 'timing', label: 'Timing' },
              { id: 'breaks', label: 'Breaks' },
              { id: 'grace', label: 'Grace & Buffer' },
              { id: 'ot', label: 'Overtime' },
              { id: 'days', label: 'Days & Exceptions' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`px-6 py-4 text-xs font-bold whitespace-nowrap transition-all border-b-2 -mb-px ${
                  activeTab === tab.id 
                    ? 'border-[#3E3B6F] text-[#3E3B6F]' 
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB CONTENT */}
          <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
            <div className="max-w-3xl space-y-10 pb-20">
              
              {activeTab === 'basic' && (
                <section className="space-y-6 animate-in slide-in-from-left-4 duration-300">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Shift Code *</label>
                      <input 
                        type="text" 
                        value={formData.code} 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 focus:border-[#3E3B6F] outline-none" 
                        placeholder="MORN"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Display Name *</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 focus:border-[#3E3B6F] outline-none" 
                        placeholder="Morning Shift"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</label>
                    <textarea 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-[#3E3B6F]/5 focus:border-[#3E3B6F] outline-none min-h-[100px]"
                      defaultValue={formData.description}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Shift Category</label>
                    <div className="grid grid-cols-5 gap-3">
                      {(['FIXED', 'FLEXI', 'ROTATING', 'SPLIT', 'RAMZAN'] as ShiftType[]).map(type => (
                        <button
                          key={type}
                          onClick={() => setShiftType(type)}
                          className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                            shiftType === type 
                              ? 'border-[#3E3B6F] bg-[#3E3B6F]/5 shadow-inner' 
                              : 'border-gray-100 hover:border-gray-200 bg-white'
                          }`}
                        >
                          {type === 'FIXED' && <Sun size={20} className={shiftType === type ? 'text-[#3E3B6F]' : 'text-gray-400'} />}
                          {type === 'FLEXI' && <Zap size={20} className={shiftType === type ? 'text-[#3E3B6F]' : 'text-gray-400'} />}
                          {type === 'ROTATING' && <LayoutGrid size={20} className={shiftType === type ? 'text-[#3E3B6F]' : 'text-gray-400'} />}
                          {type === 'SPLIT' && <Settings2 size={20} className={shiftType === type ? 'text-[#3E3B6F]' : 'text-gray-400'} />}
                          {type === 'RAMZAN' && <Moon size={20} className={shiftType === type ? 'text-[#3E3B6F]' : 'text-gray-400'} />}
                          <span className={`text-[9px] font-black uppercase tracking-widest ${shiftType === type ? 'text-[#3E3B6F]' : 'text-gray-400'}`}>
                            {type}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {activeTab === 'timing' && (
                <section className="space-y-10 animate-in slide-in-from-left-4 duration-300">
                  {shiftType === 'FIXED' && (
                    <div className="space-y-8">
                       <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                          <Info className="text-blue-500 shrink-0" size={20} />
                          <p className="text-xs font-medium text-blue-700 leading-relaxed">
                            Fixed shifts require exact punch times. If the shift spans across midnight (e.g., 10 PM - 6 AM), the system will automatically allocate the hours to the start date.
                          </p>
                       </div>
                       <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Shift Start Time</label>
                            <input type="time" defaultValue="09:00" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 text-xl font-black text-[#3E3B6F] outline-none focus:ring-4 focus:ring-[#3E3B6F]/5" />
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Shift End Time</label>
                            <input type="time" defaultValue="18:00" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 text-xl font-black text-[#3E3B6F] outline-none focus:ring-4 focus:ring-[#3E3B6F]/5" />
                          </div>
                       </div>
                    </div>
                  )}

                  {shiftType === 'FLEXI' && (
                    <div className="space-y-8">
                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Earliest Punch-In (Window Start)</label>
                          <input type="time" defaultValue="07:00" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 text-xl font-black text-[#3E3B6F] outline-none" />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Latest Punch-Out (Window End)</label>
                          <input type="time" defaultValue="20:00" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 text-xl font-black text-[#3E3B6F] outline-none" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Net Working Hours Required</label>
                        <div className="flex items-center gap-4">
                          <input type="number" defaultValue="8" className="w-32 bg-white border border-gray-200 rounded-xl px-4 py-4 text-xl font-black text-[#3E3B6F] outline-none" />
                          <span className="text-lg font-bold text-gray-400">Hours per day</span>
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              )}

              {activeTab === 'breaks' && (
                <section className="space-y-8 animate-in slide-in-from-left-4 duration-300">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Defined Breaks</h4>
                    <button 
                      onClick={addBreak}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all"
                    >
                      <Plus size={14} /> Add Break
                    </button>
                  </div>

                  <div className="space-y-4">
                    {breaks.map((b) => (
                      <div key={b.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 group hover:border-[#3E3B6F]/20 transition-all">
                        <div className="flex-1 space-y-2 w-full">
                          <input 
                            type="text" 
                            defaultValue={b.name} 
                            className="bg-transparent text-sm font-black text-gray-800 outline-none border-b border-transparent focus:border-[#3E3B6F]" 
                          />
                          <div className="flex items-center gap-4">
                            <input type="time" defaultValue={b.start} className="bg-white px-3 py-2 rounded-lg border border-gray-100 text-xs font-bold" />
                            <ArrowRight size={14} className="text-gray-300" />
                            <input type="time" defaultValue={b.end} className="bg-white px-3 py-2 rounded-lg border border-gray-100 text-xs font-bold" />
                          </div>
                        </div>
                        <div className="flex items-center gap-6 shrink-0">
                          <div className="flex flex-col items-center gap-2">
                             <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Auto Deduct</label>
                             <div className="w-10 h-5 bg-[#3E3B6F] rounded-full relative p-1 cursor-pointer">
                                <div className="w-3 h-3 bg-white rounded-full absolute right-1"></div>
                             </div>
                          </div>
                          <button 
                            onClick={() => removeBreak(b.id)}
                            className="p-3 bg-white border border-gray-200 text-red-500 rounded-xl hover:bg-red-50 transition-all "
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-8 border-t border-gray-100 space-y-4">
                     <div className="flex items-center justify-between p-4 bg-[#E8B4A0]/10 rounded-2xl border border-[#E8B4A0]/30">
                        <div className="flex items-center gap-3">
                           <Calendar size={18} className="text-[#3E3B6F]" />
                           <div>
                             <p className="text-xs font-bold text-[#3E3B6F]">Friday Special Break Logic</p>
                             <p className="text-[10px] text-gray-500 font-medium">Extend break duration automatically for Jummah prayers.</p>
                           </div>
                        </div>
                        <div className="w-12 h-6 bg-gray-200 rounded-full relative p-1 cursor-pointer">
                           <div className="w-4 h-4 bg-white rounded-full"></div>
                        </div>
                     </div>
                  </div>
                </section>
              )}

              {activeTab === 'grace' && (
                <section className="space-y-10 animate-in slide-in-from-left-4 duration-300">
                   <div className="grid grid-cols-2 gap-10">
                      <div className="space-y-6">
                         <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Arrival Policies</h4>
                         <div className="space-y-4">
                            <div className="space-y-2">
                               <p className="text-xs font-bold text-gray-700">Grace In (Minutes)</p>
                               <input type="number" defaultValue="15" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 font-bold" />
                            </div>
                            <div className="space-y-2">
                               <p className="text-xs font-bold text-gray-700">Early Punch Buffer (Minutes)</p>
                               <input type="number" defaultValue="30" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 font-bold" />
                               <p className="text-[9px] text-gray-400 italic font-medium">Punching within this buffer won't count as OT.</p>
                            </div>
                         </div>
                      </div>
                      <div className="space-y-6">
                         <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Departure Policies</h4>
                         <div className="space-y-4">
                            <div className="space-y-2">
                               <p className="text-xs font-bold text-gray-700">Grace Out (Minutes)</p>
                               <input type="number" defaultValue="15" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 font-bold" />
                            </div>
                            <div className="space-y-2">
                               <p className="text-xs font-bold text-gray-700">Late Punch Buffer (Minutes)</p>
                               <input type="number" defaultValue="15" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 font-bold" />
                            </div>
                         </div>
                      </div>
                   </div>
                </section>
              )}

              {activeTab === 'ot' && (
                <section className="space-y-8 animate-in slide-in-from-left-4 duration-300">
                  <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                        <TrendingUp size={24} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-gray-800">Overtime Eligibility</h4>
                        <p className="text-xs text-gray-500 font-medium italic">Allow the system to track and calculate OT for this shift.</p>
                      </div>
                    </div>
                    <div className="w-14 h-7 bg-green-500 rounded-full relative p-1 cursor-pointer shadow-inner">
                      <div className="w-5 h-5 bg-white rounded-full absolute right-1 shadow-md"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 pt-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Min. Duration to trigger OT</label>
                        <div className="flex items-center gap-3">
                           <input type="number" defaultValue="30" className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 font-bold" />
                           <span className="text-xs font-bold text-gray-400 uppercase">Mins</span>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Max Allowed Daily OT</label>
                        <div className="flex items-center gap-3">
                           <input type="number" defaultValue="4" className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 font-bold" />
                           <span className="text-xs font-bold text-gray-400 uppercase">Hours</span>
                        </div>
                     </div>
                  </div>

                  <div className="pt-8 border-t border-gray-100">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Pay Multipliers</h4>
                    <div className="grid grid-cols-3 gap-4">
                       {[
                         { label: 'Weekday', multiplier: '1.5x' },
                         { label: 'Weekend', multiplier: '2.0x' },
                         { label: 'Holiday', multiplier: '2.5x' },
                       ].map(m => (
                         <div key={m.label} className="p-4 bg-white border border-gray-200 rounded-2xl text-center group hover:border-[#3E3B6F] transition-all">
                            <p className="text-[10px] font-black text-gray-400 uppercase mb-2">{m.label}</p>
                            <p className="text-xl font-black text-[#3E3B6F]">{m.multiplier}</p>
                         </div>
                       ))}
                    </div>
                  </div>
                </section>
              )}

              {activeTab === 'days' && (
                <section className="space-y-10 animate-in slide-in-from-left-4 duration-300">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Weekdays</label>
                      <div className="flex gap-2">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                          <button 
                            key={d} 
                            className={`flex-1 py-3 rounded-xl text-xs font-black transition-all border ${
                              ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(d) 
                                ? 'bg-[#3E3B6F] text-white border-transparent shadow-lg' 
                                : 'bg-white text-gray-400 border-gray-200 hover:border-[#3E3B6F]/30'
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                   </div>

                   <div className="p-6 bg-[#3E3B6F] rounded-3xl text-white relative overflow-hidden group">
                      <div className="relative z-10 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-[#E8D5A3]">
                               <Moon size={24} />
                            </div>
                            <div>
                               <h4 className="text-sm font-black uppercase tracking-widest">Ramzan Period Exceptions</h4>
                               <p className="text-[10px] text-white/60 font-medium">Automatic timing adjustment during effective dates.</p>
                            </div>
                         </div>
                         <button className="px-6 py-2 bg-white text-[#3E3B6F] rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                            Configure Period
                         </button>
                      </div>
                      <BarChart2 size={120} className="absolute -right-6 -bottom-6 text-white/5" />
                   </div>
                </section>
              )}

            </div>
          </div>
        </div>

        {/* RIGHT PREVIEW PANEL */}
        <div className="w-[380px] bg-gray-50 border-l border-gray-200 flex flex-col overflow-hidden shadow-2xl z-10 shrink-0">
           <div className="p-8 border-b border-gray-100 bg-white shrink-0">
              <h3 className="text-[10px] font-black text-[#3E3B6F] uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                <LayoutGrid size={16} /> Visual Timeline Preview
              </h3>

              <div className="relative pt-12 pb-8">
                 <div className="h-6 w-full bg-gray-100 rounded-full relative overflow-hidden flex items-center">
                    {/* Shift Blocks */}
                    <div className="absolute inset-y-0 left-[20%] w-[60%] bg-[#3E3B6F]/80 rounded-full group">
                        <div className="absolute -top-8 left-0 text-[10px] font-bold text-gray-400">09:00 AM</div>
                        <div className="absolute -top-8 right-0 text-[10px] font-bold text-gray-400">06:00 PM</div>
                    </div>
                    {/* Break Block */}
                    <div className="absolute inset-y-0 left-[45%] w-[10%] bg-[#E8D5A3] opacity-80 border-x border-white/20">
                    </div>
                 </div>
                 
                 <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                       <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Duration</p>
                       <p className="text-xl font-black text-gray-800 tabular-nums">9h 00m</p>
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Work Hours</p>
                       <p className="text-xl font-black text-[#3E3B6F] tabular-nums">8h 00m</p>
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Unpaid Break</p>
                       <p className="text-xl font-black text-gray-800 tabular-nums">1h 00m</p>
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest mb-1">OT Threshold</p>
                       <p className="text-xl font-black text-orange-600 tabular-nums">8h 30m</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                   <ShieldCheck size={14} /> Rule Summary
                 </h4>
                 <div className="space-y-2">
                    {[
                      { icon: <CheckCircle2 size={12} />, text: 'Auto-Midnight detection: OFF' },
                      { icon: <CheckCircle2 size={12} />, text: 'Late-entry penalty: ACTIVE' },
                      { icon: <CheckCircle2 size={12} />, text: 'Early-punch rounding: 15m' },
                      { icon: <AlertTriangle size={12} />, text: 'Friday break override: ENABLED', alert: true },
                    ].map((rule, i) => (
                      <div key={i} className={`flex items-center gap-2 text-[11px] font-bold ${rule.alert ? 'text-orange-600' : 'text-gray-600'}`}>
                         {rule.icon} {rule.text}
                      </div>
                    ))}
                 </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                       <ShieldCheck size={18} />
                    </div>
                    <p className="text-xs font-black text-gray-800 uppercase tracking-widest">Compliance Audit</p>
                 </div>
                 <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                   This shift template complies with <span className="text-green-600 font-bold underline decoration-green-200">Local Labor Law Section 42-A</span> regarding mandatory meal breaks and maximum weekly working hours (48h).
                 </p>
              </div>

              <div className="p-6 bg-[#3E3B6F]/5 border border-[#3E3B6F]/10 rounded-3xl">
                 <div className="flex gap-4">
                    {/* Fixed: Use HistoryIcon alias here */}
                    <HistoryIcon className="text-[#3E3B6F] shrink-0" size={18} />
                    <div>
                       <p className="text-xs font-bold text-[#3E3B6F] mb-1">Version Control</p>
                       <p className="text-[10px] text-gray-600 font-medium">Created by Jane Doe (HR Admin)</p>
                       <p className="text-[10px] text-gray-400 mt-1 italic">Last Modified: Jan 10, 2025</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const BarChart2: React.FC<{ size: number, className: string }> = ({ size, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);
