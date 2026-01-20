
import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle2, AlertCircle, Clock, TrendingUp, 
  TrendingDown, UserPlus, UserMinus, Zap, MessageSquare, 
  Download, List, BarChart3, ShieldCheck, ArrowRight,
  UserCheck, AlertTriangle
} from 'lucide-react';

interface PayrollApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  runId: string;
  onApprove: (comment: string) => void;
  onReject: (comment: string) => void;
  onRequestChanges: (comment: string) => void;
}

type ViewMode = 'SUMMARY' | 'EMPLOYEES' | 'VARIANCE';

export const PayrollApprovalModal: React.FC<PayrollApprovalModalProps> = ({ 
  isOpen, onClose, runId, onApprove, onReject, onRequestChanges 
}) => {
  const [view, setView] = useState<ViewMode>('SUMMARY');
  const [comment, setComment] = useState('');
  const [timeLeft, setTimeLeft] = useState(86400); // 24 hours SLA in seconds

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatSLA = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const formatPKR = (val: number) => `PKR ${(val / 1000000).toFixed(2)}M`;

  const checks = [
    { label: 'Exceptions Resolved', status: 'PASS', icon: CheckCircle2 },
    { label: 'Time & Leave Synced', status: 'PASS', icon: CheckCircle2 },
    { label: 'Variance Acceptable', status: 'PASS', icon: CheckCircle2 },
    { label: 'No Negative Payouts', status: 'PASS', icon: CheckCircle2 },
  ];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-[700px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        {/* SLA Header */}
        <div className="bg-primary text-white px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-accent animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">Approval SLA Remaining:</span>
            <span className="text-sm font-mono font-black text-accent">{formatSLA(timeLeft)}</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Header Summary */}
        <div className="p-6 border-b bg-gray-50/50 flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-gray-800 tracking-tight">Review Payroll Run</h3>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
              {runId} • January 2025 • <span className="text-primary">325 Employees</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase">Net Disbursement</p>
            <p className="text-2xl font-black text-primary">PKR 29.80M</p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex border-b px-4 bg-white">
          {[
            { id: 'SUMMARY', label: 'Summary', icon: BarChart3 },
            { id: 'EMPLOYEES', label: 'Employee List', icon: List },
            { id: 'VARIANCE', label: 'Variance', icon: Zap },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id as ViewMode)}
              className={`py-3 px-4 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all border-b-2 -mb-[1px] ${
                view === tab.id ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
          <button className="ml-auto p-3 text-gray-400 hover:text-primary"><Download size={16} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 max-h-[500px] custom-scrollbar">
          {view === 'SUMMARY' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Financial Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border rounded-xl p-4 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Gross Total</p>
                    <p className="text-lg font-black text-gray-800">{formatPKR(37000000)}</p>
                    <p className="text-[10px] text-red-500 font-bold mt-1 flex items-center gap-1">
                      <TrendingUp size={10} /> +4.2% vs Dec
                    </p>
                  </div>
                  <div className="p-2 bg-green-50 rounded-lg text-green-600"><TrendingUp size={20} /></div>
                </div>
                <div className="bg-white border rounded-xl p-4 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Total Tax (FBR)</p>
                    <p className="text-lg font-black text-gray-800">{formatPKR(3500000)}</p>
                    <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase italic">Annex-C Ready</p>
                  </div>
                  <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><ShieldCheck size={20} /></div>
                </div>
              </div>

              {/* Quick Checks */}
              <div className="grid grid-cols-2 gap-3">
                {checks.map((check, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-green-50 border border-green-100 rounded-lg">
                    <check.icon size={16} className="text-green-600" />
                    <span className="text-[11px] font-bold text-green-800">{check.label}</span>
                    <span className="ml-auto text-[9px] font-black text-green-600">✓</span>
                  </div>
                ))}
              </div>

              {/* Highlights */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Run Highlights</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
                    <UserPlus size={16} className="mx-auto text-blue-500 mb-1" />
                    <p className="text-xs font-black text-gray-800">13 Joiners</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
                    <UserMinus size={16} className="mx-auto text-orange-500 mb-1" />
                    <p className="text-xs font-black text-gray-800">02 Exits</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
                    <Zap size={16} className="mx-auto text-primary mb-1" />
                    <p className="text-xs font-black text-gray-800">08 Adjustments</p>
                  </div>
                </div>
              </div>

              {/* Submitter Notes */}
              <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl">
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                  <MessageSquare size={12} /> Notes from Submitter (Ahmed Raza)
                </p>
                <p className="text-xs text-primary/80 italic leading-relaxed">
                  "OT is high this month due to year-end factory maintenance window. All bank details verified. 2 profiles with high variance due to G18 increments."
                </p>
              </div>
            </div>
          )}

          {view === 'EMPLOYEES' && (
             <div className="animate-in fade-in duration-300 space-y-4">
                <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-gray-50 border-b font-black text-gray-400 uppercase">
                      <tr>
                        <th className="px-4 py-2">Employee</th>
                        <th className="px-4 py-2 text-right">Gross</th>
                        <th className="px-4 py-2 text-right">Net</th>
                        <th className="px-4 py-2 text-right">Delta</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {[1, 2, 3, 4, 5].map(i => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-2 font-bold text-gray-700">EMP-100{i} Sample Employee</td>
                          <td className="px-4 py-2 text-right">250,000</td>
                          <td className="px-4 py-2 text-right font-black text-primary">195,000</td>
                          <td className="px-4 py-2 text-right text-red-500 font-bold">+15k</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="p-6 border-t bg-gray-50 space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-500 flex items-center gap-2">
              <MessageSquare size={14} /> Reviewer Comment (Mandatory for rejection)
            </label>
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add your comments here..."
              className="w-full px-4 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-primary/10 outline-none h-20 resize-none"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <button 
              onClick={() => onReject(comment)}
              className="py-3 bg-white border border-red-200 text-red-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-50 transition-all shadow-sm"
            >
              Reject Run
            </button>
            <button 
              onClick={() => onRequestChanges(comment)}
              className="py-3 bg-white border border-orange-200 text-orange-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-50 transition-all shadow-sm"
            >
              Request Changes
            </button>
            <button 
              onClick={() => onApprove(comment)}
              className="py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 active:scale-95 transition-all"
            >
              <UserCheck size={16} /> Approve Cycle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
