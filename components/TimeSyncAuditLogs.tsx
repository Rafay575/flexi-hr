import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  User, 
  Clock, 
  ArrowRight, 
  Info, 
  History, 
  Eye, 
  Database,
  Smartphone,
  Cpu,
  MoreVertical,
  X,
  FileText,
  AlertCircle
} from 'lucide-react';

type ActionType = 
  | 'PUNCH_ADDED' 
  | 'PUNCH_MODIFIED' 
  | 'PUNCH_DELETED' 
  | 'RECALCULATED' 
  | 'REG_APPROVED' 
  | 'REG_REJECTED' 
  | 'SHIFT_CHANGED' 
  | 'POLICY_UPDATED' 
  | 'MANUAL_OVERRIDE';

interface AuditLog {
  id: string;
  timestamp: string;
  user: { name: string; avatar: string; role: string };
  action: ActionType;
  entity: string;
  employee: { name: string; id: string };
  before: string;
  after: string;
  ip: string;
}

const ACTION_CONFIG: Record<ActionType, { label: string; color: string }> = {
  PUNCH_ADDED: { label: 'Punch Added', color: 'bg-green-50 text-green-700 border-green-100' },
  PUNCH_MODIFIED: { label: 'Punch Modified', color: 'bg-orange-50 text-orange-700 border-orange-100' },
  PUNCH_DELETED: { label: 'Punch Deleted', color: 'bg-red-50 text-red-700 border-red-100' },
  RECALCULATED: { label: 'Recalculated', color: 'bg-blue-50 text-blue-700 border-blue-100' },
  REG_APPROVED: { label: 'Reg. Approved', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
  REG_REJECTED: { label: 'Reg. Rejected', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  SHIFT_CHANGED: { label: 'Shift Changed', color: 'bg-purple-50 text-purple-700 border-purple-100' },
  POLICY_UPDATED: { label: 'Policy Updated', color: 'bg-pink-50 text-pink-700 border-pink-100' },
  MANUAL_OVERRIDE: { label: 'Manual Override', color: 'bg-amber-50 text-amber-700 border-amber-100' },
};

const MOCK_LOGS: AuditLog[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `AUD-${5000 + i}`,
  timestamp: `2025-01-15 ${10 + (i % 12)}:${(i * 3) % 60} AM`,
  user: { name: i % 5 === 0 ? 'System Engine' : 'Jane Doe', avatar: 'JD', role: i % 5 === 0 ? 'AI' : 'HR Admin' },
  action: (['PUNCH_MODIFIED', 'RECALCULATED', 'SHIFT_CHANGED', 'REG_APPROVED', 'MANUAL_OVERRIDE'] as ActionType[])[i % 5],
  entity: ['PunchRecord', 'AttendanceStatus', 'ShiftAssignment', 'Regularization', 'EmployeeProfile'][i % 5],
  employee: { name: 'Sarah Chen', id: 'FLX-101' },
  before: i % 2 === 0 ? '{"time": "09:00 AM", "status": "LATE"}' : 'Shift: Morning',
  after: i % 2 === 0 ? '{"time": "08:55 AM", "status": "PRESENT"}' : 'Shift: General Flexi',
  ip: `192.168.1.${10 + i}`,
}));

