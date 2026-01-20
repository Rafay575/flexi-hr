
import React, { useState } from 'react';
import { 
  ShieldCheck, Search, Filter, Download, Eye, 
  Terminal, User, Globe, AlertCircle, Clock,
  ChevronDown, ChevronRight, HardDrive, Info,
  Unlock, Trash2, TrendingUp, Users, Zap, X,
  /* Fixed: Added missing Calendar and FileText icons */
  Calendar, FileText
} from 'lucide-react';

type AuditSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  entity: string;
  details: string;
  ip: string;
  severity: AuditSeverity;
  beforeValue?: string;
  afterValue?: string;
}

const MOCK_LOGS: AuditLog[] = [
  { id: 'LOG-001', timestamp: '2025-01-15 14:30:12', user: 'Zainab Siddiqui', action: 'Period Unlock', entity: 'JAN-2025-CYCLE', details: 'Unlocked period to adjust late attendance inputs.', ip: '192.168.1.45', severity: 'CRITICAL', beforeValue: 'STATUS: LOCKED', afterValue: 'STATUS: OPEN' },
  { id: 'LOG-002', timestamp: '2025-01-15 12:15:00', user: 'Ahmed Raza', action: 'Salary Change', entity: 'EMP-1001', details: 'Annual performance revision applied.', ip: '192.168.1.12', severity: 'CRITICAL', beforeValue: 'Gross: 180,000', afterValue: 'Gross: 215,000' },
  { id: 'LOG-003', timestamp: '2025-01-15 11:45:22', user: 'System', action: 'Run Generated', entity: 'RUN-2025-01-V12', details: 'Batch processing for Corporate Group completed.', ip: 'Internal', severity: 'INFO' },
  { id: 'LOG-004', timestamp: '2025-01-15 10:20:05', user: 'Admin', action: 'Large Adjustment', entity: 'ADJ-9922', details: 'One-time relocation bonus PK 150K approved.', ip: '10.0.0.5', severity: 'CRITICAL', beforeValue: 'Amt: 0', afterValue: 'Amt: 150,000' },
  { id: 'LOG-005', timestamp: '2025-01-14 16:50:33', user: 'Ahmed Raza', action: 'Tax Slab Update', entity: 'FY-2024-25', details: 'Updated income tax thresholds per FBR gazette.', ip: '192.168.1.12', severity: 'CRITICAL', beforeValue: 'Slab 4: 20%', afterValue: 'Slab 4: 25%' },
  { id: 'LOG-006', timestamp: '2025-01-14 14:10:12', user: 'Zainab Siddiqui', action: 'Run Delete', entity: 'RUN-2025-01-V10', details: 'Deleted draft run due to invalid time-sync data.', ip: '192.168.1.45', severity: 'CRITICAL' },
  { id: 'LOG-007', timestamp: '2025-01-14 09:30:00', user: 'System', action: 'Mass Update', entity: 'EOBI-RECORDS', details: 'Updated minimum wage cap to PKR 32,000.', ip: 'Internal', severity: 'WARNING', beforeValue: 'Cap: 25,000', afterValue: 'Cap: 32,000' },
];

