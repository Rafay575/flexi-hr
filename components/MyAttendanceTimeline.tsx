
import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  List as ListIcon, 
  Clock, 
  ChevronLeft,
  ChevronRight, 
  Download, 
  Filter, 
  AlertCircle, 
  CheckCircle2, 
  X,
  TrendingUp,
  MapPin,
  ExternalLink,
  ChevronDown,
  CalendarDays
} from 'lucide-react';

type ViewMode = 'Timeline' | 'Calendar' | 'List';
type StatusType = 'PRESENT' | 'LATE' | 'MISSING' | 'LEAVE' | 'HOLIDAY' | 'WEEKLY_OFF' | 'SHORT_DAY' | 'HALF_DAY';

interface AttendanceDay {
  id: string;
  date: Date;
  status: StatusType;
  inTime: string;
  outTime: string;
  method: string;
  workHours: string;
  breakTime: string;
  notes?: string;
  extra?: string;
}

// Generate 30 days of mock data
const generateMockData = (): AttendanceDay[] => {
  const data: AttendanceDay[] = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dayOfWeek = d.getDay();
    
    let status: StatusType = 'PRESENT';
    let inTime = '09:02 AM';
    let outTime = '06:15 PM';
    let workHours = '8h 13m';
    let notes = 'On Time';

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      status = 'WEEKLY_OFF';
      inTime = '--';
      outTime = '--';
      workHours = '--';
      notes = 'Weekly Off';
    } else if (i === 2) {
      status = 'MISSING';
      outTime = '--';
      workHours = '--';
      notes = 'Missing Out Punch';
    } else if (i === 1) {
      status = 'LATE';
      inTime = '09:25 AM';
      notes = 'Late 25m (grace exceeded 10m)';
    } else if (i === 5) {
      status = 'LEAVE';
      inTime = '--';
      outTime = '--';
      workHours = '--';
      notes = 'Annual Leave';
    } else if (i === 8) {
      status = 'SHORT_DAY';
      outTime = '04:30 PM';
      workHours = '6h 30m';
      notes = 'Short Day (Early Exit)';
    }

    data.push({
      id: `day-${i}`,
      date: d,
      status,
      inTime,
      outTime,
      method: i % 2 === 0 ? 'Mobile-Geo' : 'Device',
      workHours,
      breakTime: status === 'PRESENT' || status === 'LATE' || status === 'SHORT_DAY' ? '1h 00m' : '--',
      notes,
      extra: i === 0 ? '15m' : undefined
    });
  }
  return data;
};

const MOCK_DATA = generateMockData();

