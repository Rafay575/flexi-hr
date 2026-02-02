
import React, { useState } from 'react';
import { 
  CheckCircle2, XCircle, DollarSign, Wallet, Calculator, 
  User, Clock, ShieldCheck, AlertTriangle, Eye, 
  ChevronRight, ArrowRight, Download, X, Info,
  CreditCard, Send, CheckSquare
} from 'lucide-react';

interface EncashmentApprovalRequest {
  id: string;
  employee: string;
  avatar: string;
  dept: string;
  type: string;
  days: number;
  rate: number;
  amount: number;
  currentBalance: number;
  submitted: string;
  slaHours: number;
  payGrade: string;
}

const MOCK_PENDING_ENCASHMENTS: EncashmentApprovalRequest[] = [
  { id: 'ENC-4001', employee: 'Ahmed Khan', avatar: 'AK', dept: 'Engineering', type: 'Annual Leave', days: 5, rate: 5000, amount: 25000, currentBalance: 14, submitted: '2h ago', slaHours: 18, payGrade: 'L3' },
  { id: 'ENC-4002', employee: 'Sara Miller', avatar: 'SM', dept: 'Product', type: 'Annual Leave', days: 10, rate: 6500, amount: 65000, currentBalance: 22, submitted: '5h ago', slaHours: 42, payGrade: 'M1' },
  { id: 'ENC-4003', employee: 'Tom Chen', avatar: 'TC', dept: 'Engineering', type: 'Comp-Off', days: 2, rate: 4800, amount: 9600, currentBalance: 3, submitted: '1d ago', slaHours: -2, payGrade: 'L2' },
  { id: 'ENC-4004', employee: 'Anna Bell', avatar: 'AB', dept: 'Design', type: 'Annual Leave', days: 4, amount: 20000, rate: 5000, currentBalance: 12, submitted: '3h ago', slaHours: 36, payGrade: 'L3' },
];

