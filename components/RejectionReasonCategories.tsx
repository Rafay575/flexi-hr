
import React, { useState } from 'react';
import { 
  Plus, MoreHorizontal, Edit3, Power, Trash2, X, 
  MessageSquare, Info, AlertCircle, CheckCircle2,
  Search, Filter, BarChart3
} from 'lucide-react';

interface RejectionReason {
  code: string;
  label: string;
  description: string;
  requiresComment: boolean;
  usageCount: number;
  isActive: boolean;
}

const DEFAULT_REASONS: RejectionReason[] = [
  { code: 'COVERAGE', label: 'Insufficient Coverage', description: 'Team attendance below required threshold.', requiresComment: true, usageCount: 142, isActive: true },
  { code: 'WORKLOAD', label: 'High Workload', description: 'Critical project deadlines or seasonal peak.', requiresComment: true, usageCount: 88, isActive: true },
  { code: 'NOTICE', label: 'Short Notice', description: 'Request does not meet advance notice policy.', requiresComment: false, usageCount: 65, isActive: true },
  { code: 'BALANCE', label: 'Insufficient Balance', description: 'Requested days exceed available quota.', requiresComment: false, usageCount: 34, isActive: true },
  { code: 'POLICY', label: 'Policy Restriction', description: 'Violation of specific HR leave policies.', requiresComment: true, usageCount: 12, isActive: true },
  { code: 'BLACKOUT', label: 'Blackout Period', description: 'Requested dates fall within a restricted window.', requiresComment: false, usageCount: 45, isActive: true },
  { code: 'DOCUMENT', label: 'Missing Documentation', description: 'Required proof (e.g. medical certificate) not provided.', requiresComment: true, usageCount: 22, isActive: true },
  { code: 'CONFLICT', label: 'Schedule Conflict', description: 'Conflicts with mandatory training or events.', requiresComment: true, usageCount: 18, isActive: true },
  { code: 'OTHER', label: 'Other Reason', description: 'Misc reasons requiring detailed explanation.', requiresComment: true, usageCount: 156, isActive: true },
];