export const PayrollAuditLogs: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | AuditSeverity>('ALL');

  const filteredLogs = MOCK_LOGS.filter(log => {
    const matchesSearch = log.details.toLowerCase().includes(search.toLowerCase()) || 
                          log.user.toLowerCase().includes(search.toLowerCase()) ||
                          log.entity.toLowerCase().includes(search.toLowerCase());
    const matchesSeverity = filterSeverity === 'ALL' || log.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-2xl border border-primary/10">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">System Audit Logs</h2>
            <p className="text-sm text-gray-500 font-medium">Traceable governance for every payroll transaction</p>
          </div>
        </div>
        <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95">
          <Download size={18} /> Export Full Audit Trail
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-2xl border border-gray-200">
          {(['ALL', 'CRITICAL', 'WARNING', 'INFO'] as const).map(sev => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev as any)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filterSeverity === sev ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-4 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by User, Entity, or keywords..." 
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-3 bg-white border border-gray-200 rounded-2xl text-gray-500 hover:text-primary transition-all shadow-sm">
              <Calendar size={18} />
            </button>
            <button className="px-4 py-3 bg-white border border-gray-200 rounded-2xl text-gray-500 hover:text-primary transition-all shadow-sm">
              <Filter size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-8 py-5">Timestamp</th>
                <th className="px-8 py-5">User Account</th>
                <th className="px-8 py-5">Action Type</th>
                <th className="px-8 py-5">Target Entity</th>
                <th className="px-8 py-5">Details Summary</th>
                <th className="px-8 py-5">IP Source</th>
                <th className="px-8 py-5 text-right">Context</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLogs.map((log) => (
                <tr key={log.id} className={`hover:bg-gray-50 transition-colors group ${log.severity === 'CRITICAL' ? 'bg-red-50/10' : ''}`}>
                  <td className="px-8 py-4 font-mono text-[11px] font-bold text-gray-400">{log.timestamp}</td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-gray-100 rounded-lg text-gray-400"><User size={14} /></div>
                      <span className="font-bold text-gray-700">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className={`text-[9px] font-black px-2 py-1 rounded-lg border uppercase tracking-tighter shadow-sm ${
                      log.severity === 'CRITICAL' ? 'bg-red-600 text-white border-red-700' :
                      log.severity === 'WARNING' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                      'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <span className="text-[10px] font-black bg-gray-100 text-gray-500 px-2 py-0.5 rounded border uppercase tracking-tighter">
                      {log.entity}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <p className="text-xs text-gray-600 font-medium line-clamp-1 max-w-xs">{log.details}</p>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-400">
                      <Globe size={10} /> {log.ip}
                    </div>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button 
                      onClick={() => setSelectedLog(log)}
                      className="p-2 text-gray-300 hover:text-primary transition-all hover:bg-white rounded-lg border border-transparent hover:border-gray-100"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compliance / Retention Notice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-indigo-900 p-8 rounded-3xl text-white shadow-xl shadow-indigo-900/20 relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <HardDrive size={24} className="text-accent" />
              </div>
              <div>
                <h4 className="text-lg font-black uppercase tracking-tight">Audit Data Retention</h4>
                <p className="text-xs text-white/60 font-bold uppercase tracking-widest">Compliance Status: ENFORCED</p>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed font-medium">
              System audit logs are retained for <span className="text-accent font-black">7 years</span> as per Pakistani labour law compliance and industrial governance standards. Logs are immutable and hashed against the master ledger.
            </p>
          </div>
          <button className="relative z-10 mt-8 py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[3px] transition-all flex items-center justify-center gap-2">
            Verifiable Log Certificates <ChevronRight size={14} />
          </button>
          <Terminal className="absolute right-[-20px] bottom-[-20px] text-white/5 w-48 h-48 rotate-12" />
        </div>

        <div className="p-8 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
             <AlertCircle size={40} strokeWidth={1.5} />
          </div>
          <div>
            <h4 className="font-black text-gray-800 uppercase tracking-tight">Anomalous Activity Monitor</h4>
            <p className="text-sm text-gray-500 max-w-xs mx-auto mt-2 leading-relaxed font-medium">
              Our security engine detected 0 anomalies in the last 24 hours. All high-severity actions were performed by authorized credentials.
            </p>
          </div>
          <div className="pt-4 flex gap-4">
             <div className="text-center px-6">
                <p className="text-[10px] font-black text-gray-400 uppercase">Critical (24h)</p>
                <p className="text-lg font-black text-red-500">03</p>
             </div>
             <div className="w-[1px] bg-gray-100 h-10" />
             <div className="text-center px-6">
                <p className="text-[10px] font-black text-gray-400 uppercase">Suspicious IP</p>
                <p className="text-lg font-black text-green-600">0</p>
             </div>
          </div>
        </div>
      </div>

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm animate-in fade-in" onClick={() => setSelectedLog(null)} />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
             <div className={`px-8 py-5 border-b flex items-center justify-between ${selectedLog.severity === 'CRITICAL' ? 'bg-red-50' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-4">
                   <div className={`p-2.5 rounded-xl ${
                     selectedLog.severity === 'CRITICAL' ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'bg-primary text-white shadow-lg shadow-primary/20'
                   }`}>
                      <ShieldCheck size={24} />
                   </div>
                   <div>
                      <h3 className="text-lg font-black text-gray-800">Audit Deep-Dive</h3>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">LOG ID: {selectedLog.id}</p>
                   </div>
                </div>
                <button onClick={() => setSelectedLog(null)} className="p-2 hover:bg-black/5 rounded-full text-gray-400 transition-colors"><X size={24}/></button>
             </div>

             <div className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <div className="space-y-1">
                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Performed By</p>
                         <p className="text-sm font-black text-gray-800">{selectedLog.user}</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Network Access</p>
                         <p className="text-sm font-mono font-bold text-primary">{selectedLog.ip}</p>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div className="space-y-1">
                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Action Category</p>
                         <p className="text-sm font-black text-gray-800">{selectedLog.action}</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Impacted Entity</p>
                         <p className="text-sm font-black text-primary underline">{selectedLog.entity}</p>
                      </div>
                   </div>
                </div>

                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Info size={12} className="text-primary" /> Event Description
                   </p>
                   <p className="text-sm font-medium text-gray-700 leading-relaxed italic">
                      "{selectedLog.details}"
                   </p>
                </div>

                {selectedLog.beforeValue && (
                  <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-500">
                     <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Data State Comparison (Diff)</h4>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                           <p className="text-[8px] font-black text-red-400 uppercase mb-2">Original State</p>
                           <p className="text-xs font-mono font-bold text-red-600 line-through decoration-red-300 decoration-2">{selectedLog.beforeValue}</p>
                        </div>
                        <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
                           <p className="text-[8px] font-black text-green-400 uppercase mb-2">Modified State</p>
                           <p className="text-xs font-mono font-bold text-green-600 underline underline-offset-4 decoration-green-300 decoration-2">{selectedLog.afterValue}</p>
                        </div>
                     </div>
                  </div>
                )}
             </div>

             <div className="p-6 bg-gray-50 border-t flex justify-end gap-3">
                <button className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center gap-2">
                   <FileText size={16} /> Print Event
                </button>
                <button onClick={() => setSelectedLog(null)} className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                   Close Inspector
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
