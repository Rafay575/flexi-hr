import React, { useState } from 'react';
import { 
  Database, RefreshCw, CheckCircle2, AlertCircle, 
  Settings2, Terminal, ExternalLink, Link2, 
  Activity, Cloud, Landmark, ShieldCheck, 
  ArrowRight, Layers, FileJson, Clock, 
  Search, Filter, ChevronRight, Calculator,
  Smartphone, HardDrive, Box, Zap,
  /* Added missing icon imports */
  Plus, Trash2, Info
} from 'lucide-react';

/* Moved custom SVG components above usage to avoid "used before declaration" errors */
const Users = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const Calendar = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

type SyncStatus = 'ACTIVE' | 'PENDING' | 'ERROR';

interface FlexiModule {
  id: string;
  name: string;
  icon: any;
  status: SyncStatus;
  lastSync: string;
  mappedEntities: number;
}

interface ExternalERP {
  id: string;
  name: string;
  provider: string;
  status: 'CONNECTED' | 'DISCONNECTED';
  endpoint: string;
  lastPost: string;
}

const INTERNAL_MODULES: FlexiModule[] = [
  { id: 'time', name: 'TimeSync', icon: Clock, status: 'ACTIVE', lastSync: '10 mins ago', mappedEntities: 325 },
  { id: 'leave', name: 'LeaveEase', icon: Calendar, status: 'ACTIVE', lastSync: '2 hours ago', mappedEntities: 42 },
  { id: 'hub', name: 'PeopleHub', icon: Users, status: 'ACTIVE', lastSync: 'Real-time', mappedEntities: 485 },
];

const EXTERNAL_ERPS: ExternalERP[] = [
  { id: 'erp1', name: 'SAP S/4HANA', provider: 'SAP SE', status: 'CONNECTED', endpoint: 'https://api.sap.corp/jv/v1', lastPost: 'Dec 31, 2024' },
  { id: 'erp2', name: 'Oracle NetSuite', provider: 'Oracle', status: 'DISCONNECTED', endpoint: 'N/A', lastPost: 'N/A' },
  { id: 'erp3', name: 'QuickBooks Online', provider: 'Intuit', status: 'CONNECTED', endpoint: 'https://quickbooks.api.intuit.com', lastPost: 'Dec 15, 2024' },
];

