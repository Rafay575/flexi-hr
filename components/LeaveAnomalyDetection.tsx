import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, AlertTriangle, Fingerprint, Search, Filter, 
  ChevronRight, MoreHorizontal, Eye, CheckCircle2, XCircle, 
  Clock, Info, ArrowUpRight, Zap, Database, User, X,
  Terminal, ShieldCheck, Activity, BarChart3
} from 'lucide-react';

interface Anomaly {
  id: string;
  date: string;
  employee: string;
  avatar: string;
  dept: string;
  type: 'Conflict' | 'Pattern' | 'Policy' | 'Duplicate' | 'Sandwich';
  severity: 'High' | 'Medium' | 'Low';
  evidence: string;
  status: 'New' | 'Investigating' | 'Confirmed' | 'False Positive';
}

const MOCK_ANOMALIES: Anomaly[] = [
  { id: 'AN-901', date: 'Feb 12, 2025', employee: 'Usman Ali', avatar: 'UA', dept: 'Sales', type: 'Conflict', severity: 'High', evidence: 'Punched in while on Annual Leave', status: 'New' },
  { id: 'AN-902', date: 'Feb 11, 2025', employee: 'Sara Miller', avatar: 'SM', dept: 'Product', type: 'Pattern', severity: 'Medium', evidence: '4th consecutive Friday absence', status: 'New' },
  { id: 'AN-903', date: 'Feb 10, 2025', employee: 'Ahmed Khan', avatar: 'AK', dept: 'Engineering', type: 'Policy', severity: 'High', evidence: 'Balance: 2d, Approved: 5d', status: 'Confirmed' },
  { id: 'AN-904', date: 'Feb 09, 2025', employee: 'Zoya Malik', avatar: 'ZM', dept: 'Design', type: 'Duplicate', severity: 'Low', evidence: 'Double entry for Jan 24 (LV-88 & LV-91)', status: 'False Positive' },
  { id: 'AN-905', date: 'Feb 08, 2025', employee: 'Tom Chen', avatar: 'TC', dept: 'Engineering', type: 'Sandwich', severity: 'Medium', evidence: 'Friday/Monday off, weekend not counted', status: 'Investigating' },
  { id: 'AN-906', date: 'Feb 07, 2025', employee: 'Ali Raza', avatar: 'AR', dept: 'Engineering', type: 'Conflict', severity: 'High', evidence: 'Remote punch from overseas IP during sick leave', status: 'New' },
  { id: 'AN-907', date: 'Feb 06, 2025', employee: 'Mona Shah', avatar: 'MS', dept: 'Engineering', type: 'Pattern', severity: 'Low', evidence: 'Always sick after project milestones', status: 'New' },
  { id: 'AN-908', date: 'Feb 05, 2025', employee: 'Hamza Aziz', avatar: 'HA', dept: 'Design', type: 'Policy', severity: 'Medium', evidence: 'Medical leave without attachment', status: 'New' },
  { id: 'AN-909', date: 'Feb 04, 2025', employee: 'Bina Iftikhar', avatar: 'BI', dept: 'Product', type: 'Sandwich', severity: 'Low', evidence: 'Holiday bypass attempt detected', status: 'New' },
  { id: 'AN-910', date: 'Feb 03, 2025', employee: 'Fatima Noor', avatar: 'FN', dept: 'HR', type: 'Conflict', severity: 'High', evidence: 'Active system session during bereavement', status: 'New' },
  { id: 'AN-911', date: 'Feb 02, 2025', employee: 'Raza Javeed', avatar: 'RJ', dept: 'Marketing', type: 'Pattern', severity: 'Medium', evidence: 'High Casual Leave utilization (>80% YTD)', status: 'Confirmed' },
  { id: 'AN-912', date: 'Feb 01, 2025', employee: 'Sana Khan', avatar: 'SK', dept: 'Engineering', type: 'Duplicate', severity: 'Low', evidence: 'Same dates as Travel Request ODT-442', status: 'Confirmed' },
  { id: 'AN-913', date: 'Jan 31, 2025', employee: 'Kamran Akmal', avatar: 'KA', dept: 'Sales', type: 'Policy', severity: 'High', evidence: 'Lapse override applied by unauthorized user', status: 'Investigating' },
  { id: 'AN-914', date: 'Jan 30, 2025', employee: 'Usman Ali', avatar: 'UA', dept: 'Sales', type: 'Conflict', severity: 'Medium', evidence: 'VPN activity during medical leave', status: 'False Positive' },
  { id: 'AN-915', date: 'Jan 29, 2025', employee: 'Ahmed Khan', avatar: 'AK', dept: 'Engineering', type: 'Pattern', severity: 'Low', evidence: 'Frequent Monday morning sick leaves', status: 'False Positive' },
];

