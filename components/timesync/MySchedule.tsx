
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Coffee, 
  Calendar as CalendarIcon, 
  RefreshCcw, 
  Info,
  Sun,
  Moon,
  Home,
  Palmtree,
  CalendarDays,
  ArrowRightLeft,
  CalendarCheck,
  Edit3,
  ChevronDown,
  LayoutGrid,
  Calendar as CalendarLucide
} from 'lucide-react';

type ViewMode = 'Week' | 'Month';

interface ScheduleEntry {
  id: string;
  date: Date;
  type: 'SHIFT' | 'WEEK_OFF' | 'HOLIDAY' | 'LEAVE';
  shiftName?: string;
  startTime?: string;
  endTime?: string;
  breakTime?: string;
  location?: string;
  methods?: string[];
  note?: string;
  indicators?: string[];
  specialShift?: 'RAMZAN' | 'SWAP_PENDING';
}

const MOCK_ENTRIES: ScheduleEntry[] = [
  {
    id: '1',
    date: new Date(2025, 0, 6),
    type: 'SHIFT',
    shiftName: 'Morning Shift',
    startTime: '9:00 AM',
    endTime: '6:00 PM',
    breakTime: '12:00 PM - 1:00 PM (60 min)',
    location: 'Office HQ',
    methods: ['Geo', 'Device']
  },
  {
    id: '2',
    date: new Date(2025, 0, 7),
    type: 'SHIFT',
    shiftName: 'Morning Shift',
    startTime: '9:00 AM',
    endTime: '6:00 PM',
    specialShift: 'RAMZAN',
    indicators: ['🌙 Ramzan Shift']
  },
  {
    id: '3',
    date: new Date(2025, 0, 8),
    type: 'LEAVE',
    note: 'Sick Leave Approved',
    indicators: ['📅 Leave Approved']
  },
  {
    id: '4',
    date: new Date(2025, 0, 9),
    type: 'SHIFT',
    shiftName: 'Morning Shift',
    startTime: '9:00 AM',
    endTime: '6:00 PM',
    specialShift: 'SWAP_PENDING',
    indicators: ['🔄 Shift Swap Pending']
  },
  {
    id: '5',
    date: new Date(2025, 0, 10),
    type: 'SHIFT',
    shiftName: 'Morning Shift (Friday)',
    startTime: '9:00 AM',
    endTime: '6:30 PM',
    breakTime: '12:30 PM - 2:30 PM (120 min)',
    note: 'Extended Friday prayer break',
    location: 'Office HQ'
  },
  {
    id: '6',
    date: new Date(2025, 0, 11),
    type: 'WEEK_OFF',
    shiftName: 'Weekly Off',
    note: 'Alternate Saturday (Off)'
  },
  {
    id: '7',
    date: new Date(2025, 0, 12),
    type: 'WEEK_OFF',
    shiftName: 'Weekly Off'
  }
];

