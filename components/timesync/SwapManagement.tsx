import React, { useState, useMemo } from 'react';
import { 
  ArrowRightLeft, 
  Search, 
  Filter, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Check, 
  X, 
  ChevronRight, 
  User, 
  Users, 
  ArrowRight,
  ShieldCheck,
  Info,
  Zap,
  MoreVertical,
  ChevronDown
} from 'lucide-react';

type SwapStatus = 'PENDING_PARTNER' | 'PENDING_MANAGER' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

interface SwapRequest {
  id: string;
  date: string;
  requester: { name: string; avatar: string; shift: string; dept: string };
  target: { name: string; avatar: string; shift: string; dept: string };
  status: SwapStatus;
  coverageImpact: {
    status: 'OPTIMAL' | 'WARNING' | 'CRITICAL';
    label: string;
  };
  reason: string;
}

const MOCK_SWAPS: SwapRequest[] = [
  {
    id: 'SW-9001',
    date: 'Jan 15, 2025',
    requester: { name: 'Sarah Chen', avatar: 'SC', shift: 'Morning (9A-6P)', dept: 'Design' },
    target: { name: 'James Wilson', avatar: 'JW', shift: 'Evening (2P-11P)', dept: 'Design' },
    status: 'PENDING_MANAGER',
    coverageImpact: { status: 'OPTIMAL', label: 'No impact' },
    reason: 'Family medical appointment in the afternoon.'
  },
  {
    id: 'SW-9002',
    date: 'Jan 16, 2025',
    requester: { name: 'Ahmed Khan', avatar: 'AK', shift: 'Morning (9A-6P)', dept: 'Engineering' },
    target: { name: 'Priya Das', avatar: 'PD', shift: 'Night (10P-7A)', dept: 'Engineering' },
    status: 'PENDING_MANAGER',
    coverageImpact: { status: 'WARNING', label: 'Coverage drops 85% → 70%' },
    reason: 'Attending professional workshop.'
  },
  {
    id: 'SW-9003',
    date: 'Jan 18, 2025',
    requester: { name: 'Elena Rodriguez', avatar: 'ER', shift: 'Flexi', dept: 'Operations' },
    target: { name: 'Marcus Low', avatar: 'ML', shift: 'Off Day', dept: 'Operations' },
    status: 'PENDING_PARTNER',
    coverageImpact: { status: 'OPTIMAL', label: 'No impact' },
    reason: 'Personal errand.'
  },
  {
    id: 'SW-9004',
    date: 'Jan 12, 2025',
    requester: { name: 'Michael Chen', avatar: 'MC', shift: 'Night (10P-7A)', dept: 'Engineering' },
    target: { name: 'Sarah Jenkins', avatar: 'SJ', shift: 'Morning (9A-6P)', dept: 'Engineering' },
    status: 'APPROVED',
    coverageImpact: { status: 'OPTIMAL', label: 'No impact' },
    reason: 'Better commute alignment.'
  },
  {
    id: 'SW-9005',
    date: 'Jan 14, 2025',
    requester: { name: 'Amara Okafor', avatar: 'AO', shift: 'Evening (2P-11P)', dept: 'Product' },
    target: { name: 'David Miller', avatar: 'DM', shift: 'Morning (9A-6P)', dept: 'Product' },
    status: 'REJECTED',
    coverageImpact: { status: 'CRITICAL', label: 'Critical gap: Morning' },
    reason: 'Childcare shift.'
  }
];

