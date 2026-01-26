import React, { useState } from 'react';
import { 
  Zap, 
  RefreshCcw, 
  Settings2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowRightLeft, 
  ExternalLink, 
  Database, 
  ShieldCheck, 
  Activity, 
  Download,
  AlertCircle,
  Puzzle,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight
} from 'lucide-react';
import { IntegrationConfigDrawer } from '../IntegrationConfigDrawer';

interface Integration {
  id: string;
  name: string;
  provider: string;
  description: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  lastSync: string;
  flow: 'INBOUND' | 'OUTBOUND' | 'BIDIRECTIONAL';
  dataPoints: string[];
  hasToggle?: boolean;
}

interface SyncLog {
  id: string;
  timestamp: string;
  integration: string;
  direction: 'IN' | 'OUT';
  records: number;
  status: 'SUCCESS' | 'FAILED' | 'PARTIAL';
}

const MOCK_INTEGRATIONS: Integration[] = [
  {
    id: 'int-1',
    name: 'PayEdge Payroll',
    provider: 'FinTech Global',
    description: 'Automated payroll reconciliation engine.',
    status: 'CONNECTED',
    lastSync: '15m ago',
    flow: 'OUTBOUND',
    dataPoints: ['OT Hours', 'Unpaid Deductions', 'Absence Penalties']
  },
  {
    id: 'int-2',
    name: 'LeaveEase',
    provider: 'Flexi Suite',
    description: 'Leave management and accrual system.',
    status: 'CONNECTED',
    lastSync: '1h ago',
    flow: 'BIDIRECTIONAL',
    dataPoints: ['Approved Leave Overlays', 'Accrual Adjustments']
  },
  {
    id: 'int-3',
    name: 'PeopleHub Core',
    provider: 'Enterprise HR',
    description: 'Primary employee record master.',
    status: 'ERROR',
    lastSync: '4h ago',
    flow: 'INBOUND',
    dataPoints: ['Employee Profile', 'Device Identifiers', 'Grade Changes']
  },
  {
    id: 'int-4',
    name: 'PerformPro',
    provider: 'Talent Labs',
    description: 'Performance scoring and behavioral analytics.',
    status: 'CONNECTED',
    lastSync: 'Yesterday',
    flow: 'OUTBOUND',
    dataPoints: ['Punctuality Signals', 'Consistency Scores'],
    hasToggle: true
  }
];

const MOCK_LOGS: SyncLog[] = [
  { id: 'L-901', timestamp: '2025-01-15 11:30 AM', integration: 'PayEdge', direction: 'OUT', records: 450, status: 'SUCCESS' },
  { id: 'L-902', timestamp: '2025-01-15 11:00 AM', integration: 'LeaveEase', direction: 'IN', records: 12, status: 'SUCCESS' },
  { id: 'L-903', timestamp: '2025-01-15 10:45 AM', integration: 'PeopleHub', direction: 'IN', records: 0, status: 'FAILED' },
  { id: 'L-904', timestamp: '2025-01-15 09:00 AM', integration: 'PerformPro', direction: 'OUT', records: 1250, status: 'SUCCESS' },
  { id: 'L-905', timestamp: '2025-01-14 11:30 PM', integration: 'PayEdge', direction: 'OUT', records: 2, status: 'PARTIAL' },
];

