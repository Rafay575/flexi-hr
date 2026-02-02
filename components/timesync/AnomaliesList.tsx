
import React, { useState, useMemo } from 'react';
import { 
  AlertCircle, 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  ChevronRight, 
  ShieldAlert, 
  Clock, 
  MapPin, 
  Smartphone, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  MessageSquare, 
  BarChart3,
  Calendar,
  User,
  ShieldCheck,
  FileText,
  Activity,
  ArrowUpRight
} from 'lucide-react';

type AnomalyCategory = 'PUNCH' | 'TIME' | 'LOCATION' | 'COMPLIANCE' | 'FRAUD';
type AnomalyStatus = 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';

interface AnomalyRecord {
  id: string;
  employee: string;
  avatar: string;
  date: string;
  category: AnomalyCategory;
  type: string;
  evidence: string;
  status: AnomalyStatus;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
}

const CATEGORY_UI: Record<AnomalyCategory, { label: string; color: string; icon: React.ReactNode }> = {
  PUNCH: { label: 'Punch Anomaly', color: 'bg-blue-50 text-blue-600 border-blue-100', icon: <Zap size={14} /> },
  TIME: { label: 'Time Anomaly', color: 'bg-indigo-50 text-indigo-600 border-indigo-100', icon: <Clock size={14} /> },
  LOCATION: { label: 'Location Anomaly', color: 'bg-orange-50 text-orange-600 border-orange-100', icon: <MapPin size={14} /> },
  COMPLIANCE: { label: 'Compliance', color: 'bg-purple-50 text-purple-600 border-purple-100', icon: <ShieldAlert size={14} /> },
  FRAUD: { label: 'Fraud Indicator', color: 'bg-red-50 text-red-600 border-red-100', icon: <AlertCircle size={14} /> },
};

const STATUS_UI: Record<AnomalyStatus, { label: string; color: string; dot: string }> = {
  OPEN: { label: 'Open', color: 'text-red-600 bg-red-50', dot: 'bg-red-500' },
  INVESTIGATING: { label: 'Investigating', color: 'text-orange-600 bg-orange-50', dot: 'bg-orange-500' },
  RESOLVED: { label: 'Resolved', color: 'text-green-600 bg-green-50', dot: 'bg-green-500' },
  DISMISSED: { label: 'Dismissed', color: 'text-gray-500 bg-gray-50', dot: 'bg-gray-400' },
};

const MOCK_ANOMALIES: AnomalyRecord[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `ANM-${7000 + i}`,
  employee: ['Sarah Chen', 'James Wilson', 'Ahmed Khan', 'Priya Das', 'Elena Frost', 'Marcus Low'][i % 6],
  avatar: ['SC', 'JW', 'AK', 'PD', 'EF', 'ML'][i % 6],
  date: `Jan ${15 - (i % 5)}, 2025`,
  category: (['PUNCH', 'TIME', 'LOCATION', 'COMPLIANCE', 'FRAUD'] as AnomalyCategory[])[i % 5],
  type: [
    'Missing Out Punch', 'Late Beyond Grace', 'Outside Geofence', 'Rest Rule Violation', 'Buddy Punching Pattern',
    'Duplicate Punch', 'Early Departure', 'Location Mismatch', 'Consecutive Absence', 'Device Sharing'
  ][i % 10],
  evidence: i % 2 === 0 ? 'Trace JSON available' : 'Geo-logs mismatched',
  status: (['OPEN', 'INVESTIGATING', 'RESOLVED', 'DISMISSED'] as AnomalyStatus[])[i % 4],
  severity: i % 7 === 0 ? 'HIGH' : i % 3 === 0 ? 'MEDIUM' : 'LOW'
}));

