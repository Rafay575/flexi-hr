import React, { useState, useMemo } from 'react';
import { 
  Timer, 
  Download, 
  Filter, 
  Search, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  Users, 
  Zap, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronRight,
  MoreVertical,
  Undo2,
  PieChart,
  ShieldAlert,
  Info
} from 'lucide-react';

interface EmployeePunctualitySummary {
  id: string;
  name: string;
  avatar: string;
  dept: string;
  lateCount: number;
  lateMins: number;
  earlyCount: number;
  earlyMins: number;
  penalty: string;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
}

const MOCK_EMPLOYEES: EmployeePunctualitySummary[] = Array.from({ length: 30 }).map((_, i) => {
  const lateCount = Math.floor(Math.random() * 8);
  const earlyCount = Math.floor(Math.random() * 4);
  const lateMins = lateCount * (Math.floor(Math.random() * 20) + 10);
  const earlyMins = earlyCount * (Math.floor(Math.random() * 15) + 5);
  const penalty = lateCount > 5 ? '0.5 Day Leave' : lateCount > 2 ? 'Warning' : 'None';
  
  return {
    id: `EMP-${1000 + i}`,
    name: ['Sarah Jenkins', 'Michael Chen', 'Amara Okafor', 'David Miller', 'Elena Rodriguez', 'Ahmed Khan'][i % 6],
    avatar: ['SJ', 'MC', 'AO', 'DM', 'ER', 'AK'][i % 6],
    dept: ['Engineering', 'Marketing', 'Sales', 'HR', 'Product', 'Finance'][i % 6],
    lateCount,
    lateMins,
    earlyCount,
    earlyMins,
    penalty,
    riskLevel: lateCount > 5 ? 'HIGH' : lateCount > 3 ? 'MEDIUM' : 'LOW'
  };
});

const PATTERN_ALERTS = [
  { title: 'Monday Morning Lag', desc: '42% of late arrivals occur on Monday mornings between 9:00 - 9:30 AM.', type: 'PATTERN' },
  { title: 'Frequent Late Arrivers', desc: '12 employees have exceeded the 5-instance monthly limit.', type: 'VIOLATION' },
  { title: 'Friday Early Exits', desc: 'Early departures spike by 25% on Friday afternoons.', type: 'PATTERN' },
];

export const LateEarlyReport: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');

  const filteredEmployees = useMemo(() => {
    return MOCK_EMPLOYEES.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           emp.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = selectedDept === 'All Departments' || emp.dept === selectedDept;
      return matchesSearch && matchesDept;
    }).sort((a, b) => b.lateCount - a.lateCount);
  }, [searchQuery, selectedDept]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <Timer className="text-[#3E3B6F]" size={28} /> Punctuality Analytics
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Detailed analysis of arrival and departure compliance patterns</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            <button className="px-4 py-2 text-xs font-bold text-[#3E3B6F] flex items-center gap-2 hover:bg-gray-50 rounded-lg transition-all">
              <Calendar size={14} /> Jan 01 - Jan 31, 2025
            </button>
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all">
            <Download size={18} /> Export PDF
          </button>
        </div>
      </div>

      {/* SUMMARY STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Late Instances', val: '245', trend: '+15', icon: <Clock size={18}/>, color: 'bg-orange-500' },
          { label: 'Total Late Minutes', val: '4,500', unit: 'm', trend: '+12%', icon: <Zap size={18}/>, color: 'bg-[#3E3B6F]' },
          { label: 'Early Instances', val: '89', trend: '-2', icon: <Undo2 size={18}/>, color: 'bg-indigo-500' },
          { label: 'Early Minutes', val: '1,200', unit: 'm', trend: '-5%', icon: <Clock size={18}/>, color: 'bg-blue-500' },
          { label: 'Penalized Staff', val: '78', unit: 'Emps', alert: true, icon: <ShieldAlert size={18}/>, color: 'bg-red-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm group hover:shadow-md transition-all">
            <div className="flex justify-between items-center mb-3">
              <div className={`p-2 rounded-lg text-white ${stat.color} shadow-lg transition-transform group-hover:scale-110`}>
                {stat.icon}
              </div>
              <span className={`text-[10px] font-black ${stat.trend?.startsWith('+') ? 'text-red-500' : (stat.trend?.startsWith('-') ? 'text-green-500' : 'text-gray-400')}`}>{stat.trend || ''}</span>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
            <h3 className="text-xl font-black text-gray-800 tabular-nums">
              {stat.val}
              {stat.unit && <span className="text-xs text-gray-400 ml-1 font-bold">{stat.unit}</span>}
            </h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LATE BY DAY CHART */}
     <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 shadow-sm p-8 flex flex-col">
  <div className="flex justify-between items-center mb-8">
    <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
      <BarChart3 size={16} className="text-[#3E3B6F]" /> Late Arrivals by Day of Week
    </h3>
    <span className="text-[9px] font-black text-red-500 bg-red-50 px-2 py-1 rounded">
      PEAK: MONDAY
    </span>
  </div>

  {/* CHART AREA: fixed height so bars always have a real height reference */}
  <div className="h-[240px] flex items-end justify-between gap-4 px-4 relative border-b border-gray-100 pb-2">
    {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, i) => {
      const h = [95, 45, 30, 25, 60][i];

      return (
        <div key={day} className="flex-1 h-full flex flex-col items-center justify-end group">
          {/* bar wrapper = full height */}
          <div className="w-full h-full flex items-end">
            <div
              style={{ height: `${h}%` }}
              className={`w-full rounded-t-xl transition-all ${
                h > 70 ? "bg-red-400" : "bg-[#3E3B6F]"
              } group-hover:opacity-80`}
            />
          </div>

          <span className="text-[10px] font-black text-gray-400 mt-3 uppercase">
            {day}
          </span>
        </div>
      );
    })}
  </div>
