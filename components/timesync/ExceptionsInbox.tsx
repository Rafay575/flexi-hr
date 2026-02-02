
import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Smartphone, 
  History, 
  ShieldAlert, 
  ChevronRight, 
  MoreVertical, 
  X, 
  Bell, 
  RefreshCcw,
  Zap,
  ArrowRight,
  MessageSquare,
  ShieldX,
  FileText,
  User,
  Info
} from 'lucide-react';

type ExceptionSeverity = 'HIGH' | 'MEDIUM' | 'LOW';
type ExceptionType = 
  | 'MISSING_IN' 
  | 'MISSING_OUT' 
  | 'LATE_TOLERANCE' 
  | 'EARLY_DEPARTURE' 
  | 'GEO_VIOLATION' 
  | 'UNSCHEDULED' 
  | 'DEVICE_MISMATCH' 
  | 'BUDDY_PUNCH' 
  | 'REST_VIOLATION';

interface AttendanceException {
  id: string;
  employee: string;
  avatar: string;
  date: string;
  type: ExceptionType;
  severity: ExceptionSeverity;
  detectedAt: string;
  slaHours: number;
  details: string;
  status: 'PENDING' | 'RESOLVED';
}

const SEVERITY_CONFIG: Record<ExceptionSeverity, { label: string; color: string; icon: string }> = {
  HIGH: { label: 'High', color: 'text-red-600 bg-red-50 border-red-100', icon: '🔴' },
  MEDIUM: { label: 'Medium', color: 'text-orange-600 bg-orange-50 border-orange-100', icon: '🟡' },
  LOW: { label: 'Low', color: 'text-green-600 bg-green-50 border-green-100', icon: '🟢' },
};

const TYPE_LABELS: Record<ExceptionType, string> = {
  MISSING_IN: 'Missing In Punch',
  MISSING_OUT: 'Missing Out Punch',
  LATE_TOLERANCE: 'Late Beyond Tolerance',
  EARLY_DEPARTURE: 'Early Departure',
  GEO_VIOLATION: 'Geo Violation',
  UNSCHEDULED: 'Unscheduled Work',
  DEVICE_MISMATCH: 'Device Mismatch',
  BUDDY_PUNCH: 'Buddy Punch Alert',
  REST_VIOLATION: 'Rest Rule Violation',
};

const MOCK_EXCEPTIONS: AttendanceException[] = Array.from({ length: 45 }).map((_, i) => ({
  id: `EXC-${5000 + i}`,
  employee: ['Sarah Chen', 'James Wilson', 'Ahmed Khan', 'Priya Das', 'Elena Frost', 'Marcus Low'][i % 6],
  avatar: ['SC', 'JW', 'AK', 'PD', 'EF', 'ML'][i % 6],
  date: `Jan ${15 - (i % 5)}, 2025`,
  type: (['MISSING_IN', 'MISSING_OUT', 'LATE_TOLERANCE', 'GEO_VIOLATION', 'BUDDY_PUNCH', 'DEVICE_MISMATCH'] as ExceptionType[])[i % 6],
  severity: i % 10 === 0 ? 'HIGH' : i % 3 === 0 ? 'MEDIUM' : 'LOW',
  detectedAt: '10:15 AM',
  slaHours: Math.floor(Math.random() * 24),
  details: i % 6 === 4 ? 'Punch from unauthorized mobile device (Android v12)' : 'System detected mismatch between GPS and Office geofence.',
  status: 'PENDING'
}));

