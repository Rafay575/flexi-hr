import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Download, 
  Plus, Clock, AlertCircle, CheckCircle2, 
  Landmark, ShieldCheck, Info, X,
  ArrowRight, CalendarDays
} from 'lucide-react';

type EventType = 'START' | 'CUTOFF' | 'PAYMENT' | 'STATUTORY' | 'HOLIDAY';

interface PayrollEvent {
  id: string;
  date: string;
  type: EventType;
  label: string;
  actionRequired?: string;
}

const EVENT_CONFIG: Record<EventType, { color: string, bg: string, label: string }> = {
  START: { color: 'text-green-600', bg: 'bg-green-500', label: 'Period Start' },
  CUTOFF: { color: 'text-red-600', bg: 'bg-red-500', label: 'Cutoff Date' },
  PAYMENT: { color: 'text-blue-600', bg: 'bg-blue-500', label: 'Payment Date' },
  STATUTORY: { color: 'text-purple-600', bg: 'bg-purple-500', label: 'Statutory Filing' },
  HOLIDAY: { color: 'text-gray-400', bg: 'bg-gray-200', label: 'Public Holiday' },
};

const INITIAL_EVENTS: PayrollEvent[] = [
  { id: '1', date: '2025-01-01', type: 'START', label: 'Jan Cycle Starts' },
  { id: '2', date: '2025-01-05', type: 'HOLIDAY', label: 'Public Holiday' },
  { id: '3', date: '2025-01-10', type: 'STATUTORY', label: 'PF Trust Monthly Deposit', actionRequired: 'Transfer to Trustee Account' },
  { id: '4', date: '2025-01-15', type: 'STATUTORY', label: 'FBR WHT Annex-C Filing', actionRequired: 'Upload Bulk CSV' },
  { id: '5', date: '2025-01-25', type: 'CUTOFF', label: 'Attendance & Variable Cutoff', actionRequired: 'Lock TimeSync Module' },
  { id: '6', date: '2025-01-31', type: 'PAYMENT', label: 'Salary Disbursement', actionRequired: 'Authorize Bank Gateway' },
  { id: '7', date: '2025-02-01', type: 'START', label: 'Feb Cycle Starts' },
  { id: '8', date: '2025-02-05', type: 'HOLIDAY', label: 'Kashmir Day' },
];