export const MySchedule: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('Week');
  const [pivotDate, setPivotDate] = useState(new Date(2025, 0, 6));

  const weekDays = useMemo(() => {
    const days = [];
    const start = new Date(pivotDate);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const entry = MOCK_ENTRIES.find(e => e.date.toDateString() === d.toDateString());
      days.push({ date: d, entry });
    }
    return days;
  }, [pivotDate]);

  const handleNav = (direction: number) => {
    const next = new Date(pivotDate);
    if (viewMode === 'Week') {
      next.setDate(pivotDate.getDate() + (direction * 7));
    } else {
      next.setMonth(pivotDate.getMonth() + direction);
    }
    setPivotDate(next);
  };

  const jumpToThisWeek = () => {
    setPivotDate(new Date(2025, 0, 6));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">My Schedule</h2>
          <p className="text-sm text-gray-500 font-medium">Your upcoming shifts and availability periods</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white border border-gray-200 rounded-xl p-1 flex shadow-sm">
            {(['Week', 'Month'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  viewMode === mode ? 'bg-[#3E3B6F] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {mode === 'Week' ? <LayoutGrid size={14} /> : <CalendarLucide size={14} />}
                {mode}
              </button>
            ))}
          </div>
          
          <div className="flex items-center bg-white border border-gray-200 rounded-xl px-1 py-1 shadow-sm">
            <button onClick={() => handleNav(-1)} className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 text-xs font-bold text-[#3E3B6F] min-w-[150px] text-center">
              {viewMode === 'Week' 
                ? `${weekDays[0].date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — ${weekDays[6].date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                : pivotDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
              }
            </span>
            <button onClick={() => handleNav(1)} className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>

          <button 
            onClick={jumpToThisWeek}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-[#3E3B6F] hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2"
          >
            <CalendarDays size={14} /> This Week
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        {/* MAIN VIEW AREA */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* WEEK VIEW STRIP */}
          {viewMode === 'Week' && (
            <div className="grid grid-cols-7 gap-2 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm">
              {weekDays.map(({ date }, idx) => {
                const isSelected = date.toDateString() === pivotDate.toDateString();
                return (
                  <button 
                    key={idx}
                    onClick={() => setPivotDate(new Date(date))}
                    className={`flex flex-col items-center py-2 rounded-xl transition-all ${isSelected ? 'bg-[#3E3B6F] text-white shadow-lg' : 'hover:bg-gray-50 text-gray-400'}`}
                  >
                    <span className="text-[9px] font-bold uppercase tracking-widest">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                    <span className="text-base font-bold">{date.getDate()}</span>
                  </button>
                );
              })}
            </div>
          )}

          {viewMode === 'Week' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {weekDays.map(({ date, entry }) => (
                <div 
                  key={date.toDateString()} 
                  className={`bg-white rounded-2xl border-2 overflow-hidden transition-all hover:shadow-xl group ${
                    entry?.type === 'SHIFT' ? 'border-[#3E3B6F]/5' : 'border-gray-50 opacity-80'
                  }`}
                >
                  <div className={`px-5 py-4 flex justify-between items-center border-b border-gray-50 ${
                    entry?.type === 'SHIFT' ? (entry.specialShift === 'RAMZAN' ? 'bg-orange-50/50' : 'bg-[#3E3B6F]/5') : 'bg-gray-50'
                  }`}>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-800">
                        {date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {entry?.indicators?.map((ind, i) => (
                        <span key={i} className="text-[9px] font-black bg-white border border-gray-200 px-2 py-0.5 rounded-full text-gray-600 shadow-sm">
                          {ind}
                        </span>
                      ))}
                      {entry?.type === 'WEEK_OFF' && (
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 py-0.5 bg-gray-200/50 rounded-md">WEEK OFF</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-6 min-h-[180px] flex flex-col justify-between">
                    {entry?.type === 'SHIFT' ? (
                      <div className="space-y-5">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                            entry.specialShift === 'RAMZAN' ? 'bg-orange-100 text-orange-600' : 'bg-blue-50 text-blue-600'
                          }`}>
                            {entry.specialShift === 'RAMZAN' ? <Moon size={24} /> : <Sun size={24} />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800 tracking-tight">{entry.shiftName}</p>
                            <p className="text-base font-black text-[#3E3B6F] tabular-nums leading-tight">
                              {entry.startTime} — {entry.endTime}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                              <Coffee size={12} className="text-orange-400" /> Break Time
                            </p>
                            <p className="text-xs text-gray-600 font-semibold">{entry.breakTime || '60 min (standard)'}</p>
                          </div>
                          <div className="space-y-1.5">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                              <MapPin size={12} className="text-red-400" /> Primary Location
                            </p>
                            <p className="text-xs text-gray-600 font-semibold">{entry.location || 'Remote/Flex'}</p>
                          </div>
                        </div>

                        {(entry.note || entry.methods) && (
                          <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                            <div className="flex gap-2">
                              {entry.methods?.map(m => (
                                <span key={m} className="text-[8px] font-black text-gray-400 border border-gray-100 px-1.5 py-0.5 rounded uppercase">{m}</span>
                              ))}
                            </div>
                            {entry.note && (
                              <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 italic truncate max-w-[200px]">
                                <Info size={12} /> {entry.note}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : entry?.type === 'WEEK_OFF' ? (
                      <div className="flex flex-col items-center justify-center flex-1 text-center space-y-3 opacity-60">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                          <Home size={32} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-500">Weekend Recharge</p>
                          {entry.note && <p className="text-xs text-gray-400 mt-1">{entry.note}</p>}
                        </div>
                      </div>
                    ) : entry?.type === 'LEAVE' ? (
                      <div className="flex flex-col items-center justify-center flex-1 text-center space-y-3">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-400">
                          <Palmtree size={32} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-blue-500 tracking-tight">Time Off Period</p>
                          <p className="text-xs text-blue-400/80 mt-1 font-medium italic">"{entry.note}"</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center flex-1 text-center py-4 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
                        <CalendarCheck className="text-gray-200 mb-2" size={32} />
                        <p className="text-xs text-gray-300 font-bold uppercase tracking-[0.2em]">NO SCHEDULE ASSIGNED</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm animate-in zoom-in duration-300">
              <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/50">
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(d => (
                  <div key={d} className="py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {Array.from({ length: 35 }).map((_, i) => {
                  const dayNum = i - 2; 
                  const isToday = dayNum === 10;
                  const hasEntry = dayNum > 0 && dayNum <= 31;
                  return (
                    <div key={i} className={`aspect-square border-r border-b border-gray-50 p-2 transition-all ${hasEntry ? 'hover:bg-gray-50 cursor-pointer' : 'bg-gray-50/20'}`}>
                      {hasEntry && (
                        <div className="h-full flex flex-col">
                          <span className={`text-xs font-bold mb-1 ${isToday ? 'bg-[#3E3B6F] text-white w-6 h-6 flex items-center justify-center rounded-lg shadow-sm' : 'text-gray-400'}`}>
                            {dayNum}
                          </span>
                          {dayNum % 7 === 6 || dayNum % 7 === 0 ? (
                            <div className="mt-auto p-1 bg-gray-100 rounded text-[7px] font-black text-gray-400 uppercase text-center">Off</div>
                          ) : (
                            <div className="mt-auto p-1 bg-[#3E3B6F]/5 rounded text-[7px] font-black text-[#3E3B6F] text-center border border-[#3E3B6F]/10">9:00 AM</div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR WIDGETS */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-[10px] font-black text-[#3E3B6F] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Clock size={14} /> Schedule Changes
            </h3>
            <div className="space-y-5">
              <div className="flex gap-4 group">
                <div className="w-1 bg-[#3E3B6F] rounded-full shrink-0 group-hover:h-8 transition-all"></div>
                <div>
                  <p className="text-xs font-bold text-gray-800">Jan 15: Shift Update</p>
                  <p className="text-[10px] text-gray-500 font-medium">Evening Shift (2:00 PM - 11:00 PM)</p>
                </div>
              </div>
              <div className="flex gap-4 group">
                <div className="w-1 bg-orange-400 rounded-full shrink-0 group-hover:h-8 transition-all"></div>
                <div>
                  <p className="text-xs font-bold text-gray-800">Jan 20: Work Sat</p>
                  <p className="text-[10px] text-gray-500 font-medium">Working Alternate Saturday</p>
                </div>
              </div>
            </div>
            <button className="w-full mt-6 py-2 border border-dashed border-gray-200 rounded-xl text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:border-[#3E3B6F] hover:text-[#3E3B6F] transition-all">
              View All History
            </button>
          </div>

          <div className="bg-primary-gradient rounded-3xl p-6 text-white shadow-xl shadow-[#3E3B6F]/20 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
              <RefreshCcw size={120} />
            </div>
            <h3 className="text-xs font-black mb-5 flex items-center gap-2 text-[#E8D5A3] uppercase tracking-widest relative z-10">
              <ArrowRightLeft size={16} /> Quick Actions
            </h3>
            <div className="space-y-3 relative z-10">
              <button className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/5 active:scale-95">
                <span className="text-xs font-bold flex items-center gap-2">Swap Shift</span>
                <ChevronRight size={14} className="opacity-40" />
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/5 active:scale-95">
                <span className="text-xs font-bold flex items-center gap-2">Change Request</span>
                <Edit3 size={14} className="opacity-40" />
              </button>
            </div>
          </div>

          <div className="bg-[#E8B4A0]/10 border border-[#E8B4A0]/30 p-6 rounded-3xl">
            <div className="flex gap-4">
              <div className="bg-[#E8B4A0]/20 p-2 rounded-xl h-fit">
                <Info className="text-[#3E3B6F]" size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-[#3E3B6F] mb-1 leading-none uppercase tracking-widest">Policy Note</p>
                <p className="text-[10px] text-gray-600 leading-relaxed font-medium mt-2">
                  Shift swap requests must be submitted at least 48 hours in advance for approval.
                </p>
                <div className="mt-4 pt-4 border-t border-[#E8B4A0]/20 space-y-2">
                   <div className="flex justify-between text-[10px] font-black text-gray-400">WORKING <span className="text-gray-800">22d</span></div>
                   <div className="flex justify-between text-[10px] font-black text-gray-400">EXPECTED <span className="text-gray-800">176h</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
