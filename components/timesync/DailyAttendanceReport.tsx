
import React, { useState, useMemo } from 'react';
import { 
  FileBarChart, 
  Search, 
  Filter, 
  Download, 
  ChevronRight, 
  Clock, 
  UserCheck, 
  UserMinus, 
  Plane, 
  Coffee, 
  AlertTriangle, 
  Timer,
  PieChart as PieChartIcon,
  BarChart3,
  Calendar,
  ChevronDown,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  ExternalLink,
  MoreVertical,
  // Added missing icon imports
  ArrowRight,
  Zap,
  ShieldCheck
} from 'lucide-react';

type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LEAVE' | 'OFF' | 'LATE' | 'EARLY_OUT';

interface EmployeeAttendance {
  id: string;
  name: string;
  avatar: string;
  dept: string;
  shift: string;
  inTime: string;
  outTime: string;
  hours: string;
  break: string;
  status: AttendanceStatus;
  ot: string;
  issues: string[];
}

const STATUS_UI: Record<AttendanceStatus, { label: string; color: string; dot: string }> = {
  PRESENT: { label: 'Present', color: 'text-green-600 bg-green-50 border-green-100', dot: 'bg-green-500' },
  ABSENT: { label: 'Absent', color: 'text-red-600 bg-red-50 border-red-100', dot: 'bg-red-500' },
  LEAVE: { label: 'Leave', color: 'text-blue-600 bg-blue-50 border-blue-100', dot: 'bg-blue-500' },
  OFF: { label: 'Off Day', color: 'text-gray-500 bg-gray-50 border-gray-200', dot: 'bg-gray-400' },
  LATE: { label: 'Late', color: 'text-orange-600 bg-orange-50 border-orange-100', dot: 'bg-orange-500' },
  EARLY_OUT: { label: 'Early Out', color: 'text-amber-600 bg-amber-50 border-amber-100', dot: 'bg-amber-500' },
};

const MOCK_DATA: EmployeeAttendance[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `EMP-${1000 + i}`,
  name: ['Sarah Jenkins', 'Michael Chen', 'Amara Okafor', 'David Miller', 'Elena Rodriguez', 'Ahmed Khan'][i % 6],
  avatar: ['SJ', 'MC', 'AO', 'DM', 'ER', 'AK'][i % 6],
  dept: ['Engineering', 'Marketing', 'Sales', 'HR', 'Product', 'Finance'][i % 6],
  shift: '09:00 - 18:00',
  inTime: i % 10 === 0 ? '09:25 AM' : '08:55 AM',
  outTime: i % 8 === 0 ? '05:00 PM' : '06:15 PM',
  hours: '8.5h',
  break: '1h',
  status: i % 15 === 0 ? 'ABSENT' : i % 12 === 0 ? 'LEAVE' : i % 10 === 0 ? 'LATE' : i % 8 === 0 ? 'EARLY_OUT' : 'PRESENT',
  ot: i % 5 === 0 ? '1.5h' : '0h',
  issues: i % 10 === 0 ? ['Late arrival'] : i % 8 === 0 ? ['Early exit'] : []
}));