export const TimeSyncAuditLogs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const filteredLogs = useMemo(() => {
    return MOCK_LOGS.filter(log => 
      log.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <ShieldCheck className="text-[#3E3B6F]" size={28} /> System Audit Logs
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Immutable record of all modifications and recalculations</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-200 rounded-xl p-1 flex shadow-sm">
            <button className="px-4 py-2 text-xs font-bold text-gray-600 flex items-center gap-2 hover:bg-gray-50 rounded-lg">
              <Calendar size={14} /> Last 7 Days
            </button>
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all">
            <Download size={18} /> Export Audit Pack
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-sm flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search by User, Employee or Action..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-xs font-medium focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none transition-all" 
          />
        </div>
        <div className="h-6 w-px bg-gray-100"></div>
        <select className="bg-gray-50 border-none rounded-xl px-4 py-2 text-xs font-bold text-gray-600 outline-none">
          <option>All Action Types</option>
          <option>Manual Overrides</option>
          <option>Policy Changes</option>
          <option>Punches Only</option>
        </select>
        <button className="p-2.5 text-gray-400 hover:text-[#3E3B6F] hover:bg-gray-50 rounded-xl transition-all">
          <Filter size={18} />
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-8 py-5">Timestamp</th>
                <th className="px-6 py-5">Actor (User)</th>
                <th className="px-6 py-5">Action</th>
                <th className="px-6 py-5">Entity</th>
                <th className="px-6 py-5">Affected Employee</th>
                <th className="px-6 py-5">IP Address</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="group hover:bg-gray-50/80 transition-all cursor-default">
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black text-gray-800 tabular-nums">{log.timestamp}</span>
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">ID: {log.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black border ${log.user.role === 'AI' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                        {log.user.name === 'System Engine' ? <Cpu size={14} /> : log.user.avatar}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800 leading-tight">{log.user.name}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase">{log.user.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${ACTION_CONFIG[log.action].color}`}>
                      {ACTION_CONFIG[log.action].label}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500">
                      <Database size={12} className="text-gray-300" />
                      {log.entity}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <User size={12} className="text-indigo-400" />
                      <span className="text-xs font-bold text-gray-700">{log.employee.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[10px] font-black text-gray-400 tabular-nums">{log.ip}</span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button 
                      onClick={() => setSelectedLog(log)}
                      className="p-2 text-gray-300 hover:text-[#3E3B6F] hover:bg-white rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Compliance Retention: 7 Years</span>
           <div className="flex gap-2">
             <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all">Previous</button>
             <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all">Next</button>
           </div>
        </div>
      </div>

      {/* DETAIL DRAWER */}
      {selectedLog && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedLog(null)}></div>
          <div className="relative w-full max-w-xl bg-white h-full shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center text-white shadow-lg">
                    <History size={20} />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-gray-800">Event Inspector</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{selectedLog.id} • {selectedLog.timestamp}</p>
                 </div>
              </div>
              <button onClick={() => setSelectedLog(null)} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400"><X size={24}/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {/* CONTEXT CARDS */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Initiated By</p>
                    <p className="text-sm font-bold text-gray-800">{selectedLog.user.name}</p>
                    <p className="text-[10px] text-[#3E3B6F] font-black uppercase">{selectedLog.user.role}</p>
                 </div>
                 <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Action Type</p>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${ACTION_CONFIG[selectedLog.action].color}`}>
                       {ACTION_CONFIG[selectedLog.action].label}
                    </span>
                    <p className="text-[10px] text-gray-500 font-medium mt-1 uppercase tracking-tighter">Source IP: {selectedLog.ip}</p>
                 </div>
              </div>

              {/* DIFF VIEWER */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                   <ArrowRight size={14} className="text-[#3E3B6F]" /> State Transition Detail
                </h4>
                
                <div className="space-y-6">
                   <div className="space-y-2">
                      <p className="text-[9px] font-black text-red-500 uppercase tracking-widest ml-1">Previous State (Before)</p>
                      <div className="p-5 bg-red-50/30 border border-red-100 rounded-2xl">
                         <pre className="text-[11px] font-bold text-red-700 font-mono whitespace-pre-wrap leading-relaxed">
                            {selectedLog.before}
                         </pre>
                      </div>
                   </div>

                   <div className="flex justify-center">
                      <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 shadow-sm relative">
                         <ArrowRight size={16} className="rotate-90" />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <p className="text-[9px] font-black text-green-500 uppercase tracking-widest ml-1">Modified State (After)</p>
                      <div className="p-5 bg-green-50/30 border border-green-100 rounded-2xl">
                         <pre className="text-[11px] font-bold text-green-700 font-mono whitespace-pre-wrap leading-relaxed">
                            {selectedLog.after}
                         </pre>
                      </div>
                   </div>
                </div>
              </div>

              {/* COMPLIANCE FOOTNOTE */}
              <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-3xl flex gap-4">
                 <div className="p-2 bg-white rounded-xl shadow-sm h-fit shrink-0">
                    <Info className="text-indigo-600" size={20} />
                 </div>
                 <div className="flex-1">
                    <p className="text-xs font-black text-indigo-900 uppercase tracking-widest mb-1">Log Security</p>
                    <p className="text-[10px] text-indigo-700/80 leading-relaxed font-medium">
                       This entry is <span className="font-bold">Cryptographically Signed</span> and cannot be modified or deleted. Verified by the TimeSync Hash Engine at creation time.
                    </p>
                 </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3 shrink-0">
               <button className="flex-1 py-4 bg-white border border-gray-200 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                 <FileText size={16} /> Raw Metadata
               </button>
               <button onClick={() => setSelectedLog(null)} className="flex-1 py-4 bg-[#3E3B6F] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all">
                 Close View
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