</div>

        {/* PATTERN ALERTS */}
        <div className="bg-[#3E3B6F] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col">
           <div className="absolute top-0 right-0 p-8 opacity-5 text-white">
             <TrendingUp size={120} />
           </div>
           <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-[#E8D5A3]">
             <Zap size={16} /> AI Pattern Detection
           </h3>
           <div className="space-y-4 flex-1">
             {PATTERN_ALERTS.map((alert, i) => (
               <div key={i} className="p-4 bg-white/10 rounded-2xl border border-white/5 group hover:bg-white/15 transition-all">
                 <p className="text-[10px] font-black text-[#E8D5A3] uppercase mb-1 tracking-tighter">{alert.title}</p>
                 <p className="text-[11px] text-white/70 leading-relaxed">{alert.desc}</p>
               </div>
             ))}
           </div>
           <button className="w-full mt-6 py-3 bg-white text-[#3E3B6F] rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform">
             Review Policy Impact
           </button>
        </div>
      </div>

      {/* EMPLOYEE LIST */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="p-6 border-b border-gray-100 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-orange-50 text-orange-600 rounded-xl"><Users size={20}/></div>
             <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Employee Compliance Ledger</h3>
          </div>
          <div className="flex flex-1 max-w-md gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search employee..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#3E3B6F]/10 outline-none" 
              />
            </div>
            <select 
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-gray-50 border-none rounded-xl px-4 py-2 text-xs font-bold text-gray-600 outline-none"
            >
              <option>All Departments</option>
              <option>Engineering</option>
              <option>Sales</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-md border-b border-gray-100">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-8 py-4">Employee</th>
                <th className="px-6 py-4 text-center">Late Count</th>
                <th className="px-6 py-4 text-center">Late Minutes</th>
                <th className="px-6 py-4 text-center">Early Count</th>
                <th className="px-6 py-4 text-center">Early Minutes</th>
                <th className="px-6 py-4 text-center">Risk Index</th>
                <th className="px-6 py-4 text-right">Penalty Tier</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="group hover:bg-gray-50/80 transition-all cursor-default">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary-gradient flex items-center justify-center text-white text-[10px] font-black shadow-lg">
                        {emp.avatar}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">{emp.name}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tabular-nums">{emp.id} • {emp.dept}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-sm font-black tabular-nums ${emp.lateCount > 5 ? 'text-red-600' : 'text-gray-800'}`}>{emp.lateCount}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-xs font-bold text-gray-500 tabular-nums">{emp.lateMins}m</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-black text-gray-800 tabular-nums">{emp.earlyCount}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-xs font-bold text-gray-500 tabular-nums">{emp.earlyMins}m</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                       <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            style={{ width: `${(emp.lateCount / 10) * 100}%` }} 
                            className={`h-full ${emp.riskLevel === 'HIGH' ? 'bg-red-500' : emp.riskLevel === 'MEDIUM' ? 'bg-orange-500' : 'bg-green-500'}`} 
                          />
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded border ${
                      emp.penalty === 'None' ? 'text-gray-400 bg-gray-50 border-gray-100' : 'text-red-600 bg-red-50 border-red-100'
                    }`}>
                      {emp.penalty}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-300 hover:text-[#3E3B6F] hover:bg-white rounded-lg transition-all">
                       <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* FOOTER */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Showing {filteredEmployees.length} contributors</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-[#3E3B6F] text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-[#3E3B6F]/20">
               <Download size={14} /> Download Summary CSV
            </button>
          </div>
        </div>
      </div>

      {/* POLICY HINT */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6 flex items-start gap-4">
         <div className="p-2 bg-white rounded-xl shadow-sm h-fit">
            <Info className="text-indigo-600" size={20} />
         </div>
         <div className="flex-1">
            <h4 className="text-xs font-black text-indigo-800 uppercase tracking-widest mb-1">Grace Policy Reminder</h4>
            <p className="text-[11px] text-indigo-700 leading-relaxed font-medium">
               Employees in the <span className="font-bold underline">Engineering Grade E4+</span> have an extended grace of 30 minutes for late arrival. Penalties listed here are calculated <span className="font-black">Net of Grace</span>. 
            </p>
         </div>
      </div>
    </div>
  );
};
