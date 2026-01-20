import React, { useState } from 'react';
import { 
  Database, RefreshCw, CheckCircle2, AlertTriangle, 
  ArrowRight, Download, Bot, Landmark, Clock, 
  Calendar, Zap, FileSearch, ShieldCheck, Info,
  Search, Filter, ExternalLink, MoreVertical,
  // Fix: Added missing ChevronRight icon import
  ChevronRight
} from 'lucide-react';

interface Source {
  name: string;
  period: string;
  records: number;
  lastSync: string;
  status: 'Synced' | 'Pending' | 'Error';
}

const MOCK_SOURCES: Source[] = [
  { name: 'PayEdge (Core)', period: 'Jan 2025', records: 485, lastSync: '10 mins ago', status: 'Synced' },
  { name: 'TimeSync (Attendance)', period: 'Jan 2025', records: 485, lastSync: '1 hour ago', status: 'Synced' },
  { name: 'LeaveEase (Leave)', period: 'Jan 2025', records: 42, lastSync: '2 hours ago', status: 'Synced' },
  { name: 'Bank Statement (HBL)', period: 'Jan 2025', records: 325, lastSync: 'Just now', status: 'Synced' },
];

export const ReconciliationAssistant: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleRunRecon = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setShowResults(true);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200">
            <RefreshCw size={28} className={isRunning ? 'animate-spin' : ''} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
              Reconciliation Assistant
              <span className="bg-indigo-100 text-indigo-600 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest border border-indigo-200">AI PRO</span>
            </h2>
            <p className="text-sm text-gray-500 font-medium">Auto-matching sub-systems and bank statements for ledger integrity</p>
          </div>
        </div>
        <button 
          onClick={handleRunRecon}
          disabled={isRunning}
          className="bg-primary text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
        >
          {isRunning ? 'Processing...' : 'Run Reconciliation'}
        </button>
      </div>

      {/* Data Sources Table */}
      <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6 border-b bg-gray-50/50 flex items-center justify-between">
           <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400">Integrated Data Feeds</h3>
           <span className="text-[10px] font-bold text-gray-400">4 of 4 Sources Ready</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-8 py-5">Source Connector</th>
                <th className="px-8 py-5">Reporting Period</th>
                <th className="px-8 py-5 text-center">Records Found</th>
                <th className="px-8 py-5">Last Sync</th>
                <th className="px-8 py-5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium">
              {MOCK_SOURCES.map((s, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-4 flex items-center gap-3">
                    <Database size={16} className="text-primary/40" />
                    <span className="font-bold text-gray-700">{s.name}</span>
                  </td>
                  <td className="px-8 py-4 text-gray-500 uppercase text-xs">{s.period}</td>
                  <td className="px-8 py-4 text-center font-mono font-bold text-gray-600">{s.records}</td>
                  <td className="px-8 py-4 text-gray-400 text-xs">{s.lastSync}</td>
                  <td className="px-8 py-4">
                    <div className="flex justify-center">
                       <span className="bg-green-50 text-green-600 text-[10px] font-black px-2 py-0.5 rounded border border-green-100 uppercase">{s.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showResults && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
           {/* Section 1: TimeSync vs PayEdge */}
           <div className="space-y-4">
              <div className="flex items-center justify-between">
                 <h3 className="text-sm font-black uppercase tracking-[2px] text-gray-800 flex items-center gap-2">
                    <Clock size={18} className="text-primary" /> TimeSync vs PayEdge Discrepancies
                 </h3>
                 <button className="px-4 py-1.5 bg-primary text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 shadow-md">
                    <Zap size={12} /> Auto-fix All (03)
                 </button>
              </div>
              <div className="bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden">
                 <table className="w-full text-left text-sm border-collapse">
                    <thead>
                       <tr className="bg-orange-50/50 border-b border-orange-100 text-[9px] font-black text-orange-800 uppercase tracking-widest">
                          <th className="px-8 py-4">Employee</th>
                          <th className="px-8 py-4 text-center">TimeSync Hours</th>
                          <th className="px-8 py-4 text-center">PayEdge Computed</th>
                          <th className="px-8 py-4 text-right">Variance</th>
                          <th className="px-8 py-4">AI Suggestion</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                       <tr className="bg-orange-50/10">
                          <td className="px-8 py-4">
                             <p className="font-bold text-gray-700">Kamran Shah</p>
                             <p className="text-[10px] text-gray-400 font-bold uppercase">EMP-1022</p>
                          </td>
                          <td className="px-8 py-4 text-center font-mono font-bold">184.5</td>
                          <td className="px-8 py-4 text-center font-mono font-bold">176.0</td>
                          <td className="px-8 py-4 text-right text-red-500 font-black">+8.5 hrs</td>
                          <td className="px-8 py-4">
                             <div className="flex items-center gap-2 p-2 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100">
                                <Bot size={14} className="shrink-0" />
                                <span className="text-[10px] font-bold">Manual OT override in PayEdge. Check approval doc.</span>
                             </div>
                          </td>
                       </tr>
                       <tr className="bg-white">
                          <td className="px-8 py-4">
                             <p className="font-bold text-gray-700">Sara Khan</p>
                             <p className="text-[10px] text-gray-400 font-bold uppercase">EMP-1102</p>
                          </td>
                          <td className="px-8 py-4 text-center font-mono font-bold">168.0</td>
                          <td className="px-8 py-4 text-center font-mono font-bold">160.0</td>
                          <td className="px-8 py-4 text-right text-red-500 font-black">+8.0 hrs</td>
                          <td className="px-8 py-4">
                             <div className="flex items-center gap-2 p-2 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100">
                                <Bot size={14} className="shrink-0" />
                                <span className="text-[10px] font-bold">Public holiday (Jan 5) not synced in PayEdge.</span>
                             </div>
                          </td>
                       </tr>
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Section 2: Bank Statement Matching */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                 <h3 className="text-sm font-black uppercase tracking-[2px] text-gray-800 flex items-center gap-2">
                    <Landmark size={18} className="text-primary" /> Bank Statement Match (HBL)
                 </h3>
                 <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
                    <table className="w-full text-left text-xs">
                       <thead className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                          <tr>
                             <th className="px-6 py-4">Bank Ref</th>
                             <th className="px-6 py-4 text-right">Statement Amt</th>
                             <th className="px-6 py-4 text-right">PayEdge Amt</th>
                             <th className="px-6 py-4 text-center">Match</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-50 font-medium">
                          {[
                            { ref: 'FT250115001', st: 185000, pe: 185000, ok: true },
                            { ref: 'FT250115002', st: 420000, pe: 420000, ok: true },
                            { ref: 'FT250115003', st: 106250, pe: 106500, ok: false },
                          ].map((m, i) => (
                            <tr key={i} className={m.ok ? 'hover:bg-gray-50' : 'bg-red-50/30'}>
                               <td className="px-6 py-4 font-mono font-bold text-gray-600">{m.ref}</td>
                               <td className="px-6 py-4 text-right font-mono font-black text-gray-800">{m.st.toLocaleString()}</td>
                               <td className="px-6 py-4 text-right font-mono font-black text-primary">{m.pe.toLocaleString()}</td>
                               <td className="px-6 py-4 text-center">
                                  {m.ok ? <CheckCircle2 size={16} className="text-green-500 mx-auto" /> : <AlertTriangle size={16} className="text-red-500 mx-auto" />}
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                    <div className="p-4 bg-gray-50 border-t flex justify-center">
                       <button className="text-[10px] font-black text-primary uppercase hover:underline">View 322 matched records</button>
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="bg-indigo-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden group h-full flex flex-col justify-between">
                    <div className="relative z-10 space-y-6">
                       <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/10 rounded-xl"><ShieldCheck size={24} className="text-accent" /></div>
                          <h3 className="text-lg font-black uppercase tracking-tight">Audit Confirmation</h3>
                       </div>
                       <div className="space-y-4">
                          <p className="text-sm text-white/70 leading-relaxed">
                            AI-Engine has verified <span className="text-accent font-bold">99.2%</span> of disbursement records against the HBL January Statement.
                          </p>
                          <div className="flex gap-4">
                             <div className="bg-white/10 p-3 rounded-2xl border border-white/5 flex-1">
                                <p className="text-[10px] font-bold text-white/40 uppercase">Matched</p>
                                <p className="text-xl font-black text-white">324</p>
                             </div>
                             <div className="bg-red-500/20 p-3 rounded-2xl border border-red-500/20 flex-1">
                                <p className="text-[10px] font-bold text-red-200/40 uppercase">Unmatched</p>
                                <p className="text-xl font-black text-red-200">01</p>
                             </div>
                          </div>
                       </div>
                    </div>
                    <button className="relative z-10 w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[3px] transition-all flex items-center justify-center gap-2">
                       <Download size={16} /> Final Audit Report <ChevronRight size={14} />
                    </button>
                    <FileSearch className="absolute right-[-20px] bottom-[-20px] text-white/5 w-48 h-48 rotate-12" />
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Info Notice */}
      <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl flex items-start gap-4 shadow-sm">
         <Info size={28} className="text-blue-600 mt-0.5 shrink-0" />
         <div className="space-y-1">
            <h5 className="text-sm font-black text-blue-900 uppercase tracking-tight leading-none">Reconciliation Protocol</h5>
            <p className="text-xs text-blue-700 leading-relaxed font-medium">
              PayEdge Reconciliation Assistant automatically cross-checks payroll outputs against sub-system inputs (Time & Leave) and external endpoints (Bank Statements). All matching exceptions are flagged for manual review or one-click auto-fixing based on AI-derived justifications.
            </p>
         </div>
      </div>
    </div>
  );
};