import React, { useState, useMemo } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Calendar, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  ArrowRight, 
  ShieldCheck, 
  Info, 
  AlertTriangle,
  User,
  MoreVertical,
  X,
  ExternalLink,
  MessageSquare,
  UserPlus,
  Zap,
  Check
} from 'lucide-react';

type RegularizationStatus = 'PENDING_MY_ACTION' | 'ALL_PENDING' | 'APPROVED' | 'REJECTED';
type RegularizationIssue = 'MISSING_IN' | 'MISSING_OUT' | 'WRONG_TIME' | 'DEVICE_FAILURE' | 'LOCATION_ISSUE';

interface RegularizationRequest {
  id: string;
  employee: string;
  avatar: string;
  date: string;
  issue: RegularizationIssue;
  proposed: string;
  evidence: string;
  slaHours: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  original: {
    in: string;
    out: string;
    status: string;
    hours: string;
  };
  after: {
    in: string;
    out: string;
    status: string;
    hours: string;
  };
  validations: {
    window: boolean;
    limit: boolean;
    evidence: boolean;
  };
}

const ISSUE_LABELS: Record<RegularizationIssue, string> = {
  MISSING_IN: 'Missing In Punch',
  MISSING_OUT: 'Missing Out Punch',
  WRONG_TIME: 'Wrong Time Entry',
  DEVICE_FAILURE: 'Device Failure',
  LOCATION_ISSUE: 'Location Issue',
};

const MOCK_REQUESTS: RegularizationRequest[] = Array.from({ length: 25 }).map((_, i) => ({
  id: `REG-${8000 + i}`,
  employee: ['Sarah Chen', 'James Wilson', 'Ahmed Khan', 'Priya Das', 'Elena Frost', 'Marcus Low'][i % 6],
  avatar: ['SC', 'JW', 'AK', 'PD', 'EF', 'ML'][i % 6],
  date: `Jan ${15 - (i % 5)}, 2025`,
  issue: (['MISSING_OUT', 'MISSING_IN', 'WRONG_TIME', 'DEVICE_FAILURE', 'LOCATION_ISSUE'] as RegularizationIssue[])[i % 5],
  proposed: i % 5 === 0 ? 'Out: 06:30 PM' : 'In: 09:00 AM',
  evidence: i % 3 === 0 ? 'Medical Certificate.pdf' : 'System Logs.txt',
  slaHours: Math.floor(Math.random() * 24) + 2,
  status: 'PENDING',
  original: {
    in: '09:00 AM',
    out: i % 5 === 0 ? 'Missing' : '05:30 PM',
    status: i % 5 === 0 ? 'Missing Out' : 'Early Departure',
    hours: '--',
  },
  after: {
    in: '09:00 AM',
    out: '06:30 PM',
    status: 'Present',
    hours: '8h 30m',
  },
  validations: {
    window: true,
    limit: i % 7 !== 0,
    evidence: true,
  },
}));