export const SwapManagement: React.FC<{ userRole?: 'EMPLOYEE' | 'MANAGER' }> = ({ userRole = 'MANAGER' }) => {
  const [activeTab, setActiveTab] = useState<SwapStatus | 'ALL'>('ALL');
  const [selectedSwap, setSelectedSwap] = useState<SwapRequest | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const filteredSwaps = useMemo(() => {
    return MOCK_SWAPS.filter(s => activeTab === 'ALL' || s.status === activeTab);
  }, [activeTab]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <ArrowRightLeft className="text-[#3E3B6F]" size={28} /> Shift Swaps
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Manage inter-employee shift exchanges and coverage continuity</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            <button className="px-4 py-2 text-xs font-bold text-gray-600 flex items-center gap-2 hover:bg-gray-50 rounded-lg">
              <Calendar size={14} /> Jan 2025
            </button>
          </div>
          {userRole === 'EMPLOYEE' && (
            <button 
              onClick={() => setIsRequestModalOpen(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Zap size={18} /> Request Swap
            </button>
          )}
        </div>
      </div>

      {/* TABS */}
      <div className="bg-white border border-gray-200 rounded-2xl p-1 flex items-center gap-1 overflow-x-auto no-scrollbar shadow-sm">
        {[
          { id: 'ALL', label: 'All Requests' },
          { id: 'PENDING_MANAGER', label: 'Manager Pending' },
          { id: 'PENDING_PARTNER', label: 'Awaiting Partner' },
          { id: 'APPROVED', label: 'Approved' },
          { id: 'REJECTED', label: 'Rejected' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
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

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* SWAP LIST */}
        <div className="xl:col-span-3 bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50">
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  <th className="px-8 py-5">Date & ID</th>
                  <th className="px-6 py-5">From (Requester)</th>
                  <th className="px-6 py-4 text-center">Swap</th>
                  <th className="px-6 py-5">To (Target)</th>
                  <th className="px-6 py-5">Impact</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredSwaps.map((swap) => (
                  <tr 
                    key={swap.id} 
                    onClick={() => setSelectedSwap(swap)}
                    className={`group hover:bg-gray-50/80 transition-all cursor-pointer ${selectedSwap?.id === swap.id ? 'bg-[#3E3B6F]/5' : ''}`}
                  >
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-gray-800 tabular-nums">{swap.date}</span>
                        <span className="text-[9px] text-gray-400 font-bold">#{swap.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#3E3B6F]/5 flex items-center justify-center text-[10px] font-black text-[#3E3B6F] border border-[#3E3B6F]/10">
                          {swap.requester.avatar}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-800 truncate">{swap.requester.name}</p>
                          <p className="text-[9px] text-gray-500 font-medium truncate">{swap.requester.shift}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <ArrowRightLeft size={16} className="text-gray-300 mx-auto group-hover:text-[#3E3B6F] transition-colors" />
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-[10px] font-black text-indigo-600 border border-indigo-100">
                          {swap.target.avatar}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-800 truncate">{swap.target.name}</p>
                          <p className="text-[9px] text-gray-500 font-medium truncate">{swap.target.shift}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-tighter ${
                        swap.coverageImpact.status === 'OPTIMAL' ? 'bg-green-50 text-green-600 border-green-100' :
                        swap.coverageImpact.status === 'WARNING' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                        'bg-red-50 text-red-600 border-red-100'
                      }`}>
                        {swap.coverageImpact.status !== 'OPTIMAL' && <AlertTriangle size={10} />}
                        {swap.coverageImpact.label}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-[9px] font-black uppercase tracking-widest ${
                        swap.status.includes('PENDING') ? 'text-orange-500' :
                        swap.status === 'APPROVED' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {swap.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                       <button className="p-2 text-gray-400 hover:text-[#3E3B6F] transition-all"><ChevronRight size={18}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* DETAIL SIDEBAR */}
        <div className="space-y-6">
          {selectedSwap ? (
            <div className="bg-white rounded-3xl border border-gray-200 shadow-md overflow-hidden animate-in slide-in-from-right-4 duration-500 flex flex-col">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center shrink-0">
                <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck size={18} className="text-green-500" /> Swap Verification
                </h3>
                <button onClick={() => setSelectedSwap(null)} className="p-1 hover:bg-gray-200 rounded-full text-gray-400 transition-all"><X size={16}/></button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-8">
                {/* SCHEDULE COMPARE */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Shift Reassignment</h4>
                    <span className="text-[10px] font-bold text-indigo-600">{selectedSwap.date}</span>
                  </div>
                  
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded bg-[#3E3B6F] text-white flex items-center justify-center text-[8px] font-black">{selectedSwap.requester.avatar}</div>
                         <span className="text-xs font-bold text-gray-700">{selectedSwap.requester.name}</span>
                      </div>
                      <ArrowRight size={14} className="text-gray-300" />
                      <span className="text-[10px] font-black text-indigo-600 uppercase">{selectedSwap.target.shift}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded bg-indigo-500 text-white flex items-center justify-center text-[8px] font-black">{selectedSwap.target.avatar}</div>
                         <span className="text-xs font-bold text-gray-700">{selectedSwap.target.name}</span>
                      </div>
                      <ArrowRight size={14} className="text-gray-300" />
                      <span className="text-[10px] font-black text-indigo-600 uppercase">{selectedSwap.requester.shift}</span>
                    </div>
                  </div>
                </div>

                {/* COVERAGE ANALYSIS */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Users size={14} /> Department Coverage Analysis
                  </h4>
                  <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-4">
                     <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500 font-bold">Dept: {selectedSwap.requester.dept}</span>
                        <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${selectedSwap.coverageImpact.status === 'OPTIMAL' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                           {selectedSwap.coverageImpact.status}
                        </div>
                     </div>
                     <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
                           <span>9 AM - 6 PM Block</span>
                           <span>{selectedSwap.coverageImpact.status === 'OPTIMAL' ? '85% Covered' : '70% Covered'}</span>
                        </div>
                        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                           <div 
                            className={`h-full transition-all ${selectedSwap.coverageImpact.status === 'OPTIMAL' ? 'bg-green-500 w-[85%]' : 'bg-orange-500 w-[70%]'}`} 
                           />
                        </div>
                     </div>
                  </div>
                </div>

                {/* REASON */}
                <div className="space-y-3">
                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Clock size={14} /> Requester Reason
                   </h4>
                   <p className="text-xs text-gray-600 italic leading-relaxed border-l-2 border-[#3E3B6F]/20 pl-4 py-1">
                      "{selectedSwap.reason}"
                   </p>
                </div>

                {/* VALIDATIONS */}
                <div className="space-y-3">
                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Compliance Checks</h4>
                   <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
                         <span className="text-[10px] font-bold text-green-700">Both parties agreed via App</span>
                         <CheckCircle2 size={14} className="text-green-500" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
                         <span className="text-[10px] font-bold text-green-700">Equivalent skills confirmed</span>
                         <ShieldCheck size={14} className="text-green-500" />
                      </div>
                      <div className={`flex items-center justify-between p-3 rounded-xl border ${selectedSwap.coverageImpact.status === 'OPTIMAL' ? 'bg-green-50 border-green-100' : 'bg-orange-50 border-orange-100'}`}>
                         <span className={`text-[10px] font-bold ${selectedSwap.coverageImpact.status === 'OPTIMAL' ? 'text-green-700' : 'text-orange-700'}`}>Coverage threshold maintained</span>
                         {selectedSwap.coverageImpact.status === 'OPTIMAL' ? <CheckCircle2 size={14} className="text-green-500" /> : <AlertTriangle size={14} className="text-orange-500" />}
                      </div>
                   </div>
                </div>
              </div>

              {/* ACTIONS */}
              {userRole === 'MANAGER' && selectedSwap.status === 'PENDING_MANAGER' && (
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3 shrink-0">
                  <button className="flex-[2] py-3 bg-green-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-green-900/10 hover:scale-[1.02] active:scale-95 transition-all">
                    Approve Swap
                  </button>
                  <button className="flex-1 py-3 bg-white border border-red-100 text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-50 transition-all">
                    Reject
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full bg-white rounded-3xl border border-gray-200 p-12 text-center flex flex-col items-center justify-center space-y-6 opacity-40">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                <ArrowRightLeft size={40} className="text-gray-300" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-black text-gray-800 uppercase tracking-widest">Swap Inspector</h4>
                <p className="text-xs font-medium text-gray-500 max-w-[200px]">Select a request from the table to analyze impact and verify compliance.</p>
              </div>
            </div>
          )}

          {/* POLICY NOTE */}
          <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-3xl flex gap-4 shadow-sm">
            <div className="bg-white p-2.5 rounded-xl shadow-sm h-fit shrink-0">
               <Info className="text-indigo-600" size={20} />
            </div>
            <div className="flex-1">
               <p className="text-[10px] font-black text-indigo-700 uppercase tracking-widest mb-1">Company Rule</p>
               <p className="text-[10px] text-indigo-600/80 leading-relaxed font-medium">
                 Shift swaps must be initiated <span className="font-bold">24 hours prior</span> to the earliest shift involved. Manual overrides require Dept Head signature.
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* REQUEST MODAL */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsRequestModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center text-white shadow-lg">
                    <ArrowRightLeft size={20} />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-gray-800">Request Shift Swap</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Find a partner and exchange shifts</p>
                 </div>
              </div>
              <button onClick={() => setIsRequestModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400"><X size={24}/></button>
            </div>

            <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">My Shift Date *</label>
                    <input type="date" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none" defaultValue="2025-01-20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Find Partner (Available Colleagues)</label>
                    <div className="relative">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                       <select className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none">
                          <option>Select a colleague...</option>
                          <option>James Wilson (Evening Shift)</option>
                          <option>Fatima Ali (Morning Shift)</option>
                          <option>Marcus Low (Off Day)</option>
                       </select>
                    </div>
                  </div>
               </div>

               <div className="p-6 bg-indigo-50/50 border border-indigo-100 rounded-3xl">
                  <h4 className="text-[10px] font-black text-indigo-700 uppercase tracking-widest mb-4">Proposed Exchange</h4>
                  <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-indigo-50">
                     <div className="text-center">
                        <p className="text-[9px] font-black text-gray-400 uppercase mb-1">You give</p>
                        <p className="text-xs font-black text-[#3E3B6F]">Morning Shift</p>
                     </div>
                     <ArrowRightLeft size={20} className="text-indigo-400" />
                     <div className="text-center">
                        <p className="text-[9px] font-black text-gray-400 uppercase mb-1">You get</p>
                        <p className="text-xs font-black text-[#3E3B6F]">Evening Shift</p>
                     </div>
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reason for Swap *</label>
                  <textarea 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none min-h-[100px]"
                    placeholder="Briefly explain the reason for the swap..."
                  />
               </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4 shrink-0">
               <button onClick={() => setIsRequestModalOpen(false)} className="flex-1 py-4 bg-white border border-gray-200 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">
                 Cancel
               </button>
               <button className="flex-[2] py-4 bg-[#3E3B6F] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                 Send Swap Proposal <ArrowRight size={16} />
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};