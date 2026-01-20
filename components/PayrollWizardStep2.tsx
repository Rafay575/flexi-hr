
import React, { useState } from 'react';
import { 
  Check, ArrowLeft, ArrowRight, RefreshCw, 
  Clock, CalendarX, HandCoins, Receipt, 
  FileEdit, AlertTriangle, CheckCircle2, 
  Info, Database, BarChart3
} from 'lucide-react';

interface PayrollWizardStep2Props {
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
}

const STEPS = [
  { id: 1, label: 'Select' },
  { id: 2, label: 'Ingest' },
  { id: 3, label: 'Calculate' },
  { id: 4, label: 'Exceptions' },
  { id: 5, label: 'Review' },
  { id: 6, label: 'Approve' },
  { id: 7, label: 'Finalize' }
];

interface DataSource {
  id: string;
  name: string;
  icon: any;
  status: 'Synced' | 'Ready' | 'Pending' | 'Error';
  metrics: string[];
  actionLabel: string;
  impact: number;
  records: number;
}

const SOURCES: DataSource[] = [
  { 
    id: 'time', 
    name: 'TimeSync (Attendance)', 
    icon: Clock, 
    status: 'Synced', 
    metrics: ['Employees: 325', 'OT: 450 hrs'], 
    actionLabel: 'Re-sync',
    records: 325,
    impact: 125000
  },
  { 
    id: 'leave', 
    name: 'LeaveEase (Leave)', 
    icon: CalendarX, 
    status: 'Synced', 
    metrics: ['Unpaid: 15 days', 'Encashments: 2'], 
    actionLabel: 'Re-sync',
    records: 17,
    impact: -45000
  },
  { 
    id: 'manual', 
    name: 'Manual Inputs', 
    icon: FileEdit, 
    status: 'Pending', 
    metrics: ['Bonuses: 5', 'Adjustments: 8'], 
    actionLabel: 'Review',
    records: 13,
    impact: 850000
  },
  { 
    id: 'loans', 
    name: 'Loan Management', 
    icon: HandCoins, 
    status: 'Ready', 
    metrics: ['45 loans active', 'EMIs: 580K'], 
    actionLabel: 'View',
    records: 45,
    impact: -580000
  },
  { 
    id: 'expenses', 
    name: 'Expense Claims', 
    icon: Receipt, 
    status: 'Ready', 
    metrics: ['12 claims', 'Total: 85K'], 
    actionLabel: 'View',
    records: 12,
    impact: 85000
  }
];

export const PayrollWizardStep2: React.FC<PayrollWizardStep2Props> = ({ onNext, onBack, onCancel }) => {
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const handleSync = (id: string) => {
    setSyncingId(id);
    setTimeout(() => setSyncingId(null), 1500);
  };

  const formatPKR = (val: number) => {
    const isNeg = val < 0;
    return `${isNeg ? '-' : ''}PKR ${Math.abs(val).toLocaleString()}`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Wizard Header & Steps */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-10">
          {STEPS.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center gap-2 group relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  step.id === 2 ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 
                  step.id < 2 ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-200 text-gray-400'
                }`}>
                  {step.id < 2 ? <Check size={18} /> : <span className="text-xs font-black">{step.id}</span>}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${
                  step.id === 2 ? 'text-primary' : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`flex-1 h-[2px] mx-4 mt-[-18px] ${step.id < 2 ? 'bg-green-500' : 'bg-gray-100'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
              <Database size={16} className="text-primary" /> Integrated Data Sources
            </h3>
            <button className="text-[10px] font-black text-primary hover:bg-primary/5 px-3 py-1.5 rounded-lg flex items-center gap-2 uppercase tracking-widest transition-all">
              <RefreshCw size={14} /> Refresh All Sources
            </button>
          </div>

          {/* Source Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SOURCES.map((source) => (
              <div key={source.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${
                    source.status === 'Pending' ? 'bg-orange-50 text-orange-500' : 'bg-primary/5 text-primary'
                  }`}>
                    <source.icon size={24} />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                      source.status === 'Synced' || source.status === 'Ready' 
                        ? 'bg-green-50 text-green-600 border-green-100' 
                        : 'bg-orange-50 text-orange-600 border-orange-100'
                    }`}>
                      {source.status === 'Synced' && <CheckCircle2 size={10} />}
                      {source.status === 'Pending' && <AlertTriangle size={10} />}
                      {source.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 mb-6">
                  <h4 className="text-sm font-bold text-gray-800">{source.name}</h4>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {source.metrics.map((m, i) => (
                      <span key={i} className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => handleSync(source.id)}
                  disabled={syncingId === source.id}
                  className="w-full py-2 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-primary border border-gray-100 rounded-lg group-hover:bg-primary group-hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {syncingId === source.id ? (
                    <RefreshCw size={12} className="animate-spin" />
                  ) : source.actionLabel === 'Re-sync' ? (
                    <RefreshCw size={12} />
                  ) : source.actionLabel === 'Review' ? (
                    <FileEdit size={12} />
                  ) : (
                    <ArrowRight size={12} />
                  )}
                  {syncingId === source.id ? 'Syncing...' : source.actionLabel}
                </button>
              </div>
            ))}
          </div>

          {/* Ingestion Summary Table */}
          <div className="space-y-4 pt-4">
             <h3 className="text-sm font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
              <BarChart3 size={16} className="text-primary" /> Ingestion Summary
            </h3>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <th className="px-6 py-4">Source System</th>
                    <th className="px-6 py-4 text-center">Records</th>
                    <th className="px-6 py-4 text-right">Net Impact (Est)</th>
                    <th className="px-6 py-4 text-center">Integrity Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {SOURCES.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <s.icon size={16} className="text-gray-400" />
                          <span className="font-bold text-gray-700">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-gray-600">
                        {s.records.toLocaleString()}
                      </td>
                      <td className={`px-6 py-4 text-right font-mono font-bold ${
                        s.impact > 0 ? 'text-green-600' : 'text-red-500'
                      }`}>
                        {formatPKR(s.impact)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                           <span className={`w-2 h-2 rounded-full ${
                             s.status === 'Synced' || s.status === 'Ready' ? 'bg-green-500' : 'bg-orange-500 animate-pulse'
                           }`} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-primary/5 font-black">
                  <tr>
                    <td className="px-6 py-4 text-primary uppercase text-[10px] tracking-widest">Total Integrated Impact</td>
                    <td className="px-6 py-4 text-center text-primary italic">All Active Employees</td>
                    <td className="px-6 py-4 text-right text-primary">
                      {formatPKR(SOURCES.reduce((acc, curr) => acc + curr.impact, 0))}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-4">
            <Info size={20} className="text-blue-500 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-xs text-blue-700 font-medium leading-relaxed uppercase tracking-tight">
                <strong>Data Cutoff Integrity:</strong> Values reflected above are locked as of {new Date().toLocaleDateString()}. Any sub-system updates after this moment will require a manual [Re-sync].
              </p>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="mt-10 pt-8 border-t flex items-center justify-between">
          <button 
            onClick={onBack}
            className="px-8 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <div className="flex gap-4">
            <button 
              onClick={onCancel}
              className="px-8 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button 
              disabled={SOURCES.some(s => s.status === 'Pending')}
              onClick={onNext}
              className="px-10 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Calculation <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
