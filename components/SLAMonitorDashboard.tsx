
import React, { useState, useEffect } from 'react';
import { 
  Clock, AlertCircle, AlertTriangle, CheckCircle2, RefreshCw, 
  TrendingUp, Mail, UserPlus, ArrowRight, Zap, History,
  Bell, Filter, MoreHorizontal, ArrowUpRight
} from 'lucide-react';

interface OverdueRequest {
  id: string;
  employee: string;
  avatar: string;
  type: string;
  submitted: string;
  overdueBy: string;
  approver: string;
}

interface ApproverStat {
  name: string;
  pending: number;
  avgTime: string;
  compliance: number;
}

const MOCK_OVERDUE: OverdueRequest[] = [
  { id: 'LV-9921', employee: 'Zohaib Shah', avatar: 'ZS', type: 'Annual Leave', submitted: '2025-02-10 09:00', overdueBy: '4h 22m', approver: 'Farhan Ali' },
  { id: 'LV-9925', employee: 'Kamran Akmal', avatar: 'KA', type: 'Casual Leave', submitted: '2025-02-10 11:30', overdueBy: '1h 45m', approver: 'Sana Khan' },
];

const MOCK_AT_RISK: OverdueRequest[] = [
  { id: 'LV-9930', employee: 'Dania J.', avatar: 'DJ', type: 'Sick Leave', submitted: '2025-02-11 14:00', overdueBy: '52m remaining', approver: 'Sarah Miller' },
  { id: 'LV-9932', employee: 'Usman Ghani', avatar: 'UG', type: 'Annual Leave', submitted: '2025-02-11 15:45', overdueBy: '3h 10m remaining', approver: 'Sarah Miller' },
];

const MOCK_APPROVERS: ApproverStat[] = [
  { name: 'Sarah Miller', pending: 12, avgTime: '4.2h', compliance: 98 },
  { name: 'Farhan Ali', pending: 8, avgTime: '22.5h', compliance: 65 },
  { name: 'Sana Khan', pending: 15, avgTime: '18.1h', compliance: 78 },
  { name: 'Ahmed Khan', pending: 3, avgTime: '2.5h', compliance: 100 },
];

