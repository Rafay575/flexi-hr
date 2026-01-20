
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, ChevronRight, Download, Filter, Search, 
  Users, MapPin, Calendar as CalendarIcon, List, 
  LayoutGrid, AlertTriangle, CheckCircle2, Info, X, ChevronDown
} from 'lucide-react';
import { LeaveType, LeaveStatus } from '../types';

interface OrgLeaveEntry {
  id: string;
  name: string;
  avatar: string;
  dept: string;
  type: LeaveType;
  status: LeaveStatus;
  startDate: string;
  endDate: string;
}

const DEPARTMENTS = ['Engineering', 'Product', 'Design', 'Sales', 'HR', 'Finance', 'Marketing'];

// Generate mock data for a large organization
const generateMockOrgData = () => {
  const data: OrgLeaveEntry[] = [];
  const names = ['Ali', 'Zoya', 'Hamza', 'Bina', 'Sara', 'Ahmed', 'John', 'Mona', 'Raza', 'Fatima'];
  
  for (let i = 1; i <= 60; i++) {
    const startDay = Math.floor(Math.random() * 28) + 1;
    const duration = Math.floor(Math.random() * 5) + 1;
    data.push({
      id: `LV-${1000 + i}`,
      name: `${names[i % 10]} ${String.fromCharCode(65 + (i % 26))}.`,
      avatar: names[i % 10].substring(0, 1) + String.fromCharCode(65 + (i % 26)),
      dept: DEPARTMENTS[i % DEPARTMENTS.length],
      type: [LeaveType.ANNUAL, LeaveType.SICK, LeaveType.CASUAL][i % 3] as LeaveType,
      status: i % 5 === 0 ? LeaveStatus.PENDING : LeaveStatus.APPROVED,
      startDate: `2025-02-${String(startDay).padStart(2, '0')}`,
      endDate: `2025-02-${String(startDay + duration).padStart(2, '0')}`,
    });
  }
  return data;
};

const MOCK_ORG_DATA = generateMockOrgData();

