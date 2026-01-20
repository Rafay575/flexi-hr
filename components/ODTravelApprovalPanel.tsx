import React, { useState } from 'react';
import { 
  CheckCircle2, XCircle, Clock, AlertTriangle, Eye, 
  MapPin, Calendar, FileText, Download, X, Info,
  Plane, Briefcase, Globe, ShieldCheck, User,
  ArrowRight, CheckSquare, Search, Filter, ChevronRight
} from 'lucide-react';

interface ApprovalRequest {
  id: string;
  employee: string;
  avatar: string;
  dept: string;
  role: string;
  type: 'Official Duty' | 'Local Travel' | 'Inter-city Travel' | 'International Travel';
  startDate: string;
  endDate: string;
  destination: string;
  purpose: string;
  submitted: string;
  slaHours: number;
  itinerary?: { from: string; to: string; mode: string; date: string }[];
  passport?: { number: string; expiry: string; isValid: boolean };
  visa?: { status: string; type: string };
  conflicts: string[];
}

const MOCK_PENDING: ApprovalRequest[] = [
  {
    id: 'ODT-9001',
    employee: 'Ahmed Khan',
    avatar: 'AK',
    dept: 'Engineering',
    role: 'Senior Dev',
    type: 'International Travel',
    startDate: 'Mar 15, 2025',
    endDate: 'Mar 22, 2025',
    destination: 'Dubai, UAE',
    purpose: 'Tech Summit 2025 Speaker',
    submitted: '2h ago',
    slaHours: 18,
    itinerary: [
      { from: 'Karachi (KHI)', to: 'Dubai (DXB)', mode: 'Flight EK601', date: 'Mar 15' },
      { from: 'Dubai (DXB)', to: 'Karachi (KHI)', mode: 'Flight EK602', date: 'Mar 22' }
    ],
    passport: { number: 'PK882291', expiry: 'Dec 2028', isValid: true },
    visa: { status: 'Have Visa', type: 'Business' },
    conflicts: ['Overlaps with Q1 Sprint Planning']
  },
  {
    id: 'ODT-9002',
    employee: 'Sara Miller',
    avatar: 'SM',
    dept: 'Product',
    role: 'PM',
    type: 'Official Duty',
    startDate: 'Feb 18, 2025',
    endDate: 'Feb 18, 2025',
    destination: 'Local Client HQ',
    purpose: 'Quarterly Sync Meeting',
    submitted: '4h ago',
    slaHours: 42,
    conflicts: []
  },
  {
    id: 'ODT-9003',
    employee: 'Tom Chen',
    avatar: 'TC',
    dept: 'Operations',
    role: 'Lead',
    type: 'Inter-city Travel',
    startDate: 'Feb 25, 2025',
    endDate: 'Feb 27, 2025',
    destination: 'Lahore Branch',
    purpose: 'Site Audit',
    submitted: '1d ago',
    slaHours: -2,
    itinerary: [
      { from: 'Karachi', to: 'Lahore', mode: 'Business Train', date: 'Feb 25' },
      { from: 'Lahore', to: 'Karachi', mode: 'Business Train', date: 'Feb 27' }
    ],
    conflicts: ['Sarah Miller on Annual Leave']
  },
];

