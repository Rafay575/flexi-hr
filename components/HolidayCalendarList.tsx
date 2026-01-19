
import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Search, 
  MapPin, 
  Users, 
  MoreVertical, 
  ChevronRight, 
  Edit3, 
  Copy, 
  UserPlus, 
  Eye,
  X,
  ChevronLeft,
  CalendarDays,
  Globe,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Building2,
  Clock,
  // Fix: Added missing Info icon import
  Info
} from 'lucide-react';

type HolidayType = 'PUBLIC' | 'RESTRICTED' | 'COMPANY' | 'OPTIONAL';

interface Holiday {
  id: string;
  date: string;
  name: string;
  type: HolidayType;
  recurring: boolean;
}

interface HolidayCalendar {
  id: string;
  name: string;
  year: number;
  holidayCount: number;
  sites: string[];
  employeeCount: number;
  status: 'ACTIVE' | 'DRAFT';
  holidays: Holiday[];
}

const TYPE_CONFIG: Record<HolidayType, { label: string; color: string }> = {
  PUBLIC: { label: 'Public Holiday', color: 'bg-purple-50 text-purple-600 border-purple-100' },
  RESTRICTED: { label: 'Restricted Holiday', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  COMPANY: { label: 'Company Holiday', color: 'bg-green-50 text-green-600 border-green-100' },
  OPTIONAL: { label: 'Optional Holiday', color: 'bg-gray-50 text-gray-600 border-gray-100' },
};

const MOCK_CALENDARS: HolidayCalendar[] = [
  { 
    id: 'CAL-2025-PK', 
    name: 'Pakistan Standard Holidays 2025', 
    year: 2025, 
    holidayCount: 14, 
    sites: ['Karachi HQ', 'Lahore Site', 'Islamabad'], 
    employeeCount: 1250, 
    status: 'ACTIVE',
    holidays: [
      { id: 'H1', date: '2025-02-05', name: 'Kashmir Day', type: 'PUBLIC', recurring: true },
      { id: 'H2', date: '2025-03-23', name: 'Pakistan Day', type: 'PUBLIC', recurring: true },
      { id: 'H3', date: '2025-05-01', name: 'Labour Day', type: 'PUBLIC', recurring: true },
      { id: 'H4', date: '2025-08-14', name: 'Independence Day', type: 'PUBLIC', recurring: true },
      { id: 'H5', date: '2025-11-09', name: 'Iqbal Day', type: 'PUBLIC', recurring: true },
      { id: 'H6', date: '2025-12-25', name: 'Quaid-e-Azam Day', type: 'PUBLIC', recurring: true },
      { id: 'H7', date: '2025-03-31', name: 'Eid-ul-Fitr Day 1', type: 'PUBLIC', recurring: false },
      { id: 'H8', date: '2025-04-01', name: 'Eid-ul-Fitr Day 2', type: 'PUBLIC', recurring: false },
    ]
  },
  { 
    id: 'CAL-2025-UK', 
    name: 'UK/Europe Engineering', 
    year: 2025, 
    holidayCount: 8, 
    sites: ['London Hub'], 
    employeeCount: 45, 
    status: 'ACTIVE',
    holidays: []
  }
];

export const HolidayCalendarList: React.FC = () => {
  const [view, setView] = useState<'LIST' | 'DETAIL'>('LIST');
  const [selectedCalendar, setSelectedCalendar] = useState<HolidayCalendar | null>(null);
  const [isAddHolidayOpen, setIsAddHolidayOpen] = useState(false);
  const [isCreateCalendarOpen, setIsCreateCalendarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCalendars = MOCK_CALENDARS.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (cal: HolidayCalendar) => {
    setSelectedCalendar(cal);
    setView('DETAIL');
  };

  const getDayName = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {view === 'LIST' ? (
        <>
          {/* HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
                <CalendarDays className="text-[#3E3B6F]" size={28} /> Holiday Calendars
              </h2>
              <p className="text-sm text-gray-500 font-medium italic mt-1">Configure regional and site-specific holiday schedules</p>
            </div>
            <div className="flex items-center gap-3">
              <select className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-600 outline-none shadow-sm focus:ring-4 focus:ring-[#3E3B6F]/5">
                <option>Year: 2025</option>
                <option>Year: 2024</option>
              </select>
              <button 
                onClick={() => setIsCreateCalendarOpen(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <Plus size={18} /> Create Calendar
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-50 flex items-center gap-4">
               <div className="relative flex-1 max-w-md">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                 <input 
                  type="text" 
                  placeholder="Search calendars..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#3E3B6F]/10 outline-none" 
                 />
               </div>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50">
                  <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                    <th className="px-8 py-5">Calendar Name</th>
                    <th className="px-6 py-5 text-center">Year</th>
                    <th className="px-6 py-5">Holidays</th>
                    <th className="px-6 py-5">Assigned Sites</th>
                    <th className="px-6 py-5 text-center">Employees</th>
                    <th className="px-6 py-5">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredCalendars.map((cal) => (
                    <tr key={cal.id} className="group hover:bg-gray-50/80 transition-all cursor-default">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                            <Globe size={18} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-800">{cal.name}</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase">{cal.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="text-sm font-black text-[#3E3B6F] tabular-nums">{cal.year}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-purple-50 text-purple-600 text-[10px] font-bold border border-purple-100">
                          <Calendar size={12} /> {cal.holidayCount} Holidays
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 max-w-[200px]">
                          <MapPin size={14} className="text-gray-300 shrink-0" />
                          <span className="text-[11px] font-medium text-gray-600 truncate">
                            {cal.sites.join(', ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-lg text-xs font-black text-gray-500 tabular-nums">
                          <Users size={12} /> {cal.employeeCount}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          cal.status === 'ACTIVE' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                        }`}>
                          {cal.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={() => handleViewDetails(cal)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all" title="View Details"><Eye size={16}/></button>
                          <button className="p-2 text-gray-400 hover:text-[#3E3B6F] hover:bg-white rounded-lg transition-all" title="Edit"><Edit3 size={16}/></button>
                          <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-white rounded-lg transition-all" title="Apply to Employees"><UserPlus size={16}/></button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all" title="Clone"><Copy size={16}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="animate-in slide-in-from-right duration-500">
          {/* DETAIL VIEW */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setView('LIST')}
                className="p-2.5 bg-white border border-gray-200 text-gray-400 rounded-xl hover:text-[#3E3B6F] hover:bg-gray-50 transition-all shadow-sm"
              >
                <ChevronLeft size={20} />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 tracking-tight">{selectedCalendar?.name}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-widest">{selectedCalendar?.year} Calendar</span>
                  <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1 uppercase tracking-widest">
                    <MapPin size={12} /> {selectedCalendar?.sites.join(' • ')}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
               <button 
                onClick={() => setIsAddHolidayOpen(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all"
               >
                 <Plus size={18} /> Add Holiday
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* MINI MONTH VIEW GRID */}
            <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
               <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                 <Calendar size={16} /> Year Planner Overview
               </h3>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                 {Array.from({ length: 12 }).map((_, m) => (
                   <div key={m} className="space-y-3">
                     <p className="text-[10px] font-black text-[#3E3B6F] uppercase tracking-widest border-b border-gray-50 pb-2">
                       {new Date(2025, m, 1).toLocaleString('default', { month: 'long' })}
                     </p>
                     <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: 31 }).map((_, d) => {
                          const date = new Date(2025, m, d + 1);
                          if (date.getMonth() !== m) return null;
                          const isHoliday = selectedCalendar?.holidays.some(h => h.date === date.toISOString().split('T')[0]);
                          return (
                            <div 
                              key={d} 
                              className={`aspect-square flex items-center justify-center text-[9px] font-bold rounded-md ${
                                isHoliday ? 'bg-purple-500 text-white shadow-sm ring-2 ring-purple-100' : 
                                (date.getDay() === 0 || date.getDay() === 6) ? 'text-red-400 bg-red-50/30' : 'text-gray-400 hover:bg-gray-50'
                              }`}
                            >
                              {d + 1}
                            </div>
                          );
                        })}
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            {/* HOLIDAY LIST */}
            <div className="space-y-6">
               <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                    <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                      <Clock className="text-purple-500" size={16} /> Holiday Schedule
                    </h3>
                    <span className="text-[10px] font-black text-gray-400 bg-white px-2 py-1 rounded border border-gray-100 uppercase tracking-tighter">{selectedCalendar?.holidayCount} Events</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Holiday Name</th>
                          <th className="px-4 py-3">Type</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {selectedCalendar?.holidays.map((h) => (
                          <tr key={h.id} className="group hover:bg-gray-50 transition-all">
                            <td className="px-4 py-4">
                              <div className="flex flex-col">
                                <span className="text-[10px] font-black text-gray-800 tabular-nums">{new Date(h.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                                <span className="text-[8px] font-bold text-gray-400 uppercase">{getDayName(h.date).slice(0, 3)}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <p className="text-[11px] font-bold text-gray-700">{h.name}</p>
                              {h.recurring && <span className="text-[7px] text-indigo-500 font-black uppercase tracking-tighter">● RECURRING</span>}
                            </td>
                            <td className="px-4 py-4">
                               <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter border ${TYPE_CONFIG[h.type].color}`}>
                                 {h.type}
                               </span>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 justify-end transition-all">
                                <button className="p-1.5 text-gray-300 hover:text-[#3E3B6F]"><Edit3 size={12}/></button>
                                <button className="p-1.5 text-gray-300 hover:text-red-500"><Trash2 size={12}/></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </div>

               <div className="bg-[#3E3B6F] rounded-3xl p-6 text-white shadow-xl shadow-[#3E3B6F]/20 relative overflow-hidden group">
                  <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                    <CheckCircle2 size={120} />
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-[#E8D5A3]">
                    <AlertCircle size={16} /> Compliance Check
                  </h4>
                  <p className="text-[11px] text-white/70 leading-relaxed font-medium mb-4">
                    All public holidays listed match the 2025 Government Gazette. Employees will be restricted from punching in on these dates unless specific "Work on Holiday" OT is authorized.
                  </p>
                  <button className="text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 py-2 px-4 rounded-xl transition-all border border-white/10">
                    Run Compliance Audit
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE CALENDAR MODAL */}
      {isCreateCalendarOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsCreateCalendarOpen(false)}></div>
          <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center text-white shadow-lg">
                    <Globe size={20} />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-gray-800">Create New Calendar</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Setup regional schedule</p>
                 </div>
              </div>
              <button onClick={() => setIsCreateCalendarOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400"><X size={24}/></button>
            </div>

            <div className="p-8 space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Calendar Name *</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none" placeholder="e.g. Saudi HQ Standard 2025" />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fiscal Year *</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none">
                       <option>2025</option>
                       <option>2026</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Primary Site</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none">
                       <option>Karachi HQ</option>
                       <option>Lahore Site</option>
                       <option>International</option>
                    </select>
                  </div>
               </div>

               <div className="flex items-start gap-3 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                  <Info size={18} className="text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-indigo-700">Import Templates</p>
                    <p className="text-[10px] text-indigo-600/80 leading-relaxed">You can choose to pre-fill this calendar with official gazette holidays for the selected country.</p>
                    <button className="mt-2 text-[9px] font-black text-indigo-800 uppercase tracking-widest underline underline-offset-4">Select Gazette Country</button>
                  </div>
               </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4 shrink-0">
               <button onClick={() => setIsCreateCalendarOpen(false)} className="flex-1 py-3 bg-white border border-gray-200 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">
                 Cancel
               </button>
               <button className="flex-[2] py-3 bg-[#3E3B6F] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all">
                 Initialize Calendar
               </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD HOLIDAY MODAL */}
      {isAddHolidayOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsAddHolidayOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center text-white shadow-lg">
                    <Calendar size={20} />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-gray-800">Add New Holiday</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Entry Wizard</p>
                 </div>
              </div>
              <button onClick={() => setIsAddHolidayOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400"><X size={24}/></button>
            </div>

            <div className="p-8 space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Holiday Name *</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none" placeholder="e.g. Independence Day" />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date *</label>
                    <input type="date" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none">
                       <option>Public Holiday</option>
                       <option>Restricted Holiday</option>
                       <option>Company Holiday</option>
                       <option>Optional Holiday</option>
                    </select>
                  </div>
               </div>

               <div className="flex items-center justify-between p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                  <div className="flex items-center gap-3">
                     <CalendarDays size={18} className="text-[#3E3B6F]" />
                     <div>
                       <p className="text-xs font-bold text-[#3E3B6F]">Recurring Holiday</p>
                       <p className="text-[9px] text-gray-500 font-medium italic">Apply to the same date every year automatically.</p>
                     </div>
                  </div>
                  <div className="w-10 h-5 bg-[#3E3B6F] rounded-full relative p-1 cursor-pointer">
                    <div className="w-3 h-3 bg-white rounded-full absolute right-1"></div>
                  </div>
               </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4 shrink-0">
               <button onClick={() => setIsAddHolidayOpen(false)} className="flex-1 py-3 bg-white border border-gray-200 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">
                 Cancel
               </button>
               <button className="flex-[2] py-3 bg-[#3E3B6F] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all">
                 Create Holiday
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
