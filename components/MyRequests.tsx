import React, { useState } from 'react';
import { 
  Search, Plus, Filter, MoreHorizontal, Eye, Edit3, Trash2, XCircle, 
  RotateCcw, ChevronRight, X, Clock, CheckCircle2, AlertCircle, FileText, Download,
  Calendar, User
} from 'lucide-react';
import { ApplyLeaveWizard } from './ApplyLeaveWizard';

// Types - Add these if you don't have them already
export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED'
}

export enum LeaveType {
  ANNUAL = 'Annual Leave',
  SICK = 'Sick Leave',
  CASUAL = 'Casual Leave',
  UNPAID = 'Unpaid Leave',
  COMP_OFF = 'Comp-Off',
  SHORT = 'Short Leave'
}

export interface LeaveRequest {
  id: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  reasonCategory: string;
  status: ApprovalStatus;
  appliedDate: string;
}

// Mock data
const REQUESTS_DATA: (LeaveRequest & { appliedOnFormatted: string; reasonCategory: string })[] = Array.from({ length: 15 }, (_, i) => ({
  id: `LV-2025-${1000 + i}`,
  type: [LeaveType.ANNUAL, LeaveType.SICK, LeaveType.CASUAL, LeaveType.UNPAID][i % 4] as LeaveType,
  startDate: '2025-02-10',
  endDate: '2025-02-12',
  days: i % 3 + 1,
  reason: i % 2 === 0 ? 'Annual family trip to the coast.' : 'Urgent personal matters at home.',
  reasonCategory: i % 2 === 0 ? 'Vacation' : 'Personal',
  status: [ApprovalStatus.APPROVED, ApprovalStatus.PENDING, ApprovalStatus.REJECTED, ApprovalStatus.CANCELLED][i % 4] as ApprovalStatus,
  appliedDate: '2025-01-10',
  appliedOnFormatted: i === 0 ? '2 days ago' : 'Jan 13, 2025',
}));

// Custom Icon Components
const CoffeeIcon = () => (
  <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8h18M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
  </svg>
);

