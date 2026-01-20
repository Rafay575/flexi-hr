
import React, { useState } from 'react';
import { 
  X, Lock, Unlock, ShieldAlert, CheckCircle2, 
  AlertTriangle, ArrowRight, FileText, History, 
  UserCheck, Upload, ChevronDown, Info
} from 'lucide-react';

interface PeriodLockUnlockProps {
  isOpen: boolean;
  onClose: () => void;
  periodName: string;
  isLocking: boolean; // true for locking, false for unlocking
  onComplete: () => void;
}

export const PeriodLockUnlock: React.FC<PeriodLockUnlockProps> = ({ 
  isOpen, onClose, periodName, isLocking, onComplete 
}) => {
  const [reason, setReason] = useState('');
  const [justification, setJustification] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const prerequisites = [
    { label: 'Payroll Runs Published', status: 'PASS', icon: CheckCircle2 },
    { label: 'Pending Approvals Resolved', status: 'PASS', icon: CheckCircle2 },
    { label: 'Critical Exceptions Cleared', status: 'WARN', icon: AlertTriangle, detail: '2 Non-critical warnings' },
  ];

  const handleAction = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onComplete();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-primary/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className={`px-6 py-5 border-b flex items-center justify-between ${isLocking ? 'bg-orange-50/50' : 'bg-green-50/50'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isLocking ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
              {isLocking ? <Lock size={20} /> : <Unlock size={20} />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {isLocking ? 'Lock Payroll Period' : 'Unlock Payroll Period'}
              </h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{periodName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full text-gray-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar max-h-[75vh]">
          {isLocking ? (
            <div className="space-y-6">
              <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl flex gap-4">
                <ShieldAlert className="text-orange-500 shrink-0" size={24} />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-orange-900">Final Confirmation Required</h4>
                  <p className="text-xs text-orange-700 leading-relaxed">
                    Locking a period stops all data entry and calculation modifications. This action is audited and typically precedes bank disbursement.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Prerequisite Compliance Check</h5>
                <div className="grid grid-cols-1 gap-3">
                  {prerequisites.map((p, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl transition-all hover:border-gray-200">
                      <div className="flex items-center gap-3">
                        <p className="text-xs font-bold text-gray-700">{p.label}</p>
                        {p.detail && <span className="text-[9px] font-black text-orange-500 bg-orange-100 px-1.5 py-0.5 rounded uppercase tracking-tighter">{p.detail}</span>}
                      </div>
                      <p.icon size={18} className={p.status === 'PASS' ? 'text-green-500' : 'text-orange-500'} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-bottom-2">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Justification Category</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold outline-none cursor-pointer focus:ring-2 focus:ring-primary/10 transition-all"
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                  >
                    <option value="">Select Reason...</option>
                    <option value="ERR">Calculation Error Detected</option>
                    <option value="ATT">Late Attendance Submission</option>
                    <option value="STAT">Statutory Slab Adjustment</option>
                    <option value="OFF">Off-cycle Disbursement</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Supporting Evidence</label>
                  <button className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-400 hover:bg-gray-100 transition-all">
                    <span className="flex items-center gap-2"><Upload size={16}/> Upload PDF</span>
                    <Info size={14} className="text-gray-300" />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Detailed Justification (Min 50 Chars)</label>
                  <span className={`text-[10px] font-black ${reason.length < 50 ? 'text-red-400' : 'text-green-500'}`}>
                    {reason.length}/50
                  </span>
                </div>
                <textarea 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary/10 outline-none h-32 resize-none"
                  placeholder="Explain why this period needs to be unlocked after it was already finalized..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <UserCheck size={14}/> Required Approval Chain
                </h5>
                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <div className="flex items-center gap-2 px-3 py-2 bg-primary/5 text-primary rounded-lg border border-primary/10">HR Manager</div>
                  <ArrowRight size={14} />
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">Finance Head</div>
                  <ArrowRight size={14} />
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">Internal Audit</div>
                </div>
              </div>
            </div>
          )}

          {/* History Section (Visible in both modes) */}
          <div className="pt-6 border-t border-dashed">
            <button className="flex items-center justify-between w-full group">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <History size={14} /> Period Governance History
              </h5>
              <ChevronDown size={14} className="text-gray-300 group-hover:text-primary transition-colors" />
            </button>
            <div className="mt-4 overflow-hidden rounded-xl border border-gray-100">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-gray-50 border-b font-black uppercase text-gray-400 tracking-tighter">
                  <tr>
                    <th className="px-4 py-2">Action</th>
                    <th className="px-4 py-2">Officer</th>
                    <th className="px-4 py-2">Timestamp</th>
                    <th className="px-4 py-2">Justification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <tr>
                    <td className="px-4 py-2 font-bold text-orange-600">LOCKED</td>
                    <td className="px-4 py-2">Ahmed Raza</td>
                    <td className="px-4 py-2">Dec 31, 10:45 AM</td>
                    <td className="px-4 py-2 text-gray-400 italic">Month-end finalization</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
            {isLocking ? 'Verification passed' : 'Approval workflow required'}
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button 
              disabled={!isLocking && (reason.length < 50 || !justification) || isVerifying}
              onClick={handleAction}
              className={`px-8 py-2.5 rounded-lg text-sm font-bold shadow-lg transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                isLocking 
                ? 'bg-orange-600 text-white shadow-orange-500/20 hover:bg-orange-700' 
                : 'bg-primary text-white shadow-primary/20 hover:bg-primary/90'
              }`}
            >
              {isVerifying ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isLocking ? (
                <Lock size={18} />
              ) : (
                <FileText size={18} />
              )}
              {isVerifying ? 'Processing...' : isLocking ? 'Confirm Lock' : 'Request Unlock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