export const DailyAttendanceReport: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'TABLE' | 'CHARTS'>('TABLE');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    return MOCK_DATA.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = selectedDept === 'All Departments' || item.dept === selectedDept;
      return matchesSearch && matchesDept;
    });
  }, [searchQuery, selectedDept]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <FileBarChart className="text-[#3E3B6F]" size={28} /> Daily Attendance Report
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Real-time workforce presence and adherence metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            <button className="px-4 py-2 text-xs font-bold text-[#3E3B6F] hover:bg-gray-50 rounded-lg transition-all flex items-center gap-2">
              <Calendar size={14} /> Jan 10, 2025
            </button>
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all">
            <Download size={18} /> Export Excel
          </button>
        </div>
      </div>

      {/* SUMMARY STATS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Present', val: '420', pct: '84%', icon: <UserCheck size={18}/>, color: 'bg-green-500' },
          { label: 'Absent', val: '30', pct: '6%', icon: <UserMinus size={18}/>, color: 'bg-red-500' },
          { label: 'On Leave', val: '35', pct: '7%', icon: <Plane size={18}/>, color: 'bg-blue-500' },
          { label: 'Off Day', val: '15', pct: '3%', icon: <Coffee size={18}/>, color: 'bg-gray-400' },
          { label: 'Late', val: '45', alert: true, icon: <Timer size={18}/>, color: 'bg-orange-500' },
          { label: 'Early Out', val: '12', alert: true, icon: <AlertTriangle size={18}/>, color: 'bg-amber-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm group hover:shadow-md transition-all">
            <div className="flex justify-between items-center mb-3">
              <div className={`p-2 rounded-lg text-white ${stat.color} shadow-sm group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              {stat.pct && <span className="text-[10px] font-black text-gray-400 tabular-nums">{stat.pct}</span>}
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
            <h3 className={`text-xl font-black ${stat.alert ? 'text-orange-600' : 'text-gray-800'}`}>{stat.val}</h3>
          </div>
        ))}
      </div>

      {/* MAIN CONTENT CARD */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        {/* TABS & SEARCH */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex bg-white border border-gray-200 rounded-xl p-1 shrink-0">
             <button 
              onClick={() => setActiveTab('TABLE')}
              className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'TABLE' ? 'bg-[#3E3B6F] text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
             >
               Table View
             </button>
             <button 
              onClick={() => setActiveTab('CHARTS')}
              className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'CHARTS' ? 'bg-[#3E3B6F] text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
             >
               Analytics
             </button>
          </div>

          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search staff..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium outline-none focus:ring-4 focus:ring-[#3E3B6F]/5" 
              />
            </div>
            <select 
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold text-gray-600 outline-none"
            >
              <option>All Departments</option>
              <option>Engineering</option>
              <option>Marketing</option>
              <option>Sales</option>
              <option>HR</option>
            </select>
            <button className="p-2 text-gray-400 hover:text-[#3E3B6F] bg-white border border-gray-100 rounded-xl transition-all"><Filter size={18}/></button>
          </div>
        </div>

        {activeTab === 'TABLE' ? (
          <div className="overflow-x-auto custom-scrollbar flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-gray-50/90 backdrop-blur-md">
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  <th className="px-8 py-4">Employee</th>
                  <th className="px-6 py-4">Dept</th>
                  <th className="px-6 py-4">Shift</th>
                  <th className="px-6 py-4">In / Out</th>
                  <th className="px-6 py-4 text-center">Hours</th>
                  <th className="px-6 py-4 text-center">Break</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">OT</th>
                  <th className="px-6 py-4">Issues</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredData.map((emp) => (
                  <tr key={emp.id} className="group hover:bg-gray-50/80 transition-all cursor-default">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary-gradient flex items-center justify-center text-white text-[10px] font-black shadow-lg">
                          {emp.avatar}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-800">{emp.name}</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tabular-nums">{emp.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[11px] font-medium text-gray-500">{emp.dept}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[11px] font-bold text-gray-400 tabular-nums">{emp.shift}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-[11px] font-black text-gray-700 tabular-nums">
                        <span>{emp.inTime}</span>
                        {/* Corrected: ArrowRight is now imported */}
                        <ArrowRight size={10} className="text-gray-300"/>
                        <span className={emp.outTime === '--' ? 'text-gray-300 italic' : ''}>{emp.outTime}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-xs font-black text-[#3E3B6F] tabular-nums">{emp.hours}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-[11px] font-bold text-gray-500 tabular-nums">{emp.break}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${STATUS_UI[emp.status].color}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${STATUS_UI[emp.status].dot} ${emp.status === 'PRESENT' ? 'animate-pulse' : ''}`} />
                        {STATUS_UI[emp.status].label}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-[10px] font-black ${emp.ot !== '0h' ? 'text-green-600 underline underline-offset-4 decoration-green-200' : 'text-gray-300'}`}>{emp.ot}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {emp.issues.map((issue, idx) => (
                          <span key={idx} className="bg-red-50 text-red-500 text-[8px] font-black uppercase px-2 py-0.5 rounded border border-red-100 whitespace-nowrap">
                            {issue}
                          </span>
                        )) || <span className="text-gray-200">—</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10 overflow-y-auto custom-scrollbar flex-1">
            {/* STATUS PIE CHART MOCKUP */}
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 flex flex-col items-center">
               <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-10 flex items-center gap-2">
                 <PieChartIcon size={16} className="text-[#3E3B6F]" /> Status Distribution
               </h3>
               <div className="relative w-64 h-64 mb-10">
                  <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#10B981" strokeWidth="3" strokeDasharray="84 16" />
                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#EF4444" strokeWidth="3" strokeDasharray="6 94" strokeDashoffset="-84" />
                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#3B82F6" strokeWidth="3" strokeDasharray="7 93" strokeDashoffset="-90" />
                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#F59E0B" strokeWidth="3" strokeDasharray="3 97" strokeDashoffset="-97" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <p className="text-3xl font-black text-gray-800">500</p>
                     <p className="text-[10px] font-bold text-gray-400 uppercase">Total Workforce</p>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-x-8 gap-y-3 w-full max-w-sm">
                  {Object.entries(STATUS_UI).slice(0, 4).map(([key, cfg]) => (
                    <div key={key} className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                          <span className="text-[10px] font-bold text-gray-500 uppercase">{cfg.label}</span>
                       </div>
                       <span className="text-[10px] font-black text-gray-800">84%</span>
                    </div>
                  ))}
               </div>
            </div>

            {/* HOURLY PRESENCE LINE CHART MOCKUP */}
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp size={16} className="text-[#3E3B6F]" /> Hourly Presence Curve
                  </h3>
                  <span className="text-[9px] font-black text-green-600 bg-green-50 px-2 py-1 rounded">PEAK: 11:00 AM</span>
               </div>
               <div className="h-64 flex items-end justify-between gap-1 relative border-b border-l border-gray-200 pt-10">
                  {Array.from({ length: 12 }).map((_, i) => {
                    const h = [5, 20, 85, 98, 95, 80, 75, 95, 85, 60, 40, 10][i];
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                         <div style={{ height: `${h}%` }} className="w-full bg-[#3E3B6F]/20 border-t-2 border-[#3E3B6F] relative group-hover:bg-[#3E3B6F]/40 transition-all">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#3E3B6F] shadow-sm"></div>
                         </div>
                         <span className="text-[8px] font-black text-gray-400 mt-2 uppercase">{8 + i}h</span>
                      </div>
                    )
                  })}
               </div>
               <div className="mt-8 p-4 bg-white rounded-2xl border border-gray-100 flex items-center gap-4">
                  {/* Corrected: Zap is now imported */}
                  <Zap size={20} className="text-amber-500" />
                  <p className="text-[10px] text-gray-600 font-medium leading-relaxed">
                    System suggests adjusting lunch window for <span className="font-bold">Operations Dept</span> to improve headcount continuity between 1 PM and 2 PM.
                  </p>
               </div>
            </div>

            {/* DEPT COMPARISON BAR CHART */}
            <div className="lg:col-span-2 bg-gray-50 rounded-3xl p-8 border border-gray-100 space-y-8">
               <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <BarChart3 size={16} className="text-[#3E3B6F]" /> Department Adherence Comparison
                  </h3>
                  <div className="flex gap-4">
                     <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#3E3B6F]"></div><span className="text-[9px] font-black text-gray-400 uppercase">On-Time</span></div>
                     <div className={`flex items-center gap-1.5`}><div className="w-2 h-2 rounded-full bg-orange-400"></div><span className="text-[9px] font-black text-gray-400 uppercase">Late</span></div>
                  </div>
               </div>
               <div className="space-y-5">
                  {['Engineering', 'Marketing', 'Sales', 'Product', 'HR'].map(dept => (
                    <div key={dept} className="space-y-2">
                       <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tighter">
                          <span className="text-gray-700">{dept}</span>
                          <span className="text-gray-400">92% Compliance</span>
                       </div>
                       <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden flex">
                          <div className="h-full bg-[#3E3B6F] w-[92%] transition-all" />
                          <div className="h-full bg-orange-400 w-[8%] transition-all" />
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER STATS */}
      <div className="bg-[#3E3B6F] rounded-3xl p-8 text-white shadow-2xl shadow-[#3E3B6F]/30 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="absolute top-0 right-0 p-8 opacity-5">
            <TrendingUp size={160} />
         </div>
         <div className="relative z-10 space-y-4">
            <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-3 text-[#E8D5A3]">
               {/* Corrected: ShieldCheck is now imported */}
               <ShieldCheck size={24} /> Compliance Health Check
            </h3>
            <div className="flex flex-wrap gap-8">
               <div className="space-y-1">
                  <p className="text-[9px] font-black text-white/50 uppercase tracking-widest">Avg. Punctuality</p>
                  <p className="text-2xl font-black text-white tabular-nums">94.2%</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[9px] font-black text-white/50 uppercase tracking-widest">Unresolved Issues</p>
                  <p className="text-2xl font-black text-orange-400 tabular-nums">8</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[9px] font-black text-white/50 uppercase tracking-widest">Data Confidence</p>
                  <p className="text-2xl font-black text-green-400 tabular-nums">High</p>
               </div>
            </div>
         </div>
         <div className="relative z-10 flex gap-3">
            <button className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all">
               Audit logs
            </button>
            <button className="px-6 py-3 bg-[#E8D5A3] text-[#3E3B6F] rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
               Generate PDF Pack
            </button>
         </div>
      </div>
    </div>
  );
};
