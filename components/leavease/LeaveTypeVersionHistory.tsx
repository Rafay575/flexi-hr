
import React, { useState } from 'react';
import { 
  X, History, CheckCircle2, ChevronRight, Eye, 
  RotateCcw, ArrowRightLeft, User, Calendar, 
  AlertTriangle, ArrowDown, ArrowUp
} from 'lucide-react';

interface Version {
  version: number;
  status: 'Current' | 'Archived' | 'Draft';
  publishedAt: string;
  publishedBy: string;
  effectiveFrom: string;
  changes: string[];
  config: Record<string, any>;
}

const MOCK_VERSIONS: Version[] = [
  {
    version: 3,
    status: 'Current',
    publishedAt: 'Jan 15, 2025',
    publishedBy: 'Sarah HR',
    effectiveFrom: 'Feb 1, 2025',
    changes: ['Quota changed: 12 → 14 days', 'Carry forward enabled'],
    config: { quota: 14, carryForward: true, unit: 'Days', notice: 3 }
  },
  {
    version: 2,
    status: 'Archived',
    publishedAt: 'Jan 1, 2024',
    publishedBy: 'Admin User',
    effectiveFrom: 'Jan 1, 2024',
    changes: ['Updated compliance rules', 'Added attachment threshold'],
    config: { quota: 12, carryForward: false, unit: 'Days', notice: 3 }
  },
  {
    version: 1,
    status: 'Archived',
    publishedAt: 'Dec 10, 2022',
    publishedBy: 'System Init',
    effectiveFrom: 'Jan 1, 2023',
    changes: ['Initial creation'],
    config: { quota: 10, carryForward: false, unit: 'Days', notice: 1 }
  }
];

export const LeaveTypeVersionHistory: React.FC<{ isOpen: boolean; onClose: () => void; typeName: string }> = ({ isOpen, onClose, typeName }) => {
  const [comparingVersions, setComparingVersions] = useState<[Version, Version] | null>(null);
  const [restoreTarget, setRestoreTarget] = useState<Version | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] overflow-hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-[450px] bg-[#F5F5F5] shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
        {/* Header */}
        <div className="p-8 bg-white border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-[#3E3B6F] rounded-2xl">
              <History size={24}/>
            </div>
            <div>
               <h3 className="text-xl font-bold text-gray-900">{typeName}</h3>
               <p className="text-xs font-bold text-gray-400 tracking-widest uppercase">Version History</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
            <X size={24} />
          </button>
        </div>

        {/* Timeline */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {MOCK_VERSIONS.map((v, idx) => (
            <div key={v.version} className="relative">
              {idx !== MOCK_VERSIONS.length - 1 && (
                <div className="absolute left-[23px] top-12 bottom-[-24px] w-0.5 bg-gray-200 border-dashed border-l" />
              )}
              
              <div className={`bg-white rounded-2xl border-2 p-6 transition-all shadow-sm ${v.status === 'Current' ? 'border-[#3E3B6F]' : 'border-transparent'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${v.status === 'Current' ? 'bg-[#3E3B6F] text-white' : 'bg-gray-100 text-gray-400'}`}>
                      v{v.version}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">Version {v.version}</span>
                        {v.status === 'Current' && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase">
                            <CheckCircle2 size={10} /> Current
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 font-medium">Published: {v.publishedAt} by {v.publishedBy}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    <Calendar size={12} /> Effective From: {v.effectiveFrom}
                  </div>
                  {v.changes.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-4 space-y-1.5">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Key Changes</p>
                      {v.changes.map((change, i) => (
                        <p key={i} className="text-xs text-gray-600 flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-[#3E3B6F]" /> {change}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-50">
                  <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-600 py-2 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1.5">
                    <Eye size={12} /> View Config
                  </button>
                  <button 
                    onClick={() => setComparingVersions([MOCK_VERSIONS[0], v])}
                    className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-600 py-2 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1.5"
                  >
                    <ArrowRightLeft size={12} /> Compare
                  </button>
                  {v.status !== 'Current' && (
                    <button 
                      onClick={() => setRestoreTarget(v)}
                      className="w-full bg-indigo-50 hover:bg-indigo-100 text-[#3E3B6F] py-2.5 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1.5 mt-2"
                    >
                      <RotateCcw size={14} /> Restore to this version
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compare Modal */}
      {comparingVersions && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setComparingVersions(null)} />
          <div className="relative bg-white rounded-[40px] w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in duration-200">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-600 text-white rounded-2xl">
                  <ArrowRightLeft size={24}/>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">Compare Configurations</h4>
                  <p className="text-sm text-gray-500 font-medium">v{comparingVersions[1].version} vs v{comparingVersions[0].version} (Current)</p>
                </div>
              </div>
              <button onClick={() => setComparingVersions(null)} className="p-2 hover:bg-white rounded-full text-gray-400">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10">
              <div className="grid grid-cols-3 gap-8">
                <div className="pt-12 space-y-10">
                  {Object.keys(comparingVersions[0].config).map(key => (
                    <div key={key} className="h-12 flex items-center text-sm font-bold text-gray-400 uppercase tracking-widest">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </div>
                  ))}
                </div>
                <div className="space-y-10">
                  <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">v{comparingVersions[1].version}</p>
                  {Object.entries(comparingVersions[1].config).map(([key, val]) => (
                    <div key={key} className="h-12 flex items-center justify-center p-4 bg-gray-50 rounded-2xl text-sm font-bold text-gray-500">
                      {String(val)}
                    </div>
                  ))}
                </div>
                <div className="space-y-10">
                  <p className="text-center text-[10px] font-bold text-[#3E3B6F] uppercase tracking-[0.2em] mb-4">v{comparingVersions[0].version}</p>
                  {Object.entries(comparingVersions[0].config).map(([key, val]) => {
                    const isChanged = val !== comparingVersions[1].config[key];
                    return (
                      <div key={key} className={`h-12 flex items-center justify-center p-4 rounded-2xl text-sm font-bold shadow-sm transition-all border ${
                        isChanged ? 'bg-amber-50 border-amber-200 text-amber-700 scale-105' : 'bg-white border-gray-100 text-[#3E3B6F]'
                      }`}>
                        {String(val)} {isChanged && <ArrowUp size={14} className="ml-2" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="p-8 bg-gray-50 border-t border-gray-100 text-center">
              <button onClick={() => setComparingVersions(null)} className="px-8 py-3 bg-[#3E3B6F] text-white font-bold rounded-2xl hover:bg-[#4A4680] transition-all shadow-xl shadow-[#3E3B6F]/20">
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restore Modal */}
      {restoreTarget && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setRestoreTarget(null)} />
          <div className="relative bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-200 p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <RotateCcw size={40} />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-gray-900">Restore v{restoreTarget.version}?</h4>
              <p className="text-sm text-gray-500 mt-2">This will create a new <span className="font-bold text-[#3E3B6F]">Draft v4</span> with the configuration from version {restoreTarget.version}.</p>
            </div>
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reason for Restoration *</label>
              <textarea 
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#3E3B6F]/20 resize-none"
                placeholder="Explain why you are reverting..."
                rows={3}
              />
            </div>
            <div className="flex gap-4 pt-2">
              <button onClick={() => setRestoreTarget(null)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-all">Cancel</button>
              <button className="flex-1 py-3 bg-[#3E3B6F] text-white font-bold rounded-xl hover:bg-[#4A4680] transition-all shadow-lg shadow-indigo-900/20">Confirm Restore</button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          .custom-modal-scroll::-webkit-scrollbar { width: 4px; }
          .custom-modal-scroll::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
        `}
      </style>
    </div>
  );
};