export const PayEdgeIntegrationSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'INTERNAL' | 'EXTERNAL' | 'JV'>('INTERNAL');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20">
            <Link2 size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Integration Hub</h2>
            <p className="text-sm text-gray-500 font-medium">Manage data bridges between Flexi modules and external ecosystems</p>
          </div>
        </div>
        <button 
          onClick={handleManualSync}
          disabled={isSyncing}
          className="bg-primary text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
        >
          {isSyncing ? <RefreshCw size={18} className="animate-spin" /> : <RefreshCw size={18} />}
          Force Global Refresh
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 p-1 bg-gray-100 w-fit rounded-2xl border border-gray-200">
        {[
          { id: 'INTERNAL', label: 'Flexi Ecosystem' },
          { id: 'EXTERNAL', label: 'External ERPs' },
          { id: 'JV', label: 'JV Mapping Engine' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[500px]">
        {activeTab === 'INTERNAL' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {INTERNAL_MODULES.map((mod) => (
              <div key={mod.id} className="bg-white p-8 rounded-3xl shadow-md border border-gray-100 flex flex-col justify-between group hover:border-primary/20 transition-all">
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="p-4 bg-primary/5 text-primary rounded-2xl group-hover:bg-primary group-hover:text-white transition-all">
                      <mod.icon size={28} />
                    </div>
                    <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border shadow-sm ${
                      mod.status === 'ACTIVE' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-orange-50 text-orange-600 border-orange-100'
                    }`}>
                      {mod.status}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-gray-800">{mod.name}</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Native Flexi Data Bridge</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-[8px] font-black text-gray-400 uppercase mb-1">MAPPINGS</p>
                      <p className="text-sm font-black text-gray-700">{mod.mappedEntities} Items</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-[8px] font-black text-gray-400 uppercase mb-1">LAST SYNC</p>
                      <p className="text-sm font-black text-gray-700">{mod.lastSync}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-50 grid grid-cols-3 gap-2">
                  <button className="py-2 bg-gray-50 text-[9px] font-black uppercase text-gray-500 rounded-lg hover:bg-gray-100 transition-all">Configure</button>
                  <button className="py-2 bg-gray-50 text-[9px] font-black uppercase text-gray-500 rounded-lg hover:bg-gray-100 transition-all">Test</button>
                  <button className="py-2 bg-gray-50 text-[9px] font-black uppercase text-gray-500 rounded-lg hover:bg-gray-100 transition-all">Logs</button>
                </div>
              </div>
            ))}
            
            <div className="p-8 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-center space-y-4 hover:border-primary/20 transition-all group">
               {/* Fixed: Plus icon is now imported */}
               <div className="p-4 bg-gray-50 rounded-full text-gray-300 group-hover:text-primary transition-all">
                  <Plus size={32} />
               </div>
               <div>
                  <h5 className="font-bold text-gray-700">Add Native Hook</h5>
                  <p className="text-xs text-gray-400 max-w-[200px]">Connect new internal FlexiHRMS modules</p>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'EXTERNAL' && (
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden animate-in slide-in-from-right-4 duration-500">
            <div className="p-6 border-b bg-gray-50/50 flex items-center justify-between">
               <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400">External ERP & Accounting Connectors</h3>
               <button className="bg-primary text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md">Add API Connector</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    <th className="px-8 py-5">System Identity</th>
                    <th className="px-8 py-5">Endpoint Target</th>
                    <th className="px-8 py-5 text-center">Status</th>
                    <th className="px-8 py-5 text-center">Last Posting</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {EXTERNAL_ERPS.map((erp) => (
                    <tr key={erp.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-4">
                         <div className="flex items-center gap-4">
                            <div className="p-2 bg-gray-100 rounded-lg text-gray-500"><Cloud size={18}/></div>
                            <div>
                               <p className="font-black text-gray-700">{erp.name}</p>
                               <p className="text-[9px] text-gray-400 font-bold uppercase">{erp.provider}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-4">
                         <code className="text-[10px] font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">{erp.endpoint}</code>
                      </td>
                      <td className="px-8 py-4 text-center">
                         <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border shadow-sm ${
                           erp.status === 'CONNECTED' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'
                         }`}>
                           {erp.status}
                         </span>
                      </td>
                      <td className="px-8 py-4 text-center font-bold text-gray-500 text-xs">{erp.lastPost}</td>
                      <td className="px-8 py-4 text-right">
                         <div className="flex justify-end gap-2">
                            {/* Fixed: Settings corrected to Settings2 */}
                            <button className="p-2 text-gray-300 hover:text-primary transition-all"><Settings2 size={18}/></button>
                            <button className="p-2 text-gray-300 hover:text-primary transition-all"><Terminal size={18}/></button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'JV' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in zoom-in-95 duration-500">
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
                <div className="p-6 border-b bg-gray-50/50 flex items-center justify-between">
                   <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400">Ledger Mapping Configuration</h3>
                   <div className="flex items-center gap-2">
                      <button className="text-[10px] font-black text-primary uppercase hover:underline">Download Master Map</button>
                   </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                        <th className="px-8 py-5 w-1/3">Pay Component</th>
                        <th className="px-8 py-5">GL Account (Debit)</th>
                        <th className="px-8 py-5">GL Account (Credit)</th>
                        <th className="px-8 py-5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 font-medium">
                       {[
                         { name: 'Basic Salary', dr: '501001 - Salaries Exp', cr: '201001 - Accrued Sal' },
                         { name: 'House Rent Allowance', dr: '501002 - Allowances Exp', cr: '201001 - Accrued Sal' },
                         { name: 'Income Tax', dr: '201001 - Accrued Sal', cr: '202005 - Tax Payable' },
                         { name: 'Provident Fund (ER)', dr: '501005 - Benefits Exp', cr: '202010 - PF Payable' },
                       ].map((m, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 group">
                           <td className="px-8 py-4 font-bold text-gray-700">{m.name}</td>
                           <td className="px-8 py-4">
                              <input type="text" defaultValue={m.dr} className="w-full bg-transparent border-b border-transparent group-hover:border-gray-200 outline-none text-xs font-mono text-primary" />
                           </td>
                           <td className="px-8 py-4">
                              <input type="text" defaultValue={m.cr} className="w-full bg-transparent border-b border-transparent group-hover:border-gray-200 outline-none text-xs font-mono text-primary" />
                           </td>
                           <td className="px-8 py-4 text-right">
                              {/* Fixed: Trash2 icon is now imported */}
                              <button className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16}/></button>
                           </td>
                        </tr>
                       ))}
                    </tbody>
                  </table>
                  {/* Fixed: Plus icon is now imported */}
                  <button className="w-full py-4 border-t border-dashed border-gray-200 text-[10px] font-black uppercase text-primary flex items-center justify-center gap-2 hover:bg-gray-50">
                     <Plus size={14}/> Add Mapping Rule
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
               <div className="bg-primary p-8 rounded-3xl text-white shadow-xl shadow-primary/20 space-y-8 relative overflow-hidden group">
                  <div className="relative z-10 space-y-6">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-xl"><Calculator size={24} className="text-accent" /></div>
                        <h3 className="text-lg font-black uppercase tracking-tight">Voucher Logic</h3>
                     </div>
                     <div className="space-y-6">
                        <div className="space-y-1.5">
                           <label className="text-[9px] font-black text-white/50 uppercase">Voucher Grouping</label>
                           <select className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm font-bold outline-none cursor-pointer">
                              <option className="text-gray-900">Per Cost Center (Consolidated)</option>
                              <option className="text-gray-900">Per Employee (Detail)</option>
                              <option className="text-gray-900">Entire Batch (Consolidated)</option>
                           </select>
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-[9px] font-black text-white/50 uppercase">Posting Trigger</label>
                           <select className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm font-bold outline-none cursor-pointer">
                              <option className="text-gray-900">Upon Batch Approval</option>
                              <option className="text-gray-900">Manual Posting Only</option>
                              <option className="text-gray-900">Scheduled End of Cycle</option>
                           </select>
                        </div>
                     </div>
                  </div>
                  <Database className="absolute right-[-20px] bottom-[-20px] text-white/5 w-48 h-48 rotate-12 group-hover:scale-110 transition-transform duration-700" />
               </div>

               <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl space-y-4 shadow-sm">
                  <div className="flex items-center gap-3 text-blue-600">
                     {/* Fixed: Info icon is now imported */}
                     <Info size={20} />
                     <h5 className="text-xs font-black uppercase">ERP Integrity</h5>
                  </div>
                  <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                     PayEdge validates mapping balanced status (Dr = Cr) before allowing posting. Current Jan 2025 mapping status: <span className="font-black text-green-600 uppercase">BALANCED ✓</span>
                  </p>
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Audit Block */}
      <div className="p-6 bg-gray-50 border border-gray-100 rounded-3xl flex items-center justify-between shadow-sm">
         <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm text-primary">
               <ShieldCheck size={28} />
            </div>
            <div>
               <h5 className="text-sm font-bold text-gray-800 leading-tight tracking-tight">Security & Governance Protocol</h5>
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">All transmissions are encrypted via mutual-TLS v1.3 with automated certificate rotation.</p>
            </div>
         </div>
         <button className="text-[10px] font-black text-primary uppercase bg-white px-4 py-2 rounded-xl border shadow-sm hover:bg-gray-100 transition-all flex items-center gap-2">
            Audit API Logs <ArrowRight size={14} />
          </button>
      </div>
    </div>
  );
};
