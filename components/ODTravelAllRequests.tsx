
import React, { useState, useMemo } from 'react';
import { 
  Briefcase, Plane, Globe, Search, Filter, Download, 
  Calendar as CalendarIcon, List, CheckCircle2, XCircle, 
  MoreHorizontal, ChevronRight, MapPin, Clock, Users,
  AlertCircle, ArrowUpRight, ExternalLink, Eye, CheckSquare
} from 'lucide-react';

interface ODTravelRecord {
  id: string;
  employee: string;
  avatar: string;
  dept: string;
  type: 'Official Duty' | 'Local Travel' | 'Inter-city Travel' | 'International Travel';
  startDate: string;
  endDate: string;
  destination: string;
  purpose: string;
  status: 'Pending' | 'Approved' | 'Active' | 'Completed' | 'Rejected';
}

const DEPARTMENTS = ['Engineering', 'Product', 'Sales', 'HR', 'Finance', 'Operations', 'Marketing'];

const MOCK_DATA: ODTravelRecord[] = Array.from({ length: 30 }, (_, i) => {
  const types: ODTravelRecord['type'][] = ['Official Duty', 'Local Travel', 'Inter-city Travel', 'International Travel'];
  const statuses: ODTravelRecord['status'][] = ['Pending', 'Approved', 'Active', 'Completed', 'Rejected'];
  const names = ['Ahmed Khan', 'Sara Miller', 'Tom Chen', 'Anna Bell', 'Zoya Malik', 'Ali Raza', 'Mona Shah', 'Hamza Aziz'];
  
  const type = types[i % 4];
  const status = i < 8 ? 'Pending' : i < 12 ? 'Active' : i < 25 ? 'Completed' : 'Approved';
  
  return {
    id: `ODT-2025-${1000 + i}`,
    employee: names[i % names.length],
    avatar: names[i % names.length].split(' ').map(n => n[0]).join(''),
    dept: DEPARTMENTS[i % DEPARTMENTS.length],
    type,
    startDate: `2025-02-${String(10 + (i % 15)).padStart(2, '0')}`,
    endDate: `2025-02-${String(12 + (i % 15)).padStart(2, '0')}`,
    destination: i % 4 === 3 ? 'Dubai, UAE' : i % 2 === 0 ? 'Local Client Office' : 'Lahore Branch',
    purpose: i % 3 === 0 ? 'Client Implementation' : i % 3 === 1 ? 'Quarterly Review' : 'System Training',
    status
  };
});

