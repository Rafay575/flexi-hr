
import React, { useState } from 'react';
import { 
  ShieldCheck, CheckCircle2, XCircle, Eye, Sliders, 
  User, Database, ArrowRight, FileText, Download, 
  Info, Clock, X, CheckSquare, Search, Filter, 
  AlertTriangle, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

interface AdjustmentApproval {
  id: string;
  employee: string;
  avatar: string;
  dept: string;
  role: string;
  leaveType: string;
  adjType: 'Credit' | 'Debit';
  amount: number;
  currentBalance: number;
  reason: string;
  requestedBy: string;
  submittedAt: string;
  slaHours: number;
  justification: string;
  attachment?: string;
}

const MOCK_APPROVALS: AdjustmentApproval[] = [
  { 
    id: 'ADJ-AP-001', employee: 'Ahmed Khan', avatar: 'AK', dept: 'Engineering', role: 'Staff Engineer',
    leaveType: 'Annual Leave', adjType: 'Credit', amount: 6.0, currentBalance: 10,
    reason: 'Joining Bonus', requestedBy: 'Sarah Admin', submittedAt: '2h ago', slaHours: 22,
    justification: 'Contractual joining bonus specifically negotiated during hiring process for Senior Staff role.',
    attachment: 'offer_letter_annex_b.pdf'
  },
  { 
    id: 'ADJ-AP-002', employee: 'Sara Miller', avatar: 'SM', dept: 'Product', role: 'Product Manager',
    leaveType: 'Sick Leave', adjType: 'Credit', amount: 10.0, currentBalance: 2,
    reason: 'Exception Grant', requestedBy: 'John Manager', submittedAt: '5h ago', slaHours: 36,
    justification: 'Special medical grant approved by leadership due to prolonged recovery period following major surgery.',
    attachment: 'medical_cert_ext.pdf'
  },
  { 
    id: 'ADJ-AP-003', employee: 'Tom Chen', avatar: 'TC', dept: 'Engineering', role: 'DevOps Lead',
    leaveType: 'Annual Leave', adjType: 'Debit', amount: 8.0, currentBalance: 24,
    reason: 'Correction', requestedBy: 'Sarah Admin', submittedAt: '1d ago', slaHours: -4,
    justification: 'Correction of carry-forward error where 2023 balances were doubled in the migration script.',
    attachment: 'audit_report_migration.xlsx'
  }
];

export const AdjustmentApprovalPanel = () => {
  const [requests, setRequests] = useState(MOCK_APPROVALS);
  const [viewingRequest, setViewingRequest] = useState<AdjustmentApproval | null>(null);

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    setRequests(prev => prev.filter(r => r.id !== id));
    setViewingRequest(null);
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500 font-['League_Spartan']">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-[#3E3B6F] rounded-2xl shadow-sm">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#3E3B6F]">Adjustment Approvals</h2>
            <p className="text-gray-500 font-medium">Verify large-scale manual balance overrides (Enterprise Workflow).</p>
          </div>
        </div>
        <div className="bg-amber-50 px-6 py-3 rounded-2xl border border-amber-100 flex items-center gap-4">
          <div>
            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest leading-none mb-1">Awaiting Authorization</p>
            <p className="text-2xl font-bold text-amber-900 leading-none">{requests.length}</p>
          </div>
          <Clock className="text-amber-400" size={24} />
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Employee</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Leave Type</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] text-center">Amount</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] text-center">Impact</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Reason</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Requested By</th>
                <th className="px-8 py-5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-accent-peach flex items-center justify-center font-bold text-[#3E3B6F] text-xs">
                        {req.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{req.employee}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">{req.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-medium text-gray-700">{req.leaveType}</span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className={`inline-flex items-center gap-1 font-bold text-sm ${req.adjType === 'Credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {req.adjType === 'Credit' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {req.adjType === 'Credit' ? `+${req.amount}` : `-${req.amount}`}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="flex items-center justify-center gap-2 text-xs">
                      <span className="text-gray-400">{req.currentBalance}</span>
                      <ArrowRight size={12} className="text-gray-300" />
                      <span className="font-bold text-[#3E3B6F]">
                        {req.adjType === 'Credit' ? req.currentBalance + req.amount : Math.max(0, req.currentBalance - req.amount)}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg uppercase tracking-tighter">{req.reason}</span>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-medium text-gray-600">{req.requestedBy}</p>
                    <p className="text-[10px] text-gray-400">{req.submittedAt}</p>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => handleAction(req.id, 'approve')}
                        className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100"
                        title="Quick Approve"
                      >
                        <CheckCircle2 size={18} />
                      </button>
                      <button 
                        onClick={() => setViewingRequest(req)}
                        className="p-2 bg-gray-50 text-gray-400 hover:text-[#3E3B6F] hover:bg-white rounded-lg border border-transparent hover:border-gray-100"
                        title="Review Details"
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {requests.length === 0 && (
            <div className="py-24 text-center">
              <div className="w-16 h-16 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckSquare size={32} />
              </div>
              <p className="text-gray-400 font-medium italic">No pending adjustment authorizations.</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {viewingRequest && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#3E3B6F]/40 backdrop-blur-sm animate-in fade-in" onClick={() => setViewingRequest(null)} />
          <div className="relative bg-white rounded-[40px] w-full max-w-3xl max-h-[90vh] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col">
            <div className="bg-white px-10 py-8 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 text-[#3E3B6F] rounded-2xl">
                  <Sliders size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Adjustment Authorization</h3>
                  <p className="text-xs text-gray-400 font-medium tracking-tight">System Request: {viewingRequest.id}</p>
                </div>
              </div>
              <button onClick={() => setViewingRequest(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-modal-scroll">
              {/* Employee Header */}
              <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                <div className="w-16 h-16 rounded-2xl bg-accent-peach flex items-center justify-center text-[#3E3B6F] text-xl font-bold shadow-inner uppercase">
                  {viewingRequest.avatar}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-900">{viewingRequest.employee}</h4>
                  <p className="text-sm text-gray-500 font-medium">{viewingRequest.role} • {viewingRequest.dept}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Requested By</p>
                  <p className="text-sm font-bold text-indigo-600">{viewingRequest.requestedBy}</p>
                </div>
              </div>

              {/* Adjustment Details & Impact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                   <div className="space-y-1">
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Leave Type</p>
                     <p className="text-sm font-bold text-gray-800">{viewingRequest.leaveType}</p>
                   </div>
                   <div className="space-y-4">
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Impact Preview</p>
                     <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100 space-y-4">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-indigo-400 font-bold uppercase">Current Balance</span>
                          <span className="font-bold text-indigo-900">{viewingRequest.currentBalance} Days</span>
                        </div>
                        <div className={`flex justify-between items-center text-xs ${viewingRequest.adjType === 'Credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                          <span className="font-bold uppercase">Requested {viewingRequest.adjType}</span>
                          <span className="font-bold text-lg">{viewingRequest.adjType === 'Credit' ? '+' : '-'}{viewingRequest.amount} Days</span>
                        </div>
                        <div className="pt-2 border-t border-indigo-100 flex justify-between items-center">
                          <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider">New Balance</span>
                          <span className="text-2xl font-bold text-[#3E3B6F]">
                            {viewingRequest.adjType === 'Credit' ? viewingRequest.currentBalance + viewingRequest.amount : Math.max(0, viewingRequest.currentBalance - viewingRequest.amount)} Days
                          </span>
                        </div>
                     </div>
                   </div>
                </div>

                <div className="space-y-6">
                   <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">Authorization Info</h5>
                   <div className="space-y-4">
                      <div className="space-y-1">
                         <p className="text-[10px] font-bold text-gray-400 uppercase">Reason Category</p>
                         <span className="inline-block px-3 py-1 bg-[#3E3B6F] text-white text-[10px] font-bold uppercase rounded-lg tracking-widest">
                           {viewingRequest.reason}
                         </span>
                      </div>
                      <div className="space-y-1 text-red-500">
                         <p className="text-[10px] font-bold uppercase">Decision SLA</p>
                         <p className={`text-sm font-bold flex items-center gap-2 ${viewingRequest.slaHours < 0 ? 'text-red-600' : 'text-amber-600'}`}>
                           <Clock size={14} /> {viewingRequest.slaHours < 0 ? 'Exceeded' : `${viewingRequest.slaHours} hours remaining`}
                         </p>
                      </div>
                   </div>
                </div>
              </div>

              {/* Justification & Documents */}
              <div className="space-y-4">
                 <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Justification / Auditor Notes</h4>
                 <div className="bg-white p-6 rounded-3xl border border-gray-100 text-sm text-gray-600 font-medium leading-relaxed italic">
                    "{viewingRequest.justification}"
                 </div>
                 {viewingRequest.attachment && (
                    <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all group">
                       <div className="flex items-center gap-3">
                         <FileText className="text-indigo-400" size={20} />
                         <span className="text-xs font-bold text-gray-700 uppercase">{viewingRequest.attachment}</span>
                       </div>
                       <button className="p-2 text-gray-400 hover:text-[#3E3B6F] transition-colors">
                          <Download size={16} />
                       </button>
                    </div>
                 )}
              </div>

              {/* Auditor Comments for Decision */}
              <div className="space-y-4">
                 <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Decision Feedback (Optional)</h4>
                 <textarea 
                  className="w-full p-4 bg-gray-50 border border-transparent rounded-3xl focus:bg-white focus:border-[#3E3B6F] outline-none text-sm resize-none h-24"
                  placeholder="Provide comments for the HR Admin..."
                 />
              </div>

              <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-4">
                 <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
                 <p className="text-xs text-amber-800 leading-relaxed font-medium">
                   This adjustment exceeds the standard threshold of 5 days. Approving this will immediately update the <span className="font-bold underline text-[#3E3B6F]">Leave Ledger</span> and notify the employee of the override.
                 </p>
              </div>
            </div>

            <div className="bg-gray-50 px-10 py-8 border-t border-gray-100 flex gap-4 shrink-0">
                <button 
                  onClick={() => handleAction(viewingRequest.id, 'reject')}
                  className="flex-1 py-4 bg-white border border-red-100 text-red-600 rounded-2xl font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                >
                  <XCircle size={18} /> Reject
                </button>
                <button 
                  onClick={() => handleAction(viewingRequest.id, 'approve')}
                  className="flex-[2] bg-[#3E3B6F] text-white py-4 rounded-2xl font-bold shadow-xl shadow-[#3E3B6F]/20 hover:bg-[#4A4680] transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <CheckCircle2 size={18} /> Approve Adjustment
                </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          .custom-modal-scroll::-webkit-scrollbar { width: 4px; }
          .custom-modal-scroll::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
        `}
      </style>
    </div>
  );
};
