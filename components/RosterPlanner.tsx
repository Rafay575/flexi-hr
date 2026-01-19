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

type ShiftCode = 'M' | 'E' | 'N' | 'F' | 'OFF' | 'H' | 'L';

interface ShiftStyle {
  label: string;
  bg: string;
  text: string;
  border?: string;
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

interface Employee {
  id: string;
  name: string;
  avatar: string;
  dept: string;
}

const EMPLOYEES: Employee[] = [
  { id: 'FLX-001', name: 'Sarah Jenkins', avatar: 'SJ', dept: 'Engineering' },
  { id: 'FLX-024', name: 'Michael Chen', avatar: 'MC', dept: 'Engineering' },
  { id: 'FLX-112', name: 'Amara Okafor', avatar: 'AO', dept: 'Product' },
  { id: 'FLX-089', name: 'David Miller', avatar: 'DM', dept: 'Design' },
  { id: 'FLX-045', name: 'Elena Rodriguez', avatar: 'ER', dept: 'Operations' },
  { id: 'FLX-201', name: 'James Wilson', avatar: 'JW', dept: 'Operations' },
  { id: 'FLX-152', name: 'Priya Das', avatar: 'PD', dept: 'Engineering' },
  { id: 'FLX-304', name: 'Marcus Low', avatar: 'ML', dept: 'Design' },
  { id: 'FLX-012', name: 'Alex Rivera', avatar: 'AR', dept: 'Marketing' },
  { id: 'FLX-998', name: 'Nina Simone', avatar: 'NS', dept: 'HR' },
].concat(Array.from({ length: 10 }).map((_, i) => ({
  id: `FLX-EXT-${i}`,
  name: `Contractor ${i + 1}`,
  avatar: 'EX',
  dept: 'Operations'
})));

export const RosterPlanner: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [activeCell, setActiveCell] = useState<{ empId: string; day: number } | null>(null);

  // Mock schedule data for 14 days
  const [roster, setRoster] = useState<Record<string, Record<number, ShiftCode>>>(() => {
    const data: Record<string, Record<number, ShiftCode>> = {};
    EMPLOYEES.forEach(emp => {
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
    EMPLOYEES.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase())), 
  [searchQuery]);

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

        {/* SIDEBAR */}
        <div className="w-80 space-y-6 shrink-0">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black text-[#3E3B6F] uppercase tracking-[0.2em] flex items-center gap-2">
                <PieChart size={16} /> Day Analytics
              </h3>
              <span className="text-[11px] font-black text-gray-800 tabular-nums">Jan {selectedDay}</span>
            </div>

            <div className="space-y-4">
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
                 <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-indigo-700 uppercase">Site Coverage</span>
                    <span className="text-xs font-black text-indigo-900">{stats.total - stats.off} / {stats.total} Staff</span>
                 </div>
                 <div className="w-full bg-indigo-200 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${((stats.total - stats.off) / stats.total) * 100}%` }} />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                 {[
                   { label: 'Morning', val: stats.morning, icon: <Clock className="text-blue-500" /> },
                   { label: 'Evening', val: stats.evening, icon: <Clock className="text-green-500" /> },
                   { label: 'Night', val: stats.night, icon: <Clock className="text-purple-500" /> },
                   { label: 'Flexi', val: stats.flexi, icon: <Clock className="text-teal-500" /> },
                 ].map(s => (
                   <div key={s.label} className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         {/* Fixed: Use type assertion to cast ReactNode to ReactElement<LucideProps> for cloning with size prop */}
                         {React.cloneElement(s.icon as React.ReactElement<LucideProps>, { size: 12 })}
                         <span className="text-[10px] font-bold text-gray-500">{s.label}</span>
                      </div>
                      <span className="text-xs font-black text-gray-800 tabular-nums">{s.val}</span>
                   </div>
                 ))}
              </div>
            </div>
          </div>

