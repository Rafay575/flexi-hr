import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Users, 
  Plus, 
  Save, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  MoreVertical, 
  ArrowRightLeft, 
  Lock, 
  Bell, 
  Zap, 
  X,
  Clock,
  Download,
  ShieldCheck,
  Eye,
  Settings2,
  LucideProps
} from 'lucide-react';
import { Employee, ShiftCode, ShiftStyle } from './types';

interface RosterPlannerProps {
  employees: Employee[]; // Add this prop
}

const SHIFT_CONFIG: Record<ShiftCode, ShiftStyle> = {
  M: { label: 'Morning', bg: 'bg-blue-500', text: 'text-white' },
  E: { label: 'Evening', bg: 'bg-green-500', text: 'text-white' },
  N: { label: 'Night', bg: 'bg-purple-600', text: 'text-white' },
  F: { label: 'Flexi', bg: 'bg-teal-500', text: 'text-white' },
  OFF: { label: 'Off Day', bg: 'bg-gray-100', text: 'text-gray-400' },
  H: { label: 'Holiday', bg: 'bg-violet-100', text: 'text-violet-600', border: 'border-violet-200' },
  L: { label: 'Leave', bg: 'bg-white', text: 'text-blue-600', border: 'border-2 border-blue-500 border-dashed' },
};

// Remove the hardcoded EMPLOYEES array since we'll get it from props

