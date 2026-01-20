import React, { useState } from 'react';
import { 
  Calendar, Lock, Unlock, CheckCircle2, Clock, AlertTriangle, 
  ChevronRight, Info, ShieldAlert, FileText, Search, Filter, 
  ArrowRight, History, MoreHorizontal, Eye, X, XCircle
} from 'lucide-react';

interface PayrollPeriod {
  id: string;
  name: string;
  start: string;
  end: string;
  status: 'Open' | 'Locked' | 'Closed';
  lockedBy?: string;
  lockedAt?: string;
  pendingRequests: number;
  pendingAdjustments: number;
}

interface RetroRequest {
  id: string;
  employee: string;
  avatar: string;
  change: string;
  submitted: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const MOCK_PERIODS: PayrollPeriod[] = [
  { id: 'P25-01', name: 'January 2025', start: '2025-01-01', end: '2025-01-31', status: 'Open', pendingRequests: 5, pendingAdjustments: 2 },
  { id: 'P24-12', name: 'December 2024', start: '2024-12-01', end: '2024-12-31', status: 'Locked', lockedBy: 'Sarah Admin', lockedAt: 'Jan 05, 2025', pendingRequests: 0, pendingAdjustments: 0 },
  { id: 'P24-11', name: 'November 2024', start: '2024-11-01', end: '2024-11-30', status: 'Closed', lockedBy: 'System', lockedAt: 'Dec 05, 2024', pendingRequests: 0, pendingAdjustments: 0 },
  { id: 'P24-10', name: 'October 2024', start: '2024-10-01', end: '2024-10-31', status: 'Closed', lockedBy: 'Sarah Admin', lockedAt: 'Nov 03, 2024', pendingRequests: 0, pendingAdjustments: 0 },
  { id: 'P24-09', name: 'September 2024', start: '2024-09-01', end: '2024-09-30', status: 'Closed', lockedBy: 'Sarah Admin', lockedAt: 'Oct 04, 2024', pendingRequests: 0, pendingAdjustments: 0 },
];

const MOCK_RETRO: RetroRequest[] = [
  { id: 'RET-001', employee: 'Ahmed Khan', avatar: 'AK', change: 'Annual Leave correction (Jan 12)', submitted: '2h ago', status: 'Pending' },
  { id: 'RET-002', employee: 'Sara Miller', avatar: 'SM', change: 'Sick Leave conversion to Paid', submitted: '1d ago', status: 'Pending' },
];

export const PayrollPeriodsList = () => {
  const [periods, setPeriods] = useState<PayrollPeriod[]>(MOCK_PERIODS);
  const [lockingPeriod, setLockingPeriod] = useState<PayrollPeriod | null>(null);
  const [unlockingPeriod, setUnlockingPeriod] = useState<PayrollPeriod | null>(null);
  const [lockConfirmed, setLockConfirmed] = useState(false);
  const [unlockReason, setUnlockReason] = useState('');

  const currentPeriod = periods.find(p => p.status === 'Open');

  const handleLock = () => {
    if (lockingPeriod) {
      setPeriods(periods.map(p => p.id === lockingPeriod.id ? { ...p, status: 'Locked', lockedBy: 'John Manager', lockedAt: 'Just now' } : p));
      setLockingPeriod(null);
      setLockConfirmed(false);
    }
  };

  const handleUnlock = () => {
    if (unlockingPeriod) {
      setPeriods(periods.map(p => p.id === unlockingPeriod.id ? { ...p, status: 'Open', lockedBy: undefined, lockedAt: undefined } : p));
      setUnlockingPeriod(null);
      setUnlockReason('');
    }
  };

  const getStatusBadge = (status: PayrollPeriod['status']) => {
    switch (status) {
      case 'Open': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Locked': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Closed': return 'bg-gray-100 text-gray-500 border-gray-200';
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500 font-['League_Spartan']">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h2 className="text-3xl font-bold text-[#3E3B6F]">Payroll Periods</h2>
      </div>

      {currentPeriod && (
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl overflow-hidden animate-in slide-in-from-top-4 duration-500">
          <div className="p-8 lg:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-3xl font-bold text-gray-900">{currentPeriod.name}</h3>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100 flex items-center gap-1.5 animate-pulse">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" /> Open
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 font-medium">
                <Clock size={16} className="text-indigo-400" />
                <span>Auto-lock: <span className="font-bold text-gray-800">Feb 5, 2025</span> (in 27 days)</span>
              </div>
              <div className="space-y-2 pt-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pending before lock</p>
                <ul className="space-y-1.5">
                  <li className="flex items-center gap-2 text-sm font-medium text-amber-600">
                    <AlertTriangle size={14} /> {currentPeriod.pendingRequests} leave requests awaiting approval
                  </li>
                  <li className="flex items-center gap-2 text-sm font-medium text-amber-600">
                    <AlertTriangle size={14} /> {currentPeriod.pendingAdjustments} adjustments pending
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <button 
                onClick={() => setLockingPeriod(currentPeriod)}
                className="bg-[#3E3B6F] text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-[#4A4680] transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Lock size={18} /> Lock Period Now
              </button>
              <button className="bg-gray-50 text-gray-600 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all border border-gray-100">
                View Period Summary
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Periods Table */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Period</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Start / End</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Locked By</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Locked At</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {periods.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-8 py-5 font-bold text-gray-900">{p.name}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                      <span>{p.start}</span>
                      <ArrowRight size={12} className="text-gray-300" />
                      <span>{p.end}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-gray-600">{p.lockedBy || '-'}</td>
                  <td className="px-8 py-5 text-xs text-gray-400">{p.lockedAt || '-'}</td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      {p.status === 'Open' ? (
                        <button onClick={() => setLockingPeriod(p)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg" title="Lock">
                          <Lock size={18} />
                        </button>
                      ) : p.status === 'Locked' ? (
                        <button onClick={() => setUnlockingPeriod(p)} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg" title="Unlock (Enterprise)">
                          <Unlock size={18} />
                        </button>
                      ) : null}
                      <button className="p-2 text-gray-400 hover:text-[#3E3B6F] rounded-lg" title="View Summary">
                        <Eye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Retro Queue (Enterprise) */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-[#3E3B6F] rounded-2xl shadow-sm">
              <History size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900">Retroactive Adjustment Queue</h3>
                <span className="bg-[#3E3B6F] text-[#E8D5A3] px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest">Enterprise</span>
              </div>
              <p className="text-xs text-gray-400 font-medium">Changes requested for already locked payroll periods.</p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Request</th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Employee</th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Change Detail</th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Submitted</th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_RETRO.map(r => (
                <tr key={r.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-8 py-5">
                    <span className="font-mono text-xs font-bold text-indigo-600">{r.id}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent-peach flex items-center justify-center font-bold text-[#3E3B6F] text-[10px]">{r.avatar}</div>
                      <span className="text-sm font-bold text-gray-800">{r.employee}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs text-gray-600 font-medium leading-relaxed">{r.change}</p>
                  </td>
                  <td className="px-8 py-5 text-xs text-gray-400 font-medium">{r.submitted}</td>
                  <td className="px-8 py-5 text-center">
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded uppercase border border-amber-100">
                      {r.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                       <button className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg"><CheckCircle2 size={16}/></button>
                       {/* Added missing XCircle import */}
                       <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><XCircle size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lock Modal */}
      {lockingPeriod && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setLockingPeriod(null)} />
          <div className="relative bg-white rounded-[40px] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-300 p-10 space-y-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-indigo-50 text-[#3E3B6F] rounded-full flex items-center justify-center mx-auto">
                <Lock size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Lock {lockingPeriod.name}?</h3>
                <p className="text-gray-400 text-sm mt-2">Preventing any further leave data changes for this period.</p>
              </div>
            </div>

            <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 space-y-3">
              <p className="text-xs font-bold text-amber-900 uppercase flex items-center gap-2">
                <AlertTriangle size={16} /> Pending Items Warning
              </p>
              <ul className="text-xs text-amber-800/80 space-y-1 font-medium">
                <li>• {lockingPeriod.pendingRequests} leave requests will remain pending</li>
                <li>• {lockingPeriod.pendingAdjustments} adjustments will be skipped</li>
              </ul>
            </div>

            <label className="flex items-start gap-4 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={lockConfirmed} 
                onChange={(e) => setLockConfirmed(e.target.checked)}
                className="w-6 h-6 rounded border-gray-300 text-[#3E3B6F] focus:ring-[#3E3B6F] mt-1" 
              />
              <span className="text-sm text-gray-600 font-medium leading-relaxed group-hover:text-gray-900 transition-colors">
                I understand that locking will prevent any changes to leave data for this period and confirm it is ready for final payroll processing.
              </span>
            </label>

            <div className="flex gap-4">
              <button onClick={() => setLockingPeriod(null)} className="flex-1 py-4 text-gray-500 font-bold bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all">Cancel</button>
              <button 
                onClick={handleLock}
                disabled={!lockConfirmed}
                className="flex-[2] bg-[#3E3B6F] text-white py-4 rounded-2xl font-bold shadow-2xl shadow-[#3E3B6F]/20 hover:bg-[#4A4680] transition-all disabled:opacity-50 active:scale-95"
              >
                Lock Period
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unlock Modal (Enterprise) */}
      {unlockingPeriod && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setUnlockingPeriod(null)} />
          <div className="relative bg-white rounded-[40px] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 p-10 space-y-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                <Unlock size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Unlock {unlockingPeriod.name}?</h3>
                <p className="text-[#3E3B6F] text-xs font-bold uppercase tracking-widest mt-2">Enterprise Audit Required</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reason for Unlocking *</label>
              <textarea 
                className="w-full p-4 bg-gray-50 border border-transparent rounded-3xl focus:bg-white focus:ring-2 focus:ring-amber-500/10 outline-none text-sm resize-none h-32"
                placeholder="This will create an immutable audit entry and enable retroactive requests for this period..."
                value={unlockReason}
                onChange={(e) => setUnlockReason(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <button onClick={() => setUnlockingPeriod(null)} className="flex-1 py-4 text-gray-500 font-bold bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all">Cancel</button>
              <button 
                onClick={handleUnlock}
                disabled={!unlockReason.trim()}
                className="flex-[2] bg-amber-600 text-white py-4 rounded-2xl font-bold shadow-2xl shadow-amber-600/20 hover:bg-amber-700 transition-all disabled:opacity-50 active:scale-95"
              >
                Unlock Period
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
