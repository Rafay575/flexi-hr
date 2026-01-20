
import React, { useState } from 'react';
import { 
  CheckCircle2, XCircle, Clock, AlertTriangle, Users, 
  LayoutGrid, Table as TableIcon, Filter, ArrowUpDown, 
  ChevronRight, MessageSquare, Calendar, ShieldAlert,
  Search, CheckSquare, X
} from 'lucide-react';
import { LeaveType, LeaveStatus } from '../types';

interface PendingRequest {
  id: string;
  employeeName: string;
  avatar: string;
  dept: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  slaHours: number;
  coverage: number;
  conflicts: number;
  reason: string;
}

const MOCK_PENDING: PendingRequest[] = [
  { id: 'LV-4401', employeeName: 'Ahmed Khan', avatar: 'AK', dept: 'Engineering', type: LeaveType.ANNUAL, startDate: 'Jan 15, 2025', endDate: 'Jan 17, 2025', days: 3, slaHours: 18, coverage: 75, conflicts: 0, reason: 'Family trip' },
  { id: 'LV-4402', employeeName: 'Sarah Miller', avatar: 'SM', dept: 'Product', type: LeaveType.CASUAL, startDate: 'Jan 20, 2025', endDate: 'Jan 20, 2025', days: 1, slaHours: 42, coverage: 90, conflicts: 0, reason: 'Personal work' },
  { id: 'LV-4403', employeeName: 'Tom Chen', avatar: 'TC', dept: 'Engineering', type: LeaveType.SICK, startDate: 'Jan 14, 2025', endDate: 'Jan 14, 2025', days: 1, slaHours: -2, coverage: 60, conflicts: 2, reason: 'Fever' },
  { id: 'LV-4404', employeeName: 'Anna Bell', avatar: 'AB', dept: 'Design', type: LeaveType.ANNUAL, startDate: 'Jan 25, 2025', endDate: 'Feb 02, 2025', days: 7, slaHours: 72, coverage: 85, conflicts: 1, reason: 'Wedding' },
  { id: 'LV-4405', employeeName: 'Zoya Malik', avatar: 'ZM', dept: 'Engineering', type: LeaveType.CASUAL, startDate: 'Jan 18, 2025', endDate: 'Jan 18, 2025', days: 1, slaHours: 12, coverage: 50, conflicts: 3, reason: 'Emergency' },
];

