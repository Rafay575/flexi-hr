
import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Plus, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  Download, 
  MapPin, 
  Calendar,
  Save,
  MoreVertical,
  LucideProps,
  // Added Clock and Info icons
  Clock,
  Info
} from 'lucide-react';

interface TimeSlot {
  label: string;
  key: string;
}

const TIME_SLOTS: TimeSlot[] = [
  { label: '06:00 - 09:00', key: '6-9' },
  { label: '09:00 - 12:00', key: '9-12' },
  { label: '12:00 - 15:00', key: '12-15' },
  { label: '15:00 - 18:00', key: '15-18' },
  { label: '18:00 - 21:00', key: '18-21' },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const DemandGrid: React.FC = () => {
  const [activeSite, setActiveSite] = useState('Office HQ');
  const [demand, setDemand] = useState<Record<string, Record<string, number>>>(() => {
    const init: Record<string, Record<string, number>> = {};
    TIME_SLOTS.forEach(slot => {
      init[slot.key] = {};
      DAYS.forEach((day, i) => {
        init[slot.key][day] = i < 5 ? (slot.key === '9-12' || slot.key === '12-15' ? 5 : 3) : (i === 5 ? 2 : 0);
      });
    });
    return init;
  });

  // Mock scheduled data to show gaps
  const scheduled = useMemo(() => {
    const data: Record<string, Record<string, number>> = {};
    TIME_SLOTS.forEach(slot => {
      data[slot.key] = {};
      DAYS.forEach(day => {
        data[slot.key][day] = demand[slot.key][day] - (Math.random() > 0.7 ? 1 : 0) + (Math.random() > 0.9 ? 1 : 0);
      });
    });
    return data;
  }, [demand]);

  const updateDemand = (slot: string, day: string, val: string) => {
    const num = parseInt(val) || 0;
    setDemand(prev => ({
      ...prev,
      [slot]: { ...prev[slot], [day]: num }
    }));
  };

  const getGapStatus = (req: number, sch: number) => {
    const diff = sch - req;
    if (diff < 0) return { label: `${diff}`, color: 'text-red-600 bg-red-50 border-red-100', icon: <AlertTriangle size={10} /> };
    if (diff === 0) return { label: '0', color: 'text-green-600 bg-green-50 border-green-100', icon: <CheckCircle2 size={10} /> };
    return { label: `+${diff}`, color: 'text-blue-600 bg-blue-50 border-blue-100', icon: <TrendingUp size={10} /> };
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <BarChart3 className="text-[#3E3B6F]" size={28} /> Demand Planning
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Define headcount requirements and identify staffing gaps</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            <button className="px-4 py-2 text-xs font-bold text-gray-600 flex items-center gap-2 hover:bg-gray-50 rounded-lg">
              <Calendar size={14} /> Jan 13 - 19
            </button>
            <div className="h-4 w-px bg-gray-100 my-auto mx-1"></div>
            <select 
              value={activeSite}
              onChange={(e) => setActiveSite(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#3E3B6F] px-4 py-2 outline-none cursor-pointer"
            >
              <option>Office HQ</option>
              <option>Warehouse A</option>
              <option>Retail Hub</option>
            </select>
          </div>
          <button className="p-2.5 bg-white border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50 shadow-sm transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* DEMAND GRID */}
        <div className="xl:col-span-3 bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
              <Users size={16} className="text-[#3E3B6F]" /> Required Headcount Matrix
            </h3>
            <div className="flex gap-2">
              <button className="px-4 py-1.5 bg-white border border-gray-200 text-gray-500 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all">Copy Last Week</button>
              <button className="px-4 py-1.5 bg-[#3E3B6F] text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md hover:opacity-90 transition-all">Save Changes</button>
            </div>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/30 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  <th className="px-8 py-5 min-w-[180px]">Time Slot</th>
                  {DAYS.map(day => (
                    <th key={day} className="px-6 py-5 text-center">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {TIME_SLOTS.map((slot) => (
                  <tr key={slot.key} className="hover:bg-gray-50/50 transition-all">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                          {/* Clock icon fixed: imported above */}
                          <Clock size={16} />
                        </div>
                        <span className="text-xs font-black text-gray-800">{slot.label}</span>
                      </div>
                    </td>
                    {DAYS.map(day => (
                      <td key={day} className="px-4 py-5 text-center">
                        <input 
                          type="number" 
                          min="0"
                          value={demand[slot.key][day]}
                          onChange={(e) => updateDemand(slot.key, day, e.target.value)}
                          className={`w-12 h-10 text-center rounded-xl text-sm font-black border-2 transition-all outline-none ${
                            demand[slot.key][day] === 0 ? 'bg-gray-50 border-gray-100 text-gray-300' : 'bg-white border-[#3E3B6F]/10 text-[#3E3B6F] focus:border-[#3E3B6F]'
                          }`}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-center gap-3">
             {/* Info icon fixed: imported above */}
             <Info size={14} className="text-indigo-400" />
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter italic">Values indicate the minimum number of staff required per slot.</p>
          </div>
        </div>

        {/* COVERAGE SIDEBAR */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-md overflow-hidden flex flex-col h-fit">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
               <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Coverage Delta</h3>
               <span className="text-[9px] font-black text-indigo-600 uppercase tabular-nums">Jan 13 (Mon)</span>
            </div>
            
            <div className="p-2 divide-y divide-gray-50">
               {TIME_SLOTS.map(slot => {
                 const req = demand[slot.key]['Mon'];
                 const sch = scheduled[slot.key]['Mon'];
                 const gap = getGapStatus(req, sch);
                 return (
                   <div key={slot.key} className="p-4 flex items-center justify-between group hover:bg-gray-50/80 transition-all rounded-2xl">
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-gray-400 uppercase leading-none">{slot.label}</p>
                         <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                               <span className="text-[8px] font-bold text-gray-400 uppercase">Req</span>
                               <span className="text-xs font-black text-gray-800 tabular-nums">{req}</span>
                            </div>
                            <div className="w-px h-6 bg-gray-100"></div>
                            <div className="flex flex-col">
                               <span className="text-[8px] font-bold text-gray-400 uppercase">Sch</span>
                               <span className="text-xs font-bold text-gray-600 tabular-nums">{sch}</span>
                            </div>
                         </div>
                      </div>
                      <div className={`px-3 py-1 rounded-lg border text-xs font-black flex items-center gap-1.5 transition-transform group-hover:scale-105 ${gap.color}`}>
                         {gap.icon}
                         {gap.label}
                      </div>
                   </div>
                 );
               })}
            </div>

            <div className="p-4 bg-[#3E3B6F] text-white space-y-4">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-xl">
                    <Zap size={18} className="text-[#E8D5A3]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-widest leading-none mb-1">Gap Detection</p>
                    <p className="text-xs font-bold tracking-tight">3 Staff shortages identified this week.</p>
                  </div>
               </div>
               <button className="w-full py-3 bg-[#E8D5A3] text-[#3E3B6F] rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                  Create Open Shifts for Gaps
               </button>
            </div>
          </div>

          <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-3xl space-y-4 shadow-sm group">
             <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest flex items-center gap-2">
                   <TrendingUp size={16} /> Roster Optimizer
                </h4>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
             </div>
             <p className="text-[11px] text-indigo-700/80 leading-relaxed font-medium">
               The AI engine can re-distribute 12 flexible shifts to perfectly match your 9 AM peak demand.
             </p>
             <button className="w-full py-2 bg-white border border-indigo-200 text-[#3E3B6F] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
               Apply Optimization
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
