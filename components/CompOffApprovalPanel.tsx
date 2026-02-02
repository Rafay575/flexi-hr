
import React, { useState } from 'react';
import { 
  CheckCircle2, XCircle, Clock, Zap, Link as LinkIcon, FileText, 
  AlertTriangle, Eye, CheckSquare, X, Info, Download, Search,
  ChevronRight, ArrowRight, User
} from 'lucide-react';

interface CompOffRequest {
  id: string;
  employee: string;
  avatar: string;
  dept: string;
  // Added missing role property to fix error on line 256
  role?: string;
  dateWorked: string;
  type: string;
  amount: string;
  evidence: { linked: boolean; attachment: boolean };
  submitted: string;
  slaHours: number;
  reason: string;
  timeSyncData?: {
    punchIn: string;
    punchOut: string;
    totalHours: string;
    isHoliday: boolean;
    holidayName?: string;
  };
}

const MOCK_PENDING_CO: CompOffRequest[] = [
  { 
    id: 'CO-REQ-001', employee: 'Ahmed Khan', avatar: 'AK', dept: 'Engineering', role: 'Software Engineer',
    dateWorked: 'Dec 25, 2024', type: 'Worked on Holiday', amount: '1.0 day',
    evidence: { linked: true, attachment: true }, submitted: '2h ago', slaHours: 18,
    reason: 'Completed urgent deployment for the Year-End Finance module fix.',
    timeSyncData: { punchIn: '09:00 AM', punchOut: '06:30 PM', totalHours: '9.5 hours', isHoliday: true, holidayName: 'Christmas Day' }
  },
  { 
    id: 'CO-REQ-002', employee: 'Sara Miller', avatar: 'SM', dept: 'Product', role: 'Product Manager',
    dateWorked: 'Jan 05, 2025', type: 'Worked on Weekend', amount: '1.0 day',
    evidence: { linked: true, attachment: false }, submitted: '5h ago', slaHours: 36,
    reason: 'Strategic planning session for Q1 roadmap.',
    timeSyncData: { punchIn: '10:00 AM', punchOut: '07:00 PM', totalHours: '9.0 hours', isHoliday: false }
  },
  { 
    id: 'CO-REQ-003', employee: 'Tom Chen', avatar: 'TC', dept: 'Engineering', role: 'Backend Dev',
    dateWorked: 'Jan 10, 2025', type: 'Approved Overtime', amount: '0.5 day',
    evidence: { linked: false, attachment: true }, submitted: '1d ago', slaHours: -2,
    reason: 'System migration support for core database.'
  },
  { 
    id: 'CO-REQ-004', employee: 'Anna Bell', avatar: 'AB', dept: 'Design', role: 'UI Designer',
    dateWorked: 'Jan 12, 2025', type: 'Extra Shift', amount: '1.0 day',
    evidence: { linked: false, attachment: false }, submitted: '3h ago', slaHours: 42,
    reason: 'Finalizing UI assets for the global rebranding.'
  }
];

