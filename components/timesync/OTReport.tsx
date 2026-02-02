import React, { useState, useMemo } from 'react';
import { 
  Clock, 
  Download, 
  Filter, 
  Search, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Users, 
  Zap, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart,
  ChevronRight,
  MoreVertical,
  Briefcase
} from 'lucide-react';

interface EmployeeOTSummary {
  id: string;
  name: string;
  avatar: string;
  dept: string;
  totalHours: number;
  weekday: number;
  weekend: number;
  holiday: number;
  cost: number;
}

const MOCK_DEPT_OT = [
  { name: 'Engineering', hours: 450, cost: 900000, percentage: 36 },
  { name: 'Marketing', hours: 120, cost: 240000, percentage: 9 },
  { name: 'Sales', hours: 210, cost: 420000, percentage: 17 },
  { name: 'Product', hours: 180, cost: 360000, percentage: 14 },
  { name: 'Operations', hours: 290, cost: 580000, percentage: 24 },
];

const MOCK_EMPLOYEES: EmployeeOTSummary[] = Array.from({ length: 30 }).map((_, i) => {
  const weekday = Math.floor(Math.random() * 10) + 2;
  const weekend = Math.floor(Math.random() * 5);
  const holiday = Math.random() > 0.8 ? 8 : 0;
  const total = weekday + weekend + holiday;
  const cost = (weekday * 1500) + (weekend * 2000) + (holiday * 2500);
  
  return {
    id: `EMP-${1000 + i}`,
    name: ['Sarah Jenkins', 'Michael Chen', 'Amara Okafor', 'David Miller', 'Elena Rodriguez', 'Ahmed Khan'][i % 6],
    avatar: ['SJ', 'MC', 'AO', 'DM', 'ER', 'AK'][i % 6],
    dept: ['Engineering', 'Marketing', 'Sales', 'HR', 'Product', 'Finance'][i % 6],
    totalHours: total,
    weekday,
    weekend,
    holiday,
    cost
  };
});