export const AnomaliesList: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<AnomalyCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyRecord | null>(null);

  const filteredItems = useMemo(() => {
    return MOCK_ANOMALIES.filter(item => {
      const matchesCat = activeCategory === 'ALL' || item.category === activeCategory;
      const matchesSearch = item.employee.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <ShieldAlert className="text-[#3E3B6F]" size={28} /> Attendance Anomalies
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Investigate and resolve pattern deviations and compliance risks</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
            <Calendar size={14} /> Jan 01 - Jan 15 <ChevronRight size={14} className="rotate-90" />
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all">
            <Download size={18} /> Export Data
          </button>
        </div>
      </div>

      {/* CATEGORY SELECTOR */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <button 
          onClick={() => setActiveCategory('ALL')}
          className={`p-4 rounded-2xl border-2 transition-all text-left flex flex-col justify-between h-28 ${activeCategory === 'ALL' ? 'border-[#3E3B6F] bg-[#3E3B6F]/5' : 'bg-white border-gray-100'}`}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeCategory === 'ALL' ? 'bg-[#3E3B6F] text-white' : 'bg-gray-100 text-gray-400'}`}>
            <Activity size={18} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</p>
            <p className={`text-lg font-black ${activeCategory === 'ALL' ? 'text-[#3E3B6F]' : 'text-gray-800'}`}>All Alerts</p>
          </div>
        </button>
        {(['PUNCH', 'TIME', 'LOCATION', 'COMPLIANCE', 'FRAUD'] as AnomalyCategory[]).map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`p-4 rounded-2xl border-2 transition-all text-left flex flex-col justify-between h-28 ${activeCategory === cat ? 'border-[#3E3B6F] bg-[#3E3B6F]/5' : 'bg-white border-gray-100'}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeCategory === cat ? 'bg-[#3E3B6F] text-white' : 'bg-gray-50 text-gray-400'}`}>
              {CATEGORY_UI[cat].icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{CATEGORY_UI[cat].label.split(' ')[0]}</p>
              <p className={`text-lg font-black truncate w-full ${activeCategory === cat ? 'text-[#3E3B6F]' : 'text-gray-800'}`}>
                {CATEGORY_UI[cat].label.split(' ')[1] || 'Anom.'}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by employee name or anomaly ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm font-medium border-none outline-none focus:ring-0"
          />
        </div>
        <div className="h-6 w-px bg-gray-100"></div>
        <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-500 hover:text-[#3E3B6F]">
          <Filter size={16} /> Advanced Filters
        </button>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/80">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] border-b border-gray-100">
                <th className="px-8 py-5">Anomaly ID</th>
                <th className="px-6 py-5">Employee</th>
                <th className="px-6 py-5 text-center">Date</th>
                <th className="px-6 py-5">Classification</th>
                <th className="px-6 py-5">Anomaly Description</th>
                <th className="px-6 py-5">Evidence</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredItems.map((item) => (
                <tr key={item.id} className="group hover:bg-gray-50/80 transition-all cursor-default">
                  <td className="px-8 py-5">
                    <span className="text-[11px] font-black text-indigo-600 tabular-nums">#{item.id}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-primary-gradient flex items-center justify-center text-white text-[10px] font-black shadow-lg">
                        {item.avatar}
                      </div>
                      <span className="text-xs font-bold text-gray-800">{item.employee}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center text-[11px] font-bold text-gray-500 tabular-nums">
                    {item.date}
                  </td>
                  <td className="px-6 py-5">
                    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${CATEGORY_UI[item.category].color}`}>
                      {CATEGORY_UI[item.category].icon}
                      {CATEGORY_UI[item.category].label}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-800">{item.type}</span>
                      {item.severity === 'HIGH' && <span className="text-[8px] font-black text-red-500 uppercase">Critical Priority</span>}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <button className="flex items-center gap-1.5 text-[10px] font-bold text-[#3E3B6F] hover:underline">
                      <FileText size={12} /> {item.evidence} <ArrowUpRight size={10} />
                    </button>
                  </td>
                  <td className="px-6 py-5">
                    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${STATUS_UI[item.status].color}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${STATUS_UI[item.status].dot}`} />
                      {STATUS_UI[item.status].label}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2  transition-all">
                      <button 
                        onClick={() => setSelectedAnomaly(item)}
                        className="px-4 py-2 bg-[#3E3B6F] text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#3E3B6F]/20 hover:scale-105 active:scale-95 transition-all"
                      >
                        Investigate
                      </button>
                      <button className="p-2 text-gray-300 hover:text-gray-600 transition-colors"><MoreVertical size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredItems.length === 0 && (
            <div className="p-24 text-center flex flex-col items-center justify-center opacity-30">
              <ShieldCheck size={80} className="text-gray-300 mb-4" />
              <h3 className="text-xl font-black text-gray-500 uppercase tracking-widest">No Anomalies Detected</h3>
              <p className="text-sm font-medium mt-2">All attendance records are compliant with global policies.</p>
            </div>
          )}
        </div>
      </div>

      {/* INVESTIGATION MODAL */}
      {selectedAnomaly && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedAnomaly(null)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-4">
                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 ${CATEGORY_UI[selectedAnomaly.category].color}`}>
                    {CATEGORY_UI[selectedAnomaly.category].icon}
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-gray-800 tabular-nums">Anomaly Investigation: {selectedAnomaly.id}</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{selectedAnomaly.type} • {selectedAnomaly.date}</p>
                 </div>
              </div>
              <button onClick={() => setSelectedAnomaly(null)} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400"><XCircle size={24}/></button>
            </div>

            <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
              {/* ANALYSIS STEPS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Evidence Trace</h5>
                    <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5 space-y-4">
                       <div className="flex gap-4">
                          <div className="w-1 bg-[#3E3B6F] rounded-full h-10"></div>
                          <div>
                             <p className="text-[11px] font-bold text-gray-800">Punch Record Detected</p>
                             <p className="text-[10px] text-gray-500">Device ID: #F4A2-998 (Matched)</p>
                          </div>
                       </div>
                       <div className="flex gap-4">
                          <div className="w-1 bg-red-500 rounded-full h-10 shadow-[0_0_8px_rgba(239,68,68,0.4)]"></div>
                          <div>
                             <p className="text-[11px] font-bold text-red-600">Geolocation Anomaly</p>
                             <p className="text-[10px] text-gray-500">Lat-Long indicates distance of 1.2km from Site Boundary.</p>
                          </div>
                       </div>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">System Suggestion</h5>
                    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 flex flex-col justify-between">
                       <p className="text-[11px] text-indigo-700 leading-relaxed font-medium">
                         The pattern suggests <span className="font-bold underline">"Proxy Punching"</span> risk is Medium. High probability of employee working from a nearby shared workspace instead of site.
                       </p>
                       <button className="mt-4 w-full py-2 bg-white text-indigo-600 rounded-lg text-[10px] font-black uppercase border border-indigo-100 hover:bg-indigo-100 transition-all">View Pattern History</button>
                    </div>
                 </div>
              </div>

              {/* ACTION LOG */}
              <div className="space-y-4">
                <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <MessageSquare size={14} /> Investigation Notes
                </h5>
                <div className="space-y-2">
                   <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                      <p className="text-[11px] text-gray-600 italic">"Checking if employee was authorized for an off-site deployment on this date."</p>
                      <span className="text-[8px] font-bold text-gray-400 uppercase mt-2 block">— Jane Doe (HR Admin)</span>
                   </div>
                   <input 
                    type="text" 
                    placeholder="Type to add observation..." 
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-medium focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none" 
                   />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3 shrink-0">
               <button className="flex-1 py-4 bg-white border border-gray-200 text-gray-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all">
                 Mark Investigating
               </button>
               <button className="flex-1 py-4 bg-white border border-red-100 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all">
                 Dismiss Anomaly
               </button>
               <button className="flex-[2] py-4 bg-[#3E3B6F] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                 <CheckCircle2 size={16} /> Resolve & Log
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
