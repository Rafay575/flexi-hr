
import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, List as ListIcon, 
  Info, MapPin, Clock, Filter, CheckCircle2, AlertCircle, Bot
} from 'lucide-react';
import { LeaveType, LeaveStatus } from '../types';

interface CalendarEvent {
  id: string;
  type: LeaveType | 'Holiday';
  status: LeaveStatus | 'FIXED';
  startDate: Date;
  endDate: Date;
  label: string;
  isHalfDay?: boolean;
}

const MOCK_EVENTS: CalendarEvent[] = [
  { id: 'h1', type: 'Holiday', status: 'FIXED', startDate: new Date(2025, 1, 5), endDate: new Date(2025, 1, 5), label: 'Kashmir Day' },
  { id: 'h2', type: 'Holiday', status: 'FIXED', startDate: new Date(2025, 2, 23), endDate: new Date(2025, 2, 23), label: 'Pakistan Day' },
  { id: 'l1', type: LeaveType.ANNUAL, status: LeaveStatus.APPROVED, startDate: new Date(2025, 1, 10), endDate: new Date(2025, 1, 12), label: 'Family Trip' },
  { id: 'l2', type: LeaveType.SICK, status: LeaveStatus.PENDING, startDate: new Date(2025, 1, 18), endDate: new Date(2025, 1, 18), label: 'Doctor Appt', isHalfDay: true },
  { id: 'l3', type: LeaveType.CASUAL, status: LeaveStatus.APPROVED, startDate: new Date(2025, 2, 10), endDate: new Date(2025, 2, 11), label: 'Personal Work' },
];

