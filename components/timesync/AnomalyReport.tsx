import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  Download, 
  Filter, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  Users, 
  Zap, 
  BarChart3, 
  ArrowUpRight, 
  ShieldCheck,
  ChevronRight,
  MoreVertical,
  Activity,
  UserX,
  Target
} from 'lucide-react';

interface AnomalySummary {
  type: string;
  count: number;
  resolved: number;
  pending: number;
  color: string;
}

interface EmployeeAnomalyRecord {
  id: string;
  name: string;
  avatar: string;
  dept: string;
  total: number;
  types: string[];
  status: 'STABLE' | 'FLAGGED' | 'CRITICAL';
}

const MOCK_TYPE_DATA: AnomalySummary[] = [
  { type: 'Missing Punch', count: 45, resolved: 40, pending: 5, color: 'bg-blue-500' },
  { type: 'Geo Violation', count: 23, resolved: 20, pending: 3, color: 'bg-orange-500' },
  { type: 'Late Beyond Tolerance', count: 56, resolved: 50, pending: 6, color: 'bg-indigo-500' },
  { type: 'Buddy Punch Alert', count: 3, resolved: 1, pending: 2, color: 'bg-red-500' },
];

const MOCK_EMPLOYEES: EmployeeAnomalyRecord[] = Array.from({ length: 20 }).map((_, i) => {
  const total = i % 5 === 0 ? Math.floor(Math.random() * 5) + 5 : Math.floor(Math.random() * 3);
  const types = ['Missing Out', 'Geo Drift'];
  if (total > 5) types.push('Buddy Alert');

  return {
    id: `EMP-${2000 + i}`,
    name: ['Sarah Jenkins', 'Michael Chen', 'Amara Okafor', 'David Miller', 'Elena Rodriguez', 'Ahmed Khan'][i % 6],
    avatar: ['SJ', 'MC', 'AO', 'DM', 'ER', 'AK'][i % 6],
    dept: ['Engineering', 'Marketing', 'Sales', 'HR', 'Product', 'Finance'][i % 6],
    total,
    types,
    status: total > 5 ? 'CRITICAL' : total > 3 ? 'FLAGGED' : 'STABLE'
  };
});