export const ExceptionsInbox: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ExceptionType | 'ALL'>('ALL');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedException, setSelectedException] = useState<AttendanceException | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const filteredItems = useMemo(() => {
    return MOCK_EXCEPTIONS.filter(item => {
      const matchesTab = activeTab === 'ALL' || item.type === activeTab;
      const matchesSearch = item.employee.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <ShieldAlert className="text-[#3E3B6F]" size={28} /> Exceptions Inbox
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Detect and resolve attendance anomalies and fraud alerts</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl shadow-sm">
            <RefreshCcw size={14} className={`text-gray-400 ${autoRefresh ? 'animate-spin' : ''}`} />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Auto-Refresh</span>
            <div 
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`w-8 h-4 rounded-full relative p-0.5 cursor-pointer transition-all ${autoRefresh ? 'bg-green-500' : 'bg-gray-200'}`}
            >
              <div className={`w-3 h-3 bg-white rounded-full transition-all ${autoRefresh ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all">
            <Zap size={18} /> Bulk Resolve
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Exceptions</p>
            <p className="text-3xl font-black text-gray-800 tabular-nums">45</p>
          </div>
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
            <AlertTriangle size={28} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Overdue SLA</p>
            <p className="text-3xl font-black text-red-600 tabular-nums">8</p>
          </div>
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
            <Clock size={28} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Resolved Today</p>
            <p className="text-3xl font-black text-green-600 tabular-nums">23</p>
          </div>
          <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
            <CheckCircle2 size={28} />
          </div>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="bg-white border border-gray-200 rounded-2xl p-1 flex items-center gap-1 overflow-x-auto no-scrollbar shadow-sm">
        {[
          { id: 'ALL', label: 'All' },
          { id: 'MISSING_OUT', label: 'Missing Punch' },
          { id: 'LATE_TOLERANCE', label: 'Late/Early' },
          { id: 'GEO_VIOLATION', label: 'Geo Violation' },
          { id: 'BUDDY_PUNCH', label: 'Fraud Alerts' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#3E3B6F] text-white shadow-lg' 
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex items-center gap-4">
           <div className="relative flex-1 max-w-md">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
             <input 
              type="text" 
              placeholder="Search employee or exception ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-[#3E3B6F]/10" 
             />
           </div>
           {selectedIds.size > 0 && (
             <div className="flex items-center gap-2 animate-in slide-in-from-right-4 duration-300">
               <button className="px-4 py-2 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-all flex items-center gap-2 shadow-lg shadow-green-900/10">
                 <CheckCircle2 size={14} /> Resolve {selectedIds.size} Selected
               </button>
               <button className="px-4 py-2 bg-white border border-gray-200 text-gray-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center gap-2">
                 <Bell size={14} /> Notify Staff
               </button>
               <button onClick={() => setSelectedIds(new Set())} className="p-2 text-gray-400 hover:text-red-500"><X size={18}/></button>
             </div>
           )}
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/80">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <th className="px-6 py-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    onChange={(e) => {
                      if (e.target.checked) setSelectedIds(new Set(filteredItems.map(i => i.id)));
                      else setSelectedIds(new Set());
                    }}
                    checked={selectedIds.size === filteredItems.length && filteredItems.length > 0}
                    className="w-4 h-4 rounded border-gray-300 text-[#3E3B6F] focus:ring-[#3E3B6F]"
                  />
                </th>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4 text-center">Date</th>
                <th className="px-6 py-4">Exception</th>
                <th className="px-6 py-4 text-center">Severity</th>
                <th className="px-6 py-4">SLA Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredItems.map((item) => (
                <tr key={item.id} className={`group hover:bg-gray-50/80 transition-all ${selectedIds.has(item.id) ? 'bg-[#3E3B6F]/5' : ''}`}>
                  <td className="px-6 py-4 text-center">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.has(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      className="w-4 h-4 rounded border-gray-300 text-[#3E3B6F] focus:ring-[#3E3B6F]"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary-gradient flex items-center justify-center text-white text-[11px] font-black shadow-lg shadow-[#3E3B6F]/10">
                        {item.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate">{item.employee}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">{item.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-[11px] font-bold text-gray-500 tabular-nums">
                    {item.date}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-gray-700">{TYPE_LABELS[item.type]}</span>
                      <span className="text-[10px] text-gray-400 font-medium truncate max-w-[200px] italic">"{item.details}"</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${SEVERITY_CONFIG[item.severity].color}`}>
                      <span>{SEVERITY_CONFIG[item.severity].icon}</span>
                      <span>{SEVERITY_CONFIG[item.severity].label}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-lg border text-[10px] font-black ${
                      item.slaHours < 4 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-gray-100 text-gray-400 border-gray-200'
                    }`}>
                      <Clock size={12} /> {item.slaHours}h left
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2  transition-all">
                      <button className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-500 hover:text-white transition-all shadow-sm" title="Resolve">
                        <CheckCircle2 size={16} />
                      </button>
                      <button className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all shadow-sm" title="Request Regularization">
                        <History size={16} />
                      </button>
                      <button 
                        onClick={() => setSelectedException(item)}
                        className="p-2 bg-white border border-gray-200 text-gray-400 rounded-lg hover:text-[#3E3B6F] hover:border-[#3E3B6F] transition-all"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL DRAWER */}
      {selectedException && (
        <div className="fixed inset-0 z-[150] flex justify-end overflow-hidden">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedException(null)}></div>
          <div className="relative w-full max-w-xl bg-white h-full shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
            {/* DRAWER HEADER */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
               <div className="flex items-center gap-4">
                 <div className={`p-2 rounded-xl border-2 ${SEVERITY_CONFIG[selectedException.severity].color}`}>
                   <AlertTriangle size={20} />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-gray-800 tabular-nums">Exception Audit: {selectedException.id}</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{selectedException.date} • {selectedException.detectedAt} Detection</p>
                 </div>
               </div>
               <button onClick={() => setSelectedException(null)} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400"><X size={24}/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {/* EMPLOYEE INFO */}
              <div className="flex items-center gap-5 p-5 bg-gray-50 rounded-3xl border border-gray-100">
                <div className="w-16 h-16 rounded-2xl bg-primary-gradient flex items-center justify-center text-white text-xl font-black shadow-lg">
                  {selectedException.avatar}
                </div>
                <div>
                  <h4 className="text-xl font-black text-gray-800 leading-tight">{selectedException.employee}</h4>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">FLX-2044 • Engineering Team</p>
                  <div className="mt-2 flex gap-2">
                    <span className="text-[9px] font-black bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded uppercase border border-indigo-100">Morning Shift</span>
                    <span className="text-[9px] font-black bg-white text-gray-400 px-2 py-0.5 rounded uppercase border border-gray-200 tracking-tighter">Office HQ Based</span>
                  </div>
                </div>
              </div>

              {/* TRACE TIMELINE */}
              <div className="space-y-4">
                <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Zap size={14} className="text-yellow-500" /> Calculation Trace
                </h5>
                <div className="bg-gray-50 rounded-3xl border border-gray-100 p-6 space-y-6">
                   <div className="flex gap-4">
                      <div className="w-1 bg-[#3E3B6F] rounded-full shrink-0"></div>
                      <div className="flex-1">
                         <div className="flex justify-between items-center mb-1">
                            <p className="text-xs font-black text-gray-800 uppercase tracking-tight">Punch Event Recorded</p>
                            <span className="text-[10px] font-black text-indigo-600 tabular-nums">09:02 AM</span>
                         </div>
                         <p className="text-[10px] text-gray-500 font-medium">Method: Mobile-Geo (Android App v4.2.1)</p>
                      </div>
                   </div>

                   <div className="flex gap-4">
                      <div className="w-1 bg-red-500 rounded-full shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.3)]"></div>
                      <div className="flex-1">
                         <div className="flex justify-between items-center mb-1">
                            <p className="text-xs font-black text-red-600 uppercase tracking-tight">Geofence Violation Detected</p>
                            <span className="text-[10px] font-black text-red-500 tabular-nums">09:03 AM</span>
                         </div>
                         <div className="mt-2 flex items-center gap-3 p-3 bg-red-50/50 rounded-xl border border-red-100">
                            <MapPin size={16} className="text-red-500" />
                            <div className="flex-1 min-w-0">
                               <p className="text-[10px] font-bold text-red-800">Distance: 420m from HQ</p>
                               <p className="text-[9px] text-red-600 font-medium">Lat: 24.8607 • Long: 67.0011</p>
                            </div>
                            <button className="text-[9px] font-black text-red-800 uppercase underline">View Map</button>
                         </div>
                      </div>
                   </div>

                   <div className="flex gap-4 opacity-40">
                      <div className="w-1 bg-gray-300 rounded-full shrink-0"></div>
                      <div className="flex-1">
                         <div className="flex justify-between items-center mb-1">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-tight">Punch Out Event</p>
                            <span className="text-[10px] font-black tabular-nums">PENDING</span>
                         </div>
                      </div>
                   </div>
                </div>
              </div>

              {/* SECURITY & EVIDENCE */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Smartphone size={14} className="text-blue-500" /> Device Evidence
                  </h5>
                  <div className="p-4 bg-blue-50/30 rounded-2xl border border-blue-100 space-y-2">
                     <div className="flex justify-between text-[10px] font-bold"><span className="text-gray-400 uppercase">Device ID:</span> <span className="text-blue-700">#4A29-FF-12</span></div>
                     <div className="flex justify-between text-[10px] font-bold"><span className="text-gray-400 uppercase">Registered:</span> <span className="text-green-600">MATCH ✓</span></div>
                     <div className="flex justify-between text-[10px] font-bold"><span className="text-gray-400 uppercase">VPN/Proxy:</span> <span className="text-green-600">NONE ✓</span></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <ShieldX size={14} className="text-red-500" /> Fraud Risk
                  </h5>
                  <div className="p-4 bg-red-50/30 rounded-2xl border border-red-100 space-y-2 text-center">
                     <p className="text-lg font-black text-red-600 tabular-nums">12%</p>
                     <p className="text-[9px] font-bold text-red-400 uppercase tracking-tighter leading-none">Buddy Punch Probability</p>
                  </div>
                </div>
              </div>

              {/* SUGGESTED RESOLUTION */}
              <div className="p-6 bg-[#E8D5A3]/10 border border-[#E8D5A3]/30 rounded-3xl">
                 <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#3E3B6F]">
                       <Info size={20} />
                    </div>
                    <div className="flex-1">
                       <h5 className="text-xs font-black text-[#3E3B6F] uppercase tracking-widest mb-1">Recommended Action</h5>
                       <p className="text-[10px] text-gray-600 leading-relaxed font-medium">
                         Since the device is registered but geolocation is outside HQ, this may be a "Working from Client Site" scenario. <span className="font-bold">Request Regularization</span> from the employee to attach client visit proof.
                       </p>
                    </div>
                 </div>
              </div>

              {/* ACTION HISTORY */}
              <div className="space-y-4">
                 <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                   <History size={14} /> Investigation Log
                 </h5>
                 <div className="space-y-3">
                    <div className="flex gap-3">
                       <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[9px] font-black text-gray-400 shrink-0">JD</div>
                       <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-3 shadow-sm relative">
                          <p className="text-[10px] font-medium text-gray-700 leading-relaxed">"Checking if Alex was scheduled for a client visit today."</p>
                          <span className="text-[8px] font-bold text-gray-400 uppercase mt-2 block">Jane Doe • Today, 11:20 AM</span>
                          <div className="absolute right-3 top-3"><MoreVertical size={12} className="text-gray-300" /></div>
                       </div>
                    </div>
                 </div>
                 <div className="relative group">
                    <input type="text" placeholder="Add note or update investigation..." className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-4 pr-12 py-3 text-xs font-medium outline-none focus:bg-white transition-all focus:ring-4 focus:ring-[#3E3B6F]/5" />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#3E3B6F] hover:scale-110 transition-transform"><MessageSquare size={16}/></button>
                 </div>
              </div>
            </div>

            {/* DRAWER FOOTER */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4 shrink-0">
               <button onClick={() => setSelectedException(null)} className="flex-1 py-4 bg-white border border-gray-200 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-50 transition-all flex items-center justify-center gap-2">
                 Escalate Alert
               </button>
               <button className="flex-[2] py-4 bg-[#3E3B6F] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                 Resolve & Close <CheckCircle2 size={16} />
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