export const EncashmentApprovalPanel = () => {
  const [requests, setRequests] = useState(MOCK_PENDING_ENCASHMENTS);
  const [viewingRequest, setViewingRequest] = useState<EncashmentApprovalRequest | null>(null);
  const [isBulkApproving, setIsBulkApproving] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    setRequests(prev => prev.filter(r => r.id !== id));
    setViewingRequest(null);
  };

  const totalValue = requests.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shadow-sm">
            <DollarSign size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#3E3B6F]">Encashment Approvals</h2>
            <p className="text-gray-500 font-medium">Verify and authorize leave balance liquidation requests.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pending</p>
              <p className="text-xl font-bold text-amber-600">{requests.length}</p>
           </div>
           <div className="bg-[#3E3B6F] px-6 py-3 rounded-2xl shadow-lg shadow-[#3E3B6F]/20 text-white text-center min-w-[180px]">
              <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Total Value</p>
              <p className="text-xl font-bold text-[#E8D5A3]">PKR {totalValue.toLocaleString()}</p>
           </div>
        </div>
      </div>

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
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Days</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Balance After</th>
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
                        <p className="text-[10px] text-gray-400 uppercase font-bold">{req.dept} • {req.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">{req.type}</span>
                  </td>
                  <td className="px-8 py-5 text-center font-bold text-gray-700">{req.days} d</td>
                  <td className="px-8 py-5">
                    <div>
                      <p className="text-sm font-bold text-emerald-600 font-mono">PKR {req.amount.toLocaleString()}</p>
                      <p className="text-[10px] text-gray-400">@ PKR {req.rate.toLocaleString()}/d</p>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="flex flex-col items-center">
                       <span className="text-xs font-bold text-[#3E3B6F]">{req.currentBalance - req.days} d</span>
                       <span className="text-[9px] text-gray-400 uppercase">of {req.currentBalance} d</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`text-[10px] font-bold flex items-center gap-1.5 ${req.slaHours < 0 ? 'text-red-500 animate-pulse' : 'text-amber-600'}`}>
                      <Clock size={12} /> {req.slaHours < 0 ? 'OVERDUE' : `${req.slaHours}h`}
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
                        onClick={() => setViewingRequest(req)}
                        className="p-2 bg-gray-50 text-gray-400 hover:text-[#3E3B6F] hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-gray-100"
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
                 <Wallet size={32} />
               </div>
               <p className="text-gray-400 font-medium italic">No pending encashment approvals.</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {viewingRequest && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#3E3B6F]/40 backdrop-blur-sm animate-in fade-in" onClick={() => setViewingRequest(null)} />
          <div className="relative bg-white rounded-[40px] w-full max-w-[600px] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
             <div className="bg-white px-10 py-8 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                    <Calculator size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Encashment Review</h3>
                    <p className="text-xs text-gray-400 font-medium tracking-tight">Request ID: {viewingRequest.id}</p>
                  </div>
                </div>
                <button onClick={() => setViewingRequest(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                  <X size={24} />
                </button>
             </div>

             <div className="p-10 space-y-8">
                {/* Employee Section */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-14 h-14 rounded-xl bg-accent-peach flex items-center justify-center font-bold text-[#3E3B6F] text-xl shadow-inner">
                    {viewingRequest.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">{viewingRequest.employee}</p>
                    <p className="text-xs text-gray-500 font-medium">{viewingRequest.payGrade} • {viewingRequest.dept}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 bg-indigo-50 text-[#3E3B6F] text-[9px] font-bold uppercase rounded border border-indigo-100">Payroll Grade Linked</span>
                  </div>
                </div>

                {/* Calculation Breakdown */}
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-4">
                     <div className="space-y-1">
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Leave Type</p>
                       <p className="text-sm font-bold text-gray-800">{viewingRequest.type}</p>
                     </div>
                     <div className="space-y-1">
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Balance</p>
                       <p className="text-sm font-bold text-gray-800">{viewingRequest.currentBalance} Days</p>
                     </div>
                   </div>
                   <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100 space-y-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-indigo-400 font-bold uppercase">Requested</span>
                        <span className="font-bold text-indigo-900">{viewingRequest.days} Days</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-indigo-400 font-bold uppercase">Rate/Day</span>
                        <span className="font-bold text-indigo-900">PKR {viewingRequest.rate.toLocaleString()}</span>
                      </div>
                      <div className="pt-2 border-t border-indigo-100 flex justify-between items-center">
                        <span className="text-sm font-bold text-indigo-600">Total Payout</span>
                        <span className="text-lg font-bold text-[#3E3B6F]">PKR {viewingRequest.amount.toLocaleString()}</span>
                      </div>
                   </div>
                </div>

                {/* Compliance Checklist */}
                <div className="space-y-4">
                   <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">Policy Validation</h5>
                   <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                         <div className="flex items-center gap-2">
                           <ShieldCheck size={16} className="text-emerald-500" />
                           <span className="text-gray-600 font-medium">Eligible Pay Grade</span>
                         </div>
                         <span className="text-emerald-600 font-bold uppercase text-[9px]">Verified</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                         <div className="flex items-center gap-2">
                           <CheckCircle2 size={16} className="text-emerald-500" />
                           <span className="text-gray-600 font-medium">Min. Balance Retained (9 &gt; 5)</span>
                         </div>
                         <span className="text-emerald-600 font-bold uppercase text-[9px]">Pass</span>
                      </div>
                   </div>
                </div>

                {/* PayEdge Mapping */}
                <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-4">
                   <Info className="text-blue-500 shrink-0 mt-0.5" size={18} />
                   <div>
                      <p className="text-xs font-bold text-blue-900 mb-1 uppercase tracking-tight">PayEdge Integration</p>
                      <p className="text-xs text-blue-800 leading-relaxed font-medium">
                        Approval will create an auto-earning entry under head <span className="font-bold underline text-[#3E3B6F]">04-LEAVE-ENCASH</span> for the next payroll run.
                      </p>
                   </div>
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
                  <CheckCircle2 size={18} /> Confirm Approval
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
