import React, { useState } from 'react';
import { 
  Link2, CheckCircle2, AlertCircle, RefreshCw, Settings, 
  Clock, Database, DollarSign, Users, Target, Zap, 
  ChevronRight, ArrowRightLeft, ShieldCheck, Search,
  Activity, ArrowUpRight, Terminal, X,
  // Added missing imports to fix errors on lines 167 and 228
  Filter, Download
} from 'lucide-react';
import { IntegrationConfigDrawer } from './IntegrationConfigDrawer';

interface Integration {
  id: string;
  name: string;
  icon: any;
  status: 'OK' | 'Error' | 'Syncing';
  description: string;
  lastSync: string;
  todayCount: number;
  color: string;
}

interface SyncLog {
  timestamp: string;
  integration: string;
  direction: 'Inbound' | 'Outbound' | 'Bi-directional';
  records: number;
  status: 'Success' | 'Failed' | 'Partial';
}

const INTEGRATIONS: Integration[] = [
  { 
    id: 'timesync', name: 'TimeSync', icon: Clock, status: 'OK', 
    description: 'Approved leave applications automatically overlay attendance rosters and bypass daily punch requirements.',
    lastSync: '5 mins ago', todayCount: 45, color: 'text-blue-600 bg-blue-50'
  },
  { 
    id: 'payedge', name: 'PayEdge', icon: DollarSign, status: 'OK', 
    description: 'Syncs unpaid leave for deductions and approved encashments for earnings processing in the payroll cycle.',
    lastSync: '1h ago', todayCount: 12, color: 'text-emerald-600 bg-emerald-50'
  },
  { 
    id: 'peoplehub', name: 'PeopleHub', icon: Users, status: 'OK', 
    description: 'Synchronizes employee master data, department hierarchy, and grade levels to determine leave eligibility.',
    lastSync: '3h ago', todayCount: 150, color: 'text-purple-600 bg-purple-50'
  },
  { 
    id: 'performpro', name: 'PerformPro', icon: Target, status: 'Syncing', 
    description: 'Sends absence signals and leave utilization patterns to the performance module for holistic review.',
    lastSync: 'Just now', todayCount: 8, color: 'text-amber-600 bg-amber-50'
  }
];

const SYNC_LOGS: SyncLog[] = Array.from({ length: 20 }, (_, i) => ({
  timestamp: 'Feb 12, 2025 • 09:42 AM',
  integration: ['TimeSync', 'PayEdge', 'PeopleHub', 'PerformPro'][i % 4],
  direction: i % 3 === 0 ? 'Inbound' : i % 3 === 1 ? 'Outbound' : 'Bi-directional',
  records: Math.floor(Math.random() * 100) + 1,
  status: i === 5 ? 'Failed' : i === 12 ? 'Partial' : 'Success'
}));

