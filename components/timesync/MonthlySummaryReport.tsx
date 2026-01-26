import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Download, 
  Filter, 
  Search, 
  TrendingUp, 
  Clock, 
  UserCheck, 
  UserX, 
  Coffee, 
  Zap, 
  ChevronDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  BarChart3,
  LineChart,
  LayoutGrid,
  MoreVertical,
  ChevronRight,
  ShieldCheck,
  Building2,
  FileText
} from 'lucide-react';

interface EmployeeSummary {
  id: string;
  name: string;
  avatar: string;
  dept: string;
  present: number;
  absent: number;
  leave: number;
  late: number;
  early: number;
  ot: string;
  percentage: number;
}

const MOCK_DEPT_DATA = [
  { name: 'Engineering', attendance: 94.5, late: 12, ot: 450 },
  { name: 'Marketing', attendance: 91.2, late: 25, ot: 120 },
  { name: 'Sales', attendance: 88.4, late: 38, ot: 210 },
  { name: 'Product', attendance: 95.8, late: 8, ot: 180 },
  { name: 'HR', attendance: 97.2, late: 5, ot: 45 },
];

const MOCK_EMPLOYEES: EmployeeSummary[] = Array.from({ length: 50 }).map((_, i) => {
  const present = Math.floor(Math.random() * 5) + 18;
  const absent = Math.floor(Math.random() * 3);
  const leave = Math.floor(Math.random() * 3);
  const total = present + absent + leave;
  const percentage = Math.round((present / 22) * 100);
  
  return {
    id: `EMP-${1000 + i}`,
    name: ['Sarah Jenkins', 'Michael Chen', 'Amara Okafor', 'David Miller', 'Elena Rodriguez', 'Ahmed Khan'][i % 6],
    avatar: ['SJ', 'MC', 'AO', 'DM', 'ER', 'AK'][i % 6],
    dept: ['Engineering', 'Marketing', 'Sales', 'HR', 'Product', 'Finance'][i % 6],
    present,
    absent,
    leave,
    late: Math.floor(Math.random() * 5),
    early: Math.floor(Math.random() * 3),
    ot: `${Math.floor(Math.random() * 20)}h`,
    percentage
  };
});

