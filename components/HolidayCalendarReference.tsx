
import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, List, Globe, ExternalLink, 
  ChevronRight, ChevronLeft, Info, CalendarDays, Settings2,
  Clock, MapPin, Search, Users
} from 'lucide-react';

interface Holiday {
  date: string;
  day: string;
  name: string;
  type: 'Public' | 'Restricted' | 'Optional';
  appliesTo: string;
}

const PAKISTAN_HOLIDAYS_2025: Holiday[] = [
  { date: 'Feb 05, 2025', day: 'Wednesday', name: 'Kashmir Day', type: 'Public', appliesTo: 'All Sites' },
  { date: 'Mar 23, 2025', day: 'Sunday', name: 'Pakistan Day', type: 'Public', appliesTo: 'All Sites' },
  { date: 'Mar 31, 2025', day: 'Monday', name: 'Eid-ul-Fitr*', type: 'Public', appliesTo: 'All Sites' },
  { date: 'Apr 01, 2025', day: 'Tuesday', name: 'Eid-ul-Fitr Holiday*', type: 'Public', appliesTo: 'All Sites' },
  { date: 'May 01, 2025', day: 'Thursday', name: 'Labour Day', type: 'Public', appliesTo: 'All Sites' },
  { date: 'Jun 07, 2025', day: 'Saturday', name: 'Eid-ul-Azha*', type: 'Public', appliesTo: 'All Sites' },
  { date: 'Aug 14, 2025', day: 'Thursday', name: 'Independence Day', type: 'Public', appliesTo: 'All Sites' },
  { date: 'Sep 05, 2025', day: 'Friday', name: 'Eid Milad-un-Nabi*', type: 'Public', appliesTo: 'All Sites' },
  { date: 'Dec 25, 2025', day: 'Thursday', name: 'Quaid-e-Azam Day', type: 'Public', appliesTo: 'All Sites' },
  { date: 'Dec 31, 2025', day: 'Wednesday', name: 'Bank Holiday', type: 'Optional', appliesTo: 'Headquarters' },
];

