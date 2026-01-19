
import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Settings2, 
  ChevronDown, 
  Plus, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Building2,
  Users,
  Search,
  X,
  ArrowRight,
  Info,
  History
} from 'lucide-react';

type SatStatus = 'WORKING' | 'OFF';
type SatPattern = 'ALL_WORKING' | 'ALL_OFF' | 'ALT_1_3_WORKING' | 'ALT_2_4_WORKING' | 'CUSTOM';

interface SaturdayRecord {
  date: string;
  satNumber: number; // 1 to 5 within the month
  status: SatStatus;
  override?: {
    status: SatStatus;
    reason: string;
  };
}

const MOCK_OVERRIDES: Record<string, { status: SatStatus; reason: string }> = {
  '2025-02-01': { status: 'OFF', reason: 'Annual Shutdown' },
  '2025-08-16': { status: 'OFF', reason: 'Extended Independence Holiday' },
};

export const AlternateSaturdayRules: React.FC = () => {
  const [year, setYear] = useState(2025);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [pattern, setPattern] = useState<SatPattern>('ALT_2_4_WORKING');

  // Logic to generate all Saturdays for the year
  const saturdays = useMemo(() => {
    const list: SaturdayRecord[] = [];
    const date = new Date(year, 0, 1);
    
    // Find first Saturday
    while (date.getDay() !== 6) {
      date.setDate(date.getDate() + 1);
    }

    while (date.getFullYear() === year) {
      const dateStr = date.toISOString().split('T')[0];
      const dayOfMonth = date.getDate();
      const satNumber = Math.ceil(dayOfMonth / 7);
      
      // Calculate status based on pattern
      let status: SatStatus = 'WORKING';
      if (pattern === 'ALL_OFF') status = 'OFF';
      else if (pattern === 'ALT_1_3_WORKING') {
        status = (satNumber === 1 || satNumber === 3 || satNumber === 5) ? 'WORKING' : 'OFF';
      } else if (pattern === 'ALT_2_4_WORKING') {
        status = (satNumber === 2 || satNumber === 4) ? 'WORKING' : 'OFF';
      }

      list.push({
        date: dateStr,
        satNumber,
        status,
        override: MOCK_OVERRIDES[dateStr]
      });
      date.setDate(date.getDate() + 7);
    }
    return list;
  }, [year, pattern]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <Settings2 className="text-[#3E3B6F]" size={28} /> Alternate Saturday Rules
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Configure weekend work cycles and roster exceptions</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-600 outline-none shadow-sm focus:ring-4 focus:ring-[#3E3B6F]/5"
          >
            <option value={2024}>Year: 2024</option>
            <option value={2025}>Year: 2025</option>
            <option value={2026}>Year: 2026</option>
          </select>
          <button 
            onClick={() => setIsConfigOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Settings2 size={18} /> Configure Rule
          </button>
        </div>
      </div>

      {/* CURRENT CONFIG SUMMARY */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
        <div className="p-8 border-b md:border-b-0 md:border-r border-gray-100 flex-1 space-y-4 bg-primary-gradient text-white relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12">
            <Calendar size={120} />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Active Configuration</p>
            <h3 className="text-xl font-bold mb-4">Alternate Saturday Pattern — {year}</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs">
                <div className="w-2 h-2 bg-[#E8D5A3] rounded-full"></div>
                <span className="font-medium text-white/80">Pattern: <span className="font-bold text-white">Every 2nd & 4th Saturday OFF</span></span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="font-medium text-white/80">Working: <span className="font-bold text-white">1st, 3rd & 5th Saturdays</span></span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-8 flex-1 grid grid-cols-2 gap-6 items-center">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Scope</p>
            <div className="flex items-center gap-2">
              <Users size={16} className="text-[#3E3B6F]" />
              <span className="text-sm font-bold text-gray-800">450 Employees</span>
            </div>
            <p className="text-[10px] text-gray-500 font-medium">Head Office & Support Staff</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rule Exceptions</p>
            <div className="flex items-center gap-2">
              <Building2 size={16} className="text-orange-500" />
              <span className="text-sm font-bold text-gray-800">Factory Site</span>
            </div>
            <p className="text-[10px] text-gray-500 font-medium">Always Working</p>
          </div>
        </div>
      </div>

      {/* SATURDAY CALENDAR TABLE */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
            <Calendar className="text-[#3E3B6F]" size={16} /> Annual Saturday Roster
          </h3>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1.5">
               <div className="w-2 h-2 rounded-full bg-green-500"></div>
               <span className="text-[9px] font-black text-gray-400 uppercase">Working</span>
             </div>
             <div className="flex items-center gap-1.5">
               <div className="w-2 h-2 rounded-full bg-gray-300"></div>
               <span className="text-[9px] font-black text-gray-400 uppercase">Off</span>
             </div>
          </div>
        </div>
        <div className="overflow-x-auto custom-scrollbar max-h-[600px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-20 bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
              <tr>
                <th className="px-8 py-4">Date</th>
                <th className="px-6 py-4">Occurrence</th>
                <th className="px-6 py-4 text-center">System Status</th>
                <th className="px-6 py-4">Override Policy</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {saturdays.map((sat) => {
                const finalStatus = sat.override ? sat.override.status : sat.status;
                const dateObj = new Date(sat.date);
                const monthName = dateObj.toLocaleString('default', { month: 'long' });
                
                return (
                  <tr key={sat.date} className={`group transition-all hover:bg-gray-50/80 ${sat.override ? 'bg-orange-50/20' : ''}`}>
                    <td className="px-8 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-gray-800 tabular-nums">
                          {dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="text-[9px] font-bold text-gray-400 uppercase">{monthName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black text-[#3E3B6F] bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                        {sat.satNumber}{sat.satNumber === 1 ? 'st' : sat.satNumber === 2 ? 'nd' : sat.satNumber === 3 ? 'rd' : 'th'} Saturday
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                         sat.status === 'WORKING' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                       }`}>
                         {sat.status}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                      {sat.override ? (
                        <div className="flex items-start gap-2">
                           <div className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${sat.override.status === 'WORKING' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                           <div className="flex flex-col">
                              <span className="text-[10px] font-black text-gray-800 uppercase tracking-tighter">Override to {sat.override.status}</span>
                              <span className="text-[9px] text-gray-500 font-medium italic">"{sat.override.reason}"</span>
                           </div>
                        </div>
                      ) : (
                        <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                          <button className="p-2 text-gray-400 hover:text-[#3E3B6F] hover:bg-white rounded-lg transition-all" title="Add Override"><Edit3 size={16}/></button>
                       </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CONFIG MODAL */}
      {isConfigOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsConfigOpen(false)}></div>
          <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center text-white shadow-lg">
                    <Settings2 size={20} />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-gray-800">Saturday Policy Builder</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Configuration Wizard</p>
                 </div>
              </div>
              <button onClick={() => setIsConfigOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400"><X size={24}/></button>
            </div>

            <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
               {/* PATTERN SELECTION */}
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Working Pattern</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { id: 'ALL_WORKING', label: 'All Saturdays Working', icon: <CheckCircle2 size={16}/> },
                      { id: 'ALL_OFF', label: 'All Saturdays Off', icon: <XCircle size={16}/> },
                      { id: 'ALT_1_3_WORKING', label: '1st & 3rd Working', icon: <Info size={16}/> },
                      { id: 'ALT_2_4_WORKING', label: '2nd & 4th Working', icon: <Info size={16}/> },
                      { id: 'CUSTOM', label: 'Custom Pattern', icon: <Plus size={16}/> },
                    ].map(opt => (
                      <button 
                        key={opt.id}
                        onClick={() => setPattern(opt.id as SatPattern)}
                        className={`p-4 rounded-2xl border-2 transition-all text-left flex flex-col gap-3 ${pattern === opt.id ? 'border-[#3E3B6F] bg-[#3E3B6F]/5' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                      >
                        <div className={`${pattern === opt.id ? 'text-[#3E3B6F]' : 'text-gray-300'}`}>{opt.icon}</div>
                        <span className={`text-[11px] font-bold ${pattern === opt.id ? 'text-[#3E3B6F]' : 'text-gray-600'}`}>{opt.label}</span>
                      </button>
                    ))}
                  </div>
               </div>

               {/* SCOPE SELECTION */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Applied Scope</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none">
                       <option>All Employees</option>
                       <option>Head Office</option>
                       <option>Support Centers</option>
                       <option>Field Operations</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Calendar Year</label>
                    <input type="number" defaultValue={year} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none" />
                  </div>
               </div>

               {/* OVERRIDES SECTION */}
               <div className="space-y-4 pt-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Overrides</h4>
                    <button className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase bg-indigo-50 px-3 py-1.5 rounded-xl hover:bg-indigo-100 transition-all">
                       <Plus size={14} /> Add Override
                    </button>
                  </div>
                  <div className="space-y-2">
                     <div className="flex items-center justify-between p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-white border border-orange-200 flex items-center justify-center text-orange-600 text-[10px] font-black tabular-nums shadow-sm">
                             FEB 01
                           </div>
                           <div>
                              <p className="text-xs font-bold text-gray-800">Override: OFF</p>
                              <p className="text-[10px] text-gray-500 italic font-medium">Reason: Annual Shutdown Cycle</p>
                           </div>
                        </div>
                        <button className="text-gray-400 hover:text-red-500"><X size={16}/></button>
                     </div>
                  </div>
               </div>

               <div className="p-5 bg-[#E8D5A3]/10 border border-[#E8D5A3]/30 rounded-3xl flex gap-4">
                  <AlertCircle className="text-[#3E3B6F] shrink-0" size={20} />
                  <div>
                    <p className="text-xs font-bold text-[#3E3B6F] uppercase tracking-widest mb-1">Roster Impact</p>
                    <p className="text-[10px] text-gray-600 leading-relaxed font-medium">
                      Changing this policy will recalculate the expected work hours for all 450 targeted employees. Shift assignments for these dates will be updated automatically.
                    </p>
                  </div>
               </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4 shrink-0">
               <button onClick={() => setIsConfigOpen(false)} className="flex-1 py-3 bg-white border border-gray-200 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">
                 Discard Changes
               </button>
               <button className="flex-[2] py-3 bg-[#3E3B6F] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all">
                 Apply Global Policy
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