export const MonthlySummaryReport: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('January 2025');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof EmployeeSummary, direction: 'asc' | 'desc' }>({ key: 'percentage', direction: 'desc' });

  const filteredData = useMemo(() => {
    let data = MOCK_EMPLOYEES.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           emp.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = selectedDept === 'All Departments' || emp.dept === selectedDept;
      return matchesSearch && matchesDept;
    });

    data.sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];
      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return data;
  }, [searchQuery, selectedDept, sortConfig]);

  const handleSort = (key: keyof EmployeeSummary) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <LineChart className="text-[#3E3B6F]" size={28} /> Monthly Summary Report
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Aggregated performance and adherence analytics for the payroll cycle</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 text-xs font-bold text-[#3E3B6F] bg-transparent outline-none cursor-pointer border-r border-gray-100"
            >
              <option>January 2025</option>
              <option>December 2024</option>
              <option>November 2024</option>
            </select>
            <select 
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-4 py-2 text-xs font-bold text-gray-600 bg-transparent outline-none cursor-pointer"
            >
              <option>All Departments</option>
              <option>Engineering</option>
              <option>Marketing</option>
              <option>Sales</option>
              <option>HR</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all">
            <Download size={18} /> Export Full Report
          </button>
        </div>
      </div>

      {/* SUMMARY DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Working Days', val: '22', trend: 'Fixed', icon: <Calendar size={18}/>, color: 'bg-[#3E3B6F]' },
          { label: 'Avg Attendance', val: '92.4%', trend: '+1.2%', icon: <UserCheck size={18}/>, color: 'bg-green-500' },
          { label: 'Total Absences', val: '180', unit: 'Days', trend: '-12', icon: <UserX size={18}/>, color: 'bg-red-500' },
          { label: 'Late Instances', val: '245', trend: '+15', icon: <Clock size={18}/>, color: 'bg-orange-500' },
          { label: 'OT Accumulated', val: '1,250', unit: 'Hrs', trend: '+12%', icon: <TrendingUp size={18}/>, color: 'bg-indigo-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm group hover:shadow-md transition-all">
            <div className="flex justify-between items-center mb-4">
              <div className={`p-2.5 rounded-xl text-white ${stat.color} shadow-lg shadow-gray-100 group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black ${stat.trend?.startsWith('+') ? 'text-green-500' : stat.trend?.startsWith('-') ? 'text-red-500' : 'text-gray-400'}`}>
                {stat.trend?.startsWith('+') ? <ArrowUpRight size={10}/> : stat.trend?.startsWith('-') ? <ArrowDownRight size={10}/> : null}
                {stat.trend}
              </div>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-gray-800 tabular-nums">
              {stat.val}
              {stat.unit && <span className="text-xs text-gray-400 ml-1 font-bold">{stat.unit}</span>}
            </h3>
          </div>
        ))}
      </div>

      {/* CHARTS & COMPARISON */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* DAILY TREND LINE MOCKUP */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                <BarChart3 size={16} className="text-[#3E3B6F]" /> Daily Attendance Trend
              </h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#3E3B6F]"></div><span className="text-[9px] font-black text-gray-400 uppercase">This Month</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-gray-100"></div><span className="text-[9px] font-black text-gray-400 uppercase">Avg Goal</span></div>
              </div>
           </div>
           <div className="h-64 flex items-end justify-between gap-1 relative border-b border-l border-gray-100 pt-10">
              {Array.from({ length: 22 }).map((_, i) => {
                const h = [85, 92, 94, 91, 88, 95, 98, 92, 90, 85, 82, 88, 91, 94, 96, 92, 91, 89, 93, 95, 94, 91][i];
                return (
                  <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                     <div style={{ height: `${h}%` }} className="w-full bg-[#3E3B6F]/10 border-t-2 border-[#3E3B6F] relative group-hover:bg-[#3E3B6F]/20 transition-all cursor-help">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#3E3B6F] shadow-sm"></div>
                     </div>
                     <span className="text-[7px] font-black text-gray-300 mt-2">D{i+1}</span>
                  </div>
                )
              })}
              <div className="absolute left-0 bottom-[90%] right-0 h-px bg-green-500/20 border-t border-dashed border-green-500/30"></div>
           </div>
           <div className="mt-6 p-4 bg-gray-50 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="p-2 bg-white rounded-lg shadow-sm text-[#3E3B6F]"><ShieldCheck size={20}/></div>
                 <div>
                    <p className="text-xs font-bold text-gray-800">Policy Compliance Score</p>
                    <p className="text-[10px] text-gray-500">Global adherence to shift boundaries is at 94%</p>
                 </div>
              </div>
              <button className="text-[10px] font-black text-[#3E3B6F] uppercase underline underline-offset-4">Deep Dive Analytics</button>
           </div>
        </div>

        {/* DEPT PERFORMANCE RANKING */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
             <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
               <Building2 size={16} className="text-[#3E3B6F]" /> Department Benchmark
             </h3>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
             <div className="divide-y divide-gray-50">
                {MOCK_DEPT_DATA.map((dept, i) => (
                  <div key={i} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                     <div className="flex items-center gap-4">
                        <span className="text-xs font-black text-gray-300 tabular-nums">0{i+1}</span>
                        <div>
                           <p className="text-xs font-bold text-gray-800 group-hover:text-[#3E3B6F] transition-colors">{dept.name}</p>
                           <div className="flex items-center gap-3 mt-1">
                              <span className="text-[9px] font-bold text-gray-400 flex items-center gap-1 uppercase tracking-tighter">
                                <Clock size={10}/> {dept.late} Late
                              </span>
                              <span className="text-[9px] font-bold text-indigo-500 flex items-center gap-1 uppercase tracking-tighter">
                                <Zap size={10}/> {dept.ot}h OT
                              </span>
                           </div>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className={`text-sm font-black ${dept.attendance >= 94 ? 'text-green-600' : dept.attendance >= 90 ? 'text-blue-600' : 'text-orange-600'}`}>
                           {dept.attendance}%
                        </p>
                        <div className="w-16 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                           <div style={{ width: `${dept.attendance}%` }} className={`h-full ${dept.attendance >= 94 ? 'bg-green-500' : 'bg-blue-50'}`} />
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
          <div className="p-4 bg-gray-50 border-t border-gray-100">
             <button className="w-full py-3 bg-[#3E3B6F] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all">
                Compare All Teams
             </button>
          </div>
        </div>
      </div>

      {/* EMPLOYEE SUMMARY TABLE */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-indigo-50 text-[#3E3B6F] rounded-xl"><LayoutGrid size={20}/></div>
             <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Employee Summary Ledger</h3>
          </div>
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search employee or ID..." 
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
                <th className="px-8 py-4 cursor-pointer hover:text-[#3E3B6F] transition-colors" onClick={() => handleSort('name')}>Employee {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                <th className="px-6 py-4 cursor-pointer hover:text-[#3E3B6F] transition-colors" onClick={() => handleSort('present')}>Present</th>
                <th className="px-6 py-4 cursor-pointer hover:text-[#3E3B6F] transition-colors" onClick={() => handleSort('absent')}>Absent</th>
                <th className="px-6 py-4 cursor-pointer hover:text-[#3E3B6F] transition-colors" onClick={() => handleSort('leave')}>Leave</th>
                <th className="px-6 py-4 cursor-pointer hover:text-[#3E3B6F] transition-colors" onClick={() => handleSort('late')}>Late</th>
                <th className="px-6 py-4 cursor-pointer hover:text-[#3E3B6F] transition-colors" onClick={() => handleSort('early')}>Early Out</th>
                <th className="px-6 py-4 cursor-pointer hover:text-[#3E3B6F] transition-colors" onClick={() => handleSort('ot')}>Total OT</th>
                <th className="px-6 py-4 cursor-pointer hover:text-[#3E3B6F] transition-colors" onClick={() => handleSort('percentage')}>Attn %</th>
                <th className="px-6 py-4 text-right">Action</th>
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
                        <p className="text-[9px] text-gray-400 font-bold uppercase tabular-nums">{emp.id} • {emp.dept}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-black text-green-600 tabular-nums">{emp.present}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-black tabular-nums ${emp.absent > 2 ? 'text-red-500' : 'text-gray-400'}`}>{emp.absent}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-black text-blue-500 tabular-nums">{emp.leave}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-black tabular-nums ${emp.late > 5 ? 'text-orange-500' : 'text-gray-400'}`}>{emp.late}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-black tabular-nums ${emp.early > 3 ? 'text-orange-500' : 'text-gray-400'}`}>{emp.early}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-black text-indigo-600 tabular-nums">{emp.ot}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <span className={`text-xs font-black tabular-nums ${emp.percentage >= 95 ? 'text-green-600' : emp.percentage >= 85 ? 'text-blue-600' : 'text-red-500'}`}>
                         {emp.percentage}%
                       </span>
                       <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div style={{ width: `${emp.percentage}%` }} className={`h-full ${emp.percentage >= 95 ? 'bg-green-500' : 'bg-[#3E3B6F]'}`} />
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-300 hover:text-[#3E3B6F] hover:bg-white rounded-lg transition-all">
                       <FileText size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* FOOTER */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Showing {filteredData.length} of {MOCK_EMPLOYEES.length} staff members</span>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all">
              <Download size={14} /> Download Excel
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all">
              <MoreVertical size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
