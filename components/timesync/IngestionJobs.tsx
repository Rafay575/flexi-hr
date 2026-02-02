
import React, { useState, useMemo } from 'react';
import { 
  Database, 
  RefreshCcw, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  ChevronRight, 
  MoreVertical, 
  Cpu, 
  ArrowRight, 
  Download, 
  Play, 
  FileText, 
  ShieldCheck, 
  History,
  X,
  Smartphone,
  /* Removed non-existent CloudZap import */
  Terminal,
  Activity
} from 'lucide-react';

type JobStatus = 'COMPLETED' | 'PROCESSING' | 'FAILED' | 'PARTIAL';
type JobType = 'PULL' | 'PUSH' | 'IMPORT';

interface IngestionBatch {
  id: string;
  device: string;
  type: JobType;
  started: string;
  duration: string;
  records: {
    received: number;
    processed: number;
    errors: number;
    duplicates: number;
    unknown: number;
  };
  status: JobStatus;
}

const STATUS_CONFIG: Record<JobStatus, { label: string; color: string; dot: string }> = {
  COMPLETED: { label: 'Completed', color: 'text-green-600 bg-green-50 border-green-100', dot: 'bg-green-500' },
  PROCESSING: { label: 'Processing', color: 'text-blue-600 bg-blue-50 border-blue-100', dot: 'bg-blue-500' },
  FAILED: { label: 'Failed', color: 'text-red-600 bg-red-50 border-red-100', dot: 'bg-red-500' },
  PARTIAL: { label: 'Partial', color: 'text-orange-600 bg-orange-50 border-orange-100', dot: 'bg-orange-500' },
};

const MOCK_BATCHES: IngestionBatch[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `BATCH-${5000 + i}`,
  device: i % 3 === 0 ? 'Main Lobby Terminal' : i % 3 === 1 ? 'Production Gate A' : 'Mobile Gateway',
  type: (['PULL', 'PUSH', 'IMPORT'] as JobType[])[i % 3],
  started: `Today, ${10 - i}:15 AM`,
  duration: `${12 + i}s`,
  records: {
    received: 450,
    processed: 445 - (i % 5),
    errors: i % 7 === 0 ? 5 : 0,
    duplicates: i % 4 === 0 ? 3 : 0,
    unknown: i % 9 === 0 ? 2 : 0,
  },
  status: i === 0 ? 'PROCESSING' : i % 7 === 0 ? 'PARTIAL' : i % 15 === 0 ? 'FAILED' : 'COMPLETED',
}));