export const TimeSyncIntegrations: React.FC = () => {
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [selectedConfig, setSelectedConfig] = useState<Integration | null>(null);

  const handleSync = (id: string) => {
    setSyncingId(id);
    setTimeout(() => setSyncingId(null), 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 relative">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <Puzzle className="text-[#3E3B6F]" size={28} /> Ecosystem Integrations
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Synchronize time data with Payroll, HR Core, and Performance systems</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">
            <Download size={18} /> API Documentation
          </button>
        </div>
      </div>

      {/* INTEGRATION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_INTEGRATIONS.map((int) => (
          <div key={int.id} className="bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col group">
            <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex justify-between items-start">
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${
                  int.name.includes('Pay') ? 'bg-green-600' : 
                  int.name.includes('Leave') ? 'bg-indigo-600' : 
                  int.name.includes('People') ? 'bg-blue-600' : 'bg-purple-600'
                } text-white`}>
                  <Database size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg leading-tight">{int.name}</h3>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{int.provider}</p>
                </div>
              </div>
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${
                int.status === 'CONNECTED' ? 'bg-green-50 text-green-600 border-green-100' : 
                int.status === 'ERROR' ? 'bg-red-50 text-red-600 border-red-100' : 
                'bg-gray-50 text-gray-400 border-gray-100'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${int.status === 'CONNECTED' ? 'bg-green-500 animate-pulse' : int.status === 'ERROR' ? 'bg-red-500' : 'bg-gray-300'}`} />
                {int.status}
              </div>
            </div>

            <div className="p-6 flex-1 space-y-6">
              <p className="text-sm text-gray-500 font-medium leading-relaxed italic">"{int.description}"</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                     {int.flow === 'INBOUND' ? <ArrowDownLeft size={12}/> : int.flow === 'OUTBOUND' ? <ArrowUpRight size={12}/> : <ArrowRightLeft size={12}/>}
                     Data Flow Strategy
                   </h4>
                   {int.hasToggle && (
                     <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-gray-400">Anonymize</span>
                        <div className="w-8 h-4 bg-[#3E3B6F] rounded-full relative p-0.5 cursor-pointer">
                           <div className="w-3 h-3 bg-white rounded-full absolute right-0.5"></div>
                        </div>
                     </div>
                   )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {int.dataPoints.map((dp, idx) => (
                    <span key={idx} className="bg-white border border-gray-100 px-3 py-1 rounded-lg text-[10px] font-bold text-gray-600 shadow-sm">
                      {dp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                 <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                    <Clock size={14} />
                    <span>Last Sync: <span className="text-gray-600 tabular-nums">{int.lastSync}</span></span>
                 </div>
                 {int.status === 'ERROR' && (
                   <div className="flex items-center gap-1.5 text-[10px] font-black text-red-500 animate-pulse">
                      <AlertCircle size={12} />
                      Handshake Failed
                   </div>
                 )}
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2">
               <button 
                onClick={() => setSelectedConfig(int)}
                className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
               >
                  <Settings2 size={14} /> Configure
               </button>
               <button 
                onClick={() => handleSync(int.id)}
                disabled={syncingId === int.id}
                className="flex-1 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#3E3B6F]/10 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
               >
                  <RefreshCcw size={14} className={syncingId === int.id ? 'animate-spin' : ''} />
                  {syncingId === int.id ? 'Syncing...' : 'Test Sync'}
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* SYNC LOGS TABLE */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
           <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
             <Activity size={18} className="text-[#3E3B6F]" /> Synchronisation Audit
           </h3>
           <button className="text-[10px] font-black text-[#3E3B6F] uppercase underline underline-offset-4">Clear Logs</button>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/30">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <th className="px-8 py-5">Timestamp</th>
                <th className="px-6 py-5">Service</th>
                <th className="px-6 py-5 text-center">Direction</th>
                <th className="px-6 py-5 text-center">Records</th>
                <th className="px-6 py-5">Result</th>
                <th className="px-6 py-5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_LOGS.map((log) => (
                <tr key={log.id} className="group hover:bg-gray-50/80 transition-all cursor-default">
                  <td className="px-8 py-4">
                    <div className="flex flex-col">
                       <span className="text-[11px] font-black text-gray-800 tabular-nums">{log.timestamp}</span>
                       <span className="text-[9px] text-gray-400 font-bold">ID: {log.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className="text-xs font-bold text-gray-700">{log.integration}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                     <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black ${log.direction === 'IN' ? 'text-blue-600 bg-blue-50' : 'text-purple-600 bg-purple-50'}`}>
                        {log.direction === 'IN' ? <ArrowDownLeft size={10}/> : <ArrowUpRight size={10}/>}
                        {log.direction === 'IN' ? 'INBOUND' : 'OUTBOUND'}
                     </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-xs font-black text-[#3E3B6F] tabular-nums">{log.records}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${
                      log.status === 'SUCCESS' ? 'bg-green-50 text-green-600 border-green-100' : 
                      log.status === 'FAILED' ? 'bg-red-50 text-red-600 border-red-100' : 
                      'bg-orange-50 text-orange-600 border-orange-100'
                    }`}>
                      {log.status === 'SUCCESS' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      {log.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <button className="p-2 text-gray-300 hover:text-[#3E3B6F] transition-all opacity-0 group-hover:opacity-100">
                        <ExternalLink size={16} />
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* COMPLIANCE FOOTNOTE */}
      <div className="bg-[#E8D5A3]/10 border border-[#E8D5A3]/30 rounded-3xl p-6 flex gap-6">
         <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#3E3B6F] shrink-0 border border-[#E8D5A3]/20">
            <ShieldCheck size={24} />
         </div>
         <div>
            <h4 className="text-sm font-black text-[#3E3B6F] uppercase tracking-widest mb-1">Secure Middleware Channel</h4>
            <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
               All integrations utilize <span className="font-bold underline decoration-indigo-200 italic">Mutual TLS (mTLS)</span> with daily rotation of access tokens. Sensitive payroll fields are encrypted using <span className="font-black text-[#3E3B6F]">AES-256</span> before transmission to external providers.
            </p>
         </div>
      </div>

      {/* CONFIG DRAWER overlay */}
      {selectedConfig && (
        <div className="fixed inset-0 z-[290] overflow-hidden">
           <div 
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={() => setSelectedConfig(null)}
           />
           <IntegrationConfigDrawer 
            integrationId={selectedConfig.id}
            name={selectedConfig.name}
            onClose={() => setSelectedConfig(null)}
           />
        </div>
      )}
    </div>
  );
};