export const AnomalyReport: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All Types');

  const filteredEmployees = useMemo(() => {
    return MOCK_EMPLOYEES.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           emp.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    }).sort((a, b) => b.total - a.total);
  }, [searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <ShieldAlert className="text-[#3E3B6F]" size={28} /> Anomaly Intelligence Report
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Pattern recognition and fraud detection audit trail</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            <button className="px-4 py-2 text-xs font-bold text-[#3E3B6F] flex items-center gap-2 hover:bg-gray-50 rounded-lg">
              <Calendar size={14} /> Jan 01 - Jan 31, 2025
            </button>
            <div className="h-4 w-px bg-gray-100 my-auto mx-1"></div>
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent text-xs font-bold text-gray-600 px-4 py-2 outline-none cursor-pointer"
            >
              <option>All Types</option>
              <option>Fraud Alerts</option>
              <option>Compliance Issues</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all">
            <Download size={18} /> Export Audit
          </button>
        </div>
      </div>

      {/* SUMMARY STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Anomalies', val: '156', trend: '+5%', icon: <AlertTriangle size={20}/>, color: 'bg-[#3E3B6F]' },
          { label: 'Resolved (Closed)', val: '120', trend: '85%', icon: <CheckCircle2 size={20}/>, color: 'bg-green-600' },
          { label: 'Pending Action', val: '36', unit: 'Items', trend: 'High', icon: <Clock size={20}/>, color: 'bg-orange-500' },
          { label: 'Fraud Alerts', val: '03', unit: 'Verified', alert: true, icon: <UserX size={20}/>, color: 'bg-red-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm group hover:shadow-md transition-all">
            <div className="flex justify-between items-center mb-4">
              <div className={`p-2.5 rounded-xl text-white ${stat.color} shadow-lg shadow-gray-100 group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div className={`text-[10px] font-black ${stat.label === 'Pending Action' ? 'text-orange-500' : 'text-green-500'}`}>
                {stat.trend}
              </div>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
            <h3 className={`text-xl font-black tabular-nums ${stat.alert ? 'text-red-600' : 'text-gray-800'}`}>
              {stat.val}
              {stat.unit && <span className="text-[10px] text-gray-400 ml-1 font-bold">{stat.unit}</span>}
            </h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* BREAKDOWN BY TYPE */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
             <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
               <Zap size={16} className="text-[#3E3B6F]" /> Classification Analysis
             </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/30 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Anomaly Type</th>
                  <th className="px-6 py-4 text-center">Total Count</th>
                  <th className="px-6 py-4 text-center">Resolved</th>
                  <th className="px-6 py-4 text-center">Pending</th>
                  <th className="px-6 py-4">Resolution %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {MOCK_TYPE_DATA.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${item.color}`} />
                          <span className="text-xs font-bold text-gray-700">{item.type}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-center text-xs font-black tabular-nums">{item.count}</td>
                    <td className="px-6 py-4 text-center text-xs font-bold text-green-600 tabular-nums">{item.resolved}</td>
                    <td className="px-6 py-4 text-center text-xs font-bold text-orange-500 tabular-nums">{item.pending}</td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                             <div 
                               style={{ width: `${(item.resolved/item.count)*100}%` }} 
                               className={`h-full ${item.color}`} 
                             />
                          </div>
                          <span className="text-[10px] font-black text-gray-400">{Math.round((item.resolved/item.count)*100)}%</span>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PERFORMANCE METRICS */}
        <div className="space-y-6">
          <div className="bg-[#3E3B6F] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-10">
               <Activity size={100} />
             </div>
             <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-[#E8D5A3]">
               <Clock size={16} /> Resolution Telemetry
             </h3>
             <div className="space-y-6 relative z-10">
                <div>
                   <p className="text-[10px] font-black text-white/50 uppercase mb-2">Avg Resolution Time</p>
                   <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black">4.5</span>
                      <span className="text-xs font-bold text-white/40 uppercase">Hours</span>
                   </div>
                   <p className="text-[10px] text-green-400 font-bold mt-1">12% faster than last month</p>
                </div>
                <div className="pt-6 border-t border-white/10">
                   <p className="text-[10px] font-black text-white/50 uppercase mb-2">SLA Compliance</p>
                   <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-[#E8D5A3]">85%</span>
                      <span className="text-xs font-bold text-white/40 uppercase">On Target</span>
                   </div>
                </div>
             </div>
          </div>
          
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
             <div className="flex items-center gap-3 mb-4">
                <Target size={18} className="text-orange-500" />
                <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest">Focus Area</h4>
             </div>
             <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                The <span className="text-red-500 font-bold">"Buddy Punch"</span> detection alerts have a 48h resolution SLA. 2 items are currently approaching the breach threshold.
             </p>
          </div>
        </div>
      </div>

      {/* EMPLOYEE LEDGER */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="p-6 border-b border-gray-100 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-indigo-50 text-[#3E3B6F] rounded-xl"><Users size={20}/></div>
             <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">High-Anomaly Contributors</h3>
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
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4 text-center">Incident Count</th>
                <th className="px-6 py-4">Anomaly Profile</th>
                <th className="px-6 py-4 text-right">Risk Status</th>
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
                        <p className="text-[9px] text-gray-400 font-bold uppercase tabular-nums">{emp.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[11px] font-medium text-gray-500">{emp.dept}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-sm font-black tabular-nums ${emp.total > 5 ? 'text-red-600' : 'text-[#3E3B6F]'}`}>{emp.total}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                       {emp.types.map((t, idx) => (
                         <span key={idx} className="text-[8px] font-black bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase tracking-tighter">{t}</span>
                       ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                      emp.status === 'CRITICAL' ? 'bg-red-50 text-red-600 border-red-100' : 
                      emp.status === 'FLAGGED' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                      'bg-green-50 text-green-600 border-green-100'
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-300 hover:text-[#3E3B6F] hover:bg-white rounded-lg transition-all">
                       <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* FOOTER */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Showing {filteredEmployees.length} staff members with recorded events</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all">
               Load More
            </button>
            <button className="px-4 py-2 bg-[#3E3B6F] text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all flex items-center gap-2">
               <ShieldCheck size={14} /> Full Security Audit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