export const MyAttendanceTimeline: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('Timeline');
  const [selectedDay, setSelectedDay] = useState<AttendanceDay | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getStatusStyles = (status: StatusType) => {
    switch (status) {
      case 'PRESENT': return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500', label: 'PRESENT ✓' };
      case 'LATE': return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500', label: 'LATE ⚠️' };
      case 'MISSING': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-400 border-dashed', dot: 'bg-red-500', label: 'MISSING OUT ❌' };
      case 'LEAVE': return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500', label: 'LEAVE' };
      case 'HOLIDAY': return { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', dot: 'bg-violet-500', label: 'HOLIDAY' };
      case 'SHORT_DAY': return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', dot: 'bg-yellow-500', label: 'SHORT DAY' };
      case 'HALF_DAY': return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500', label: 'HALF DAY' };
      case 'WEEKLY_OFF': return { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200', dot: 'bg-gray-400', label: 'WEEKLY OFF' };
      default: return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', dot: 'bg-gray-500', label: status };
    }
  };

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const record = MOCK_DATA.find(d => d.date.toDateString() === date.toDateString());
      days.push({ date, record });
    }
    return days;
  }, [currentMonth]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">My Attendance</h2>
          <p className="text-sm text-gray-500 font-medium">Detailed log of your working hours and status</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white border border-gray-200 rounded-xl p-1 flex shadow-sm">
            {[
              { id: 'Timeline', icon: <Clock size={14} /> },
              { id: 'Calendar', icon: <CalendarIcon size={14} /> },
              { id: 'List', icon: <ListIcon size={14} /> }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id as ViewMode)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  viewMode === mode.id ? 'bg-[#3E3B6F] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {mode.icon} {mode.id}
              </button>
            ))}
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
            <CalendarDays size={14} /> Jan 01 - Jan 31, 2025 <ChevronDown size={14} />
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-[#3E3B6F] text-white rounded-xl text-xs font-bold shadow-lg hover:opacity-90 transition-opacity">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* VIEW RENDERER */}
      <div className="min-h-[400px]">
        {viewMode === 'Timeline' && (
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">This Week</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>
            <div className="space-y-4">
              {MOCK_DATA.slice(0, 5).map((day) => {
                const styles = getStatusStyles(day.status);
                return (
                  <div 
                    key={day.id} 
                    onClick={() => setSelectedDay(day)}
                    className={`bg-white rounded-2xl border-2 ${styles.border} overflow-hidden hover:shadow-xl transition-all cursor-pointer group`}
                  >
                    <div className={`px-6 py-3 border-b border-gray-50 flex justify-between items-center ${styles.bg}`}>
                      <span className="text-sm font-bold text-gray-800">{day.date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${styles.text}`}>{styles.label}</span>
                    </div>
                    <div className="p-6 flex flex-col lg:flex-row justify-between gap-6">
                      <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Punch Times</p>
                          <p className="text-sm font-bold text-gray-800">{day.inTime} — {day.outTime}</p>
                          <p className="text-[10px] text-gray-500 mt-1 font-medium flex items-center gap-1"><MapPin size={10}/> {day.method}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Hours / Break</p>
                          <p className="text-sm font-bold text-gray-800">{day.workHours} <span className="text-gray-300 mx-1">|</span> {day.breakTime}</p>
                        </div>
                        <div className="col-span-2 lg:col-span-1">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Status Remarks</p>
                          <p className={`text-sm font-bold ${day.status === 'LATE' || day.status === 'MISSING' ? 'text-red-600' : 'text-gray-600'}`}>{day.notes}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {day.status === 'MISSING' || day.status === 'LATE' ? (
                          <button className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-600 hover:text-white transition-all">Regularize Now ⚠️</button>
                        ) : (
                          <button className="px-4 py-2 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-100 transition-all">Trace Calculation</button>
                        )}
                        <div className="p-2 text-gray-300 group-hover:text-[#3E3B6F] transition-colors"><ChevronRight size={20} /></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {viewMode === 'Calendar' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
              <div className="flex gap-2">
                <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} className="p-1.5 hover:bg-gray-100 rounded-lg"><ChevronLeft size={18} /></button>
                <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} className="p-1.5 hover:bg-gray-100 rounded-lg"><ChevronRight size={18} /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/50">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="py-2 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {calendarDays.map((cell, i) => (
                <div 
                  key={i} 
                  onClick={() => cell?.record && setSelectedDay(cell.record)}
                  className={`min-h-[100px] p-2 border-r border-b border-gray-50 transition-colors ${cell ? 'cursor-pointer hover:bg-gray-50' : 'bg-gray-50/20'}`}
                >
                  {cell && (
                    <>
                      <span className={`text-xs font-bold ${cell.date.toDateString() === new Date().toDateString() ? 'bg-[#3E3B6F] text-white w-6 h-6 flex items-center justify-center rounded-full' : 'text-gray-400'}`}>
                        {cell.date.getDate()}
                      </span>
                      {cell.record && (
                        <div className={`mt-2 p-1.5 rounded-lg border ${getStatusStyles(cell.record.status).border} ${getStatusStyles(cell.record.status).bg} space-y-1`}>
                          <div className="flex items-center gap-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${getStatusStyles(cell.record.status).dot}`}></div>
                            <span className={`text-[8px] font-bold truncate ${getStatusStyles(cell.record.status).text}`}>{cell.record.status}</span>
                          </div>
                          <p className="text-[9px] text-gray-600 font-medium">{cell.record.inTime}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {viewMode === 'List' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">In Time</th>
                  <th className="px-6 py-4">Out Time</th>
                  <th className="px-6 py-4">Work Hours</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {MOCK_DATA.map(day => (
                  <tr key={day.id} className="hover:bg-gray-50 transition-colors group cursor-pointer" onClick={() => setSelectedDay(day)}>
                    <td className="px-6 py-4 text-sm font-bold text-gray-800">{day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${getStatusStyles(day.status).bg} ${getStatusStyles(day.status).text} border ${getStatusStyles(day.status).border}`}>
                        {day.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 tabular-nums">{day.inTime}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 tabular-nums">{day.outTime}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 tabular-nums">{day.workHours}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-300 group-hover:text-[#3E3B6F] transition-colors"><ExternalLink size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAIL DRAWER */}
      {selectedDay && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedDay(null)}></div>
          <div className="relative w-full max-w-xl bg-white h-full shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Calculation Trace</h3>
                <p className="text-sm text-gray-500">{selectedDay.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
              </div>
              <button onClick={() => setSelectedDay(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${getStatusStyles(selectedDay.status).bg} ${getStatusStyles(selectedDay.status).border}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusStyles(selectedDay.status).dot}`}></div>
                  <span className={`font-bold ${getStatusStyles(selectedDay.status).text}`}>Status: {getStatusStyles(selectedDay.status).label}</span>
                </div>
                {selectedDay.status === 'LATE' && <span className="text-[10px] font-black text-red-600 animate-pulse">ACTION REQUIRED</span>}
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp size={14} className="text-[#3E3B6F]" /> How it was calculated
                </h4>
                <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-100">
                  <div className="p-5 flex justify-between items-center bg-white">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Applied Shift</p>
                      <p className="text-sm font-bold text-gray-800">Morning Shift (9:00 AM - 6:00 PM)</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Grace Period</p>
                      <p className="text-sm font-bold text-orange-600">15 min</p>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-gray-800">Punch In: {selectedDay.inTime}</p>
                        <div className="border-l-2 border-gray-200 ml-2 pl-3 space-y-1 py-1">
                          {selectedDay.status === 'LATE' ? (
                            <>
                              <p className="text-[10px] text-red-500 font-bold">→ Late by: 25 min</p>
                              <p className="text-[10px] text-orange-500 font-bold">→ Grace applied: 15 min</p>
                              <p className="text-[10px] text-red-700 font-black">→ Net Penalty: 10 min late</p>
                            </>
                          ) : (
                            <p className="text-[10px] text-green-600 font-bold">→ On Time ✓</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-gray-800">Punch Out: {selectedDay.outTime}</p>
                        <div className="border-l-2 border-gray-200 ml-2 pl-3 space-y-1 py-1">
                          {selectedDay.status === 'PRESENT' ? (
                            <p className="text-[10px] text-blue-600 font-bold">→ Extra time recorded: 15 min</p>
                          ) : (
                            <p className="text-[10px] text-gray-400 font-medium">→ Standard exit</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-[#3E3B6F]/5">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Work Metrics</p>
                        <div className="space-y-1 text-xs font-medium text-gray-600">
                          <div className="flex justify-between"><span>Gross Hours:</span> <span className="text-gray-900 font-bold">9h 05m</span></div>
                          <div className="flex justify-between"><span>Break Deducted:</span> <span className="text-gray-900 font-bold">1h 00m</span></div>
                          <div className="flex justify-between pt-1 border-t border-gray-200 text-[#3E3B6F] font-bold"><span>Net Hours:</span> <span className="text-sm font-black">8h 05m</span></div>
                        </div>
                      </div>
                      <div className="border-l border-gray-200 pl-6 space-y-2">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Policy Impact</p>
                        <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                          {selectedDay.status === 'LATE' ? (
                            <span className="text-red-600 font-bold">Late penalty (10m) will trigger a partial leave deduction.</span>
                          ) : (
                            <span className="text-green-600 font-bold">Record verified. No deductions applied.</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4">
              <button className="flex-1 px-6 py-3 bg-[#3E3B6F] text-white rounded-2xl font-bold text-sm shadow-lg hover:opacity-90 transition-opacity">Request Regularization</button>
              <button className="flex-1 px-6 py-3 bg-white border border-gray-200 text-red-600 rounded-2xl font-bold text-sm shadow-sm hover:bg-red-50 transition-colors">Report Issue</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