export const RejectionReasonCategories = () => {
  const [reasons, setReasons] = useState<RejectionReason[]>(DEFAULT_REASONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReason, setEditingReason] = useState<RejectionReason | null>(null);

  const handleEdit = (reason: RejectionReason) => {
    setEditingReason(reason);
    setIsModalOpen(true);
  };

  const handleToggleActive = (code: string) => {
    setReasons(prev => prev.map(r => r.code === code ? { ...r, isActive: !r.isActive } : r));
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-[#3E3B6F]">Rejection Reasons</h2>
          <p className="text-gray-500 font-medium">Standardize feedback for rejected leave applications to ensure consistency.</p>
        </div>
        <button 
          onClick={() => { setEditingReason(null); setIsModalOpen(true); }}
          className="bg-[#3E3B6F] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#4A4680] shadow-lg shadow-[#3E3B6F]/20 transition-all active:scale-95"
        >
          <Plus size={18} /> Add Reason
        </button>
      </div>

      {/* Analytics Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="p-3 bg-indigo-50 text-[#3E3B6F] rounded-xl"><LayoutList size={24}/></div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Categories</p>
            <p className="text-2xl font-bold text-gray-900">{reasons.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 size={24}/></div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Reasons</p>
            <p className="text-2xl font-bold text-gray-900">{reasons.filter(r => r.isActive).length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl"><BarChart3 size={24}/></div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Top Reason</p>
            <p className="text-xl font-bold text-gray-900">Other Reason</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/30 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search reasons..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#3E3B6F]/10 transition-all"
            />
          </div>
          <button className="p-2.5 text-gray-400 hover:text-[#3E3B6F] transition-colors bg-white border border-gray-200 rounded-xl">
            <Filter size={20} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Code</th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reason Label</th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Requires Comment</th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Usage</th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reasons.map((r) => (
                <tr key={r.code} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <span className="font-mono text-xs font-bold text-[#3E3B6F] bg-indigo-50 px-2 py-1 rounded">
                      {r.code}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-gray-900">{r.label}</p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs text-gray-500 max-w-xs truncate" title={r.description}>{r.description}</p>
                  </td>
                  <td className="px-8 py-5 text-center">
                    {r.requiresComment ? (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded uppercase">
                        <MessageSquare size={10} /> Yes
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-gray-300 uppercase">No</span>
                    )}
                  </td>
                  <td className="px-8 py-5 text-center">
                    <p className="text-sm font-bold text-gray-700">{r.usageCount}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase">Times</p>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <button 
                      onClick={() => handleToggleActive(r.code)}
                      className={`w-10 h-5 rounded-full relative transition-colors ${r.isActive ? 'bg-emerald-500' : 'bg-gray-200'}`}
                    >
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${r.isActive ? 'left-6' : 'left-1'}`} />
                    </button>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => handleEdit(r)} className="p-2 text-gray-400 hover:text-[#3E3B6F] hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-gray-100 transition-all">
                        <Edit3 size={16} />
                      </button>
                      <button 
                        disabled={r.usageCount > 0}
                        className={`p-2 rounded-lg transition-all shadow-sm border border-transparent ${
                          r.usageCount > 0 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-red-500 hover:bg-white hover:border-gray-100'
                        }`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#3E3B6F]/40 backdrop-blur-sm animate-in fade-in" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-[40px] w-full max-w-[500px] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-white px-10 py-8 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-50 text-red-600 rounded-2xl"><AlertCircle size={24}/></div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{editingReason ? 'Edit Reason' : 'New Rejection Reason'}</h3>
                  <p className="text-xs text-gray-400 font-medium">Standardize the decline process.</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reason Code *</label>
                <input 
                  type="text" 
                  placeholder="e.g. BUDGET_CAP" 
                  className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#3E3B6F] outline-none transition-all font-mono font-bold"
                  defaultValue={editingReason?.code}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Display Label *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Budgetary Constraint" 
                  className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#3E3B6F] outline-none transition-all font-bold"
                  defaultValue={editingReason?.label}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Approver Guidance</label>
                <textarea 
                  rows={2} 
                  className="w-full p-4 bg-gray-50 rounded-2xl text-sm outline-none resize-none focus:ring-2 focus:ring-[#3E3B6F]/10" 
                  placeholder="Explain to approvers when to use this reason..."
                  defaultValue={editingReason?.description}
                />
              </div>

              <div className="space-y-4 pt-4">
                 <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div>
                      <p className="text-sm font-bold text-gray-800">Requires Comment?</p>
                      <p className="text-[10px] text-gray-400">Forces approvers to add custom notes.</p>
                    </div>
                    <button className={`w-10 h-5 rounded-full relative transition-colors ${editingReason?.requiresComment ? 'bg-[#3E3B6F]' : 'bg-gray-300'}`}>
                       <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${editingReason?.requiresComment ? 'left-6' : 'left-1'}`} />
                    </button>
                 </div>

                 <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div>
                      <p className="text-sm font-bold text-gray-800">Active Status</p>
                      <p className="text-[10px] text-gray-400">Make this reason available for use.</p>
                    </div>
                    <button className={`w-10 h-5 rounded-full relative transition-colors ${editingReason?.isActive !== false ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                       <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${editingReason?.isActive !== false ? 'left-6' : 'left-1'}`} />
                    </button>
                 </div>
              </div>
            </div>

            <div className="bg-gray-50 p-10 border-t border-gray-100 flex gap-4">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-white rounded-xl transition-all">Cancel</button>
              <button className="flex-[2] bg-[#3E3B6F] text-white py-3 rounded-xl font-bold shadow-xl shadow-[#3E3B6F]/20 hover:bg-[#4A4680] transition-all active:scale-95">
                {editingReason ? 'Update Category' : 'Save Reason Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const LayoutList = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);