export const LeaveIntegrations = () => {
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [configId, setConfigId] = useState<string | null>(null);

  const handleTest = (id: string) => {
    setSyncingId(id);
    setTimeout(() => setSyncingId(null), 1500);
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500 font-['League_Spartan']">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-[#3E3B6F] rounded-2xl shadow-sm">
            <Link2 size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#3E3B6F]">System Integrations</h2>
            <p className="text-gray-500 font-medium">Manage data flow between LeaveEase and other Flexi HRMS modules.</p>
          </div>
        </div>
        <button className="bg-white border border-gray-200 text-gray-600 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm">
          <Settings size={18} /> Global API Settings
        </button>
      </div>

      {/* Integration Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {INTEGRATIONS.map((integ) => (
          <div key={integ.id} className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${integ.color}`}>
                  <integ.icon size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{integ.name}</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Flexi Module Connection</p>
                </div>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                integ.status === 'OK' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                integ.status === 'Syncing' ? 'bg-blue-50 text-blue-600 border-blue-100 animate-pulse' : 
                'bg-red-50 text-red-600 border-red-100'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${integ.status === 'OK' ? 'bg-emerald-500' : integ.status === 'Syncing' ? 'bg-blue-500' : 'bg-red-500'}`} />
                {integ.status}
              </div>
            </div>

            <div className="p-8 flex-1 space-y-6">
              <p className="text-sm text-gray-500 leading-relaxed font-medium italic">
                "{integ.description}"
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Last Sync</p>
                  <p className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <Clock size={12} className="text-gray-400" /> {integ.lastSync}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Today's Traffic</p>
                  <p className="text-xs font-bold text-indigo-600 flex items-center gap-1.5">
                    <ArrowRightLeft size={12} /> {integ.todayCount} records
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
              <button 
                onClick={() => handleTest(integ.id)}
                disabled={syncingId === integ.id}
                className="flex-1 py-3 bg-white border border-gray-200 text-gray-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-all shadow-sm flex items-center justify-center gap-2"
              >
                {syncingId === integ.id ? <RefreshCw size={14} className="animate-spin" /> : <Zap size={14} className="text-amber-500" />}
                Test Connection
              </button>
              <button 
                onClick={() => setConfigId(integ.id)}
                className="flex-1 py-3 bg-white border border-gray-200 text-gray-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Settings size={14} /> Configure
              </button>
              <button className="p-3 bg-[#3E3B6F] text-white rounded-2xl font-bold hover:bg-[#4A4680] shadow-lg shadow-[#3E3B6F]/20 transition-all active:scale-95">
                <ArrowUpRight size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sync Log Section */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
               <Terminal size={20} className="text-[#3E3B6F]" />
             </div>
             <div>
                <h3 className="text-lg font-bold text-gray-900">Synchronization Logs</h3>
                <p className="text-xs text-gray-400 font-medium">Real-time audit of system-to-system data transfers.</p>
             </div>
          </div>
          <div className="flex gap-2">
             <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
               <input type="text" placeholder="Filter by module..." className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none" />
             </div>
             <button className="p-2 text-gray-400 hover:text-[#3E3B6F] transition-all"><Filter size={18}/></button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/30">
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Timestamp</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Integration</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Direction</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Records</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {SYNC_LOGS.map((log, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                  <td className="px-8 py-5">
                    <p className="text-xs font-bold text-gray-700">{log.timestamp.split('•')[0]}</p>
                    <p className="text-[9px] text-gray-400 uppercase font-medium mt-1">{log.timestamp.split('•')[1]}</p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#3E3B6F]" />
                      <span className="text-sm font-bold text-gray-900">{log.integration}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="text-[10px] font-bold text-gray-500 uppercase px-2 py-0.5 bg-gray-50 rounded-lg border border-gray-100">
                      {log.direction}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="text-sm font-mono font-bold text-[#3E3B6F]">{log.records}</span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      log.status === 'Success' ? 'text-emerald-600 bg-emerald-50' : 
                      log.status === 'Partial' ? 'text-amber-600 bg-amber-50' : 
                      'text-red-600 bg-red-50'
                    }`}>
                      {log.status === 'Success' ? <CheckCircle2 size={10}/> : <AlertCircle size={10}/>}
                      {log.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-gray-400 hover:text-[#3E3B6F] transition-all ">
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
           <p className="text-xs text-gray-500 font-medium italic">Showing last 20 synchronization events. <span className="font-bold text-[#3E3B6F] cursor-pointer underline">View Full Audit</span></p>
           <button className="text-[10px] font-bold text-[#3E3B6F] uppercase tracking-widest flex items-center gap-2">
             Download Daily Sync Report <Download size={14} />
           </button>
        </div>
      </div>

      {/* Info Footnote */}
      <div className="p-8 bg-[#3E3B6F] rounded-[40px] text-white relative overflow-hidden shadow-2xl">
         <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <ShieldCheck size={24} className="text-[#E8D5A3]" />
                  <h4 className="text-lg font-bold">Secure Connectivity</h4>
               </div>
               <p className="text-sm text-white/70 leading-relaxed font-medium">
                  All module integrations are handled via Flexi's core messaging bus with 256-bit encryption. System-to-system credentials are managed by the HQ Security Vault.
               </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white/10 p-5 rounded-3xl border border-white/10 text-center">
                  <p className="text-2xl font-bold text-[#E8D5A3]">99.9%</p>
                  <p className="text-[10px] font-bold uppercase text-white/50 tracking-widest">Uptime Score</p>
               </div>
               <div className="bg-white/10 p-5 rounded-3xl border border-white/10 text-center">
                  <p className="text-2xl font-bold text-[#E8D5A3]">Real-time</p>
                  <p className="text-[10px] font-bold uppercase text-white/50 tracking-widest">Sync Latency</p>
               </div>
            </div>
         </div>
         <Activity size={200} className="absolute -bottom-12 -right-12 text-white/5" />
      </div>

      {/* Integration Configuration Drawer */}
      <IntegrationConfigDrawer 
        isOpen={!!configId} 
        onClose={() => setConfigId(null)} 
        integrationId={configId} 
      />
    </div>
  );
};