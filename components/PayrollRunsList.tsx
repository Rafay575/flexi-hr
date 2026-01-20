
import React, { useState } from 'react';
import { 
  Play, Search, Filter, MoreVertical, 
  ChevronDown, ChevronRight, Calculator,
  Users, Wallet, HandCoins, AlertCircle,
  CheckCircle2, Lock, Send, Eye, RefreshCw,
  History, ShieldCheck, FileText, ArrowRight,
  Layers
} from 'lucide-react';
import { PayrollWizardStep1 } from './PayrollWizardStep1';
import { PayrollWizardStep2 } from './PayrollWizardStep2';
import { PayrollWizardStep3 } from './PayrollWizardStep3';
import { PayrollWizardStep4 } from './PayrollWizardStep4';
import { PayrollWizardStep5 } from './PayrollWizardStep5';
import { PayrollWizardStep6 } from './PayrollWizardStep6';
import { PayrollWizardStep7 } from './PayrollWizardStep7';

type RunStatus = 'Draft' | 'Validating' | 'Exceptions' | 'Ready' | 'Submitted' | 'Approved' | 'Locked' | 'Published';

interface PayrollRun {
  id: string;
  period: string;
  group: string;
  version: string;
  employeeCount: number;
  gross: number;
  net: number;
  status: RunStatus;
  updatedAt: string;
}

const MOCK_RUNS: PayrollRun[] = [
  { id: 'RUN-2025-001', period: 'Jan 2025', group: 'Islamabad Corporate', version: 'v1.2', employeeCount: 145, gross: 12500000, net: 10850000, status: 'Exceptions', updatedAt: '2 hours ago' },
  { id: 'RUN-2025-002', period: 'Jan 2025', group: 'Karachi Operations', version: 'v1.0', employeeCount: 280, gross: 18400000, net: 16200000, status: 'Draft', updatedAt: '5 mins ago' },
  { id: 'RUN-2024-492', period: 'Dec 2024', group: 'Islamabad Corporate', version: 'v2.1', employeeCount: 142, gross: 12200000, net: 10600000, status: 'Published', updatedAt: 'Dec 31, 2024' },
  { id: 'RUN-2024-493', period: 'Dec 2024', group: 'Karachi Operations', version: 'v1.4', employeeCount: 275, gross: 18100000, net: 15900000, status: 'Locked', updatedAt: 'Dec 30, 2024' },
  { id: 'RUN-2025-003', period: 'Jan 2025', group: 'Exec Management', version: 'v1.1', employeeCount: 12, gross: 4500000, net: 3850000, status: 'Submitted', updatedAt: '1 hour ago' },
];

