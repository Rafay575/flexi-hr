
import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, ShieldAlert, AlertTriangle, CheckCircle2, 
  Search, Filter, Download, Mail, RefreshCw, 
  ChevronRight, Landmark, User, FileWarning, 
  TrendingUp, Zap, MoreVertical, X, ArrowRight
} from 'lucide-react';

type ExceptionSeverity = 'CRITICAL' | 'WARNING' | 'RESOLVED';
type ExceptionType = 'BANK' | 'NEGATIVE' | 'STATUTORY' | 'VARIANCE';

interface PayrollException {
  id: string;
  empId: string;
  empName: string;
  type: ExceptionType;
  severity: ExceptionSeverity;
  detail: string;
  impact?: number;
  timestamp: string;
}

const MOCK_EXCEPTIONS: PayrollException[] = [
  { id: 'EX-001', empId: 'EMP-1003', empName: 'Umar Farooq', type: 'BANK', severity: 'CRITICAL', detail: 'Primary bank account (HBL) mapping missing for disbursement.', timestamp: '2h ago' },
  { id: 'EX-002', empId: 'EMP-1089', empName: 'Hassan Raza', type: 'NEGATIVE', severity: 'CRITICAL', detail: 'Net Payout is PKR -5,400 due to excessive loan EMI & unpaid leaves.', impact: -5400, timestamp: '1h ago' },
  { id: 'EX-003', empId: 'EMP-1256', empName: 'Zohaib Ali', type: 'STATUTORY', severity: 'CRITICAL', detail: 'Missing NTN number; required for FBR Annex-C filing.', timestamp: '3h ago' },
  { id: 'EX-004', empId: 'EMP-1005', empName: 'Mustafa Kamal', type: 'VARIANCE', severity: 'WARNING', detail: 'Payout variance > 25% vs Dec 2024. Triggered by bonus.', impact: 125000, timestamp: '30m ago' },
  { id: 'EX-005', empId: 'EMP-1102', empName: 'Sara Khan', type: 'BANK', severity: 'CRITICAL', detail: 'Invalid IBAN checksum detected. Bank rejection likely.', timestamp: '4h ago' },
  { id: 'EX-006', empId: 'EMP-1044', empName: 'Raza Jafri', type: 'VARIANCE', severity: 'WARNING', detail: 'Unusual shift allowance spike (15% higher than average).', timestamp: '5h ago' },
];

export const ExceptionCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'RESOLVED'>('ALL');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const stats = {
    total: 15,
    critical: 7,
    warnings: 8,
    resolvedToday: 12
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getTypeConfig = (type: ExceptionType) => {
    switch (type) {
      case 'BANK': return { icon: Landmark, label: 'Bank Details', color: 'text-blue-600', bg: 'bg-blue-50' };
      case 'NEGATIVE': return { icon: ShieldAlert, label: 'Negative Net', color: 'text-red-600', bg: 'bg-red-50' };
      case 'STATUTORY': return { icon: FileWarning, label: 'Statutory ID', color: 'text-purple-600', bg: 'bg-purple-50' };
      case 'VARIANCE': return { icon: TrendingUp, label: 'High Variance', color: 'text-orange-600', bg: 'bg-orange-50' };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Resolve Center</h2>
          <p className="text-sm text-gray-500">Monitor and rectify batch computation anomalies</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Auto-Refresh</span>
            <button 
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`w-8 h-4 rounded-full relative transition-all ${autoRefresh ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${autoRefresh ? 'right-0.5' : 'left-0.5'}`} />
            </button>
          </div>
          <select className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10">
            <option>Run: Jan 2025 (v1.2)</option>
            <option>Run: Jan 2025 (v1.1)</option>
          </select>
          <button 
            onClick={handleRefresh}
            className={`p-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Exceptions', val: stats.total, icon: AlertCircle, color: 'text-gray-600', bg: 'bg-white' },
          { label: 'Critical Blocks', val: stats.critical, icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Policy Warnings', val: stats.warnings, icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Resolved Today', val: stats.resolvedToday, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between`}>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
              <h4 className={`text-2xl font-black ${s.color}`}>{s.val}</h4>
            </div>
            <s.icon size={28} className={`${s.color} opacity-20`} />
          </div>
        ))}
      </div>

      {/* Workspace */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-4 border-b flex flex-wrap items-center justify-between gap-4 bg-gray-50/30">
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl border border-gray-200">
            {['ALL', 'CRITICAL', 'WARNING', 'RESOLVED'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === tab ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm">
              <Download size={14} /> Export All
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-primary/90 transition-all shadow-md">
              <Zap size={14} /> Auto-Resolve
            </button>
          </div>
        </div>

        <div className="p-4 bg-white border-b flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by employee name, ID or detail..." 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 flex items-center gap-2 hover:bg-gray-50">
            <Filter size={14} /> Severity: All
          </button>
          <div className="h-6 w-[1px] bg-gray-200 mx-2"></div>
          <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1.5">
            <Mail size={14} /> Bulk Email HR
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {MOCK_EXCEPTIONS.map((ex) => {
            const config = getTypeConfig(ex.type);
            return (
              <div key={ex.id} className="p-6 hover:bg-gray-50 transition-all group animate-in slide-in-from-bottom-2">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex gap-5 flex-1">
                    <div className={`p-4 rounded-2xl ${config.bg} ${config.color} shrink-0 h-fit shadow-sm`}>
                      <config.icon size={24} />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
                          ex.severity === 'CRITICAL' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                        }`}>
                          {ex.severity}
                        </span>
                        <span className="text-xs font-black text-gray-300 tracking-tighter">{ex.timestamp}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-gray-800">{ex.empName}</h4>
                        <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded uppercase tracking-tighter">{ex.empId}</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed font-medium">
                        {ex.detail}
                      </p>
                      {ex.impact && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Est. Impact:</span>
                          <span className={`text-xs font-mono font-black ${ex.impact < 0 ? 'text-red-600' : 'text-primary'}`}>
                            PKR {Math.abs(ex.impact).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 items-end shrink-0">
                    <div className="flex gap-2">
                       {ex.type === 'BANK' && (
                         <button className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-primary/90 shadow-md flex items-center gap-2 active:scale-95">
                           Fix Now <ArrowRight size={14} />
                         </button>
                       )}
                       {ex.type === 'NEGATIVE' && (
                         <button className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-red-50 shadow-sm flex items-center gap-2">
                           Adjust Deducts
                         </button>
                       )}
                       {ex.type === 'STATUTORY' && (
                         <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-purple-700 shadow-md flex items-center gap-2">
                           Update Profile
                         </button>
                       )}
                       {ex.type === 'VARIANCE' && (
                         <div className="flex gap-2">
                            <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-green-700 shadow-sm">Accept</button>
                            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-400 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-gray-50">Flag</button>
                         </div>
                       )}
                       <button className="p-2 text-gray-300 hover:text-primary hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-100">
                         <MoreVertical size={18} />
                       </button>
                    </div>
                    <button className="text-[10px] font-black text-gray-400 uppercase hover:text-primary hover:underline transition-colors mt-2">Dismiss Warning</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-6 bg-gray-50 border-t flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center animate-pulse">
                <AlertCircle size={20} />
             </div>
             <div>
                <p className="text-sm font-bold text-gray-800">7 Critical Blocks Remain</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Disbursement cannot proceed until resolved</p>
             </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest italic">
            Last re-computation: Today, 11:45 AM
          </div>
        </div>
      </div>
    </div>
  );
};