const ZapIcon = () => (
  <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

// ApplyLeaveWizard Component
interface ApplyLeaveWizardProps {
  isOpen: boolean;
  onClose: () => void;
}


// Main MyRequests Component
export const MyRequests = () => {
  const [activeTab, setActiveTab] = useState<string>('All');
  const [selectedRequest, setSelectedRequest] = useState<typeof REQUESTS_DATA[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showWizard, setShowWizard] = useState(false);

  const tabs = ['All', 'Pending', 'Approved', 'Rejected', 'Cancelled'];

  const getStatusBadge = (status: ApprovalStatus) => {
    switch (status) {
      case ApprovalStatus.APPROVED:
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200"><CheckCircle2 size={12}/> Approved</span>;
      case ApprovalStatus.PENDING:
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-200"><Clock size={12}/> Pending</span>;
      case ApprovalStatus.REJECTED:
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 border border-red-200"><AlertCircle size={12}/> Rejected</span>;
      case ApprovalStatus.CANCELLED:
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 border border-gray-200"><XCircle size={12}/> Cancelled</span>;
      default:
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 border border-gray-200">Unknown</span>;
    }
  };

  const filteredRequests = REQUESTS_DATA.filter(r => {
    const matchesTab = activeTab === 'All' || 
      (activeTab === 'Pending' && r.status === ApprovalStatus.PENDING) ||
      (activeTab === 'Approved' && r.status === ApprovalStatus.APPROVED) ||
      (activeTab === 'Rejected' && r.status === ApprovalStatus.REJECTED) ||
      (activeTab === 'Cancelled' && r.status === ApprovalStatus.CANCELLED);
    
    const matchesSearch = r.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <>
      <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#3E3B6F]">My Leave Requests</h2>
            <p className="text-gray-500">Track and manage your leave application lifecycle.</p>
          </div>
          <button 
            onClick={() => setShowWizard(true)}
            className="bg-[#3E3B6F] text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-[#4A4680] shadow-lg shadow-[#3E3B6F]/20 transition-all"
          >
            <Plus size={18} /> Apply Leave
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-[#3E3B6F] rounded-lg"><FileText size={24}/></div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><Calendar size={24}/></div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Days Taken</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><Clock size={24}/></div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pending</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Tabs & Search */}
          <div className="px-6 py-4 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gray-50/50">
            <div className="flex gap-1 p-1 bg-gray-100 rounded-xl self-start">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === tab ? 'bg-white text-[#3E3B6F] shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search Request ID..." 
                className="bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm w-full lg:w-64 outline-none focus:ring-2 focus:ring-[#3E3B6F]/10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Request ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dates</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Duration</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Applied On</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRequests.map((r) => (
                  <tr 
                    key={r.id} 
                    className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                    onClick={() => setSelectedRequest(r)}
                  >
                    <td className="px-6 py-5 font-mono text-xs font-bold text-[#3E3B6F]">{r.id}</td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-gray-800">{r.type}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-medium text-gray-600">Feb 10 - Feb 12</span>
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-gray-700">{r.days} Days</td>
                    <td className="px-6 py-5">{getStatusBadge(r.status)}</td>
                    <td className="px-6 py-5 text-xs text-gray-400">{r.appliedOnFormatted}</td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        className="p-2 text-gray-400 hover:text-[#3E3B6F] rounded-lg hover:bg-white transition-all shadow-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle more actions here
                        }}
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredRequests.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                          <FileText size={32} />
                        </div>
                        <p className="text-gray-400 font-medium">No requests found matching your filters.</p>
                        <button onClick={() => setShowWizard(true)} className="text-[#3E3B6F] font-bold text-sm hover:underline">Apply for a leave now</button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Drawer */}
        {selectedRequest && (
          <div className="fixed inset-0 z-[70] overflow-hidden">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedRequest(null)} />
            <div className="absolute right-0 top-0 h-full w-full max-w-[450px] bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-[#3E3B6F]">{selectedRequest.id}</span>
                  {getStatusBadge(selectedRequest.status)}
                </div>
                <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <section className="space-y-4">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Request Details</h4>
                  <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Duration</p>
                      <p className="text-sm font-bold text-gray-800">{selectedRequest.days} Days</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Type</p>
                      <p className="text-sm font-bold text-[#3E3B6F]">{selectedRequest.type}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Dates</p>
                      <p className="text-sm font-bold text-gray-800">Feb 10, 2025 - Feb 12, 2025</p>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reason & Attachment</h4>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 font-medium leading-relaxed">
                      <span className="font-bold text-gray-800">{selectedRequest.reasonCategory}:</span> {selectedRequest.reason}
                    </p>
                    <button className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-[#3E3B6F] hover:bg-gray-100 transition-all">
                      <Download size={14} /> application_docs.pdf
                    </button>
                  </div>
                </section>

                <section className="space-y-4">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Approval Trail</h4>
                  <div className="relative pl-6 space-y-8 before:content-[''] before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                    <div className="relative">
                      <div className="absolute left-[-25px] top-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                      <p className="text-xs font-bold text-gray-800">Submitted</p>
                      <p className="text-[10px] text-gray-400">Jan 13, 2025 • 10:30 AM</p>
                    </div>
                    <div className="relative">
                      <div className="absolute left-[-25px] top-1.5 w-3 h-3 rounded-full bg-amber-500 border-2 border-white" />
                      <p className="text-xs font-bold text-gray-800">Manager Review</p>
                      <p className="text-[10px] text-gray-400 italic">Ahmed Khan is reviewing</p>
                    </div>
                    <div className="relative">
                      <div className="absolute left-[-25px] top-1.5 w-3 h-3 rounded-full bg-gray-200 border-2 border-white" />
                      <p className="text-xs font-bold text-gray-400">Decision Pending</p>
                    </div>
                  </div>
                </section>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50/50 grid grid-cols-2 gap-4">
                {selectedRequest.status === ApprovalStatus.PENDING && (
                  <>
                    <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all">
                      <Edit3 size={16} /> Modify
                    </button>
                    <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-all">
                      <XCircle size={16} /> Cancel
                    </button>
                  </>
                )}
                {selectedRequest.status === ApprovalStatus.REJECTED && (
                  <button className="col-span-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-sm font-bold hover:bg-[#4A4680] transition-all">
                    <RotateCcw size={16} /> Resubmit Request
                  </button>
                )}
                {selectedRequest.status === ApprovalStatus.APPROVED && (
                  <button className="col-span-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all">
                     Cancel Request
                  </button>
                )}
                {(selectedRequest.status === ApprovalStatus.CANCELLED) && (
                  <button className="col-span-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-400 rounded-xl text-sm font-bold cursor-not-allowed">
                    Request Finalized
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Apply Leave Wizard Modal */}
      <ApplyLeaveWizard
        isOpen={showWizard} 
        onClose={() => setShowWizard(false)} 
        onSubmit={()=>console.log("hello world")}
      />
    </>
  );
};