export const OrgLeaveCalendar = () => {
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [currentMonth] = useState(new Date(2025, 1, 1)); // Feb 2025
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [deptFilter, setDeptFilter] = useState('All');

  const totalDays = new Date(2025, 2, 0).getDate();
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);

  const getDayData = (day: number) => {
    const dateStr = `2025-02-${String(day).padStart(2, '0')}`;
    return MOCK_ORG_DATA.filter(l => dateStr >= l.startDate && dateStr <= l.endDate);
  };

  const getBreakdown = (dayEntries: OrgLeaveEntry[]) => {
    return {
      annual: dayEntries.filter(e => e.type === LeaveType.ANNUAL).length,
      sick: dayEntries.filter(e => e.type === LeaveType.SICK).length,
      casual: dayEntries.filter(e => e.type === LeaveType.CASUAL).length,
      total: dayEntries.length
    };
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-[#3E3B6F]">Organization Leave Calendar</h2>
          <p className="text-gray-500">Global view of employee availability and absence trends.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            {['month', 'week', 'day'].map((v) => (
              <button 
                key={v}
                onClick={() => setView(v as any)}
                className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all ${view === v ? 'bg-[#3E3B6F] text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
              >
                {v}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-xl">
             <button className="p-1 hover:bg-gray-100 rounded-lg text-gray-400"><ChevronLeft size={18}/></button>
             <span className="text-sm font-bold text-gray-700 min-w-[120px] text-center">February 2025</span>
             <button className="p-1 hover:bg-gray-100 rounded-lg text-gray-400"><ChevronRight size={18}/></button>
          </div>

          <button className="bg-[#3E3B6F] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-[#3E3B6F]/10">
            <Download size={18} /> Export Org Data
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400 px-2 border-r border-gray-100 mr-2">
              <Filter size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Filters</span>
            </div>
            <select 
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="bg-gray-50 border border-transparent rounded-lg px-3 py-1.5 text-xs font-bold text-gray-600 outline-none focus:bg-white focus:border-gray-200"
            >
              <option value="All">All Departments</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select className="bg-gray-50 border border-transparent rounded-lg px-3 py-1.5 text-xs font-bold text-gray-600 outline-none focus:bg-white focus:border-gray-200">
              <option>All Sites</option>
              <option>Headquarters</option>
              <option>Remote Hub</option>
            </select>
            <div className="flex-1" />
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input type="text" placeholder="Search employee..." className="bg-gray-50 border border-transparent rounded-lg pl-9 pr-4 py-1.5 text-xs outline-none focus:bg-white focus:border-gray-200 w-48" />
            </div>
          </div>

          {/* Month View Grid */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="grid grid-cols-7 bg-gray-50/80 border-b border-gray-100">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="py-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {/* Padding for Feb 2025 start (starts on Sat) */}
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={`p-${i}`} className="h-32 border-b border-r border-gray-50 bg-gray-50/20" />
              ))}
              {days.map(d => {
                const dayEntries = getDayData(d);
                const stats = getBreakdown(dayEntries);
                const isHighAbsence = stats.total > 15;
                const isWeekend = new Date(2025, 1, d).getDay() === 0 || new Date(2025, 1, d).getDay() === 6;
                const isHoliday = d === 5; // Feb 5
                
                return (
                  <div 
                    key={d} 
                    onClick={() => setSelectedDate(d)}
                    className={`h-32 border-b border-r border-gray-50 p-3 transition-all cursor-pointer group relative
                      ${isHighAbsence ? 'bg-red-50/50' : isHoliday ? 'bg-purple-50/50' : isWeekend ? 'bg-gray-50/30' : 'bg-white hover:bg-indigo-50/30'}
                    `}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-xs font-bold ${isWeekend ? 'text-gray-300' : 'text-gray-800'}`}>{d}</span>
                      {stats.total > 0 && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isHighAbsence ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-[#3E3B6F]'}`}>
                          {stats.total}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      {stats.total > 0 ? (
                        <>
                          <div className="flex gap-1">
                            {stats.annual > 0 && <div className="h-1 flex-1 bg-indigo-500 rounded-full" title={`Annual: ${stats.annual}`} />}
                            {stats.sick > 0 && <div className="h-1 flex-1 bg-red-500 rounded-full" title={`Sick: ${stats.sick}`} />}
                            {stats.casual > 0 && <div className="h-1 flex-1 bg-amber-500 rounded-full" title={`Casual: ${stats.casual}`} />}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                             {dayEntries.slice(0, 3).map(e => (
                               <div key={e.id} className="w-4 h-4 rounded-full bg-accent-peach border border-white flex items-center justify-center text-[6px] font-bold text-[#3E3B6F]">
                                 {e.avatar}
                               </div>
                             ))}
                             {stats.total > 3 && <span className="text-[7px] font-bold text-gray-400">+{stats.total - 3}</span>}
                          </div>
                        </>
                      ) : isHoliday ? (
                        <div className="text-[9px] font-bold text-purple-600 flex items-center gap-1"><Info size={10} /> Kashmir Day</div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Panel */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global Stats</h4>
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-[#3E3B6F] rounded-lg"><Users size={18}/></div>
                  <span className="text-xs font-medium text-gray-600">On Leave Today</span>
                </div>
                <span className="text-sm font-bold text-gray-900">14</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Info size={18}/></div>
                  <span className="text-xs font-medium text-gray-600">Pending Org-wide</span>
                </div>
                <span className="text-sm font-bold text-gray-900">84</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle2 size={18}/></div>
                  <span className="text-xs font-medium text-gray-600">Weekly Avg.</span>
                </div>
                <span className="text-sm font-bold text-gray-900">12/day</span>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-50">
               <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Coverage Alerts</h4>
               <div className="space-y-3">
                 <div className="p-3 bg-red-50 rounded-xl border border-red-100 space-y-2">
                   <div className="flex items-center gap-2 text-red-600 font-bold text-[10px] uppercase">
                     <AlertTriangle size={14}/> Critical Absence
                   </div>
                   <p className="text-[10px] text-red-800 font-medium leading-relaxed">
                     Engineering has 35% of team off on Feb 12th.
                   </p>
                 </div>
                 <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 space-y-2">
                   <div className="flex items-center gap-2 text-amber-600 font-bold text-[10px] uppercase">
                     <Info size={14}/> Mid Absence
                   </div>
                   <p className="text-[10px] text-amber-800 font-medium leading-relaxed">
                     Product Team coverage dropping below 70% next week.
                   </p>
                 </div>
               </div>
            </div>
          </div>

          <div className="bg-primary-gradient p-8 rounded-3xl text-white relative overflow-hidden">
             <div className="relative z-10 space-y-4">
               <h4 className="font-bold text-lg leading-tight">Insight Generator</h4>
               <p className="text-xs text-white/70">Analyze seasonal trends and project year-end leave liability for Finance.</p>
               <button className="w-full bg-[#E8D5A3] text-[#3E3B6F] py-2.5 rounded-xl text-xs font-bold hover:bg-white transition-all shadow-lg shadow-black/10">
                 Download Trend Report
               </button>
             </div>
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          </div>
        </div>
      </div>

      {/* Day Drill-down Modal */}
      {selectedDate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedDate(null)} />
          <div className="relative bg-[#F5F5F5] rounded-[32px] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in duration-200">
            <div className="bg-white p-8 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-[#3E3B6F]">February {selectedDate}, 2025</h3>
                <p className="text-sm text-gray-500 font-medium">Daily Breakdown & Employee Status</p>
              </div>
              <button onClick={() => setSelectedDate(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Off</p>
                   <p className="text-2xl font-bold text-gray-900">{getDayData(selectedDate).length}</p>
                 </div>
                 <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center">
                   <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Annual</p>
                   <p className="text-2xl font-bold text-indigo-600">{getBreakdown(getDayData(selectedDate)).annual}</p>
                 </div>
                 <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center">
                   <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">Sick</p>
                   <p className="text-2xl font-bold text-red-600">{getBreakdown(getDayData(selectedDate)).sick}</p>
                 </div>
                 <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center">
                   <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Org Coverage</p>
                   <p className="text-2xl font-bold text-emerald-600">{Math.round(100 - (getDayData(selectedDate).length / 500 * 100))}%</p>
                 </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
                   <h5 className="text-sm font-bold text-gray-700">Employees on Leave</h5>
                   <button className="text-xs font-bold text-[#3E3B6F] flex items-center gap-1">
                     Export List <Download size={14} />
                   </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50/30">
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Employee</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Department</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Duration</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {getDayData(selectedDate).map((e) => (
                        <tr key={e.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-accent-peach flex items-center justify-center font-bold text-[#3E3B6F] text-[10px]">{e.avatar}</div>
                              <span className="text-xs font-bold text-gray-800">{e.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-medium text-gray-500">{e.dept}</td>
                          <td className="px-6 py-4 text-xs font-bold text-indigo-600">{e.type}</td>
                          <td className="px-6 py-4 text-xs font-bold text-gray-700 text-right">3 Days</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${e.status === LeaveStatus.APPROVED ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                              {e.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          .stripe-bg-dark {
            background-image: repeating-linear-gradient(45deg, #f3f4f6, #f3f4f6 5px, #ffffff 5px, #ffffff 10px);
          }
        `}
      </style>
    </div>
  );
};