export const RosterPlanner: React.FC<RosterPlannerProps> = ({ employees: initialEmployees }) => {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [activeCell, setActiveCell] = useState<{ empId: string; day: number } | null>(null);

  // Mock schedule data for 14 days using the passed employees
  const [roster, setRoster] = useState<Record<string, Record<number, ShiftCode>>>(() => {
    const data: Record<string, Record<number, ShiftCode>> = {};
    initialEmployees.forEach(emp => {
      data[emp.id] = {};
      for (let d = 1; d <= 14; d++) {
        const isWeekend = d === 5 || d === 6 || d === 12 || d === 13;
        data[emp.id][d] = isWeekend ? 'OFF' : (['M', 'E', 'N', 'F'] as ShiftCode[])[Math.floor(Math.random() * 4)];
        if (d === 1) data[emp.id][d] = 'H';
        if (emp.id === 'FLX-089' && d === 4) data[emp.id][d] = 'L';
      }
    });
    return data;
  });

  const filteredEmployees = useMemo(() => 
    initialEmployees.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase())), 
  [initialEmployees, searchQuery]);

  const stats = useMemo(() => {
    const dayRoster = filteredEmployees.map(e => roster[e.id][selectedDay]);
    return {
      total: dayRoster.length,
      morning: dayRoster.filter(s => s === 'M').length,
      evening: dayRoster.filter(s => s === 'E').length,
      night: dayRoster.filter(s => s === 'N').length,
      flexi: dayRoster.filter(s => s === 'F').length,
      off: dayRoster.filter(s => s === 'OFF' || s === 'L' || s === 'H').length,
    };
  }, [roster, selectedDay, filteredEmployees]);

  const updateShift = (empId: string, day: number, code: ShiftCode) => {
    setRoster(prev => ({
      ...prev,
      [empId]: { ...prev[empId], [day]: code }
    }));
    setActiveCell(null);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-hidden">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <Calendar className="text-[#3E3B6F]" size={28} /> Roster Planner
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded uppercase tracking-widest">Draft Mode</span>
            <p className="text-sm text-gray-500 font-medium italic">Jan 01 — Jan 14, 2025 cycle</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input 
              type="text" 
              placeholder="Filter staff..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium w-48 focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-100 transition-all">
            <Zap size={14} /> Auto-Generate
          </button>
          <button 
            onClick={() => setIsPublishModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <ShieldCheck size={16} /> Publish Roster
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* PLANNER GRID */}
        <div className="flex-1 bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col overflow-hidden relative">
          <div className="overflow-auto custom-scrollbar flex-1">
            <table className="w-full border-separate border-spacing-0">
              <thead className="sticky top-0 z-30">
                <tr className="bg-gray-50/95 backdrop-blur shadow-sm">
                  <th className="sticky left-0 z-40 bg-gray-50 p-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest border-r border-b border-gray-100 min-w-[200px]">
                    Employee & Dept
                  </th>
                  {Array.from({ length: 14 }).map((_, i) => (
                    <th key={i} className={`p-3 text-center min-w-[60px] border-b border-r border-gray-100 ${selectedDay === (i+1) ? 'bg-[#3E3B6F]/5' : ''}`}>
                      <div className="text-[9px] font-bold text-gray-400 uppercase mb-1">Jan</div>
                      <div className={`text-xs font-black ${[5, 6, 12, 13].includes(i) ? 'text-red-400' : 'text-gray-700'}`}>{i + 1}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="sticky left-0 z-20 bg-white p-4 border-r border-b border-gray-100 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#3E3B6F]/5 flex items-center justify-center text-[10px] font-black text-[#3E3B6F] border border-[#3E3B6F]/10 shadow-sm shrink-0">
                        {emp.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate leading-none mb-1">{emp.name}</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter truncate">{emp.dept}</p>
                      </div>
                    </td>
                    {Array.from({ length: 14 }).map((_, i) => {
                      const day = i + 1;
                      const code = roster[emp.id][day];
                      const style = SHIFT_CONFIG[code];
                      const isActive = activeCell?.empId === emp.id && activeCell?.day === day;
                      
                      return (
                        <td 
                          key={day} 
                          className={`p-1.5 border-r border-b border-gray-50 relative group cursor-pointer ${selectedDay === day ? 'bg-[#3E3B6F]/5' : ''}`}
                          onClick={() => { setSelectedDay(day); setActiveCell({ empId: emp.id, day }); }}
                        >
                          <div className={`h-12 w-full rounded-xl transition-all flex items-center justify-center shadow-sm group-hover:scale-95 group-active:scale-90 font-black text-xs ${style.bg} ${style.text} ${style.border || ''}`}>
                            {code}
                          </div>

                          {/* QUICK EDIT DROPDOWN */}
                          {isActive && (
                            <div className="absolute top-full left-0 mt-2 w-32 bg-gray-900 text-white rounded-xl p-2 z-50 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                               <div className="grid grid-cols-2 gap-1">
                                  {Object.keys(SHIFT_CONFIG).map(c => (
                                    <button 
                                      key={c}
                                      onClick={(e) => { e.stopPropagation(); updateShift(emp.id, day, c as ShiftCode); }}
                                      className="py-2 text-[10px] font-black rounded-lg hover:bg-white/20 transition-colors border border-white/10"
                                    >
                                      {c}
                                    </button>
                                  ))}
                               </div>
                               <div className="absolute -top-1.5 left-4 w-3 h-3 bg-gray-900 rotate-45"></div>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* LEGEND FOOTER */}
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center gap-6 overflow-x-auto no-scrollbar">
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-r border-gray-200 pr-6 mr-0 shrink-0">Status Key:</span>
             {Object.entries(SHIFT_CONFIG).map(([code, style]) => (
               <div key={code} className="flex items-center gap-2 shrink-0">
                 <div className={`w-6 h-6 rounded-lg ${style.bg} ${style.text} flex items-center justify-center text-[10px] font-black border shadow-sm ${style.border || 'border-transparent'}`}>
                   {code}
                 </div>
                 <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{style.label}</span>
               </div>
             ))}
          </div>
        </div>

        {/* SIDEBAR - Rest of your RosterPlanner component remains the same */}
        {/* ... */}
      </div>

      {/* PUBLISH MODAL - Rest of your RosterPlanner component remains the same */}
      {/* ... */}
    </div>
  );
};

const PieChart: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
);