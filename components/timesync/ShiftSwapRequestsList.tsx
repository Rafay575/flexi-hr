
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  ArrowRightLeft, 
  Clock, 
  AlertTriangle, 
  Check, 
  X, 
  ChevronRight, 
  User, 
  ShieldCheck, 
  Info,
  Calendar,
  Users,
  ExternalLink
} from 'lucide-react';

type SwapStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

interface ShiftSwapRequest {
  id: string;
  requester: { name: string; avatar: string; shift: string };
  target: { name: string; avatar: string; shift: string };
  date: string;
  reason: string;
  status: SwapStatus;
  validations: {
    noSkillGap: boolean;
    bothAgreed: boolean;
    noCoverageIssue: boolean;
  };
}

const MOCK_SWAPS: ShiftSwapRequest[] = [
  {
    id: 'SWP-5001',
    requester: { name: 'Sarah Chen', avatar: 'SC', shift: 'Morning (9A-6P)' },
    target: { name: 'James Wilson', avatar: 'JW', shift: 'Evening (2P-11P)' },
    date: 'Jan 15, 2025',
    reason: 'Family medical appointment in the afternoon.',
    status: 'PENDING',
    validations: { noSkillGap: true, bothAgreed: true, noCoverageIssue: true }
  },
  {
    id: 'SWP-5002',
    requester: { name: 'Ahmed Khan', avatar: 'AK', shift: 'Morning (9A-6P)' },
    target: { name: 'Priya Das', avatar: 'PD', shift: 'Night (10P-7A)' },
    date: 'Jan 16, 2025',
    reason: 'Attending a workshop.',
    status: 'PENDING',
    validations: { noSkillGap: true, bothAgreed: true, noCoverageIssue: false }
  },
  {
    id: 'SWP-5003',
    requester: { name: 'Elena Frost', avatar: 'EF', shift: 'General (10A-7P)' },
    target: { name: 'Marcus Low', avatar: 'ML', shift: 'Morning (9A-6P)' },
    date: 'Jan 18, 2025',
    reason: 'Personal errand.',
    status: 'PENDING',
    validations: { noSkillGap: true, bothAgreed: true, noCoverageIssue: true }
  },
  {
    id: 'SWP-5004',
    requester: { name: 'Tom Hardy', avatar: 'TH', shift: 'Morning (9A-6P)' },
    target: { name: 'Lisa Ray', avatar: 'LR', shift: 'Weekly Off' },
    date: 'Jan 20, 2025',
    reason: 'Replacing weekend shift for sibling wedding.',
    status: 'PENDING',
    validations: { noSkillGap: true, bothAgreed: false, noCoverageIssue: true }
  },
];

export const ShiftSwapRequestsList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SwapStatus | 'ALL'>('PENDING');
  const [items, setItems] = useState(MOCK_SWAPS);

  const filteredItems = useMemo(() => {
    return activeTab === 'ALL' ? items : items.filter(i => i.status === activeTab);
  }, [items, activeTab]);

  const handleAction = (id: string, status: SwapStatus) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-hidden">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Shift Swap Requests</h2>
          <p className="text-sm text-gray-500 font-medium">Manage and audit inter-team shift exchanges</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2">
            <Calendar size={16} className="text-gray-400" />
            <span className="text-xs font-bold text-gray-700 tabular-nums">Jan 2025</span>
          </div>
          <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-2xl p-1 mb-6 shadow-sm shrink-0">
        {(['PENDING', 'APPROVED', 'REJECTED', 'ALL'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === tab
                ? 'bg-[#3E3B6F] text-white shadow-lg' 
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
            <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black ${
              activeTab === tab ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              {tab === 'ALL' ? items.length : items.filter(i => i.status === tab).length}
            </span>
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="flex-1 bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col relative">
        <div className="overflow-auto custom-scrollbar flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-20 bg-gray-50/90 backdrop-blur-md border-b border-gray-100">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-4">Request Swap</th>
                <th className="px-6 py-4 text-center">Effective Date</th>
                <th className="px-6 py-4">Impacted Shifts</th>
                <th className="px-6 py-4">Validation</th>
                <th className="px-6 py-4">Reason</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredItems.map((item) => (
                <tr key={item.id} className="group hover:bg-gray-50/80 transition-all">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-primary-gradient border-2 border-white flex items-center justify-center text-white text-[10px] font-black shadow-md z-10" title={item.requester.name}>
                          {item.requester.avatar}
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-purple-500 border-2 border-white flex items-center justify-center text-white text-[10px] font-black shadow-md" title={item.target.name}>
                          {item.target.avatar}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-xs font-bold text-gray-800 flex items-center gap-2">
                          {item.requester.name.split(' ')[0]} <ArrowRightLeft size={10} className="text-[#3E3B6F]" /> {item.target.name.split(' ')[0]}
                        </p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{item.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-[11px] font-bold text-gray-500 tabular-nums">{item.date}</td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600">
                        <span className="w-12 text-gray-400 uppercase">From:</span> {item.requester.shift}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-purple-600">
                        <span className="w-12 text-gray-400 uppercase">Swap To:</span> {item.target.shift}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      <div className={`p-1.5 rounded-lg border flex items-center justify-center ${item.validations.noSkillGap ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`} title="Skill Match">
                        <ShieldCheck size={14} />
                      </div>
                      <div className={`p-1.5 rounded-lg border flex items-center justify-center ${item.validations.bothAgreed ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`} title="Mutual Agreement">
                        <Users size={14} />
                      </div>
                      <div className={`p-1.5 rounded-lg border flex items-center justify-center ${item.validations.noCoverageIssue ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`} title="Department Coverage">
                        <Clock size={14} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <p className="text-[11px] text-gray-500 italic font-medium truncate group-hover:whitespace-normal group-hover:line-clamp-2 transition-all">
                      "{item.reason}"
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {item.status === 'PENDING' ? (
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                          onClick={() => handleAction(item.id, 'APPROVED')}
                          className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-500 hover:text-white transition-all shadow-sm"
                        >
                          <Check size={14} />
                        </button>
                        <button 
                          onClick={() => handleAction(item.id, 'REJECTED')}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        >
                          <X size={14} />
                        </button>
                        <button className="p-2 bg-white border border-gray-200 text-gray-400 rounded-lg hover:text-[#3E3B6F] hover:border-[#3E3B6F] transition-all">
                          <ExternalLink size={14} />
                        </button>
                      </div>
                    ) : (
                      <span className={`text-[10px] font-black uppercase tracking-widest ${item.status === 'APPROVED' ? 'text-green-500' : 'text-red-500'}`}>
                        {item.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredItems.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center p-20 text-center opacity-30">
              <ArrowRightLeft size={64} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-black uppercase tracking-widest text-gray-500">No Swap Requests</h3>
              <p className="text-sm font-medium mt-2">Team coverage is currently stable.</p>
            </div>
          )}
        </div>
        
        {/* FOOTER */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-green-500"></div>
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Valid</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-orange-500"></div>
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Awaiting Consent</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-red-500"></div>
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Policy Violation</span>
             </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#3E3B6F]/5 border border-[#3E3B6F]/10 rounded-xl text-xs font-bold text-[#3E3B6F] hover:bg-[#3E3B6F]/10 transition-all">
             Audit Shift History
          </button>
        </div>
      </div>
    </div>
  );
};