export const PendingApprovals = () => {
  const [view, setView] = useState<'cards' | 'table'>('cards');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [rejectingRequest, setRejectingRequest] = useState<PendingRequest | null>(null);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const getSlaInfo = (hours: number) => {
    if (hours < 0) return { color: 'text-red-500', bg: 'bg-red-50', label: 'Overdue', icon: <AlertTriangle size={14} /> };
    if (hours < 24) return { color: 'text-amber-500', bg: 'bg-amber-50', label: `${hours}h left`, icon: <Clock size={14} /> };
    return { color: 'text-emerald-500', bg: 'bg-emerald-50', label: `${hours}h left`, icon: <CheckCircle2 size={14} /> };
  };

  const RequestCard = ({ req }: { req: PendingRequest }) => {
    const sla = getSlaInfo(req.slaHours);
    const isSelected = selectedIds.includes(req.id);

    return (
      <div className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden group ${isSelected ? 'border-[#3E3B6F] ring-2 ring-[#3E3B6F]/10' : 'border-gray-100 shadow-sm hover:shadow-md'}`}>
        <div className="p-5 space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-accent-peach flex items-center justify-center font-bold text-[#3E3B6F] text-sm">
                  {req.avatar}
                </div>
                <input 
                  type="checkbox" 
                  checked={isSelected}
                  onChange={() => toggleSelect(req.id)}
                  className="absolute -top-1 -left-1 w-4 h-4 rounded border-gray-300 text-[#3E3B6F] focus:ring-[#3E3B6F]"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 leading-none">{req.employeeName}</p>
                <p className="text-[10px] text-gray-400 font-medium mt-1">{req.dept} • {req.id}</p>
              </div>
            </div>
            <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${sla.bg} ${sla.color}`}>
              {sla.icon} {sla.label}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{req.type}</span>
              <span className="text-xs font-bold text-[#3E3B6F]">{req.days} Days</span>
            </div>
            <p className="text-sm font-bold text-gray-700">{req.startDate} - {req.endDate}</p>
          </div>

          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400 px-1">
             <div className="flex items-center gap-1.5">
               <Users size={14} className={req.coverage < 60 ? 'text-red-500' : 'text-gray-400'} />
               <span className={req.coverage < 60 ? 'text-red-500' : ''}>Coverage: {req.coverage}%</span>
             </div>
             {req.conflicts > 0 && (
               <div className="flex items-center gap-1 text-red-500">
                 <ShieldAlert size={14} /> {req.conflicts} Conflict{req.conflicts > 1 ? 's' : ''}
               </div>
             )}
          </div>
        </div>

        <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-100 grid grid-cols-2 gap-3">
          <button className="bg-[#3E3B6F] text-white py-2 rounded-lg text-xs font-bold hover:bg-[#4A4680] transition-all shadow-lg shadow-[#3E3B6F]/10">
            Approve
          </button>
          <button 
            onClick={() => setRejectingRequest(req)}
            className="bg-white border border-gray-200 text-gray-600 py-2 rounded-lg text-xs font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all"
          >
            Reject
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-[#3E3B6F]">Pending Approvals</h2>
          <p className="text-gray-500">Review and manage leave requests from your team.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-gray-200 rounded-lg p-1">
            <button 
              onClick={() => setView('cards')}
              className={`p-2 rounded ${view === 'cards' ? 'bg-[#3E3B6F] text-white' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setView('table')}
              className={`p-2 rounded ${view === 'table' ? 'bg-[#3E3B6F] text-white' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              <TableIcon size={18} />
            </button>
          </div>
          <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50">
            <Filter size={16} /> Filters
          </button>
          <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50">
            <ArrowUpDown size={16} /> SLA
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Total Pending</p>
            <h4 className="text-2xl font-bold text-amber-900">8 Requests</h4>
          </div>
          <Clock className="text-amber-500/50" size={32} />
        </div>
        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-1">Overdue SLA</p>
            <h4 className="text-2xl font-bold text-red-900">2 Critical</h4>
          </div>
          <AlertTriangle className="text-red-500/50" size={32} />
        </div>
        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Approved Today</p>
            <h4 className="text-2xl font-bold text-emerald-900">3 Done</h4>
          </div>
          <CheckCircle2 className="text-emerald-500/50" size={32} />
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="bg-[#3E3B6F] p-4 rounded-2xl flex items-center justify-between animate-in slide-in-from-top-4">
           <div className="flex items-center gap-4 pl-4">
             <span className="text-white text-sm font-bold">{selectedIds.length} items selected</span>
             <button 
               onClick={() => setSelectedIds([])}
               className="text-white/60 text-xs font-bold hover:text-white underline"
             >
               Deselect All
             </button>
           </div>
           <div className="flex gap-3">
             <button className="bg-emerald-500 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-emerald-600 transition-all">
               Approve Selected
             </button>
             <button className="bg-white/10 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-white/20 transition-all border border-white/10">
               Reject Selected
             </button>
           </div>
        </div>
      )}

      {view === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_PENDING.map(req => <RequestCard key={req.id} req={req} />)}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    onChange={(e) => setSelectedIds(e.target.checked ? MOCK_PENDING.map(r => r.id) : [])}
                    className="w-4 h-4 rounded border-gray-300 text-[#3E3B6F] focus:ring-[#3E3B6F]"
                  />
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Employee</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dates</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Duration</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">SLA</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Coverage</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_PENDING.map(req => {
                const sla = getSlaInfo(req.slaHours);
                return (
                  <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(req.id)}
                        onChange={() => toggleSelect(req.id)}
                        className="w-4 h-4 rounded border-gray-300 text-[#3E3B6F] focus:ring-[#3E3B6F]"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent-peach flex items-center justify-center font-bold text-[#3E3B6F] text-[10px]">
                          {req.avatar}
                        </div>
                        <span className="text-sm font-bold text-gray-900">{req.employeeName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{req.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{req.startDate} - {req.endDate}</td>
                    <td className="px-6 py-4 text-sm font-bold text-[#3E3B6F]">{req.days} d</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold ${sla.color} flex items-center gap-1`}>
                        {sla.icon} {sla.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                         <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                           <div className={`h-full ${req.coverage < 60 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${req.coverage}%` }} />
                         </div>
                         <span className="text-[10px] font-bold text-gray-400">{req.coverage}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button className="text-[#3E3B6F] text-xs font-bold hover:underline">Review</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectingRequest && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setRejectingRequest(null)} />
          <div className="relative bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in duration-200">
            <div className="bg-red-500 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Reject Application</h3>
                <p className="text-white/70 text-sm">{rejectingRequest.employeeName} • {rejectingRequest.id}</p>
              </div>
              <button onClick={() => setRejectingRequest(null)} className="p-2 hover:bg-white/10 rounded-full">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Rejection Reason *</label>
                <select className="w-full border-2 border-gray-100 rounded-xl p-3 outline-none focus:border-red-500">
                  <option value="">Select a reason...</option>
                  <option>Critical Project Deadline</option>
                  <option>Insufficient Coverage</option>
                  <option>Policy Violation</option>
                  <option>Other / Personal Discussion</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Comments *</label>
                <textarea 
                  rows={3}
                  className="w-full border-2 border-gray-100 rounded-xl p-3 outline-none focus:border-red-500 resize-none"
                  placeholder="Provide feedback to the employee..."
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg text-gray-400"><Calendar size={18} /></div>
                  <span className="text-sm font-bold text-gray-700">Suggest alternative dates?</span>
                </div>
                <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button 
                  onClick={() => setRejectingRequest(null)}
                  className="flex-1 px-6 py-3 border-2 border-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setRejectingRequest(null)}
                  className="flex-1 px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 shadow-lg shadow-red-500/20"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