export const CompOffApprovalPanel = () => {
  const [requests, setRequests] = useState(MOCK_PENDING_CO);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewingRequest, setViewingRequest] = useState<CompOffRequest | null>(null);
  const [isBulkConfirmOpen, setIsBulkConfirmOpen] = useState(false);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    setRequests(prev => prev.filter(r => r.id !== id));
    if (viewingRequest?.id === id) setViewingRequest(null);
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-[#3E3B6F] rounded-2xl">
            <Zap size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#3E3B6F]">Comp-Off Credit Approvals</h2>
            <p className="text-gray-500 font-medium">Verify extra work hours and award leave credits.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Today's Performance</p>
              <p className="text-sm font-bold text-emerald-600 flex items-center gap-1.5 justify-end">
                <CheckCircle2 size={14} /> 3 Approved Today
              </p>
           </div>
           <div className="h-10 w-px bg-gray-200" />
           <div className="bg-amber-50 px-4 py-2 rounded-xl border border-amber-100">
              <p className="text-[10px] font-bold text-amber-600 uppercase">Pending</p>
              <p className="text-lg font-bold text-amber-900">{requests.length}</p>
           </div>
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="bg-[#3E3B6F] p-4 rounded-2xl flex items-center justify-between animate-in slide-in-from-top-4 shadow-lg">
           <div className="flex items-center gap-4 pl-4 text-white">
             <span className="text-sm font-bold">{selectedIds.length} requests selected</span>
           </div>
           <div className="flex gap-3">
             <button 
               onClick={() => setIsBulkConfirmOpen(true)}
               className="bg-emerald-500 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-emerald-600 transition-all flex items-center gap-2"
             >
               <CheckSquare size={18} /> Bulk Approve
             </button>
             <button 
               onClick={() => setSelectedIds([])}
               className="bg-white/10 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-white/20 transition-all border border-white/10"
             >
               Cancel
             </button>
           </div>
        </div>
      )}

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 w-12 text-center">
                  <input 
                    type="checkbox" 
                    onChange={(e) => setSelectedIds(e.target.checked ? requests.map(r => r.id) : [])}
                    className="w-4 h-4 rounded border-gray-300 text-[#3E3B6F] focus:ring-[#3E3B6F]" 
                  />
                </th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Employee</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date Worked</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Evidence</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">SLA</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-8 py-5 text-center">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(req.id)}
                      onChange={() => toggleSelect(req.id)}
                      className="w-4 h-4 rounded border-gray-300 text-[#3E3B6F] focus:ring-[#3E3B6F]" 
                    />
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-accent-peach flex items-center justify-center font-bold text-[#3E3B6F] text-xs">
                        {req.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{req.employee}</p>
                        <p className="text-[10px] text-gray-400">{req.dept}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-gray-700">{req.dateWorked}</td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">{req.type}</span>
                  </td>
                  <td className="px-8 py-5 font-bold text-[#3E3B6F] text-sm">{req.amount}</td>
                  <td className="px-8 py-5">
                    <div className="flex gap-2">
                      {req.evidence.linked ? (
                        <span title="Linked to TimeSync"><LinkIcon size={16} className="text-emerald-500" /></span>
                      ) : null}
                      {req.evidence.attachment ? (
                        <span title="Attachment Provided"><FileText size={16} className="text-indigo-500" /></span>
                      ) : null}
                      {!req.evidence.linked && !req.evidence.attachment && (
                        <span className="flex items-center gap-1 text-[9px] font-bold text-red-500 uppercase">
                          <AlertTriangle size={12} /> No Evidence
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`text-[10px] font-bold flex items-center gap-1.5 ${req.slaHours < 0 ? 'text-red-500' : 'text-amber-600'}`}>
                      <Clock size={12} /> {req.slaHours < 0 ? 'Overdue' : `${req.slaHours}h`}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2  transition-all">
                      <button 
                        onClick={() => handleAction(req.id, 'approve')}
                        className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-all shadow-sm"
                      >
                        <CheckCircle2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleAction(req.id, 'reject')}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all shadow-sm"
                      >
                        <XCircle size={18} />
                      </button>
                      <button 
                        onClick={() => setViewingRequest(req)}
                        className="p-2 bg-gray-50 text-gray-400 hover:text-[#3E3B6F] hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-gray-100 transition-all"
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
                 <Zap size={32} />
               </div>
               <p className="text-gray-400 font-medium italic">No pending comp-off approvals.</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {viewingRequest && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#3E3B6F]/40 backdrop-blur-sm animate-in fade-in" onClick={() => setViewingRequest(null)} />
          <div className="relative bg-white rounded-[40px] w-full max-w-[550px] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
             <div className="bg-white px-10 py-8 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 text-[#3E3B6F] rounded-2xl">
                    <CheckSquare size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Credit Request Review</h3>
                    <p className="text-xs text-gray-400 font-medium tracking-tight">{viewingRequest.id}</p>
                  </div>
                </div>
                <button onClick={() => setViewingRequest(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                  <X size={24} />
                </button>
             </div>

             <div className="p-10 space-y-8">
                {/* Employee Header */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-12 h-12 rounded-xl bg-accent-peach flex items-center justify-center font-bold text-[#3E3B6F] text-lg uppercase shadow-sm">
                    {viewingRequest.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{viewingRequest.employee}</p>
                    <p className="text-xs text-gray-500 font-medium">{viewingRequest.role || 'Staff Member'} • {viewingRequest.dept}</p>
                  </div>
                </div>

                {/* Claim Details */}
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-1">
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date Worked</p>
                     <p className="text-sm font-bold text-gray-800">{viewingRequest.dateWorked}</p>
                     {viewingRequest.timeSyncData?.isHoliday && (
                       <span className="text-[9px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded uppercase">Public Holiday</span>
                     )}
                   </div>
                   <div className="space-y-1">
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Claim Amount</p>
                     <p className="text-lg font-bold text-[#3E3B6F]">{viewingRequest.amount}</p>
                   </div>
                   <div className="col-span-2 space-y-1">
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reason Provided</p>
                     <p className="text-sm text-gray-600 font-medium leading-relaxed italic">"{viewingRequest.reason}"</p>
                   </div>
                </div>

                {/* Evidence Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                    <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">TimeSync Evidence</h5>
                    {viewingRequest.timeSyncData ? (
                      <span className="text-[9px] font-bold text-emerald-500 uppercase flex items-center gap-1">
                        <CheckCircle2 size={10} /> Verified Record
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold text-red-500 uppercase flex items-center gap-1">
                        <AlertTriangle size={10} /> Not Linked
                      </span>
                    )}
                  </div>
                  
                  {viewingRequest.timeSyncData ? (
                    <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100 grid grid-cols-2 gap-y-4">
                       <div>
                         <p className="text-[10px] font-bold text-indigo-400 uppercase">Punch In</p>
                         <p className="text-sm font-bold text-indigo-900">{viewingRequest.timeSyncData.punchIn}</p>
                       </div>
                       <div>
                         <p className="text-[10px] font-bold text-indigo-400 uppercase">Punch Out</p>
                         <p className="text-sm font-bold text-indigo-900">{viewingRequest.timeSyncData.punchOut}</p>
                       </div>
                       <div className="col-span-2 pt-2 border-t border-indigo-100 flex items-center justify-between">
                         <span className="text-xs font-bold text-indigo-600">Total Valid Hours: {viewingRequest.timeSyncData.totalHours}</span>
                         {viewingRequest.timeSyncData.holidayName && (
                           <span className="text-[10px] font-medium text-indigo-400 italic">Target: {viewingRequest.timeSyncData.holidayName}</span>
                         )}
                       </div>
                    </div>
                  ) : (
                    <div className="p-6 bg-red-50 rounded-3xl border border-red-100 flex items-center gap-4">
                       <AlertTriangle className="text-red-500" size={24} />
                       <p className="text-xs text-red-800 font-medium">No system punch records found for this date. Manual evidence verification (email/ticket) is required.</p>
                    </div>
                  )}

                  {viewingRequest.evidence.attachment && (
                    <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all group">
                       <div className="flex items-center gap-3">
                         <FileText className="text-indigo-400" size={20} />
                         <span className="text-xs font-bold text-gray-700 uppercase">Evidence_Attachment.pdf</span>
                       </div>
                       <Download size={16} className="text-gray-300 group-hover:text-[#3E3B6F]" />
                    </button>
                  )}
                </div>

                {/* Outcome Preview */}
                <div className="bg-[#3E3B6F] p-6 rounded-[28px] text-white relative overflow-hidden">
                   <div className="relative z-10 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-bold text-white/50 uppercase mb-1">Impacted Credit</p>
                        <p className="text-xl font-bold">+ {viewingRequest.amount}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-white/50 uppercase mb-1">Expiry Rule</p>
                        <p className="text-sm font-bold text-[#E8D5A3]">90 Days (Mar 25, 2025)</p>
                      </div>
                   </div>
                   <Zap size={100} className="absolute -bottom-8 -right-8 opacity-5 -rotate-12" />
                </div>
             </div>

             <div className="bg-gray-50 px-10 py-8 border-t border-gray-100 flex gap-4">
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
                  <CheckCircle2 size={18} /> Approve Credit
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Bulk Confirm Modal */}
      {isBulkConfirmOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsBulkConfirmOpen(false)} />
           <div className="relative bg-white rounded-3xl p-8 max-sm w-full text-center space-y-6 shadow-2xl animate-in zoom-in duration-200">
             <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
               <CheckSquare size={32} />
             </div>
             <div>
               <h4 className="text-xl font-bold text-gray-900">Confirm Bulk Approval</h4>
               <p className="text-sm text-gray-500 mt-2">You are about to approve <span className="font-bold text-[#3E3B6F]">{selectedIds.length} credit requests</span>. This action will immediately update employee balances.</p>
             </div>
             <div className="flex gap-3">
               <button onClick={() => setIsBulkConfirmOpen(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-all border border-gray-100">Cancel</button>
               <button 
                onClick={() => {
                  setRequests(prev => prev.filter(r => !selectedIds.includes(r.id)));
                  setSelectedIds([]);
                  setIsBulkConfirmOpen(false);
                }}
                className="flex-1 py-3 bg-[#3E3B6F] text-white font-bold rounded-xl shadow-lg hover:bg-[#4A4680] transition-all"
               >
                 Confirm
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