export const MyLeaveCalendar = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 1, 1)); // Feb 2025
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const getTypeColor = (type: string, status: string) => {
    if (type === 'Holiday') return 'bg-purple-500';
    const isPending = status === LeaveStatus.PENDING;
    switch (type) {
      case LeaveType.ANNUAL: return isPending ? 'bg-indigo-300' : 'bg-indigo-600';
      case LeaveType.SICK: return isPending ? 'bg-red-300' : 'bg-red-600';
      case LeaveType.CASUAL: return isPending ? 'bg-amber-300' : 'bg-amber-600';
      default: return 'bg-gray-400';
    }
  };

  const renderCalendar = () => {
    const totalDays = daysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
    const startDay = firstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth());
    const days = [];

    // Padding for previous month days
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`pad-${i}`} className="h-32 border-b border-r border-gray-100 bg-gray-50/30" />);
    }

    for (let d = 1; d <= totalDays; d++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const dayEvents = MOCK_EVENTS.filter(e => date >= e.startDate && date <= e.endDate);

      days.push(
        <div key={d} className={`h-32 border-b border-r border-gray-100 p-2 transition-colors relative group ${isWeekend ? 'bg-gray-50/50' : 'bg-white hover:bg-gray-50'}`}>
          <span className={`text-sm font-bold ${isWeekend ? 'text-gray-400' : 'text-gray-700'}`}>{d}</span>
          <div className="mt-1 space-y-1">
            {dayEvents.map(e => (
              <div 
                key={e.id}
                onClick={() => setSelectedEvent(e)}
                className={`text-[10px] p-1 rounded font-bold text-white cursor-pointer truncate flex items-center gap-1
                  ${getTypeColor(e.type, e.status)}
                  ${e.status === LeaveStatus.PENDING ? 'opacity-70 stripe-bg' : ''}
                  ${e.isHalfDay ? 'w-1/2' : 'w-full'}
                `}
                title={`${e.label} (${e.type})`}
              >
                {e.type === 'Holiday' ? '⭐' : ''} {e.label}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 border-t border-l border-gray-100 rounded-xl overflow-hidden shadow-sm">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-gray-50 py-3 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest border-r border-b border-gray-100">
            {day}
          </div>
        ))}
        {days}
      </div>
    );
  };

  const renderList = () => {
    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        {[currentMonth, new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)].map((m, idx) => (
          <div key={idx} className="space-y-4">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-2 border-l-4 border-[#3E3B6F]">
              {m.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h4>
            <div className="grid gap-4">
              {MOCK_EVENTS.filter(e => e.startDate.getMonth() === m.getMonth()).map(e => (
                <div key={e.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-[#3E3B6F]/30 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="text-center min-w-[60px] p-2 bg-gray-50 rounded-lg">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">{e.startDate.toLocaleDateString('en-US', { month: 'short' })}</p>
                      <p className="text-xl font-bold text-[#3E3B6F]">{e.startDate.getDate()}</p>
                    </div>
                    <div>
                      <h5 className="font-bold text-gray-900 flex items-center gap-2">
                        {e.label}
                        <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase tracking-tighter ${e.type === 'Holiday' ? 'bg-purple-100 text-purple-600' : 'bg-indigo-100 text-indigo-600'}`}>
                          {e.type}
                        </span>
                      </h5>
                      <p className="text-xs text-gray-500 mt-1">
                        {e.startDate.toDateString()} {e.endDate > e.startDate ? ` - ${e.endDate.toDateString()}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {e.status !== 'FIXED' && (
                      <span className={`text-[10px] font-bold px-2 py-1 rounded border ${
                        e.status === LeaveStatus.APPROVED ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {e.status}
                      </span>
                    )}
                    <button className="p-2 text-gray-400 hover:text-[#3E3B6F] opacity-0 group-hover:opacity-100 transition-all">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-[#3E3B6F]">Leave Calendar</h2>
          <p className="text-gray-500">Plan your time off and view upcoming holidays.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-gray-200 rounded-lg p-1">
            <button 
              onClick={() => setView('grid')}
              className={`p-2 rounded ${view === 'grid' ? 'bg-[#3E3B6F] text-white' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              <CalendarIcon size={18} />
            </button>
            <button 
              onClick={() => setView('list')}
              className={`p-2 rounded ${view === 'list' ? 'bg-[#3E3B6F] text-white' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              <ListIcon size={18} />
            </button>
          </div>
          
          <div className="h-8 w-px bg-gray-200 mx-1" />
          
          <div className="flex items-center gap-2">
            <button onClick={handlePrevMonth} className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"><ChevronLeft size={18}/></button>
            <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg font-bold text-gray-700 min-w-[150px] text-center">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
            <button onClick={handleNextMonth} className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"><ChevronRight size={18}/></button>
          </div>
          <button 
            onClick={() => setCurrentMonth(new Date(2025, 1, 1))}
            className="px-4 py-2 text-xs font-bold text-[#3E3B6F] hover:bg-white rounded-lg transition-all"
          >
            Today
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          {view === 'grid' ? renderCalendar() : renderList()}
          
          {view === 'grid' && (
            <div className="mt-8 flex flex-wrap gap-6 items-center bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">Legend:</span>
              {[
                { label: 'Annual', color: 'bg-indigo-600' },
                { label: 'Casual', color: 'bg-amber-600' },
                { label: 'Sick', color: 'bg-red-600' },
                { label: 'Holiday', color: 'bg-purple-500' },
                { label: 'Pending', color: 'stripe-bg-dark border border-gray-200' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded ${item.color}`} />
                  <span className="text-xs font-medium text-gray-600">{item.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Month Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Working Days</span>
                  <span className="font-bold text-gray-900">22</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Leaves Taken</span>
                  <span className="font-bold text-indigo-600">3.5</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Public Holidays</span>
                  <span className="font-bold text-purple-600">1</span>
                </div>
                <div className="pt-3 border-t border-gray-50 flex justify-between text-sm">
                  <span className="font-bold text-gray-800">Net Working</span>
                  <span className="font-bold text-[#3E3B6F]">17.5</span>
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-50">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Upcoming Events</h4>
              <div className="space-y-4">
                {MOCK_EVENTS.filter(e => e.startDate >= new Date(2025, 1, 1)).slice(0, 3).map(e => (
                  <div key={e.id} className="flex gap-3">
                    <div className={`w-1 shrink-0 rounded-full ${getTypeColor(e.type, e.status)}`} />
                    <div>
                      <p className="text-xs font-bold text-gray-800">{e.label}</p>
                      <p className="text-[10px] text-gray-400 uppercase mt-0.5">
                        {e.startDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#3E3B6F] p-8 rounded-2xl text-white relative overflow-hidden shadow-xl">
             <Bot className="absolute bottom-[-10px] right-[-10px] opacity-10" size={100} />
             <div className="relative z-10 space-y-4">
               <h4 className="font-bold text-lg leading-tight">Plan with AI</h4>
               <p className="text-xs text-white/70">Check for team coverage risks or get policy advice for your next break.</p>
               <button className="w-full bg-[#E8D5A3] text-[#3E3B6F] py-2 rounded-lg text-xs font-bold hover:bg-white transition-all">
                 Ask Policy Copilot
               </button>
             </div>
          </div>
        </div>
      </div>

      <style>
        {`
          .stripe-bg {
            background-image: repeating-linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.1) 5px, transparent 5px, transparent 10px);
          }
          .stripe-bg-dark {
            background-image: repeating-linear-gradient(45deg, #f3f4f6, #f3f4f6 5px, #ffffff 5px, #ffffff 10px);
          }
        `}
      </style>
    </div>
  );
};
