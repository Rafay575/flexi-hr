
import React, { useState, useMemo } from 'react';
import { 
  LogOut, AlertTriangle, TrendingDown, Calendar, Search, Filter, 
  MoreHorizontal, ChevronRight, CheckCircle, Clock, XCircle, 
  Briefcase, UserX, FileText, ArrowRight, PieChart, BarChart3, TrendingUp
} from 'lucide-react';
import { ExitRequest, Employee } from '../types';
import { generateExitRequests, DEPARTMENTS } from '../mockData';
import ExitWizard from './ExitWizard';
import ExitDetails from './ExitDetails';

interface ExitHorizonProps {
    employees?: Employee[];
    onExitCreate?: (request: ExitRequest) => void;
}

// --- HELPER CHART COMPONENTS ---

const BarChart = ({ data }: { data: { label: string; value: number }[] }) => {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex items-end justify-between h-40 pt-6 pb-2 gap-2">
      {data.map((item, idx) => {
        const heightPct = (item.value / maxValue) * 100;
        return (
          <div
            key={idx}
            className="flex flex-col items-center flex-1 h-full group cursor-default" // added h-full
          >
            <div className="relative w-full px-1 h-full flex items-end justify-center">
              {/* Tooltip */}
              <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-800 text-white text-[10px] py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10">
                {item.value} Exits
              </div>
              {/* Bar */}
              <div
                className="w-full max-w-[24px] bg-primary rounded-t-sm hover:bg-secondary transition-all duration-500 ease-out relative"
                style={{
                  height: `${heightPct}%`,
                  opacity: heightPct === 0 ? 0.1 : 1,
                }}
              ></div>
            </div>
            <span className="text-[10px] text-neutral-secondary mt-2 font-medium truncate w-full text-center">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const DonutChart = ({ data }: { data: { label: string, value: number, color: string }[] }) => {
    const total = data.reduce((acc, curr) => acc + curr.value, 0);
    let currentAngle = 0;

    // Create conic gradient string
    const gradientParts = data.map(item => {
        const percentage = (item.value / total) * 100;
        const endAngle = currentAngle + percentage;
        const str = `${item.color} ${currentAngle}% ${endAngle}%`;
        currentAngle = endAngle;
        return str;
    });

    const gradientString = `conic-gradient(${gradientParts.join(', ')})`;

    return (
        <div className="flex items-center gap-6">
            {/* Chart */}
            <div className="relative w-32 h-32 shrink-0">
                <div 
                    className="w-full h-full rounded-full"
                    style={{ background: gradientString }}
                ></div>
                {/* Inner White Circle for Donut Effect */}
                <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center flex-col shadow-sm">
                    <span className="text-2xl font-bold text-neutral-primary">{total}</span>
                    <span className="text-[10px] text-neutral-secondary uppercase font-bold">Total</span>
                </div>
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-2">
                {data.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }}></div>
                            <span className="text-neutral-secondary">{item.label}</span>
                        </div>
                        <span className="font-bold text-neutral-primary">{Math.round((item.value / total) * 100)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const HorizontalBarChart = ({ data }: { data: { label: string, value: number }[] }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1);

    return (
        <div className="space-y-3">
            {data.map((item, idx) => (
                <div key={idx} className="group">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-neutral-secondary">{item.label}</span>
                        <span className="font-bold text-neutral-primary">{item.value}</span>
                    </div>
                    <div className="w-full bg-neutral-page h-2 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-flexi-primary rounded-full group-hover:bg-flexi-secondary transition-all duration-500" 
                            style={{ width: `${(item.value / maxValue) * 100}%` }}
                        ></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// --- MAIN COMPONENT ---

const ExitHorizon: React.FC<ExitHorizonProps> = ({ employees = [], onExitCreate }) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'completed'>('pipeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [showWizard, setShowWizard] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ExitRequest | null>(null);
  
  // Mock Data (Local + Prop based could be merged in real app)
  const [localRequests, setLocalRequests] = useState<ExitRequest[]>(() => generateExitRequests(24)); // Increased count for better charts

  // --- ANALYTICS DATA AGGREGATION ---
  const analyticsData = useMemo(() => {
      // 1. Monthly Trends (Last 6 months)
      const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
      const trendData = months.map(m => ({ label: m, value: 0 }));
      
      // 2. Reasons
      const reasonCounts: Record<string, number> = {};
      
      // 3. Departments
      const deptCounts: Record<string, number> = {};

      localRequests.forEach(req => {
          // Mocking date mapping for demo purposes since dates are randomized strings
          // In real app: parse req.requestDate
          const randomMonthIdx = Math.floor(Math.random() * 6); 
          trendData[randomMonthIdx].value += 1;

          // Reasons
          reasonCounts[req.reason] = (reasonCounts[req.reason] || 0) + 1;

          // Depts
          deptCounts[req.department] = (deptCounts[req.department] || 0) + 1;
      });

      // Format Reasons for Donut
      const reasonColors = ['#3D3A5C', '#5B5880', '#9CA3AF', '#E5E7EB', '#E5C99B', '#E8A9A0'];
      const reasonData = Object.entries(reasonCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([label, value], idx) => ({
            label,
            value,
            color: reasonColors[idx] || '#E5E7EB'
        }));

      // Format Depts for Horz Bar
      const deptData = Object.entries(deptCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([label, value]) => ({ label, value }));

      return { trendData, reasonData, deptData };
  }, [localRequests]);

  // Derived Data for List
  const pendingRequests = localRequests.filter(r => r.status !== 'Completed' && r.status !== 'Withdrawn');
  const completedRequests = localRequests.filter(r => r.status === 'Completed' || r.status === 'Withdrawn');
  
  const displayedRequests = (activeTab === 'pipeline' ? pendingRequests : completedRequests).filter(r => {
      const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = deptFilter === 'All' || r.department === deptFilter;
      return matchesSearch && matchesDept;
  });

  const getStatusColor = (status: ExitRequest['status']) => {
      switch(status) {
          case 'Requested': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
          case 'Interview Scheduled': return 'bg-blue-50 text-flexi-primary border-blue-200';
          case 'Asset Recovery': return 'bg-orange-50 text-orange-700 border-orange-200';
          case 'Final Settlement': return 'bg-purple-50 text-purple-700 border-purple-200';
          case 'Completed': return 'bg-green-50 text-green-700 border-green-200';
          case 'Withdrawn': return 'bg-neutral-page text-neutral-500 border-neutral-200';
          default: return 'bg-neutral-page text-neutral-primary';
      }
  };

  const getTypeIcon = (type: ExitRequest['type']) => {
      switch(type) {
          case 'Resignation': return <FileText className="w-3.5 h-3.5" />;
          case 'Termination': return <AlertTriangle className="w-3.5 h-3.5" />;
          case 'Retirement': return <Clock className="w-3.5 h-3.5" />;
          default: return <UserX className="w-3.5 h-3.5" />;
      }
  };

  const handleWizardSubmit = (newRequest: ExitRequest) => {
      setLocalRequests(prev => [newRequest, ...prev]);
      setShowWizard(false);
      if (onExitCreate) {
          onExitCreate(newRequest);
      }
  };

  const handleUpdate = (updatedRequest: ExitRequest) => {
      setLocalRequests(prev => prev.map(req => req.id === updatedRequest.id ? updatedRequest : req));
      setSelectedRequest(updatedRequest); 
  };

  if (showWizard) {
      return (
          <ExitWizard 
            employees={employees}
            onCancel={() => setShowWizard(false)}
            onSubmit={handleWizardSubmit}
          />
      );
  }
const dummyData = [
    { label: 'Sept', value: 9 },
    { label: 'Oct', value: 7 },
  { label: 'Nov', value: 5 },
  { label: 'Dec', value: 8 },
  { label: 'Jan', value: 3 },
  { label: 'Feb', value: 15 },
];

  if (selectedRequest) {
      return (
          <ExitDetails 
             request={selectedRequest}
             onBack={() => setSelectedRequest(null)}
             onUpdate={handleUpdate}
          />
      );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Header with Flexi Gradient */}
      <div className="bg-primary  rounded-2xl p-8 shadow-lg text-white mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                  <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Exit Horizon</h2>
                  <p className="text-blue-100 max-w-xl text-sm leading-relaxed">
                      Manage offboarding workflows, track clearances, and conduct exit interviews. Ensure a smooth transition for departing employees.
                  </p>
              </div>
              <button 
                  onClick={() => setShowWizard(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-white !text-gray-700 text-sm font-bold rounded-xl hover:bg-blue-50 shadow-md transition-all self-start md:self-auto"
              >
                  <UserX className="w-4 h-4" /> Initiate Exit
              </button>
          </div>
      </div>

      {/* Analytics Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-neutral-border shadow-card hover:shadow-soft transition-all flex items-center justify-between">
              <div>
                  <p className="text-xs font-bold text-neutral-muted uppercase tracking-wider mb-1">Exits in Pipeline</p>
                  <h3 className="text-2xl font-bold text-neutral-primary">{pendingRequests.length}</h3>
                  <p className="text-xs text-neutral-secondary mt-1">Active requests</p>
              </div>
              <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
                  <Clock className="w-6 h-6" />
              </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-neutral-border shadow-card hover:shadow-soft transition-all flex items-center justify-between">
              <div>
                  <p className="text-xs font-bold text-neutral-muted uppercase tracking-wider mb-1">Avg. Tenure</p>
                  <h3 className="text-2xl font-bold text-neutral-primary">2.4 <span className="text-sm font-medium text-neutral-muted">yrs</span></h3>
                  <p className="text-xs text-state-success mt-1 flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" /> +0.2 vs last year
                  </p>
              </div>
              <div className="p-3 bg-flexi-light text-flexi-primary rounded-lg">
                  <Briefcase className="w-6 h-6" />
              </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-neutral-border shadow-card hover:shadow-soft transition-all flex items-center justify-between">
              <div>
                  <p className="text-xs font-bold text-neutral-muted uppercase tracking-wider mb-1">Voluntary Rate</p>
                  <h3 className="text-2xl font-bold text-neutral-primary">85%</h3>
                  <p className="text-xs text-neutral-secondary mt-1">Resignations vs Terminations</p>
              </div>
              <div className="p-3 bg-green-50 text-state-success rounded-lg">
                  <CheckCircle className="w-6 h-6" />
              </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-neutral-border shadow-card hover:shadow-soft transition-all flex items-center justify-between">
              <div>
                  <p className="text-xs font-bold text-neutral-muted uppercase tracking-wider mb-1">Settlement Pending</p>
                  <h3 className="text-2xl font-bold text-neutral-primary">4</h3>
                  <p className="text-xs text-state-error mt-1">Require immediate action</p>
              </div>
              <div className="p-3 bg-red-50 text-state-error rounded-lg">
                  <AlertTriangle className="w-6 h-6" />
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* LEFT: Main List (3 cols) */}
          <div className="xl:col-span-3 space-y-4">
              
              {/* Toolbar */}
              <div className="bg-white p-2 rounded-xl border border-neutral-border shadow-card flex flex-col sm:flex-row justify-between gap-3">
                  <div className="flex p-1 bg-neutral-page rounded-lg self-start sm:self-center">
                      <button 
                        onClick={() => setActiveTab('pipeline')}
                        className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'pipeline' ? 'bg-primary text-white shadow-sm' : 'text-neutral-secondary hover:text-gray-700'}`}
                      >
                          Pipeline
                      </button>
                      <button 
                        onClick={() => setActiveTab('completed')}
                        className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'completed' ? 'bg-primary text-white shadow-sm' : 'text-neutral-secondary hover:text-gray-700'}`}
                      >
                          Completed / Archived
                      </button>
                  </div>
                  
                  <div className="flex gap-2 flex-1 sm:justify-end">
                      <div className="relative flex-1 sm:max-w-[200px]">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted w-3.5 h-3.5" />
                          <input 
                              type="text" 
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Search..."
                              className="w-full pl-9 pr-3 py-1.5 text-sm border border-neutral-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-flexi-primary/20 focus:border-flexi-primary"
                          />
                      </div>
                      <div className="relative">
                          <select 
                             value={deptFilter}
                             onChange={(e) => setDeptFilter(e.target.value)}
                             className="pl-3 pr-8 py-1.5 text-sm border border-neutral-border rounded-lg bg-white outline-none cursor-pointer appearance-none focus:ring-2 focus:ring-flexi-primary/20 focus:border-flexi-primary"
                          >
                              <option value="All">All Depts</option>
                              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                          <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-muted w-3.5 h-3.5 pointer-events-none" />
                      </div>
                  </div>
              </div>

              {/* Table */}
              <div className="bg-white border border-neutral-border rounded-xl shadow-card overflow-hidden">
                  <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                          <thead className="bg-neutral-page border-b border-neutral-border">
                              <tr>
                                  <th className="p-4 text-xs font-semibold text-neutral-secondary uppercase tracking-wider">Employee</th>
                                  <th className="p-4 text-xs font-semibold text-neutral-secondary uppercase tracking-wider">Type & Reason</th>
                                  <th className="p-4 text-xs font-semibold text-neutral-secondary uppercase tracking-wider">Exit Dates</th>
                                  <th className="p-4 text-xs font-semibold text-neutral-secondary uppercase tracking-wider">Stage</th>
                                  <th className="p-4 text-xs font-semibold text-neutral-secondary uppercase tracking-wider text-right">Actions</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-border">
                              {displayedRequests.length > 0 ? (
                                  displayedRequests.map(req => (
                                      <tr 
                                        key={req.id} 
                                        onClick={() => setSelectedRequest(req)}
                                        className="hover:bg-[#F0EFF6] transition-colors group cursor-pointer"
                                      >
                                          <td className="p-4">
                                              <div className="flex items-center gap-3">
                                                  <img src={req.avatar} alt="" className="w-9 h-9 rounded-full border border-neutral-border" />
                                                  <div>
                                                      <div className="text-sm font-bold text-neutral-primary">{req.name}</div>
                                                      <div className="text-xs text-neutral-muted">{req.role}</div>
                                                  </div>
                                              </div>
                                          </td>
                                          <td className="p-4">
                                              <div className="flex flex-col gap-1">
                                                  <div className={`flex items-center gap-1.5 text-xs font-bold px-2 py-0.5 rounded w-fit ${
                                                      req.type === 'Termination' ? 'bg-red-50 text-state-error' : 
                                                      req.type === 'Retirement' ? 'bg-blue-50 text-flexi-primary' : 
                                                      'bg-neutral-100 text-neutral-600'
                                                  }`}>
                                                      {getTypeIcon(req.type)} {req.type}
                                                  </div>
                                                  <div className="text-xs text-neutral-secondary pl-1 truncate max-w-[140px]" title={req.reason}>
                                                      "{req.reason}"
                                                  </div>
                                              </div>
                                          </td>
                                          <td className="p-4">
                                              <div className="text-xs space-y-1">
                                                  <div className="flex items-center gap-2 text-neutral-secondary">
                                                      <span className="w-16 text-neutral-muted uppercase text-[10px] font-bold">Resigned</span>
                                                      <span className="font-medium">{req.requestDate}</span>
                                                  </div>
                                                  <div className="flex items-center gap-2 text-neutral-primary">
                                                      <span className="w-16 text-neutral-muted uppercase text-[10px] font-bold">Last Day</span>
                                                      <span className="font-bold">{req.lastWorkingDay}</span>
                                                  </div>
                                              </div>
                                          </td>
                                          <td className="p-4">
                                              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(req.status)}`}>
                                                  {req.status}
                                              </span>
                                          </td>
                                          <td className="p-4 text-right">
                                              <button className="p-2 text-neutral-muted hover:bg-neutral-page hover:text-flexi-primary rounded-lg transition-colors">
                                                  <ChevronRight className="w-4 h-4" />
                                              </button>
                                          </td>
                                      </tr>
                                  ))
                              ) : (
                                  <tr>
                                      <td colSpan={5} className="p-12 text-center text-neutral-muted">
                                          No exit requests found matching your filters.
                                      </td>
                                  </tr>
                              )}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>

          {/* RIGHT: Analytics & Widgets (1 col) */}
          <div className="space-y-6">
              
              {/* Exit Reasons Chart */}
              <div className="bg-white rounded-xl border border-neutral-border shadow-card overflow-hidden">
                  <div className="p-6 border-b border-neutral-border bg-neutral-page/10">
                     <h4 className="text-sm font-bold text-neutral-primary flex items-center gap-2">
                        <PieChart className="w-4 h-4 text-flexi-primary" /> Exit Reasons
                     </h4>
                  </div>
                  <div className="p-6">
                     <DonutChart data={analyticsData.reasonData} />
                  </div>
              </div>

               {/* Monthly Trends Chart */}
               <div className="bg-white rounded-xl border border-neutral-border shadow-card overflow-hidden">
                  <div className="p-6 border-b border-neutral-border bg-neutral-page/10 flex justify-between items-center">
                    <h4 className="text-sm font-bold text-neutral-primary flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-flexi-primary" /> Monthly Trends
                    </h4>
                    <span className="text-[10px] bg-white border border-neutral-border px-2 py-0.5 rounded text-neutral-secondary">Last 6 Months</span>
                  </div>
                  <div className="p-6">
                     <BarChart data={dummyData} />
                  </div>
              </div>

               {/* Department Turnover Chart */}
               <div className="bg-white rounded-xl border border-neutral-border shadow-card overflow-hidden">
                  <div className="p-6 border-b border-neutral-border bg-neutral-page/10">
                    <h4 className="text-sm font-bold text-neutral-primary flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-flexi-primary" /> Turnover by Dept
                    </h4>
                  </div>
                  <div className="p-6">
                      <HorizontalBarChart data={analyticsData.deptData} />
                  </div>
              </div>

              {/* Quick Actions Widget */}
              <div className="bg-white rounded-xl border border-neutral-border shadow-card overflow-hidden">
                  <div className="p-6 border-b border-neutral-border bg-neutral-page/10">
                     <h4 className="text-sm font-bold text-neutral-primary">Quick Actions</h4>
                  </div>
                  <div className="p-6 space-y-2">
                      <button className="w-full flex items-center justify-between p-3 rounded-lg border border-neutral-border hover:border-flexi-primary hover:bg-flexi-light/20 transition-all group text-left bg-neutral-page/20 hover:shadow-sm">
                          <span className="text-xs font-bold text-neutral-secondary group-hover:text-flexi-primary">Download Exit Policy</span>
                          <ArrowRight className="w-4 h-4 text-neutral-muted group-hover:text-flexi-primary" />
                      </button>
                      <button className="w-full flex items-center justify-between p-3 rounded-lg border border-neutral-border hover:border-flexi-primary hover:bg-flexi-light/20 transition-all group text-left bg-neutral-page/20 hover:shadow-sm">
                          <span className="text-xs font-bold text-neutral-secondary group-hover:text-flexi-primary">View Checklist Templates</span>
                          <ArrowRight className="w-4 h-4 text-neutral-muted group-hover:text-flexi-primary" />
                      </button>
                  </div>
              </div>

          </div>
      </div>
    </div>
  );
};

export default ExitHorizon;