          {/* CONFLICTS PANEL */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-red-50/30 flex justify-between items-center">
              <h3 className="text-xs font-black text-red-600 uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle size={16} /> Validation Errors
              </h3>
              <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">2</span>
            </div>
            
            <div className="p-2 space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
               <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100 space-y-2 group relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-orange-600 uppercase">Rest Period Violation</span>
                    <button className="text-orange-400 opacity-0 group-hover:opacity-100"><MoreVertical size={12} /></button>
                  </div>
                  <p className="text-xs font-bold text-gray-800">Michael Chen</p>
                  <p className="text-[10px] text-orange-800 leading-relaxed font-medium">Night shift on Jan 9 followed by Morning on Jan 10 ({"<"} 11h gap).</p>
                  <button className="text-[9px] font-black text-orange-600 uppercase underline decoration-orange-200 underline-offset-2">Auto-Resolve</button>
               </div>

               <div className="p-4 rounded-2xl bg-red-50 border border-red-100 space-y-2 group relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-red-600 uppercase">Conflict</span>
                    <button className="text-red-400 opacity-0 group-hover:opacity-100"><MoreVertical size={12} /></button>
                  </div>
                  <p className="text-xs font-bold text-gray-800">Elena Rodriguez</p>
                  <p className="text-[10px] text-red-800 leading-relaxed font-medium">Assigned Night Shift while on approved Annual Leave.</p>
                  <button className="text-[9px] font-black text-red-600 uppercase underline decoration-red-200 underline-offset-2">Switch to OFF</button>
               </div>
            </div>
          </div>

          <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-3xl flex gap-4">
             <div className="p-2 bg-white rounded-xl shadow-sm h-fit">
                <ShieldCheck size={20} className="text-indigo-600" />
             </div>
             <div className="flex-1">
                <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest mb-1">Compliance Check</h4>
                <p className="text-[10px] text-indigo-700/80 leading-relaxed font-medium">
                  Roster meets <span className="font-bold underline decoration-indigo-200">Local Labor Law Section 4</span> (Max 48h work week).
                </p>
             </div>
          </div>
        </div>
      </div>

      {/* PUBLISH MODAL */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsPublishModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center shrink-0">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center text-white shadow-lg shadow-[#3E3B6F]/20">
                    <ShieldCheck size={20} />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-gray-800">Finalize Roster</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">January 2025 • Phase 1</p>
                 </div>
               </div>
               <button onClick={() => setIsPublishModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400"><X size={24}/></button>
            </div>

            <div className="p-8 space-y-8">
               <div className="space-y-4">
                  <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-200 group hover:border-[#3E3B6F]/30 transition-all cursor-pointer">
                     <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-white rounded-xl shadow-sm text-[#3E3B6F]">
                           <Bell size={20} />
                        </div>
                        <div>
                           <p className="text-sm font-bold text-gray-800">Notify Employees</p>
                           <p className="text-[10px] text-gray-500 font-medium italic">Send push notifications & emails.</p>
                        </div>
                     </div>
                     <div className="w-12 h-6 bg-[#3E3B6F] rounded-full relative p-1 transition-all">
                        <div className="w-4 h-4 bg-white rounded-full absolute right-1"></div>
                     </div>
                  </div>

                  <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-200 group hover:border-[#3E3B6F]/30 transition-all cursor-pointer">
                     <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-white rounded-xl shadow-sm text-orange-500">
                           <Lock size={20} />
                        </div>
                        <div>
                           <p className="text-sm font-bold text-gray-800">Freeze Past Dates</p>
                           <p className="text-[10px] text-gray-500 font-medium italic">Lock records to prevent retro edits.</p>
                        </div>
                     </div>
                     <div className="w-12 h-6 bg-[#3E3B6F] rounded-full relative p-1 transition-all">
                        <div className="w-4 h-4 bg-white rounded-full absolute right-1"></div>
                     </div>
                  </div>
               </div>

               <div className="p-6 bg-green-50 border border-green-100 rounded-3xl space-y-3">
                  <div className="flex items-center gap-2 text-green-700">
                     <CheckCircle2 size={16} />
                     <span className="text-xs font-black uppercase tracking-widest">Roster Validated</span>
                  </div>
                  <p className="text-[11px] text-green-600 leading-relaxed font-medium">
                    All department coverage targets (Min 70%) are met. System has resolved 14 temporary shift overlaps automatically.
                  </p>
               </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4 shrink-0">
               <button onClick={() => setIsPublishModalOpen(false)} className="flex-1 py-4 bg-white border border-gray-200 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">
                 Review Errors
               </button>
               <button className="flex-[2] py-4 bg-[#3E3B6F] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                 Publish To Workforce <ChevronRight size={16} />
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PieChart: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
);