export const IngestionJobs: React.FC = () => {
  const [selectedBatch, setSelectedBatch] = useState<IngestionBatch | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <Database className="text-[#3E3B6F]" size={28} /> Data Ingestion
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Monitor high-frequency data pipelines and batch processing health</p>
        </div>
        <button 
          onClick={handleManualSync}
          disabled={isSyncing}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
        >
          <RefreshCcw size={18} className={isSyncing ? 'animate-spin' : ''} /> 
          {isSyncing ? 'Running Sync...' : 'Run Manual Sync'}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          {/* RECENT BATCHES */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                <History size={16} className="text-[#3E3B6F]" /> Recent Ingestion Batches
              </h3>
              <div className="flex gap-2">
                <button className="p-2 text-gray-400 hover:text-[#3E3B6F] bg-white border border-gray-100 rounded-lg shadow-sm transition-all"><Filter size={14} /></button>
                <button className="p-2 text-gray-400 hover:text-[#3E3B6F] bg-white border border-gray-100 rounded-lg shadow-sm transition-all"><Search size={14} /></button>
              </div>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/30">
                  <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                    <th className="px-6 py-4">Batch ID & Device</th>
                    <th className="px-6 py-4">Protocol</th>
                    <th className="px-6 py-4">Started</th>
                    <th className="px-6 py-4">Records</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {MOCK_BATCHES.map((batch) => (
                    <tr 
                      key={batch.id} 
                      onClick={() => setSelectedBatch(batch)}
                      className={`group hover:bg-gray-50/80 transition-all cursor-pointer ${selectedBatch?.id === batch.id ? 'bg-indigo-50/50' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[#3E3B6F] border border-gray-100 bg-white shadow-sm`}>
                            <Terminal size={14} />
                          </div>
                          <div>
                            <p className="text-[11px] font-black text-indigo-600 tabular-nums">#{batch.id}</p>
                            <p className="text-xs font-bold text-gray-800 truncate max-w-[140px]">{batch.device}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter border border-gray-200 px-2 py-0.5 rounded">
                          {batch.type} API
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-gray-600">{batch.started}</span>
                          <span className="text-[9px] text-gray-400 uppercase font-black">{batch.duration} exec</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                             <span className="text-[11px] font-black text-gray-700">{batch.records.received} Total</span>
                             <div className="flex items-center gap-1.5 text-[9px] font-bold">
                               <span className="text-green-600">{batch.records.processed} OK</span>
                               {batch.records.errors > 0 && <span className="text-red-500">{batch.records.errors} ERR</span>}
                             </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-2 px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${STATUS_CONFIG[batch.status].color}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[batch.status].dot} ${batch.status === 'PROCESSING' ? 'animate-pulse' : ''}`} />
                          {STATUS_CONFIG[batch.status].label}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1  transition-all">
                          <button className="p-2 text-gray-400 hover:text-blue-600"><RefreshCcw size={14}/></button>
                          <button className="p-2 text-gray-400 hover:text-red-500"><Download size={14}/></button>
                          <button className="p-2 text-gray-300"><MoreVertical size={14}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SCHEDULE */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
               <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                 <Clock size={16} className="text-[#3E3B6F]" /> Active Pull Schedules
               </h3>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                    <tr className="text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                      <th className="px-8 py-4">Target Device</th>
                      <th className="px-6 py-4">Cron Schedule</th>
                      <th className="px-6 py-4">Last Runtime</th>
                      <th className="px-6 py-4">Next Expected</th>
                      <th className="px-6 py-4">Worker Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[
                      { name: 'Main Lobby Terminal', cron: '*/5 * * * *', last: '2 min ago', next: 'In 3 min', status: 'ACTIVE' },
                      { name: 'Production Gate A', cron: '0 * * * *', last: '45 min ago', next: 'In 15 min', status: 'IDLE' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-4 text-xs font-bold text-gray-800">{row.name}</td>
                        <td className="px-6 py-4"><code className="text-[10px] font-black text-[#3E3B6F] bg-gray-100 px-2 py-1 rounded">{row.cron}</code></td>
                        <td className="px-6 py-4 text-[10px] font-bold text-gray-500">{row.last}</td>
                        <td className="px-6 py-4 text-[10px] font-black text-indigo-600">{row.next}</td>
                        <td className="px-6 py-4">
                           <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${row.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                              {row.status}
                           </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </div>
        </div>

        {/* DETAILS SIDEBAR */}
        <div className="space-y-6">
          {selectedBatch ? (
            <div className="bg-white rounded-3xl border border-gray-200 shadow-md overflow-hidden flex flex-col animate-in slide-in-from-right-4 duration-500">
              <div className="p-6 border-b border-gray-100 bg-[#3E3B6F] text-white flex justify-between items-center">
                 <div>
                    <h3 className="text-sm font-black uppercase tracking-widest tabular-nums">Batch Detail: {selectedBatch.id}</h3>
                    <p className="text-[10px] text-white/60 font-medium">Device: {selectedBatch.device}</p>
                 </div>
                 <button onClick={() => setSelectedBatch(null)} className="p-1 hover:bg-white/10 rounded-full transition-all"><X size={18}/></button>
              </div>

              <div className="p-8 space-y-8 flex-1">
                 {/* COUNTERS */}
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                       <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Total Received</p>
                       <p className="text-xl font-black text-gray-800 tabular-nums">{selectedBatch.records.received}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                       <p className="text-[9px] font-black text-green-400 uppercase mb-1">Successfully Parsed</p>
                       <p className="text-xl font-black text-green-700 tabular-nums">{selectedBatch.records.processed}</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                       <p className="text-[9px] font-black text-orange-400 uppercase mb-1">Duplicates Skipped</p>
                       <p className="text-xl font-black text-orange-700 tabular-nums">{selectedBatch.records.duplicates}</p>
                    </div>
                    <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                       <p className="text-[9px] font-black text-red-400 uppercase mb-1">System Errors</p>
                       <p className="text-xl font-black text-red-700 tabular-nums">{selectedBatch.records.errors}</p>
                    </div>
                 </div>

                 {/* ERROR LIST */}
                 {selectedBatch.records.errors > 0 && (
                   <div className="space-y-4">
                      <div className="flex items-center justify-between">
                         <h4 className="text-[10px] font-black text-red-600 uppercase tracking-widest flex items-center gap-2">
                            <AlertCircle size={14} /> Critical Error Detail
                         </h4>
                         <button className="text-[10px] font-black text-[#3E3B6F] uppercase underline underline-offset-4">Export CSV</button>
                      </div>
                      <div className="space-y-2 border border-red-100 rounded-2xl overflow-hidden max-h-[240px] overflow-y-auto custom-scrollbar">
                         {[1, 2, 3, 4, 5].map(i => (
                           <div key={i} className="p-3 bg-red-50/30 flex gap-4 text-[10px] border-b border-red-50 last:border-0 group">
                              <span className="font-black text-red-400 shrink-0">Row {12 + i}</span>
                              <div className="flex-1">
                                 <p className="font-bold text-red-800">UNMAPPED_EMP_ID</p>
                                 <p className="text-red-600/60 truncate mt-0.5">{"{ \"id\": \"ZK-001\", \"timestamp\": \"2025-01-15T10:05...\" }"}</p>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                 )}

                 <div className="pt-4 space-y-4 border-t border-gray-100">
                    <button className="w-full py-4 bg-[#3E3B6F] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                       <RefreshCcw size={16} /> Reprocess Failed Records
                    </button>
                    <button className="w-full py-3 bg-white border border-gray-200 text-gray-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all">
                       View Full System Logs
                    </button>
                 </div>
              </div>
            </div>
          ) : (
            <div className="h-full bg-white rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-12 text-center opacity-30 grayscale min-h-[500px]">
               <Activity size={80} className="text-gray-300 mb-6" />
               <h3 className="text-lg font-black text-gray-500 uppercase tracking-widest">Pipeline Observer</h3>
               <p className="text-sm font-medium mt-2 max-w-[240px]">Select a specific ingestion batch to view telemetry and error reports.</p>
            </div>
          )}

          <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-3xl">
             <div className="flex gap-4">
                <ShieldCheck size={24} className="text-indigo-600 shrink-0" />
                <div>
                   <h4 className="text-xs font-black text-indigo-900 uppercase tracking-widest mb-1">Queue Health: 100%</h4>
                   <p className="text-[10px] text-indigo-700/80 leading-relaxed font-medium">
                     The <span className="font-bold underline">Timesync Engine</span> is currently idle. All incoming payloads have been mapped and committed to the main attendance ledger.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