export const LeaveAnomalyDetection = () => {
  const [search, setSearch] = useState('');
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null);
  const [activeTab, setActiveTab] = useState('All');

  const stats = useMemo(() => ({
    total: MOCK_ANOMALIES.length,
    new: MOCK_ANOMALIES.filter(a => a.status === 'New').length,
    confirmed: MOCK_ANOMALIES.filter(a => a.status === 'Confirmed').length,
    falsePos: MOCK_ANOMALIES.filter(a => a.status === 'False Positive').length,
  }), []);

  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case 'High': return 'bg-red-50 text-red-700 border-red-100';
      case 'Medium': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Low': return 'bg-blue-50 text-blue-700 border-blue-100';
      default: return 'bg-gray-50';
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'New': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'Confirmed': return 'bg-red-50 text-red-700 border-red-100';
      case 'False Positive': return 'bg-gray-100 text-gray-400 border-gray-200';
      case 'Investigating': return 'bg-amber-50 text-amber-700 border-amber-100';
      default: return 'bg-gray-50';
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500 font-['League_Spartan']">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-2xl shadow-sm ring-4 ring-white">
            <ShieldAlert size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#3E3B6F]">Anomaly Detection</h2>
            <p className="text-gray-500 font-medium italic">AI Integrity Engine monitoring leave compliance and patterns.</p>
          </div>
        </div>
        <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
           <button className="px-4 py-2 rounded-lg text-xs font-bold bg-[#3E3B6F] text-white">Live Monitor</button>
           <button className="px-4 py-2 rounded-lg text-xs font-bold text-gray-400 hover:bg-gray-50">Historical</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Anomalies', val: stats.total, icon: Activity, color: 'text-indigo-600 bg-indigo-50' },
          { label: 'New (Unreviewed)', val: stats.new, icon: Zap, color: 'text-amber-600 bg-amber-50', pro: true },
          { label: 'Confirmed Issues', val: stats.confirmed, icon: ShieldAlert, color: 'text-red-600 bg-red-50' },
          { label: 'False Positives', val: stats.falsePos, icon: ShieldCheck, color: 'text-gray-400 bg-gray-50' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-5">
            <div className={`p-4 rounded-2xl ${s.color}`}>
              <s.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-2">{s.label}</p>
              <h4 className="text-3xl font-bold text-gray-900 leading-none">{s.val}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts Table Container */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        <div className="p-8 border-b border-gray-100 bg-gray-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="flex gap-1 overflow-x-auto scrollbar-hide">
              {['All', 'Conflict', 'Pattern', 'Policy', 'Duplicate', 'Sandwich'].map(t => (
                <button 
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all relative ${activeTab === t ? 'text-[#3E3B6F]' : 'text-gray-400'}`}
                >
                  {t}
                  {activeTab === t && <div className="absolute bottom-0 left-2 right-2 h-1 bg-[#3E3B6F] rounded-full" />}
                </button>
              ))}
           </div>
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text" 
                placeholder="Search anomalies..." 
                className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#3E3B6F]/10 w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date / ID</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Employee</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Severity</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Evidence Summary</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_ANOMALIES.filter(a => activeTab === 'All' || a.type === activeTab).map((a) => (
                <tr key={a.id} className="hover:bg-gray-50/30 transition-colors group cursor-pointer" onClick={() => setSelectedAnomaly(a)}>
                  <td className="px-8 py-5">
                    <p className="text-xs font-bold text-[#3E3B6F] font-mono">{a.id}</p>
                    <p className="text-[10px] text-gray-400 uppercase mt-0.5">{a.date}</p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent-peach flex items-center justify-center font-bold text-[#3E3B6F] text-[10px]">
                        {a.avatar}
                      </div>
                      <div>
                         <p className="text-sm font-bold text-gray-900 leading-none">{a.employee}</p>
                         <p className="text-[10px] text-gray-400 mt-1 uppercase">{a.dept}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-gray-700">
                       <Fingerprint size={14} className="text-indigo-400" />
                       <span className="text-xs font-bold">{a.type}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase border ${getSeverityStyle(a.severity)}`}>
                      {a.severity}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs text-gray-600 font-medium leading-relaxed italic truncate max-w-[200px]" title={a.evidence}>"{a.evidence}"</p>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase border ${getStatusStyle(a.status)}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2  transition-all">
                       <button className="p-2 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-[#3E3B6F] shadow-sm"><Eye size={16}/></button>
                       <button className="p-2 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-indigo-600 shadow-sm"><CheckCircle2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Investigation Drawer */}
      {selectedAnomaly && (
        <div className="fixed inset-0 z-[200] overflow-hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedAnomaly(null)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-[550px] bg-[#F5F5F5] shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
             {/* Header */}
             <div className="p-8 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${getSeverityStyle(selectedAnomaly.severity)}`}>
                    <ShieldAlert size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Integrity Audit: {selectedAnomaly.id}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{selectedAnomaly.type} Detection • {selectedAnomaly.date}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedAnomaly(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                  <X size={24} />
                </button>
             </div>

             <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-modal-scroll">
                {/* Employee Context */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-6 shadow-sm">
                   <div className="w-16 h-16 rounded-2xl bg-accent-peach flex items-center justify-center font-bold text-[#3E3B6F] text-xl shadow-inner">
                      {selectedAnomaly.avatar}
                   </div>
                   <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900">{selectedAnomaly.employee}</h4>
                      <p className="text-xs text-gray-500 font-medium">{selectedAnomaly.dept} • Full-time Staff</p>
                      <div className="flex gap-4 mt-3 pt-3 border-t border-gray-50">
                        <div className="text-center">
                          <p className="text-[9px] font-bold text-gray-400 uppercase">YTD Utilization</p>
                          <p className="text-xs font-bold text-gray-800">72%</p>
                        </div>
                        <div className="text-center border-l pl-4">
                          <p className="text-[9px] font-bold text-gray-400 uppercase">Trust Score</p>
                          <p className="text-xs font-bold text-red-500">Low (4.2/10)</p>
                        </div>
                      </div>
                   </div>
                </div>

                {/* Evidence Section */}
                <section className="space-y-4">
                   <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 px-2">
                     <Terminal size={14} className="text-[#3E3B6F]" /> Forensic Evidence
                   </h4>
                   <div className="bg-[#3E3B6F] rounded-[32px] p-6 text-white space-y-4 shadow-xl relative overflow-hidden">
                      <p className="text-sm font-medium leading-relaxed opacity-90 italic">
                        "{selectedAnomaly.evidence}"
                      </p>
                      <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-2">
                         <div className="flex justify-between text-[10px] font-bold uppercase text-white/50">
                            <span>System Logs</span>
                            <span>Time: 09:42:01 AM</span>
                         </div>
                         <code className="text-[10px] block font-mono text-[#E8D5A3]">
                           [PUNCH_EVENT] UID: 4421 AUTH: SUCCESS IP: 202.163.x.x<br/>
                           [POLICY_CHECK] LEAVE_STATUS: ACTIVE<br/>
                           [ALERT] CONFLICT_DETECTED: LEAVE_VS_ATTENDANCE
                         </code>
                      </div>
                      <AlertTriangle className="absolute -bottom-6 -right-6 text-white/5" size={120} />
                   </div>
                </section>

                {/* Timeline */}
                <section className="space-y-4">
                   <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Integrity Timeline</h4>
                   <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                      <div className="relative">
                        <div className="absolute left-[-25px] top-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                        <p className="text-xs font-bold text-gray-800">Leave Applied (LV-992)</p>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">Jan 10, 2025</p>
                      </div>
                      <div className="relative">
                        <div className="absolute left-[-25px] top-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                        <p className="text-xs font-bold text-gray-800">Request Approved</p>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">By Sarah Admin • Jan 12</p>
                      </div>
                      <div className="relative">
                        <div className="absolute left-[-25px] top-1.5 w-3 h-3 rounded-full bg-red-500 border-2 border-white animate-pulse" />
                        <p className="text-xs font-bold text-red-600 uppercase">Anomaly Triggered</p>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">Punch-in detected during break</p>
                      </div>
                   </div>
                </section>

                {/* Resolution Form */}
                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
                   <h4 className="text-xs font-bold text-gray-700 uppercase tracking-widest border-b border-gray-50 pb-4">Decision Hub</h4>
                   <div className="space-y-4 pt-2">
                      <label className="block space-y-2">
                         <span className="text-[10px] font-bold text-gray-400 uppercase">Action Category</span>
                         <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-[#3E3B6F]">
                            <option>Revert Leave Entry</option>
                            <option>Mark as Correction Work</option>
                            <option>Official Integrity Issue</option>
                            <option>Manager Oversight</option>
                         </select>
                      </label>
                      <label className="block space-y-2">
                         <span className="text-[10px] font-bold text-gray-400 uppercase">Investigator Notes</span>
                         <textarea className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-medium outline-none h-24 resize-none" placeholder="Provide detailed audit findings..." />
                      </label>
                   </div>
                </div>
             </div>

             {/* Actions */}
             <div className="p-8 bg-white border-t border-gray-100 grid grid-cols-2 gap-4 shrink-0">
                <button className="py-4 bg-gray-50 text-gray-500 font-bold rounded-2xl hover:bg-gray-100 transition-all text-xs uppercase tracking-widest">Mark False Positive</button>
                <button className="py-4 bg-red-600 text-white font-bold rounded-2xl shadow-xl shadow-red-600/20 hover:bg-red-700 transition-all text-xs uppercase tracking-widest active:scale-95">Confirm Integrity Issue</button>
             </div>
          </div>
        </div>
      )}

      <style>
        {`
          .custom-modal-scroll::-webkit-scrollbar { width: 4px; }
          .custom-modal-scroll::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
          .scrollbar-hide::-webkit-scrollbar { display: none; }
        `}
      </style>
    </div>
  );
};