export const HolidayCalendarReference = () => {
  const [activeTab, setActiveTab] = useState<'holidays' | 'work-calendars'>('holidays');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedYear, setSelectedYear] = useState('2025');

  const getTypeBadge = (type: Holiday['type']) => {
    switch (type) {
      case 'Public': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'Restricted': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Optional': return 'bg-gray-100 text-gray-500 border-gray-200';
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold text-[#3E3B6F]">Holidays & Calendars</h2>
            <span className="px-2.5 py-0.5 bg-indigo-50 text-[#3E3B6F] text-[10px] font-bold uppercase tracking-wider rounded border border-indigo-100 flex items-center gap-1.5">
              <Globe size={12} /> Managed in Flexi HQ
            </span>
          </div>
          <p className="text-gray-500 font-medium">Standard reference for leave calculations and accrual eligibility.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[#3E3B6F]/20 transition-all shadow-sm"
          >
            <option>2025</option>
            <option>2024</option>
          </select>
          <button className="bg-white border border-gray-200 text-[#3E3B6F] px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm">
            Manage Holidays in HQ <ExternalLink size={14} />
          </button>
        </div>
      </div>

      <div className="flex gap-1 p-1.5 bg-gray-200/50 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('holidays')}
          className={`px-8 py-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'holidays' ? 'bg-[#3E3B6F] text-white shadow-lg' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Holidays
        </button>
        <button
          onClick={() => setActiveTab('work-calendars')}
          className={`px-8 py-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'work-calendars' ? 'bg-[#3E3B6F] text-white shadow-lg' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Work Calendars
        </button>
      </div>

      {activeTab === 'holidays' ? (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div className="flex items-center gap-6">
               <div className="space-y-1">
                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Holiday Template</label>
                 <select className="bg-transparent font-bold text-[#3E3B6F] outline-none cursor-pointer text-lg">
                   <option>Pakistan Public Holidays 2025</option>
                   <option>Global Standard Holidays 2025</option>
                 </select>
               </div>
             </div>
             
             <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
               <button 
                 onClick={() => setViewMode('list')}
                 className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-[#3E3B6F] shadow-sm' : 'text-gray-400 hover:bg-gray-50'}`}
               >
                 <List size={20} />
               </button>
               <button 
                 onClick={() => setViewMode('calendar')}
                 className={`p-2 rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-white text-[#3E3B6F] shadow-sm' : 'text-gray-400 hover:bg-gray-50'}`}
               >
                 <CalendarIcon size={20} />
               </button>
             </div>
          </div>

          {viewMode === 'list' ? (
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Day</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Holiday Name</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Applies To</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {PAKISTAN_HOLIDAYS_2025.map((h, i) => (
                      <tr key={i} className="hover:bg-gray-50/30 transition-colors group">
                        <td className="px-8 py-5">
                          <span className="text-sm font-bold text-gray-900">{h.date}</span>
                        </td>
                        <td className="px-8 py-5 text-sm text-gray-500 font-medium">{h.day}</td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                             <div className="w-2 h-2 rounded-full bg-purple-500" />
                             <span className="text-sm font-bold text-gray-800">{h.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getTypeBadge(h.type)}`}>
                            {h.type}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                            <MapPin size={14} className="text-gray-300" /> {h.appliesTo}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
               {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, mIdx) => (
                 <div key={month} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                   <h4 className="text-sm font-bold text-[#3E3B6F] border-b border-gray-50 pb-2">{month}</h4>
                   <div className="grid grid-cols-7 gap-1 text-center">
                     {['S','M','T','W','T','F','S'].map(d => <span key={d} className="text-[8px] font-bold text-gray-300 uppercase">{d}</span>)}
                     {Array.from({ length: 31 }).map((_, dIdx) => {
                        const dayNum = dIdx + 1;
                        const isHoliday = PAKISTAN_HOLIDAYS_2025.some(h => h.date.includes(month.substring(0,3)) && h.date.includes(String(dayNum).padStart(2, '0')));
                        return (
                          <div key={dIdx} className={`w-full aspect-square flex items-center justify-center rounded-lg relative text-[10px] font-medium transition-all ${
                            isHoliday ? 'bg-purple-500 text-white font-bold shadow-sm cursor-help scale-110' : 'text-gray-400 hover:bg-gray-50'
                          }`} title={isHoliday ? "Public Holiday" : ""}>
                            {dayNum}
                          </div>
                        );
                     })}
                   </div>
                 </div>
               ))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Calendar Template</p>
                  <select className="bg-transparent font-bold text-[#3E3B6F] outline-none text-2xl">
                    <option>Standard 5-Day Week</option>
                    <option>Shift Schedule - Group A</option>
                  </select>
                </div>
                <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600">
                   <Settings2 size={32} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                   <div className="flex items-center gap-2 text-[#3E3B6F]">
                     <CalendarDays size={18} />
                     <span className="text-[10px] font-bold uppercase tracking-widest">Weekly Offs</span>
                   </div>
                   <div className="flex flex-wrap gap-2 pt-1">
                      <span className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 shadow-sm">Saturday</span>
                      <span className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 shadow-sm">Sunday</span>
                   </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                   <div className="flex items-center gap-2 text-purple-600">
                     <Info size={18} />
                     <span className="text-[10px] font-bold uppercase tracking-widest">Holiday Template</span>
                   </div>
                   <p className="text-sm font-bold text-gray-800">Pakistan Public 2025</p>
                   <p className="text-xs text-gray-400">10 Annual Days mapped</p>
                </div>

                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                   <div className="flex items-center gap-2 text-emerald-600">
                     <Clock size={18} />
                     <span className="text-[10px] font-bold uppercase tracking-widest">Effective Date</span>
                   </div>
                   <p className="text-sm font-bold text-gray-800">Jan 1, 2025 onwards</p>
                   <p className="text-xs text-gray-400 italic">Continuous versioning active</p>
                </div>

                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                   <div className="flex items-center gap-2 text-amber-600">
                     <Users size={18} />
                     <span className="text-[10px] font-bold uppercase tracking-widest">Employee Count</span>
                   </div>
                   <p className="text-sm font-bold text-gray-800">450 Employees</p>
                   <p className="text-xs text-gray-400 font-medium underline cursor-pointer hover:text-amber-700 transition-colors">View assigned staff</p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex items-start gap-4">
              <Info size={24} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-sm font-bold text-amber-900 mb-1 text-[10px] uppercase tracking-widest">Impact Note</h5>
                <p className="text-sm text-amber-800 leading-relaxed font-medium">
                  These calendars directly affect leave duration calculations. When an employee applies for leave, weekends and holidays marked here will be automatically excluded from their balance deduction based on the organization's policy rules.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#3E3B6F] rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl">
               <div className="relative z-10 space-y-6">
                 <div>
                    <h4 className="text-xl font-bold mb-2">Configuration Hub</h4>
                    <p className="text-white/60 text-sm">Need to add a site-specific holiday or change the weekend policy for a department?</p>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="p-4 bg-white/10 rounded-2xl border border-white/10 group cursor-pointer hover:bg-white/20 transition-all">
                       <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">Upcoming Change</p>
                       <p className="text-sm font-bold flex items-center justify-between">
                         Eid-ul-Fitr dates might shift <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                       </p>
                    </div>
                    <div className="p-4 bg-white/10 rounded-2xl border border-white/10 group cursor-pointer hover:bg-white/20 transition-all">
                       <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">Global Sync</p>
                       <p className="text-sm font-bold flex items-center justify-between">
                         Pull updates from Flexi Global <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                       </p>
                    </div>
                 </div>

                 <button className="w-full bg-[#E8D5A3] text-[#3E3B6F] py-3.5 rounded-2xl font-bold hover:bg-white transition-all shadow-lg">
                   Manage Calendars in HQ →
                 </button>
               </div>
               <CalendarDays size={180} className="absolute -bottom-10 -right-10 opacity-5 -rotate-12" />
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
               <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Audit History</h5>
               <div className="space-y-4 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                  {[
                    { event: 'Calendar Template Revised', date: 'Dec 15, 2024', user: 'Admin' },
                    { event: 'Kashmir Day Added', date: 'Nov 02, 2024', user: 'System' },
                    { event: 'Pakistan Day Fixed', date: 'Jan 05, 2024', user: 'Admin' },
                  ].map((log, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[19px] top-1.5 w-2 h-2 rounded-full bg-gray-300 border-2 border-white" />
                      <p className="text-xs font-bold text-gray-800">{log.event}</p>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">{log.date} • {log.user}</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