export const PayrollCalendar: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [currentMonth, setCurrentMonth] = useState(0); // 0 = Jan
  const [events, setEvents] = useState<PayrollEvent[]>(INITIAL_EVENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<PayrollEvent>>({
    date: '2025-01-01',
    type: 'STATUTORY',
    label: ''
  });

  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();
  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(selectedYear, currentMonth));

  const handleAddEvent = () => {
    if (!newEvent.label || !newEvent.date) return;
    const event: PayrollEvent = {
      id: Math.random().toString(36).substr(2, 9),
      date: newEvent.date as string,
      type: newEvent.type as EventType,
      label: newEvent.label as string,
      actionRequired: newEvent.actionRequired
    };
    setEvents([...events, event]);
    setIsModalOpen(false);
    setNewEvent({ date: '2025-01-01', type: 'STATUTORY', label: '' });
  };

  const renderCalendar = () => {
    const days = [];
    const totalDays = daysInMonth(currentMonth, selectedYear);
    const startOffset = firstDayOfMonth(currentMonth, selectedYear);

    for (let i = 0; i < startOffset; i++) {
      days.push(<div key={`empty-${i}`} className="h-28 bg-gray-50/30 border border-gray-100 opacity-20" />);
    }

    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${selectedYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayEvents = events.filter(e => e.date === dateStr);
      const isToday = new Date().toISOString().split('T')[0] === dateStr;

      days.push(
        <div key={d} className={`h-28 p-2 border border-gray-100 bg-white relative group hover:bg-primary/[0.02] transition-all overflow-hidden ${isToday ? 'ring-2 ring-primary ring-inset' : ''}`}>
          <span className={`text-xs font-black ${isToday ? 'text-primary underline' : 'text-gray-400'}`}>{d}</span>
          <div className="mt-1 space-y-1">
            {dayEvents.map((e, idx) => (
              <div key={idx} className={`w-full h-2 rounded-sm ${EVENT_CONFIG[e.type].bg} shadow-sm border-l-4 border-black/10`} title={e.label} />
            ))}
          </div>
          {dayEvents.length > 0 && (
            <div className="absolute inset-0  bg-white/95 p-2 flex flex-col justify-center transition-opacity z-10 pointer-events-none">
               {dayEvents.map((e, idx) => (
                 <p key={idx} className={`text-[9px] font-black uppercase leading-tight mb-1 truncate ${EVENT_CONFIG[e.type].color}`}>
                   {e.label}
                 </p>
               ))}
            </div>
          )}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20">
            <CalendarIcon size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Governance Calendar</h2>
            <p className="text-sm text-gray-500 font-medium">Compliance milestones and operational deadlines</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-white border border-gray-200 rounded-xl shadow-sm">
            {[2024, 2025, 2026].map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${
                  selectedYear === year ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            <Plus size={18} /> Add Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Calendar View */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[2rem] shadow-md border border-gray-100 overflow-hidden">
            <div className="p-6 border-b bg-gray-50/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setCurrentMonth(prev => (prev === 0 ? 11 : prev - 1))}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <h3 className="text-xl font-black text-gray-800 uppercase tracking-widest min-w-[180px] text-center">
                  {monthName} {selectedYear}
                </h3>
                <button 
                  onClick={() => setCurrentMonth(prev => (prev === 11 ? 0 : prev + 1))}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              <div className="flex gap-4">
                 <button className="text-[10px] font-black text-primary uppercase flex items-center gap-1 hover:underline">
                   <CalendarDays size={14}/> Add To Calendar
                 </button>
                 <button className="text-[10px] font-black text-primary uppercase flex items-center gap-1 hover:underline">
                   <Download size={14}/> Export Schedule
                 </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-px bg-gray-100 grid grid-cols-7 border-b border-gray-100">
               {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                 <div key={d} className="bg-gray-50 p-4 text-center text-[9px] font-black text-gray-400 uppercase tracking-[2px]">
                    {d}
                 </div>
               ))}
               {renderCalendar()}
            </div>

            {/* Legend */}
            <div className="p-6 bg-gray-50 flex flex-wrap gap-6 justify-center">
              {(Object.entries(EVENT_CONFIG) as [EventType, any][]).map(([type, cfg]) => (
                <div key={type} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-sm ${cfg.bg} shadow-sm border border-black/5`} />
                  <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest">{cfg.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Tasks Table */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden flex flex-col flex-1">
              <div className="p-6 border-b bg-primary text-white flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <Clock size={20} className="text-accent" />
                    <h3 className="text-sm font-black uppercase tracking-tight">Action Items</h3>
                 </div>
                 <span className="text-[10px] font-black bg-white/10 px-2 py-0.5 rounded uppercase tracking-tighter">{monthName.substring(0,3)} {selectedYear}</span>
              </div>
              <div className="overflow-y-auto custom-scrollbar divide-y divide-gray-50 max-h-[600px]">
                 {events
                    .filter(e => {
                        const d = new Date(e.date);
                        return d.getMonth() === currentMonth && d.getFullYear() === selectedYear && e.actionRequired;
                    })
                    .map((event) => (
                   <div key={event.id} className="p-6 space-y-4 group hover:bg-gray-50 transition-all">
                      <div className="flex justify-between items-start">
                         <div className="space-y-1">
                            <p className={`text-[10px] font-black uppercase tracking-widest ${EVENT_CONFIG[event.type].color}`}>
                               {EVENT_CONFIG[event.type].label} • {event.date}
                            </p>
                            <h4 className="text-sm font-bold text-gray-800 leading-tight">{event.label}</h4>
                         </div>
                         <button className="p-1.5 text-gray-300 hover:text-primary transition-colors"><ChevronRight size={16}/></button>
                      </div>
                      <div className="p-4 bg-gray-100 rounded-2xl border border-gray-200 group-hover:border-primary/20 group-hover:bg-white transition-all">
                         <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Action Required</p>
                         <p className="text-xs font-bold text-gray-600">{event.actionRequired}</p>
                         <button className="mt-3 flex items-center gap-1.5 text-[10px] font-black text-primary uppercase hover:underline">
                           Execute Task <ArrowRight size={12} />
                         </button>
                      </div>
                   </div>
                 ))}
              </div>
              <div className="p-6 bg-gray-50 border-t mt-auto">
                 <button className="w-full py-3 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm hover:bg-gray-100 transition-all">
                   Full Governance Audit
                 </button>
              </div>
           </div>

           <div className="bg-primary/5 border border-primary/10 p-6 rounded-[2.5rem] space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                 <ShieldCheck size={24} className="text-primary" />
                 <h4 className="text-sm font-black text-primary uppercase tracking-widest">Trust Status</h4>
              </div>
              <div className="space-y-3">
                 <div className="flex justify-between text-xs font-bold">
                    <span className="text-gray-500">Regulatory Sync</span>
                    <span className="text-green-600 uppercase">Live</span>
                 </div>
                 <div className="flex justify-between text-xs font-bold">
                    <span className="text-gray-500">Board Filings</span>
                    <span className="text-orange-500 uppercase">In Queue</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm animate-in fade-in" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
             <div className="px-6 py-4 border-b flex items-center justify-between">
                <h3 className="text-lg font-bold">Add Governance Event</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400"><X size={20}/></button>
             </div>
             <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black uppercase text-gray-500">Event Title</label>
                   <input 
                    type="text" 
                    value={newEvent.label}
                    onChange={e => setNewEvent({...newEvent, label: e.target.value})}
                    placeholder="e.g. FBR Submission" 
                    className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10" 
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-gray-500">Date</label>
                      <input 
                        type="date" 
                        value={newEvent.date}
                        onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm outline-none" 
                      />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-gray-500">Category</label>
                      <select 
                        value={newEvent.type}
                        onChange={e => setNewEvent({...newEvent, type: e.target.value as EventType})}
                        className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-bold outline-none"
                      >
                         <option value="STATUTORY">Statutory</option>
                         <option value="PAYMENT">Payment</option>
                         <option value="CUTOFF">Cutoff</option>
                         <option value="START">Start</option>
                         <option value="HOLIDAY">Holiday</option>
                      </select>
                   </div>
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black uppercase text-gray-500">Action Link (Optional)</label>
                   <input 
                    type="text" 
                    value={newEvent.actionRequired}
                    onChange={e => setNewEvent({...newEvent, actionRequired: e.target.value})}
                    placeholder="e.g. Upload XML to portal" 
                    className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-bold outline-none" 
                   />
                </div>
             </div>
             <div className="p-6 bg-gray-50 border-t flex gap-3">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 bg-white border rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-100">Cancel</button>
                <button onClick={handleAddEvent} className="flex-[2] py-2.5 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90">Add to Calendar</button>
             </div>
          </div>
        </div>
      )}

      {/* Info Footer */}
      <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl flex items-start gap-4">
         <Info size={24} className="text-blue-500 mt-0.5 shrink-0" />
         <div className="space-y-1">
            <h5 className="text-sm font-black text-blue-900 uppercase tracking-tight">Syncing Policy</h5>
            <p className="text-xs text-blue-700 leading-relaxed font-medium">
               The calendar dates are synchronized with the <strong>FBR Finance Act 2024</strong> gazette and provincial holiday notifications for Punjab and Sindh. Changes to 'Pay Date' in the Settings module will auto-update this view.
            </p>
         </div>
      </div>
    </div>
  );
};