export const ODTravelAllRequests = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredData = useMemo(() => {
    return MOCK_DATA.filter(item => {
      const matchesTab = activeTab === 'All' || 
                         (activeTab === 'OD' && item.type === 'Official Duty') ||
                         (activeTab === 'Travel' && item.type.includes('Travel')) ||
                         (activeTab === 'Pending' && item.status === 'Pending') ||
                         (activeTab === 'Active' && item.status === 'Active') ||
                         (activeTab === 'Completed' && item.status === 'Completed');
      
      const matchesSearch = item.employee.toLowerCase().includes(search.toLowerCase()) || 
                           item.id.toLowerCase().includes(search.toLowerCase());
      
      const matchesDept = deptFilter === 'All' || item.dept === deptFilter;
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

      return matchesTab && matchesSearch && matchesDept && matchesStatus;
    });
  }, [activeTab, search, deptFilter, statusFilter]);

  const getTypeBadge = (type: ODTravelRecord['type']) => {
    switch (type) {
      case 'Official Duty': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Local Travel': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Inter-city Travel': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'International Travel': return 'bg-purple-50 text-purple-600 border-purple-100';
    }
  };

  const getStatusStyle = (status: ODTravelRecord['status']) => {
    switch (status) {
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Active': return 'bg-indigo-50 text-indigo-700 border-indigo-200 animate-pulse';
      case 'Completed': return 'bg-gray-100 text-gray-500 border-gray-200';
      case 'Approved': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Rejected': return 'bg-red-50 text-red-700 border-red-200';
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500 font-['League_Spartan']">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-[#3E3B6F]">All OD/Travel Requests</h2>
          <p className="text-gray-500 font-medium">Global view of all out-of-office assignments and business travel.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[#3E3B6F] text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              <List size={18} />
            </button>
            <button 
              onClick={() => setViewMode('calendar')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-[#3E3B6F] text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              <CalendarIcon size={18} />
            </button>
          </div>
          <button className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all active:scale-95">
            <Download size={18} /> Export List
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-indigo-600 p-6 rounded-[32px] text-white flex items-center gap-5 shadow-xl shadow-indigo-600/20 relative overflow-hidden group">
          <div className="p-4 bg-white/10 rounded-2xl relative z-10 group-hover:scale-110 transition-transform"><Globe size={24}/></div>
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Currently Active</p>
            <p className="text-2xl font-bold">12 Assignments</p>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10 rotate-12"><Globe size={120} /></div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl"><Clock size={24}/></div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pending Approval</p>
            <p className="text-2xl font-bold text-gray-900">8 Requests</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl"><CalendarIcon size={24}/></div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Upcoming (7d)</p>
            <p className="text-2xl font-bold text-gray-900">15 Planned</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-purple-100 shadow-sm flex items-center gap-5">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl"><Plane size={24}/></div>
          <div>
            <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">International Pending</p>
            <p className="text-2xl font-bold text-purple-900">2 Critical</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        {/* Filters Panel */}
        <div className="p-8 border-b border-gray-100 bg-gray-50/30 space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by employee name or Request ID..." 
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#3E3B6F]/10 transition-all shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-400" />
              <select 
                className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold text-gray-600 outline-none shadow-sm"
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
              >
                <option value="All">All Departments</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select 
                className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold text-gray-600 outline-none shadow-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Approved">Approved</option>
              </select>
            </div>
          </div>

          <div className="flex gap-1 overflow-x-auto scrollbar-hide border-b border-gray-200">
            {['All', 'OD', 'Travel', 'Pending', 'Active', 'Completed'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-xs font-bold transition-all relative whitespace-nowrap ${
                  activeTab === tab ? 'text-[#3E3B6F]' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#3E3B6F] rounded-t-full" />}
              </button>
            ))}
          </div>
        </div>

        {viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID / Employee</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dates</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Destination</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Purpose</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/30 transition-colors group cursor-pointer">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-accent-peach flex items-center justify-center font-bold text-[#3E3B6F] text-xs">
                          {item.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{item.employee}</p>
                          <p className="text-[10px] text-gray-400 font-mono">{item.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase border w-fit ${getTypeBadge(item.type)}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-700">{item.startDate}</span>
                        <span className="text-[10px] text-gray-400">to {item.endDate}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">{item.destination}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-xs text-gray-600 font-medium truncate max-w-[150px]" title={item.purpose}>{item.purpose}</p>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2  transition-all">
                        {item.status === 'Pending' && (
                          <>
                            <button title="Approve" className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100"><CheckCircle2 size={16}/></button>
                            <button title="Reject" className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><XCircle size={16}/></button>
                          </>
                        )}
                        {item.status === 'Active' && (
                          <button title="Mark Complete" className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100"><CheckSquare size={16}/></button>
                        )}
                        <button className="p-2 text-gray-400 hover:text-[#3E3B6F] hover:bg-gray-100 rounded-lg transition-all">
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10">
            <div className="bg-gray-50 rounded-3xl p-10 text-center border-2 border-dashed border-gray-200">
               <CalendarIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
               <h4 className="text-lg font-bold text-gray-800">Visual Timeline View</h4>
               <p className="text-sm text-gray-500 max-w-sm mx-auto mt-2">Display all OD and Travel records on a unified team calendar. (Implementation would follow TeamCalendar logic with type-based coloring).</p>
               <div className="mt-8 flex justify-center gap-4">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-blue-500" /> <span className="text-xs font-bold text-gray-400">OD</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-purple-500" /> <span className="text-xs font-bold text-gray-400">International</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-orange-500" /> <span className="text-xs font-bold text-gray-400">Inter-city</span></div>
               </div>
            </div>
          </div>
        )}
      </div>

      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>
    </div>
  );
};