export const ODTravelApprovalPanel = () => {
  const [requests, setRequests] = useState(MOCK_PENDING);
  const [viewingRequest, setViewingRequest] = useState<ApprovalRequest | null>(null);

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    setRequests(prev => prev.filter(r => r.id !== id));
    setViewingRequest(null);
  };

  const getSlaColor = (hours: number) => {
    if (hours < 0) return 'text-red-500';
    if (hours < 24) return 'text-amber-500';
    return 'text-emerald-500';
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Official Duty': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'International Travel': return 'bg-purple-50 text-purple-600 border-purple-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500 font-['League_Spartan']">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-[#3E3B6F] rounded-2xl">
            <CheckSquare size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#3E3B6F]">OD/Travel Approvals</h2>
            <p className="text-gray-500 font-medium">Review and authorize out-of-office assignments.</p>
          </div>
        </div>
        <div className="bg-amber-50 px-6 py-3 rounded-2xl border border-amber-100 flex items-center gap-4">
          <div>
            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest leading-none mb-1">Pending Action</p>
            <p className="text-2xl font-bold text-amber-900 leading-none">{requests.length}</p>
          </div>
          <Clock className="text-amber-400" size={24} />
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Employee</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Type</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Dates</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Destination</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">SLA</th>
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
                        <p className="text-[10px] text-gray-400 uppercase font-bold">{req.dept}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase border ${getTypeBadge(req.type)}`}>
                      {req.type}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-700">{req.startDate}</span>
                      <span className="text-[10px] text-gray-400">to {req.endDate}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-gray-300" />
                      <span className="text-sm font-medium text-gray-600">{req.destination}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`text-[10px] font-bold flex items-center gap-1.5 ${getSlaColor(req.slaHours)}`}>
                      <Clock size={12} /> {req.slaHours < 0 ? 'OVERDUE' : `${req.slaHours}h`}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => handleAction(req.id, 'approve')}
                        className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100"
                        title="Approve"
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
              <p className="text-gray-400 font-medium italic">No pending OD/Travel approvals.</p>
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
                <div className={`p-3 rounded-2xl ${getTypeBadge(viewingRequest.type)}`}>
                  {viewingRequest.type === 'Official Duty' ? <Briefcase size={24}/> : <Plane size={24}/>}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Review Request: {viewingRequest.id}</h3>
                  <p className="text-xs text-gray-400 font-medium tracking-tight">Submitted {viewingRequest.submitted}</p>
                </div>
              </div>
              <button onClick={() => setViewingRequest(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-modal-scroll">
              {/* Employee Info Header */}
              <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                <div className="w-16 h-16 rounded-2xl bg-accent-peach flex items-center justify-center text-[#3E3B6F] text-xl font-bold shadow-inner">
                  {viewingRequest.avatar}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-900">{viewingRequest.employee}</h4>
                  <p className="text-sm text-gray-500 font-medium">{viewingRequest.role} • {viewingRequest.dept}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</p>
                  <p className="text-sm font-bold text-[#3E3B6F]">{viewingRequest.type}</p>
                </div>
              </div>

              {/* Core Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                   <div className="space-y-1">
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Travel Period</p>
                     <div className="flex items-center gap-4">
                       <span className="text-sm font-bold text-gray-800">{viewingRequest.startDate}</span>
                       <ArrowRight size={14} className="text-gray-300" />
                       <span className="text-sm font-bold text-gray-800">{viewingRequest.endDate}</span>
                     </div>
                   </div>
                   <div className="space-y-1">
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Destination</p>
                     <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                       <MapPin size={16} className="text-red-400" /> {viewingRequest.destination}
                     </p>
                   </div>
                   <div className="space-y-1">
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Purpose Details</p>
                     <p className="text-sm text-gray-600 font-medium leading-relaxed italic">"{viewingRequest.purpose}"</p>
                   </div>
                </div>

                <div className="space-y-6">
                   <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">Compliance Checks</h5>
                   <div className="space-y-3">
                      {viewingRequest.type === 'International Travel' && (
                        <>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500 font-medium flex items-center gap-2"><Globe size={14} /> Passport Validity</span>
                            <span className={`font-bold ${viewingRequest.passport?.isValid ? 'text-emerald-600' : 'text-red-500'}`}>
                              {viewingRequest.passport?.isValid ? 'VALID' : 'EXPIRED'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500 font-medium flex items-center gap-2"><FileText size={14} /> Visa Status</span>
                            <span className="font-bold text-emerald-600">{viewingRequest.visa?.status}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500 font-medium flex items-center gap-2"><Clock size={14} /> Advance Notice</span>
                            <span className="font-bold text-emerald-600">MET (14d+)</span>
                          </div>
                        </>
                      )}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 font-medium flex items-center gap-2"><AlertTriangle size={14} /> Coverage Conflict</span>
                        <span className={`font-bold ${viewingRequest.conflicts.length > 0 ? 'text-amber-500' : 'text-emerald-600'}`}>
                          {viewingRequest.conflicts.length > 0 ? `${viewingRequest.conflicts.length} ALERT` : 'NONE'}
                        </span>
                      </div>
                   </div>
                </div>
              </div>

              {/* Itinerary (Travel Only) */}
              {viewingRequest.itinerary && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Plane size={14} /> Full Itinerary
                  </h4>
                  <div className="space-y-3">
                    {viewingRequest.itinerary.map((leg, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 transition-all hover:bg-white hover:shadow-sm">
                        <div className="p-2 bg-white rounded-lg text-indigo-500 shadow-sm"><Plane size={16}/></div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-indigo-900">{leg.from} → {leg.to}</p>
                          <p className="text-[10px] text-indigo-600/70 font-medium">{leg.mode} • {leg.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TimeSync Impact Preview */}
              <div className="bg-[#3E3B6F] p-8 rounded-[32px] text-white relative overflow-hidden shadow-xl">
                 <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3">
                      <ShieldCheck size={20} className="text-[#E8D5A3]" />
                      <h4 className="font-bold text-sm uppercase tracking-widest">TimeSync Impact Preview</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                         <p className="text-[10px] text-white/50 font-bold uppercase mb-2">Attendance Sync</p>
                         <p className="text-xs font-medium leading-relaxed">
                           Jan 15-22 will be marked as <span className="text-[#E8D5A3] font-bold">OD/Travel</span>. Regular attendance rules and punch requirements will be bypassed for this period.
                         </p>
                       </div>
                       <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                         <p className="text-[10px] text-white/50 font-bold uppercase mb-2">Payroll & Leave</p>
                         <p className="text-xs font-medium leading-relaxed">
                            No balance deduction. Per diem advance of <span className="text-[#E8D5A3] font-bold">PKR 45,000</span> requested (Awaiting HQ Review).
                         </p>
                       </div>
                    </div>
                 </div>
                 <Clock size={200} className="absolute -bottom-12 -right-12 opacity-5 -rotate-12" />
              </div>

              {/* Approval Trail */}
              <div className="space-y-4">
                 <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Approval Chain</h4>
                 <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                       <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px]">1</div>
                       <span className="text-xs font-bold text-gray-700 uppercase">Self-Submission</span>
                    </div>
                    {/* Fixed Error: Added ChevronRight to imports above */}
                    <ChevronRight size={14} className="text-gray-300" />
                    <div className="flex items-center gap-2">
                       <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-[10px]">2</div>
                       <span className="text-xs font-bold text-gray-900 uppercase">Manager (You)</span>
                    </div>
                    {/* Fixed Error: Added ChevronRight to imports above */}
                    <ChevronRight size={14} className="text-gray-300" />
                    <div className="flex items-center gap-2 opacity-30">
                       <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center font-bold text-[10px]">3</div>
                       <span className="text-xs font-bold text-gray-700 uppercase">HR Operations</span>
                    </div>
                 </div>
              </div>
            </div>

            <div className="bg-gray-50 px-10 py-8 border-t border-gray-100 flex gap-4 shrink-0">
               <button 
                  onClick={() => handleAction(viewingRequest.id, 'reject')}
                  className="flex-1 py-4 bg-white border border-red-100 text-red-600 rounded-2xl font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                >
                  <XCircle size={18} /> Reject Request
                </button>
                <button 
                  onClick={() => handleAction(viewingRequest.id, 'approve')}
                  className="flex-[2] bg-[#3E3B6F] text-white py-4 rounded-2xl font-bold shadow-xl shadow-[#3E3B6F]/20 hover:bg-[#4A4680] transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <CheckCircle2 size={18} /> Approve & Sync
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