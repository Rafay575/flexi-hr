
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Info, 
  AlertTriangle,
  FileText,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Coffee,
  PieChart,
  X,
  MapPin,
  Smartphone,
  History
} from 'lucide-react';

type CalendarStatus = 'PRESENT' | 'LATE' | 'ABSENT' | 'LEAVE' | 'HOLIDAY' | 'WEEKLY_OFF' | 'HALF_DAY' | 'SHORT_DAY' | 'MISSING';

interface DayRecord {
  date: Date;
  status: CalendarStatus;
  hours: string;
  inTime?: string;
  outTime?: string;
  anomaly?: boolean;
  notes?: string;
}

const STATUS_CONFIG: Record<CalendarStatus, { bg: string; text: string; label: string; border?: string; fillClass: string }> = {
  PRESENT: { bg: 'bg-green-500', text: 'text-white', label: 'Present', fillClass: 'bg-green-500' },
  LATE: { bg: 'bg-orange-500', text: 'text-white', label: 'Late', fillClass: 'bg-orange-500' },
  ABSENT: { bg: 'bg-red-500', text: 'text-white', label: 'Absent', fillClass: 'bg-red-500' },
  LEAVE: { bg: 'bg-blue-500', text: 'text-white', label: 'Leave', fillClass: 'bg-blue-500' },
  HOLIDAY: { bg: 'bg-purple-500', text: 'text-white', label: 'Holiday', fillClass: 'bg-purple-500' },
  WEEKLY_OFF: { bg: 'bg-gray-200', text: 'text-gray-500', label: 'Weekly Off', fillClass: 'bg-gray-200' },
  HALF_DAY: { bg: 'bg-gradient-to-r from-green-500 to-gray-200', text: 'text-white', label: 'Half Day', fillClass: 'bg-gradient-to-r from-green-500 to-gray-200' },
  SHORT_DAY: { bg: 'bg-yellow-400', text: 'text-yellow-900', label: 'Short Day', fillClass: 'bg-yellow-400' },
  MISSING: { bg: 'bg-white', text: 'text-red-500', border: 'border-2 border-red-500 border-dashed', label: 'Missing Punch', fillClass: 'bg-white' },
};