export const OTReport: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState('Jan 01 - Jan 31, 2025');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmployees = useMemo(() => {
    return MOCK_EMPLOYEES.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           emp.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = selectedDept === 'All Departments' || emp.dept === selectedDept;
      return matchesSearch && matchesDept;
    }).sort((a, b) => b.totalHours - a.totalHours);
  }, [searchQuery, selectedDept]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <Clock className="text-[#3E3B6F]" size={28} /> Overtime Analytics Report
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Monetary and duration analysis of extra-work hours</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            <button className="px-4 py-2 text-xs font-bold text-[#3E3B6F] flex items-center gap-2 hover:bg-gray-50 rounded-lg">
              <Calendar size={14} /> {selectedRange}
            </button>
            <div className="h-4 w-px bg-gray-100 my-auto mx-1"></div>
            <select 
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-transparent text-xs font-bold text-gray-600 px-4 py-2 outline-none cursor-pointer"
            >
              <option>All Departments</option>
              <option>Engineering</option>
              <option>Operations</option>
              <option>Sales</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all">
            <Download size={18} /> Export Excel
          </button>
        </div>
      </div>

      {/* SUMMARY STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total OT Hours', val: '1,250', trend: '+12%', icon: <Clock size={20}/>, color: 'bg-indigo-500' },
          { label: 'Total Cost', val: 'PKR 2.5M', trend: '+8.4%', icon: <DollarSign size={20}/>, color: 'bg-green-600' },
          { label: 'OT Active Staff', val: '180', unit: 'Employees', trend: '-2', icon: <Users size={20}/>, color: 'bg-[#3E3B6F]' },
          { label: 'Avg OT / Employee', val: '6.9', unit: 'Hrs', trend: '+0.5', icon: <TrendingUp size={20}/>, color: 'bg-orange-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm group hover:shadow-md transition-all">
            <div className="flex justify-between items-center mb-4">
              <div className={`p-2.5 rounded-xl text-white ${stat.color} shadow-lg shadow-gray-100 group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black ${stat.trend?.startsWith('+') ? 'text-red-500' : 'text-green-500'}`}>
                {stat.trend}
              </div>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
            <h3 className="text-xl font-black text-gray-800 tabular-nums">
              {stat.val}
              {stat.unit && <span className="text-[10px] text-gray-400 ml-1 font-bold">{stat.unit}</span>}
            </h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* OT TREND CHART MOCKUP */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 shadow-sm p-8 flex flex-col">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                <BarChart3 size={16} className="text-[#3E3B6F]" /> Daily Overtime Trend
              </h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#3E3B6F]"></div><span className="text-[9px] font-black text-gray-400 uppercase">Current Month</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-gray-100"></div><span className="text-[9px] font-black text-gray-400 uppercase">Previous Month</span></div>
              </div>
           </div>
           <div className="flex-1 min-h-[240px] flex items-end justify-between gap-1 relative border-b border-l border-gray-100 pt-10 px-2">
              {Array.from({ length: 31 }).map((_, i) => {
                const h = [20, 35, 45, 30, 25, 85, 95, 20, 30, 40, 55, 60, 45, 90, 80, 20, 35, 40, 50, 45, 30, 85, 95, 25, 35, 40, 55, 60, 45, 30, 25][i];
                const isWeekend = i % 7 === 5 || i % 7 === 6;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                     <div 
                      style={{ height: `${h}%` }} 
                      className={`w-full rounded-t-sm transition-all cursor-pointer ${isWeekend ? 'bg-orange-400/40 hover:bg-orange-400' : 'bg-[#3E3B6F]/20 hover:bg-[#3E3B6F]'}`}
                     >
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white px-2 py-1 rounded text-[8px] font-bold  transition-opacity whitespace-nowrap z-10">
                          {h}h total
                        </div>
                     </div>
                  </div>
                )
              })}
              <div className="absolute inset-x-0 bottom-0 py-2 flex justify-between text-[7px] font-black text-gray-300 uppercase px-1">
                 <span>JAN 01</span>
                 <span>JAN 15</span>
                 <span>JAN 31</span>
              </div>
           </div>
        </div>

        {/* DEPT BREAKDOWN */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
             <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">OT by Department</h3>
             <PieChart size={16} className="text-gray-400" />
          </div>
          <div className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
             {MOCK_DEPT_OT.map((dept, i) => (
               <div key={i} className="space-y-2 group">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs font-black text-gray-800 uppercase">{dept.name}</p>
                      <p className="text-[10px] font-bold text-gray-400 tabular-nums">{dept.hours}h • PKR {(dept.cost/1000).toFixed(0)}k</p>
                    </div>
                    <span className="text-[10px] font-black text-[#3E3B6F] tabular-nums">{dept.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden flex">
                    <div 
                      style={{ width: `${dept.percentage}%` }} 
                      className={`h-full bg-[#3E3B6F] group-hover:opacity-80 transition-all`} 
                    />
                  </div>
               </div>
             ))}
          </div>
          <div className="p-4 bg-[#3E3B6F]/5 border-t border-gray-100">
             <button className="w-full py-3 bg-white border border-[#3E3B6F]/10 text-[#3E3B6F] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#3E3B6F] hover:text-white transition-all shadow-sm">
                Cost Allocation Map
             </button>
          </div>
        </div>
      </div>

      {/* EMPLOYEE LEDGER */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="p-6 border-b border-gray-100 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-orange-50 text-orange-600 rounded-xl"><Briefcase size={20}/></div>
             <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Employee OT Ledger</h3>
          </div>
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search employee..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#3E3B6F]/10 outline-none" 
            />
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-md border-b border-gray-100">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-8 py-4">Employee</th>
                <th className="px-6 py-4">Dept</th>
                <th className="px-6 py-4 text-center">Total Hours</th>
                <th className="px-6 py-4 text-center">Weekday</th>
                <th className="px-6 py-4 text-center">Weekend</th>
                <th className="px-6 py-4 text-center">Holiday</th>
                <th className="px-6 py-4 text-right">Est. Cost</th>
                <th className="px-6 py-4 text-right">Action</th>
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
                        <p className="text-[9px] text-gray-400 font-bold uppercase tabular-nums">{emp.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[11px] font-medium text-gray-500">{emp.dept}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-black text-[#3E3B6F] tabular-nums">{emp.totalHours}h</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-xs font-bold text-gray-600 tabular-nums">{emp.weekday}h</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xs font-bold tabular-nums ${emp.weekend > 0 ? 'text-orange-600' : 'text-gray-300'}`}>{emp.weekend}h</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xs font-bold tabular-nums ${emp.holiday > 0 ? 'text-purple-600' : 'text-gray-300'}`}>{emp.holiday}h</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-xs font-black text-gray-800 tabular-nums">PKR {emp.cost.toLocaleString()}</span>
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
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Summary showing {filteredEmployees.length} active contributors</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all">
               Load More
            </button>
            <button className="px-4 py-2 bg-[#3E3B6F] text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all flex items-center gap-2">
               <Download size={14} /> Full Audit Trail
            </button>
          </div>
        </div>
      </div>

      {/* COST WARNING */}
      <div className="bg-orange-50 border border-orange-100 rounded-3xl p-6 flex items-start gap-4">
         <div className="p-2 bg-white rounded-xl shadow-sm h-fit">
            <Zap className="text-orange-500" size={20} />
         </div>
         <div className="flex-1">
            <h4 className="text-xs font-black text-orange-800 uppercase tracking-widest mb-1">Budget Threshold Warning</h4>
            <p className="text-[11px] text-orange-700 leading-relaxed font-medium">
               Overtime costs for the <span className="font-bold underline">Engineering Department</span> have exceeded the monthly soft-cap by <span className="font-black">15%</span>. 42% of this OT is attributed to "Weekend Support" during the Cloud Migration project.
            </p>
         </div>
         <button className="px-4 py-2 bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md">Review Allocation</button>
      </div>
    </div>
  );
};