export const PayrollRunsList: React.FC = () => {
  const [wizardStep, setWizardStep] = useState<number>(0); // 0 = list, 1-7 = steps
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const formatPKR = (val: number) => `PKR ${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  const getStatusStyle = (status: RunStatus) => {
    switch (status) {
      case 'Draft': return 'border-gray-400 border-dashed border text-gray-500';
      case 'Validating': return 'bg-blue-50 text-blue-600 border-blue-200 animate-pulse';
      case 'Exceptions': return 'bg-red-50 text-red-600 border-red-200 font-bold';
      case 'Ready': return 'bg-green-50 text-green-600 border-green-200';
      case 'Submitted': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'Approved': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'Locked': return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'Published': return 'bg-indigo-50 text-indigo-600 border-indigo-200';
      default: return 'bg-gray-100 text-gray-400';
    }
  };

  const renderActions = (run: PayrollRun) => {
    const btnBase = "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm";
    
    switch (run.status) {
      case 'Draft':
        return <button className={`${btnBase} bg-primary text-white hover:bg-primary/90`}><Play size={12} fill="currentColor" /> Continue</button>;
      case 'Exceptions':
        return <button className={`${btnBase} bg-red-600 text-white hover:bg-red-700`}><AlertCircle size={12} /> Resolve</button>;
      case 'Ready':
        return <button className={`${btnBase} bg-yellow-500 text-white hover:bg-yellow-600`}><Send size={12} /> Submit</button>;
      case 'Approved':
        return <button onClick={() => setWizardStep(7)} className={`${btnBase} bg-purple-600 text-white hover:bg-purple-700`}><Lock size={12} /> Disburse</button>;
      case 'Locked':
        return <button className={`${btnBase} bg-indigo-600 text-white hover:bg-indigo-700`}><CheckCircle2 size={12} /> Publish</button>;
      default:
        return <button className={`${btnBase} bg-white border border-gray-200 text-gray-600 hover:bg-gray-50`}><Eye size={12} /> View</button>;
    }
  };

  if (wizardStep === 1) {
    return <PayrollWizardStep1 onNext={() => setWizardStep(2)} onCancel={() => setWizardStep(0)} />;
  }

  if (wizardStep === 2) {
    return <PayrollWizardStep2 onNext={() => setWizardStep(3)} onBack={() => setWizardStep(1)} onCancel={() => setWizardStep(0)} />;
  }

  if (wizardStep === 3) {
    return <PayrollWizardStep3 onNext={() => setWizardStep(4)} onBack={() => setWizardStep(2)} onCancel={() => setWizardStep(0)} />;
  }

  if (wizardStep === 4) {
    return <PayrollWizardStep4 onNext={() => setWizardStep(5)} onBack={() => setWizardStep(3)} onCancel={() => setWizardStep(0)} />;
  }

  if (wizardStep === 5) {
    return <PayrollWizardStep5 onNext={() => setWizardStep(6)} onBack={() => setWizardStep(4)} onCancel={() => setWizardStep(0)} />;
  }

  if (wizardStep === 6) {
    return <PayrollWizardStep6 onNext={() => setWizardStep(7)} onBack={() => setWizardStep(5)} onCancel={() => setWizardStep(0)} />;
  }

  if (wizardStep === 7) {
    return <PayrollWizardStep7 onNext={() => setWizardStep(0)} onBack={() => setWizardStep(6)} onCancel={() => setWizardStep(0)} />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Payroll Processing</h2>
          <p className="text-sm text-gray-500">Execute and monitor batch calculation cycles</p>
        </div>
        <button 
          onClick={() => setWizardStep(1)}
          className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          <Calculator size={18} /> Create New Run
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
        <div className="p-4 border-b bg-white flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
          <div className="relative flex-1 max-md:min-w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Search by Run ID or Group..."
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 flex items-center gap-2 hover:bg-gray-50">
              <Filter size={14} /> Period: Jan 2025
            </button>
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 flex items-center gap-2 hover:bg-gray-50">
              <Layers size={14} /> Group: All
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b sticky-header">
                <th className="px-6 py-5 w-10"></th>
                <th className="px-6 py-5">Run ID</th>
                <th className="px-6 py-5">Period</th>
                <th className="px-6 py-5">Payroll Group</th>
                <th className="px-6 py-5 text-center">Version</th>
                <th className="px-6 py-5 text-center">Employees</th>
                <th className="px-6 py-5 text-right">Gross Total</th>
                <th className="px-6 py-5 text-right">Net Payout</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {MOCK_RUNS.map((run) => {
                const isExpanded = expandedId === run.id;
                return (
                  <React.Fragment key={run.id}>
                    <tr 
                      className={`hover:bg-gray-50/80 transition-colors cursor-pointer group ${isExpanded ? 'bg-primary/[0.02]' : ''}`}
                      onClick={() => setExpandedId(isExpanded ? null : run.id)}
                    >
                      <td className="px-6 py-4 text-center">
                        {isExpanded ? <ChevronDown size={18} className="text-primary" /> : <ChevronRight size={18} className="text-gray-300" />}
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-primary">{run.id}</td>
                      <td className="px-6 py-4 text-gray-600 font-medium">{run.period}</td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-800">{run.group}</span>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Updated {run.updatedAt}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-1.5 py-0.5 border rounded uppercase">{run.version}</span>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-gray-700">{run.employeeCount}</td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-gray-500 tracking-tight">{formatPKR(run.gross)}</td>
                      <td className="px-6 py-4 text-right font-mono font-black text-primary tracking-tight">{formatPKR(run.net)}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border shadow-sm ${getStatusStyle(run.status)}`}>
                          {run.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {renderActions(run)}
                          <button className="p-2 text-gray-300 hover:text-primary hover:bg-white rounded transition-all">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {isExpanded && (
                      <tr className="bg-gray-50/50">
                        <td colSpan={10} className="px-12 py-8 border-b">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-top-2 duration-300">
                            {/* Exception Summary */}
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                              <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                <AlertCircle size={14} className="text-red-500" /> Exception Summary
                              </h5>
                              <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                                  <span className="text-xs font-bold text-red-900">Missing Bank Details</span>
                                  <span className="text-xs font-black bg-red-600 text-white px-2 py-0.5 rounded">05</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-100">
                                  <span className="text-xs font-bold text-orange-900">Tax Slab Discrepancy</span>
                                  <span className="text-xs font-black bg-orange-500 text-white px-2 py-0.5 rounded">02</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                                  <span className="text-xs font-bold text-blue-900">Negative Net Salary</span>
                                  <span className="text-xs font-black bg-blue-600 text-white px-2 py-0.5 rounded">01</span>
                                </div>
                              </div>
                            </div>

                            {/* Approval & Version Trail */}
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                              <div className="flex justify-between items-center">
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                  <History size={14} /> Audit & Workflow Trail
                                </h5>
                                <button className="text-[10px] font-black text-primary hover:underline">Full Log</button>
                              </div>
                              <div className="space-y-4 relative before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-100">
                                <div className="relative pl-6">
                                  <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-600 ring-4 ring-white shadow-sm" />
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Jan 15, 10:45 AM</p>
                                  <p className="text-xs font-bold text-gray-700">Run Regenerated (v1.2)</p>
                                  <p className="text-[9px] text-gray-400 italic font-medium">By: Ahmed Raza (Admin)</p>
                                </div>
                                <div className="relative pl-6 opacity-60">
                                  <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-gray-300 ring-4 ring-white" />
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Jan 15, 09:20 AM</p>
                                  <p className="text-xs font-bold text-gray-600">Validation Failed (8 Errors)</p>
                                  <p className="text-[9px] text-gray-400 italic font-medium">System Automated Service</p>
                                </div>
                              </div>
                            </div>

                            {/* Quick Insights */}
                            <div className="bg-primary p-6 rounded-xl text-white shadow-lg shadow-primary/20 flex flex-col justify-between">
                              <div>
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-4">Run Insights</h5>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-[9px] font-bold text-white/40 uppercase">Avg Net Salary</p>
                                    <p className="text-sm font-black text-accent">{formatPKR(75000)}</p>
                                  </div>
                                  <div>
                                    <p className="text-[9px] font-bold text-white/40 uppercase">Total Tax Vol.</p>
                                    <p className="text-sm font-black text-accent">{formatPKR(1850000)}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="pt-6 mt-4 border-t border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <ShieldCheck size={16} className="text-accent" />
                                  <span className="text-[9px] font-black uppercase tracking-widest text-white/80 italic">FBR Slab Compliant</span>
                                </div>
                                <button className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all">
                                  <RefreshCw size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Statistics */}
        <div className="p-6 bg-gray-50 border-t flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-10">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Batches Open</span>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-gray-800">03</span>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] font-black rounded uppercase">Current Cycle</span>
              </div>
            </div>
            <div className="h-10 w-[1px] bg-gray-200"></div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Value Under Prep</span>
              <div className="flex items-center gap-2 text-primary">
                <Wallet size={16} />
                <span className="text-xl font-black">{formatPKR(35400000)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
              <CheckCircle2 size={16} className="text-green-500" />
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Bank Connectivity: OK</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
              <ShieldCheck size={16} className="text-blue-500" />
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Auth Protocol: 2FA ENFORCED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Center Toast */}
      <div className="bg-white border-l-4 border-primary p-5 rounded-r-xl shadow-lg flex items-center justify-between animate-in slide-in-from-right-10 duration-500">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary relative">
            <FileText size={24} />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-sm">8</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-800 leading-tight">Batch Critical Exceptions Detected</h4>
            <p className="text-xs text-gray-500 mt-0.5">Jan 2025 Karachi Operations run requires manual override for 5 bank discrepancies.</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 px-5 py-2.5 bg-primary text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-primary/90 shadow-md">
          Open Resolve Center <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
