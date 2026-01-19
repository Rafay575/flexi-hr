
import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  User, 
  FileText, 
  ArrowRight, 
  History, 
  ShieldCheck, 
  DollarSign, 
  ExternalLink,
  MessageSquare,
  UserPlus,
  Send,
  Zap,
  Info,
  Calendar
} from 'lucide-react';

export type RequestType = 'REGULARIZATION' | 'OT' | 'SWAP';

interface ApprovalDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: RequestType;
  requestId: string;
}

export const ApprovalDetailModal: React.FC<ApprovalDetailModalProps> = ({ isOpen, onClose, type, requestId }) => {
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-[700px] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
              type === 'REGULARIZATION' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
              type === 'OT' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-purple-50 text-purple-600 border-purple-100'
            }`}>
              {type} • {requestId}
            </span>
            <div className="flex items-center gap-1.5 text-orange-600 bg-orange-50 px-2 py-0.5 rounded text-[10px] font-bold">
              <Clock size={12} /> 4h SLA left
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400"><X size={20}/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {/* EMPLOYEE PROFILE MINI */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary-gradient flex items-center justify-center text-white text-lg font-black shadow-lg">
              AK
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 leading-tight">Ahmed Khan</h3>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">FLX-2044 • Engineering Department</p>
            </div>
          </div>

          {type === 'REGULARIZATION' ? (
            <div className="space-y-8">
              {/* ISSUE DETAILS */}
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Request Context</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold"><span className="text-gray-500">Event Date:</span> <span>Jan 8, 2025</span></div>
                    <div className="flex justify-between text-xs font-bold"><span className="text-gray-500">Category:</span> <span className="text-blue-600">Missing Out Punch</span></div>
                    <div className="flex justify-between text-xs font-bold"><span className="text-gray-500">Orig Status:</span> <span className="text-red-500">Short Day (treated as Absent)</span></div>
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Submission</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold"><span className="text-gray-500">Sent On:</span> <span>Jan 9, 10:00 AM</span></div>
                    <div className="flex justify-between text-xs font-bold"><span className="text-gray-500">Attempt:</span> <span>1st Submission</span></div>
                  </div>
                </div>
              </div>

              {/* PROPOSED COMPARISON */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-[#3E3B6F] uppercase tracking-[0.2em] flex items-center gap-2">
                  <ArrowRight size={14} /> Proposed Correction
                </h4>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="grid grid-cols-3 bg-gray-50 text-[10px] font-black text-gray-400 uppercase p-3 border-b border-gray-100">
                    <div>Metric</div>
                    <div>Original (System)</div>
                    <div>Proposed (Employee)</div>
                  </div>
                  <div className="divide-y divide-gray-50">
                    <div className="grid grid-cols-3 p-4 text-xs font-bold">
                      <div className="text-gray-500">Punch In</div>
                      <div>9:00 AM</div>
                      <div className="text-blue-600">9:00 AM <span className="text-[10px] text-gray-300 font-medium">(No change)</span></div>
                    </div>
                    <div className="grid grid-cols-3 p-4 text-xs font-bold bg-blue-50/20">
                      <div className="text-gray-500">Punch Out</div>
                      <div className="text-red-500 italic">MISSING</div>
                      <div className="text-green-600">6:30 PM (proposed)</div>
                    </div>
                    <div className="grid grid-cols-3 p-4 text-xs font-bold">
                      <div className="text-gray-500">Total Hours</div>
                      <div>4h (approx)</div>
                      <div className="text-blue-600 underline">8h 30m</div>
                    </div>
                    <div className="grid grid-cols-3 p-4 text-xs font-bold">
                      <div className="text-gray-500">Final Status</div>
                      <div className="text-red-500">Short Day</div>
                      <div className="text-green-600">PRESENT ✓</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* EVIDENCE */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200/50">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Employee Statement</h4>
                <p className="text-sm text-gray-700 italic font-medium leading-relaxed">
                  "I forgot to punch out because I was pulled into an urgent client meeting that lasted until late evening. Verified by meeting invite attached."
                </p>
                <button className="mt-4 flex items-center gap-2 text-xs font-bold text-[#3E3B6F] hover:underline">
                  <FileText size={14} /> View Meeting Invite.pdf <ExternalLink size={10} />
                </button>
              </div>

              {/* VALIDATIONS */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Policy Validation</h4>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center gap-3 p-3 bg-green-50 text-green-700 rounded-xl border border-green-100 text-xs font-bold">
                    <CheckCircle2 size={16} /> Within regularization window (3 days)
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 text-green-700 rounded-xl border border-green-100 text-xs font-bold">
                    <CheckCircle2 size={16} /> Monthly limit not exceeded (2/5 used)
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 text-xs font-bold">
                    <ShieldCheck size={16} /> Proposed time matches WiFi activity log
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
               {/* OT DETAILS */}
               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Shift Data (Jan 9)</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold"><span className="text-gray-500">Rostered:</span> <span>9 AM - 6 PM</span></div>
                      <div className="flex justify-between text-xs font-bold"><span className="text-gray-500">Actual Out:</span> <span className="text-[#3E3B6F]">8:30 PM</span></div>
                      <div className="flex justify-between text-xs font-bold"><span className="text-gray-500">OT Claim:</span> <span className="text-green-600">2.5 Hours</span></div>
                    </div>
                  </div>
                  <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                    <h4 className="text-[10px] font-black text-[#3E3B6F] uppercase tracking-widest mb-3 flex items-center gap-2">
                      <DollarSign size={14} /> Financial Impact
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold"><span className="text-[#3E3B6F]/60">OT Rate:</span> <span>1.5x Hourly</span></div>
                      <div className="flex justify-between text-xs font-bold"><span className="text-[#3E3B6F]/60">Est. Cost:</span> <span className="text-green-600">PKR 1,875</span></div>
                    </div>
                  </div>
               </div>

               {/* OT VALIDATIONS */}
               <div className="space-y-3">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">System Check</h4>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center gap-3 p-3 bg-green-50 text-green-700 rounded-xl border border-green-100 text-xs font-bold">
                    <CheckCircle2 size={16} /> Employee is OT eligible (Grade 4)
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 text-green-700 rounded-xl border border-green-100 text-xs font-bold">
                    <CheckCircle2 size={16} /> Within daily cap (4h)
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 text-xs font-bold">
                    <Info size={16} /> Monthly budget utilization: 20/40h
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-orange-50 text-orange-700 rounded-xl border border-orange-100 text-xs font-bold">
                    <AlertTriangle size={16} /> Pre-approval was not obtained for this OT session
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200/50">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Claim Reason</h4>
                <p className="text-sm text-gray-700 italic font-medium leading-relaxed">
                  "Production server deployment ran longer than expected due to a database migration issue. Required immediate fix for market open."
                </p>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-4">
          {rejectMode ? (
            <div className="space-y-3 animate-in slide-in-from-bottom-2 duration-300">
              <label className="text-[10px] font-black text-red-500 uppercase tracking-widest px-2">Reason for Rejection (Required)</label>
              <textarea 
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Ex: Please provide clear documentation or proof of presence..."
                className="w-full bg-white border border-red-100 rounded-2xl p-4 text-sm focus:ring-4 focus:ring-red-500/5 focus:border-red-500 outline-none transition-all h-24"
              />
              <div className="flex gap-3">
                <button 
                  onClick={() => setRejectMode(false)}
                  className="flex-1 py-3 bg-white border border-gray-200 text-gray-500 rounded-2xl font-bold text-xs"
                >
                  Cancel
                </button>
                <button 
                  disabled={!rejectReason.trim()}
                  className="flex-[2] py-3 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-red-100 disabled:opacity-50"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button className="flex-[2] py-4 bg-green-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-green-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                <CheckCircle2 size={16} /> Approve Request
              </button>
              <button 
                onClick={() => setRejectMode(true)}
                className="flex-1 py-4 bg-white border border-gray-200 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-50 transition-all active:scale-95"
              >
                Reject
              </button>
              <div className="flex gap-2">
                <button className="p-4 bg-white border border-gray-200 text-gray-400 rounded-2xl hover:text-blue-500 hover:border-blue-200 transition-all" title="Request Info">
                  <MessageSquare size={18} />
                </button>
                <button className="p-4 bg-white border border-gray-200 text-gray-400 rounded-2xl hover:text-purple-500 hover:border-purple-200 transition-all" title="Delegate">
                  <UserPlus size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
