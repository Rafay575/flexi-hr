
import React, { useState, useMemo } from 'react';
import { 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Filter, 
  Calendar as CalendarIcon,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Plane,
  X,
  ChevronDown,
  UserCheck,
  ExternalLink,
  Info
} from 'lucide-react';

type DayStatus = 'PRESENT' | 'LATE' | 'ABSENT' | 'LEAVE' | 'HOLIDAY' | 'WEEK_OFF' | 'HALF_DAY' | 'OT';

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  records: Record<number, { 
    status: DayStatus; 
    in?: string; 
    out?: string; 
    hours?: string; 
    ot?: string;
    reason?: string;
  }>;
}

const STATUS_UI: Record<DayStatus, { color: string; label: string }> = {
  PRESENT: { color: 'bg-green-500', label: 'Present' },
  LATE: { color: 'bg-orange-500', label: 'Late' },
  ABSENT: { color: 'bg-red-500', label: 'Absent' },
  LEAVE: { color: 'bg-blue-500', label: 'Leave' },
  HOLIDAY: { color: 'bg-purple-500', label: 'Holiday' },
  WEEK_OFF: { color: 'bg-gray-200', label: 'Weekly Off' },
  HALF_DAY: { color: 'bg-gradient-to-br from-green-500 to-gray-200', label: 'Half Day' },
  OT: { color: 'bg-green-600', label: 'Overtime' },
};

const MOCK_NAMES = ['Alex Rivera', 'Sarah Chen', 'James Wilson', 'Priya Das', 'Marcus Low', 'Elena Frost', 'Tom Hardy', 'Lisa Ray', 'Kevin Hart', 'Nina Simone', 'Oscar Isaac', 'Wanda M.', 'Pietro M.', 'Vision AI', 'Natasha R.'];