export const MyAttendanceCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1));
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [showLegend, setShowLegend] = useState(true);
  const [selectedDayDetail, setSelectedDayDetail] = useState<DayRecord | null>(null);

  const monthData = useMemo(() => {
    const data: Record<number, DayRecord> = {};
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      const dayOfWeek = date.getDay();
      
      let status: CalendarStatus = 'PRESENT';
      let hours = '8.5h';
      let inTime = '09:00 AM';
      let outTime = '06:00 PM';
      let anomaly = false;
      let notes = 'Regular attendance recorded.';

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        status = 'WEEKLY_OFF';
        hours = '-';
        inTime = '--';
        outTime = '--';
        notes = 'Weekend Rest Day';
      } else if (i === 10) {
        status = 'LATE';
        inTime = '09:25 AM';
        anomaly = true;
        notes = 'Late arrival by 25 mins.';
      } else if (i === 15) {
        status = 'MISSING';
        outTime = '--';
        anomaly = true;
        notes = 'Evening punch missing.';
      } else if (i === 20) {
        status = 'ABSENT';
        hours = '0h';
        inTime = '--';
        outTime = '--';
        notes = 'Uninformed absence.';
      } else if (i === 5) {
        status = 'HOLIDAY';
        hours = '-';
        inTime = '--';
        outTime = '--';
        notes = 'New Year Observed';
      } else if (i === 22) {
        status = 'SHORT_DAY';
        hours = '5.0h';
        outTime = '02:00 PM';
        notes = 'Early exit approved.';
      } else if (i === 25) {
        status = 'HALF_DAY';
        hours = '4.0h';
        outTime = '01:00 PM';
      }

      data[i] = { date, status, hours, inTime, outTime, anomaly, notes };
    }
    return data;
  }, [currentDate]);

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  const handleExport = () => {
    alert(`Exporting ${currentDate.toLocaleString('default', { month: 'long' })} attendance report...`);
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 animate-in fade-in duration-500 pb-10">
      <div className="xl:col-span-3 space-y-6">
        {/* CALENDAR HEADER */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <CalendarIcon className="text-[#3E3B6F]" size={20} /> Attendance Calendar
            </h2>
            <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
              <button onClick={() => changeMonth(-1)} className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600"><ChevronLeft size={18} /></button>
              <span className="px-4 text-sm font-bold text-[#3E3B6F] min-w-[140px] text-center">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <button onClick={() => changeMonth(1)} className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600"><ChevronRight size={18} /></button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowLegend(!showLegend)}
              className={`px-4 py-2 border rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${showLegend ? 'bg-[#3E3B6F] text-white border-transparent' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
            >
              <Info size={14} /> {showLegend ? 'Hide Legend' : 'Show Legend'}
            </button>
            <button 
              onClick={handleExport}
              className="px-4 py-2 bg-primary-gradient text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-gray-200 hover:scale-105 transition-transform"
            >
              <Download size={14} /> Export PDF
            </button>
          </div>
        </div>

        {/* CALENDAR GRID */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden relative">
          <div className="grid grid-cols-7 bg-gray-50/50 border-b border-gray-100">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
              <div key={day} className="py-4 text-center text-[10px] font-bold text-gray-400 tracking-widest">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square border-r border-b border-gray-50 bg-gray-50/20"></div>
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const record = monthData[dayNum];
              const config = STATUS_CONFIG[record.status];
              
              return (
                <div 
                  key={dayNum} 
                  className="aspect-square border-r border-b border-gray-50 p-1 relative group cursor-pointer"
                  onMouseEnter={() => setHoveredDay(dayNum)}
                  onMouseLeave={() => setHoveredDay(null)}
                  onClick={() => setSelectedDayDetail(record)}
                >
                  <div className={`w-full h-full rounded-2xl flex flex-col p-2 transition-all group-hover:scale-95 group-active:scale-90 ${config.fillClass} ${config.border || ''}`}>
                    <span className={`text-xs font-bold ${config.text}`}>{dayNum}</span>
                    <div className="mt-auto flex justify-between items-end">
                      <span className={`text-[9px] font-black uppercase opacity-70 ${config.text}`}>{record.hours}</span>
                      {record.anomaly && <AlertTriangle size={14} className="text-white fill-orange-500" />}
                    </div>
                  </div>

                  {/* QUICK INFO TOOLTIP */}
                  {hoveredDay === dayNum && (
                    <div className="absolute bottom-[105%] left-1/2 -translate-x-1/2 w-48 bg-gray-900/95 backdrop-blur-md text-white rounded-xl p-3 z-50 shadow-2xl pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{config.label}</span>
                        {record.anomaly && <AlertTriangle size={10} className="text-orange-400" />}
                      </div>
                      <p className="text-xs font-bold mb-2">{dayNum} {currentDate.toLocaleString('default', { month: 'short' })} {currentDate.getFullYear()}</p>
                      <div className="space-y-1 text-[10px]">
                        <div className="flex justify-between text-gray-400"><span>In:</span> <span className="text-white">{record.inTime}</span></div>
                        <div className="flex justify-between text-gray-400"><span>Out:</span> <span className="text-white">{record.outTime}</span></div>
                        <div className="flex justify-between border-t border-white/10 pt-1 mt-1 font-bold"><span>Total:</span> <span>{record.hours}</span></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* LEGEND SECTION */}
        {showLegend && (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 animate-in slide-in-from-top-2">
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <div key={key} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${config.fillClass} ${config.border || ''}`}></div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{config.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MONTHLY SUMMARY SIDEBAR */}
      <div className="space-y-6">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-bold text-[#3E3B6F] mb-6 flex items-center gap-2 uppercase tracking-widest text-[10px]">
            <PieChart size={16} className="text-[#3E3B6F]" /> Monthly Summary
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Working Days', val: '22', icon: <Clock size={14} />, color: 'text-gray-400' },
              { label: 'Present', val: '18', icon: <CheckCircle2 size={14} />, color: 'text-green-500' },
              { label: 'Late Arrival', val: '3', icon: <AlertTriangle size={14} />, color: 'text-orange-500' },
              { label: 'Absent', val: '1', icon: <FileText size={14} />, color: 'text-red-500' },
              { label: 'Leaves', val: '0', icon: <Info size={14} />, color: 'text-blue-500' },
              { label: 'Holidays', val: '2', icon: <CalendarIcon size={14} />, color: 'text-purple-500' },
              { label: 'Weekly Offs', val: '8', icon: <Coffee size={14} />, color: 'text-gray-400' },
            ].map(stat => (
              <div key={stat.label} className="flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`${stat.color} opacity-80`}>{stat.icon}</div>
                  <span className="text-xs font-medium text-gray-600">{stat.label}</span>
                </div>
                <span className="text-sm font-black text-gray-800 tabular-nums">{stat.val}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Avg Work Hours</p>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-black text-[#3E3B6F]">8.2h</p>
                <span className="text-[10px] text-green-500 font-bold">+5% target</span>
              </div>
            </div>
            <div className="bg-primary-gradient p-4 rounded-2xl shadow-lg shadow-gray-200">
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">Total Overtime</p>
              <p className="text-2xl font-black text-white">12.0h</p>
              <p className="text-[10px] text-white/40 mt-1 font-medium">Earned bonus approx: $140.00</p>
            </div>
          </div>
        </div>

        <div className="bg-[#E8D5A3]/10 border border-[#E8D5A3]/30 p-5 rounded-3xl">
          <div className="flex gap-3">
             <AlertTriangle className="text-orange-500 shrink-0" size={18} />
             <div>
               <p className="text-xs font-bold text-[#3E3B6F] mb-1">Policy Update</p>
               <p className="text-[10px] text-gray-600 leading-relaxed font-medium">
                 Short days (less than 6h) require manager approval to avoid half-day salary deductions.
               </p>
             </div>
          </div>
        </div>
      </div>

      {/* DAY DETAIL MODAL */}
      {selectedDayDetail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedDayDetail(null)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className={`p-6 flex justify-between items-center ${STATUS_CONFIG[selectedDayDetail.status].fillClass} ${STATUS_CONFIG[selectedDayDetail.status].text}`}>
              <div>
                <h4 className="text-xl font-bold">{selectedDayDetail.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h4>
                <span className="text-xs font-black uppercase tracking-widest opacity-80">{selectedDayDetail.status}</span>
              </div>
              <button onClick={() => setSelectedDayDetail(null)} className="p-2 hover:bg-black/10 rounded-full transition-all"><X size={24}/></button>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Clock size={20}/></div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Punch In</p>
                    <p className="text-lg font-bold text-gray-800">{selectedDayDetail.inTime}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Smartphone size={10} className="text-gray-400"/>
                      <span className="text-[10px] text-gray-500">Mobile Verified</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-orange-50 text-orange-600 rounded-xl"><Clock size={20}/></div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Punch Out</p>
                    <p className="text-lg font-bold text-gray-800">{selectedDayDetail.outTime}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin size={10} className="text-gray-400"/>
                      <span className="text-[10px] text-gray-500">Office HQ</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><History size={12}/> Analysis</p>
                  <span className="text-xs font-bold text-[#3E3B6F]">Work Log</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Gross Work Hours</span>
                    <span className="font-bold text-gray-800">{selectedDayDetail.hours}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Required Hours</span>
                    <span className="font-bold text-gray-800">8.0h</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 mt-2">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Supervisor Notes</p>
                    <p className="text-xs text-gray-700 font-medium italic">"{selectedDayDetail.notes}"</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 py-3 bg-[#3E3B6F] text-white rounded-2xl font-bold text-sm shadow-lg shadow-gray-200 hover:opacity-90 transition-opacity">
                  Regularize Record
                </button>
                <button className="flex-1 py-3 bg-white border border-gray-200 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-50 transition-all">
                  Full Timeline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