export const RegularizationPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<RegularizationStatus>('PENDING_MY_ACTION');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<RegularizationRequest | null>(null);

  const filteredRequests = useMemo(() => {
    return MOCK_REQUESTS.filter(req => {
      const matchesSearch = req.employee.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           req.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <History className="text-[#3E3B6F]" size={28} /> Regularization Requests
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Review and approve attendance correction requests</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            <button className="px-4 py-2 text-xs font-bold text-gray-600 flex items-center gap-2 hover:bg-gray-50 rounded-lg">
              <Filter size={14} /> Type
            </button>
            <button className="px-4 py-2 text-xs font-bold text-gray-600 flex items-center gap-2 border-l border-gray-100 hover:bg-gray-50 rounded-lg">
              <Calendar size={14} /> Range
            </button>
          </div>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3E3B6F]" size={16} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium w-48 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5 transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="bg-white border border-gray-200 rounded-2xl p-1 flex items-center gap-1 overflow-x-auto no-scrollbar shadow-sm">
        {[
          { id: 'PENDING_MY_ACTION', label: 'Pending My Action' },
          { id: 'ALL_PENDING', label: 'All Pending' },
          { id: 'APPROVED', label: 'Approved' },
          { id: 'REJECTED', label: 'Rejected' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as RegularizationStatus)}
            className={`px-6 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#3E3B6F] text-white shadow-lg' 
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* REQUEST QUEUE */}
        <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
              <Clock size={16} className="text-[#3E3B6F]" /> Request Queue
            </h3>
            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 uppercase tracking-widest">
              {filteredRequests.length} Requests
            </span>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/30">
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4 text-center">Date</th>
                  <th className="px-6 py-4">Issue</th>
                  <th className="px-6 py-4">Proposed</th>
                  <th className="px-6 py-4">SLA</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredRequests.map((req) => (
                  <tr 
                    key={req.id} 
                    onClick={() => setSelectedRequest(req)}
                    className={`group hover:bg-gray-50/80 transition-all cursor-pointer ${selectedRequest?.id === req.id ? 'bg-[#3E3B6F]/5' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary-gradient flex items-center justify-center text-white text-[11px] font-black shadow-lg shadow-[#3E3B6F]/10">
                          {req.avatar}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-800 truncate">{req.employee}</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">{req.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-[11px] font-bold text-gray-500 tabular-nums">
                      {req.date}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-gray-700">{ISSUE_LABELS[req.issue]}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[11px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 tabular-nums">
                        {req.proposed}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${
                        req.slaHours < 5 ? 'text-red-600 bg-red-50 border-red-100' : 'text-gray-400 bg-gray-100 border-gray-200'
                      }`}>
                        <Clock size={10} /> {req.slaHours}h
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1  transition-all">
                        <button className="p-2 text-gray-400 hover:text-[#3E3B6F] hover:bg-white rounded-lg transition-all shadow-none hover:shadow-sm">
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* DETAIL PANEL */}
        <div className="space-y-6">
          {selectedRequest ? (
            <div className="bg-white rounded-3xl border border-gray-200 shadow-md overflow-hidden animate-in slide-in-from-right-4 duration-500">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck size={18} className="text-green-500" /> Approval Detail
                </h3>
                <button onClick={() => setSelectedRequest(null)} className="p-1 hover:bg-gray-200 rounded-full text-gray-400"><X size={16}/></button>
              </div>

              <div className="p-6 space-y-6">
                {/* BEFORE AFTER TABLE */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="grid grid-cols-2 text-[10px] font-black text-gray-400 uppercase tracking-widest p-3 bg-gray-50 border-b border-gray-100">
                    <div>Original Record</div>
                    <div className="flex items-center gap-2 text-[#3E3B6F]">
                      <Zap size={10} fill="currentColor" /> After Approval
                    </div>
                  </div>
                  <div className="divide-y divide-gray-100">
                    <div className="grid grid-cols-2 p-4 text-[11px] font-bold">
                      <div className="space-y-1">
                        <span className="text-gray-400 uppercase text-[9px] block">In</span>
                        <span className="text-gray-800">{selectedRequest.original.in}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-gray-400 uppercase text-[9px] block">In</span>
                        <span className="text-indigo-600 font-black">{selectedRequest.after.in}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 p-4 text-[11px] font-bold bg-indigo-50/20">
                      <div className="space-y-1">
                        <span className="text-gray-400 uppercase text-[9px] block">Out</span>
                        <span className="text-red-500 italic">{selectedRequest.original.out}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-gray-400 uppercase text-[9px] block">Out</span>
                        <span className="text-green-600 font-black">{selectedRequest.after.out}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 p-4 text-[11px] font-bold">
                      <div className="space-y-1">
                        <span className="text-gray-400 uppercase text-[9px] block">Status</span>
                        <span className="text-orange-500">{selectedRequest.original.status}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-gray-400 uppercase text-[9px] block">Status</span>
                        <span className="text-green-600 font-black flex items-center gap-1">
                          {selectedRequest.after.status} <CheckCircle2 size={10} />
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 p-4 text-[11px] font-bold">
                      <div className="space-y-1">
                        <span className="text-gray-400 uppercase text-[9px] block">Work Hours</span>
                        <span className="text-gray-400">{selectedRequest.original.hours}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-gray-400 uppercase text-[9px] block">Work Hours</span>
                        <span className="text-[#3E3B6F] font-black">{selectedRequest.after.hours}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* POLICY VALIDATION */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Policy Validation</h4>
                  <div className="space-y-2">
                    {[
                      { id: 'window', label: 'Within regularization window', value: selectedRequest.validations.window },
                      { id: 'limit', label: 'Monthly limit not exceeded', value: selectedRequest.validations.limit },
                      { id: 'evidence', label: 'Evidence provided', value: selectedRequest.validations.evidence },
                    ].map(v => (
                      <div key={v.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50">
                        <span className="text-[11px] font-medium text-gray-600">{v.label}</span>
                        {v.value ? (
                          <CheckCircle2 size={14} className="text-green-500" />
                        ) : (
                          <AlertTriangle size={14} className="text-red-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* WORKFLOW */}
                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl space-y-3">
                  <h4 className="text-[10px] font-black text-indigo-700 uppercase tracking-widest flex items-center gap-2">
                    <ArrowRight size={14} /> Approval Workflow
                  </h4>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 flex flex-col gap-1">
                      <p className="text-[11px] font-bold text-gray-800">Current Step</p>
                      <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 bg-white px-2 py-1 rounded-lg shadow-sm border border-indigo-100 w-fit">
                        MANAGER REVIEW
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col gap-1 border-l border-indigo-200 pl-4">
                      <p className="text-[11px] font-bold text-gray-400">Next Stage</p>
                      <div className="text-[10px] font-bold text-gray-400">HR AUTHORIZATION</div>
                    </div>
                  </div>
                </div>

                {/* EVIDENCE LINK */}
                <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl group cursor-pointer hover:border-[#3E3B6F]/20 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <FileText size={16} className="text-[#3E3B6F]" />
                    </div>
                    <span className="text-xs font-bold text-gray-700 truncate max-w-[140px]">{selectedRequest.evidence}</span>
                  </div>
                  <ExternalLink size={14} className="text-gray-300 group-hover:text-[#3E3B6F] transition-colors" />
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col gap-3">
                  <div className="flex gap-3">
                    <button className="flex-[2] py-4 bg-green-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-green-900/10 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                      <CheckCircle2 size={16} /> Approve
                    </button>
                    <button className="flex-1 py-4 bg-white border border-red-100 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-50 transition-all flex items-center justify-center">
                      Reject
                    </button>
                  </div>
                  <button className="w-full py-3 bg-gray-50 text-gray-500 border border-gray-200 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                    <MessageSquare size={14} /> Request More Info
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center flex flex-col items-center justify-center space-y-6 opacity-40">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                <FileCheck size={40} className="text-gray-300" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-black text-gray-800 uppercase tracking-widest">No Selection</h4>
                <p className="text-xs font-medium text-gray-500 max-w-[200px]">Select a request from the queue to view details and take action.</p>
              </div>
            </div>
          )}

          {/* POLICY NOTE */}
          <div className="p-6 bg-[#E8D5A3]/10 border border-[#E8D5A3]/30 rounded-3xl flex gap-4 shadow-sm">
            <div className="bg-white p-2.5 rounded-xl shadow-sm h-fit shrink-0">
               <Info className="text-[#3E3B6F]" size={20} />
            </div>
            <div className="flex-1">
               <p className="text-[10px] font-black text-[#3E3B6F] uppercase tracking-widest mb-1">Approval Tip</p>
               <p className="text-[10px] text-gray-600 leading-relaxed font-medium">
                 Always verify the <span className="font-bold">Proposed Comparison</span> against the employee provided evidence before final authorization.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FileCheck: React.FC<{ size: number, className: string }> = ({ size, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/>
  </svg>
);