export const SLAMonitorDashboard = () => {
  const [range, setRange] = useState('This Week');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setLastRefreshed(new Date().toLocaleTimeString());
    }, 300000); // 5 min
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getComplianceColor = (val: number) => {
    if (val >= 90) return 'text-emerald-500';
    if (val >= 75) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-[#3E3B6F]">SLA Monitor</h2>
          <p className="text-gray-500">Real-time tracking of approval bottlenecks and compliance.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            {['Today', 'This Week', 'This Month'].map((r) => (
              <button 
                key={r}
                onClick={() => setRange(r)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${range === r ? 'bg-[#3E3B6F] text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
              >
                {r}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Auto Refresh</span>
            <button 
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`w-10 h-5 rounded-full relative transition-colors ${autoRefresh ? 'bg-emerald-500' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${autoRefresh ? 'left-6' : 'left-1'}`} />
            </button>
            <span className="text-[10px] text-gray-400 italic">Last: {lastRefreshed}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Pending</p>
          <h4 className="text-2xl font-bold text-gray-900">45</h4>
          <p className="text-[10px] text-gray-400 mt-2 font-medium">Org-wide queue</p>
        </div>
        <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 shadow-sm">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Within SLA</p>
          <h4 className="text-2xl font-bold text-emerald-900">38</h4>
          <div className="flex items-center gap-1 mt-2 text-emerald-600 text-[10px] font-bold">
            <TrendingUp size={12} /> 84% Compliance
          </div>
        </div>
        <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 shadow-sm">
          <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">At Risk (&lt;4h)</p>
          <h4 className="text-2xl font-bold text-amber-900">5</h4>
          <div className="flex items-center gap-1 mt-2 text-amber-600 text-[10px] font-bold">
            <AlertTriangle size={12} /> Action Needed
          </div>
        </div>
        <div className="bg-red-50 p-5 rounded-2xl border border-red-100 shadow-sm">
          <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-1">Overdue</p>
          <h4 className="text-2xl font-bold text-red-900">2</h4>
          <div className="flex items-center gap-1 mt-2 text-red-600 text-[10px] font-bold">
            <AlertCircle size={12} /> Breach Alert
          </div>
        </div>
        <div className="bg-[#3E3B6F] p-5 rounded-2xl shadow-lg shadow-[#3E3B6F]/20 text-white">
          <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Avg Response</p>
          <h4 className="text-2xl font-bold">8.5h</h4>
          <p className="text-[10px] text-white/40 mt-2 font-medium">Across all dept.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Overdue Queue */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-red-50 border-b border-red-100 flex items-center justify-between">
              <h5 className="text-sm font-bold text-red-900 flex items-center gap-2">
                <AlertCircle size={16} /> Overdue Queue
              </h5>
              <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full uppercase tracking-widest">Priority 1</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Request</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Overdue By</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Approver</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {MOCK_OVERDUE.map(req => (
                    <tr key={req.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent-peach flex items-center justify-center font-bold text-[#3E3B6F] text-[10px]">{req.avatar}</div>
                          <div>
                            <p className="text-xs font-bold text-gray-900">{req.employee}</p>
                            <p className="text-[10px] text-gray-400">{req.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-gray-600">{req.type}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-red-500">{req.overdueBy}</span>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-gray-600">{req.approver}</td>
                      <td className="px-6 py-4 text-right">
                         <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button title="Escalate" className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Zap size={16}/></button>
                            <button title="Reassign" className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"><UserPlus size={16}/></button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-amber-50 border-b border-amber-100">
              <h5 className="text-sm font-bold text-amber-900 flex items-center gap-2">
                <AlertTriangle size={16} /> At Risk Queue (Breach in &lt;4h)
              </h5>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Request</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Remaining</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Approver</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {MOCK_AT_RISK.map(req => (
                    <tr key={req.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center font-bold text-[#3E3B6F] text-[10px]">{req.avatar}</div>
                          <span className="text-xs font-bold text-gray-800">{req.employee}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-amber-600">{req.overdueBy}</span>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-gray-600">{req.approver}</td>
                      <td className="px-6 py-4 text-right">
                         <button className="text-[#3E3B6F] text-[10px] font-bold hover:underline">SEND REMINDER</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Approver Performance */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h5 className="text-sm font-bold text-gray-800">Approver Leaderboard</h5>
              <button className="text-[10px] font-bold text-[#3E3B6F] hover:underline">VIEW ALL</button>
            </div>
            <div className="divide-y divide-gray-50">
              {MOCK_APPROVERS.map((app, i) => (
                <div key={i} className="p-4 hover:bg-gray-50 transition-all group">
                   <div className="flex justify-between items-start mb-2">
                     <div>
                       <p className="text-xs font-bold text-gray-900">{app.name}</p>
                       <p className="text-[10px] text-gray-400">{app.pending} Pending in queue</p>
                     </div>
                     <span className={`text-[10px] font-bold ${getComplianceColor(app.compliance)}`}>
                        {app.compliance}% SLA
                     </span>
                   </div>
                   <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                     <div 
                       className={`h-full transition-all duration-700 ${app.compliance >= 90 ? 'bg-emerald-500' : app.compliance >= 75 ? 'bg-amber-500' : 'bg-red-500'}`} 
                       style={{ width: `${app.compliance}%` }} 
                     />
                   </div>
                   <div className="mt-3 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] text-gray-400">Avg Time: <span className="font-bold text-gray-700">{app.avgTime}</span></span>
                      <button className="p-1.5 text-gray-400 hover:text-[#3E3B6F]"><Mail size={14}/></button>
                   </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
             <h5 className="text-xs font-bold text-gray-800 mb-4">SLA Compliance Trend</h5>
             <div className="h-48 flex items-end justify-between gap-1 px-2">
                {[70, 85, 90, 80, 75, 95, 88, 82, 79, 85, 92, 98].map((h, i) => (
                  <div key={i} className="flex-1 group relative">
                    <div 
                      className={`w-full rounded-t-sm transition-all duration-500 ${h > 90 ? 'bg-emerald-400' : 'bg-[#3E3B6F]/40'}`} 
                      style={{ height: `${h}%` }} 
                    />
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">{h}%</div>
                  </div>
                ))}
             </div>
             <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest font-bold pt-2">Last 12 Working Days</p>
          </div>

          <div className="bg-primary-gradient rounded-2xl p-6 text-white relative overflow-hidden">
             <div className="relative z-10 space-y-3">
               <div className="flex items-center gap-2 text-[#E8D5A3]">
                 <Zap size={18} />
                 <span className="text-[10px] font-bold uppercase tracking-widest">AI Prediction</span>
               </div>
               <p className="text-xs font-medium leading-relaxed">
                 Expect <span className="font-bold text-[#E8D5A3]">8-12% drop</span> in compliance next week due to high volume of Annual Leave requests during festival season.
               </p>
               <button className="text-[10px] font-bold underline hover:text-[#E8D5A3]">Optimize Workflows</button>
             </div>
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
};