const MOCK_TEAM: TeamMember[] = Array.from({ length: 15 }).map((_, idx) => ({
  id: `TM-${idx}`,
  name: MOCK_NAMES[idx],
  avatar: String.fromCharCode(65 + idx),
  records: Array.from({ length: 31 }).reduce<Record<number, any>>((acc, _, d) => {
    const day = d + 1;
    const isWeekend = (day % 7 === 5 || day % 7 === 6);
    const statuses: DayStatus[] = ['PRESENT', 'PRESENT', 'LATE', 'PRESENT', 'ABSENT', 'LEAVE', 'HALF_DAY'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    acc[day] = {
      status: isWeekend ? 'WEEK_OFF' : (day === 1 ? 'HOLIDAY' : randomStatus),
      in: isWeekend ? undefined : '09:02 AM',
      out: isWeekend ? undefined : '06:15 PM',
      hours: isWeekend ? undefined : '8.5h',
      ot: Math.random() > 0.85 ? '2.5h' : undefined,
      reason: randomStatus === 'ABSENT' ? 'Sick Leave' : randomStatus === 'LEAVE' ? 'Annual Vacation' : undefined
    };
    if (acc[day].ot && !isWeekend && day !== 1) acc[day].status = 'OT';
    return acc;
  }, {})
}));

export const TeamCalendar: React.FC = () => {
  const [viewMode, setViewMode] = useState<'Week' | 'Month'>('Month');
  const [selectedDay, setSelectedDay] = useState<number | null>(10);
  const [hoveredCell, setHoveredCell] = useState<{ memberId: string; day: number } | null>(null);

  const daysArray = Array.from({ length: 31 }, (_, i) => i + 1);

  const dailySummary = useMemo(() => {
    return daysArray.map(day => {
      const total = MOCK_TEAM.length;
      const presentCount = MOCK_TEAM.filter(m => 
        ['PRESENT', 'LATE', 'OT', 'HALF_DAY'].includes(m.records[day].status)
      ).length;
      const coverage = (presentCount / total) * 100;
      return { day, count: presentCount, total, coverage };
    });
  }, [daysArray]);

  const sidebarData = useMemo(() => {
    if (selectedDay === null) return null;
    return {
      date: `Wednesday, Jan ${selectedDay}, 2025`,
      present: MOCK_TEAM.filter(m => ['PRESENT', 'LATE', 'OT', 'HALF_DAY'].includes(m.records[selectedDay].status)),
      absent: MOCK_TEAM.filter(m => m.records[selectedDay].status === 'ABSENT'),
      leave: MOCK_TEAM.filter(m => m.records[selectedDay].status === 'LEAVE'),
      issues: MOCK_TEAM.filter(m => m.records[selectedDay].status === 'LATE' || (m.records[selectedDay].status === 'PRESENT' && !m.records[selectedDay].out))
    };
  }, [selectedDay]);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-hidden">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#3E3B6F] rounded-xl text-white shadow-lg">
            <Users size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Team Calendar</h2>
            <p className="text-sm text-gray-500 font-medium">Monthly heatmap of team availability</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white border border-gray-200 rounded-xl p-1 flex shadow-sm">
            {(['Week', 'Month'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  viewMode === mode ? 'bg-[#3E3B6F] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
          
          <div className="flex items-center bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm gap-3 cursor-pointer hover:bg-gray-50">
            <Filter size={14} className="text-gray-400" />
            <span className="text-xs font-bold text-gray-700">Engineering Dept</span>
            <ChevronDown size={14} className="text-gray-400" />
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-[#3E3B6F] text-white rounded-xl text-xs font-bold shadow-lg hover:opacity-90 transition-all">
            <Download size={14} /> Export Table
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* HEATMAP GRID */}
        <div className="flex-1 bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col overflow-hidden relative">
          <div className="overflow-auto custom-scrollbar flex-1">
            <table className="w-full border-separate border-spacing-0">
              <thead className="sticky top-0 z-30 bg-white/95 backdrop-blur shadow-sm">
                <tr>
                  <th className="sticky left-0 z-40 bg-white p-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest border-r border-b border-gray-100 min-w-[200px]">
                    Team Member
                  </th>
                  {daysArray.map(day => (
                    <th key={day} className={`p-2 text-center min-w-[40px] border-b border-r border-gray-50 ${selectedDay === day ? 'bg-[#3E3B6F]/5' : ''}`}>
                      <div className="text-[9px] font-bold text-gray-400 uppercase leading-none mb-1">Jan</div>
                      <div className={`text-xs font-black ${selectedDay === day ? 'text-[#3E3B6F]' : 'text-gray-700'}`}>{day}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_TEAM.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="sticky left-0 z-20 bg-white p-3 border-r border-b border-gray-100 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#3E3B6F]/5 flex items-center justify-center text-[10px] font-black text-[#3E3B6F] border border-[#3E3B6F]/10 shrink-0 shadow-sm">
                        {member.avatar}
                      </div>
                      <span className="text-xs font-bold text-gray-800 truncate">{member.name}</span>
                    </td>
                    {daysArray.map(day => {
                      const record = member.records[day];
                      const isHovered = hoveredCell?.memberId === member.id && hoveredCell?.day === day;
                      
                      return (
                        <td 
                          key={day} 
                          className={`p-1 border-r border-b border-gray-50 relative group cursor-pointer ${selectedDay === day ? 'bg-[#3E3B6F]/5' : ''}`}
                          onMouseEnter={() => setHoveredCell({ memberId: member.id, day })}
                          onMouseLeave={() => setHoveredCell(null)}
                          onClick={() => setSelectedDay(day)}
                        >
                          <div className={`h-10 w-full rounded-lg transition-all ${STATUS_UI[record.status].color} group-hover:scale-95 flex items-center justify-center shadow-inner overflow-hidden`}>
                            {record.status === 'OT' && (
                              <span className="text-[8px] font-black text-white bg-black/20 px-1 rounded-sm ring-1 ring-white/30">OT</span>
                            )}
                          </div>

                          {/* DETAILS TOOLTIP */}
                          {isHovered && !['WEEK_OFF', 'HOLIDAY'].includes(record.status) && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-40 bg-gray-900 text-white rounded-xl p-3 z-[60] shadow-2xl animate-in fade-in zoom-in duration-200 pointer-events-none">
                              <div className="flex justify-between items-center mb-2 border-b border-white/10 pb-1">
                                <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">{STATUS_UI[record.status].label}</span>
                                {record.ot && <span className="text-[8px] font-bold text-green-400">+{record.ot} OT</span>}
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-[10px]">
                                  <span className="text-gray-400">Punched In:</span>
                                  <span className="font-bold">{record.in || '--:--'}</span>
                                </div>
                                <div className="flex justify-between text-[10px]">
                                  <span className="text-gray-400">Punched Out:</span>
                                  <span className="font-bold">{record.out || '--:--'}</span>
                                </div>
                                <div className="flex justify-between text-[10px] pt-1 mt-1 border-t border-white/5">
                                  <span className="text-gray-400">Duration:</span>
                                  <span className="font-black text-blue-400">{record.hours || '0h'}</span>
                                </div>
                              </div>
                              <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900"></div>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
              <tfoot className="sticky bottom-0 z-30 bg-white/95 backdrop-blur border-t-2 border-gray-200 shadow-inner">
                <tr>
                  <td className="sticky left-0 z-40 bg-gray-50 p-4 text-[10px] font-black text-[#3E3B6F] uppercase tracking-[0.2em] border-r border-gray-200">
                    Daily Coverage
                  </td>
                  {dailySummary.map(sum => (
                    <td key={sum.day} className={`p-1 text-center ${selectedDay === sum.day ? 'bg-[#3E3B6F]/10' : ''}`}>
                      <div className={`text-[10px] font-black rounded-lg py-1.5 transition-colors ${
                        sum.coverage >= 85 ? 'text-green-700 bg-green-100' : 
                        sum.coverage >= 60 ? 'text-orange-700 bg-orange-100' : 
                        'text-red-700 bg-red-100'
                      }`}>
                        {sum.count}/{sum.total}
                      </div>
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="w-80 bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col animate-in slide-in-from-right duration-300">
          {sidebarData ? (
            <div className="flex flex-col h-full overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-[#3E3B6F]/5 relative overflow-hidden shrink-0">
                <div className="absolute top-0 right-0 p-8 opacity-5 text-[#3E3B6F]">
                  <CalendarIcon size={120} />
                </div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-[#3E3B6F] uppercase tracking-[0.2em]">Daily Breakdown</p>
                    <h3 className="text-sm font-bold text-gray-800 leading-tight">{sidebarData.date}</h3>
                  </div>
                  <button onClick={() => setSelectedDay(null)} className="p-1.5 hover:bg-gray-200 rounded-full text-gray-400 transition-colors">
                    <X size={18} />
                  </button>
                </div>
                <div className="flex gap-4 relative z-10">
                  <div className="flex-1 bg-white p-3 rounded-2xl shadow-sm border border-gray-100/50">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Attendance</p>
                    <p className="text-xl font-black text-gray-800 tracking-tighter">
                      {sidebarData.present.length}<span className="text-xs text-gray-400 ml-1">/ {MOCK_TEAM.length}</span>
                    </p>
                  </div>
                  <div className="flex-1 bg-white p-3 rounded-2xl shadow-sm border border-gray-100/50">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Efficiency</p>
                    <p className="text-xl font-black text-green-500 tracking-tighter">92%</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                {/* ISSUES SECTION */}
                {sidebarData.issues.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle size={14} className="text-red-500" />
                      <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">Critical Issues</p>
                    </div>
                    {sidebarData.issues.map(m => (
                      <div key={m.id} className="p-3 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-between group hover:bg-red-100/50 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded bg-red-200 flex items-center justify-center text-[10px] font-black text-red-700">{m.avatar}</div>
                          <span className="text-xs font-bold text-gray-800">{m.name}</span>
                        </div>
                        <span className="text-[9px] font-black text-red-600 bg-white px-2 py-0.5 rounded-full uppercase shadow-sm">
                          {m.records[selectedDay!].status === 'LATE' ? 'Late' : 'No Out-Punch'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* PRESENT LIST */}
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">Working Team ({sidebarData.present.length})</p>
                  <div className="space-y-1">
                    {sidebarData.present.map(m => (
                      <div key={m.id} className="flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-2xl transition-all group">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-500 group-hover:bg-[#3E3B6F] group-hover:text-white transition-all">
                            {m.avatar}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-700 truncate">{m.name}</p>
                            <p className="text-[8px] font-bold text-gray-400 uppercase">{m.records[selectedDay!].status}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-black text-gray-800 tabular-nums">{m.records[selectedDay!].in} - {m.records[selectedDay!].out}</p>
                          <p className="text-[8px] font-bold text-blue-500 tabular-nums">Hrs: {m.records[selectedDay!].hours}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* LEAVE & ABSENT LIST */}
                {(sidebarData.leave.length > 0 || sidebarData.absent.length > 0) && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">Absent / On Leave</p>
                    {[...sidebarData.leave, ...sidebarData.absent].map(m => (
                      <div key={m.id} className="flex items-center justify-between p-2.5 rounded-2xl border border-gray-100 bg-gray-50/50">
                        <div className="flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black ${m.records[selectedDay!].status === 'ABSENT' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                            {m.records[selectedDay!].status === 'ABSENT' ? <XCircle size={14} /> : <Plane size={14} />}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-700">{m.name}</p>
                            <p className="text-[8px] font-medium text-gray-500 italic">{m.records[selectedDay!].reason || 'No reason provided'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 bg-white border-t border-gray-100 space-y-3 shrink-0">
                <button className="w-full py-3 bg-[#3E3B6F] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-gray-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} /> Approve All Pending
                </button>
                <button className="w-full py-2 bg-gray-50 text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-gray-600 transition-colors">
                  Generate Daily Report
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50/50">
              <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6 border border-gray-100">
                <CalendarIcon size={40} className="text-gray-200" />
              </div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] max-w-[200px] leading-loose">
                Select a specific date to view detailed team metrics
              </p>
            </div>
          )}
        </div>
      </div>

      {/* LEGEND BAR */}
      <div className="mt-6 flex flex-wrap items-center gap-6 text-[9px] font-black text-gray-400 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm overflow-x-auto no-scrollbar">
        <span className="uppercase tracking-[0.2em] border-r border-gray-200 pr-6 mr-0 shrink-0">Status Key:</span>
        {Object.entries(STATUS_UI).map(([status, ui]) => (
          <div key={status} className="flex items-center gap-2 shrink-0">
            <div className={`w-3 h-3 rounded-md ${ui.color} shadow-sm`}></div>
            <span className="uppercase tracking-widest">{ui.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
